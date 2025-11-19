import { Videos, VideoFilters } from "@/types"

export function sortVideos(a : Videos, b: Videos): number {
	const nameA: string = a.tournament.toUpperCase();
	const nameB: string = b.tournament.toUpperCase();

	const yearA: number = a.year;
	const yearB: number = b.year;

	if (nameA < nameB) {
		return -1;
	}
	if (nameA > nameB) {
		return 1;
	}
	
	// If it's the same tournament, sort by year
	return yearB - yearA;
	
}

export function setFilterData(acc: VideoFilters, x: Videos): VideoFilters {
	// console.log(x);
	const key: string = x.tournament.replace(/\s/g, "");
	if (!acc.tournament[key]) {
		acc.tournament[key] = {
			title: x.tournament,
			year: [x.year],
			count: 1,
			include: true,
		};
	} else {
		if (!acc.tournament[key].year?.includes(x.year)) {
			acc.tournament[key].year?.push(x.year);
		}
		acc.tournament[key].count++;
	}

	if (!acc.year[x.year]) {
		acc.year[x.year] = {
			title: x.year,
			include: true,
			count: 1,
		};
	} else {
		acc.year[x.year].count++;
	}

	return acc;
}

export function checkThumbnail(url: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			// YouTube returns a 120x90 "Video not found" placeholder for invalid IDs
			if (img.naturalWidth === 120 && img.naturalHeight === 90) {
				reject(new Error("Invalid YouTube video ID - placeholder image detected"));
			} else {
				resolve(true);
			}
		};
		img.onerror = () => {
			// YouTube returns a small placeholder image (120x90 pixels) for invalid video IDs instead of a
			// proper 404, which triggers onload instead of onerror. This is a common issue with YouTube thumbnail validation.
			reject(new Error("Thumbnail not found"));
		};

		// Set a timeout to handle hanging requests
		setTimeout(() => {
			reject(new Error("Thumbnail check timeout"));
		}, 5000);

		img.src = url;
	});
}

// Parse ISO 8601 (YouTube) duration to total seconds
export function isoDurationToSeconds(iso: string): number {
  const m = iso.match(/P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  const [, d, h, min, s] = m.map(x => (x ? parseInt(x, 10) : 0));
  return (d || 0) * 86400 + (h || 0) * 3600 + (min || 0) * 60 + (s || 0);
}

// Format seconds as H:MM:SS or M:SS
export function formatHMS(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
               : `${m}:${String(s).padStart(2, "0")}`;
}

// Format as "Xhr YYmin" (like your title)
export function formatHrMin(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return `${h}hr ${String(m).padStart(2, "0")}min`;
}