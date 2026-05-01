import TournamentFilters from "./TournamentFilters";
import YearFilters from "./YearFilters";
import { Button } from "@/components/ui/button";

interface SidebarProps {
	handleFilter: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function Sidebar({ handleFilter }: SidebarProps) {
	return (
		<aside className="hidden md:flex flex-col items-center w-3xs p-4 bg-sidebar border-r-1 border-gray-400 text-foreground overflow-y-scroll scrollbar-custom">
			<form className="w-auto" onSubmit={handleFilter}>
				<h2 className="text-xl">Filter Match Results</h2>
				<TournamentFilters />
				<YearFilters />
				<Button size="lg" className="my-4" type="submit">
					Apply Filters
				</Button>
			</form>
		</aside>
	);
}
