import { Link, useParams } from "react-router-dom";
import { PLAYER_DATA } from "@/assets/data/players";
import { useStore } from "@/hooks/useStore";

export default function PlayerDetail() {
	const { slug } = useParams<{ slug: string }>();
	const player = PLAYER_DATA[slug || ""];
	const { user } = useStore();

	if (!player) {
		return (
			<div className="min-h-[calc(100vh-64px)] bg-background px-4 py-8 sm:px-8 lg:px-16">
				<p className="text-foreground">Player not found.</p>
				<Link to="/players" className="text-primary hover:underline">
					Back to Players
				</Link>
			</div>
		);
	}

	// Group videos by shot type
	const grouped = player.videos.reduce<Record<string, typeof player.videos>>((acc, video) => {
		if (!acc[video.shotType]) acc[video.shotType] = [];
		acc[video.shotType].push(video);
		return acc;
	}, {});

	return (
		<>
			{user?.role === "ADMIN" ? (
				<div className="min-h-[calc(100vh-64px)] bg-background px-4 py-8 sm:px-8 lg:px-16">
					{/* Breadcrumb */}
					<nav className="mb-6 text-sm text-muted-foreground">
						<Link to="/players" className="hover:text-foreground">
							Players
						</Link>
						<span className="mx-2">/</span>
						<span className="text-foreground">{player.name}</span>
					</nav>

					<h1 className="mb-8 text-3xl font-bold text-foreground">{player.name}</h1>

					{/* Videos grouped by shot type */}
					{Object.entries(grouped).map(([shotType, videos]) => (
						<section key={shotType} className="mb-10">
							<h2 className="mb-4 text-xl font-semibold text-foreground">{shotType}</h2>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{videos.map((video) => (
									<Link
										key={video.id}
										to={`/players/${slug}/${video.id}`}
										className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:scale-[1.02] hover:shadow-lg"
									>
										<div
											className="h-40 w-full bg-cover bg-center"
											style={{
												backgroundImage: `url(https://img.youtube.com/vi/${video.id}/0.jpg)`,
											}}
										/>
										<div className="p-3">
											<p className="text-sm font-medium text-foreground group-hover:text-primary">
												{video.title}
											</p>
											<span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
												{video.variant}
											</span>
										</div>
									</Link>
								))}
							</div>
						</section>
					))}
				</div>
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
