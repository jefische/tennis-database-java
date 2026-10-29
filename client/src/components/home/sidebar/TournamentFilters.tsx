import { TournamentFilterItem } from "@/types";
import { useState, useId, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import FilterRow from "./FilterRow";

export default function TournamentFilters({ open }: { open?: boolean }) {
	// isOpen state is used to manage the accordion dropdown filters in the sidebar
	const [isOpen, setisOpen] = useState<boolean>(open ?? true);

	const selected = useStore((s) => s.selected);
	const filterOptions = useStore((s) => s.filterOptions);
	const dispatchFilter = useStore((s) => s.dispatchFilter);
	const allTournaments = useStore((s) => s.allTournaments);
	const uid = useId();

	let numTournaments: number = 0; // for Select All count

	let selectedTournaments: string[] = Object.keys(selected.tournament);

	const tournaments: [string, TournamentFilterItem][] = Object.entries(filterOptions.tournament).filter(
		([key, val]) => {
			numTournaments += val.count;
			return key;
		},
	);

	function handleSelectAll(): void {
		dispatchFilter({ type: "SELECT_ALL", group: "tournament" });
	}

	const handleChange = useCallback(
		(key: string, checked: boolean) => {
			dispatchFilter({ type: "SELECT_ONE", group: "tournament", key, checked });
		},
		[filterOptions, dispatchFilter],
	);

	console.log(filterOptions);
	return (
		<div className="accordion pt-[10px]">
			<div className="accordion-item">
				<div
					className="accordion-title flex justify-between border-top cursor-pointer pt-[10px]"
					onClick={() => setisOpen(!isOpen)}
				>
					<h6 className="hover:underline text-lg">Tournament</h6>
					<ChevronDown className={`size-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
				</div>
				<div
					className={`grid transition-[grid-template-rows] duration-350 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
				>
					<div className="overflow-hidden">
						<ul className="filter py-2 px-0">
							<li className="flex items-center p-1">
								<Checkbox
									id={`${uid}-selectAllTournaments`}
									className="size-4"
									checked={allTournaments}
									onCheckedChange={() => handleSelectAll()}
								/>
								<Label htmlFor={`${uid}-selectAllTournaments`} className="ps-[10px] text-base">
									All Tournaments ({numTournaments})
								</Label>
							</li>
							{tournaments.map(([key, val]) => {
								return (
									<FilterRow
										key={key}
										id={`${uid}-${key}`}
										filterKey={key}
										label={val.title}
										count={val.count}
										item={val}
										checked={selectedTournaments.includes(key)}
										onToggle={handleChange}
									/>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
