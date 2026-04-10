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
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { z } from "zod";
import { checkThumbnail } from "@/utils/helpers";

const schema = z.object({
	tournament: z.string().min(1, "Please select a tournament"),
	year: z.number({ message: "Please enter a year" }).min(1970).max(2026),
	round: z.string(),
	youtubeId: z.string(),
	player1: z.string(),
	player2: z.string(),
	title: z.string(),
});

interface VideoFormProps {
	initialData: Partial<Omit<Videos, "videoId">>;
	HTTPmethod: string;
	endpoint: string;
	onFormSubmit: (data: Videos[]) => void;
}

export default function RHFVideoForm({ initialData, HTTPmethod, endpoint, onFormSubmit }: VideoFormProps) {
	const { formValidated, setDuration } = useVideoForm({
		initialData: initialData,
		HTTPmethod: HTTPmethod,
		endpoint: endpoint,
		onFormSubmit: onFormSubmit,
	});

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			tournament: "",
			year: 2026,
			round: "",
			youtubeId: "",
			player1: "",
			player2: "",
			title: "",
		},
	});

	const saveVideo = async (data: z.infer<typeof schema>) => {
		form.clearErrors("youtubeId"); // reset any previous manual error
		// Check for valid youtube id:
		const thumbUrl = `https://img.youtube.com/vi/${data.youtubeId}/0.jpg`;

		try {
			await checkThumbnail(thumbUrl);
		} catch (err) {
			console.error(err);
			form.setError("youtubeId", { message: "Not a valid YouTube URL Id." });
			return; // exit saveVideo
		}

		fetch(`http://localhost:8080/${endpoint}`, {
			method: `${HTTPmethod}`,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((response) => {
				if (!response.ok) {
					if (response.status === 409) {
						form.setError("youtubeId", { message: "Duplicate youtube URL Id found." });
						throw new Error(`${response.status} — Duplicate youtube URL Id found`);
					}
					throw new Error(`${response.status} — Network response was not ok`);
				} else {
					return response.json();
				}
			})
			.then((data) => {
				onFormSubmit(data); // Calls parent function to reload video state
			})
			.catch((error) => console.error(error)); // Note this will only catch like server timeout errors,
		// a response status of 400 or 500 even though an error code, fetch doesn't consider these as errors in terms of the promise being rejected.
	};

	function handleChanges(field: { onChange: (val: string) => void; name: string }, val: string) {
		field.onChange(val);

		// Get the current round - if this IS the round field, use val; otherwise read from form
		const rawRound = field.name === "round" ? val : form.getValues("round");

		let rounds: string = rawRound;
		switch (val) {
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

		// Same logic for remaining shared fields — use val if this is the appropriate field
		const tournament = field.name === "tournament" ? val : form.getValues("tournament");
		const player1 = field.name === "player1" ? val : form.getValues("player1");
		const player2 = field.name === "player2" ? val : form.getValues("player2");
		const year = field.name === "year" ? val : form.getValues("year");

		// Use the updated values to build the title
		form.setValue("title", `${player1} vs. ${player2} | ${tournament} ${year} ${rounds}`);
	}

	return (
		<form
			id="video-form"
			className={`add-video ${formValidated ? "was-validated" : ""}`}
			method="post"
			onSubmit={form.handleSubmit(saveVideo)}
		>
			<div className="row">
				{/* Radix Select needs Controller */}
				<div className="col">
					<Controller
						name="tournament"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Tournament</FieldLabel>
								<Select value={field.value} onValueChange={(val) => handleChanges(field, val)}>
									<SelectTrigger id={field.name} className="w-full">
										<SelectValue placeholder="Select a tournament" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Choose...</SelectLabel>
											{Tournaments.map((name) => {
												return (
													<SelectItem key={name} value={name}>
														{name}
													</SelectItem>
												);
											})}
										</SelectGroup>
									</SelectContent>
								</Select>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
				</div>

				{/* Native input uses register */}
				<div className="col">
					<Field data-invalid={!!form.formState.errors.year}>
						<FieldLabel htmlFor="year">Year</FieldLabel>
						<Input
							type="number"
							step={1}
							{...form.register("year", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
						/>
						{form.formState.errors.year && <FieldError errors={[form.formState.errors.year]} />}
					</Field>
				</div>
			</div>

			<div className="row">
				<div className="col">
					<Field data-invalid={!!form.formState.errors.year}>
						<FieldLabel htmlFor="youtubeId">Youtube ID</FieldLabel>
						<Input
							type="text"
							placeholder="e.g. https://www.youtube.com/embed/{id}"
							{...form.register("youtubeId")}
						/>
						{form.formState.errors.youtubeId && <FieldError errors={[form.formState.errors.youtubeId]} />}
					</Field>
				</div>
				<div className="col">
					<Controller
						name="round"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Round</FieldLabel>
								<Select value={field.value} onValueChange={(val) => handleChanges(field, val)}>
									<SelectTrigger id={field.name} className="w-full">
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
							</Field>
						)}
					/>
				</div>
			</div>

			<div className="row">
				<div className="col">
					<Controller
						name="player1"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Player 1</FieldLabel>
								<Input
									{...field}
									type="text"
									id={field.name}
									placeholder="e.g. Carlos Alcaraz"
									onChange={(e) => handleChanges(field, e.target.value)}
									pattern="[a-zA-Z'\s\-\/]+" // Letters, hyphens, forward slash and apostrophes only
								/>
							</Field>
						)}
					/>
				</div>
				<div className="col">
					<Controller
						name="player2"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Player 2</FieldLabel>
								<Input
									{...field}
									type="text"
									id={field.name}
									placeholder="e.g. Tommy Paul"
									onChange={(e) => handleChanges(field, e.target.value)}
									pattern="[a-zA-Z'\s\-\/]+" // Letters, hyphens, forward slash and apostrophes only
								/>
							</Field>
						)}
					/>
				</div>
			</div>

			<div>
				<Controller
					name="title"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>Title</FieldLabel>
							<Button variant="outline-primary" size="sm" className="mx-4 mb-2" onClick={setDuration}>
								YT API
							</Button>
							<Input
								{...field}
								type="text"
								id={field.name}
								placeholder="e.g. Jannik Sinner v Alexander Zverev Full Match | Australian Open 2025 Final (2hr 36min)"
							/>
						</Field>
					)}
				/>
			</div>
		</form>
	);
}
