export const faqCategories = [
  { id: "eligibility", label: "Eligibility & Teams" },
  { id: "registration", label: "Registration" },
  { id: "submissions", label: "Submissions & Selection" },
  { id: "payments", label: "Payments" },
  { id: "event", label: "Event Details" },
] as const;
export type FaqCategory = typeof faqCategories[number]["id"];
// Preserve the terminal's four existing illustrated information sources.
export type FaqSignalCategory = "registration" | "submission" | "selection" | "payment";

type AnswerPart = { text: string; href?: string };
type FaqItem = { id: string; category: FaqCategory; signalCategory: FaqSignalCategory; question: string; answer: AnswerPart[] };

// answers follow the wHACKiest 2026 brochure; registration runs on Devfolio
export const faqItems: FaqItem[] = [
  { id: "event-level", category: "event", signalCategory: "selection", question: "At which level is this hackathon conducted?", answer: [{ text: "It’s a national-level, 24-hour offline hackathon hosted by CodeRIT at Ramaiah Institute of Technology, Bengaluru, open to undergraduate students from across India." }] },
  { id: "team-size", category: "eligibility", signalCategory: "registration", question: "How many members can participate in a team?", answer: [{ text: "Two to four members. Solo entries aren’t accepted, so find a crew early, and no one can be part of more than one team." }] },
  { id: "what-to-build", category: "submissions", signalCategory: "submission", question: "What can we build?", answer: [{ text: "Anything that fits one of the four tracks. The tracks are to be announced, so keep an eye on " }, { text: "Announcements", href: "/announcements" }, { text: "." }] },
  { id: "eligibility", category: "eligibility", signalCategory: "submission", question: "What is the qualification to participate?", answer: [{ text: "wHACKiest is open to all undergraduate students. Every participant must carry their college ID card to the venue." }] },
  { id: "participation-fee", category: "payments", signalCategory: "payment", question: "What is the participation fee?", answer: [
    { text: "Registering and submitting your idea is free. Payment is required only after shortlisting, for external-college participants; the amount will be shared with shortlisted teams. Follow the " },
    { text: "payment instructions", href: "/payments" }, { text: " and deadline to confirm participation." },
  ] },
  { id: "format-duration", category: "event", signalCategory: "selection", question: "Is the hackathon offline and how long does it last?", answer: [{ text: "The problem statement release and idea submission happen online; shortlisted teams continue to the offline round, an in-person 24-hour build sprint at Ramaiah Institute of Technology on 1–2 December 2026. Shortlisted teams get reporting instructions before the day." }] },
  { id: "team-formation", category: "eligibility", signalCategory: "registration", question: "What are the restrictions on team formation for the event?", answer: [{ text: "Teams have 2–4 members, all from the same college; members can be from different years or branches. No individual can be part of more than one team, and every participant must follow the code of conduct." }] },
  { id: "perks", category: "event", signalCategory: "selection", question: "What are the perks and benefits of participating in the hackathon?", answer: [
    { text: "A ₹50,000 prize pool, with how it's split and special awards to be announced. For selection updates, visit " }, { text: "Shortlisted Teams", href: "/shortlisted" }, { text: " when results are announced, and check " }, { text: "Announcements", href: "/announcements" }, { text: " for official updates." },
  ] },
  { id: "organizer-help", category: "event", signalCategory: "registration", question: "I have a question not listed above. What should I do?", answer: [{ text: "Write to " }, { text: "coderit@msrit.edu", href: "mailto:coderit@msrit.edu" }, { text: " or call a student coordinator: Mishka Tiwari (+91 82189 34580) or Kamal Karteek U (+91 91080 55864). Check " }, { text: "Announcements", href: "/announcements" }, { text: " for official updates." }] },
  { id: "idea-submission", category: "submissions", signalCategory: "submission", question: "How do I receive the idea submission mail?", answer: [{ text: "Email delivery instructions have not been published on this website. Choose a problem statement and submit your idea PPT according to the official submission guidelines. Follow the registration instructions for the submission process." }] },
];

export const faqContent = {
  label: "FAQ / HELP CENTER",
  title: "GOT QUESTIONS?",
  subtitle: "A few answers before your next move.",
  // the official CodeRIT address, from the wHACKiest 2026 brochure
  contactHref: "mailto:coderit@msrit.edu" as string | null,
};
