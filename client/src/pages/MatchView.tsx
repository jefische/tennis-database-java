import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Videos } from "@/types";
import VideoFullPage from "@/components/VideoFullPage";
import { Button } from "@/components/ui/button";

export default function MatchView() {
	const { youtubeId } = useParams<{ youtubeId: string }>();
	const [matchVideo, setMatchVideo] = useState<Videos>();
	const baseURL: string = import.meta.env.VITE_API_URL;

	useEffect(() => {
		fetch(`${baseURL}/videos/${youtubeId}`)
			.then((res) => {
				if (!res.ok) throw new Error(`${res.status}`);
				return res.json();
			})
			.then((data) => setMatchVideo(data))
			.catch((err) => console.error(err));
	}, []);
	return (
		<div className="h-[calc(100%-64px)] mb-4">
			<section className="h-full overflow-y-auto">
				<div className="flex flex-col items-center px-4 py-10 w-fit mx-auto">
					<Button variant="filter" className="self-start mb-4">
						<Link to="/home">Back to Dashboard</Link>
					</Button>
					{matchVideo && (
						<VideoFullPage
							key={matchVideo.videoId}
							id={matchVideo.youtubeId}
							title={matchVideo.title}
							duration={matchVideo.duration}
							summary={matchVideo.summary}
							summaryStatus={matchVideo.summaryStatus}
						/>
					)}
				</div>
			</section>
		</div>
	);
}
