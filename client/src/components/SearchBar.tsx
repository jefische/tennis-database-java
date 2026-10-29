import { Input } from "./ui/input";
import { useStore } from "@/hooks/useStore";

export function SearchBar() {
	const searchQuery = useStore((s) => s.searchQuery);
	const setSearchQuery = useStore((s) => s.setSearchQuery);

	return (
		<>
			<Input
				className="bg-white text-black text-base min-w-3/4 xl:w-auto 2xl:min-w-0 2xl:basis-[500px] h-[50px]"
				name="searchBar"
				type="text"
				placeholder="Search by Player or Video Title"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
		</>
	);
}
