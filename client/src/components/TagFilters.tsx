import { Button } from "@/components/ui/button";

export default function TagFilters() {
	return (
		<div className="flex gap-10 mb-10">
			<Button variant="ghost" size="lg" className="bg-accent">
				Comebacks
			</Button>
			<Button variant="secondary" size="lg">
				five setters
			</Button>
			<Button variant="default" size="lg">
				rivalry
			</Button>
		</div>
	);
}
