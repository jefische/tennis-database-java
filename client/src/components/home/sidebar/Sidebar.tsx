import TournamentFilters from "./TournamentFilters";
import YearFilters from "./YearFilters";
import { Videos, setVideosFunction, VideoFilters, setFiltersFunction } from "@/assets/types";
import { Button } from "@/components/ui/button";

interface SidebarProps {
	allVideos: Videos[];
	setVideos: setVideosFunction;
	formData: VideoFilters;
	setFormData: setFiltersFunction;
}

export default function Sidebar({ allVideos, setVideos, formData, setFormData }: SidebarProps) {
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
				const temp: Videos[] = allVideos.filter(
					(x) => formData.tournament[key].title === x.tournament && yearsToInclude.includes(x.year),
				);

				if (temp.length > 0) {
					filterVideos = filterVideos.concat(temp);
				}
			}
		}
		setVideos(filterVideos);
	};

	return (
		<aside className="hidden md:flex flex-col items-center w-3xs p-4 bg-sidebar border-r-1 border-gray-400 text-foreground overflow-y-scroll scrollbar-custom">
			<form action="" className="w-[180px]" onSubmit={handleSubmit}>
				Filter Match Results
				<TournamentFilters formData={formData} setFormData={setFormData} />
				<YearFilters formData={formData} setFormData={setFormData} />
				<Button size="lg" className="my-1" type="submit">
					Apply Filters
				</Button>
			</form>
		</aside>
	);
}
