import { useState } from "react";
import { Input } from "./ui/input";
import { setVideosFunction, Videos, VideoFilters } from "@/types";
import { useStore } from "@/hooks/useStore";

interface SearchBarProps {
	setActiveVideos: setVideosFunction;
}

export function SearchBar({ setActiveVideos }: SearchBarProps) {
	const [query, setQuery] = useState<string>("");
	const { filterVideos } = useStore();

	// Search filter is run against the video title/description field
	function filterItems(items: Videos[], query: string) {
		query = query.toLowerCase();
		const words = query.split(/\s+/);

		return items.filter((item) => {
			return words.every((word) => item.title.toLowerCase().includes(word));
		});
	}

	function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>): void {
		const value = e.target.value;
		setQuery(value);

		if (value === "") {
			setActiveVideos(filterVideos);
		} else {
			setActiveVideos(filterItems(filterVideos, value));
		}
	}

	return (
		<>
			<Input
				className="bg-white text-black min-w-3/4 xl:min-w-0 xl:basis-[500px] h-[50px]"
				name="searchBar"
				type="text"
				placeholder="Search by Player or Video Title"
				value={query}
				onChange={handleSearchInput}
			/>
		</>
	);
}
