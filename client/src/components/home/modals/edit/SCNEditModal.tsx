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

interface EditModalProps {
	open: boolean;
	setEditModal: (open: boolean) => void;
	editData: Videos;
	setAllVideos: setVideosFunction;
	setVideos: setVideosFunction;
	user: User;
}

export default function SCNEditModal({ setAllVideos, setVideos, user, editData, open, setEditModal }: EditModalProps) {
	// const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

	function handleSubmit(data: Videos[]): void {
		setVideos(data);
		setAllVideos(data);
		toast.success("Video edited successfully");
	}

	return (
		<>
			<Dialog open={open} onOpenChange={setEditModal}>
				{/* <DialogTrigger className="cursor-pointer rounded-[10px]">Edit</DialogTrigger> */}
				<DialogContent className="sm:max-w-3xl duration-200" onInteractOutside={(e) => e.preventDefault()}>
					<DialogHeader>
						<DialogTitle>Edit Video</DialogTitle>
						<DialogDescription>Enter video details below.</DialogDescription>
					</DialogHeader>
					{/* your form fields go here */}
					<RHFVideoForm
						initialData={editData}
						HTTPmethod="POST"
						endpoint="videos/edit"
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
