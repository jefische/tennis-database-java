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
import { Videos } from "@/assets/types";

interface EditModalProps {
	open: boolean;
	setEditModal: (open: boolean) => void;
	editData: Videos;
}

export default function SCNEditModal({ editData, open, setEditModal }: EditModalProps) {
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
						HTTPmethod="PUT"
						endpoint="videos/edit"
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
