import { isoDurationToSeconds, formatHrMin } from "./helpers";

export async function pullDuration(id: string): Promise<string> {
	const key: string = import.meta.env.VITE_GOOGLE_API_KEY;
	const link = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${key}&part=snippet,contentDetails,statistics,status`;

	try {
		const response = await fetch(link);
		if (!response.ok) {
			throw new Error(`${response.status} - response not ok`);
		}
		const data = await response.json();
		console.log(data);
		const iso = data.items[0].contentDetails.duration;
		const secs = isoDurationToSeconds(iso);
		console.log(formatHrMin(secs)); // 3hr 44min
		return formatHrMin(secs);
	} catch (e) {
		console.error(e);
	}
	return "0hr 0min";
}

export async function pullTranscript(id: string): Promise<string> {
	const key: string = import.meta.env.VITE_GOOGLE_API_KEY;
	const link = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${key}&part=snippet,contentDetails,statistics,status`;

	try {
		const response = await fetch(link);
		if (!response.ok) {
			throw new Error(`${response.status} - response not ok`);
		}
		const data = await response.json();
		return JSON.stringify(data);
	} catch (error) {
		console.error(error);
	}

	return "N/A";
}
