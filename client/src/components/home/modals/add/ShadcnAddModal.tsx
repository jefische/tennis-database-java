import {
	Dialog,
	DialogTrigger,
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

export default function ShadcnAddModal() {
	return (
		<>
			{/* <div className="card-cover">
				<div className="header-background card-add-new" onClick={openModal}>
					<img src="/icons/add-100.png" alt="add new video icon" width={"100px"} height={"100px"} />
				</div>
			</div> */}
			<Dialog>
				<DialogTrigger className="cursor-pointer h-[235px] mb-[40px] max-w-[370px] w-full bg-center bg-cover bg-gray-300 rounded-[10px] flex justify-center items-center">
					<img src="/icons/add-100.png" alt="add new video icon" width={"100px"} height={"100px"} />
					{/* <button>Add New Video</button> */}
				</DialogTrigger>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>Add New Video</DialogTitle>
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
							{/* <button>Submit</button> */}
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
