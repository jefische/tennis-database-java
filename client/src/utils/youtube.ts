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
