import { useState } from "react";
import { setVideosFunction, Videos } from "@/types";

interface SearchBarProps {
	allVideos: Videos[],
	setVideos: setVideosFunction,
}

export function SearchBar({ allVideos, setVideos }: SearchBarProps ) {
	const [query, setQuery] = useState<string>("");

	const results: Videos[] = filterItems(allVideos, query);
	
	// Search filter is run against the video title/description field
	function filterItems(items: Videos[], query: string) {
		query = query.toLowerCase();
		
		return items.filter((item) => {
			// return item.player1.split(" ").some((name) => name.toLowerCase().startsWith(query));
			return item.title.toLowerCase().includes(query);
		});
	}
	
	function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>): void {
		setQuery(e.target.value);
		if (e.target.value == "") {
			setVideos(allVideos);
		} else {
			setVideos(results);
		}
	}

	return (
		<>
			<input
				className="search-bar"
				type="text"
				placeholder="Search by Player"
				value={query}
				onChange={handleSearchInput}
			/>
		</>
	);
}
