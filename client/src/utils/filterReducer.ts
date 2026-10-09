import { VideoFilters } from "@/types";

export type FilterAction =
	| { type: "SELECT_ONE"; group: keyof VideoFilters; key: string }
	| { type: "SELECT_ALL"; group: keyof VideoFilters; include: boolean }
	| { type: "RESET_ALL" };

export function filterReducer(state: VideoFilters, action: FilterAction): VideoFilters {
	switch (action.type) {
		case "SELECT_ONE": {
			const group = state[action.group];
			const item = group[action.key];
			if (!item) return state;
			return { ...state, [action.group]: { ...group, [action.key]: { ...item, include: !item.include } } };
		}
		case "SELECT_ALL":
			return { ...state, [action.group]: setAllInclude(state[action.group], action.include) };
		case "RESET_ALL":
			return {
				tournament: setAllInclude(state.tournament, true),
				year: setAllInclude(state.year, true),
				tags: setAllInclude(state.tags, true),
			};
		default: {
			const _exhaustive: never = action;
			return state;
		}
	}
}

export const setAllInclude = <T extends Record<string, { include: boolean }>>(group: T, include: boolean): T =>
	Object.fromEntries(Object.entries(group).map(([key, value]) => [key, { ...value, include }])) as T;
