import { Video, VideoFilters, Selected } from "@/types";

export function initFilterData(acc: VideoFilters, video: Video): VideoFilters {
	// Add tournament filter
	// const key: string = video.tournament.replace(/\s/g, "");
	const key: string = video.tournament;
	if (!acc.tournament[key]) {
		acc.tournament[key] = {
			title: video.tournament,
			year: [video.year],
			count: 1,
		};
	} else {
		if (!acc.tournament[key].year?.includes(video.year)) {
			acc.tournament[key].year.push(video.year);
		}
		acc.tournament[key].count++;
	}

	// Add year filter
	if (!acc.year[video.year]) {
		acc.year[video.year] = {
			title: video.year,
			count: 1,
		};
	} else {
		acc.year[video.year].count++;
	}

	// Add tag filter
	if (video.tags) {
		var tagArray = JSON.parse(video.tags);

		tagArray.forEach((tag: string) => {
			if (!acc.tag[tag]) {
				acc.tag[tag] = {
					title: tag,
					count: 1,
				};
			} else {
				acc.tag[tag].count++;
			}
		});
	}

	return acc;
}

export function filterByYearAndTournamentAndTag(
	allVideos: Video[],
	selected: Selected,
	allTournaments: boolean,
	allYears: boolean,
): Video[] {
	// Filter videos to include tournament, years, and tags.
	const sTags = Object.keys(selected.tag);
	const filteredVideos: Video[] = allVideos.filter((v) => {
		const tags = JSON.parse(v.tags || "[]");
		return (
			(allTournaments || v.tournament in selected.tournament) &&
			(allYears || v.year in selected.year) &&
			(sTags.length === 0 || tags.some((t: string) => sTags.includes(t.toLowerCase())))
		);
	});

	return filteredVideos;
}
