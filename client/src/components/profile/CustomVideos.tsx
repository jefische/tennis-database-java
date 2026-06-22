import { Fragment, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CustomVideosProps {
	url: string;
	title: string;
	maxWidth?: string;
}

export default function CustomVideos({ url, title }: CustomVideosProps) {
	const [timestamp, setTimestamp] = useState({
		Start: 0,
	});

	return (
		<Fragment>
			<Dialog>
				<DialogTrigger asChild>
					<div
						role="button"
						tabIndex={0}
						className={cn("cursor-pointer hover:scale-105 transition-all duration-500 ease-in-out")}
					>
						<video className="relative h-auto max-w-[400px] w-full rounded-[10px]" playsInline muted preload="metadata">
							<source src={`${url}#t=0.001`} />
						</video>
						<p className="mt-2 ms-1 font-semibold text-foreground text-sm">{title}</p>
					</div>
				</DialogTrigger>
				<DialogContent
					className="sm:max-w-xl md:max-w-2xl lg:max-w-4xl 2xl:max-w-6xl duration-200 grid-rows-[auto_1fr] sm:min-h-2/3 lg:min-h-3/4 lg:max-h-4/5"
					mode="light"
				>
					<DialogHeader>
						<DialogTitle className="hidden sm:flex items-center justify-center gap-6 text-lg md:text-2xl me-4">
							{title}
						</DialogTitle>
					</DialogHeader>

					<div className="flex flex-col xl:flex-row gap-[15px] overflow-y-auto mt-2 sm:mt-0">
						<div className="basis-3/3 shrink-0">
							<iframe
								height="100%"
								width="100%"
								src={`${url}`}
								title={title}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								referrerPolicy="strict-origin-when-cross-origin"
								allowFullScreen
							></iframe>
						</div>
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button>Close</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</Fragment>
	);
}
