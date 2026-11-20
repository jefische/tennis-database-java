// Enriched match card for /landing and /home
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { formatHrMin } from "@/utils/format.ts";
import { Match, firstSentence, roundLabel, thumb, tournamentColor } from "../../utils/matchData.ts";

type Props = {
	match: Match;
	spoilers?: boolean;
	className?: string;
};

export default function MatchCard({ match, spoilers = false, className }: Props) {
	const { video, summary, rating, tags } = match;
	const color = tournamentColor(video.tournament);

	return (
		<Link
			to={`/matches/${video.youtubeId}`}
			className={cn(
				"group relative block shrink-0 w-[260px] sm:w-[300px] snap-start overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
				className,
			)}
		>
			<div className="relative aspect-video bg-muted">
				<img
					src={thumb(video.youtubeId)}
					alt=""
					loading="lazy"
					className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
				/>
				<div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

				{rating > 0 && (
					<span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-yellow-300 backdrop-blur">
						<Star className="size-3 fill-yellow-300" />
						{rating.toFixed(1)}
					</span>
				)}
				{video.duration > 0 && (
					<span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
						{formatHrMin(video.duration)}
					</span>
				)}

				{/* Hover detail: full overview only when spoilers are on, otherwise just the tags. */}
				{(spoilers ? summary?.overview : tags.length > 0) && (
					<div className="absolute inset-0 flex items-end bg-black/80 p-3 text-xs leading-relaxed text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
						{spoilers && summary ? (
							<p className="line-clamp-4">{firstSentence(summary.overview)}</p>
						) : (
							<div className="flex flex-wrap gap-1.5">
								{tags.slice(0, 4).map((t) => (
									<span key={t} className="rounded-full bg-white/15 px-2 py-0.5 capitalize">
										{t}
									</span>
								))}
							</div>
						)}
					</div>
				)}
			</div>

			<div className="h-1" style={{ backgroundColor: color }} />

			<div className="p-3">
				<p className="truncate text-sm font-semibold text-foreground">
					{video.player1} vs. {video.player2}
				</p>
				<p className="truncate text-xs text-muted-foreground">
					{video.tournament} {video.year} · {roundLabel(video.round)}
				</p>
			</div>
		</Link>
	);
}
