import { setFiltersFunction, VideoFilters, TournamentFilterItem } from "@/assets/types";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";

interface TournamentFilterProps {
	formData: VideoFilters;
	setFormData: setFiltersFunction;
}

export default function TournamentFilters({ formData, setFormData }: TournamentFilterProps) {
	// isActive state is used to manage the accordion dropdown filters in the sidebar
	const [isActive, setIsActive] = useState(true);
	const [select, setSelect] = useState(true);

	let numTournaments: number = 0; // for Select All count
	const tournaments: [string, TournamentFilterItem][] = Object.entries(formData.tournament).filter(([key, val]) => {
		numTournaments += val.count;
		return key;
	});

	function selectAll(): void {
		setSelect(!select);
		setFormData({
			...formData,
			tournament: Object.fromEntries(
				Object.entries(formData.tournament).map(([key, val]) => {
					return [key, { ...val, include: !select }];
				}),
			),
		});
	}

	const handleChange = (key: string, checked: boolean): void => {
		setFormData({
			...formData,
			tournament: {
				...formData.tournament,
				[key]: {
					...formData.tournament[key],
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
									id="selectAll"
									className="size-4"
									checked={select}
									onCheckedChange={() => selectAll()}
								/>
								<Label htmlFor="selectAll" className="ps-[10px] text-base">
									Select All ({numTournaments})
								</Label>
							</li>
							{tournaments.map(([key, val], idx) => {
								let title = val.title;
								let count = val.count;
								return (
									<li key={idx} className="flex items-center p-1">
										<Checkbox
											name={key}
											className="size-4"
											checked={
												formData.tournament[key] == undefined
													? true
													: formData.tournament[key].include
											}
											onCheckedChange={(checked) => handleChange(key, checked as boolean)}
										/>

										<Label htmlFor={key} className="ps-[10px] text-base">
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
