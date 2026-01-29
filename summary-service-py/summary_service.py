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
        1. Match Summary (50-100 words MAX. DO NOT go over 100 words):
        - Players and final score
        - Key turning points
        - Notable performance highlights
        - Match significance/context

        FORMAT:
        The match summary should be in paragraph form, to be inserted into an HTML web page.

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
def generate_match_summary(youtube_url: str) -> str:
    loader = YoutubeLoader.from_youtube_url(
        youtube_url, add_video_info=False
    )

    docs=loader.load()
    transcript=docs[0].page_content

    # Create the system message with the transcript
    system_message = f"""You are a professional tennis analyst specializing in match analysis and commentary.

        Your task: Analyze the provided tennis match transcript and create a structured summary.

        TRANSCRIPT:
        {transcript}

        OUTPUT REQUIREMENTS:
        1. Match Summary (50-100 words MAX. DO NOT go over 100 words):
        - Players and final score
        - Key turning points
        - Notable performance highlights
        - Match significance/context

        FORMAT:
        The match summary should be in paragraph form, to be inserted into an HTML web page.

        TONE: Professional but engaging, suitable for tennis fans."""

    # Create the chat template
    chat_template = ChatPromptTemplate.from_messages([
        ("system", system_message),
        ("human", "Please provide a match summary based on the transcript."),
    ])

    chain = chat_template | model
    result = chain.invoke({})
    
    return result.content