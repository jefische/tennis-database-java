import { YearFilterItem } from "@/types";
import { useState, useId, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import FilterRow from "./FilterRow";

export default function YearFilters({ open }: { open?: boolean }) {
	// isOpen state is used to manage the accordion dropdown filters in the sidebar
	const [isOpen, setisOpen] = useState<boolean>(open ?? false);
	const selected = useStore((s) => s.selected);
	const filterOptions = useStore((s) => s.filterOptions);
	const dispatchFilter = useStore((s) => s.dispatchFilter);
	const allYears = useStore((s) => s.allYears);
	const uid = useId();

	let numYears: number = 0; // for Select All count
	let selectedYears: string[] = Object.keys(selected.year);

	const years: [string, YearFilterItem][] = Object.entries(filterOptions.year).filter(([key, val]) => {
		numYears += val.count;
		return key;
	});

	function handleSelectAll(): void {
		dispatchFilter({ type: "SELECT_ALL", group: "year" });
	}

	const handleChange = useCallback(
		(key: string, checked: boolean) => {
			dispatchFilter({ type: "SELECT_ONE", group: "year", key, checked });
		},
		[dispatchFilter],
	);

	return (
		<div className="accordion pt-[10px]">
			<div className="accordion-item">
				<div
					className="accordion-title flex justify-between border-top cursor-pointer pt-[10px]"
					onClick={() => setisOpen(!isOpen)}
				>
					<h6 className="hover:underline text-lg">Year</h6>
					<ChevronDown className={`size-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
				</div>
				<div
					className={`grid transition-[grid-template-rows] duration-350 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
				>
					<div className="overflow-hidden">
						<ul className="filter py-2 px-0">
							<li className="flex items-center p-1">
								<Checkbox
									id={`${uid}-selectAllYears`}
									className="size-4"
									checked={allYears}
									onCheckedChange={() => handleSelectAll()}
								/>
								<Label htmlFor={`${uid}-selectAllYears`} className="ps-[10px] text-base">
									Select All ({numYears})
								</Label>
							</li>
							{years.map(([key, val]) => {
								return (
									<FilterRow
										key={key}
										id={`${uid}-${key}`}
										filterKey={key}
										label={val.title}
										count={val.count}
										item={val}
										checked={selectedYears.includes(key)}
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
