import { Videos } from "@/assets/types";
import Button from "react-bootstrap/Button";
import { useVideoForm } from "@/hooks/useVideoForm";

interface VideoFormProps {
	initialData: Omit<Videos, "videoId">;
	HTTPmethod: string;
	endpoint: string;
	onFormSubmit: (data: Videos[]) => void;
}

export default function VideoForm({ initialData, HTTPmethod, endpoint, onFormSubmit }: VideoFormProps) {
	const {
		formData,
		formValidated,
		formRef,
		youtubeIdElement,
		urlFeedback,
		saveVideo,
		handleChange,
		handleTitleChange,
		setDuration,
	} = useVideoForm({
		initialData: initialData,
		HTTPmethod: HTTPmethod,
		endpoint: endpoint,
		onFormSubmit: onFormSubmit,
	});

	return (
		<form
			id="video-form"
			className={`add-video ${formValidated ? "was-validated" : ""}`}
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
						max="2026"
						step="1"
						name="year"
						value={formData.year}
						onChange={handleChange}
						required
					/>
					<div className="invalid-feedback">Please enter a year between 1970-2026.</div>
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
						<option value="Quarterfinals">Quarterfinals</option>
						<option value="Semifinals">Semifinals</option>
						<option value="Finals">Finals</option>
						<option value="Exhibition">Exhibition</option>
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
						pattern="[a-zA-Z'\s\-\/]+" // Letters, hyphens, forward slash and apostrophes only
					/>
					<div className="invalid-feedback">Please enter a player name (characters only)</div>
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
						pattern="[a-zA-Z'\s\-\/]+" // Letters, hyphens, forward slash and apostrophes only
					/>
					<div className="invalid-feedback">Please enter a player name (characters only)</div>
				</div>
			</div>

			<div>
				<label htmlFor="title">Title</label>
				<Button variant="outline-primary" size="sm" className="mx-4 mb-2" onClick={setDuration}>
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
