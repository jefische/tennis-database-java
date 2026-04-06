import { Videos } from "@/assets/types";
import Button from "react-bootstrap/Button";
import { useVideoForm } from "@/hooks/useVideoForm";
import { Tournaments } from "@/assets/data/tournaments";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectLabel,
} from "@/components/ui/select";

interface VideoFormProps {
	initialData: Partial<Omit<Videos, "videoId">>;
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
		handleChangeRadix,
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
					<Label htmlFor="tournament">Tournament</Label>
					<Select
						value={formData.tournament}
						onValueChange={(val) => handleChangeRadix("tournament", val)}
						name="tournament"
						required
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select a tournament" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Choose...</SelectLabel>
								{Tournaments.map((name) => {
									return <SelectItem value={name}>{name}</SelectItem>;
								})}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div className="col">
					<Label htmlFor="year">Year</Label>
					<Input
						type="number"
						min={1970}
						max={2026}
						step={1}
						name="year"
						value={formData.year}
						onChange={handleChange}
						required
					/>
				</div>
			</div>

			<div className="row">
				<div className="col">
					<Label htmlFor="youtubeId">Youtube ID</Label>
					<Input
						type="text"
						name="youtubeId"
						required
						placeholder="e.g. https://www.youtube.com/embed/{id}"
						value={formData.youtubeId}
						onChange={handleChange}
						ref={youtubeIdElement}
					/>
				</div>
				<div className="col">
					<Label htmlFor="round">Round</Label>
					<Select
						value={formData.round}
						onValueChange={(val) => handleChangeRadix("round", val)}
						name="round"
						required
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select a round" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Choose...</SelectLabel>
								<SelectItem value="1st">1st</SelectItem>
								<SelectItem value="2nd">2nd</SelectItem>
								<SelectItem value="3rd">3rd</SelectItem>
								<SelectItem value="4th">4th</SelectItem>
								<SelectItem value="Quarterfinals">Quarterfinals</SelectItem>
								<SelectItem value="Semifinals">Semifinals</SelectItem>
								<SelectItem value="Finals">Finals</SelectItem>
								<SelectItem value="Exhibition">Exhibition</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="row">
				<div className="col">
					<Label htmlFor="player1">Player 1</Label>
					<Input
						type="text"
						name="player1"
						required
						placeholder="e.g. Carlos Alcaraz"
						value={formData.player1}
						onChange={handleChange}
						pattern="[a-zA-Z'\s\-\/]+" // Letters, hyphens, forward slash and apostrophes only
					/>
				</div>
				<div className="col">
					<Label htmlFor="player2">Player 2</Label>
					<Input
						type="text"
						name="player2"
						required
						placeholder="e.g. Tommy Paul"
						value={formData.player2}
						onChange={handleChange}
						pattern="[a-zA-Z'\s\-\/]+" // Letters, hyphens, forward slash and apostrophes only
					/>
				</div>
			</div>

			<div>
				<Label htmlFor="title">Title</Label>
				<Button variant="outline-primary" size="sm" className="mx-4 mb-2" onClick={setDuration}>
					YT API
				</Button>
				<Input
					type="text"
					name="title"
					required
					placeholder="e.g. Jannik Sinner v Alexander Zverev Full Match | Australian Open 2025 Final (2hr 36min)"
					value={formData.title}
					onChange={handleTitleChange}
				/>
			</div>
		</form>
	);
}
