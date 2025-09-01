import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useState } from "react";

const navigation = [
	{ name: "Full Matches", href: "/archive", current: true },
	{ name: "Learn From the Pros", href: "/players", current: false },
	{ name: "Draws", href: "/draws", current: false },
	{ name: "FAQ", href: "/faq", current: false },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
	const [activeLink, setActiveLink] = useState(navigation);
	const currentPath = useLocation().pathname;

	const isProduction = import.meta.env.PROD;
	const isProfile = isProduction ? false : true;

	const handleActive = (e) => {
		const nextLinks = activeLink.map((link) => {
			if (link.name == e.target.innerHTML) {
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

	return (
		<Disclosure as="nav" className="bg-gray-800">
			<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
				<div className="relative flex h-16 items-center justify-between">
					<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
						{/* Mobile menu button*/}
						<DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
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
												? "bg-gray-900 text-white"
												: "text-gray-300 hover:bg-gray-700 hover:text-white",
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
					{isProfile && (
						<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
							{/* Profile dropdown */}
							<Menu as="div" className="relative ml-3">
								<div>
									<MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
										<span className="absolute -inset-1.5" />
										<span className="sr-only">Open user menu</span>
										<img alt="avatar icon" src="/icons/male-user-100.png" className="size-8 rounded-full" />
									</MenuButton>
								</div>
								<MenuItems
									transition
									className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
								>
									<MenuItem>
										<a
											href="/profile"
											className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
										>
											Your Profile
										</a>
									</MenuItem>
									<MenuItem>
										<a
											href="#"
											className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
										>
											Settings
										</a>
									</MenuItem>
									<MenuItem>
										<a
											href="#"
											className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
										>
											Sign out
										</a>
									</MenuItem>
								</MenuItems>
							</Menu>
						</div>
					)}
				</div>
			</div>

			<DisclosurePanel className="sm:hidden">
				<div className="space-y-1 px-2 pt-2 pb-3">
					{activeLink.map((item) => (
						<NavLink
							key={item.name}
							as="a"
							to={item.href}
							aria-current={item.current ? "page" : undefined}
							className={classNames(
								item.current ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
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
