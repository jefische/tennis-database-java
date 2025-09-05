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
	console.log(x);
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
