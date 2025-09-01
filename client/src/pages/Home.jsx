import { Link } from "react-router-dom";

export default function Home() {
	return (
		<>
			<section className="landing-page">
				<div className="bg-black/70 p-10 rounded-3xl max-w-3xl mx-auto">
					<h1>Watch Full-Length Professional Tennis Matches</h1>
					<p className="text-xl md:text-2xl text-gray-300">Relive the greatest tennis battles of all time — free and in full.</p>
					<Link to="/archive" className="archive-link text-lg shadow-md">
						Browse the Archive
					</Link>
				</div>
			</section>
		</>
	);
}
