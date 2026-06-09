import { Link, useParams } from "react-router-dom";
import { PLAYER_DATA } from "@/assets/data/players";
import { useStore } from "@/hooks/useStore";
import { useEffect, useRef } from "react";

export default function PlayerShotDetail() {
	const { slug, videoId } = useParams<{ slug: string; videoId: string }>();
	const containerRef = useRef<HTMLDivElement>(null);
	const PlayerVideos = PLAYER_DATA[slug || ""];
	const video = PlayerVideos.videos.filter((vid) => vid.id === videoId)[0];
	const RELATED_VIDEOS = PlayerVideos.videos.filter((vid) => vid.shotType === video.shotType);
	const { user } = useStore();

	useEffect(() => {
		containerRef.current?.scrollTo(0, 0);
	}, [videoId]);

	return (
		<>
			{user?.role === "ADMIN" ? (
				<>
					<div ref={containerRef} className="h-[calc(100vh-64px)] overflow-auto px-4 py-8 sm:px-8 lg:px-16">
						{/* Breadcrumb */}
						<nav className="mb-6 text-sm text-muted-foreground">
							<Link to="/players" className="hover:text-foreground">
								Players
							</Link>
							<span className="mx-2">/</span>
							<Link to={`/players/${slug}`} className="hover:text-foreground">
								{PlayerVideos.name}
							</Link>
							<span className="mx-2">/</span>
							<span className="text-foreground">{video.shotType}</span>
						</nav>

						{/* Page Title */}
						<h1 className="mb-6 text-2xl font-bold text-foreground lg:text-3xl">{video.title}</h1>

						{/* Main Content: Video + Gear Sidebar */}
						<div className="flex flex-col gap-8 xl:flex-row">
							{/* Video Embed */}
							<div className="flex-1">
								<div className="relative w-full overflow-hidden rounded-xl aspect-[3/4] sm:aspect-[1/1] md:aspect-video md:max-w-5xl">
									<iframe
										key={videoId}
										className="absolute inset-0 h-full w-full"
										src={`https://www.youtube.com/embed/${videoId}?loop=1&playlist=${videoId}?enablejsapi=1&origin=https://thetennisarchive.com`}
										title={video.title}
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
										referrerPolicy="strict-origin-when-cross-origin"
										allowFullScreen
									/>
								</div>

								{/* Shot details below video */}
								<div className="mt-4 flex flex-wrap gap-2">
									<span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
										{video.shotType}
									</span>
									<span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
										{video.variant}
									</span>
								</div>
							</div>

							{/* Gear Sidebar (Affiliate Zone) */}
							<aside className="w-full shrink-0 lg:w-72 xl:w-80">
								<div className="rounded-xl border border-border bg-card p-5">
									<h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
										Gear Used
									</h3>
									<ul className="flex flex-col gap-4">
										{PlayerVideos.gear.map((item) => (
											<li key={item.name} className="flex items-center justify-between">
												<div>
													<p className="text-sm font-medium text-foreground">{item.name}</p>
													<p className="text-xs text-muted-foreground">{item.type}</p>
												</div>
												<a
													href={item.link}
													className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
												>
													Buy
												</a>
											</li>
										))}
									</ul>
								</div>

								{/* Ad Placeholder */}
								<div className="mt-6 flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
									<span className="text-sm text-muted-foreground">Ad Space (300×250)</span>
								</div>
							</aside>
						</div>

						{/* Related Videos */}
						<section className="mt-12">
							<h2 className="mb-4 text-xl font-semibold text-foreground">Related Videos</h2>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl">
								{RELATED_VIDEOS.map((rv) => (
									<Link
										key={rv.id}
										to={`/players/${slug}/${rv.id}`}
										className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:scale-[1.02] hover:shadow-lg"
									>
										<div
											className="h-36 w-full bg-cover bg-center"
											style={{
												backgroundImage: `url(https://img.youtube.com/vi/${rv.id}/0.jpg)`,
											}}
										/>
										<div className="p-3">
											<p className="text-sm font-medium text-foreground group-hover:text-primary">
												{rv.title}
											</p>
											<p className="text-xs text-muted-foreground">{PlayerVideos.name}</p>
										</div>
									</Link>
								))}
							</div>
						</section>

						{/* Bottom Ad Banner */}
						<div className="mt-12 flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
							<span className="text-sm text-muted-foreground">Ad Space (728×90 Banner)</span>
						</div>
					</div>
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
