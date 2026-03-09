import os
from youtube_transcript_api import YouTubeTranscriptApi
from langchain_community.document_loaders import YoutubeLoader
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
import re

# Create the model using Google Gemini
model = ChatGoogleGenerativeAI(
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

def fetch_transcript(video_id: str) -> str:
    """Fetch transcript from YouTube using youtube-transcript-api."""
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
        transcript_text = ' '.join([entry['text'] for entry in transcript_list])
        return transcript_text
    except Exception as e:
        # Try to get any available transcript
        try:
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
            transcript_text = ' '.join([entry['text'] for entry in transcript_list])
            return transcript_text
        except Exception as e2:
            raise Exception(f"Failed to get transcript: {str(e2)}")

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
        - "tags": Array of 2-4 descriptive tags (e.g. "five-setter", "upset", "rivalry", "comeback")

        FORMAT:
        - Return ONLY valid JSON, no markdown code fences, no extra text.
        - Use markdown ** for bolding within the "overview" string only.
        - Always bold the score in the overview.

        EXAMPLE OUTPUT:
        {{
            "winner": "Roger Federer",
            "score": "6-4, 3-6, 7-6(5)",
            "matchRating": 8,
            "overview": "Roger Federer edged Rafael Nadal **6-4, 3-6, 7-6(5)** in a tightly contested semifinal at the 2024 Australian Open. Federer controlled the opening set with precise serving before Nadal stormed back to level the match. The decider went to a tiebreak where Federer's nerves of steel proved decisive. He won five of the last six points to seal the victory. This was their 41st career meeting and one of their most dramatic encounters.",
            "highlights": [
                "Federer saved 3 break points in the opening set",
                "Nadal's forehand winner streak in the second set",
                "Third-set tiebreak: Federer won 5 of the last 6 points"
            ],
            "tags": ["three-setter", "rivalry", "tiebreak"]
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
    loader = YoutubeLoader.from_youtube_url(
        youtube_url, add_video_info=False
    )

    try:
        docs=loader.load()
    except Exception:
        raise Exception("No transcript available for this video")
    if not docs:
        raise Exception("No transcript available for this video")
    transcript=docs[0].page_content

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
        - "tags": Array of 2-4 descriptive tags (e.g. "five-setter", "upset", "rivalry", "comeback")

        FORMAT:
        - Return ONLY valid JSON, NO markdown code fences, NO extra text.

        EXAMPLE OUTPUT:
        {{
            "winner": "Roger Federer",
            "score": "6-4, 3-6, 7-6(5)",
            "matchRating": 8,
            "overview": "Roger Federer edged Rafael Nadal 6-4, 3-6, 7-6(5) in a tightly contested semifinal at the 2024 Australian Open. Federer controlled the opening set with precise serving before Nadal stormed back to level the match. The decider went to a tiebreak where Federer's nerves of steel proved decisive. He won five of the last six points to seal the victory. This was their 41st career meeting and one of their most dramatic encounters.",
            "highlights": [
                "Federer saved 3 break points in the opening set",
                "Nadal's forehand winner streak in the second set",
                "Third-set tiebreak: Federer won 5 of the last 6 points"
            ],
            "tags": ["three-setter", "rivalry", "tiebreak"]
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
    content = result.content.strip()
    content = re.sub(r'^```json\s*', '', content)
    content = re.sub(r'\s*```$', '', content)

    return content