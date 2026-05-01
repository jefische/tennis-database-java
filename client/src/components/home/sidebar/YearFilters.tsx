import { YearFilterItem } from "@/assets/types";
import { useState, useId } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { useStore } from "@/hooks/useStore";

export default function YearFilters() {
	// isActive state is used to manage the accordion dropdown filters in the sidebar
	const [isActive, setIsActive] = useState(true);
	const [selectAll, setSelectAll] = useState(true);
	const { filterData, setFilterData } = useStore();
	const uid = useId();

	let numYears: number = 0; // for Select All count
	const years: [string, YearFilterItem][] = Object.entries(filterData.year).filter(([key, val]) => {
		numYears += val.count;
		return key;
	});

	// const select = Object.values(filterData.year).every((val) => val.include);

	function handleSelectAll(): void {
		setSelectAll(!selectAll);
		setFilterData({
			...filterData,
			year: Object.fromEntries(
				Object.entries(filterData.year).map(([key, val]) => {
					return [key, { ...val, include: !selectAll }];
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
		if (checked === false) setSelectAll(false);
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
									id={`${uid}-selectAllYears`}
									className="size-4"
									checked={selectAll}
									onCheckedChange={() => handleSelectAll()}
								/>
								<Label htmlFor={`${uid}-selectAllYears`} className="ps-[10px] text-base">
									Select All ({numYears})
								</Label>
							</li>
							{years.map(([key, val]) => {
								let name = key;
								let count = val.count;
								return (
									<li key={name} className="flex items-center p-1">
										<Checkbox
											id={`${uid}-${name}`}
											className="size-4"
											checked={
												filterData.year[name] === undefined
													? true
													: filterData.year[name].include
											}
											onCheckedChange={(checked) => handleChange(key, checked as boolean)}
										/>
										<Label htmlFor={`${uid}-${name}`} className="ps-[10px] text-base">
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
