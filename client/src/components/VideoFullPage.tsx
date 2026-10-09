import { useState } from "react";
import { AISummary, VideoCards } from "@/types";
import { Star, Sparkles } from "lucide-react";

const emptySummary: AISummary = {
	winner: "",
	score: "",
	matchRating: 0,
	overview: "",
	highlights: [""],
	tags: [""],
	status: null,
};

export default function VideoFullPage({ id, title, duration, summary, summaryStatus }: VideoCards) {
	const [summaryError, setSummaryError] = useState<string | null>(null);
	const [aiSummary, setAiSummary] = useState<AISummary>(() => {
		if (!summary) return emptySummary;
		try {
			const parsed = JSON.parse(summary);
			parsed.status = summaryStatus ?? "default";
			return parsed;
		} catch {
			return emptySummary;
		}
	});
	return (
		<div className="flex flex-col justify-center gap-[15px] mt-2 sm:mt-0 w-full max-w-4xl">
			<div className="aspect-video">
				<iframe
					src={`https://www.youtube.com/embed/${id}?enablejsapi=1&origin=https://thetennisarchive.com`}
					title={title}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerPolicy="strict-origin-when-cross-origin"
					allowFullScreen
					className="w-full h-full"
				></iframe>
			</div>
			{aiSummary.status === "yes" ? (
				<div className="ai-summary flex flex-col gap-3 p-4 font-[500]">
					{/* <h5 className="text-gray-500 font-normal">Winner:</h5> */}
					{/* <div className="flex items-center justify-between"> */}
					<span className="flex items-center gap-1 text-xs text-gray-400 uppercase tracking-wider">
						<Sparkles size={12} /> AI Summary
					</span>
					<h5 className="m-0 font-semibold">{aiSummary.winner} wins</h5>
					{/* </div> */}

					<div className="flex justify-between">
						<div className="flex gap-0.5 items-center">
							{Array.from({ length: 5 }, (_, i) => {
								const fill = Math.min(1, Math.max(0, aiSummary.matchRating - i));
								return (
									<span key={i} className="relative inline-block w-4 h-4">
										<Star size={16} className="absolute text-gray-300" />
										<span className="absolute overflow-hidden" style={{ width: `${fill * 100}%` }}>
											<Star size={16} className="text-yellow-400 fill-yellow-400" />
										</span>
									</span>
								);
							})}
							<span className="text-xs text-gray-500 ml-1">{aiSummary.matchRating}</span>
						</div>
						<span className="text-md font-medium rounded-full px-3 py-1">{aiSummary.score}</span>
					</div>
					<p className="m-0 text-sm leading-relaxed">{aiSummary.overview}</p>
					<div className="border-t border-gray-200 pt-3">
						<p className="m-0 text-xs font-semibold uppercase tracking-wider text-gray-400">
							Match Highlights
						</p>
					</div>

					<ul className="m-0 ps-4 text-sm flex flex-col gap-1 list-disc marker">
						{aiSummary.highlights.map((h, i) => (
							<li key={i}>{h}</li>
						))}
					</ul>
					<div className="flex gap-2 flex-wrap">
						{aiSummary.tags.map((tag) => (
							<span
								key={tag}
								className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-1 capitalize"
							>
								{tag}
							</span>
						))}
					</div>
				</div>
			) : aiSummary.status === "no_transcript" ? (
				<div className="ai-summary p-4 text-md text-red-600 font-[600]">{aiSummary.overview}</div>
			) : summaryError ? (
				<div>
					<div className="ai-summary p-4 text-md text-red-600 font-[600]">{summaryError}</div>
				</div>
			) : (
				<div className="ai-summary p-4 text-md text-red-600 font-[600]">
					Summary not generated for this video
				</div>
			)}
		</div>
	);
}
