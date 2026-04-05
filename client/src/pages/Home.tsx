import VideoCard from "../components/home/modals/VideoCard";
import AddModal from "../components/home/modals/add/AddModal";
import Sidebar from "../components/home/sidebar/Sidebar";
import Navbar from "../components/Navbar";
import TagFilters from "../components/TagFilters";
import { SearchBar } from "../components/SearchBar";
import { useState, useEffect } from "react";
import { VideoFilters, Videos } from "@/types";

import { sortVideos, setFilterData } from "../utils/helpers";
import ShadcnAddModal from "@/components/home/modals/add/ShadcnAddModal";

export default function Home() {
	const [activeVideos, setVideos] = useState<Videos[]>([]);
	const [allVideos, setAllVideos] = useState<Videos[]>([]);

	// import.meta is a runtime metadata object available in ES modules
	// Vite injects an env object on import.meta
	const isProduction = import.meta.env.PROD;
	const baseURL: string = import.meta.env.VITE_API_URL;

	const filterData: VideoFilters = allVideos.reduce(setFilterData, { tournament: {}, year: {} });
	// console.log("filter data...");
	// console.log(filterData);

	// Sort the initial data object by keys
	const filterDataSorted: VideoFilters = { tournament: {}, year: {} };

	const tournamentKeys: string[] = Object.keys(filterData.tournament).sort();
	const yearKeys: string[] = Object.keys(filterData.year).sort();

	tournamentKeys.forEach((key) => {
		filterDataSorted.tournament[key] = filterData.tournament[key];
	});
	yearKeys.forEach((key) => {
		filterDataSorted.year[key] = filterData.year[key];
	});

	const requestOptions: RequestInit = {
		method: "GET",
		mode: "cors",
	};

	useEffect(() => {
		fetch(`${baseURL}/videos`, requestOptions)
			.then((response) => response.json())
			.then((data) => {
				setVideos(data);
				setAllVideos(data);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}, [baseURL]);

	return (
		<>
			<Navbar />

			<div className="body-container">
				<section className="flex bg-gray-custom h-full">
					<Sidebar allVideos={allVideos} setVideos={setVideos} initFilters={filterDataSorted} />
					<main className="archives content-container w-full overflow-auto px-[50px] scrollbar-custom">
						<div className="header-container py-[50px]">
							<h1>Welcome to the Match Archive</h1>
							<SearchBar allVideos={allVideos} setVideos={setVideos} />
						</div>
						<TagFilters></TagFilters>
						<div className="video-container mb-[50px]">
							{!isProduction && <ShadcnAddModal />}
							{activeVideos.sort(sortVideos).map((video: Videos) => {
								return (
									<VideoCard
										key={video.videoId}
										id={video.youtubeId}
										title={video.title}
										duration={video.duration}
										summary={video.summary}
										setAllVideos={setAllVideos}
										setVideos={setVideos}
									/>
								);
							})}
							{!isProduction && <AddModal setAllVideos={setAllVideos} setVideos={setVideos} />}
						</div>
					</main>
				</section>
			</div>
		</>
	);
}
