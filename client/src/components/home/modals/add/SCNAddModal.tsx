import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RHFVideoForm from "../RHFVideoForm";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function SCNAddModal() {
	const [open, setOpen] = useState<boolean>(false);

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
							tournament: "Monte Carlo",
							year: 2022,
							youtubeId: "jb18sKSCH2w",
							round: "2nd",
							player1: "Carlos Alcaraz",
							player2: "Sebastian Korda",
							title: "Carlos Alcaraz vs. Sebastian Korda | Monte Carlo 2022 Round 2",
						}}
						HTTPmethod="POST"
						endpoint="videos/add"
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
