import { VideoFilters, Selected } from "@/types";

export type FilterAction =
	| { type: "SELECT_ONE"; group: "tournament" | "year"; key: string; checked: boolean }
	| { type: "SELECT_ALL"; group: keyof VideoFilters }
	| { type: "RESET_ALL" }
	| { type: "TAG_FILTER"; tag: string };

type FilterState = {
	selected: Selected;
	allTournaments: boolean;
	allYears: boolean;
};

export function filterReducer(state: FilterState, action: FilterAction): Partial<FilterState> {
	switch (action.type) {
		// Need to update select one to remove OR add the tournament/year that was dispatched
		// from the action inside tournamentfilters and yearfilters.
		case "SELECT_ONE": {
			const select = state.selected;
			// add a tournament or year
			if (action.checked) {
				const flag = action.group === "tournament" ? "allTournaments" : "allYears";
				return {
					selected: { ...select, [action.group]: { ...select[action.group], [action.key]: true } },
					[flag]: false,
				};
			}

			// remove a tournament or year
			const { [action.key]: _, ...cleanItem } = select[action.group];

			return { selected: { ...select, [action.group]: cleanItem } };
		}
		case "SELECT_ALL": {
			const select = state.selected;
			const flag = action.group === "tournament" ? "allTournaments" : "allYears";
			return { selected: { ...select, [action.group]: {} }, [flag]: !state[flag] };
		}
		case "RESET_ALL":
			return {
				selected: {
					tournament: {},
					year: {},
					tag: {},
				},
				allTournaments: true,
				allYears: true,
			};
		case "TAG_FILTER": {
			const select = state.selected;
			if (action.tag === "allMatches") {
				return { selected: { ...select, tag: {} } };
			}

			return { selected: { ...select, tag: { [action.tag]: true } } };
		}

		default: {
			const _exhaustive: never = action;
			return state;
		}
	}
}

// select_all -> try refactoring this so All Tournaments can be selected on page mount, and
// then all other options are deselected, but the UI is still showing all videos. Then
// if a user selects another tournament, the filter applies to just the selected tournaments,
// and All Tournaments gets deselected.
