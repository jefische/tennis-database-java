import { useState } from "react";
import { Link } from "react-router-dom";
import { PLAYERS, SHOT_VIDEOS } from "../assets/data/players";

const SHOT_TYPES = ["All", "Forehand", "Backhand", "Serve", "Volley", "Return"] as const;
const variants = ["Kick", "One-handed"] as const;

export default function Players() {
	const [activeFilter, setActiveFilter] = useState<string>("All");

	const filteredPlayers = activeFilter === "All" ? PLAYERS : PLAYERS.filter((p) => p.shots.includes(activeFilter));

	const filteredVideos =
		activeFilter === "All" ? SHOT_VIDEOS : SHOT_VIDEOS.filter((v) => v.shotType === activeFilter);

	return (
		<div className="min-h-[calc(100vh-64px)] bg-background px-4 py-8 sm:px-8 lg:px-16">
			{/* Page Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-foreground">Players</h1>
				<p className="mt-2 text-muted-foreground">
					Browse player shot techniques or filter by shot type to compare across players.
				</p>
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
			{activeFilter === "All" ? (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{filteredPlayers.map((player) => (
						<Link
							key={player.slug}
							to={`/players/${player.slug}`}
							className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:scale-[1.02] hover:shadow-lg"
						>
							<div
								className="h-48 w-full bg-cover bg-center"
								style={{ backgroundImage: `url(${player.image})` }}
							/>
							<div className="p-4">
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
							</div>
						</Link>
					))}
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{filteredVideos.map((video) => (
						<Link
							key={video.id}
							to={`/players/shot/${video.id}`}
							className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:scale-[1.02] hover:shadow-lg"
						>
							<div
								className="h-48 w-full bg-cover bg-center"
								style={{
									backgroundImage: `url(https://img.youtube.com/vi/${video.id}/0.jpg)`,
								}}
							/>
							<div className="p-4">
								<h3 className="text-sm font-semibold text-foreground group-hover:text-primary">
									{video.title}
								</h3>
								<div className="mt-2 flex items-center justify-between">
									<span className="text-xs text-muted-foreground">{video.player}</span>
									<span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
										{video.variant}
									</span>
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
