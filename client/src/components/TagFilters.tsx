import { useStore } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { useShallow } from "zustand/react/shallow";

interface TagFilter {
	key: string;
	label: string;
}

const TAGS: TagFilter[] = [
	{ key: "allMatches", label: "All Matches" },
	{ key: "comeback", label: "Comeback" },
	{ key: "five-setter", label: "Five-setter" },
	{ key: "rivalry", label: "Rivalry" },
	{ key: "upset", label: "Upset" },
	{ key: "epic", label: "Epic" },
];

export default function TagFilters() {
	const selectedTag = useStore((s) => Object.keys(s.selected.tag)[0]) ?? "allMatches";

	const { dispatchFilter, user, sortMode, setSortMode } = useStore(
		useShallow((s) => ({
			user: s.user,
			sortMode: s.sortMode,
			setSortMode: s.setSortMode,
			dispatchFilter: s.dispatchFilter,
		})),
	);

	function handleSort() {
		// Home derives display order from sortMode, so toggling the mode is what re-sorts the grid.
		setSortMode(sortMode === "newest" ? "oldest" : "newest");
	}

	return (
		<div className="flex flex-wrap gap-4 mb-6 col-span-full" role="group" aria-label="Filter by tag">
			{TAGS.map((t) => {
				const isActive = t.key === selectedTag;
				return (
					<Button
						key={t.key}
						variant="filter"
						size="default"
						aria-pressed={isActive}
						className={`h-9 rounded-full px-4 transition-colors duration-200 ${
							isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
						}`}
						onClick={() => dispatchFilter({ type: "TAG_FILTER", tag: t.key })}
					>
						{t.label}
					</Button>
				);
			})}
			{user?.role === "ADMIN" && (
				<Button
					className={`h-9 capitalize rounded-full px-4 transition-colors duration-200 bg-primary text-primary-foreground hover:bg-primary/90`}
					onClick={handleSort}
				>
					Sort by {sortMode === "newest" ? "oldest" : "newest"}
				</Button>
			)}
		</div>
	);
}
