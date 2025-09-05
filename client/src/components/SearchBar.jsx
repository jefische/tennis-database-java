import { useState } from "react";

export function SearchBar({ allVideos, setVideos }) {
	const [query, setQuery] = useState("");

	function handleSearchInput(e) {
		setQuery(e.target.value);
		if (e.target.value == "") {
			setVideos(allVideos);
		} else {
			setVideos(results);
		}
	}

	// Search filter is run against the video title/description field
	function filterItems(items, query) {
		query = query.toLowerCase();

		return items.filter((item) => {
			// return item.player1.split(" ").some((name) => name.toLowerCase().startsWith(query));
			return item.title.toLowerCase().includes(query);
		});
	}

	const results = filterItems(allVideos, query);

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
