import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const faqs = [
	{
		question: "What is the Tennis Match Archive?",
		answer: "The Tennis Match Archive is a curated video database of professional tennis matches. Browse full matches from major tournaments, organized by event, year, round, and player.",
	},
	{
		question: "How do I search for a specific match?",
		answer: "Use the search bar at the top of the Match Archives page to find matches by player name, tournament, or year. You can also use the sidebar filters to narrow results by tournament and year.",
	},
	// {
	// 	question: "Can I add my own match videos?",
	// 	answer: "Registered users can submit YouTube links to add matches to the archive. Simply log in, click the Add Video card, and fill out the match details including tournament, year, round, and players.",
	// },
	{
		question: "Can I add my own match videos?",
		answer: "Not currently. Please use the form below to suggest matches to add to the archive. Make sure to include the Youtube link.",
	},
	{
		question: "What tournaments are available?",
		answer: "The archive includes matches from Grand Slams (Australian Open, Roland Garros, Wimbledon, US Open), Masters 1000 events, ATP Finals, and other notable tournaments. New events are added regularly.",
	},
	{
		question: "How are matches organized?",
		answer: "Matches are organized by tournament and year. Each match card displays the tournament name, round, players, and year. Use the sidebar filters to browse by tournament or year, and tag filters for quick access.",
	},
	{
		question: "Is the archive free to use?",
		answer: "Yes, browsing and searching the archive is completely free. You only need an account if you want to contribute by adding new match videos to the database.",
	},
];

export default function FAQ() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [question, setQuestion] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!question.trim()) return;
		toast.success("Question submitted! We'll get back to you soon.");
		setName("");
		setEmail("");
		setQuestion("");
	};

	return (
		<div className="h-[calc(100%-64px)] overflow-y-auto bg-background scrollbar-custom">
			<div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
						Frequently Asked Questions
					</h1>
					<p className="mt-3 text-muted-foreground text-lg">
						Everything you need to know about the Tennis Match Archive.
					</p>
				</div>

				{/* FAQ Cards */}
				<div className="space-y-4 mb-16">
					{faqs.map((faq, i) => (
						<div
							key={i}
							className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
						>
							<h2 className="text-xl font-semibold text-card-foreground">{faq.question}</h2>
							<p className="mt-2 text-base leading-relaxed text-muted-foreground">{faq.answer}</p>
						</div>
					))}
				</div>

				{/* Divider */}
				<div className="relative mb-12">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-border" />
					</div>
					<div className="relative flex justify-center">
						<span className="bg-background px-4 text-sm text-muted-foreground">Still have questions?</span>
					</div>
				</div>

				{/* Submit a Question Form */}
				<div className="rounded-lg border border-border bg-card p-6 sm:p-8 shadow-sm mb-12">
					<h2 className="text-xl font-semibold text-card-foreground mb-1">Ask a Question</h2>
					<p className="text-sm text-muted-foreground mb-6">
						Send us your question and we'll get back to you.
					</p>

					<form onSubmit={handleSubmit} className="space-y-5">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="faq-name" className="text-base">
									Name
								</Label>
								<Input
									id="faq-name"
									placeholder="Your name"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="faq-email" className="text-base">
									Email
								</Label>
								<Input
									id="faq-email"
									type="email"
									placeholder="you@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="faq-question" className="text-base">
								Question
							</Label>
							<textarea
								id="faq-question"
								rows={4}
								placeholder="What would you like to know?"
								value={question}
								onChange={(e) => setQuestion(e.target.value)}
								className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
								required
							/>
						</div>

						<Button type="submit" className="w-full sm:w-auto cursor-pointer">
							Submit Question
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
