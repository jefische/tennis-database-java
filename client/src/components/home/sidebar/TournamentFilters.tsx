import { setFiltersFunction, VideoFilters, VideoFilterItem } from "@/assets/types";
import { useState } from "react";

interface TournamentFilterProps {
	formData: VideoFilters;
	setFormData: setFiltersFunction;
}

export default function TournamentFilters({ formData, setFormData }: TournamentFilterProps) {
	// isActive state is used to manage the accordion dropdown filters in the sidebar
	const [isActive, setIsActive] = useState(true);
	const [select, setSelect] = useState(true);

	let numTournaments: number = 0; // for Select All count
	const tournaments: [string, VideoFilterItem][] = Object.entries(formData.tournament).filter(([key, val]) => {
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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, checked } = e.target;
		setFormData({
			...formData,
			tournament: {
				...formData.tournament,
				[name]: {
					...formData.tournament[name],
					include: checked,
				},
			},
		});
		// If any individual year is unchecked, uncheck the select all input field
		if (checked === false) setSelect(false);
	};

	return (
		<div className="accordion-rjs pt-[10px]">
			<div className="accordion-item-rjs">
				<div
					className="accordion-title-rjs flex justify-content-between border-top cursor-pointer pt-[10px]"
					onClick={() => setIsActive(!isActive)}
				>
					<h6 className="hover:underline">Tournament</h6>
					<div className="expand pe-[10px]">{isActive ? "-" : "+"}</div>
				</div>
				<div
					className={`grid transition-[grid-template-rows] duration-350 ease-in-out ${isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
				>
					<div className="overflow-hidden">
						<ul className="filter py-2 px-0">
							<li className="p-1">
								<input type="checkbox" checked={select} onChange={selectAll} />
								<label htmlFor="selectAll" className="ps-[10px]">
									Select All ({numTournaments})
								</label>
							</li>
							{tournaments.map(([key, val], idx) => {
								let title = val.title;
								let count = val.count;
								return (
									<li key={idx} className="p-1">
										<input
											type="checkbox"
											name={key}
											checked={
												formData.tournament[key] == undefined
													? true
													: formData.tournament[key].include
											}
											onChange={handleChange}
										/>
										<label htmlFor={key} className="ps-[10px]">
											{title} ({count})
										</label>
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
