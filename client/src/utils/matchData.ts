// Shared helpers for /landing and /home
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/hooks/useStore.ts";
import { AISummary, Video } from "@/types";

export type Match = {
	video: Video;
	summary: AISummary | null;
	rating: number;
	tags: string[];
};

export function toMatch(video: Video): Match {
	let summary: AISummary | null = null;
	if (video.summaryStatus === "yes" && video.summary) {
		try {
			summary = JSON.parse(video.summary);
		} catch {
			summary = null;
		}
	}
	let tags: string[] = [];
	try {
		tags = JSON.parse(video.tags || "[]").map((t: string) => t.toLowerCase());
	} catch {
		tags = [];
	}
	return { video, summary, rating: summary?.matchRating ?? 0, tags };
}

/** Loads /videos into the store once (same behavior as Home) and returns enriched matches. */
export function useArchiveMatches() {
	const { allVideos, setAllVideos } = useStore(
		useShallow((s) => ({ allVideos: s.allVideos, setAllVideos: s.setAllVideos })),
	);
	const [loading, setLoading] = useState(allVideos.length === 0);

	useEffect(() => {
		if (allVideos.length > 0) return;
		fetch(`${import.meta.env.VITE_API_URL}/videos`)
			.then((res) => res.json())
			.then((data: Video[]) =>
				setAllVideos(data.map((v) => ({ ...v, createdAt: v.createdAt ? new Date(v.createdAt) : null }))),
			)
			.catch((err) => console.error("Error fetching videos:", err))
			.finally(() => setLoading(false));
	}, []);

	return { matches: allVideos.map(toMatch), loading: loading && allVideos.length === 0 };
}

export const GRAND_SLAMS = ["Australian Open", "Roland Garros", "French Open", "Wimbledon", "US Open"];

export { tournamentColor, thumb, roundLabel } from "@/utils/matchDisplay.ts";

export function isFinal(round: string): boolean {
	return round.toLowerCase().startsWith("final");
}

export function firstSentence(text: string): string {
	const m = text.match(/^.*?[.!?](\s|$)/);
	return m ? m[0].trim() : text;
}

export function pairKey(v: Video): string {
	return [v.player1, v.player2].sort().join(" vs. ");
}
