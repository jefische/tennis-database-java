import VideoCard from "../components/home/modals/VideoCard";
import AddModal from "../components/home/modals/add/AddModal";
import Sidebar from "../components/home/sidebar/Sidebar";
import Navbar from "../components/Navbar";
import TagFilters from "../components/TagFilters";
import { SearchBar } from "../components/SearchBar";
import { useState, useEffect } from "react";
import { VideoFilters, Videos, User } from "@/types";
import SCNVideoCard from "@/components/home/modals/SCNVideoCard";

import { sortVideos, setFilterData } from "../utils/helpers";
import SCNAddModal from "@/components/home/modals/add/SCNAddModal";

export default function Home({ user }: { user: User }) {
	const [activeVideos, setVideos] = useState<Videos[]>([]);
	const [allVideos, setAllVideos] = useState<Videos[]>([]);

	// import.meta is a runtime metadata object available in ES modules
	// Vite injects an env object on import.meta
	// const isProduction = import.meta.env.PROD;

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
			<div className="h-[calc(100%-64px)] mb-4">
				<section className="flex bg-gray-800 h-full">
					<Sidebar allVideos={allVideos} setVideos={setVideos} initFilters={filterDataSorted} />
					<main className="w-full md:w-[calc(100%-245px)] overflow-auto px-[50px] pb-[500px] scrollbar-custom">
						<div className="flex flex-col items-center gap-[50px] py-[50px] xl:flex-row justify-center">
							<h1 className="text-4xl text-center">Welcome to the Match Archive {user?.username}</h1>
							<SearchBar allVideos={allVideos} setVideos={setVideos} />
						</div>
						<TagFilters></TagFilters>
						<div className="grid grid-cols-[repeat(auto-fill,minmax(300px,370px))] gap-x-6 gap-y-20 mb-[50px] justify-center">
							{user?.role === "ADMIN" && (
								<>
									<SCNAddModal setAllVideos={setAllVideos} setVideos={setVideos} user={user} />{" "}
									{/* <AddModal setAllVideos={setAllVideos} setVideos={setVideos} /> */}
								</>
							)}
							{activeVideos.sort(sortVideos).map((video: Videos) => {
								return (
									<SCNVideoCard
										key={video.videoId}
										id={video.youtubeId}
										title={video.title}
										duration={video.duration}
										summary={video.summary}
										setAllVideos={setAllVideos}
										setVideos={setVideos}
										user={user}
									/>
								);
							})}
						</div>
					</main>
				</section>
			</div>
		</>
	);
}
