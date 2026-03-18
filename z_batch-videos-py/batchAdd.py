import json
import re
import sys
import time
import requests

BASE_URL = "http://localhost:8080"
API_URL = f"{BASE_URL}/videos/add"
SUMMARY_URL = f"{BASE_URL}/api/summary"
VIDEO_URL = f"{BASE_URL}/videos"


def normalize_title(title: str) -> str:
    """Normalize title to handle edge cases before parsing."""
    # Fix 'vs.' with no trailing space (e.g. 'Ruud vs.Fritz')
    title = re.sub(r"vs\.(\S)", r"vs. \1", title)
    # Handle multiple ' | ' separators
    # e.g. 'Player vs. Player Full Match | Radio Commentary | 2024 US Open Final'
    # Keep the first segment (players) and the segment starting with a year
    parts = title.split(" | ")
    if len(parts) > 2:
        player_seg = None
        tournament_seg = None
        for i, part in enumerate(parts):
            if re.match(r"\d{4}\s", part.strip()):
                tournament_seg = part.strip()
                if player_seg is None:
                    player_seg = " | ".join(parts[:i])
                break
            elif "vs" in part:
                player_seg = part
        if player_seg and tournament_seg:
            title = f"{player_seg} | {tournament_seg}"
    # Handle prefix text before player names (e.g. 'Longest Match! | Player vs. Player...')
    # If the first segment doesn't contain 'vs', drop it
    parts = title.split(" | ", 1)
    if len(parts) == 2 and "vs" not in parts[0] and "vs" in parts[1]:
        title = parts[1]
    return title


def parse_title(title: str) -> dict:
    """Parse a YouTube video title into video fields.

    Expected format: 'Player1 vs. Player2 Full Match | Year Tournament Round'
    """
    title_normalized = normalize_title(title)

    # Split on ' | ' to separate players from tournament info
    parts = title_normalized.split(" | ", 1)
    if len(parts) != 2:
        return None

    players_part = parts[0]
    tournament_part = parts[1]

    # Extract players: split on 'vs.' or 'vs' or 'v' (doubles)
    player_match = re.split(r"\s+vs?\.?\s+", players_part, maxsplit=1)
    if len(player_match) != 2:
        return None

    player1 = player_match[0].strip()
    # Remove 'Full Match' and anything after from player2
    player2 = re.sub(r"\s+Full Match.*", "", player_match[1]).strip()
    # Replace '/' with ' / ' for doubles formatting consistency
    player1 = re.sub(r"(\w)/(\w)", r"\1 / \2", player1)
    player2 = re.sub(r"(\w)/(\w)", r"\1 / \2", player2)

    # Parse tournament info: 'Year Tournament Round'
    # Remove parenthetical notes like '(Radio Commentary)'
    tournament_clean = re.sub(r"\s*\(.*?\)", "", tournament_part).strip()

    # Extract year (4-digit number)
    year_match = re.match(r"(\d{4})\s+(.*)", tournament_clean)
    if not year_match:
        return None

    year = int(year_match.group(1))
    rest = year_match.group(2).strip()

    # Known round names to look for at the end
    round_patterns = [
        "Round 1", "Round 2", "Round 3", "Round 4",
        "Quarterfinal", "Semifinal", "Final",
    ]

    round_name = None
    tournament = rest
    for rp in round_patterns:
        if rest.endswith(rp):
            round_name = rp
            tournament = rest[: -len(rp)].strip()
            break

    return {
        "player1": player1,
        "player2": player2,
        "year": year,
        "tournament": tournament,
        "round": round_name,
        "title": title,
    }


def generate_summary(youtube_id: str) -> bool:
    """Call the summary API for a video. Returns True if summary was generated."""
    try:
        resp = requests.post(f"{SUMMARY_URL}/{youtube_id}", timeout=120)
        if resp.status_code == 200:
            return True
        else:
            print(f"    SUMMARY ERROR ({resp.status_code}): {youtube_id}")
            return False
    except requests.RequestException as e:
        print(f"    SUMMARY ERROR: {e}")
        return False


def has_summary(youtube_id: str) -> bool:
    """Check if a video already has a summary in the database."""
    try:
        resp = requests.get(f"{VIDEO_URL}/{youtube_id}")
        if resp.status_code == 200:
            video = resp.json()
            return video.get("summary") is not None
    except requests.RequestException:
        pass
    return False


def batch_add(json_file: str, dry_run: bool = False, with_summaries: bool = False):
    """Read youtube_ids.json and POST each video to the API."""
    with open(json_file, "r") as f:
        videos = json.load(f)

    print(f"Processing {len(videos)} videos...\n")

    success = 0
    skipped = 0
    failed = 0
    summaries_generated = 0
    summaries_skipped = 0

    for video in videos:
        youtube_id = video["id"]
        title = video["title"]
        parsed = parse_title(title)

        if not parsed:
            print(f"  SKIP (unparseable): {title}")
            skipped += 1
            continue

        payload = {
            "youtubeId": youtube_id,
            "title": parsed["title"],
            "player1": parsed["player1"],
            "player2": parsed["player2"],
            "year": parsed["year"],
            "tournament": parsed["tournament"],
            "round": parsed["round"],
        }

        if dry_run:
            print(f"  DRY RUN: {parsed['player1']} vs {parsed['player2']} | {parsed['year']} {parsed['tournament']} {parsed['round'] or '(no round)'}")
            success += 1
            continue

        try:
            resp = requests.post(API_URL, json=payload)
            if resp.status_code == 200:
                print(f"  ADDED: {parsed['player1']} vs {parsed['player2']} | {parsed['year']} {parsed['tournament']} {parsed['round'] or ''}")
                success += 1
            elif resp.status_code == 409:
                print(f"  EXISTS: {youtube_id} - {title}")
                skipped += 1
            else:
                print(f"  ERROR ({resp.status_code}): {title}")
                failed += 1
                continue
        except requests.RequestException as e:
            print(f"  ERROR: {e}")
            failed += 1
            continue

        # Generate summary if requested
        if with_summaries:
            if has_summary(youtube_id):
                print(f"    SUMMARY EXISTS: {youtube_id}")
                summaries_skipped += 1
            else:
                print(f"    GENERATING SUMMARY: {youtube_id}...")
                if generate_summary(youtube_id):
                    print(f"    SUMMARY DONE: {youtube_id}")
                    summaries_generated += 1
                print(f"    Waiting 30s before next request...")
                time.sleep(30)

    print(f"\nDone! Added: {success}, Skipped: {skipped}, Failed: {failed}")
    if with_summaries:
        print(f"Summaries generated: {summaries_generated}, Summaries skipped: {summaries_skipped}")


if __name__ == "__main__":
    json_file = "youtube_ids.json"
    dry_run = "--dry-run" in sys.argv
    with_summaries = "--with-summaries" in sys.argv

    if dry_run:
        print("=== DRY RUN MODE (no API calls) ===\n")

    batch_add(json_file, dry_run=dry_run, with_summaries=with_summaries)
