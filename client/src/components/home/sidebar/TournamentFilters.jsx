import { useState } from "react";

export default function TournamentFilters({ formData, setFormData }) {
	// isActive state is used to manage the accordion dropdown filters in the sidebar
	const [isActive, setIsActive] = useState(true);
	const [select, setSelect] = useState(true);

	let numTournaments = 0;
	const tournaments = Object.entries(formData).filter(([key, val]) => {
		if (val.title != "year") {
			numTournaments += val.count;
		}
		return val.title != "year";
	});

	function selectAll() {
		setSelect(!select);
		setFormData((prev) => {
			const updated = Object.fromEntries(
				Object.entries(prev).map(([key, val]) => {
					if (val.title != "year") return [key, { ...val, include: !select }];
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
		// If any tournament is unchecked, uncheck the select all input field
		if (checked == false) setSelect(false);
	};

	return (
		<div className="accordion-rjs">
			<div className="accordion-item-rjs">
				<div className="accordion-title-rjs" onClick={() => setIsActive(!isActive)}>
					<h6>Tournament</h6>
					<div className="expand pe-[10px]">{isActive ? "-" : "+"}</div>
				</div>
				<div className={`accordion-content-rjs ${isActive ? "block" : "hidden"}`}>
					<ul className="filter">
						<li>
							<input type="checkbox" checked={select} onChange={selectAll} />
							<label htmlFor="selectAll">Select All ({numTournaments})</label>
						</li>
						{tournaments.map(([key, val], idx) => {
							let name = val.title.replace(/\s/g, "");
							let title = val.title;
							let count = val.count;
							return (
								<li key={idx}>
									<input
										type="checkbox"
										name={name}
										checked={formData[name] == undefined ? true : formData[name].include}
										onChange={handleChange}
									/>
									<label htmlFor={name}>
										{title} ({count})
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
