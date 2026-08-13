import { create } from "zustand";
import { User, Videos, VideoFilters } from "@/assets/types";
import { initFilterData } from "@/utils/helpers";

type State = {
	user: User;
	allVideos: Videos[];
	activeVideos: Videos[];
	filteredVideos: Videos[];
	filterData: VideoFilters;
};

type Actions = {
	setUser: (info: User) => void;
	setAllVideos: (video: Videos[]) => void;
	setFilterData: (filters: VideoFilters) => void;
	// setFilterDataFalse: () => void;
	addFilterVideos: (video: Videos[]) => void;
	resetFilterVideos: () => void;
	setActiveVideos: (video: Videos[]) => void;
	// decrement: (qty: number) => void;
};

export const useStore = create<State & Actions>((set, get) => ({
	user: null,
	allVideos: [],
	activeVideos: [],
	filteredVideos: [],
	filterData: { tournament: {}, year: {}, tags: {} },
	setUser: (info: User) => set({ user: info }),
	setAllVideos: (videos: Videos[]) => {
		const initData: VideoFilters = videos.reduce(initFilterData, { tournament: {}, year: {}, tags: {} });
		const sorted: VideoFilters = { tournament: {}, year: {}, tags: {} };

		const currentFilterData = get().filterData;
		const hasExistingFilters = Object.keys(currentFilterData.tournament).length > 0;

		Object.keys(initData.tournament)
			.sort()
			.forEach((key) => {
				sorted.tournament[key] = {
					...initData.tournament[key],
					include:
						hasExistingFilters && currentFilterData.tournament[key] !== undefined
							? currentFilterData.tournament[key].include
							: true,
				};
			});
		Object.keys(initData.year)
			.sort()
			.forEach((key) => {
				sorted.year[key] = {
					...initData.year[key],
					include:
						hasExistingFilters && currentFilterData.year[key] !== undefined
							? currentFilterData.year[key].include
							: true,
				};
			});

		// console.log(
		// 	Object.entries(initData.tags)
		// 		.sort((a, b) => b[1].count - a[1].count)
		// 		// .sort()
		// 		.map((t) => t[1]),
		// );

		// console.log(Object.keys(initData.tags).sort());

		Object.keys(initData.tags)
			.sort()
			.forEach((key) => {
				sorted.tags[key] = {
					...initData.tags[key],
					include:
						hasExistingFilters && currentFilterData.tags[key] !== undefined
							? currentFilterData.tags[key].include
							: true,
				};
			});

		const filtered = videos.filter((v) => {
			// const tKey = v.tournament.replace(/\s/g, "");
			return sorted.tournament[v.tournament]?.include && sorted.year[v.year]?.include;
		});

		set({ allVideos: videos, filterData: sorted, filteredVideos: filtered, activeVideos: filtered });
	},

	setFilterData: (filters: VideoFilters) => set({ filterData: filters }),
	// setFilterDataFalse: () => {
	// 	set((state) => ({
	// 		filterData: {
	// 			tournament: setAllInclude(state.filterData.tournament, false),
	// 			year: setAllInclude(state.filterData.year, false),
	// 			tags: setAllInclude(state.filterData.tags, false),
	// 		},
	// 	}));
	// },
	// setFilterDataFalse: () => {
	// 	set((state) => ({
	// 		filterData: {
	// 			tournament: Object.fromEntries(
	// 				Object.entries(state.filterData.tournament).map(([key, value]) => [
	// 					key,
	// 					{ ...value, include: false },
	// 				]),
	// 			),
	// 			year: Object.fromEntries(
	// 				Object.entries(state.filterData.year).map(([key, value]) => [key, { ...value, include: false }]),
	// 			),
	// 			tags: Object.fromEntries(
	// 				Object.entries(state.filterData.tags).map(([key, value]) => [key, { ...value, include: false }]),
	// 			),
	// 		},
	// 	}));
	// },
	addFilterVideos: (videos: Videos[]) => set((state) => ({ filteredVideos: [...state.filteredVideos, ...videos] })),
	resetFilterVideos: () => set({ filteredVideos: [] }),
	setActiveVideos: (videos: Videos[]) => set({ activeVideos: videos }),
	// decrement: (qty: number) => set((state) => ({ user: state.user - qty })),
}));

// export type setVideosFunction = Dispatch<SetStateAction<Videos[]>>;

// setAllVideos: (videos: Videos[]) => set({ allVideos: videos }),
// addVideo: (video: Videos) => set((state) => ({ allVideos: [...state.allVideos, video] })),
// removeVideo: (id: string) => set((state) => ({ allVideos: state.allVideos.filter(v => v.youtubeId !== id) })),
