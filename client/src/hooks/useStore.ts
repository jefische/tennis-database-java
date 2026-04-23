import { create } from "zustand";
import { User, Videos, VideoFilters } from "@/assets/types";

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
	setActiveVideos: (video: Videos[]) => void;
	addFilterVideos: (video: Videos[]) => void;
	resetFilterVideos: () => void;
	setFilterData: (filters: VideoFilters) => void;
	// decrement: (qty: number) => void;
};

export const useStore = create<State & Actions>((set) => ({
	user: null,
	allVideos: [],
	activeVideos: [],
	filteredVideos: [],
	filterData: { tournament: {}, year: {} },
	setUser: (info: User) => set({ user: info }),
	setAllVideos: (videos: Videos[]) => set({ allVideos: videos }),
	setActiveVideos: (videos: Videos[]) => set({ activeVideos: videos }),
	addFilterVideos: (videos: Videos[]) => set((state) => ({ filteredVideos: [...state.filteredVideos, ...videos] })),
	resetFilterVideos: () => set({ filteredVideos: [] }),
	setFilterData: (filters: VideoFilters) => set({ filterData: filters }),
	// decrement: (qty: number) => set((state) => ({ user: state.user - qty })),
}));

// export type setVideosFunction = Dispatch<SetStateAction<Videos[]>>;

// setAllVideos: (videos: Videos[]) => set({ allVideos: videos }),
// addVideo: (video: Videos) => set((state) => ({ allVideos: [...state.allVideos, video] })),
// removeVideo: (id: string) => set((state) => ({ allVideos: state.allVideos.filter(v => v.youtubeId !== id) })),
