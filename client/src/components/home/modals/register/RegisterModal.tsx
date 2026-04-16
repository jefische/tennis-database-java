// import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	// DialogClose,
} from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User } from "@/types";

export default function RegisterModal({
	dialogOpen,
	setDialogOpen,
}: {
	dialogOpen: boolean;
	setDialogOpen: (open: boolean) => void;
	setUser: (user: User) => void;
}) {
	// const [username, setUsername] = useState<string>("");
	// const [password, setPassword] = useState<string>("");
	// const [email, setEmail] = useState<string>("");
	// const [error, setError] = useState<string>("");

	// const handleSubmit = async (event: React.FormEvent) => {
	// 	event.preventDefault();
	// 	setError("");

	// 	const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
	// 		method: "POST",
	// 		headers: { "Content-Type": "application/json" },
	// 		body: JSON.stringify({ username, email, password }),
	// 	});

	// 	if (res.ok) {
	// 		const data = await res.json();
	// 		localStorage.setItem("token", data.token);
	// 		const payload = JSON.parse(atob(data.token.split(".")[1]));
	// 		setUser({ username: payload.sub, role: payload.role, email: payload.email, token: data.token });

	// 		setDialogOpen(false);
	// 	} else {
	// 		setError("Invalid username or password");
	// 	}
	// };

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogContent className="w-[calc(100%-2rem)] rounded-lg max-w-md h-auto" mode="light">
				<DialogHeader>
					<DialogTitle>Register</DialogTitle>
					<DialogDescription>Account registration</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col items-center gap-4 py-8 text-center">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-3xl">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-muted-foreground"
						>
							<path d="M12 6v6" />
							<path d="M17.196 9 12 12" />
							<path d="m2 2 20 20" />
							<path d="M11.99 18a6 6 0 0 0 5.2-3.04" />
							<circle cx="12" cy="12" r="10" />
						</svg>
					</div>
					<div>
						<h3 className="text-lg font-semibold">Under Construction</h3>
						<p className="mt-1 text-sm text-muted-foreground">
							Registration is not available yet. Check back soon!
						</p>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => setDialogOpen(false)}>
						Close
					</Button>
				</DialogFooter>

				{/* Original registration form - uncomment when ready to implement */}
				{/* <form onSubmit={handleSubmit} className="grid gap-4">
					<fieldset className="grid gap-2">
						<Label htmlFor="username">Username</Label>
						<Input id="username" onChange={(e) => setUsername(e.target.value)} />
					</fieldset>
					<fieldset className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" onChange={(e) => setEmail(e.target.value)} />
					</fieldset>
					<fieldset className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
					</fieldset>
					{error && <p className="text-sm text-red-500">{error}</p>}
					<DialogFooter>
						<Button type="submit">Submit</Button>
					</DialogFooter>
				</form> */}
			</DialogContent>
		</Dialog>
	);
}
