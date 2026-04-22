import { create } from "zustand";
import { User, Videos } from "@/assets/types";

type State = {
	user: User;
	allVideos: Videos[];
	activeVideos: Videos[];
	filterVideos: Videos[];
};

type Actions = {
	setUser: (info: User) => void;
	setAllVideos: (video: Videos[]) => void;
	setActiveVideos: (video: Videos[]) => void;
	addFilterVideos: (video: Videos[]) => void;
	resetFilterVideos: () => void;
	// decrement: (qty: number) => void;
};

export const useStore = create<State & Actions>((set) => ({
	user: null,
	allVideos: [],
	activeVideos: [],
	filterVideos: [],
	setUser: (info: User) => set({ user: info }),
	setAllVideos: (videos: Videos[]) => set({ allVideos: videos }),
	setActiveVideos: (videos: Videos[]) => set({ activeVideos: videos }),
	addFilterVideos: (videos: Videos[]) => set((state) => ({ filterVideos: [...state.filterVideos, ...videos] })),
	resetFilterVideos: () => set({ filterVideos: [] }),
	// decrement: (qty: number) => set((state) => ({ user: state.user - qty })),
}));

// export type setVideosFunction = Dispatch<SetStateAction<Videos[]>>;

// setAllVideos: (videos: Videos[]) => set({ allVideos: videos }),
// addVideo: (video: Videos) => set((state) => ({ allVideos: [...state.allVideos, video] })),
// removeVideo: (id: string) => set((state) => ({ allVideos: state.allVideos.filter(v => v.youtubeId !== id) })),
