import { useState } from "react";

export default function YearFilters({ formData, setFormData }) {
	// isActive state is used to manage the accordion dropdown filters in the sidebar
	const [isActive, setIsActive] = useState(true);
	const [select, setSelect] = useState(true);

	let numYears = 0;
	const years = Object.entries(formData).filter(([key, val]) => {
		if (val.title == "year") {
			numYears += val.count;
		}
		return val.title == "year";
	});

	function selectAll() {
		setSelect(!select);
		setFormData((prev) => {
			const updated = Object.fromEntries(
				Object.entries(prev).map(([key, val]) => {
					if (val.title == "year") return [key, { ...val, include: !select }];
					return [key, val];
				}),
			);
			return updated;
		});
	}

	const handleChange = (e) => {
		const { name, checked } = e.target;
		setFormData({
			...formData,
			[name]: {
				...formData[name],
				include: checked,
			},
		});
		// If any individual year is unchecked, uncheck the select all input field
		if (checked == false) setSelect(false);
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
										checked={formData[name] == undefined ? true : formData[name].include}
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
