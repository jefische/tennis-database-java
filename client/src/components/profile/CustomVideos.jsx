import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Fragment, useState, useRef } from "react";

export default function CustomVideos({ url, title, maxWidth }) {
	const [modalIsOpen, setIsOpen] = useState(false);
	const [timestamp, setTimestamp] = useState({
		Start: 0,
	});
	const videoRef = useRef(null);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	return (
		<Fragment>
			<div className="card-cover" style={{ maxWidth: maxWidth }}>
				<video className="header-background" onClick={openModal}>
					<source src={url} />
				</video>
				<p className="card-title">{title}</p>
			</div>
			<Modal
				show={modalIsOpen}
				onHide={closeModal}
				centered
				backdrop="static"
				aria-labelledby="video modal"
				dialogClassName="modal-75w"
			>
				<Modal.Header closeButton>
					<Modal.Title>{title}</Modal.Title>
				</Modal.Header>
				<Modal.Body style={{ height: "80vh" }} className="flex flex-col 2xl:flex-row gap-[20px]">
					<div className="col" style={{ maxWidth: "1280px" }}>
						<video ref={videoRef} src={url} controls></video>
						<Button className="mt-5">Play</Button>
						{Object.entries(timestamp).map(([key, val]) => {
							return (
								<>
									<Button className="mt-5 ms-2">{key}</Button>
								</>
							);
						})}
						<Button className="mt-5 ms-2">Add Timestamp</Button>
						{/* <iframe
							height="100%"
							width="100%"
							src={`${url}`}
							title={title}
							frameBorder="0"
							allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							referrerPolicy="strict-origin-when-cross-origin"
							allowFullScreen
						></iframe> */}
					</div>
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
