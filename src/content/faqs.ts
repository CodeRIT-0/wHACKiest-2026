export type FaqCategory = "registration" | "submission" | "selection" | "payment";

type AnswerPart = { text: string; href?: string };
type FaqItem = { category: FaqCategory; question: string; answer: AnswerPart[] };

const unpublished = "Details have not been published on this website. Check Announcements for official updates.";
export const faqItems: FaqItem[] = [
  { category: "registration", question: "WHAT IS wHACKiest 2026?", answer: [
    { text: "wHACKiest 2026 is CodeRIT’s hackathon. Start by registering your team, choose a problem statement, and submit your idea PPT following the submission guidelines. " },
    { text: "Register Your Team", href: "/register" },
    { text: ": sign in with Google and enter your team and member details when registration is available." },
  ] },
  { category: "selection", question: "AT WHICH LEVEL IS THIS HACKATHON CONDUCTED?", answer: [{ text: unpublished }] },
  { category: "registration", question: "HOW MANY MEMBERS CAN PARTICIPATE IN A TEAM?", answer: [{ text: "Team-size requirements have not been published on this website. Check Announcements for official updates." }] },
  { category: "submission", question: "WHAT IS THE QUALIFICATION TO PARTICIPATE?", answer: [{ text: "Eligibility requirements have not been published on this website. Check Announcements for official updates." }] },
  { category: "payment", question: "WHAT IS THE PARTICIPATION FEE?", answer: [
    { text: "The fee amount has not been published on this website. Payment is required only after shortlisting for external-college participants. Follow the " },
    { text: "payment instructions", href: "/payments" }, { text: " and deadline to confirm participation." },
  ] },
  { category: "selection", question: "IS THE HACKATHON OFFLINE AND HOW LONG DOES IT LAST?", answer: [{ text: "The participation guide asks shortlisted teams to arrive at the venue ready to build. Venue and duration details have not been published here; follow the official reporting instructions." }] },
  { category: "registration", question: "WHAT ARE THE RESTRICTIONS ON TEAM FORMATION FOR THE EVENT?", answer: [{ text: "Team-formation restrictions have not been published on this website. Check Announcements for official updates." }] },
  { category: "selection", question: "WHAT ARE THE PERKS AND BENEFITS OF PARTICIPATING IN THE HACKATHON?", answer: [
    { text: "Perks and benefits have not been published on this website. For selection updates, visit " }, { text: "Shortlisted Teams", href: "/shortlisted" }, { text: " when results are announced, and check " }, { text: "Announcements", href: "/announcements" }, { text: " for official updates." },
  ] },
  { category: "registration", question: "I HAVE A QUESTION RELATED TO THE HACKATHON WHICH IS NOT LISTED ABOVE. WHAT SHOULD I DO?", answer: [{ text: "Organizer contact details have not been published here yet. Check " }, { text: "Announcements", href: "/announcements" }, { text: " for official updates." }] },
  { category: "submission", question: "HOW DO I RECEIVE THE IDEA SUBMISSION MAIL?", answer: [{ text: "Email delivery instructions have not been published on this website. Choose a problem statement and submit your idea PPT according to the official submission guidelines. Follow the registration instructions for the submission process." }] },
];

export const faqContent = {
  label: "FAQ / HELP CENTER",
  title: "GOT QUESTIONS?",
  subtitle: "A few answers before your next move.",
  // Add only a confirmed official organizer destination. No placeholder URL.
  contactHref: null as string | null,
};
