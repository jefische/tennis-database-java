// Placeholder player data — will come from API/DB later

type playerData = {
	name: string;
	slug: string;
	image: string;
	shots: string[];
	hand: string;
	serve: string;
	forehand: string;
	backhand: string;
};
export const PLAYERS: playerData[] = [
	{
		name: "Roger Federer",
		slug: "federer",
		image: "https://img.youtube.com/vi/pRYJHxmZdQE/0.jpg",
		shots: ["Forehand", "Backhand", "Platform Serve", "Volley"],
		hand: "right",
		serve: "platform",
		forehand: "eastern",
		backhand: "one",
	},
	// {
	// 	name: "Rafael Nadal",
	// 	slug: "nadal",
	// 	image: "https://img.youtube.com/vi/RDl2Kz0gd18/0.jpg",
	// 	shots: ["Forehand", "Backhand", "Serve", "Return"],
	// },
	// {
	// 	name: "Novak Djokovic",
	// 	slug: "djokovic",
	// 	image: "https://img.youtube.com/vi/hUuj7AoOWpc/0.jpg",
	// 	shots: ["Forehand", "Backhand", "Serve", "Return", "Volley"],
	// },
	{
		name: "Stanislas Wawrinka",
		slug: "wawrinka",
		image: "https://img.youtube.com/vi/xOhLAbf_EAI/0.jpg",
		// image: "https://img.youtube.com/vi/Dyj1Id6HDJ0/0.jpg",
		shots: ["Forehand", "Backhand", "Pinpoint Serve"],
		hand: "right",
		serve: "pinpoint",
		forehand: "semi-western",
		backhand: "one",
	},
	// {
	// 	name: "Carlos Alcaraz",
	// 	slug: "alcaraz",
	// 	image: "https://img.youtube.com/vi/_cohjbquvwc/0.jpg",
	// 	shots: ["Forehand", "Backhand", "Serve", "Volley"],
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
		videos: { id: string; title: string; shotType: string; variant: string }[];
		gear: { name: string; type: string; link: string }[];
	}
> = {
	federer: {
		name: "Roger Federer",
		videos: [
			{ id: "gFmI3pNSdFI", title: "Federer Backhand Compilation", shotType: "Backhand", variant: "One-handed" },
			{ id: "3OL6umAxQ4c", title: "Federer Serve Compilation", shotType: "Serve", variant: "Flat" },
		],
		gear: [
			{ name: "Yonex VCORE 95", type: "Racket", link: "#" },
			{ name: "Luxilon ALU Power 125", type: "String", link: "#" },
			{ name: "Yonex Power Cushion Eclipsion", type: "Shoes", link: "#" },
		],
	},
	wawrinka: {
		name: "Stanislas Wawrinka",
		videos: [
			{
				id: "Re-8_POaRIw",
				title: "Wawrinka One-Handed Backhand — Court Level",
				shotType: "Backhand",
				variant: "One-handed",
			},
			{
				id: "SlgMvQQrYhg",
				title: "Wawrinka One-Handed Backhand — Slow Motion",
				shotType: "Backhand",
				variant: "One-handed",
			},
			{
				id: "wWCVFRRaFCs",
				title: "Wawrinka One-Handed Backhand — Slow Motion",
				shotType: "Backhand",
				variant: "One-handed",
			},
			{
				id: "mx3eA5P-3nA",
				title: "Wawrinka One-Handed Backhand — Slow Motion",
				shotType: "Backhand",
				variant: "One-handed",
			},
			{
				id: "q3J2P8on7js",
				title: "Wawrinka One-Handed Backhand — Court Level",
				shotType: "Backhand",
				variant: "One-handed",
			},
			{
				id: "_7gd-XJRiEQ",
				title: "Wawrinka One-Handed Backhand — Match Play",
				shotType: "Backhand",
				variant: "One-handed",
			},
			{
				id: "97B2panmUvU",
				title: "Wawrinka Forehand Slow Motion",
				shotType: "Forehand",
				variant: "Topspin",
			},
			{
				id: "_cohjbquvwc",
				title: "Wawrinka Forehand Slow Motion",
				shotType: "Forehand",
				variant: "Topspin",
			},
			{
				id: "hUuj7AoOWpc",
				title: "Wawrinka Forehand in Slow Motion",
				shotType: "Forehand",
				variant: "Topspin",
			},
			{
				id: "RDl2Kz0gd18",
				title: "Wawrinka Forehand Slow Motion",
				shotType: "Forehand",
				variant: "Topspin",
			},
			{
				id: "zYqtCPvGf4Y",
				title: "Wawrinka Forehand Slow Motion",
				shotType: "Forehand",
				variant: "Topspin",
			},
			{
				id: "_FBLXOaSAsU",
				title: "Wawrinka Forehand Slow Motion",
				shotType: "Forehand",
				variant: "Topspin",
			},
			{
				id: "_xmJO_ZUtWU",
				title: "Wawrinka Serve",
				shotType: "Serve",
				variant: "Pinpoint",
			},
			{
				id: "Y1uhp9W0X9w",
				title: "Wawrinka Serve",
				shotType: "Serve",
				variant: "Pinpoint",
			},
			{
				id: "RcLbJzb5MdQ",
				title: "Wawrinka Serve",
				shotType: "Serve",
				variant: "Pinpoint",
			},
			{
				id: "58YBh2sUt7A",
				title: "Wawrinka Serve",
				shotType: "Serve",
				variant: "Pinpoint",
			},
			{
				id: "BLSFn33Z4IE",
				title: "Wawrinka Serve",
				shotType: "Serve",
				variant: "Pinpoint",
			},
			{
				id: "PSNl0Hdw1wM",
				title: "Wawrinka Serve",
				shotType: "Serve",
				variant: "Pinpoint",
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
export const VIDEO_DATA: Record<
	string,
	{
		title: string;
		player: string;
		shotType: string;
		variant: string;
		gear: { name: string; type: string; link: string }[];
	}
> = {
	"_7gd-XJRiEQ": {
		title: "Wawrinka One-Handed Backhand — Match Play",
		player: "Stanislas Wawrinka",
		shotType: "Backhand",
		variant: "One-handed",
		gear: [
			{ name: "Yonex VCORE 95", type: "Racket", link: "#" },
			{ name: "Luxilon ALU Power 125", type: "String", link: "#" },
			{ name: "Yonex Power Cushion Eclipsion", type: "Shoes", link: "#" },
		],
	},
	q3J2P8on7js: {
		title: "Wawrinka One-Handed Backhand — Court Level",
		player: "Stanislas Wawrinka",
		shotType: "Backhand",
		variant: "One-handed",
		gear: [
			{ name: "Yonex VCORE 95", type: "Racket", link: "#" },
			{ name: "Luxilon ALU Power 125", type: "String", link: "#" },
			{ name: "Yonex Power Cushion Eclipsion", type: "Shoes", link: "#" },
		],
	},
	"mx3eA5P-3nA": {
		title: "Wawrinka One-Handed Backhand — Slow Motion",
		player: "Stanislas Wawrinka",
		shotType: "Backhand",
		variant: "One-handed",
		gear: [
			{ name: "Yonex VCORE 95", type: "Racket", link: "#" },
			{ name: "Luxilon ALU Power 125", type: "String", link: "#" },
			{ name: "Yonex Power Cushion Eclipsion", type: "Shoes", link: "#" },
		],
	},
	wWCVFRRaFCs: {
		title: "Wawrinka One-Handed Backhand — Slow Motion",
		player: "Stanislas Wawrinka",
		shotType: "Backhand",
		variant: "One-handed",
		gear: [
			{ name: "Yonex VCORE 95", type: "Racket", link: "#" },
			{ name: "Luxilon ALU Power 125", type: "String", link: "#" },
			{ name: "Yonex Power Cushion Eclipsion", type: "Shoes", link: "#" },
		],
	},
	SlgMvQQrYhg: {
		title: "Wawrinka One-Handed Backhand — Slow Motion",
		player: "Stanislas Wawrinka",
		shotType: "Backhand",
		variant: "One-handed",
		gear: [
			{ name: "Yonex VCORE 95", type: "Racket", link: "#" },
			{ name: "Luxilon ALU Power 125", type: "String", link: "#" },
			{ name: "Yonex Power Cushion Eclipsion", type: "Shoes", link: "#" },
		],
	},
	"Re-8_POaRIw": {
		title: "Wawrinka One-Handed Backhand — Court Level",
		player: "Stanislas Wawrinka",
		shotType: "Backhand",
		variant: "One-handed",
		gear: [
			{ name: "Yonex VCORE 95", type: "Racket", link: "#" },
			{ name: "Luxilon ALU Power 125", type: "String", link: "#" },
			{ name: "Yonex Power Cushion Eclipsion", type: "Shoes", link: "#" },
		],
	},
	gFmI3pNSdFI: {
		title: "Federer Backhand Compilation",
		player: "Roger Federer",
		shotType: "Backhand",
		variant: "One-handed",
		gear: [
			{ name: "Wilson Pro Staff RF97", type: "Racket", link: "#" },
			{ name: "Wilson Natural Gut / Luxilon ALU Power", type: "String", link: "#" },
			{ name: "On Running THE ROGER Pro", type: "Shoes", link: "#" },
		],
	},
	"3OL6umAxQ4c": {
		title: "Federer Serve Slow Motion",
		player: "Roger Federer",
		shotType: "Serve",
		variant: "Flat",
		gear: [
			{ name: "Wilson Pro Staff RF97", type: "Racket", link: "#" },
			{ name: "Wilson Natural Gut / Luxilon ALU Power", type: "String", link: "#" },
			{ name: "On Running THE ROGER Pro", type: "Shoes", link: "#" },
		],
	},

	// RDl2Kz0gd18: {
	// 	title: "Alcaraz Forehand Practice",
	// 	player: "Carlos Alcaraz",
	// 	shotType: "Forehand",
	// 	variant: "Topspin",
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
	// 	variant: "Deep return",
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
	// 	variant: "Topspin",
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
	// 	variant: "Two-handed",
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
	// 	variant: "Flat",
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
	// 	variant: "Kick",
	// 	gear: [
	// 		{ name: "Head Speed Pro", type: "Racket", link: "#" },
	// 		{ name: "Head Hawk Touch", type: "String", link: "#" },
	// 		{ name: "Head Sprint Pro", type: "Shoes", link: "#" },
	// 	],
	// },
};

// Placeholder videos for when a shot filter is active (cross-player view)
export const SHOT_VIDEOS = [
	{
		id: "97B2panmUvU",
		player: "Wawrinka",
		shotType: "Forehand",
		variant: "Topspin",
		title: "Wawrinka Forehand Slow Motion",
	},
	{
		id: "_cohjbquvwc",
		player: "Wawrinka",
		shotType: "Forehand",
		variant: "Topspin",
		title: "Wawrinka Forehand Slow Motion",
	},
];
