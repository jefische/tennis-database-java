import sys
import time
import requests

BASE_URL = "http://localhost:8080"
SUMMARY_URL = f"{BASE_URL}/api/summary"
VIDEO_URL = f"{BASE_URL}/videos"

NO_TRANSCRIPT_MSG = "No transcript available for this video"


def needs_summary(video: dict) -> bool:
    """Check if a video needs a summary generated."""
    summary = video.get("summary")
    return summary is None or summary.strip() == "" or summary.strip() == NO_TRANSCRIPT_MSG


def generate_summary(youtube_id: str) -> bool:
    """Call the summary API for a video. Returns True if summary was generated."""
    try:
        resp = requests.post(f"{SUMMARY_URL}/{youtube_id}", timeout=120)
        if resp.status_code == 200:
            return True
        else:
            print(f"  SUMMARY ERROR ({resp.status_code}): {youtube_id}")
            return False
    except requests.RequestException as e:
        print(f"  SUMMARY ERROR: {e}")
        return False


def get_all_videos() -> list[dict]:
    """Fetch all videos from the API."""
    resp = requests.get(VIDEO_URL)
    resp.raise_for_status()
    return resp.json()


if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv

    # Parse --min-id=N and --max-id=N options
    min_id = None
    max_id = None
    for arg in sys.argv:
        if arg.startswith("--min-id="):
            min_id = int(arg.split("=", 1)[1])
        elif arg.startswith("--max-id="):
            max_id = int(arg.split("=", 1)[1])

    if dry_run:
        print("=== DRY RUN MODE (no API calls) ===\n")

    videos = get_all_videos()
    print(f"Found {len(videos)} total videos\n")

    if min_id is not None:
        videos = [v for v in videos if v.get("videoId", 0) >= min_id]
        print(f"Filtered to {len(videos)} videos with videoId >= {min_id}")
    if max_id is not None:
        videos = [v for v in videos if v.get("videoId", 0) <= max_id]
        print(f"Filtered to {len(videos)} videos with videoId <= {max_id}")
    if min_id is not None or max_id is not None:
        print()

    to_process = [v for v in videos if needs_summary(v)]
    print(f"{len(to_process)} videos need summaries\n")

    generated = 0
    failed = 0

    for i, video in enumerate(to_process):
        youtube_id = video.get("youtubeId")
        title = video.get("title", youtube_id)
        summary = video.get("summary")
        reason = "empty/null" if not summary or summary.strip() == "" else "no transcript"

        if dry_run:
            print(f"  [{i+1}/{len(to_process)}] WOULD GENERATE ({reason}): {title}")
            continue

        print(f"  [{i+1}/{len(to_process)}] GENERATING ({reason}): {title}...")
        if generate_summary(youtube_id):
            print(f"  DONE: {youtube_id}")
            generated += 1
        else:
            failed += 1

        if i < len(to_process) - 1:
            print(f"  Waiting 15s...")
            time.sleep(15)

    print(f"\nDone! Generated: {generated}, Failed: {failed}, Total needed: {len(to_process)}")


# cd z_batch-videos-py

# Preview which videos need summaries:
# python batchSummary.py --dry-run

# Run for real:
# python batchSummary.py

# Only process videos with videoId >= 100:
# python batchSummary.py --min-id=100


# python batchSummary.py --max-id=50

# Seems like 18 videos is the limit before my ip address is blocked
# Only process videos with 20 <= videoId <= 80:
# python batchSummary.py --min-id=20 --max-id=80

# Combine with dry run
# python batchSummary.py --dry-run --min-id=100
