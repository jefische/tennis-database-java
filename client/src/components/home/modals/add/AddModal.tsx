import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import VideoForm from "../VideoForm";
import { Fragment, useState, useEffect } from "react";
import { setVideosFunction, Videos } from "@/assets/types";

const defaultData: Omit<Videos, "videoId"> = {
	tournament: "US Open",
	year: 2024,
	youtubeId: "JFwsha7u1IE",
	round: "1st",
	player1: "Caroline Wozniacki",
	player2: "Nao Hibino",
	title: "Caroline Wozniacki vs. Nao Hibino | 2024 US Open Round 1 (43 min)",
	duration: "(0hr 43min)",
	summary: "",
	summaryStatus: "yes",
};

interface AddVideoTypes {
	setAllVideos: setVideosFunction;
	setVideos: setVideosFunction;
}

export default function AddModal({ setAllVideos, setVideos }: AddVideoTypes) {
	const [modalIsOpen, setIsOpen] = useState<boolean>(false);
	// The Parent (Modal Component) holds the isSubmitted state.
	// The Child (Form Component) triggers setIsSubmitted(true) when the form is submitted.
	// The Parent (Modal Component) updates and displays the submission message instead of the form.
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	function handleSubmit(data: Videos[]): void {
		setVideos(data);
		setAllVideos(data);
		setIsSubmitted(true);
	}

	useEffect(() => {
		if (isSubmitted) {
			const timer = setTimeout(() => {
				setIsSubmitted(false);
				closeModal();
			}, 1000); // 3 seconds
			return () => clearTimeout(timer); // Cleanup timer on unmount
		}
	}, [isSubmitted, closeModal]);

	return (
		<Fragment>
			<div className="card-cover">
				<div className="header-background card-add-new" onClick={openModal}>
					<img src="/icons/add-100.png" alt="add new video icon" width={"100px"} height={"100px"} />
				</div>
			</div>
			{isSubmitted ? (
				<Modal show={true} centered backdrop="static" aria-labelledby="video modal">
					<Modal.Body>
						<div className="flex justify-center">
							<h3 className="flex gap-3 items-center">
								<img src="/icons/check-mark-50.png" alt="green check mark" />
								Video Added Successfully!
							</h3>
						</div>
					</Modal.Body>
				</Modal>
			) : (
				<Modal
					show={modalIsOpen}
					onHide={closeModal}
					centered
					backdrop="static"
					aria-labelledby="video modal"
					dialogClassName="modal-50w"
				>
					<Modal.Header closeButton>
						<Modal.Title>Add New Video</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="col">
							<VideoForm
								initialData={{}}
								HTTPmethod="POST"
								endpoint="videos/add"
								onFormSubmit={handleSubmit}
							/>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" form="video-form" type="submit">
							Save
						</Button>
						<Button variant="secondary" onClick={closeModal}>
							Close
						</Button>
					</Modal.Footer>
				</Modal>
			)}
		</Fragment>
	);
}
