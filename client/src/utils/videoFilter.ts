import { Videos, VideoFilters } from "@/types";

export function initFilterData(acc: VideoFilters, video: Videos): VideoFilters {
	// Add tournament filter
	// const key: string = video.tournament.replace(/\s/g, "");
	const key: string = video.tournament;
	if (!acc.tournament[key]) {
		acc.tournament[key] = {
			title: video.tournament,
			year: [video.year],
			count: 1,
			include: true,
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
			include: true,
			count: 1,
		};
	} else {
		acc.year[video.year].count++;
	}

	// Add tag filter
	if (video.tags) {
		var tagArray = JSON.parse(video.tags);

		tagArray.forEach((tag: string) => {
			if (!acc.tags[tag]) {
				acc.tags[tag] = {
					title: tag,
					include: true,
					count: 1,
				};
			} else {
				acc.tags[tag].count++;
			}
		});
	}

	return acc;
}

export function filterByYearAndTournament(allVideos: Videos[], filterData: VideoFilters) {
	let filteredVideos: Videos[] = [];

	// First extract years to include for filtering
	const yearsToInclude: number[] = Object.entries(filterData.year)
		.filter(([key, val]) => {
			return val.include === true;
		})
		.map(([key, value]) => Number(key));

	// Second extract tournaments to include for filtering
	const tournamentsToInclude: string[] = Object.entries(filterData.tournament)
		.filter(([key, val]) => {
			return val.include === true;
		})
		.map(([key, value]) => String(key));

	// Finall filter formData to include tournament and years selected from above.
	const temp: Videos[] = allVideos.filter(
		(x) => tournamentsToInclude.includes(x.tournament) && yearsToInclude.includes(x.year),
	);

	if (temp.length > 0) {
		filteredVideos = filteredVideos.concat(temp);
	}

	return filteredVideos;
}
