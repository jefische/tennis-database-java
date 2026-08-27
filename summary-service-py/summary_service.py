import os
import time
from youtube_transcript_api import YouTubeTranscriptApi
from langchain_community.document_loaders import YoutubeLoader
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
import re

# Create the model using Google Gemini
model = ChatGoogleGenerativeAI(
    # model="gemini-3.1-pro-preview",
    model="gemini-2.5-flash",
    temperature=0,
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

def extract_video_id(url_or_id: str) -> str:
    """Extract video ID from various YouTube URL formats."""
    # If it's already just an ID (11 characters)
    if re.match(r'^[\w-]{11}$', url_or_id):
        return url_or_id

    # Try various URL patterns
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)',
        r'v=([^&]+)',
    ]

    for pattern in patterns:
        match = re.search(pattern, url_or_id)
        if match:
            return match.group(1)

    raise ValueError(f"Could not extract video ID from: {url_or_id}")

ytt_api = YouTubeTranscriptApi()

# YouTube's timedtext endpoint returns intermittent 5xx errors even when a
# transcript exists and the request is properly signed. Retry those.
TRANSIENT_MARKERS = ("502", "503", "504", "Bad Gateway", "timed out", "Connection")


class TranscriptUnavailable(Exception):
    """The video genuinely has no transcript. A permanent fact worth recording."""


class TranscriptFetchFailed(Exception):
    """Upstream YouTube failure that retries did not resolve. Try again later."""


def _is_transient(err: Exception) -> bool:
    return any(marker in str(err) for marker in TRANSIENT_MARKERS)


def _fetch_once(video_id: str):
    """Single fetch attempt: English first, then any available language."""
    try:
        return ytt_api.fetch(video_id, languages=['en'])
    except Exception as e:
        if _is_transient(e):
            raise
        print(f"[TRANSCRIPT] English transcript failed: {e}")
        print(f"[TRANSCRIPT] Trying any available language...")
        return ytt_api.fetch(video_id)


def fetch_transcript(video_id: str, attempts: int = 3) -> str:
    """Fetch transcript from YouTube, retrying transient upstream failures."""
    print(f"[TRANSCRIPT] Attempting to fetch transcript for video: {video_id}")
    for attempt in range(1, attempts + 1):
        try:
            transcript = _fetch_once(video_id)
            print(f"[TRANSCRIPT] Transcript found ({len(transcript)} entries) on attempt {attempt}")
            return ' '.join([entry.text for entry in transcript])
        except Exception as e:
            if _is_transient(e) and attempt < attempts:
                delay = 2 ** attempt  # 2s, 4s
                print(f"[TRANSCRIPT] Transient error on attempt {attempt}, retrying in {delay}s: {e}")
                time.sleep(delay)
                continue
            print(f"[TRANSCRIPT] All attempts failed: {e}")
            if _is_transient(e):
                raise TranscriptFetchFailed(str(e)) from e
            raise TranscriptUnavailable(str(e)) from e

# Apply the youtubeapi directly with custom functions above
def generate_match_summary_yt_api(youtube_url: str) -> str:
    """
    Generates a tennis match summary from a YouTube video transcript.

    Args:
        youtube_url: Full YouTube URL or video ID

    Returns:
        The generated match summary
    """
    # Extract video ID and fetch transcript
    video_id = extract_video_id(youtube_url)
    video_transcript = fetch_transcript(video_id)

    # Create the system message with the transcript
    system_message = f"""You are a professional tennis analyst specializing in match analysis and commentary.

        Your task: Analyze the provided tennis match transcript and create a structured summary.

        TRANSCRIPT:
        {video_transcript}

        OUTPUT REQUIREMENTS:
        Return a JSON object with the following fields:
        - "winner": Name of the winning player
        - "score": Final match score (e.g. "6-4, 3-6, 7-6")
        - "matchRating": Integer 1-10 rating of how exciting/competitive the match was
        - "overview": 4-5 sentence match overview covering the final score and significance (50 words max)
        - "highlights": Array of 3-5 key moments or standout performances as short strings
        - "tags": Array of 2-4 descriptive tags (e.g. "Five-setter", "Upset", "Rivalry", "Comeback")

        FORMAT:
        - Return ONLY valid JSON, no markdown code fences, no extra text.
        - Use markdown ** for bolding within the "overview" string only.
        - Always bold the score in the overview.

        EXAMPLE OUTPUT:
        {{
            "winner": "Roger Federer",
            "score": "6-4, 3-6, 7-6(5)",
            "matchRating": 4.6,
            "overview": "Roger Federer edged Rafael Nadal 6-4, 3-6, 7-6(5) in a tightly contested semifinal at the 2024 Australian Open. Federer controlled the opening set with precise serving before Nadal stormed back to level the match. The decider went to a tiebreak where Federer's nerves of steel proved decisive. He won five of the last six points to seal the victory. This was their 41st career meeting and one of their most dramatic encounters.",
            "highlights": [
                "Federer saved 3 break points in the opening set",
                "Nadal's forehand winner streak in the second set",
                "Third-set tiebreak: Federer won 5 of the last 6 points"
            ],
            "tags": ["Three-setter", "Rivalry", "Tiebreak"]
        }}

        TONE: Professional but engaging, suitable for tennis fans."""

    # Create the chat template
    chat_template = ChatPromptTemplate.from_messages([
        ("system", system_message),
        ("human", "Please provide a match summary based on the transcript."),
    ])

    # Generate the summary
    chain = chat_template | model
    response = chain.invoke({})

    return response.content

# Apply the langchain community youtubeloader package which uses youtubeapi internally
def generate_match_summary(youtube_url: str, video_info: dict = None) -> str:
    print(f"[SUMMARY] Starting summary generation for: {youtube_url}")
    video_id = extract_video_id(youtube_url)
    print(f"[SUMMARY] Extracted video ID: {video_id}")

    try:
        print(f"[SUMMARY] Step 1: Trying fetch_transcript...")
        transcript = fetch_transcript(video_id)
        print(f"[SUMMARY] Transcript fetched ({len(transcript)} chars)")
    except Exception as e:
        print(f"[SUMMARY] fetch_transcript failed: {e}")
        # Fallback to YoutubeLoader which may find other transcript types
        try:
            print(f"[SUMMARY] Step 2: Trying YoutubeLoader fallback...")
            loader = YoutubeLoader.from_youtube_url(
                youtube_url, add_video_info=False
            )
            docs = loader.load()
            if not docs:
                print(f"[SUMMARY] YoutubeLoader returned empty docs")
                raise TranscriptUnavailable("No transcript available for this video")
            transcript = docs[0].page_content
            print(f"[SUMMARY] YoutubeLoader transcript fetched ({len(transcript)} chars)")
        except Exception as e2:
            print(f"[SUMMARY] YoutubeLoader also failed: {e2}")
            # A transient upstream failure must stay distinguishable from a video
            # that truly has no transcript: only the latter is a durable fact.
            if isinstance(e, TranscriptFetchFailed) or _is_transient(e2):
                raise TranscriptFetchFailed(str(e)) from e
            raise TranscriptUnavailable("No transcript available for this video") from e

    # Build canonical details section if video_info is provided
    canonical_details = ""
    if video_info:
        details = []
        if video_info.get("player1") and video_info.get("player2"):
            details.append(f"Players: {video_info['player1']} vs {video_info['player2']}")
        if video_info.get("tournament"):
            details.append(f"Tournament: {video_info['tournament']}")
        if video_info.get("year"):
            details.append(f"Year: {video_info['year']}")
        if video_info.get("round"):
            details.append(f"Round: {video_info['round']}")

        if details:
            canonical_details = f"""
        CANONICAL MATCH DETAILS (use these exact spellings for names and details):
        {chr(10).join('        - ' + d for d in details)}

        IMPORTANT: If the transcript contains spelling variations or errors for player names,
        tournament names, or other details listed above, use the CANONICAL spellings provided."""

    # Create the system message with the transcript
    system_message = f"""You are a professional tennis analyst specializing in match analysis and commentary.

        Your task: Analyze the provided tennis match transcript and create a structured summary.
        {canonical_details}

        TRANSCRIPT:
        {transcript}

        OUTPUT REQUIREMENTS:
        Return a JSON object with the following fields:
        - "winner": Name of the winning player
        - "score": Final match score (e.g. "6-4, 3-6, 7-6")
        - "matchRating": Decimal 0-5 star rating of how exciting/competitive the match was. Always use one decimal point (e.g 1.5, 3.7, 4.5, etc..)
        - "overview": 4-5 sentence match overview covering the final score and significance (50 words max)
        - "highlights": Array of 3-5 key moments or standout performances as short strings
        - "tags": Array of 2-4 descriptive tags (e.g. "Five-setter", "Upset", "Rivalry", "Comeback")

        FORMAT:
        - Return ONLY valid JSON, NO markdown code fences, NO extra text.

        EXAMPLE OUTPUT:
        {{
            "winner": "Roger Federer",
            "score": "6-4, 3-6, 7-6(5)",
            "matchRating": 4.5,
            "overview": "Roger Federer edged Rafael Nadal 6-4, 3-6, 7-6(5) in a tightly contested semifinal at the 2024 Australian Open. Federer controlled the opening set with precise serving before Nadal stormed back to level the match. The decider went to a tiebreak where Federer's nerves of steel proved decisive. He won five of the last six points to seal the victory. This was their 41st career meeting and one of their most dramatic encounters.",
            "highlights": [
                "Federer saved 3 break points in the opening set",
                "Nadal's forehand winner streak in the second set",
                "Third-set tiebreak: Federer won 5 of the last 6 points"
            ],
            "tags": ["Three-setter", "Rivalry", "Tiebreak"]
        }}

        TONE: Professional but engaging, suitable for tennis fans."""

    # Invoke model directly (no template variables needed, avoids brace escaping issues)
    result = model.invoke([
        ("system", system_message),
        ("human", "Please provide a match summary based on the transcript."),
    ])

    # # ChatPromptTemplate approach (has brace escaping issues with JSON examples)
    # chat_template = ChatPromptTemplate.from_messages([
    #     ("system", system_message),
    #     ("human", "Please provide a match summary based on the transcript."),
    # ])
    # chain = chat_template | model
    # result = chain.invoke({})

    # Strip markdown code fences if the LLM includes them despite instructions
    print(f"[SUMMARY] Result type: {type(result)}")
    print(f"[SUMMARY] Result content type: {type(result.content)}")
    print(f"[SUMMARY] Result content repr: {repr(result.content[:200]) if result.content else 'EMPTY'}")
    content = result.content.strip()
    print(f"[SUMMARY] Raw LLM response ({len(content)} chars): {content[:500]}")
    content = re.sub(r'^```json\s*', '', content)
    content = re.sub(r'\s*```$', '', content)

    # Validate JSON before returning
    import json
    try:
        json.loads(content)
        print(f"[SUMMARY] Valid JSON response ({len(content)} chars)")
    except json.JSONDecodeError as e:
        print(f"[SUMMARY] WARNING: Invalid JSON from LLM: {e}")
        print(f"[SUMMARY] Content: {content}")

    return content