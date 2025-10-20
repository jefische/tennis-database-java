import { useEffect, useState } from "react";
import TournamentFilters from "./TournamentFilters";
import YearFilters from "./YearFilters";
import { Videos, setVideosFunction, VideoFilters } from "@/assets/types";

interface SidebarProps {
	allVideos: Videos[],
	setVideos: setVideosFunction,
	initFilters: VideoFilters

}

export default function Sidebar({ allVideos, setVideos, initFilters }: SidebarProps) {
	// formData is used to manage the checkboxes and pass them to form submit for ytVideo filtering and rendering in Home.jsx
	const [formData, setFormData] = useState<VideoFilters>(initFilters);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		let filterVideos: Videos[] = [];

		// First extract years to include for filtering
		const yearsToInclude: number[] = Object.entries(formData.year)
			.filter(([key, val]) => {
				return val.include === true;
			})
			.map(([key, value]) => Number(key));

		// Then, filter formData for tournaments to include by years selected from above.
		for (var key in formData.tournament) {
			if (formData.tournament[key].include == true) {
				const temp: Videos[] = allVideos.filter((x) => formData.tournament[key].title === x.tournament && yearsToInclude.includes(x.year));

				if (temp.length > 0) {filterVideos = filterVideos.concat(temp);}
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
