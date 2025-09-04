import { useEffect, useRef, useState, Fragment } from "react";
import { Modal, Button } from "react-bootstrap";

export default function ModalTest({ id, title, maxWidth }) {
	const [modalIsOpen, setIsOpen] = useState(false);
	const playerRef = useRef(null);
	const playerInstanceRef = useRef(null); // holds the YT.Player instance
	const [timestamps, setTimeStamps] = useState({
		start: 0,
		matchPoint: 1200,
	});
	const [isPaused, setPaused] = useState(true);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	useEffect(() => {
		if (!modalIsOpen) return;

		// Load YouTube IFrame API if not loaded
		if (!window.YT) {
			console.log("loading the youtube api script");
			const tag = document.createElement("script");
			tag.src = "https://www.youtube.com/iframe_api";
			document.body.appendChild(tag);
		} else {
			loadPlayer();
		}

		// YT API ready callback
		window.onYouTubeIframeAPIReady = () => {
			loadPlayer();
		};

		function loadPlayer() {
			if (playerInstanceRef.current) return; // don't recreate

			playerInstanceRef.current = new window.YT.Player(playerRef.current, {
				videoId: "FkwJOarNBIQ",
				width: "100%",
				height: "100%",
				events: {
					onReady: () => console.log("Video player ready"),
				},
			});
		}

		return () => {
			// Cleanup the player when modal closes
			if (playerInstanceRef.current) {
				playerInstanceRef.current.destroy();
				playerInstanceRef.current = null;
			}
		};
	}, [modalIsOpen, id]);

	const goToTime = (label) => {
		const player = playerInstanceRef.current;
		if (player && timestamps[label] !== undefined) {
			player.seekTo(timestamps[label], true);
			player.playVideo();
		}
	};

	function pauseVideo() {
		const player = playerInstanceRef.current;
		if (player && isPaused) {
			player.playVideo();
			setPaused(false);
		} else if (player && !isPaused) {
			player.pauseVideo();
			setPaused(true);
		}
	}

	return (
		<Fragment>
			<div className="card-cover" style={{ maxWidth: maxWidth, backgroundColor: "#ccc" }}>
				<div
					className="header-background"
					onClick={openModal}
					style={{
						backgroundImage: `url(http://img.youtube.com/vi/${id}/0.jpg)`,
					}}
				></div>
				<p className="card-title">Testing Modal</p>
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
					<Modal.Title className="col">{title}</Modal.Title>
				</Modal.Header>
				<Modal.Body style={{ height: "80vh" }} className="flex flex-col items-center gap-[20px]">
					<div className="col" style={{ width: "100%", maxWidth: "1280px", aspectRatio: "16/9" }}>
						<div ref={playerRef} style={{ width: "100%", height: "100%" }}></div>
					</div>
					<div>
						<Button onClick={() => goToTime("start")}>Start</Button>
						<Button onClick={() => pauseVideo()} className="ms-2">
							{isPaused ? "Play" : "Pause"}
						</Button>
						<Button onClick={() => goToTime("matchPoint")} className="ms-2">
							Match Point
						</Button>
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
