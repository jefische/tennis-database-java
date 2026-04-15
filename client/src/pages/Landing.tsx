import { Link } from "react-router-dom";

export default function Landing() {
	return (
		<>
			<section className="landing-page flex items-center text-center h-full bg-center bg-cover bg-[url('/bgs/wawrinka.jpg')] px-6">
				<div className="bg-black/70 p-10 rounded-3xl max-w-3xl mx-auto animate-landingPage">
					<h1 className="text-4xl md:text-5xl font-bold md:tracking-wide mb-8">
						Watch Full-Length Professional Tennis Matches
					</h1>
					<p className="text-xl md:text-2xl text-gray-300 mb-12">
						Relive the greatest tennis battles of all time — free and in full.
					</p>
					<Link
						to="/home"
						className="border rounded-lg py-4 px-7 bg-[#f9f9f9] text-black text-lg shadow-md hover:font-bold"
					>
						Browse the Archive
					</Link>
				</div>
			</section>
		</>
	);
}
