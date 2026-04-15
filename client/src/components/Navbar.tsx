import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useState } from "react";

import LoginModal from "./home/modals/login/LoginModal";
import RegisterModal from "./home/modals/register/RegisterModal";
import { Button } from "./ui/button";
import { User } from "@/types";

const navigation = [
	{ name: "Full Matches", href: "/home", current: true },
	{ name: "Learn From the Pros", href: "/players", current: false },
	{ name: "Draws", href: "/draws", current: false },
	{ name: "FAQ", href: "/faq", current: false },
];

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

interface NavbarProps {
	user: User;
	setUser: (user: User) => void;
	darkMode: boolean;
	setDarkMode: (option: boolean) => void;
}

export default function Navbar({ user, setUser, darkMode, setDarkMode }: NavbarProps) {
	const [activeLink, setActiveLink] = useState(navigation);
	const currentPath = useLocation().pathname;
	const [loginOpen, setLoginOpen] = useState<boolean>(false);
	const [registerOpen, setRegisterOpen] = useState<boolean>(false);

	const handleActive = (e: React.MouseEvent<HTMLAnchorElement>) => {
		const nextLinks = activeLink.map((link) => {
			if (link.name == (e.target as HTMLElement).innerHTML) {
				return {
					...link,
					current: true,
				};
			} else {
				return {
					...link,
					current: false,
				};
			}
		});
		setActiveLink(nextLinks);
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		setUser(null);
	};

	return (
		<Disclosure as="nav" className="bg-background">
			<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
				<div className="relative flex h-16 items-center justify-between">
					<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
						{/* Mobile menu button*/}
						<DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground focus:ring-2 focus:ring-ring focus:outline-hidden focus:ring-inset">
							<span className="absolute -inset-0.5" />
							<span className="sr-only">Open main menu</span>
							<Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
							<XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
						</DisclosureButton>
					</div>
					<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
						<Link to="/" className="flex shrink-0 items-center">
							<img alt="Site Logo" src="/icons/tennis-ball-dark-96.png" className="h-8 w-auto" />
						</Link>
						<div className="hidden sm:ml-6 sm:block">
							<div className="flex space-x-4">
								{activeLink.map((item) => (
									<NavLink
										key={item.name}
										to={item.href}
										aria-current={item.current ? "page" : undefined}
										className={classNames(
											item.href === currentPath
												? "bg-accent text-foreground"
												: "text-muted-foreground hover:bg-accent hover:text-foreground",
											"rounded-md px-3 py-2 text-sm font-medium",
										)}
										onClick={handleActive}
									>
										{item.name}
									</NavLink>
								))}
							</div>
						</div>
					</div>

					<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
						<Button
							variant="ghost"
							onClick={() => setDarkMode(!darkMode)}
							className="cursor-pointer rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
							aria-label="Toggle dark mode"
						>
							{darkMode ? <SunIcon className="size-6" /> : <MoonIcon className="size-6" />}
						</Button>
						{/* Profile dropdown */}
						<Menu as="div" className="relative ml-3">
							<div>
								<MenuButton className="cursor-pointer relative flex rounded-full bg-background text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background focus:outline-hidden">
									<span className="absolute -inset-1.5" />
									<span className="sr-only">Open user menu</span>
									<UserCircleIcon className="size-8 text-muted-foreground" />
								</MenuButton>
							</div>
							<MenuItems
								transition
								className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-popover text-popover-foreground py-1 ring-1 shadow-lg ring-border transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
							>
								{!user && (
									<MenuItem>
										<button
											onClick={() => setRegisterOpen(true)}
											className="cursor-pointer block px-4 py-2 text-sm text-foreground underline data-focus:bg-accent rounded-sm ms-2 hover:font-semibold"
										>
											Register
										</button>
									</MenuItem>
								)}
								<MenuItem>
									{!user ? (
										<button
											onClick={() => setLoginOpen(true)}
											className="cursor-pointer block px-4 py-2 text-sm text-foreground underline data-focus:bg-accent rounded-sm ms-2 hover:font-semibold"
										>
											Sign in
										</button>
									) : (
										<button
											onClick={handleLogout}
											className="cursor-pointer block px-4 py-2 text-sm text-foreground underline data-focus:bg-accent rounded-sm ms-2 hover:font-semibold"
										>
											Sign out
										</button>
									)}
								</MenuItem>
							</MenuItems>
						</Menu>
						<RegisterModal dialogOpen={registerOpen} setDialogOpen={setRegisterOpen} setUser={setUser} />
						<LoginModal dialogOpen={loginOpen} setDialogOpen={setLoginOpen} setUser={setUser} />
					</div>
				</div>
			</div>

			<DisclosurePanel className="sm:hidden">
				<div className="space-y-1 px-2 pt-2 pb-3">
					{activeLink.map((item) => (
						<NavLink
							key={item.name}
							to={item.href}
							aria-current={item.current ? "page" : undefined}
							className={classNames(
								item.current
									? "bg-accent text-foreground"
									: "text-muted-foreground hover:bg-accent hover:text-foreground",
								"block rounded-md px-3 py-2 text-base font-medium",
							)}
							onClick={handleActive}
						>
							{item.name}
						</NavLink>
					))}
				</div>
			</DisclosurePanel>
		</Disclosure>
	);
}
