import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ShadcnVideoForm from "../ShadcnVideoForm";
import { setVideosFunction, Videos } from "@/assets/types";
import { useState } from "react";

interface AddVideoTypes {
	setAllVideos: setVideosFunction;
	setVideos: setVideosFunction;
}

export default function ShadcnAddModal({ setAllVideos, setVideos }: AddVideoTypes) {
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

	function handleSubmit(data: Videos[]): void {
		setVideos(data);
		setAllVideos(data);
		setIsSubmitted(true);
	}

	return (
		<>
			{/* <div className="card-cover">
				<div className="header-background card-add-new" onClick={openModal}>
					<img src="/icons/add-100.png" alt="add new video icon" width={"100px"} height={"100px"} />
				</div>
			</div> */}
			<Dialog>
				<DialogTrigger className="cursor-pointer h-[235px] mb-[40px] max-w-[370px] w-full bg-center bg-cover bg-gray-300 rounded-[10px] flex justify-center items-center">
					<img src="/icons/add-100.png" alt="add new video icon" width={"100px"} height={"100px"} />
					{/* <button>Add New Video</button> */}
				</DialogTrigger>
				<DialogContent className="sm:max-w-3xl">
					<DialogHeader>
						<DialogTitle>Add New Video</DialogTitle>
						<DialogDescription>Enter video details below.</DialogDescription>
					</DialogHeader>
					{/* your form fields go here */}
					<ShadcnVideoForm
						initialData={{}}
						HTTPmethod="POST"
						endpoint="videos/add"
						onFormSubmit={handleSubmit}
					/>
					<DialogFooter>
						<DialogClose asChild>
							<Button>Submit</Button>
							{/* <button>Submit</button> */}
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
