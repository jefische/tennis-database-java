export function sortVideos(a, b) {
	const nameA = a.tournament.toUpperCase();
	const nameB = b.tournament.toUpperCase();

	const yearA = a.year;
	const yearB = b.year;

	if (nameA < nameB) {
		return -1;
	}
	if (nameA > nameB) {
		return 1;
	}
	if (nameA === nameB) {
		return yearB - yearA;
	}
}

export function setFilterData(acc, x) {
	// console.log(x);
	const key = x.tournament.replace(/\s/g, "");
	if (!acc[key]) {
		acc[key] = {
			title: x.tournament,
			year: [x.year],
			count: 1,
			include: true,
		};
	} else {
		if (!acc[key].year.includes(x.year)) {
			acc[key].year.push(x.year);
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

export function checkThumbnail(url) {
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
			reject(new Error("Thumbnail not found"));
		};

		// Set a timeout to handle hanging requests
		setTimeout(() => {
			reject(new Error("Thumbnail check timeout"));
		}, 5000);

		img.src = url;
	});
}
