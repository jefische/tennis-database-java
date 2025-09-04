import { useState, useRef } from "react";

export default function VideoEditForm({ onFormSubmit, editData }) {
	const [formData, setFormData] = useState(editData);
	const [formValidated, setValidation] = useState(false);
	const [urlValidated, setURLValidation] = useState(true);
	const formRef = useRef(null);

	// console.log("printing formData from Video Edit Modal");
	// console.log(formData);

	async function saveVideo(e) {
		e.preventDefault();
		if (formRef.current.checkValidity() == false) {
			// checkValidity() is a brower API that's auto executed on form submit. preventDefault() will stop this behavior.
			// you still want to include preventDefault() if checkValidity() is false to block submission. checkValidity() only checks constraints.
			setURLValidation(true);
			setValidation(true);
		} else {
			fetch(`http://localhost:8080/api/edit`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			})
				.then(async (response) => {
					if (!response.ok) {
						const errorData = await response.json();
						if (errorData.status == 400) {
							setURLValidation(false);
							throw errorData;
						} else {
							throw errorData;
						}
					} else {
						const newData = await response.json();
						setValidation(true);
						onFormSubmit(newData); // Calls parent function to reload video state
					}
				})
				.catch((error) => console.error("Error:", error)); // Note this will only catch like server timeout errors,
			// a response status of 400 or 500 even though an error code, fetch doesn't consider these as errors in terms of the promise being rejected.
		}
	}

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<form
			id="video-form"
			className={`add-video ${formValidated ? "was-validated" : ""}`}
			style={{ maxWidth: "800px" }}
			ref={formRef}
			method="post"
			noValidate
			onSubmit={saveVideo}
		>
			<div className="row">
				<div className="col">
					<label className="form-label" htmlFor="tournament">
						Tournament
					</label>
					<select
						className="form-select"
						name="tournament"
						id="tournament"
						value={formData.tournament}
						onChange={handleChange}
						required
					>
						<option disabled value="">
							Choose...
						</option>
						<option value="Australian Open">Australian Open</option>
						<option value="French Open">French Open</option>
						<option value="Wimbledon">Wimbledon</option>
						<option value="US Open">US Open</option>
					</select>
					<div className="invalid-feedback">Please enter a tournament.</div>
				</div>
				<div className="col">
					<label className="form-label" htmlFor="year">
						Year
					</label>
					<input
						className="form-control"
						type="number"
						min="1970"
						max="2025"
						step="1"
						name="year"
						value={formData.year}
						onChange={handleChange}
						required
					/>
					<div className="invalid-feedback">Please enter a year between 1970-2025.</div>
				</div>
			</div>

			<div className="row">
				<div className="col">
					<label className="form-label" htmlFor="youtube_id">
						Youtube ID
					</label>
					<input
						className="form-control"
						type="text"
						name="youtube_id"
						required
						placeholder="e.g. https://www.youtube.com/embed/{id}"
						value={formData.youtube_id}
						onChange={handleChange}
					/>
					{urlValidated ? (
						<div className="invalid-feedback">Please enter a valid Youtube URL id.</div>
					) : (
						<div className="duplicate-id-feedback">Youtube URL id already exists.</div>
					)}
				</div>
				<div className="col">
					<label className="form-label" htmlFor="round">
						Round
					</label>
					<select className="form-select" name="round" id="round" value={formData.round} onChange={handleChange} required>
						<option disabled value="">
							Choose...
						</option>
						<option value="1st">1st</option>
						<option value="2nd">2nd</option>
						<option value="3rd">3rd</option>
						<option value="4th">4th</option>
						<option value="Quarterfinals">Quarterfinals</option>
						<option value="Semifinals">Semifinals</option>
						<option value="Finals">Finals</option>
					</select>
					<div className="invalid-feedback">Please select a round.</div>
				</div>
			</div>

			<div className="row">
				<div className="col">
					<label className="form-label" htmlFor="player1">
						Player 1
					</label>
					<input
						className="form-control"
						type="text"
						name="player1"
						required
						placeholder="e.g. Carlos Alcaraz"
						value={formData.player1}
						onChange={handleChange}
					/>
					<div className="invalid-feedback">Please enter a player name.</div>
				</div>
				<div className="col">
					<label className="form-label" htmlFor="player2">
						Player 2
					</label>
					<input
						className="form-control"
						type="text"
						name="player2"
						required
						placeholder="e.g. Tommy Paul"
						value={formData.player2}
						onChange={handleChange}
					/>
					<div className="invalid-feedback">Please enter a player name.</div>
				</div>
			</div>

			<div>
				<label htmlFor="title">Title</label>
				<input
					className="form-control"
					type="text"
					name="title"
					required
					placeholder="e.g. Jannik Sinner v Alexander Zverev Full Match | Australian Open 2025 Final (2hr 36min)"
					value={formData.title}
					onChange={handleChange}
				/>
				<div className="invalid-feedback">Please enter a video title.</div>
			</div>
		</form>
	);
}
