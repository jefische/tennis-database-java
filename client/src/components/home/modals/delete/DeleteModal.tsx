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
import { setVideosFunction, Videos } from "@/assets/types";
import { toast } from "sonner";
import { useStore } from "@/hooks/useStore";

interface DeleteModalProps {
	open: boolean;
	setDeleteModal: (open: boolean) => void;
	editData: Videos;
	setAllVideos: setVideosFunction;
	setVideos: setVideosFunction;
}

export default function DeleteModal({ open, setDeleteModal, setAllVideos, setVideos, editData }: DeleteModalProps) {
	const { user } = useStore();

	function handleDelete(): void {
		fetch(`${import.meta.env.VITE_API_URL}/videos/${editData.youtubeId}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${user?.token}`,
			},
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`);
				}
				return res.json();
			})
			.then((data) => {
				setAllVideos(data);
				setVideos(data);
			})
			.catch((error) => {
				console.error("There was a problem with the fetch operation:\n", error);
			});

		toast.success("Video deleted");
	}

	return (
		<>
			<Dialog open={open} onOpenChange={setDeleteModal}>
				<DialogContent
					className="sm:max-w-md duration-200"
					mode="light"
					onInteractOutside={(e) => e.preventDefault()}
				>
					<DialogHeader>
						<DialogTitle className="text-2xl">Delete Video</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete <span className="font-semibold">{editData.title}</span>?
							This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex gap-3 sm:justify-end">
						<DialogClose asChild>
							<Button variant="outline" className="cursor-pointer">
								Cancel
							</Button>
						</DialogClose>
						<Button
							variant="destructive"
							onClick={() => {
								handleDelete();
								setDeleteModal(false);
							}}
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
