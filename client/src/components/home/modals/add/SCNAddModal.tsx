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
import { Button } from "@/components/ui/button";
import RHFVideoForm from "../RHFVideoForm";
import { setVideosFunction, Videos } from "@/assets/types";
import { User } from "@/types";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AddVideoTypes {
	setAllVideos: setVideosFunction;
	setVideos: setVideosFunction;
	user: User;
}

export default function SCNAddModal({ setAllVideos, setVideos, user }: AddVideoTypes) {
	const [open, setOpen] = useState<boolean>(false);
	function handleSubmit(data: Videos[]): void {
		setVideos(data);
		setAllVideos(data);
		toast.success("Video added successfully");
	}

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger
					className={cn(
						"cursor-pointer h-[235px] max-w-[370px] w-full bg-center bg-cover bg-gray-300 rounded-[10px] flex justify-center items-center",
						"hover:scale-105 transition-all duration-500 ease-in-out",
					)}
				>
					<img src="/icons/add-100.png" alt="add new video icon" width={"100px"} height={"100px"} />
				</DialogTrigger>
				<DialogContent
					className="sm:max-w-3xl duration-200"
					mode="light"
					onInteractOutside={(e) => e.preventDefault()}
				>
					<DialogHeader>
						<DialogTitle className="text-3xl">Add New Video</DialogTitle>
						<DialogDescription>Enter video details below.</DialogDescription>
					</DialogHeader>
					{/* your form fields go here */}
					<RHFVideoForm
						initialData={{
							tournament: "Cincinnati Open",
							year: 2024,
							youtubeId: "LEDgye02f1w",
							round: "Finals",
							player1: "Jannik Sinner",
							player2: "Frances Tiafoe",
							title: "Jannik Sinner vs. Frances Tiafoe | Cincinnati Open 2024 Finals",
						}}
						HTTPmethod="POST"
						endpoint="videos/add"
						onFormSubmit={handleSubmit}
						user={user}
						setOpenModal={setOpen}
					/>
					<DialogFooter>
						<Button type="submit" form="video-form">
							Submit
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
