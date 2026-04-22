import { Button } from "@/components/ui/button";
import { Fragment, useState } from "react";
import SCNEditModal from "./edit/SCNEditModal";
import DeleteModal from "./delete/DeleteModal";
import { generateMatchSummary } from "@/utils/matchSummaryAgent";
import { VideoCards, Videos, User, AISummary } from "@/types";
import { Star } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useStore } from "@/hooks/useStore";

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

const emptySummary: AISummary = {
	winner: "",
	score: "",
	matchRating: 0,
	overview: "",
	highlights: [""],
	tags: [""],
	status: null,
};

import { cn } from "@/lib/utils";
export default function SCNVideoCard({
	id,
	title,
	duration,
	summary,
	summaryStatus,
	allVideos,
	setActiveVideos,
}: VideoCards) {
	const [editModal, setEditModal] = useState<boolean>(false);
	const [editData, setEditData] = useState<Videos>({} as Videos);
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [aiSummary, setAiSummary] = useState<AISummary>(() => {
		if (!summary) return emptySummary;
		try {
			const parsed = JSON.parse(summary);
			parsed.status = summaryStatus ?? "default";
			return parsed;
		} catch {
			return emptySummary;
		}
	});
	const [summaryError, setSummaryError] = useState<string | null>(null);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const { user } = useStore();

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
		setLoading(true);
		try {
			const summary: AISummary = await generateMatchSummary(id, user);
			setAiSummary(summary);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unknown error";
			setSummaryError(message);
		} finally {
			setLoading(false);
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
							"cursor-pointer hover:scale-105 transition-all duration-500 ease-in-out",
							dropdownOpen && "scale-105",
						)}
					>
						<div
							className={cn("relative h-[235px] max-w-[370px] w-full bg-center bg-cover rounded-[10px]")}
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
						</div>
						<p className="mt-2 ms-1 font-semibold text-foreground">
							{title} ({duration})
						</p>
					</div>
				</DialogTrigger>
				<DialogContent
					className="sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-7xl duration-200 grid-rows-[auto_1fr] sm:min-h-2/3 lg:min-h-3/4"
					mode="light"
				>
					<DialogHeader>
						<DialogTitle className="flex items-center justify-center gap-6 text-2xl">
							{title} ({duration})
							{user?.role === "ADMIN" && (
								<Button onClick={handleTranscript}>
									<Spinner className={cn(loading ? "block" : "hidden")} data-icon="inline-start" />{" "}
									Create Transcript
								</Button>
							)}
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
						{aiSummary.status === "yes" ? (
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
						) : aiSummary.status === "no_transcript" ? (
							<div className="ai-summary p-4 text-md text-red-600 font-[600]">{aiSummary.overview}</div>
						) : summaryError ? (
							<div>
								<div className="ai-summary p-4 text-md text-red-600 font-[600]">{summaryError}</div>
							</div>
						) : (
							<div className="ai-summary p-4 text-md text-red-600 font-[600]">
								Login as an admin to generate a summary for this video
							</div>
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
				allVideos={allVideos}
				setActiveVideos={setActiveVideos}
				editData={editData}
			/>
			<DeleteModal
				open={deleteModal}
				setDeleteModal={setDeleteModal}
				setActiveVideos={setActiveVideos}
				editData={editData}
			/>
		</Fragment>
	);
}
