import VideoCard from "../components/home/modals/VideoCard";
import AddVideo from "../components/home/modals/add/AddVideo";
import Sidebar from "../components/home/sidebar/Sidebar";
import Navbar from "../components/Navbar";
import { SearchBar } from "../components/SearchBar";
import { useState, useEffect } from "react";

import { sortVideos, setFilterData } from "../assets/js/helpers";

export function Archive() {
	const [activeVideos, setVideos] = useState([]);
	const [allVideos, setAllVideos] = useState([]);

	// const isProduction = import.meta.env.VITE_NODE_ENV === "production";
	const isProduction = import.meta.env.PROD;
	const baseURL = isProduction ? "https://tennis-database-java.fly.dev" : "http://localhost:8080";

	const filterData = allVideos.reduce(setFilterData, {});

	// Sort the initial data object by keys
	const keys = Object.keys(filterData).sort();
	const filterDataSorted = {};
	keys.forEach((key) => {
		filterDataSorted[key] = filterData[key];
	});

	const requestOptions = {
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
	}, []);

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
							{activeVideos.sort(sortVideos).map((x) => {
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
