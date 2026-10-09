import { Videos, SortMode } from "@/types";

const ROUND_ORDER: Record<string, number> = {
	Finals: 1,
	Semifinals: 2,
	Quarterfinals: 3,
	"4th": 4,
	"3rd": 5,
	"2nd": 6,
	"1st": 7,
	Exhibition: 8,
};

export function sortVideos(a: Videos, b: Videos): number {
	const nameA: string = a.tournament.toUpperCase();
	const nameB: string = b.tournament.toUpperCase();

	const yearA: number = a.year;
	const yearB: number = b.year;

	const roundA: number = ROUND_ORDER[a.round] ?? 99;
	const roundB: number = ROUND_ORDER[b.round] ?? 99;

	if (nameA < nameB) {
		return -1;
	}
	if (nameA > nameB) {
		return 1;
	}
	if (nameA === nameB) {
		if (yearA < yearB) {
			return 1;
		}
		if (yearA > yearB) {
			return -1;
		}
		if (yearA === yearB) {
			return roundA - roundB;
		}
	}

	return 0;
}

/**
 * Order by insertion, newest first. videoId is auto-increment, so it encodes the order
 * rows were added. Preferred over createdAt, which is null for all but a handful of rows
 * because the column was added long after most videos were inserted.
 */
export function sortVideosByNewest(a: Videos, b: Videos): number {
	return b.videoId - a.videoId;
}

export function sortVideosByOldest(a: Videos, b: Videos): number {
	return a.videoId - b.videoId;
}

export const VIDEO_SORTS: Record<SortMode, (a: Videos, b: Videos) => number> = {
	tournament: sortVideos,
	newest: sortVideosByNewest,
	oldest: sortVideosByOldest,
};
