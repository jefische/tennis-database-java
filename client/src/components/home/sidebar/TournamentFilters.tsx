import { TournamentFilterItem } from "@/assets/types";
import { useState, useId } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { useStore } from "@/hooks/useStore";

export default function TournamentFilters() {
	// isActive state is used to manage the accordion dropdown filters in the sidebar
	const [isActive, setIsActive] = useState(true);
	const [selectAll, setSelectAll] = useState(true);
	const { filterData, setFilterData } = useStore();
	const uid = useId();

	let numTournaments: number = 0; // for Select All count
	const tournaments: [string, TournamentFilterItem][] = Object.entries(filterData.tournament).filter(([key, val]) => {
		numTournaments += val.count;
		return key;
	});

	// const select = Object.values(filterData.tournament).every((val) => val.include);

	function handleSelectAll(): void {
		setSelectAll(!selectAll);
		setFilterData({
			...filterData,
			tournament: Object.fromEntries(
				Object.entries(filterData.tournament).map(([key, val]) => {
					return [key, { ...val, include: !selectAll }];
				}),
			),
		});
	}

	const handleChange = (key: string, checked: boolean): void => {
		setFilterData({
			...filterData,
			tournament: {
				...filterData.tournament,
				[key]: {
					...filterData.tournament[key],
					include: checked,
				},
			},
		});
		// If any individual year is unchecked, uncheck the select all input field
		if (checked === false) setSelectAll(false);
	};

	return (
		<div className="accordion pt-[10px]">
			<div className="accordion-item">
				<div
					className="accordion-title flex justify-between border-top cursor-pointer pt-[10px]"
					onClick={() => setIsActive(!isActive)}
				>
					<h6 className="hover:underline text-lg">Tournament</h6>
					<ChevronDown
						className={`size-4 transition-transform duration-300 ${isActive ? "rotate-180" : ""}`}
					/>
				</div>
				<div
					className={`grid transition-[grid-template-rows] duration-350 ease-in-out ${isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
				>
					<div className="overflow-hidden">
						<ul className="filter py-2 px-0">
							<li className="flex items-center p-1">
								<Checkbox
									id={`${uid}-selectAllTournaments`}
									className="size-4"
									checked={selectAll}
									onCheckedChange={() => handleSelectAll()}
								/>
								<Label htmlFor={`${uid}-selectAllTournaments`} className="ps-[10px] text-base">
									Select All ({numTournaments})
								</Label>
							</li>
							{tournaments.map(([key, val], idx) => {
								let title = val.title;
								let count = val.count;
								return (
									<li key={idx} className="flex items-center p-1">
										<Checkbox
											id={`${uid}-${key}`}
											className="size-4"
											checked={
												filterData.tournament[key] == undefined
													? true
													: filterData.tournament[key].include
											}
											onCheckedChange={(checked) => handleChange(key, checked as boolean)}
										/>

										<Label htmlFor={`${uid}-${key}`} className="ps-[10px] text-base">
											{title} ({count})
										</Label>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
