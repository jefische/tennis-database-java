import { Video, VideoFilters } from "@/types"

export function sortVideos(a : Video, b: Video): number {
	const nameA: string = a.tournament.toUpperCase();
	const nameB: string = b.tournament.toUpperCase();

	const yearA: number = a.year;
	const yearB: number = b.year;

	if (nameA < nameB) {
		return -1;
	}
	if (nameA > nameB) {
		return 1;
	}
	
	// If it's the same tournament, sort by year
	return yearB - yearA;
	
}

export function setFilterData(acc: VideoFilters, x: Video): VideoFilters {
	// console.log(x);
	const key: string = x.tournament.replace(/\s/g, "");
	if (!acc[key]) {
		acc[key] = {
			title: x.tournament,
			year: [x.year],
			count: 1,
			include: true,
		};
	} else {
		if (!acc[key].year?.includes(x.year)) {
			acc[key].year?.push(x.year);
		}
		acc[key].count++;
	}

	if (!acc[x.year]) {
		acc[x.year] = {
			title: "year",
			include: true,
			count: 1,
		};
	} else {
		acc[x.year].count++;
	}

	return acc;
}

export function checkThumbnail(url: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			// YouTube returns a 120x90 "Video not found" placeholder for invalid IDs
			if (img.naturalWidth === 120 && img.naturalHeight === 90) {
				reject(new Error("Invalid YouTube video ID - placeholder image detected"));
			} else {
				resolve(true);
			}
		};
		img.onerror = () => {
			// YouTube returns a small placeholder image (120x90 pixels) for invalid video IDs instead of a
			// proper 404, which triggers onload instead of onerror. This is a common issue with YouTube thumbnail validation.
			reject(new Error("Thumbnail not found"));
		};

		// Set a timeout to handle hanging requests
		setTimeout(() => {
			reject(new Error("Thumbnail check timeout"));
		}, 5000);

		img.src = url;
	});
}
