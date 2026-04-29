import { YearFilterItem } from "@/assets/types";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { useStore } from "@/hooks/useStore";

export default function YearFilters() {
	// isActive state is used to manage the accordion dropdown filters in the sidebar
	const [isActive, setIsActive] = useState(true);
	const [select, setSelect] = useState(true);
	const { filterData, setFilterData } = useStore();

	let numYears: number = 0; // for Select All count
	const years: [string, YearFilterItem][] = Object.entries(filterData.year).filter(([key, val]) => {
		numYears += val.count;
		return key;
	});

	function selectAll(): void {
		setSelect(!select);
		setFilterData({
			...filterData,
			year: Object.fromEntries(
				Object.entries(filterData.year).map(([key, val]) => {
					return [key, { ...val, include: !select }];
				}),
			),
		});
	}

	const handleChange = (key: string, checked: boolean): void => {
		setFilterData({
			...filterData,
			year: {
				...filterData.year,
				[key]: {
					...filterData.year[key],
					include: checked,
				},
			},
		});
		// If any individual year is unchecked, uncheck the select all input field
		if (checked === false) setSelect(false);
	};

	return (
		<div className="accordion pt-[10px]">
			<div className="accordion-item">
				<div
					className="accordion-title flex justify-between border-top cursor-pointer pt-[10px]"
					onClick={() => setIsActive(!isActive)}
				>
					<h6 className="hover:underline text-lg">Year</h6>
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
									id="selectAllYears"
									className="size-4"
									checked={select}
									onCheckedChange={() => selectAll()}
								/>
								<Label htmlFor="selectAllYears" className="ps-[10px] text-base">
									Select All ({numYears})
								</Label>
							</li>
							{years.map(([key, val]) => {
								let name = key;
								let count = val.count;
								return (
									<li key={name} className="flex items-center p-1">
										<Checkbox
											id={name}
											className="size-4"
											checked={
												filterData.year[name] === undefined
													? true
													: filterData.year[name].include
											}
											onCheckedChange={(checked) => handleChange(key, checked as boolean)}
										/>
										<Label htmlFor={name} className="ps-[10px] text-base">
											{name} ({count})
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
