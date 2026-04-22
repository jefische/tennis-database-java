import {
	Dialog,
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
import { toast } from "sonner";
import { useStore } from "@/hooks/useStore";

interface EditModalProps {
	open: boolean;
	setEditModal: (open: boolean) => void;
	editData: Videos;
	allVideos: Videos[];
	setActiveVideos: (video: Videos[]) => void;
}

export default function SCNEditModal({ allVideos, setActiveVideos, editData, open, setEditModal }: EditModalProps) {
	const { setAllVideos } = useStore();
	function handleSubmit(data: Videos[]): void {
		setActiveVideos(data);
		setAllVideos(data);
		toast.success("Video edited successfully");
	}

	return (
		<>
			<Dialog open={open} onOpenChange={setEditModal}>
				{/* <DialogTrigger className="cursor-pointer rounded-[10px]">Edit</DialogTrigger> */}
				<DialogContent
					className="sm:max-w-3xl duration-200"
					mode="light"
					onInteractOutside={(e) => e.preventDefault()}
				>
					<DialogHeader>
						<DialogTitle className="text-3xl">Edit Video</DialogTitle>
						<DialogDescription>Enter video details below.</DialogDescription>
					</DialogHeader>
					{/* your form fields go here */}
					<RHFVideoForm
						initialData={editData}
						allVideos={allVideos}
						HTTPmethod="PUT"
						endpoint="videos/edit"
						onFormSubmit={handleSubmit}
						setOpenModal={setEditModal}
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
