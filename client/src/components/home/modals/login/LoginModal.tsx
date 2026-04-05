import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginModal({
	dialogOpen,
	setDialogOpen,
}: {
	dialogOpen: boolean;
	setDialogOpen: (open: boolean) => void;
}) {
	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Login</DialogTitle>
					<DialogDescription>Enter your username and password below.</DialogDescription>
				</DialogHeader>
				{/* your form fields go here */}
				<fieldset className="grid gap-2">
					<Label htmlFor="username">Username</Label>
					<Input id="username" />
				</fieldset>
				<fieldset className="grid gap-2">
					<Label htmlFor="password">Password</Label>
					<Input id="password" type="password" />
				</fieldset>
				<DialogFooter>
					<DialogClose asChild>
						<Button>Submit</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
