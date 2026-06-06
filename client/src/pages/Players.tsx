import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { PLAYERS } from "../assets/data/players";
import { Button } from "@/components/ui/button";
import { CircleChevronUp } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { cn } from "@/lib/utils";

const SHOT_TYPES = [
	"All",
	"ATP",
	"WTA",
	"Left handed",
	// "Eastern forehand",
	// "Semi-western forehand",
	// "Western forehand",
	"One-handed backhand",
	"Platform Serve",
	"Pinpoint Serve",
] as const;
const variants = ["Kick", "One-handed"] as const;

export default function Players() {
	const [activeFilter, setActiveFilter] = useState<string>("All");
	const [showScrollTop, setShowScrollTop] = useState(false);
	const mainRef = useRef<HTMLDivElement>(null);
	const { user } = useStore();

	const filteredPlayers = activeFilter === "All" ? PLAYERS : PLAYERS.filter((p) => p.filters.includes(activeFilter));

	// const filteredVideos =
	// 	activeFilter === "All" ? SHOT_VIDEOS : SHOT_VIDEOS.filter((v) => v.shotType === activeFilter);

	useEffect(() => {
		const el = mainRef.current;
		if (!el) return;
		const handleScroll = () => setShowScrollTop(el.scrollTop > 400);
		el.addEventListener("scroll", handleScroll);
		return () => el.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<>
			{user?.role === "ADMIN" ? (
				<>
					<div className="h-[calc(100%-64px)] bg-background px-10 py-8 lg:px-16 overflow-auto" ref={mainRef}>
						{/* Page Header */}
						<div className="mb-8">
							<h1 className="text-3xl font-bold text-foreground">Players</h1>
							<p className="mt-2 text-muted-foreground">Select a player or filter by player attribute.</p>
						</div>

						{/* Filter Bar */}
						<div className="mb-8 flex flex-wrap gap-2">
							{SHOT_TYPES.map((shot) => (
								<button
									key={shot}
									onClick={() => setActiveFilter(shot)}
									className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
										activeFilter === shot
											? "bg-foreground text-background"
											: "bg-muted text-muted-foreground hover:bg-muted/80"
									}`}
								>
									{shot}
								</button>
							))}
						</div>

						{/* Content: Player Cards (no filter) or Video Grid (filter active) */}

						<div className="grid gap-6 grid-cols-2 md:flex md:flex-wrap">
							{filteredPlayers.map((player) => (
								<Link
									key={player.slug}
									to={`/players/${player.slug}`}
									className={cn(
										"group overflow-hidden rounded-xl border border-border bg-card transition-all hover:scale-[1.02] hover:shadow-lg",
										"max-h-[300px] max-w-[300px]",
									)}
								>
									<img
										src={player.image}
										alt={player.name}
										className="w-full object-contain max-h-[300px]"
									/>
									{/* <div
										className="h-48 w-full bg-contain bg-center bg-no-repeat hidden"
										style={{ backgroundImage: `url(${player.image})` }}
									/> */}
									{/* <div className="p-4">
										<h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
											{player.name}
										</h3>
										<div className="mt-2 flex flex-wrap gap-1.5">
											{player.shots.map((shot) => (
												<span
													key={shot}
													className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
												>
													{shot}
												</span>
											))}
										</div>
									</div> */}
								</Link>
							))}
						</div>
					</div>
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
				</>
			) : (
				<div className="h-[calc(100%-64px)] mb-4 bg-background">
					<h1 className="text-foreground" style={{ textAlign: "center", paddingTop: "10%" }}>
						Player page is under development
					</h1>
				</div>
			)}
		</>
	);
}
