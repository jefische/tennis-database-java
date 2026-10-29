import { useState, useEffect, useRef } from "react";
import { Video } from "@/types";
import { useStore } from "@/hooks/useStore";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import Sidebar from "@/components/home/sidebar/Sidebar";
import TagFilters from "@/components/TagFilters";
import { SearchBar } from "@/components/SearchBar";
import SCNVideoCard from "@/components/home/modals/SCNVideoCard";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import SCNAddModal from "@/components/home/modals/add/SCNAddModal";
import TournamentFilters from "@/components/home/sidebar/TournamentFilters";
import YearFilters from "@/components/home/sidebar/YearFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleChevronUp, SlidersHorizontal } from "lucide-react";
import { useVisibleVideos } from "@/hooks/useVisibleVideos";
import { useShallow } from "zustand/react/shallow";

export default function Home() {
	const [isLoading, setLoading] = useState<boolean>(true);
	const [showScrollTop, setShowScrollTop] = useState(false);
	const mainRef = useRef<HTMLDivElement>(null);

	const pageLoadingSkeletons = Array.from({ length: 12 });

	const { user, allVideos, setAllVideos, setSortMode } = useStore(
		useShallow((s) => ({
			user: s.user,
			allVideos: s.allVideos,
			setAllVideos: s.setAllVideos,
			setSortMode: s.setSortMode,
		})),
	);

	const videos = useVisibleVideos();

	// import.meta is a runtime metadata object available in ES modules
	// Vite injects an env object on import.meta
	// const isProduction = import.meta.env.PROD;
	const baseURL: string = import.meta.env.VITE_API_URL;

	const requestOptions: RequestInit = {
		method: "GET",
		mode: "cors",
	};

	useEffect(() => {
		if (allVideos.length > 0) {
			// Don't refetch videos and rely on zustand store if populated.
			setLoading(false);
			return;
		}
		fetch(`${baseURL}/videos`, requestOptions)
			.then((response) => response.json())
			.then((data) => {
				setAllVideos(
					data.map((v: Video) => {
						return { ...v, createdAt: v.createdAt ? new Date(v.createdAt) : null };
					}),
				);
				setSortMode("tournament");
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [baseURL]);

	useEffect(() => {
		const el = mainRef.current;
		if (!el) return;
		const handleScroll = () => setShowScrollTop(el.scrollTop > 400);
		el.addEventListener("scroll", handleScroll);
		return () => el.removeEventListener("scroll", handleScroll);
	}, []);
	useDocumentTitle("The Tennis Archive | Full Length Tennis Matches");
	useDocumentMeta("Watch full length ATP and WTA matches");

	return (
		<>
			<div className="h-[calc(100%-64px)] mb-4">
				<section className="flex h-full">
					<Sidebar />
					<main
						ref={mainRef}
						className="w-full lg:w-[calc(100%-245px)] overflow-auto ps-[50px] pe-[50px] pb-[200px] scrollbar-custom"
					>
						<div>
							<div className="grid grid-cols-[repeat(auto-fill,minmax(300px,370px))] gap-x-6 gap-y-8 mb-[50px] justify-center">
								<div className="flex flex-col items-start gap-[50px] pt-[50px] 2xl:flex-row col-span-full">
									<h1 className="text-4xl text-center text-foreground font-semibold">
										Welcome to the Match Archive{user?.username && `, ${user?.username}`}
									</h1>
									<SearchBar />
								</div>
								<TagFilters />
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

								{videos.map((video: Video) => {
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
						</div>
					</main>
					{showScrollTop && (
						<Button
							variant="outline"
							size="icon"
							className="fixed bottom-18 right-2 sm:right-4 z-30 rounded-full shadow-lg lg:hidden transition-opacity"
							onClick={() => mainRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
						>
							<CircleChevronUp className="size-7" />
						</Button>
					)}

					<Sheet>
						<SheetTrigger asChild className="lg:hidden">
							<Button
								variant="outline"
								size="icon"
								className="fixed bottom-5 right-2 sm:right-4 z-30 rounded-full shadow-lg animate-hint-pulse"
							>
								<SlidersHorizontal className="size-7" />
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-72 ps-2 overflow-y-auto">
							<SheetHeader>
								<SheetTitle>Filters</SheetTitle>
							</SheetHeader>
							<div className="w-auto px-4">
								<h2 className="text-xl">Filter Match Results</h2>
								<TournamentFilters />
								<YearFilters />
							</div>
						</SheetContent>
					</Sheet>
				</section>
			</div>
		</>
	);
}
