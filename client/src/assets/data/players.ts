// Placeholder player data — will come from API/DB later

type playerData = {
	name: string;
	slug: string;
	image: string;
	shots: string[];
	filters: string[];
	hand: string;
	serve: string;
	forehand: string;
	backhand: string;
};

export const PLAYERS: playerData[] = [
	{
		name: "Roger Federer",
		slug: "federer",
		// image: "https://img.youtube.com/vi/pRYJHxmZdQE/0.jpg",
		// image: "./bgs/player_cards/Federer.webp",
		// image: "./bgs/player_cards/federer/Federer_v2m.jpg",
		image: "./bgs/player_cards/federer/Federer_v3.png",
		// image: "https://www.gettyimages.com/detail/818056428",
		shots: ["Forehand", "Backhand", "Platform Serve", "Volley"],
		filters: ["ATP", "Platform Serve", "One-handed backhand"],
		hand: "right",
		serve: "platform",
		forehand: "eastern",
		backhand: "one",
	},
	{
		name: "Rafael Nadal",
		slug: "nadal",
		// image: "./bgs/player_cards/nadal/Nadal.webp",
		// image: "./bgs/player_cards/nadal/Nadal_v2.png",
		image: "./bgs/player_cards/nadal/Nadal_v3.png",
		shots: ["Forehand", "Backhand", "Serve", "Return"],
		filters: ["ATP", "Left handed", "Pinpoint Serve"],
		hand: "left",
		serve: "Pinpoint",
		forehand: "semi-western",
		backhand: "two",
	},
	{
		name: "Stan Wawrinka",
		slug: "wawrinka",
		// image: "https://img.youtube.com/vi/xOhLAbf_EAI/0.jpg",
		// image: "https://img.youtube.com/vi/Dyj1Id6HDJ0/0.jpg",
		// image: "./bgs/player_cards/wawrinka/Wawrinka.webp",
		image: "./bgs/player_cards/wawrinka/Wawrinka_v3.JPG",
		shots: ["Forehand", "Backhand", "Pinpoint Serve"],
		filters: ["ATP", "Pinpoint Serve", "One-handed backhand"],
		hand: "right",
		serve: "Pinpoint",
		forehand: "semi-western",
		backhand: "one",
	},
	{
		name: "Serena Williams",
		slug: "swilliams",
		// image: "./bgs/player_cards/williams/SWilliams.webp",
		image: "./bgs/player_cards/williams/SWilliams_v3.JPG",
		shots: ["Forehand", "Backhand", "Serve", "Volley"],
		filters: ["WTA", "Pinpoint Serve"],
		hand: "right",
		serve: "Pinpoint",
		forehand: "semi-western",
		backhand: "two",
	},
	// {
	// 	name: "Novak Djokovic",
	// 	slug: "djokovic",
	// 	image: "./bgs/player_cards/Djokovic.webp",
	// 	shots: ["Forehand", "Backhand", "Serve", "Return", "Volley"],
	// 	filters: ["ATP", "Platform Serve"],
	// 	hand: "right",
	// 	serve: "platform",
	// 	forehand: "semi-western",
	// 	backhand: "two",
	// },
	// {
	// 	name: "Carlos Alcaraz",
	// 	slug: "alcaraz",
	// 	image: "./bgs/player_cards/Alcaraz.webp",
	// 	shots: ["Forehand", "Backhand", "Serve", "Volley"],
	// 	filters: ["ATP", "Pinpoint Serve"],
	// 	hand: "right",
	// 	serve: "Pinpoint"],
	// 	forehand: "semi-western",
	// 	backhand: "two",
	// },
	// {
	// 	name: "Naomi Osaka",
	// 	slug: "osaka",
	// 	image: "./bgs/player_cards/Osaka.webp",
	// 	shots: ["Forehand", "Backhand", "Serve", "Volley"],
	// 	filters: ["WTA", "Pinpoint Serve"],
	// 	hand: "right",
	// 	serve: "Pinpoint"],
	// 	forehand: "semi-western",
	// 	backhand: "two",
	// },
	// {
	// 	name: "Juan Martin Del Potro",
	// 	slug: "delpotro",
	// 	image: "./bgs/player_cards/Del Potro.webp",
	// 	shots: ["Forehand", "Backhand", "Serve", "Volley"],
	// 	filters: ["ATP", "Pinpoint Serve"],
	// 	hand: "right",
	// 	serve: "Pinpoint"],
	// 	forehand: "semi-western",
	// 	backhand: "two",
	// },
	// {
	// 	name: "Nick Kyrgios",
	// 	slug: "kyrgios",
	// 	image: "./bgs/player_cards/Kyrgios.webp",
	// 	shots: ["Forehand", "Backhand", "Serve", "Volley"],
	// 	filters: ["ATP", "Pinpoint Serve"],
	// 	hand: "right",
	// 	serve: "Pinpoint"],
	// 	forehand: "semi-western",
	// 	backhand: "two",
	// },
	// {
	// 	name: "Daniil Medvedev",
	// 	slug: "medvedev",
	// 	image: "./bgs/player_cards/Medvedev.webp",
	// 	shots: ["Forehand", "Backhand", "Serve", "Volley"],
	// 	filters: ["ATP", "Pinpoint Serve"],
	// 	hand: "right",
	// 	serve: "Pinpoint"],
	// 	forehand: "semi-western",
	// 	backhand: "two",
	// },
	// {
	// 	name: "Andy Murray",
	// 	slug: "murray",
	// 	image: "./bgs/player_cards/Murray.webp",
	// 	shots: ["Forehand", "Backhand", "Serve", "Volley"],
	// 	filters: ["ATP", "Pinpoint Serve"],
	// 	hand: "right",
	// 	serve: "Pinpoint"],
	// 	forehand: "semi-western",
	// 	backhand: "two",
	// },
	// {
	// 	name: "Iga Swiatek",
	// 	slug: "swiatek",
	// 	image: "./bgs/player_cards/Swiatek.webp",
	// 	shots: ["Forehand", "Backhand", "Serve", "Volley"],
	// 	filters: ["WTA", "Pinpoint Serve"],
	// 	hand: "right",
	// 	serve: "Pinpoint"],
	// 	forehand: "semi-western",
	// 	backhand: "two",
	// },
	// {
	// 	name: "Andrey Rublev",
	// 	slug: "rublev",
	// 	image: "./bgs/player_cards/Rublev.webp",
	// 	shots: ["Forehand", "Backhand", "Serve", "Volley"],
	// 	filters: ["ATP", "Pinpoint Serve"],
	// 	hand: "right",
	// 	serve: "Pinpoint"],
	// 	forehand: "semi-western",
	// 	backhand: "two",
	// },
	// {
	// 	name: "Dominic Thiem",
	// 	slug: "thiem",
	// 	image: "./bgs/player_cards/Thiem.webp",
	// 	shots: ["Forehand", "Backhand", "Serve", "Volley"],
	// 	filters: ["ATP", "Platform Serve", "One-handed backhand"],
	// 	hand: "right",
	// 	serve: "platform",
	// 	forehand: "semi-western",
	// 	backhand: "one",
	// },
	// {
	// 	name: "Stefanos Tsitsipas",
	// 	slug: "tsitsipas",
	// 	image: "./bgs/player_cards/Tsitsipas.webp",
	// 	shots: ["Forehand", "Backhand", "Serve", "Volley"],
	// 	filters: ["ATP", "Platform Serve", "One-handed backhand"],
	// 	hand: "right",
	// 	serve: "platform",
	// 	forehand: "eastern",
	// 	backhand: "one",
	// },
	// {
	// 	name: "Alexander Zverev",
	// 	slug: "zverev",
	// 	image: "./bgs/player_cards/Zverev.webp",
	// 	shots: ["Forehand", "Backhand", "Serve", "Volley"],
	// 	filters: ["ATP", "Pinpoint Serve"],
	// 	hand: "right",
	// 	serve: "Pinpoint"],
	// 	forehand: "semi-western",
	// 	backhand: "two",
	// },
	// {
	// 	name: "Jannik Sinner",
	// 	slug: "sinner",
	// 	image: "https://img.youtube.com/vi/SlgMvQQrYhg/0.jpg",
	// 	shots: ["Forehand", "Backhand", "Serve"],
	// },
];

// Placeholder data — will come from API/DB later
export const PLAYER_DATA: Record<
	string,
	{
		name: string;
		videos: { id: string; title: string; shotType: string; variant: string[] }[];
		gear: { name: string; type: string; link: string }[];
	}
> = {
	federer: {
		name: "Roger Federer",
		videos: [
			{
				id: "QI5adGG6RA8",
				title: "Federer Serve - Court Level Practice",
				shotType: "Serve",
				variant: ["Warmup"],
			},
			{ id: "3OL6umAxQ4c", title: "Federer Serve - Slow Motion", shotType: "Serve", variant: ["Platform"] },
			{ id: "mKXtVQnqhB4", title: "Federer Serve - Slow Motion", shotType: "Serve", variant: ["Platform"] },

			{ id: "Mb_hOwxWKrk", title: "Federer Forehand - Court Level", shotType: "Forehand", variant: ["Topspin"] },
			{ id: "stEhSvoou4g", title: "Federer Forehand - Slow Motion", shotType: "Forehand", variant: ["Topspin"] },
			{ id: "EFY460oquXw", title: "Federer Forehand - Slow Motion", shotType: "Forehand", variant: ["Topspin"] },
			{
				id: "zZ2zmsPIMXI",
				title: "Federer Backhand - Court Level",
				shotType: "Backhand",
				variant: ["One-handed"],
			},
			{
				id: "gFmI3pNSdFI",
				title: "Federer Backhand - Slow Motion",
				shotType: "Backhand",
				variant: ["One-handed"],
			},
			{
				id: "RVhJBhWxFQc",
				title: "Federer Backhand - Slow Motion",
				shotType: "Backhand",
				variant: ["One-handed"],
			},
			{
				id: "0PJx1QL-0KM",
				title: "Federer vs Tomas Berdych — Indian Wells 2018",
				shotType: "Practice",
				variant: ["Hard Court"],
			},
			{
				id: "jW7_FfE0c9g",
				title: "Federer vs Diego Schwartzman — Roland Garros 2019",
				shotType: "Practice",
				variant: ["Clay"],
			},
			{
				id: "yP5WqP9p2UQ",
				title: "Federer vs Joao Sousa — Wimbledon 2019",
				shotType: "Practice",
				variant: ["Grass"],
			},
			{
				id: "XW4zbVcwMt0",
				title: "Federer — Cincinnati Open 2015",
				shotType: "Practice",
				variant: ["Hard Court"],
			},
			{
				id: "Y4b0LR4_95Q",
				title: "Federer — Monte Carlo 2021",
				shotType: "Practice",
				variant: ["Clay"],
			},
		],
		gear: [
			{ name: "Yonex VCORE 95", type: "Racket", link: "#" },
			{ name: "Luxilon ALU Power 125", type: "String", link: "#" },
			{ name: "Yonex Power Cushion Eclipsion", type: "Shoes", link: "#" },
		],
	},
	nadal: {
		name: "Rafael Nadal",
		videos: [
			{ id: "r4z1jd6inI4", title: "Nadal Serve — Court Level", shotType: "Serve", variant: ["Pinpoint"] },
			{ id: "4ulUCZqvvV8", title: "Nadal Serve — Slow Motion", shotType: "Serve", variant: ["Pinpoint"] },
			{ id: "KB6EY7FxgUg", title: "Nadal Forehand — Court Level", shotType: "Forehand", variant: ["Topspin"] },
			{ id: "Q7Ta9DbHKjk", title: "Nadal Forehand — Slow Motion", shotType: "Forehand", variant: ["Topspin"] },
			{
				id: "ZGN-A7dfr7U",
				title: "Nadal Backhand - Court Level Practice",
				shotType: "Backhand",
				variant: ["Two-handed"],
			},
			{
				id: "xm2zi36uZEg",
				title: "Nadal Backhand - Slow Motion",
				shotType: "Backhand",
				variant: ["Two-handed"],
			},
		],
		gear: [
			{ name: "Yonex VCORE 95", type: "Racket", link: "#" },
			{ name: "Luxilon ALU Power 125", type: "String", link: "#" },
			{ name: "Yonex Power Cushion Eclipsion", type: "Shoes", link: "#" },
		],
	},
	swilliams: {
		name: "Serena Williams",
		videos: [
			{
				id: "LbEtdSKN9VU",
				title: "Serena Serve - Court Level Practice",
				shotType: "Serve",
				variant: ["Pinpoint"],
			},
			{ id: "sDynWX27zIk", title: "Serena Serve - Slow Motion", shotType: "Serve", variant: ["Pinpoint"] },
			{ id: "kJUuzlk6d8M", title: "Serena Serve - Slow Motion", shotType: "Serve", variant: ["Pinpoint"] },
			{
				id: "oOsmGn2_piE",
				title: "Serena Forehand & Backhand - Slow Motion",
				shotType: "Forehand",
				variant: ["Topspin"],
			},
			{
				id: "C1NE6VaR1kk",
				title: "Serena Forehand - Slow Motion",
				shotType: "Forehand",
				variant: ["Topspin"],
			},
			{ id: "H4Xj2ELnZpI", title: "Serena Forehand - Court Level", shotType: "Forehand", variant: ["Topspin"] },
			{
				id: "G4YfibQGq3I",
				title: "Serena Backhand - Slow Motion",
				shotType: "Backhand",
				variant: ["Two-handed"],
			},
			{
				id: "Lwf7M8fTDNM",
				title: "Serena Backhand - Slow Motion",
				shotType: "Backhand",
				variant: ["Two-handed"],
			},
			{
				id: "WsAleiZg5ig",
				title: "Serena vs Ons Jabeur — US Open 2022",
				shotType: "Practice",
				variant: ["Hard Court"],
			},
			{
				id: "1UzskZk1MRw",
				title: "Serena — Mouratoglou Academy 2021",
				shotType: "Practice",
				variant: ["Clay", "Papa Mo"],
			},
		],
		gear: [
			{ name: "Yonex VCORE 95", type: "Racket", link: "#" },
			{ name: "Luxilon ALU Power 125", type: "String", link: "#" },
			{ name: "Yonex Power Cushion Eclipsion", type: "Shoes", link: "#" },
		],
	},
	wawrinka: {
		name: "Stan Wawrinka",
		videos: [
			{
				id: "_xmJO_ZUtWU",
				title: "Wawrinka Serve",
				shotType: "Serve",
				variant: ["Pinpoint"],
			},
			{
				id: "Y1uhp9W0X9w",
				title: "Wawrinka Serve",
				shotType: "Serve",
				variant: ["Pinpoint"],
			},
			{
				id: "RcLbJzb5MdQ",
				title: "Wawrinka Serve",
				shotType: "Serve",
				variant: ["Pinpoint"],
			},
			{
				id: "58YBh2sUt7A",
				title: "Wawrinka Serve",
				shotType: "Serve",
				variant: ["Pinpoint"],
			},
			{
				id: "BLSFn33Z4IE",
				title: "Wawrinka Serve",
				shotType: "Serve",
				variant: ["Pinpoint"],
			},
			{
				id: "PSNl0Hdw1wM",
				title: "Wawrinka Serve",
				shotType: "Serve",
				variant: ["Pinpoint"],
			},
			{
				id: "97B2panmUvU",
				title: "Wawrinka Forehand Slow Motion",
				shotType: "Forehand",
				variant: ["Topspin"],
			},
			{
				id: "_cohjbquvwc",
				title: "Wawrinka Forehand Slow Motion",
				shotType: "Forehand",
				variant: ["Topspin"],
			},
			{
				id: "hUuj7AoOWpc",
				title: "Wawrinka Forehand in Slow Motion",
				shotType: "Forehand",
				variant: ["Topspin"],
			},
			{
				id: "RDl2Kz0gd18",
				title: "Wawrinka Forehand Slow Motion",
				shotType: "Forehand",
				variant: ["Topspin"],
			},
			{
				id: "zYqtCPvGf4Y",
				title: "Wawrinka Forehand Slow Motion",
				shotType: "Forehand",
				variant: ["Topspin"],
			},
			{
				id: "_FBLXOaSAsU",
				title: "Wawrinka Forehand Slow Motion",
				shotType: "Forehand",
				variant: ["Topspin"],
			},

			{
				id: "Re-8_POaRIw",
				title: "Wawrinka Backhand — Court Level",
				shotType: "Backhand",
				variant: ["One-handed"],
			},
			{
				id: "SlgMvQQrYhg",
				title: "Wawrinka Backhand — Slow Motion",
				shotType: "Backhand",
				variant: ["One-handed"],
			},
			{
				id: "wWCVFRRaFCs",
				title: "Wawrinka Backhand — Slow Motion",
				shotType: "Backhand",
				variant: ["One-handed"],
			},
			{
				id: "mx3eA5P-3nA",
				title: "Wawrinka Backhand — Slow Motion",
				shotType: "Backhand",
				variant: ["One-handed"],
			},
			{
				id: "q3J2P8on7js",
				title: "Wawrinka Backhand — Court Level",
				shotType: "Backhand",
				variant: ["One-handed"],
			},
			{
				id: "_7gd-XJRiEQ",
				title: "Wawrinka Backhand — Match Play",
				shotType: "Backhand",
				variant: ["One-handed"],
			},
		],
		gear: [
			{ name: "Yonex VCORE 95", type: "Racket", link: "#" },
			{ name: "Luxilon ALU Power 125", type: "String", link: "#" },
			{ name: "Yonex Power Cushion Eclipsion", type: "Shoes", link: "#" },
		],
	},
};

// Placeholder data — will come from API/DB later
// export const VIDEO_DATA: Record<
// 	string,
// 	{
// 		title: string;
// 		player: string;
// 		shotType: string;
// 		variant: string[];
// 		gear: { name: string; type: string; link: string }[];
// 	}
// > = {
// 	"_7gd-XJRiEQ": {
// 		title: "Wawrinka One-Handed Backhand — Match Play",
// 		player: "Stan Wawrinka",
// 		shotType: "Backhand",
// 		variant: ["One-handed"],
// 		gear: [
// 			{ name: "Yonex VCORE 95", type: "Racket", link: "#" },
// 			{ name: "Luxilon ALU Power 125", type: "String", link: "#" },
// 			{ name: "Yonex Power Cushion Eclipsion", type: "Shoes", link: "#" },
// 		],
// 	},
// 	q3J2P8on7js: {
// 		title: "Wawrinka One-Handed Backhand — Court Level",
// 		player: "Stan Wawrinka",
// 		shotType: "Backhand",
// 		variant: ["One-handed"],
// 		gear: [
// 			{ name: "Yonex VCORE 95", type: "Racket", link: "#" },
// 			{ name: "Luxilon ALU Power 125", type: "String", link: "#" },
// 			{ name: "Yonex Power Cushion Eclipsion", type: "Shoes", link: "#" },
// 		],
// 	},
// 	"mx3eA5P-3nA": {
// 		title: "Wawrinka One-Handed Backhand — Slow Motion",
// 		player: "Stan Wawrinka",
// 		shotType: "Backhand",
// 		variant: ["One-handed"],
// 		gear: [
// 			{ name: "Yonex VCORE 95", type: "Racket", link: "#" },
// 			{ name: "Luxilon ALU Power 125", type: "String", link: "#" },
// 			{ name: "Yonex Power Cushion Eclipsion", type: "Shoes", link: "#" },
// 		],
// 	},
// 	wWCVFRRaFCs: {
// 		title: "Wawrinka One-Handed Backhand — Slow Motion",
// 		player: "Stan Wawrinka",
// 		shotType: "Backhand",
// 		variant: ["One-handed"],
// 		gear: [
// 			{ name: "Yonex VCORE 95", type: "Racket", link: "#" },
// 			{ name: "Luxilon ALU Power 125", type: "String", link: "#" },
// 			{ name: "Yonex Power Cushion Eclipsion", type: "Shoes", link: "#" },
// 		],
// 	},
// 	SlgMvQQrYhg: {
// 		title: "Wawrinka One-Handed Backhand — Slow Motion",
// 		player: "Stan Wawrinka",
// 		shotType: "Backhand",
// 		variant: ["One-handed"],
// 		gear: [
// 			{ name: "Yonex VCORE 95", type: "Racket", link: "#" },
// 			{ name: "Luxilon ALU Power 125", type: "String", link: "#" },
// 			{ name: "Yonex Power Cushion Eclipsion", type: "Shoes", link: "#" },
// 		],
// 	},
// 	"Re-8_POaRIw": {
// 		title: "Wawrinka One-Handed Backhand — Court Level",
// 		player: "Stan Wawrinka",
// 		shotType: "Backhand",
// 		variant: ["One-handed"],
// 		gear: [
// 			{ name: "Yonex VCORE 95", type: "Racket", link: "#" },
// 			{ name: "Luxilon ALU Power 125", type: "String", link: "#" },
// 			{ name: "Yonex Power Cushion Eclipsion", type: "Shoes", link: "#" },
// 		],
// 	},
// 	gFmI3pNSdFI: {
// 		title: "Federer Backhand Compilation",
// 		player: "Roger Federer",
// 		shotType: "Backhand",
// 		variant: ["One-handed"],
// 		gear: [
// 			{ name: "Wilson Pro Staff RF97", type: "Racket", link: "#" },
// 			{ name: "Wilson Natural Gut / Luxilon ALU Power", type: "String", link: "#" },
// 			{ name: "On Running THE ROGER Pro", type: "Shoes", link: "#" },
// 		],
// 	},
// 	"3OL6umAxQ4c": {
// 		title: "Federer Serve Slow Motion",
// 		player: "Roger Federer",
// 		shotType: "Serve",
// 		variant: ["Flat"],
// 		gear: [
// 			{ name: "Wilson Pro Staff RF97", type: "Racket", link: "#" },
// 			{ name: "Wilson Natural Gut / Luxilon ALU Power", type: "String", link: "#" },
// 			{ name: "On Running THE ROGER Pro", type: "Shoes", link: "#" },
// 		],
// 	},

// RDl2Kz0gd18: {
// 	title: "Alcaraz Forehand Practice",
// 	player: "Carlos Alcaraz",
// 	shotType: "Forehand",
// 	variant: ["Topspin"],
// 	gear: [
// 		{ name: "Babolat Pure Aero 98", type: "Racket", link: "#" },
// 		{ name: "RPM Blast", type: "String", link: "#" },
// 		{ name: "Nike Vapor Pro 2", type: "Shoes", link: "#" },
// 	],
// },
// zYqtCPvGf4Y: {
// 	title: "Djokovic Return of Serve",
// 	player: "Novak Djokovic",
// 	shotType: "Return",
// 	variant: ["Deep return",
// 	gear: [
// 		{ name: "Head Speed Pro", type: "Racket", link: "#" },
// 		{ name: "Head Hawk Touch", type: "String", link: "#" },
// 		{ name: "Head Sprint Pro", type: "Shoes", link: "#" },
// 	],
// },
// hUuj7AoOWpc: {
// 	title: "Nadal Forehand in Slow Motion",
// 	player: "Rafael Nadal",
// 	shotType: "Forehand",
// 	variant: ["Topspin"],
// 	gear: [
// 		{ name: "Babolat Pure Aero", type: "Racket", link: "#" },
// 		{ name: "RPM Blast", type: "String", link: "#" },
// 		{ name: "Nike Cage 4", type: "Shoes", link: "#" },
// 	],
// },
// _FBLXOaSAsU: {
// 	title: "Sinner Backhand Technique",
// 	player: "Jannik Sinner",
// 	shotType: "Backhand",
// 	variant: ["Two-handed",
// 	gear: [
// 		{ name: "Head Speed Pro", type: "Racket", link: "#" },
// 		{ name: "Head Hawk Touch", type: "String", link: "#" },
// 		{ name: "Nike Vapor Pro 2", type: "Shoes", link: "#" },
// 	],
// },
// "Re-8_POaRIw": {
// 	title: "Federer Serve Compilation",
// 	player: "Roger Federer",
// 	shotType: "Serve",
// 	variant: ["Flat"],
// 	gear: [
// 		{ name: "Wilson Pro Staff RF97", type: "Racket", link: "#" },
// 		{ name: "Wilson Natural Gut / Luxilon ALU Power", type: "String", link: "#" },
// 		{ name: "On Running THE ROGER Pro", type: "Shoes", link: "#" },
// 	],
// },
// SlgMvQQrYhg: {
// 	title: "Djokovic Kick Serve",
// 	player: "Novak Djokovic",
// 	shotType: "Serve",
// 	variant: ["Kick",
// 	gear: [
// 		{ name: "Head Speed Pro", type: "Racket", link: "#" },
// 		{ name: "Head Hawk Touch", type: "String", link: "#" },
// 		{ name: "Head Sprint Pro", type: "Shoes", link: "#" },
// 	],
// },
// };

// Placeholder videos for when a shot filter is active (cross-player view)
export const SHOT_VIDEOS = [
	{
		id: "97B2panmUvU",
		player: "Wawrinka",
		shotType: "Forehand",
		variant: ["Topspin"],
		title: "Wawrinka Forehand Slow Motion",
	},
	{
		id: "_cohjbquvwc",
		player: "Wawrinka",
		shotType: "Forehand",
		variant: ["Topspin"],
		title: "Wawrinka Forehand Slow Motion",
	},
];
