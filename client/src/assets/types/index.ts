// Initial Filters data structure for reference
/*
let initFilters = {
	tournament: {
		AustralianOpen: {
			title: "Australian Open",
			year: [2025, 2024],
			count: 3,
			include: true,
		},
		USOpen: {
			title: "US Open",
			year: [2025, 2024],
			count: 3,
			include: true,
		},
	},
	year: {
		2025: { title: 2025, include: true, count: 1 },
		2024: { title: 2024, include: false, count: 3 },
	}
};

let allVideos = [
	{
		player1: "Jannik Sinner",
		player2: "Alexander Zverev",
		round: "Finals",
		title: "Jannik Sinner v Alexander Zverev Full Match | Australian Open 2025 (2hr 36min)"
		tournament: 'Australian Open',
		year: 2025,
		youtube_id: "9_3APf0X_-8",
		__v: 0,
		_id: '676...338e',

	}
]; 
*/

import { Dispatch, SetStateAction } from "react";

export interface Videos {
	videoId: number;
	tournament: string;
	year: number;
	youtubeId: string;
	player1: string;
	player2: string;
	title: string;
	round: Rounds;
	summary?: string;
	summaryStatus: "yes" | "no_transcript" | null;
	duration?: string;
}

type Rounds = "1st" | "2nd" | "3rd" | "4th" | "Quarterfinals" | "Semifinals" | "Finals" | "Exhibition";
// export interface VideoFilters {
//     [key: string]: { // index signatures for unknown property names
//         title: string,
//         year?: number[],
//         count: number,
//         include: boolean
//     }
// }

// export interface VideoFilterItem {
// 	title: string | number;
// 	year?: number[];
// 	count: number;
// 	include: boolean;
// }

type BaseFilterItem = {
	count: number;
	include: boolean;
};

export type TournamentFilterItem = BaseFilterItem & {
	title: string;
	year: number[];
};

export type YearFilterItem = BaseFilterItem & {
	title: number;
};

export interface VideoFilters {
	tournament: {
		[name: string]: TournamentFilterItem;
	};
	year: {
		[year: string]: YearFilterItem;
	};
}

export type setVideosFunction = Dispatch<SetStateAction<Videos[]>>;
export type setFiltersFunction = Dispatch<SetStateAction<VideoFilters>>;

export interface VideoCards {
	id: string;
	title: string;
	duration?: string;
	maxWidth?: number;
	summary?: string | null;
	summaryStatus: "yes" | "no_transcript" | null;
	allVideos: Videos[];
	setAllVideos: setVideosFunction;
	setVideos: setVideosFunction;
}

export type User = {
	username: string;
	email?: string;
	role: string;
	token: string;
} | null;

/* AISummary examples:
{
	"winner": "Jannik Sinner",
    "score": "6-3, 6-4, 6-4",
    "matchRating": 3.8,
    "overview": "Jannik Sinner defeated Ben Shelton in straight sets, 6-3, 6-4, 6-4, in a commanding performance at the Australian Open Quarterfinals. Sinner's relentless pressure and exceptional returning proved too much for Shelton, who fought valiantly but couldn't secure a set. The Italian advances to the semifinals.",
    "highlights": [
        "Jannik Sinner delivered a 'master class' performance, showcasing power, precision, and poise throughout the match.",
        "Ben Shelton unleashed a tournament-fastest serve at 232 km/h, highlighting his immense power.",
        "Sinner's exceptional return game and defensive skills maintained 'unyielding baseline pressure' on Shelton.",
        "Shelton showed improved backhand play and effective net approaches, winning 14 of 21 points at the net.",
        "Sinner extended his impressive head-to-head streak to 22 consecutive sets won against Shelton."
    ],
    "tags": [
        "straight-sets victory",
        "dominant performance",
        "quarterfinal",
        "rivalry"
    ],
	status: "yes"
}

{
	"winner": "",
    "score": "",
    "matchRating": 0,
    "overview": "No transcript available for this video",
    "highlights": [""],
    "tags": [""],
	status: "no_transcript"
}

{
	"winner": "",
    "score": "",
    "matchRating": 0,
    "overview": "Login as an admin to generate a summary for this video",
    "highlights": [""],
    "tags": [""],
	status: null
}
*/
export interface AISummary {
	winner: string;
	score: string;
	matchRating: number;
	overview: string;
	highlights: string[];
	tags: string[];
	status: "yes" | "no_transcript" | null;
}

export interface NavbarProps {
	darkMode: boolean;
	setDarkMode: (option: boolean) => void;
}
