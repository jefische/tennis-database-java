import VideoCard from "../components/home/modals/VideoCard";
import AddVideo from "../components/home/modals/add/AddVideo";
import Sidebar from "../components/home/sidebar/Sidebar";
import Navbar from "../components/Navbar";
import { SearchBar } from "../components/SearchBar";
import { useState, useEffect } from "react";
import { VideoFilters, Videos } from "@/types";

import { sortVideos, setFilterData } from "../assets/types/helpers";

export default function Home() {
	const [activeVideos, setVideos] = useState<Videos[]>([]);
	const [allVideos, setAllVideos] = useState<Videos[]>([]);

	// import.meta is a runtime metadata object available in ES modules
	// Vite injects an env object on import.meta
	const isProduction = import.meta.env.PROD;
	const baseURL: string = import.meta.env.VITE_API_URL;

	const filterData: VideoFilters = allVideos.reduce(setFilterData, {});

	// Sort the initial data object by keys
	const keys: string[] = Object.keys(filterData).sort();
	const filterDataSorted: VideoFilters = {};
	keys.forEach((key) => {
		filterDataSorted[key] = filterData[key];
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
				<section className="flex bg-gray-custom" style={{ height: "100%" }}>
					<Sidebar allVideos={allVideos} setVideos={setVideos} initFilters={filterDataSorted} />
					<main className="archives content-container px-[50px]">
						<div className="header-container py-[50px]">
							<h1>Welcome to the Match Archive</h1>
							<SearchBar allVideos={allVideos} setVideos={setVideos} />
						</div>
						<div className="video-container mb-[50px]">
							{activeVideos.sort(sortVideos).map((x: Videos) => {
								return (
									<VideoCard
										key={x.videoId}
										id={x.youtubeId}
										title={x.title}
										setAllVideos={setAllVideos}
										setVideos={setVideos}
									/>
								);
							})}
							{!isProduction && <AddVideo setAllVideos={setAllVideos} setVideos={setVideos} />}
						</div>
					</main>
				</section>
			</div>
		</>
	);
}
