// Redesigned landing page at /landing
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Shuffle } from "lucide-react";
import { useStore } from "@/hooks/useStore.ts";
import MatchCard from "../components/home/MatchCard.tsx";
import { useArchiveMatches } from "../utils/matchData.ts";

const MOOD_LABELS: Record<string, string> = {
	comeback: "Comebacks",
	"five-setter": "Five-set epics",
	upset: "Upsets",
	rivalry: "Rivalries",
	epic: "Epics",
	classic: "Classics",
};

export default function Landing() {
	const { matches, loading } = useArchiveMatches();
	const dispatchFilter = useStore((s) => s.dispatchFilter);
	const navigate = useNavigate();

	const stats = useMemo(() => {
		const years = matches.map((m) => m.video.year);
		const seconds = matches.reduce((sum, m) => sum + (m.video.duration || 0), 0);
		return {
			count: matches.length,
			hours: Math.round(seconds / 3600),
			tournaments: new Set(matches.map((m) => m.video.tournament)).size,
			firstYear: years.length ? Math.min(...years) : 0,
			lastYear: years.length ? Math.max(...years) : 0,
		};
	}, [matches]);

	// Most common tags in the archive become the "mood" chips.
	const moods = useMemo(() => {
		const counts = new Map<string, number>();
		matches.forEach((m) => m.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
		return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
	}, [matches]);

	const topRated = useMemo(
		() => matches.filter((m) => m.rating > 0).sort((a, b) => b.rating - a.rating).slice(0, 14),
		[matches],
	);

	function pickMood(tag: string) {
		dispatchFilter({ type: "RESET_ALL" });
		dispatchFilter({ type: "TAG_FILTER", tag });
		navigate("/home");
	}

	function surpriseMe() {
		const pool = topRated.length ? topRated : matches;
		if (pool.length === 0) return;
		const pick = pool[Math.floor(Math.random() * pool.length)];
		navigate(`/matches/${pick.video.youtubeId}`);
	}

	return (
		<div className="dark h-full overflow-y-auto bg-neutral-950 text-white scrollbar-custom">
			<style>{`
				@keyframes proto-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
				.proto-marquee { animation: proto-marquee 70s linear infinite; }
				.proto-marquee:hover, .proto-marquee:focus-within { animation-play-state: paused; }
				@keyframes proto-rise { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: none } }
				.proto-rise { animation: proto-rise 0.8s ease-out both; }
				@media (prefers-reduced-motion: reduce) {
					.proto-marquee, .proto-rise { animation: none; }
				}
			`}</style>

			{/* Hero */}
			<section className="relative flex min-h-[80vh] items-center overflow-hidden">
				<div className="absolute inset-0 bg-[url('/bgs/wawrinka.jpg')] bg-cover bg-center" />
				<div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/70 to-neutral-950" />

				<div className="relative mx-auto w-full max-w-5xl px-6 py-20 text-center">
					<p className="proto-rise mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
						The Tennis Archive
					</p>
					<h1 className="proto-rise text-4xl font-bold leading-tight tracking-tight sm:text-6xl" style={{ animationDelay: "0.1s" }}>
						Every great match.
						<br />
						<span className="text-white/60">Start to finish.</span>
					</h1>

					<dl className="proto-rise mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4" style={{ animationDelay: "0.25s" }}>
						<Stat label="Full matches" value={stats.count} loading={loading} />
						<Stat label="Hours of tennis" value={stats.hours} loading={loading} />
						<Stat label="Tournaments" value={stats.tournaments} loading={loading} />
						<div>
							<dt className="text-xs uppercase tracking-wider text-white/50">Spanning</dt>
							<dd className="mt-1 whitespace-nowrap text-2xl font-bold tabular-nums lg:text-4xl">
								{loading || !stats.firstYear ? "—" : `${stats.firstYear}–${stats.lastYear}`}
							</dd>
						</div>
					</dl>

					<div className="proto-rise mt-12 flex flex-wrap justify-center gap-3" style={{ animationDelay: "0.4s" }}>
						<Link
							to="/home"
							className="flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-black transition-transform hover:scale-105"
						>
							Browse the archive <ArrowRight className="size-4" />
						</Link>
						<button
							onClick={surpriseMe}
							disabled={loading}
							className="flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-50"
						>
							<Shuffle className="size-4" /> Surprise me
						</button>
					</div>
				</div>
			</section>

			{/* Mood chips */}
			{moods.length > 0 && (
				<section className="mx-auto max-w-5xl px-6 py-12 text-center">
					<h2 className="mb-6 text-2xl font-semibold">What are you in the mood for?</h2>
					<div className="flex flex-wrap justify-center gap-3">
						{moods.map(([tag, count]) => (
							<button
								key={tag}
								onClick={() => pickMood(tag)}
								className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 capitalize transition-colors hover:border-white/40 hover:bg-white/10"
							>
								{MOOD_LABELS[tag] ?? tag}
								<span className="rounded-full bg-white/10 px-2 text-xs text-white/60 group-hover:text-white">
									{count}
								</span>
							</button>
						))}
					</div>
				</section>
			)}

			{/* Top-rated marquee */}
			{topRated.length > 0 && (
				<section className="py-12">
					<h2 className="mb-6 px-6 text-center text-2xl font-semibold">Highest-rated matches</h2>
					<div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
						<div className="proto-marquee flex w-max gap-5 px-4">
							{/* Rendered twice so the -50% translate loops seamlessly. */}
							{[...topRated, ...topRated].map((m, i) => (
								<MatchCard key={`${m.video.videoId}-${i}`} match={m} />
							))}
						</div>
					</div>
				</section>
			)}

			<footer className="py-10 text-center text-sm text-white/40">
				Prototype · <Link to="/" className="underline hover:text-white">current landing page</Link>
			</footer>
		</div>
	);
}

function Stat({ label, value, loading }: { label: string; value: number; loading: boolean }) {
	const n = useCountUp(value);
	return (
		<div>
			<dt className="text-xs uppercase tracking-wider text-white/50">{label}</dt>
			<dd className="mt-1 text-3xl font-bold tabular-nums sm:text-4xl">{loading ? "—" : n.toLocaleString()}</dd>
		</div>
	);
}

function useCountUp(target: number, duration = 1400) {
	const [value, setValue] = useState(0);
	useEffect(() => {
		if (!target) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setValue(target);
			return;
		}
		let raf = 0;
		const start = performance.now();
		const tick = (now: number) => {
			const p = Math.min(1, (now - start) / duration);
			setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
			if (p < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [target, duration]);
	return value;
}
