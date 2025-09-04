import { useEffect, useState } from "react";
import TournamentFilters from "./TournamentFilters";
import YearFilters from "./YearFilters";

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
*/
// allVideos data structure for reference
/*
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

export default function Sidebar({ allVideos, setVideos, initFilters }) {
	// formData is used to manage the checkboxes and pass them to form submit for ytVideo filtering and rendering in Home.jsx
	const [formData, setFormData] = useState(initFilters);

	const handleSubmit = (e) => {
		e.preventDefault();
		let filterVideos = [];

		// First filter formData for the years to include
		const yearsToInclude = Object.entries(formData)
			.filter(([key, val]) => {
				return val.title == "year" && val.include == true;
			})
			.map(([key, value]) => Number(key));

		// Second, filter formData for tournaments to include and only include the years selected from the first filter above.
		for (var key in formData) {
			if (formData[key].include == true && formData[key].title !== "year") {
				const temp = allVideos.filter((x) => x.tournament == formData[key].title && yearsToInclude.includes(x.year));

				if (temp.length > 0) {
					filterVideos = filterVideos.concat(temp);
				}
			}
		}
		setVideos(filterVideos);
	};

	useEffect(() => {
		setFormData(initFilters);
	}, [allVideos]); // This dependency allows setFormData to run twice. Initially allVideos is empty on first render while the data is fetched from our API.

	return (
		<aside className="sidebar">
			<form action="" className="w-[180px]" onSubmit={handleSubmit}>
				Filter Match Results
				<TournamentFilters formData={formData} setFormData={setFormData} />
				<YearFilters formData={formData} setFormData={setFormData} />
				<button className="applyFilter btn btn-primary my-1" type="submit">
					Apply Filters
				</button>
			</form>
		</aside>
	);
}
