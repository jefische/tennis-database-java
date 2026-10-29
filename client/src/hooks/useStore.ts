import { create } from "zustand";
import { User, Video, VideoFilters, SortMode, Selected } from "@/types";
import { initFilterData } from "@/utils/videoFilter";
import { filterReducer, FilterAction } from "@/utils/filterReducer";

type State = {
	user: User;
	allVideos: Video[];
	filterOptions: VideoFilters;
	selected: Selected;
	sortMode: SortMode;
	searchQuery: string;
	allTournaments: boolean;
	allYears: boolean;
};

type Actions = {
	setUser: (info: User) => void;
	setAllVideos: (video: Video[]) => void;
	dispatchFilter: (action: FilterAction) => void;
	setSortMode: (mode: SortMode) => void;
	setSearchQuery: (query: string) => void;
};

export const useStore = create<State & Actions>((set, get) => ({
	user: null,
	allVideos: [],
	filterOptions: { tournament: {}, year: {}, tag: {} },
	selected: { tournament: {}, year: {}, tag: {} },
	sortMode: "tournament",
	searchQuery: "",
	allTournaments: true,
	allYears: true,
	setUser: (info: User) => set({ user: info }),
	dispatchFilter: (action: FilterAction) => set((s) => ({ ...filterReducer(s, action) })),
	setSortMode: (mode: SortMode) => set({ sortMode: mode }),
	setSearchQuery: (query: string) => set({ searchQuery: query }),

	setAllVideos: (videos: Video[]) => {
		const initData: VideoFilters = videos.reduce(initFilterData, { tournament: {}, year: {}, tag: {} });
		const sorted: VideoFilters = { tournament: {}, year: {}, tag: {} };

		// Sort the tournament, year, and tag keys alphabetically.
		// Also copy the users existing checkbox/includes choice on subsequent filters after
		// an add, edit, or delete operation from admins. The default for users sets include to true.
		Object.keys(initData.tournament)
			.sort()
			.forEach((key) => (sorted.tournament[key] = initData.tournament[key]));

		Object.keys(initData.year)
			.sort()
			.forEach((key) => (sorted.year[key] = initData.year[key]));

		Object.keys(initData.tag)
			.sort()
			.forEach((key) => (sorted.tag[key] = initData.tag[key]));

		set({ allVideos: videos, filterOptions: sorted });
	},
}));

// export type setVideosFunction = Dispatch<SetStateAction<Videos[]>>;

// setAllVideos: (videos: Videos[]) => set({ allVideos: videos }),
// addVideo: (video: Videos) => set((state) => ({ allVideos: [...state.allVideos, video] })),
// removeVideo: (id: string) => set((state) => ({ allVideos: state.allVideos.filter(v => v.youtubeId !== id) })),
