import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Fragment, useState } from "react";
import EditModal from "./edit/EditModal";
import { generateMatchSummary } from "@/utils/matchSummaryAgent";
import { VideoCards, Videos } from "@/types";
import { Star } from "lucide-react";

interface AISummary {
	winner: string;
	score: string;
	matchRating: number;
	overview: string;
	highlights: string[];
	tags: string[];
}

export default function VideoCard({ id, title, duration, summary, maxWidth, setAllVideos, setVideos }: VideoCards) {
	const [modalIsOpen, setIsOpen] = useState<boolean>(false);
	const [editModal, setEditModal] = useState<boolean>(false);
	const [editData, setEditData] = useState<Videos>({} as Videos);
	const [aiSummary, setAiSummary] = useState<AISummary | null>(() => {
		if (!summary) return null;
		if (summary.startsWith("No transcript")) return null;
		try {
			return JSON.parse(summary) as AISummary;
		} catch {
			return null;
		}
	});
	const [summaryError, setSummaryError] = useState<string | null>(
		summary?.startsWith("No transcript") ? summary : null,
	);

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
		// console.log("generating summary...");
		setSummaryError(null);
		try {
			const summary: string = await generateMatchSummary(`${id}`);
			// console.log(JSON.parse(summary));
			setAiSummary(JSON.parse(summary));
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unknown error";
			if (message.includes("No transcript available")) {
				setSummaryError("No transcript available for this video.");
			} else {
				setSummaryError("Failed to generate summary.");
			}
		}
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
				<p className="card-title">
					{title} ({duration})
				</p>
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
						{title} ({duration})
						{!isProduction && <Button onClick={handleTranscript}>Create Transcript</Button>}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className="flex flex-col xl:flex-row gap-[15px] h-[80vh]">
					<div className="basis-2/3 shrink-0">
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
					{aiSummary && (
						<div className="ai-summary flex flex-col gap-3 p-4 font-[500] overflow-y-scroll">
							{/* <h5 className="text-gray-500 font-normal">Winner:</h5> */}
							<div className="flex items-center justify-between">
								<h5 className="m-0 font-semibold">{aiSummary.winner} wins</h5>
								<span className="text-sm font-medium bg-gray-200 rounded-full px-3 py-1">
									{aiSummary.score}
								</span>
							</div>
							<div className="flex gap-0.5 items-center">
								{Array.from({ length: 5 }, (_, i) => {
									const fill = Math.min(1, Math.max(0, aiSummary.matchRating - i));
									return (
										<span key={i} className="relative inline-block w-4 h-4">
											<Star size={16} className="absolute text-gray-300" />
											<span
												className="absolute overflow-hidden"
												style={{ width: `${fill * 100}%` }}
											>
												<Star size={16} className="text-yellow-400 fill-yellow-400" />
											</span>
										</span>
									);
								})}
								<span className="text-xs text-gray-500 ml-1">{aiSummary.matchRating}</span>
							</div>
							<p className="m-0 text-sm leading-relaxed">{aiSummary.overview}</p>
							<ul className="m-0 ps-4 text-sm flex flex-col gap-1 list-disc marker">
								{aiSummary.highlights.map((h, i) => (
									<li key={i}>{h}</li>
								))}
							</ul>
							<div className="flex gap-2 flex-wrap">
								{aiSummary.tags.map((tag) => (
									<span
										key={tag}
										className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-1 capitalize"
									>
										{tag}
									</span>
								))}
							</div>
						</div>
					)}
					{summaryError && (
						<div className="ai-summary p-4 text-md text-red-600 font-[600]">{summaryError}</div>
					)}
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
