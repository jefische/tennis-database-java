import CustomVideos from "../components/CustomVideos";
import Navbar from "../components/Navbar";
import ModalTest from "../components/ModalTest";

export default function Profile() {
	const isProduction = import.meta.env.PROD;
	const myId = "https://my-tennis-videos.s3.us-east-2.amazonaws.com/JF_Serving_AHS_12092024.mp4";
	const UTRmatch = "https://my-tennis-videos.s3.us-east-2.amazonaws.com/04-30-2024-Dan_Ben_vs_Alex_Jeremy.mp4";

	return (
		<>
			<Navbar />
			{isProduction ? (
				<h1 style={{ textAlign: "center", marginTop: "10%" }}>Profile page is under development</h1>
			) : (
				<div className="body-container">
					<main className="content-container bg-gray-custom">
						<h1 style={{ textAlign: "center" }}>Profile page</h1>
						<section className="player-sections d-flex justify-content-center" style={{ color: "#fff", gap: "20px" }}>
							<CustomVideos url={myId} title="Serving Dec. 2024 - AHS" />
							<CustomVideos url={UTRmatch} title="Snyder Doubles Match Apr. 2024" />
							<ModalTest />
						</section>
					</main>
				</div>
			)}
		</>
	);
}
