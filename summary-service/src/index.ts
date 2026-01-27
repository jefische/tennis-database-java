import express from "express";
import cors from "cors";
import { generateMatchSummary } from "./services/summaryService.js";


const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});

// Summary generation endpoint
app.post("/api/summary", async (req, res) => {
	try {
		const { youtubeUrl } = req.body;

		if (!youtubeUrl) {
			res.status(400).json({ error: "youtubeUrl is required" });
			return;
		}

		console.log(`Generating summary for: ${youtubeUrl}`);
		const summary = await generateMatchSummary(youtubeUrl);

		res.json({ summary });
	} catch (error) {
		console.error("Error generating summary:", error);
		res.status(500).json({
			error: `Failed to generate summary: ${error instanceof Error ? error.message : "Unknown error"}`,
		});
	}
});

// Start the server
app.listen(PORT, () => {
	console.log(`Summary service running on http://localhost:${PORT}`);
});
