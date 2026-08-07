import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useStore } from "@/hooks/useStore";

interface Filters {
	[name: string]: boolean;
}

export default function TagFilters() {
	const [data, setData] = useState(null);
	const [active, setActive] = useState<Filters>({
		comeback: false,
		"five-setter": false,
		rivalry: false,
		upset: false,
		epic: false,
	});

	const {
		allVideos,
		filterData,
		filteredVideos,
		addFilterVideos,
		resetFilterVideos,
		setFilterData,
		activeVideos,
		setActiveVideos,
	} = useStore();

	// const handleChange = (key: string, checked: boolean): void => {
	// 	setFilterData({
	// 		...filterData,
	// 		tournament: {
	// 			...filterData.tournament,
	// 			[key]: {
	// 				...filterData.tournament[key],
	// 				include: checked,
	// 			},
	// 		},
	// 	});
	// 	// If any individual year is unchecked, uncheck the select all input field
	// 	if (checked === false) setSelectAll(false);
	// };

	const handleFilters = (val: string) => {
		var nextObject = {
			...active,
			[val]: !active[val],
		};
		setActive(nextObject);

		if (nextObject.epic) {
			const epicVideos = allVideos.filter((video) => {
				const tags = JSON.parse(video.tags || "[]");
				return tags.some((tag: string) => {
					return tag.toLowerCase().includes("epic");
				});
			});

			setActiveVideos(epicVideos);
		} else {
			setActiveVideos(filteredVideos);
		}

		console.log(filteredVideos);

		// resetFilterVideos();
		// addFilterVideos();
		// setActiveVideos();
	};
	console.log("from tag filters:");
	console.log(active);
	// console.log(
	// 	Object.entries(filterData.tags)
	// 		.sort((a, b) => b[1].count - a[1].count)
	// 		// .sort()
	// 		.map((t) => t[1]),
	// );

	useEffect(() => {
		// fetch("https://")
		// 	.then((response) => {
		// 		if (!response.ok) {
		// 			throw new Error(`http error: ${response.status}`);
		// 		}
		// 		return response.json();
		// 	})
		// 	.then((data) => setData(data))
		// 	.catch((e) => {
		// 		console.error("fetch failed", e);
		// 	});
	});

	return (
		<div className="flex flex-wrap gap-10 mb-6 col-span-full">
			<Button
				variant="filter"
				size="equal"
				className={active.comeback ? "bg-primary " : ""}
				onClick={() => handleFilters("comeback")}
			>
				Comeback
			</Button>
			<Button
				variant="filter"
				size="equal"
				className={active["five-setter"] ? "bg-primary " : ""}
				onClick={() => handleFilters("five-setter")}
			>
				Five-setter
			</Button>
			<Button
				variant="filter"
				size="equal"
				className={active["rivalry"] ? "bg-primary " : ""}
				onClick={() => handleFilters("rivalry")}
			>
				Rivalry
			</Button>
			<Button
				variant="filter"
				size="equal"
				className={active["upset"] ? "bg-primary " : ""}
				onClick={() => handleFilters("upset")}
			>
				Upset
			</Button>
			<Button
				variant="filter"
				size="equal"
				className={active["epic"] ? "bg-primary " : ""}
				onClick={() => handleFilters("epic")}
			>
				Epic
			</Button>
		</div>
	);
}
