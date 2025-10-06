// Initial Filters data structure for reference
/*
let initFilters = {
	AustralianOpen: {
		title: "Aussy Open",
		year: [2025, 2024],
		count: 3,
		include: true,
	},
	2025: { title: "year", include: true, count: 1 },
	2024: { title: "year", include: false, count: 3 },
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
	videoId: number,
    tournament: "Australian Open" | "French Open" | "Wimbledon" | "US Open",
    year: number,
    youtubeId: string,
    player1: string,
    player2: string,
    title: string,
    round: "1st" | "2nd" | "3rd" | "4th" | "Quarterfinals" | "Semifinals" |"Finals",
}

export interface VideoFilters {
    [key: string]: { // index signatures for unknown property names
        title: string,
        year?: number[],
        count: number,
        include: boolean
    }
}

export type setVideosFunction = Dispatch<SetStateAction<Videos[]>>;

export interface VideoCards {
	id: string,
	title: string,
	maxWidth?: number,
	setAllVideos: setVideosFunction,
	setVideos: setVideosFunction,
}