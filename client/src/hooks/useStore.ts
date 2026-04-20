import { create } from "zustand";
import { User } from "@/assets/types";

type State = {
	user: User;
};

type Actions = {
	setUser: (info: User) => void;
	// decrement: (qty: number) => void;
};

export const useStore = create<State & Actions>((set) => ({
	user: null,
	setUser: (info: User) => set({ user: info }),
	// decrement: (qty: number) => set((state) => ({ user: state.user - qty })),
}));
