import { useEffect, useState } from "react";
import TournamentFilters from "./TournamentFilters";
import YearFilters from "./YearFilters";
import { Videos, setVideosFunction, VideoFilters } from "@/assets/types";

type Filters = Record<string, VideoFilters>;

interface SidebarProps {
	allVideos: Videos[],
	setVideos: setVideosFunction,
	initFilters: VideoFilters

}

export default function Sidebar({ allVideos, setVideos, initFilters }: SidebarProps) {
	// formData is used to manage the checkboxes and pass them to form submit for ytVideo filtering and rendering in Home.jsx
	const [formData, setFormData] = useState<VideoFilters>(initFilters);

	console.log(formData)
	console.log('testing object.entries...')
	Object.entries(formData).filter(([key,val]) => {
		console.log(key);
		console.log(val)
	})

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		let filterVideos: Videos[] = [];

		// First filter formData for the years to include
		const yearsToInclude: number[] = Object.entries(formData.year)
			.filter(([key, val]) => {
				return val.title === "year" && val.include === true;
			})
			.map(([key, value]) => Number(key));

		// Second, filter formData for tournaments to include and only include the years selected from the first filter above.
		for (var key in formData.tournament) {
			if (formData.tournament[key].include == true) {
				const temp: Videos[] = allVideos.filter((x) => x.tournament == formData.tournament[key].title && yearsToInclude.includes(x.year));

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
