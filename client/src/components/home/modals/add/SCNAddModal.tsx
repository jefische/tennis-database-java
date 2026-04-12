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
import RHFVideoForm from "../RHFVideoForm";
import { setVideosFunction, Videos } from "@/assets/types";
import { useState } from "react";
import { User } from "@/types";
import { toast } from "sonner";

interface AddVideoTypes {
	setAllVideos: setVideosFunction;
	setVideos: setVideosFunction;
	user: User;
}

export default function SCNAddModal({ setAllVideos, setVideos, user }: AddVideoTypes) {
	// const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

	function handleSubmit(data: Videos[]): void {
		setVideos(data);
		setAllVideos(data);
		toast.success("Video added successfully");
	}

	return (
		<>
			<Dialog>
				<DialogTrigger className="cursor-pointer h-[235px] max-w-[370px] w-full bg-center bg-cover bg-gray-300 rounded-[10px] flex justify-center items-center">
					<img src="/icons/add-100.png" alt="add new video icon" width={"100px"} height={"100px"} />
				</DialogTrigger>
				<DialogContent className="sm:max-w-3xl duration-200" onInteractOutside={(e) => e.preventDefault()}>
					<DialogHeader>
						<DialogTitle>Add New Video</DialogTitle>
						<DialogDescription>Enter video details below.</DialogDescription>
					</DialogHeader>
					{/* your form fields go here */}
					<RHFVideoForm
						initialData={{}}
						HTTPmethod="POST"
						endpoint="videos/add"
						onFormSubmit={handleSubmit}
						user={user}
					/>
					<DialogFooter>
						<DialogClose asChild>
							<Button type="submit" form="video-form">
								Submit
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
