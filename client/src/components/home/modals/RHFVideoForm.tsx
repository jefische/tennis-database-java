import { Videos, User } from "@/types";
// import Button from "react-bootstrap/Button";
// import { useVideoForm } from "@/hooks/useVideoForm";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectLabel,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { z } from "zod";
import { checkThumbnail } from "@/utils/helpers";
import { pullDuration } from "@/utils/callbacks";
import { useState } from "react";
import { useStore } from "@/hooks/useStore";

const schema = z.object({
	tournament: z.string().min(1, "Please select a tournament"),
	year: z.number({ message: "Please enter a year" }).min(1970).max(2027),
	round: z.string(),
	youtubeId: z.string(),
	//Letters, hyphens, forward slash and apostrophes only
	player1: z.string().regex(/^[a-zA-Z'\s\-\/]+$/, "Please enter valid characters only"),
	player2: z.string().regex(/^[a-zA-Z'\s\-\/]+$/, "Please enter valid characters only"),
	title: z.string(),
	duration: z.string().optional(),
});

interface VideoFormProps {
	initialData: Partial<Omit<Videos, "videoId">>;
	HTTPmethod: string;
	endpoint: string;
	setOpenModal: (open: boolean) => void;
}

export default function RHFVideoForm({ initialData, HTTPmethod, endpoint, setOpenModal }: VideoFormProps) {
	const [dur, setDur] = useState<boolean>(false);
	const [addNewTournament, setAddNewTournament] = useState(false);
	const { user, setUser, allVideos, setAllVideos, setActiveVideos } = useStore();

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			tournament: initialData.tournament ?? "",
			year: initialData.year ?? new Date().getFullYear(),
			round: initialData.round ?? "",
			youtubeId: initialData.youtubeId ?? "",
			player1: initialData.player1 ?? "",
			player2: initialData.player2 ?? "",
			title: initialData.title ?? "",
			duration: initialData.duration ?? "",
		},
	});

	const setDuration = async () => {
		const duration = await pullDuration(form.getValues("youtubeId") ?? "");
		form.setValue("duration", duration);
		setDur(true);
	};

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

		fetch(`${import.meta.env.VITE_API_URL}/${endpoint}`, {
			method: `${HTTPmethod}`,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user?.token}`,
			},
			body: JSON.stringify(data),
		})
			.then((response) => {
				if (!response.ok) {
					if (response.status === 409) {
						form.setError("youtubeId", { message: "Duplicate youtube URL Id found." });
						throw new Error(`${response.status} — Duplicate youtube URL Id found`);
					}
					if (response.status === 401) {
						setUser(null);
						localStorage.removeItem("token");
						toast.error("Admin session expired, please login again.");
						return response.json().then((data) => {
							throw new Error(`${response.status} — ${data.message}`);
						});
					}
					throw new Error(`${response.status} — Network response was not ok`);
				} else {
					return response.json();
				}
			})
			.then((responseData) => {
				setOpenModal(false);
				setAllVideos(responseData);
				setActiveVideos(responseData);
				if (endpoint === "videos/add") {
					toast.success("Video added successfully");
				} else if (endpoint === "videos/edit") {
					toast.success("Video edited successfully");
				}
			})
			.catch((error) => console.error(error)); // Note this will only catch like server timeout errors,
		// a response status of 400 or 500 even though an error code, fetch doesn't consider these as errors in terms of the promise being rejected.
	};

	function handleChanges(field: { onChange: (val: string) => void; name: string }, val: string) {
		field.onChange(val);

		// Get the current round - if this IS the round field, use val; otherwise read from form
		const rawRound = field.name === "round" ? val : form.getValues("round");

		let rounds: string = rawRound;
		switch (rawRound) {
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

	const tournaments = [...new Set(allVideos.map((video) => video.tournament))];

	return (
		<form id="video-form" className="flex flex-col gap-6" onSubmit={form.handleSubmit(saveVideo)} noValidate>
			<div className="grid grid-cols-2 gap-6">
				{/* Radix Select needs Controller */}

				<Controller
					name="tournament"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field mode="light" data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name} className="ps-2">
								Tournament
							</FieldLabel>
							<Select
								mode="light"
								value={addNewTournament ? "add-new" : field.value}
								onValueChange={(val) => {
									if (val === "add-new") {
										setAddNewTournament(true);
										field.onChange(""); // clear the field so they can type
									} else {
										setAddNewTournament(false);
										handleChanges(field, val);
									}
								}}
							>
								<SelectTrigger id={field.name} className="w-full">
									<SelectValue placeholder="Select a tournament" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Choose...</SelectLabel>
										<SelectItem value="add-new">Add New</SelectItem>
										{[...tournaments].sort().map((name) => {
											return (
												<SelectItem key={name} value={name}>
													{name}
												</SelectItem>
											);
										})}
									</SelectGroup>
								</SelectContent>
							</Select>
							{addNewTournament && (
								<Input
									type="text"
									placeholder="Enter new tournament name"
									onChange={(e) => handleChanges(field, e.target.value)}
									autoFocus
								/>
							)}

							{fieldState.error && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				{/* Native input uses register */}
				<Field data-invalid={!!form.formState.errors.year}>
					<FieldLabel htmlFor="year" className="ps-2">
						Year
					</FieldLabel>
					<Input
						type="number"
						step={1}
						{...form.register("year", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
					/>
					{form.formState.errors.year && <FieldError errors={[form.formState.errors.year]} />}
				</Field>
			</div>

			<div className="grid grid-cols-2 gap-6">
				<Field data-invalid={!!form.formState.errors.year}>
					<FieldLabel htmlFor="youtubeId" className="ps-2">
						Youtube ID
					</FieldLabel>
					<Input
						type="text"
						placeholder="e.g. https://www.youtube.com/embed/{id}"
						{...form.register("youtubeId")}
					/>
					{form.formState.errors.youtubeId && <FieldError errors={[form.formState.errors.youtubeId]} />}
				</Field>

				<Controller
					name="round"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name} className="ps-2">
								Round
							</FieldLabel>
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

			<div className="grid grid-cols-2 gap-6">
				<Controller
					name="player1"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name} className="ps-2">
								Player 1
							</FieldLabel>
							<Input
								{...field}
								type="text"
								id={field.name}
								placeholder="e.g. Carlos Alcaraz"
								onChange={(e) => handleChanges(field, e.target.value)}
							/>
							{fieldState.error && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name="player2"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name} className="ps-2">
								Player 2
							</FieldLabel>
							<Input
								{...field}
								type="text"
								id={field.name}
								placeholder="e.g. Tommy Paul"
								onChange={(e) => handleChanges(field, e.target.value)}
							/>
							{fieldState.error && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</div>

			<Controller
				name="title"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<div className="flex items-center gap-4">
							<FieldLabel htmlFor={field.name} className="ps-2">
								Title
							</FieldLabel>

							<Button
								variant="secondary"
								size="default"
								className="mx-4"
								type="button"
								disabled={dur}
								onClick={setDuration}
							>
								YT API
							</Button>
							{dur && <p className="text-foreground">Duration set!</p>}
						</div>
						<Input
							{...field}
							type="text"
							id={field.name}
							placeholder="e.g. Jannik Sinner v Alexander Zverev Full Match | Australian Open 2025 Final (2hr 36min)"
						/>
					</Field>
				)}
			/>
		</form>
	);
}
