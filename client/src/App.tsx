import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Players from "./pages/Players";
import Draws from "./pages/Draws";
import FAQ from "./pages/FAQ";
import Profile from "./pages/Profile";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/home" element={<Home />} />
					<Route path="/players" element={<Players />} />
					<Route path="/draws" element={<Draws />} />
					<Route path="/faq" element={<FAQ />} />
					<Route path="/profile" element={<Profile />} />
				</Routes>
			</BrowserRouter>
		</>
	);
};


