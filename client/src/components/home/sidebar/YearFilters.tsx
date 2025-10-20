import { setFiltersFunction, VideoFilterItem, VideoFilters } from "@/assets/types";
import { useState } from "react";

interface YearFilterProps {
	formData: VideoFilters,
	setFormData: setFiltersFunction
}

export default function YearFilters({ formData, setFormData }: YearFilterProps) {
	// isActive state is used to manage the accordion dropdown filters in the sidebar
	const [isActive, setIsActive] = useState(true);
	const [select, setSelect] = useState(true);

	let numYears: number = 0; // for Select All count
	const years: [string, VideoFilterItem][] = Object.entries(formData.year).filter(([key, val]) => {
		numYears += val.count;
		return key;
	});

	function selectAll(): void {
		setSelect(!select);
		setFormData({
			...formData,
			year: Object.fromEntries(
				Object.entries(formData.year).map(([key,val]) => {
					return [key, {...val, include: !select}]
				}))
		})
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, checked } = e.target;
		setFormData({
			...formData,
			year: {
				...formData.year,
				[name]: {
					...formData.year[name],
					include: checked,
				} 
			},
		});
		// If any individual year is unchecked, uncheck the select all input field
		if (checked === false) setSelect(false);
	};

	return (
		<div className="accordion-rjs">
			<div className="accordion-item-rjs">
				<div className="accordion-title-rjs" onClick={() => setIsActive(!isActive)}>
					<h6>Year</h6>
					<div className="expand pe-[10px]">{isActive ? "-" : "+"}</div>
				</div>
				<div className={`accordion-content-rjs ${isActive ? "block" : "hidden"}`}>
					<ul className="filter">
						<li>
							<input type="checkbox" checked={select} onChange={selectAll} />
							<label htmlFor="selectAll">Select All ({numYears})</label>
						</li>
						{years.map(([key, val]) => {
							let name = key;
							let count = val.count;
							return (
								<li key={name}>
									<input
										type="checkbox"
										name={name}
										checked={formData.year[name] === undefined ? true : formData.year[name].include}
										onChange={handleChange}
									/>
									<label htmlFor={name}>
										{name} ({count})
									</label>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</div>
	);
}
