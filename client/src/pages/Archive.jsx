import VideoCard from "../components/VideoCard";
import AddVideo from "../components/AddVideo";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

export function Archive() {
	const [activeVideos, setVideos] = useState([]);
	const [allVideos, setAllVideos] = useState([]);
	const [query, setQuery] = useState("");

	// const isProduction = import.meta.env.VITE_NODE_ENV === "production";
	const isProduction = import.meta.env.PROD;
	const baseURL = isProduction ? "https://tennis-database.fly.dev" : "http://localhost:8080";

	const initialData = allVideos.reduce((acc, x) => {
		const key = x.tournament.replace(/\s/g, "");
		if (!acc[key]) {
			acc[key] = {
				title: x.tournament,
				year: [x.year],
				count: 1,
				include: true,
			};
		} else {
			if (!acc[key].year.includes(x.year)) {
				acc[key].year.push(x.year);
			}
			acc[key].count++;
		}

		if (!acc[x.year]) {
			acc[x.year] = {
				title: "year",
				include: true,
				count: 1,
			};
		} else {
			acc[x.year].count++;
		}

		return acc;
	}, {});

	// Sort the initial data object by keys
	const keys = Object.keys(initialData).sort();
	const initFilters = {};
	keys.forEach((key) => {
		initFilters[key] = initialData[key];
	});

	console.log(initFilters);

	useEffect(() => {
		fetch(`${baseURL}/api/items`)
			.then((response) => response.json())
			.then((data) => {
				setVideos(data);
				setAllVideos(data);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}, []);

	function sortVideos(a, b) {
		const nameA = a.tournament.toUpperCase();
		const nameB = b.tournament.toUpperCase();

		const yearA = a.year;
		const yearB = b.year;

		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		if (nameA === nameB) {
			return yearB - yearA;
		}
	}

	function filterItems(items, query) {
		query = query.toLowerCase();

		return items.filter((item) => {
			// console.log(item.title);
			// return item.player1.split(" ").some((name) => name.toLowerCase().startsWith(query));
			return item.title.toLowerCase().includes(query);
		});
	}
	let results = filterItems(allVideos, query);

	function handleChange(e) {
		setQuery(e.target.value);
		if (e.target.value == "") {
			setVideos(allVideos);
		} else {
			setVideos(results);
		}
	}

	return (
		<>
			<Navbar />

			<div className="body-container">
				<section className="flex bg-gray-custom" style={{ height: "100%" }}>
					<Sidebar allVideos={allVideos} setVideos={setVideos} initFilters={initFilters} />
					<main className="archives content-container px-[50px]">
						<div className="header-container py-[50px]">
							<h1>Welcome to the Match Archive</h1>
							<input
								className="search-bar"
								type="text"
								placeholder="Search by Player"
								value={query}
								onChange={handleChange}
							/>
						</div>
						<div className="video-container mb-[50px]">
							{activeVideos.sort(sortVideos).map((x) => {
								return (
									<VideoCard
										key={x._id}
										id={x.youtube_id}
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
