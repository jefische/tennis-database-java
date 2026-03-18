import json
import subprocess
import sys


def get_playlist_urls(playlist_url: str) -> list[str]:
    """Extract all video URLs from a YouTube playlist using yt-dlp."""
    result = subprocess.run(
        ["yt-dlp", "--flat-playlist", "--print", "url", playlist_url],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(f"Error: {result.stderr}", file=sys.stderr)
        return []
    return [url for url in result.stdout.strip().split("\n") if url]


def get_playlist_youtube_ids(playlist_url: str) -> list[str]:
    """Extract all video IDs from a YouTube playlist using yt-dlp."""
    result = subprocess.run(
        ["yt-dlp", "--flat-playlist", "--print", "id", playlist_url],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(f"Error: {result.stderr}", file=sys.stderr)
        return []
    return [vid for vid in result.stdout.strip().split("\n") if vid]


def get_playlist_videos(playlist_url: str) -> list[dict]:
    """Extract video IDs and titles from a YouTube playlist using yt-dlp."""
    result = subprocess.run(
        ["yt-dlp", "--flat-playlist", "--print", "%(id)s\t%(title)s", playlist_url],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(f"Error: {result.stderr}", file=sys.stderr)
        return []
    videos = []
    for line in result.stdout.strip().split("\n"):
        if line and "\t" in line:
            vid_id, title = line.split("\t", 1)
            videos.append({"id": vid_id, "title": title})
    return videos


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python youtubeUrls.py <playlist_url>")
        sys.exit(1)

    playlist_url = sys.argv[1]
    videos = get_playlist_videos(playlist_url)
    print(f"Found {len(videos)} videos")

    output_file = "youtube_ids.json"
    with open(output_file, "w") as f:
        json.dump(videos, f, indent=2)
    print(f"Saved to {output_file}")
