/**
 * Frontend utility for requesting match summaries from the backend API
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Generates a tennis match summary from a YouTube video by calling the backend API
 * @param youtubeUrl - Full YouTube URL or video ID
 * @returns Promise<string> - The generated match summary
 */
export async function generateMatchSummary(youtubeUrl: string): Promise<string> {
	try {
		const response = await fetch(`${API_URL}/videos/summary`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ youtubeUrl }),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to generate summary");
		}

		const data = await response.json();
		return data.summary;
	} catch (error) {
		console.error("Error generating match summary:", error);
		throw new Error(
			`Failed to generate match summary: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}
