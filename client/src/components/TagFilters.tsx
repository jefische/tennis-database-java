import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import { setAllInclude } from "@/utils/helpers";

interface TagFiltersMap {
	[name: string]: boolean;
}

const TAGS: { key: string; label: string }[] = [
	{ key: "comeback", label: "Comeback" },
	{ key: "five-setter", label: "Five-setter" },
	{ key: "rivalry", label: "Rivalry" },
	{ key: "upset", label: "Upset" },
	{ key: "epic", label: "Epic" },
];

export default function TagFilters() {
	const [activeFilters, setActiveFilters] = useState<TagFiltersMap>({
		comeback: false,
		"five-setter": false,
		rivalry: false,
		upset: false,
		epic: false,
	});

	const { allVideos, filterData, setFilterData, setActiveVideos } = useStore();

	const handleFilters = (val: string) => {
		var updatedTagFilters = {
			...activeFilters,
			[val]: !activeFilters[val],
		};
		setActiveFilters(updatedTagFilters);

		let tagVideos = allVideos;
		let allFalseCount = 0;
		Object.entries(updatedTagFilters).forEach((t) => {
			if (t[1] == false) {
				allFalseCount++;
			}
		});
		if (allFalseCount == Object.keys(updatedTagFilters).length) {
			// If all false, I want to make sure that sidebar filters all get reselected

			setFilterData({
				tournament: setAllInclude(filterData.tournament, true),
				year: setAllInclude(filterData.year, true),
				tags: setAllInclude(filterData.tags, true),
			});
		} else {
			// Filter all videos to match on each of the 5 selected tags.
			Object.entries(updatedTagFilters).forEach((t) => {
				if (t[1] == true) {
					tagVideos = tagVideos.filter((video) => {
						const tags = JSON.parse(video.tags || "[]");
						return tags.some((tag: string) => {
							return tag.toLowerCase().includes(t[0]);
						});
					});
				}
			});
		}
		setActiveVideos(tagVideos);

		// Inner join videos that match FilteredVideos and tagVideos or just display all tagVideos without accounting for sidebar filter

		// need to adjust filteredVideos to only include the selected tag
		// need to do a check on the current filtered videos (which have the sidebar filters applied)
		// and cross check this against the selected tag videos. I can filter allVideos against all the filtered
		// tags, then do a join on the current filtered videos with the tag filtered videos.

		// if a tag is then deselected, just refilter allVideos against all the filtered tags, and if no tags
		// are selected just use current filtered data to recreate the filtered videos array. then update
		// active videos.

		// alternatively could rework filterData to be in sync with the videos displayed. so if I filter on a tournament
		// the years auto update to reflect the years available for that tournament. Then, for tag filters
		// if a tag is selected we just update the tag to be true, and maybe reapply the filterdata against allVideos
		// each time. That actually sounds easier and cleaner. This way you're not tracking sidebarfilters against
		// tag filters separately. Though, this does introduce some odd behavior I'm not sure how to account for.
	};

	return (
		<div className="flex flex-wrap gap-4 mb-6 col-span-full" role="group" aria-label="Filter by tag">
			{TAGS.map(({ key, label }) => {
				const isActive = activeFilters[key];
				return (
					<Button
						key={key}
						variant="filter"
						size="default"
						aria-pressed={isActive}
						className={`h-9 rounded-full px-4 transition-colors duration-200 ${
							isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
						}`}
						onClick={() => handleFilters(key)}
					>
						{label}
					</Button>
				);
			})}
		</div>
	);
}
