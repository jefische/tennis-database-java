import { useStore } from "./useStore";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";
import { filterByYearAndTournamentAndTag } from "@/utils/videoFilter";
import { VIDEO_SORTS } from "@/utils/videoSort";
import { Video } from "@/types";

export function useVisibleVideos() {
	const { allVideos, selected, searchQuery, sortMode, allTournaments, allYears } = useStore(
		useShallow((s) => ({
			allVideos: s.allVideos,
			selected: s.selected,
			searchQuery: s.searchQuery,
			sortMode: s.sortMode,
			allTournaments: s.allTournaments,
			allYears: s.allYears,
		})),
	);

	return useMemo(() => {
		const filtered = filterByYearAndTournamentAndTag(allVideos, selected, allTournaments, allYears);
		const searched = searchQuery ? filterItems(filtered, searchQuery) : filtered;
		return [...searched].sort(VIDEO_SORTS[sortMode]);
	}, [allVideos, selected, searchQuery, sortMode, allTournaments, allYears]);
}

// Search filter is run against the video title/description field
function filterItems(items: Video[], query: string) {
	query = query.toLowerCase();
	const words = query.split(/\s+/);

	return items.filter((item) => {
		return words.every((word) => item.title.toLowerCase().includes(word));
	});
}
