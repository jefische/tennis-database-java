import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Fragment, useState } from "react";
import EditModal from "./EditModal";

export default function VideoCard({ id, title, maxWidth, setAllVideos, setVideos }) {
	const [modalIsOpen, setIsOpen] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [editData, setEditData] = useState({});

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	const openEditModal = () => {
		// Need to fetch data here
		const params = new URLSearchParams(); // This class encodes the data before appending to URL query string
		params.append("youtubeid", id);

		fetch(`http://localhost:8080/api/edit/${params}`)
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
				console.error("There was a problem with the fetch operation: ", error);
			});
	};
	const closeEditModal = () => setEditModal(false);

	const isProduction = import.meta.env.PROD;

	function handleDelete() {
		const params = new URLSearchParams(); // This class encodes the data before appending to URL query string
		params.append("youtubeid", id);

		fetch(`http://localhost:8080/api/delete/${params}`)
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
				console.error("There was a problem with the fetch operation: ", error);
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
					<DropdownButton drop="start">
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
				<Modal.Header style={{ textAlign: "center" }} closeButton>
					<Modal.Title className="col">{title}</Modal.Title>
				</Modal.Header>
				<Modal.Body style={{ height: "80vh" }} className="flex flex-col items-center gap-[20px]">
					<div className="col" style={{ maxWidth: "1280px", width: "100%" }}>
						<iframe
							height="100%"
							width="100%"
							src={`https://www.youtube.com/embed/${id}`}
							title={title}
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							referrerPolicy="strict-origin-when-cross-origin"
							allowFullScreen
						></iframe>
					</div>
					<p>Comments section in development</p>
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
