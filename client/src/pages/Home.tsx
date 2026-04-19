import Sidebar from "../components/home/sidebar/Sidebar";
import TagFilters from "../components/TagFilters";
import { SearchBar } from "../components/SearchBar";
import { useState, useEffect, useMemo } from "react";
import { VideoFilters, Videos, User } from "@/types";
import SCNVideoCard from "@/components/home/modals/SCNVideoCard";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { sortVideos, setFilterData } from "../utils/helpers";
import SCNAddModal from "@/components/home/modals/add/SCNAddModal";
import TournamentFilters from "@/components/home/sidebar/TournamentFilters";
import YearFilters from "@/components/home/sidebar/YearFilters";

export default function Home({ user }: { user: User }) {
	const [activeVideos, setVideos] = useState<Videos[]>([]);
	const [allVideos, setAllVideos] = useState<Videos[]>([]);
	// formData is used to manage the checkboxes and pass them to form submit for ytVideo filtering and rendering in Home.jsx
	const [formData, setFormData] = useState<VideoFilters>({ tournament: {}, year: {} });
	const [filterOpen, setFilterOpen] = useState<boolean>(false);

	// import.meta is a runtime metadata object available in ES modules
	// Vite injects an env object on import.meta
	// const isProduction = import.meta.env.PROD;
	const baseURL: string = import.meta.env.VITE_API_URL;

	const requestOptions: RequestInit = {
		method: "GET",
		mode: "cors",
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		let filterVideos: Videos[] = [];

		// First extract years to include for filtering
		const yearsToInclude: number[] = Object.entries(formData.year)
			.filter(([key, val]) => {
				return val.include === true;
			})
			.map(([key, value]) => Number(key));

		// Then, filter formData for tournaments to include by years selected from above.
		for (var key in formData.tournament) {
			if (formData.tournament[key].include == true) {
				const temp: Videos[] = allVideos.filter(
					(x) => formData.tournament[key].title === x.tournament && yearsToInclude.includes(x.year),
				);

				if (temp.length > 0) {
					filterVideos = filterVideos.concat(temp);
				}
			}
		}
		setVideos(filterVideos);
		setFilterOpen(false);
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

	useEffect(() => {
		// Sort the initial data object by keys
		const filterData: VideoFilters = allVideos.reduce(setFilterData, { tournament: {}, year: {} });
		const sorted: VideoFilters = { tournament: {}, year: {} };

		const tournamentKeys: string[] = Object.keys(filterData.tournament).sort();
		const yearKeys: string[] = Object.keys(filterData.year).sort();

		tournamentKeys.forEach((key) => {
			sorted.tournament[key] = filterData.tournament[key];
		});
		yearKeys.forEach((key) => {
			sorted.year[key] = filterData.year[key];
		});
		setFormData(sorted);
	}, [allVideos]);

	return (
		<>
			<div className="h-[calc(100%-64px)] mb-4">
				<section className="flex bg-background h-full">
					<Sidebar formData={formData} setFormData={setFormData} handleFilter={handleSubmit} />
					<main className="w-full md:w-[calc(100%-245px)] overflow-auto px-[50px] pb-[500px] scrollbar-custom">
						<div className="flex flex-col items-center gap-[50px] py-[50px] xl:flex-row justify-center">
							<h1 className="text-4xl text-center text-foreground font-semibold">
								Welcome to the Match Archive{user?.username && `, ${user?.username}`}
							</h1>
							<SearchBar allVideos={allVideos} setVideos={setVideos} />
						</div>
						<TagFilters></TagFilters>
						<div className="grid grid-cols-[repeat(auto-fill,minmax(300px,370px))] gap-x-6 gap-y-8 mb-[50px] justify-center">
							{user?.role === "ADMIN" && (
								<>
									<SCNAddModal setAllVideos={setAllVideos} setVideos={setVideos} user={user} />
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
										summaryStatus={video.summaryStatus}
										setAllVideos={setAllVideos}
										setVideos={setVideos}
										user={user}
									/>
								);
							})}
						</div>
					</main>
					<Sheet open={filterOpen} onOpenChange={setFilterOpen}>
						<SheetTrigger asChild className="md:hidden">
							<Button
								variant="outline"
								size="icon"
								className="fixed bottom-5 right-2 sm:right-4 z-30 rounded-full shadow-lg"
							>
								<SlidersHorizontal className="size-5" />
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-72 ps-2 overflow-y-auto">
							<SheetHeader>
								<SheetTitle>Filters</SheetTitle>
							</SheetHeader>
							<form className="w-auto px-4" onSubmit={handleSubmit}>
								<h2 className="text-xl">Filter Match Results</h2>
								<TournamentFilters formData={formData} setFormData={setFormData} />
								<YearFilters formData={formData} setFormData={setFormData} />
								<Button size="lg" className="my-1" type="submit">
									Apply Filters
								</Button>
							</form>
						</SheetContent>
					</Sheet>
				</section>
			</div>
		</>
	);
}
