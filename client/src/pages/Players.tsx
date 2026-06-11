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
			{user?.role === "ADMIN" || user === null ? (
				<>
					<div
						className="h-[calc(100%-64px)] flex flex-col items-center text-center bg-background px-10 py-8 lg:px-16 overflow-auto"
						ref={mainRef}
					>
						{/* Page Header */}
						<div className="mb-8">
							<h1 className="text-3xl font-bold text-foreground">Player Videos</h1>
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

						<div className="grid gap-6 grid-cols-2 md:flex md:flex-wrap md:justify-center">
							{filteredPlayers.map((player) => (
								<Link
									key={player.slug}
									to={`/players/${player.slug}`}
									className={cn(
										"group overflow-hidden relative rounded-xl border border-border bg-card transition-all hover:scale-[1.02] hover:shadow-lg",
										"max-h-[300px] max-w-[300px]",
									)}
								>
									<img
										src={player.image}
										alt={player.name}
										className="w-full h-full object-contain"
									/>
									<h3 className="absolute inset-0 flex flex-col items-center justify-center text-4xl font-bold text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]">
										{player.name.split(" ").map((part, i) => (
											<span key={i}>{part}</span>
										))}
									</h3>
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
