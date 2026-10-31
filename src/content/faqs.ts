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

const unpublished = "Details have not been published on this website. Check Announcements for official updates.";
export const faqItems: FaqItem[] = [
  { id: "about-registration", category: "registration", signalCategory: "registration", question: "What is wHACKiest 2026?", answer: [
    { text: "wHACKiest 2026 is CodeRIT’s hackathon. Start by registering your team, choose a problem statement, and submit your idea PPT following the submission guidelines. " },
    { text: "Register Your Team", href: "/register" },
    { text: ": apply through Devfolio with your team and complete the required profile, team and application details." },
  ] },
  { id: "event-level", category: "event", signalCategory: "selection", question: "At which level is this hackathon conducted?", answer: [{ text: unpublished }] },
  { id: "team-size", category: "eligibility", signalCategory: "registration", question: "How many members can participate in a team?", answer: [{ text: "Team-size requirements have not been published on this website. Check Announcements for official updates." }] },
  { id: "eligibility", category: "eligibility", signalCategory: "submission", question: "What is the qualification to participate?", answer: [{ text: "Eligibility requirements have not been published on this website. Check Announcements for official updates." }] },
  { id: "participation-fee", category: "payments", signalCategory: "payment", question: "What is the participation fee?", answer: [
    { text: "The fee amount has not been published on this website. Payment is required only after shortlisting for external-college participants. Follow the " },
    { text: "payment instructions", href: "/payments" }, { text: " and deadline to confirm participation." },
  ] },
  { id: "format-duration", category: "event", signalCategory: "selection", question: "Is the hackathon offline and how long does it last?", answer: [{ text: "The participation guide asks shortlisted teams to arrive at the venue ready to build. Venue and duration details have not been published here; follow the official reporting instructions." }] },
  { id: "team-formation", category: "eligibility", signalCategory: "registration", question: "What are the restrictions on team formation for the event?", answer: [{ text: "Team-formation restrictions have not been published on this website. Check Announcements for official updates." }] },
  { id: "perks", category: "event", signalCategory: "selection", question: "What are the perks and benefits of participating in the hackathon?", answer: [
    { text: "Perks and benefits have not been published on this website. For selection updates, visit " }, { text: "Shortlisted Teams", href: "/shortlisted" }, { text: " when results are announced, and check " }, { text: "Announcements", href: "/announcements" }, { text: " for official updates." },
  ] },
  { id: "organizer-help", category: "event", signalCategory: "registration", question: "I have a question not listed above. What should I do?", answer: [{ text: "Organizer contact details have not been published here yet. Check " }, { text: "Announcements", href: "/announcements" }, { text: " for official updates." }] },
  { id: "idea-submission", category: "submissions", signalCategory: "submission", question: "How do I receive the idea submission mail?", answer: [{ text: "Email delivery instructions have not been published on this website. Choose a problem statement and submit your idea PPT according to the official submission guidelines. Follow the registration instructions for the submission process." }] },
];

export const faqContent = {
  label: "FAQ / HELP CENTER",
  title: "GOT QUESTIONS?",
  subtitle: "A few answers before your next move.",
  // Add only a confirmed official organizer destination. No placeholder URL.
  contactHref: null as string | null,
};
