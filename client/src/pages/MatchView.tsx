import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Videos } from "@/types";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import VideoFullPage from "@/components/VideoFullPage";
import { Button } from "@/components/ui/button";

export default function MatchView() {
	const { youtubeId } = useParams<{ youtubeId: string }>();
	const [matchVideo, setMatchVideo] = useState<Videos>();
	const baseURL: string = import.meta.env.VITE_API_URL;

	/* Note useDocumentMeta hook is to handle the case where direct URL is accessed and <meta>
	   description is added via Match controller. Otherwise stale meta data persists across the user
	   session. If no direct URL is accessed the <meta> description tag is not included in the 
	   original index.html load, and the update silently fails as no element is available for 
	   query selection.

	   This is purely a cosmetic benefit for live View Source inspection, no SEO benefit.
	*/

	function getDescription(): string {
		if (matchVideo?.summary == null) {
			return "Watch full length ATP and WTA matches";
		}
		try {
			const parsed = JSON.parse(matchVideo?.summary);
			return parsed.overview;
		} catch {
			return "Watch full length ATP and WTA matches";
		}
	}

	useEffect(() => {
		fetch(`${baseURL}/videos/${youtubeId}`)
			.then((res) => {
				if (!res.ok) throw new Error(`${res.status}`);
				return res.json();
			})
			.then((data) => setMatchVideo(data))
			.catch((err) => console.error(err));
	}, []);
	useDocumentTitle(matchVideo?.title ?? "The Tennis Archive");
	useDocumentMeta(getDescription());

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
