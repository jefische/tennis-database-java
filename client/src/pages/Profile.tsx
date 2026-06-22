import CustomVideos from "../components/profile/CustomVideos";
import { useStore } from "@/hooks/useStore";
import { PROFILE } from "@/assets/data/profile";

export default function Profile() {
	const { user } = useStore();

	return (
		<>
			{user?.role === "ADMIN" ? (
				<div className="h-[calc(100%-64px)] overflow-y-auto bg-background px-10 py-8">
					{/* Header */}
					<div className="text-center mb-12">
						<h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
							Profile Section
						</h1>
						<p className="mt-3 text-muted-foreground text-lg">My personal videos</p>
					</div>

					<section className="flex flex-wrap justify-center gap-10 text-center text-3xl py-10">
						{PROFILE.map((video) => (
							<CustomVideos url={video.S3URL} title={video.title} />
						))}
					</section>
				</div>
			) : (
				<h1 style={{ textAlign: "center", marginTop: "10%" }}>Profile page is under development</h1>
			)}
		</>
	);
}
