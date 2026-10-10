import { useEffect } from "react";

export function useDocumentMeta(newDescription: string) {
	useEffect(() => {
		document.querySelector('meta[name="description"]')?.setAttribute("content", newDescription);
	}, [newDescription]);
}
