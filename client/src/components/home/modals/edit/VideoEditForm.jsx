import { useState, useRef } from "react";
import { checkThumbnail } from "../../../../assets/js/helpers";

export default function VideoEditForm({ onFormSubmit, editData }) {
	const [formData, setFormData] = useState(editData);
	const [formValidated, setValidation] = useState(false);
	const formRef = useRef(null);
	const urlRef = useRef(null);
	const urlFeedback = useRef(null);

	async function saveVideo(e) {
		e.preventDefault();

		// Check for valid youtube id:
		const thumbUrl = `https://img.youtube.com/vi/${formData.youtubeId}/0.jpg`;

		try {
			await checkThumbnail(thumbUrl);
			urlRef.current.setCustomValidity(""); //if an input element has a non-empty validationMessage, its checkValidity() method will return false
		} catch (err) {
			console.error(err);
			urlRef.current.setCustomValidity("Not a valid youtube URL Id.");
			urlFeedback.current.textContent = urlRef.current.validationMessage;
			setValidation(true);
			return; // exit saveVideo
		}

		if (formRef.current.checkValidity() == false) {
			setValidation(true);
		} else {
			fetch(`http://localhost:8080/videos/edit`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			})
				.then((response) => {
					if (!response.ok) {
						if (response.status === 409) {
							urlRef.current.setCustomValidity("Duplicate youtube URL Id found.");
							urlFeedback.current.textContent = urlRef.current.validationMessage;
							setValidation(true);
							throw new Error(`${response.status} — Duplicate youtube URL Id found`);
						}
						throw new Error(`${response.status} — Network response was not ok`);
					} else {
						return response.json();
					}
				})
				.then((data) => {
					urlRef.current.setCustomValidity("");
					onFormSubmit(data); // Calls parent function to reload video state
				})
				.catch((error) => console.error(error)); // Note this will only catch like server timeout errors,
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
					<label className="form-label" htmlFor="youtubeId">
						Youtube ID
					</label>
					<input
						className="form-control"
						type="text"
						name="youtubeId"
						required
						placeholder="e.g. https://www.youtube.com/embed/{id}"
						value={formData.youtubeId}
						onChange={handleChange}
						ref={urlRef}
					/>
					<div className="invalid-feedback" ref={urlFeedback}></div>
				</div>
				<div className="col">
					<label className="form-label" htmlFor="round">
						Round
					</label>
					<select
						className="form-select"
						name="round"
						id="round"
						value={formData.round}
						onChange={handleChange}
						required
					>
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
						pattern="^[a-zA-Z\s]+$"
					/>
					<div className="invalid-feedback">Please enter a player name (characters only).</div>
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
						pattern="^[a-zA-Z\s]+$"
					/>
					<div className="invalid-feedback">Please enter a player name (characters only).</div>
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
