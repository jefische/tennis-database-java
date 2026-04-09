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

export default function ShadcnVideoForm({ initialData, HTTPmethod, endpoint, onFormSubmit }: VideoFormProps) {
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
				{/* Radix Select needs Controller */}
				<div className="col">
					<Controller
						name="tournament"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Tournament</FieldLabel>
								<Select value={field.value} onValueChange={field.onChange}>
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
							ref={youtubeIdElement}
						/>
						{form.formState.errors.youtubeId && <FieldError errors={[form.formState.errors.youtubeId]} />}
					</Field>
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
