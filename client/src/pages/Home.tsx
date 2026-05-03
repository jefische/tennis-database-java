import Sidebar from "../components/home/sidebar/Sidebar";
import TagFilters from "../components/TagFilters";
import { SearchBar } from "../components/SearchBar";
import { useState, useEffect } from "react";
import { VideoFilters, Videos, User } from "@/types";
import SCNVideoCard from "@/components/home/modals/SCNVideoCard";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { sortVideos, initFilterData } from "../utils/helpers";
import SCNAddModal from "@/components/home/modals/add/SCNAddModal";
import TournamentFilters from "@/components/home/sidebar/TournamentFilters";
import YearFilters from "@/components/home/sidebar/YearFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/hooks/useStore";

export default function Home() {
	// const [activeVideos, setActiveVideos] = useState<Videos[]>([]);
	// const [allVideos, setAllVideos] = useState<Videos[]>([]);
	// formData is used to manage the checkboxes and pass them to form submit for ytVideo filtering and rendering in Home.jsx
	// const [filterData, setFilterData] = useState<VideoFilters>({ tournament: {}, year: {} });
	const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
	const [isLoading, setLoading] = useState<boolean>(true);
	const pageLoadingSkeletons = Array.from({ length: 12 });

	const {
		user,
		allVideos,
		setAllVideos,
		activeVideos,
		setActiveVideos,
		filterData,
		setFilterData,
		addFilterVideos,
		resetFilterVideos,
	} = useStore();

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
		let filteredVideos: Videos[] = [];

		// First extract years to include for filtering
		const yearsToInclude: number[] = Object.entries(filterData.year)
			.filter(([key, val]) => {
				return val.include === true;
			})
			.map(([key, value]) => Number(key));

		// Then, filter formData for tournaments to include by years selected from above.
		for (var key in filterData.tournament) {
			if (filterData.tournament[key].include == true) {
				const temp: Videos[] = allVideos.filter(
					(x) => filterData.tournament[key].title === x.tournament && yearsToInclude.includes(x.year),
				);

				if (temp.length > 0) {
					filteredVideos = filteredVideos.concat(temp);
				}
			}
		}
		resetFilterVideos();
		addFilterVideos(filteredVideos);
		setActiveVideos(filteredVideos);
		setMobileFilterOpen(false);
	};

	useEffect(() => {
		if (allVideos.length > 0) {
			// Don't refetch videos and rely on zustand store if populated.
			setActiveVideos(allVideos);
			resetFilterVideos();
			addFilterVideos(allVideos);
			setLoading(false);
			return;
		}
		fetch(`${baseURL}/videos`, requestOptions)
			.then((response) => response.json())
			.then((data) => {
				setAllVideos(data);
				resetFilterVideos();
				addFilterVideos(data);
				setActiveVideos(data);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			})
			.finally(() => setLoading(false));
	}, [baseURL]);

	useEffect(() => {
		// Sort the initial data object by keys
		const initData: VideoFilters = allVideos.reduce(initFilterData, { tournament: {}, year: {} });
		const sorted: VideoFilters = { tournament: {}, year: {} };

		const tournamentKeys: string[] = Object.keys(initData.tournament).sort();
		const yearKeys: string[] = Object.keys(initData.year).sort();

		tournamentKeys.forEach((key) => {
			sorted.tournament[key] = initData.tournament[key];
		});
		yearKeys.forEach((key) => {
			sorted.year[key] = initData.year[key];
		});
		setFilterData(sorted);
	}, [allVideos]);

	return (
		<>
			<div className="h-[calc(100%-64px)] mb-4">
				<section className="flex bg-background h-full">
					<Sidebar handleFilter={handleSubmit} />
					<main className="w-full lg:w-[calc(100%-245px)] overflow-auto px-[50px] pb-[200px] scrollbar-custom">
						<div className="flex flex-col items-center gap-[50px] py-[50px] xl:flex-row justify-center">
							<h1 className="text-4xl text-center text-foreground font-semibold">
								Welcome to the Match Archive{user?.username && `, ${user?.username}`}
							</h1>
							<SearchBar />
						</div>
						<TagFilters></TagFilters>
						<div className="grid grid-cols-[repeat(auto-fill,minmax(300px,370px))] gap-x-6 gap-y-8 mb-[50px] justify-center">
							{user?.role === "ADMIN" && <SCNAddModal />}
							{isLoading && (
								<>
									{pageLoadingSkeletons.map((_, i) => {
										return (
											<Skeleton
												key={i}
												className="relative h-[235px] max-w-[370px] w-full bg-center bg-cover rounded-[10px]"
											/>
										);
									})}
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
									/>
								);
							})}
						</div>
					</main>
					<Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
						<SheetTrigger asChild className="lg:hidden">
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
								<TournamentFilters />
								<YearFilters />
								<Button size="lg" className="mt-4 mb-8" type="submit">
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
