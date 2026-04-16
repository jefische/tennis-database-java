import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User } from "@/types";

export default function LoginModal({
	dialogOpen,
	setDialogOpen,
	setUser,
}: {
	dialogOpen: boolean;
	setDialogOpen: (open: boolean) => void;
	setUser: (user: User) => void;
}) {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string>("");

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError("");

		const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});

		if (res.ok) {
			const data = await res.json();
			localStorage.setItem("token", data.token);
			// Update user state (pass setUser as a prop)
			const payload = JSON.parse(atob(data.token.split(".")[1]));
			setUser({ username: payload.sub, role: payload.role, token: data.token });

			setDialogOpen(false);
		} else {
			setError("Invalid username or password");
		}
	};
	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogContent className="sm:max-w-lg" mode="light">
				<DialogHeader>
					<DialogTitle>Login</DialogTitle>
					<DialogDescription>Enter your username and password below.</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="grid gap-4">
					<fieldset className="grid gap-2">
						<Label htmlFor="username">Username</Label>
						<Input id="username" onChange={(e) => setUsername(e.target.value)} />
					</fieldset>
					<fieldset className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
					</fieldset>
					{error && <p className="text-sm text-red-500">{error}</p>}
					<DialogFooter>
						{/* Add event handler */}
						<Button type="submit">Submit</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
