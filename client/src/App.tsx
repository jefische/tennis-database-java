import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Players from "./pages/Players";
import Draws from "./pages/Draws";
import FAQ from "./pages/FAQ";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import { User } from "@/types";
import { Toaster } from "./components/ui/sonner";
// bootstrap was used for the initial form and button components
// these components still exist in the codebase as a legacy reference
// the package and import remain in case of a review of the older components
// import "bootstrap/dist/css/bootstrap.min.css";

interface NavbarProps {
	user: User;
	setUser: (user: User) => void;
	darkMode: boolean;
	setDarkMode: (dark: boolean) => void;
}

function NavbarLayout({ user, setUser, darkMode, setDarkMode }: NavbarProps) {
	return (
		<>
			<Navbar user={user} setUser={setUser} darkMode={darkMode} setDarkMode={setDarkMode} />
			<Outlet />
			<Toaster />
		</>
	);
}
export default function App() {
	const [user, setUser] = useState<User>(null);
	const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem("theme") === "dark");

	useEffect(() => {
		document.documentElement.classList.toggle("dark", darkMode);
		localStorage.setItem("theme", darkMode ? "dark" : "light");
	}, [darkMode]);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			// decode the payload to get username/role
			const payload = JSON.parse(atob(token.split(".")[1]));
			setUser({ username: payload.sub, role: payload.role, token });
		}
	}, []);
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route element={<NavbarLayout user={user} setUser={setUser} darkMode={darkMode} setDarkMode={setDarkMode} />}>
						<Route path="/home" element={<Home user={user} />} />
						<Route path="/players" element={<Players />} />
						<Route path="/draws" element={<Draws />} />
						<Route path="/faq" element={<FAQ />} />
						<Route path="/profile" element={<Profile />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}
