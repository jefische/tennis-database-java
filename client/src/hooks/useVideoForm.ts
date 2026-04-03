import { useState, useRef } from "react";
import { Videos } from "@/assets/types";
import { checkThumbnail } from "@/utils/helpers";
import { pullDuration } from "@/utils/callbacks";

interface useVideoFormProps {
	initialData: Partial<Omit<Videos, "videoId">>;
	HTTPmethod: string;
	endpoint: string;
	onFormSubmit: (data: Videos[]) => void;
}

export function useVideoForm({ initialData, HTTPmethod, endpoint, onFormSubmit }: useVideoFormProps) {
	// All shared state
	const [formData, setFormData] = useState<Partial<Omit<Videos, "videoId">>>(initialData);
	const [formValidated, setValidation] = useState<boolean>(false);
	const formRef = useRef<HTMLFormElement>(null);
	const youtubeIdElement = useRef<HTMLInputElement>(null);
	const urlFeedback = useRef<HTMLDivElement>(null);

	// All shared handlers

	async function saveVideo(e: React.FormEvent<HTMLFormElement>): Promise<void> {
		e.preventDefault();

		// Check for valid youtube id:
		const thumbUrl = `https://img.youtube.com/vi/${formData.youtubeId}/0.jpg`;

		try {
			await checkThumbnail(thumbUrl);
			if (youtubeIdElement.current) youtubeIdElement.current.setCustomValidity(""); //if an input element has a non-empty validationMessage, its checkValidity() method will return false
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
			setValidation(true);
		} else {
			fetch(`http://localhost:8080/${endpoint}`, {
				method: `${HTTPmethod}`,
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
						return response.json();
					}
				})
				.then((data) => {
					if (youtubeIdElement.current) youtubeIdElement.current.setCustomValidity("");
					onFormSubmit(data); // Calls parent function to reload video state
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

		let rounds: string = updatedFormData.round ?? "";
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
			title: `${updatedFormData.player1} vs. ${updatedFormData.player2} | ${updatedFormData.tournament} ${updatedFormData.year} ${rounds}`,
		});
	};

	// Separate handler for user input into the title field
	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const setDuration = async () => {
		const duration = await pullDuration(formData.youtubeId ?? "");
		setFormData({
			...formData,
			duration: duration,
		});
	};

	return {
		formData,
		formValidated,
		formRef,
		youtubeIdElement,
		urlFeedback,
		saveVideo,
		handleChange,
		handleTitleChange,
		setDuration,
	};
}
