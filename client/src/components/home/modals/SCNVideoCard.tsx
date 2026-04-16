import { Button } from "@/components/ui/button";
import { Fragment, useState } from "react";
import SCNEditModal from "./edit/SCNEditModal";
import DeleteModal from "./delete/DeleteModal";
import { generateMatchSummary } from "@/utils/matchSummaryAgent";
import { VideoCards, Videos } from "@/types";
import { Star } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";

interface AISummary {
	winner: string;
	score: string;
	matchRating: number;
	overview: string;
	highlights: string[];
	tags: string[];
}

import { cn } from "@/lib/utils";
export default function SCNVideoCard({
	id,
	title,
	duration,
	summary,
	maxWidth,
	setAllVideos,
	setVideos,
	user,
}: VideoCards) {
	const [editModal, setEditModal] = useState<boolean>(false);
	const [editData, setEditData] = useState<Videos>({} as Videos);
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
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
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const openEditModal = (): void => {
		fetch(`${import.meta.env.VITE_API_URL}/videos/${id}`, {
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

	const openDeleteModal = (): void => {
		fetch(`${import.meta.env.VITE_API_URL}/videos/${id}`, {
			method: "GET",
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`);
				}
				return res.json();
			})
			.then((data) => {
				setDeleteModal(true);
				setEditData(data);
			})
			.catch((error) => {
				console.error("There was a problem with the fetch operation:\n", error);
			});
	};

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

	return (
		<Fragment>
			<Dialog>
				<DialogTrigger asChild>
					<div
						role="button"
						tabIndex={0}
						className={cn(
							"cursor-pointer relative h-[235px] max-w-[370px] w-full bg-center bg-cover rounded-[10px]",
							"hover:scale-105 transition-all duration-500 ease-in-out",
							dropdownOpen && "scale-105",
						)}
						style={{
							backgroundImage: `url(http://img.youtube.com/vi/${id}/0.jpg)`,
						}}
					>
						{user?.role === "ADMIN" && (
							<>
								<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
									<DropdownMenuTrigger asChild>
										<Button
											variant="default"
											className="absolute top-[10px] right-[10px] cursor-pointer"
											onClick={(e) => e.stopPropagation()}
										>
											Actions
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										className="w-40"
										align="start"
										onClick={(e) => e.stopPropagation()}
									>
										<DropdownMenuGroup>
											<DropdownMenuLabel>Video Options</DropdownMenuLabel>
											<DropdownMenuItem
												onSelect={() => openEditModal()}
												className="cursor-pointer"
											>
												Edit{" "}
											</DropdownMenuItem>
											<DropdownMenuItem
												onSelect={() => openDeleteModal()}
												className="cursor-pointer"
											>
												Delete
											</DropdownMenuItem>
											<DropdownMenuItem disabled className="cursor-pointer">
												Settings
											</DropdownMenuItem>
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							</>
						)}
						<p className="absolute bottom-[-55px] font-semibold">
							{title} ({duration})
						</p>
					</div>
				</DialogTrigger>
				<DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-7xl duration-200" mode="light">
					<DialogHeader>
						<DialogTitle className="flex items-center justify-center gap-6 text-2xl">
							{title} ({duration})
							{user?.role === "ADMIN" && <Button onClick={handleTranscript}>Create Transcript</Button>}
						</DialogTitle>
					</DialogHeader>

					<div className="flex flex-col xl:flex-row gap-[15px]">
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
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button>Close</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<SCNEditModal
				open={editModal}
				setEditModal={setEditModal}
				setAllVideos={setAllVideos}
				setVideos={setVideos}
				user={user}
				editData={editData}
			/>
			<DeleteModal
				open={deleteModal}
				setDeleteModal={setDeleteModal}
				setAllVideos={setAllVideos}
				setVideos={setVideos}
				editData={editData}
				user={user}
			/>
		</Fragment>
	);
}
