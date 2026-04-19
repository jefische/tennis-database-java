/**
 * Frontend utility for requesting match summaries from the backend API
 */
import { User, AISummary } from "@/assets/types";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Generates a tennis match summary from a YouTube video by calling the backend API
 * @param youtubeUrl - Full YouTube URL or video ID
 * @returns Promise<string> - The generated match summary
 */
export async function generateMatchSummary(youtubeId: string, user: User): Promise<AISummary> {
	try {
		const response = await fetch(`${API_URL}/api/summary/${youtubeId}`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${user?.token}`,
			},
		});

		if (!response.ok) {
			const error = await response.json();
			const err = new Error(error.error || error.message || "Failed to generate summary");
			(err as any).status = response.status;
			throw err;
		}

		const data = await response.json();
		const parsed = JSON.parse(data.summary);
		parsed.status = data.status;
		return parsed;
	} catch (error) {
		console.error(`Error message: ${(error as any).message}, status: ${(error as any).status}`);
		throw error;
	}
}
