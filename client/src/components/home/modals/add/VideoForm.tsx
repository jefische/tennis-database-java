import { useState, useRef, forwardRef } from "react";
import { checkThumbnail } from "../../../../assets/types/helpers";
import { Videos } from "@/assets/types";
import Button from "react-bootstrap/Button";
import { pullDuration } from "@/assets/types/callbacks";

const defaultData = {
	tournament: "US Open",
	year: 2024,
	youtubeId: "JFwsha7u1IE",
	round: "1st",
	player1: "Caroline Wozniacki",
	player2: "Nao Hibino",
	title: "Caroline Wozniacki vs. Nao Hibino | 2024 US Open Round 1 (43 min)",
};

interface VideoFormProps {
	onFormSubmit: (data: Videos[]) => void,
}

export default function VideoForm({ onFormSubmit }: VideoFormProps) {
	const [formData, setFormData] = useState(defaultData);
	const [formValidated, setValidation] = useState<boolean>(false);
	const formRef = useRef<HTMLFormElement>(null);
	const youtubeIdElement = useRef<HTMLInputElement>(null);
	const urlFeedback = useRef<HTMLDivElement>(null);

	async function saveVideo(e: React.FormEvent<HTMLFormElement>): Promise<void> {
		e.preventDefault();

		// Check for valid youtube id:
		const thumbUrl: string = `https://img.youtube.com/vi/${formData.youtubeId}/0.jpg`;

		try {
			await checkThumbnail(thumbUrl);
			if (youtubeIdElement.current)
				youtubeIdElement.current.setCustomValidity(""); //if an input element has a non-empty validationMessage, its checkValidity() method will return false
		} catch (err) {
			console.error(err);
			if (youtubeIdElement.current && urlFeedback.current) {
				youtubeIdElement.current.setCustomValidity("Not a valid youtube URL Id.");
				urlFeedback.current.textContent = youtubeIdElement.current.validationMessage;
				setValidation(true);
				return; // exit saveVideo
			}
		}

		if (formRef.current && formRef.current.checkValidity() === false) {
			// checkValidity() is a brower API that's auto executed on form submit. preventDefault() will stop this behavior.
			// you still want to include preventDefault() if checkValidity() is false to block submission. checkValidity() checks input constraints.
			// checkValidity() returns true if all inputs satisfy their validation rules.
			setValidation(true);
		} else {
			fetch(`http://localhost:8080/videos/add`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			})
				.then((response) => {
					if (!response.ok) {
						if (response.status === 409 && youtubeIdElement.current && urlFeedback.current) {
							youtubeIdElement.current.setCustomValidity("Duplicate youtube URL Id found.");
							urlFeedback.current.textContent = youtubeIdElement.current.validationMessage;
							setValidation(true);
							throw new Error(`${response.status} — Duplicate youtube URL Id found`);
						}
						throw new Error(`${response.status} — Network response was not ok`);
					} else {
						return response.json(); // This is a method that returns a new promise.
					}
				})
				.then((data) => {
					if (youtubeIdElement.current)
						youtubeIdElement.current.setCustomValidity("");
					onFormSubmit(data); // Calls parent function to update state
				})
				.catch((error) => console.error(error)); // Note this will only catch like server timeout errors,
			// a response status of 400 or 500 even though an error code, fetch doesn't consider these as errors in terms of the promise being rejected.
		}
	}

	// Add new handler to update video description automatically based on other fields
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
		const { name, value } = e.target;
		
		// Create updated form data with the new value
		const updatedFormData = {
			...formData,
			[name]: value,
		};

		let rounds: string = updatedFormData.round;
		switch (updatedFormData.round) {
			case "1st":
				rounds = "Round 1";
				break;
			case "2nd":
				rounds = "Round 2";
				break;
			case "3rd":
				rounds = "Round 3";
				break;
			case "4th":
				rounds = "Round 4";
				break;
			default:
				break;
		}

		// Use the updated values to build the title
		setFormData({
			...updatedFormData,
			title: `${updatedFormData.player1} vs. ${updatedFormData.player2} | ${updatedFormData.tournament} ${updatedFormData.year} ${rounds} (0hr 00min)`
		});
	};

	// Separate handler for typing into the title field
	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	}

	const setDuration = async () => {
		const duration = await pullDuration(formData.youtubeId);
		let rounds: string = formData.round;
		switch (formData.round) {
			case "1st":
				rounds = "Round 1";
				break;
			case "2nd":
				rounds = "Round 2";
				break;
			case "3rd":
				rounds = "Round 3";
				break;
			case "4th":
				rounds = "Round 4";
				break;
			default:
				break;
		}
		setFormData({
			...formData,
			title: `${formData.player1} vs. ${formData.player2} | ${formData.tournament} ${formData.year} ${rounds} (${duration})`
		});
	}

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
						ref={youtubeIdElement}
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
						<option value="Quarterfinal">Quarterfinals</option>
						<option value="Semifinal">Semifinals</option>
						<option value="Final">Finals</option>
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
				<Button 
					variant="outline-primary" 
					size="sm" className="mx-4 mb-2" 
					onClick={setDuration}
				>
					YT API
				</Button>
				<input
					className="form-control"
					type="text"
					name="title"
					required
					placeholder="e.g. Jannik Sinner v Alexander Zverev Full Match | Australian Open 2025 Final (2hr 36min)"
					value={formData.title}
					onChange={handleTitleChange}
				/>
				<div className="invalid-feedback">Please enter a video title.</div>
			</div>
		</form>
	);
}
