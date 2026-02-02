import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Fragment, useState } from "react";
import EditModal from "./edit/EditModal";
import { pullTranscript } from "@/assets/types/callbacks";
import { generateMatchSummary } from "@/utils/matchSummaryAgent";
import { VideoCards, Videos } from "@/types";

export default function VideoCard({ id, title, summary, maxWidth, setAllVideos, setVideos }: VideoCards) {
	const [modalIsOpen, setIsOpen] = useState<boolean>(false);
	const [editModal, setEditModal] = useState<boolean>(false);
	const [editData, setEditData] = useState<Videos>({} as Videos);
	const [aiSummary, setAiSummary] = useState<String>(summary || "AI summary in development");

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	const openEditModal = (): void => {
		// URLSearchParams
		// Query string parameters: /videos?youtubeId=123
		// Used for filtering, searching, or optional parameters
		// Your current code creates URLs like /videos/youtubeId%3D123 (encoded)
		// const params = new URLSearchParams(); // This class encodes the data before appending to URL query string
		// params.append("youtubeId", id);

		fetch(`http://localhost:8080/videos/${id}`, {
			method: "GET",
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`);
				}
				return res.json();
			})
			.then((data) => {
				setEditModal(true);
				setEditData(data);
			})
			.catch((error) => {
				console.error("There was a problem with the fetch operation:\n", error);
			});
	};
	const closeEditModal = () => setEditModal(false);

	const isProduction = import.meta.env.PROD;

	async function handleTranscript(): Promise<void> {
		// pullTranscript("str");
		console.log("generating summary...");
		const summary: string = await generateMatchSummary(`${id}`);
		setAiSummary(summary);
	}

	function handleDelete(): void {
		fetch(`http://localhost:8080/videos/${id}`, {
			method: "DELETE",
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
	}

	return (
		<Fragment>
			<div className="card-cover" style={{ maxWidth: maxWidth }}>
				<div
					className="header-background"
					onClick={openModal}
					style={{
						backgroundImage: `url(http://img.youtube.com/vi/${id}/0.jpg)`,
					}}
				></div>
				{!isProduction && (
					<DropdownButton drop="start" title="Actions">
						<Dropdown.Item href="#" onClick={handleDelete}>
							Delete Record
						</Dropdown.Item>
						<Dropdown.Item href="#" onClick={openEditModal}>
							Edit Record
						</Dropdown.Item>
						<EditModal
							editModalOpen={editModal}
							closeEditModal={closeEditModal}
							editData={editData}
							setAllVideos={setAllVideos}
							setVideos={setVideos}
						/>
					</DropdownButton>
				)}
				<p className="card-title">{title}</p>
			</div>
			<Modal
				show={modalIsOpen}
				onHide={closeModal}
				centered
				backdrop="static"
				aria-labelledby="video modal"
				dialogClassName="modal-90w"
			>
				<Modal.Header closeButton>
					<Modal.Title className="col">
						{title}
						{!isProduction && <Button onClick={handleTranscript}>Create Transcript</Button>}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="col body">
						<iframe
							height="100%"
							width="100%"
							src={`https://www.youtube.com/embed/${id}`}
							title={title}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							referrerPolicy="strict-origin-when-cross-origin"
							allowFullScreen
						></iframe>
					</div>
					{aiSummary && <div className="ai-summary" dangerouslySetInnerHTML={{ __html: aiSummary }} />}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={closeModal}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</Fragment>
	);
}
