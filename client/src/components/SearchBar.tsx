import { useState } from "react";
import { setVideosFunction, Videos } from "@/types";

interface SearchBarProps {
	allVideos: Videos[],
	setVideos: setVideosFunction,
}

export function SearchBar({ allVideos, setVideos }: SearchBarProps ) {
	const [query, setQuery] = useState<string>("");

	// Search filter is run against the video title/description field
	function filterItems(items: Videos[], query: string) {
		query = query.toLowerCase();

		return items.filter((item) => {
			return item.title.toLowerCase().includes(query);
		});
	}

	function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>): void {
		const value = e.target.value;
		setQuery(value);
		if (value === "") {
			setVideos(allVideos);
		} else {
			setVideos(filterItems(allVideos, value));
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
