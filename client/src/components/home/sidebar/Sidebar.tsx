import TournamentFilters from "./TournamentFilters";
import YearFilters from "./YearFilters";

export default function Sidebar() {
	return (
		<aside className="hidden lg:flex flex-col items-center w-3xs p-4 bg-sidebar border-r-1 border-gray-400 text-foreground overflow-y-scroll scrollbar-custom">
			<div className="w-auto">
				<h2 className="text-xl">Filter Match Results</h2>
				<TournamentFilters />
				<YearFilters />
				{/* <TagFilters /> */}
			</div>
		</aside>
	);
}
