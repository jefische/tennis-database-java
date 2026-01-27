import { Innertube } from "youtubei.js";

/**
 * Extracts video ID from various YouTube URL formats
 */
export function extractVideoId(urlOrId: string): string {
	// If it's already just an ID (11 characters, alphanumeric with - and _)
	if (/^[\w-]{11}$/.test(urlOrId)) {
		return urlOrId;
	}

	// Try to parse as URL
	try {
		const url = new URL(urlOrId);
		// Handle youtu.be format
		if (url.hostname === "youtu.be") {
			return url.pathname.slice(1);
		}
		// Handle youtube.com format
		const videoId = url.searchParams.get("v");
		if (videoId) {
			return videoId;
		}
	} catch {
		// Not a valid URL, try regex patterns
	}

	// Fallback regex for various formats
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
		/^([a-zA-Z0-9_-]{11})$/
	];

	for (const pattern of patterns) {
		const match = urlOrId.match(pattern);
		if (match) {
			return match[1];
		}
	}

	throw new Error(`Could not extract video ID from: ${urlOrId}`);
}

/**
 * Fetches transcript from YouTube using youtubei.js captions API
 * @param videoId - YouTube video ID
 * @returns Promise<string> - The transcript text
 */
export async function fetchTranscript(videoId: string): Promise<string> {
	const youtube = await Innertube.create();

	const info = await youtube.getBasicInfo(videoId);

	// Debug: log full captions object
	// console.log("Captions object:", JSON.stringify(info.captions, null, 2));

	// Get captions from the streaming data
	const captionTracks = info.captions?.caption_tracks;

	if (!captionTracks || captionTracks.length === 0) {
		throw new Error("No captions available for this video");
	}

	console.log("Available caption tracks:", captionTracks.map(t => ({
		lang: t.language_code,
		name: t.name,
		kind: t.kind,
		url: t.base_url?.substring(0, 100) + "..."
	})));

	// Prefer English captions, fall back to first available
	const englishTrack = captionTracks.find(
		(track) => track.language_code === "en" || track.language_code?.startsWith("en")
	);
	const track = englishTrack || captionTracks[0];

	if (!track.base_url) {
		throw new Error("Caption track has no URL");
	}

	// Modify URL to get proper XML format
	const captionUrl = new URL(track.base_url);
	// Remove variant=ec which returns encrypted/empty content
	captionUrl.searchParams.delete("variant");
	// Add fmt=srv3 to get XML format (srv3 is the standard timed text format)
	captionUrl.searchParams.set("fmt", "srv3");

	console.log("Using track:", track.language_code, "URL:", captionUrl.toString());

	// Fetch the caption XML
	const response = await fetch(captionUrl.toString());
	console.log("Caption fetch status:", response.status, response.statusText);

	if (!response.ok) {
		throw new Error(`Failed to fetch captions: ${response.status}`);
	}

	const xml = await response.text();

	// Debug: log first 500 chars of the XML to see the format
	console.log("Caption XML sample:", xml.substring(0, 500));

	// Parse the XML to extract text
	// YouTube captions can have text directly or nested in <s> tags
	// Format 1: <text start="0" dur="5.5">caption text</text>
	// Format 2: <text start="0" dur="5.5"><s>caption text</s></text>
	const transcriptParts: string[] = [];

	// Try to match text content (handles both formats)
	const textMatches = xml.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g);

	for (const match of textMatches) {
		// Strip any inner tags like <s> and decode HTML entities
		let text = match[1]
			.replace(/<[^>]+>/g, "") // Remove any nested tags
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'")
			.replace(/&nbsp;/g, " ")
			.replace(/\n/g, " ")
			.trim();

		if (text) {
			transcriptParts.push(text);
		}
	}

	console.log(`Parsed ${transcriptParts.length} caption segments`);

	if (transcriptParts.length === 0) {
		throw new Error("Could not parse captions from video");
	}

	return transcriptParts.join(" ");
}

/**
 * Fetches transcript from a YouTube URL or video ID
 * @param youtubeUrl - Full YouTube URL or video ID
 * @returns Promise<string> - The transcript text
 */
export async function getTranscriptFromUrl(youtubeUrl: string): Promise<string> {
	const videoId = extractVideoId(youtubeUrl);
	return fetchTranscript(videoId);
}
