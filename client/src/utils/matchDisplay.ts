// Display helpers shared by match cards.

/** Accent color by tournament / likely court surface. */
export function tournamentColor(tournament: string): string {
	const t = tournament.toLowerCase();
	if (t.includes("australian")) return "#1f7ae0";
	if (t.includes("roland") || t.includes("french")) return "#c8552b";
	if (t.includes("wimbledon")) return "#2f8a3e";
	if (t.includes("us open")) return "#2b3f9e";
	if (/madrid|rome|italian|monte|barcelona|hamburg|clay/.test(t)) return "#d06a3a";
	if (/queen|halle|grass|eastbourne/.test(t)) return "#4c9a52";
	return "#5b6b85";
}

export function thumb(youtubeId: string, quality: "hq" | "maxres" = "hq") {
	return `https://img.youtube.com/vi/${youtubeId}/${quality === "hq" ? "hqdefault" : "maxresdefault"}.jpg`;
}

export function roundLabel(round: string): string {
	return /^\d+$/.test(round) ? `Round ${round}` : round;
}

export function parseTags(tags: string | null | undefined): string[] {
	try {
		return JSON.parse(tags || "[]").map((t: string) => t.toLowerCase());
	} catch {
		return [];
	}
}
