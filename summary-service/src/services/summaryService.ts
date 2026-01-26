import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";

// Create the model using Google Gemini
const model = new ChatGoogleGenerativeAI({
	model: "gemini-2.5-flash",
	temperature: 0, // Controls randomness. 0 is good for deterministic results.
	apiKey: process.env.GOOGLE_API_KEY,
});

/**
 * Generates a tennis match summary from a YouTube video transcript
 * @param youtubeUrl - Full YouTube URL or video ID
 * @returns Promise<string> - The generated match summary
 */
export async function generateMatchSummary(youtubeUrl: string): Promise<string> {
	try {
		// Load the YouTube transcript
		const loader = YoutubeLoader.createFromUrl(youtubeUrl);
		const docs = await loader.load();

		// Extract the transcript text from the loaded documents
		const video_transcript = docs.map((doc) => doc.pageContent).join("\n");

		// Create the system message with the transcript
		const systemMessage = `You are a professional tennis analyst specializing in match analysis and commentary.

            Your task: Analyze the provided tennis match transcript and create a structured summary.

            TRANSCRIPT:
            ${video_transcript}

            OUTPUT REQUIREMENTS:
            1. Match Summary (50-100 words MAX. DO NOT go over 100 words):
            - Players and final score
            - Key turning points
            - Notable performance highlights
            - Match significance/context

            FORMAT:
            The match summary should be in paragraph form, to be inserted into an HTML web page.

            TONE: Professional but engaging, suitable for tennis fans.`;

		// Create the chat template
		const chatTemplate = ChatPromptTemplate.fromMessages([
			["system", systemMessage],
			["human", "Please provide a match summary based on the transcript."],
		]);

		// Generate the summary
		const chain = chatTemplate.pipe(model);
		const response = await chain.invoke({});

		return response.content as string;
	} catch (error) {
		console.error("Error generating match summary:", error);
		throw new Error(
			`Failed to generate match summary: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}
