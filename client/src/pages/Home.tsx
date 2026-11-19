// Redesigned home page at /home
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Eye, EyeOff, Play, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { formatHrMin } from "@/utils/format.ts";
import MatchCard from "../components/home/MatchCard.tsx";
import {
	GRAND_SLAMS,
	Match,
	isFinal,
	pairKey,
	roundLabel,
	thumb,
	tournamentColor,
	useArchiveMatches,
} from "../utils/matchData.ts";
import { useStore } from "@/hooks/useStore.ts";

const SPOILER_KEY = "proto-spoilers";

function readSpoilers(): boolean {
	try {
		return localStorage.getItem(SPOILER_KEY) === "on";
	} catch {
		return false;
	}
}

export default function Home() {
	const { matches, loading } = useArchiveMatches();
	const dispatchFilter = useStore((s) => s.dispatchFilter);
	const setSearchQuery = useStore(s => s.setSearchQuery);
	const [spoilers, setSpoilers] = useState(readSpoilers);

	function toggleSpoilers() {
		const next = !spoilers;
		setSpoilers(next);
		try {
			localStorage.setItem(SPOILER_KEY, next ? "on" : "off");
		} catch {
			/* storage unavailable — keep in-memory value */
		}
	}

	const rows = useMemo(() => buildRows(matches), [matches]);
	const featured = useMemo(() => pickFeatured(matches), [matches]);

	return (
		<div className="h-[calc(100%-64px)] overflow-y-auto scrollbar-custom">
			<main className="mx-auto max-w-[1400px] px-4 sm:px-8 pt-8 pb-24">
				<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
					<h1 className="text-3xl font-semibold text-foreground">Match Archive</h1>
					<div className="flex items-center gap-2">
						<Button variant="outline" className="rounded-full" onClick={toggleSpoilers} aria-pressed={spoilers}>
							{spoilers ? <Eye /> : <EyeOff />}
							Spoilers {spoilers ? "on" : "off"}
						</Button>
						<Button asChild className="rounded-full">
							<Link to="/archive" onClick={() => { dispatchFilter({ type: "RESET_ALL" }); setSearchQuery(""); }}>Browse all matches</Link>
						</Button>
					</div>
				</div>

				{loading ? (
					<Skeleton className="mb-10 h-[340px] w-full rounded-2xl" />
				) : (
					featured && <FeaturedBanner match={featured} spoilers={spoilers} />
				)}

				{loading
					? Array.from({ length: 3 }, (_, i) => (
							<div key={i} className="mb-10">
								<Skeleton className="mb-3 h-6 w-48" />
								<div className="flex gap-4 overflow-hidden">
									{Array.from({ length: 5 }, (_, j) => (
										<Skeleton key={j} className="h-[220px] w-[300px] shrink-0 rounded-xl" />
									))}
								</div>
							</div>
						))
					: rows.map((row) => <Row key={row.title} {...row} spoilers={spoilers} />)}
			</main>
		</div>
	);
}

/* ---------- Featured banner ---------- */

function FeaturedBanner({ match, spoilers }: { match: Match; spoilers: boolean }) {
	const { video, summary, rating } = match;
	const [revealed, setRevealed] = useState(false);
	const [imgSrc, setImgSrc] = useState(thumb(video.youtubeId, "maxres"));
	const color = tournamentColor(video.tournament);
	const showResult = spoilers || revealed;
	const highlight = summary?.highlights.find((h) => h.trim().length > 0);

	return (
		<section className="relative mb-10 overflow-hidden rounded-2xl text-white shadow-lg">
			<img
				src={imgSrc}
				onError={() => setImgSrc(thumb(video.youtubeId, "hq"))}
				alt=""
				className="absolute inset-0 size-full object-cover"
			/>
			<div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/75 to-black/10" />
			<div className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: color }} />

			<div className="relative flex max-w-2xl flex-col gap-4 p-6 sm:p-10">
				<span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/70">
					<Sparkles className="size-3.5" /> Match of the day
				</span>
				<h2 className="text-3xl font-bold leading-tight sm:text-4xl">
					{video.player1} <span className="font-light text-white/60">vs.</span> {video.player2}
				</h2>
				<p className="text-white/70">
					{video.tournament} {video.year} · {roundLabel(video.round)}
					{video.duration > 0 && ` · ${formatHrMin(video.duration)}`}
				</p>

				<div className="flex flex-wrap items-center gap-3">
					{rating > 0 && <Stars rating={rating} />}
					{summary?.score &&
						(showResult ? (
							<span className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
								{summary.winner} · {summary.score}
							</span>
						) : (
							<button
								onClick={() => setRevealed(true)}
								className="rounded-full border border-white/30 px-3 py-1 text-sm text-white/80 hover:bg-white/10"
							>
								Reveal result
							</button>
						))}
				</div>

				{highlight && (
					<blockquote
						className={`border-l-4 pl-4 text-white/90 italic transition-[filter] duration-300 ${showResult ? "" : "blur-sm select-none"}`}
						style={{ borderColor: color }}
						aria-hidden={!showResult}
					>
						“{highlight}”
					</blockquote>
				)}

				<Link
					to={`/matches/${video.youtubeId}`}
					className="mt-2 flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-black transition-transform hover:scale-105"
				>
					<Play className="size-4 fill-black" /> Watch match
				</Link>
			</div>
		</section>
	);
}

function Stars({ rating }: { rating: number }) {
	return (
		<span className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
			{Array.from({ length: 5 }, (_, i) => {
				const fill = Math.min(1, Math.max(0, rating - i));
				return (
					<span key={i} className="relative inline-block size-4">
						<Star className="absolute size-4 text-white/30" />
						<span className="absolute overflow-hidden" style={{ width: `${fill * 100}%` }}>
							<Star className="size-4 fill-yellow-400 text-yellow-400" />
						</span>
					</span>
				);
			})}
			<span className="ml-1 text-sm text-white/70">{rating.toFixed(1)}</span>
		</span>
	);
}

/* ---------- Themed rows ---------- */

type RowData = { title: string; subtitle?: string; matches: Match[] };

function Row({ title, subtitle, matches, spoilers }: RowData & { spoilers: boolean }) {
	const scroller = useRef<HTMLDivElement>(null);
	const scrollBy = (dir: 1 | -1) =>
		scroller.current?.scrollBy({ left: dir * scroller.current.clientWidth * 0.8, behavior: "smooth" });

	if (matches.length === 0) return null;

	return (
		<section className="mb-10">
			<div className="mb-3 flex items-end justify-between gap-4">
				<div>
					<h2 className="text-xl font-semibold text-foreground">{title}</h2>
					{subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
				</div>
				<div className="hidden gap-1 sm:flex">
					<Button variant="outline" size="icon" className="rounded-full" onClick={() => scrollBy(-1)} aria-label={`Scroll ${title} left`}>
						<ChevronLeft />
					</Button>
					<Button variant="outline" size="icon" className="rounded-full" onClick={() => scrollBy(1)} aria-label={`Scroll ${title} right`}>
						<ChevronRight />
					</Button>
				</div>
			</div>
			<div ref={scroller} className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pt-1 pb-4 scrollbar-custom">
				{matches.map((m: Match) => (
					<MatchCard key={m.video.videoId} match={m} spoilers={spoilers} />
				))}
			</div>
		</section>
	);
}

function buildRows(matches: Match[]): RowData[] {
	const byRating = (a: Match, b: Match) => b.rating - a.rating;

	const topRated = matches.filter((m) => m.rating > 0).sort(byRating).slice(0, 15);

	const slamFinals = matches
		.filter((m) => GRAND_SLAMS.includes(m.video.tournament) && isFinal(m.video.round))
		.sort((a, b) => b.video.year - a.video.year);

	// Rivalries: player pairs that met at least twice, most-played pairs first.
	const pairs = new Map<string, Match[]>();
	matches.forEach((m) => {
		const key = pairKey(m.video);
		pairs.set(key, [...(pairs.get(key) ?? []), m]);
	});
	const rivalries = [...pairs.values()]
		.filter((group) => group.length >= 2)
		.sort((a, b) => b.length - a.length)
		.flatMap((group) => group.sort((a, b) => b.video.year - a.video.year))
		.slice(0, 20);
	const rivalryCount = [...pairs.values()].filter((g) => g.length >= 2).length;

	const short = matches
		.filter((m) => m.video.duration > 0 && m.video.duration <= 2 * 3600)
		.sort(byRating)
		.slice(0, 20);

	const recent = matches
		.filter((m) => m.video.createdAt)
		.sort((a, b) => new Date(b.video.createdAt!).getTime() - new Date(a.video.createdAt!).getTime())
		.slice(0, 15);

	return [
		{ title: "Highest rated", subtitle: "Ranked by AI match rating", matches: topRated },
		{ title: "Grand Slam finals", subtitle: `${slamFinals.length} finals in the archive`, matches: slamFinals },
		{ title: "Classic rivalries", subtitle: `${rivalryCount} rivalries with multiple meetings`, matches: rivalries },
		{ title: "Short on time?", subtitle: "Under 2 hours", matches: short },
		{ title: "Recently added", matches: recent },
	];
}

/** Rotates daily through the top-rated summarized matches. */
function pickFeatured(matches: Match[]): Match | null {
	const pool = matches
		.filter((m) => m.summary && m.rating > 0)
		.sort((a, b) => b.rating - a.rating)
		.slice(0, 10);
	if (pool.length === 0) return matches[0] ?? null;
	const day = Math.floor(Date.now() / 86_400_000);
	return pool[day % pool.length];
}
