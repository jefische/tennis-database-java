import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import VideoEditForm from "./VideoEditForm";
import { useState, useEffect } from "react";

export default function EditModal({ editModalOpen, closeEditModal, editData, setAllVideos, setVideos }) {
	const [isSubmitted, setIsSubmitted] = useState(false);

	function handleSubmit(data) {
		setVideos(data);
		setAllVideos(data);
		setIsSubmitted(true);
	}

	useEffect(() => {
		if (isSubmitted) {
			const timer = setTimeout(() => {
				setIsSubmitted(false);
				closeEditModal();
			}, 3000); // 3 seconds
			return () => clearTimeout(timer); // Cleanup timer if the component unmounts causing memory leaks, unpredictable UI behavior. React will start throwing warnings if this happens saying can't call setState on an unmounted component.
		}
	}, [isSubmitted, closeEditModal]);

	return (
		<>
			{isSubmitted ? (
				<Modal show={true} centered backdrop="static" aria-labelledby="video modal">
					<Modal.Body>
						<div className="flex justify-center">
							<h3 className="flex gap-3 items-center">
								<img src="/icons/check-mark-50.png" alt="green check mark" />
								Video Details Edited
							</h3>
						</div>
					</Modal.Body>
				</Modal>
			) : (
				<>
					<Modal
						show={editModalOpen}
						onHide={closeEditModal}
						centered
						backdrop="static"
						aria-labelledby="video modal"
						dialogClassName="modal-50w"
					>
						<Modal.Header closeButton>
							<Modal.Title>Edit Video</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<div className="flex justify-center" style={{ maxWidth: "1280px" }}>
								<VideoEditForm onFormSubmit={handleSubmit} editData={editData} />
							</div>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="primary" form="video-form" type="submit">
								Save
							</Button>
							<Button variant="secondary" onClick={closeEditModal}>
								Close
							</Button>
						</Modal.Footer>
					</Modal>
				</>
			)}
		</>
	);
}
