// Parse ISO 8601 (YouTube) duration to total seconds
export function isoDurationToSeconds(iso: string): number {
	const m = iso.match(/P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
	if (!m) return 0;
	const [, d, h, min, s] = m.map((x) => (x ? parseInt(x, 10) : 0));
	return (d || 0) * 86400 + (h || 0) * 3600 + (min || 0) * 60 + (s || 0);
}

// Format seconds as H:MM:SS or M:SS
export function formatHMS(total: number): string {
	const h = Math.floor(total / 3600);
	const m = Math.floor((total % 3600) / 60);
	const s = total % 60;
	return h > 0
		? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
		: `${m}:${String(s).padStart(2, "0")}`;
}

// Format as "Xhr YYmin" (like your title)
export function formatHrMin(total: number): string {
	const h = Math.floor(total / 3600);
	const m = Math.floor((total % 3600) / 60);
	return `${h}hr ${String(m).padStart(2, "0")}min`;
}
