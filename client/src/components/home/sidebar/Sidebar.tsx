import TournamentFilters from "./TournamentFilters";
import YearFilters from "./YearFilters";
// import { Videos } from "@/assets/types";
import { Button } from "@/components/ui/button";
// import { useStore } from "@/hooks/useStore";

interface SidebarProps {
	handleFilter: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function Sidebar({ handleFilter }: SidebarProps) {
	// const { allVideos, setActiveVideos, filterData, addFilterVideos, resetFilterVideos } = useStore();

	// const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
	// 	e.preventDefault();
	// 	let filteredVideos: Videos[] = [];

	// 	// First extract years to include for filtering
	// 	const yearsToInclude: number[] = Object.entries(filterData.year)
	// 		.filter(([key, val]) => {
	// 			return val.include === true;
	// 		})
	// 		.map(([key, value]) => Number(key));

	// 	// Then, filter formData for tournaments to include by years selected from above.
	// 	for (var key in filterData.tournament) {
	// 		if (filterData.tournament[key].include == true) {
	// 			const temp: Videos[] = allVideos.filter(
	// 				(x) => filterData.tournament[key].title === x.tournament && yearsToInclude.includes(x.year),
	// 			);

	// 			if (temp.length > 0) {
	// 				filteredVideos = filteredVideos.concat(temp);
	// 			}
	// 		}
	// 	}
	// 	resetFilterVideos();
	// 	addFilterVideos(filteredVideos);
	// 	setActiveVideos(filteredVideos);
	// 	setFilterOpen(false);
	// };

	return (
		<aside className="hidden md:flex flex-col items-center w-3xs p-4 bg-sidebar border-r-1 border-gray-400 text-foreground overflow-y-scroll scrollbar-custom">
			<form className="w-auto" onSubmit={handleFilter}>
				<h2 className="text-xl">Filter Match Results</h2>
				<TournamentFilters />
				<YearFilters />
				<Button size="lg" className="my-1" type="submit">
					Apply Filters
				</Button>
			</form>
		</aside>
	);
}
