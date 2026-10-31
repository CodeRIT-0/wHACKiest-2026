export type FaqCategory = "registration" | "submission" | "selection" | "payment";

type AnswerPart = { text: string; href?: string };
type FaqItem = { category: FaqCategory; question: string; answer: AnswerPart[] };

export const FAQ_CATEGORIES: FaqCategory[] = ["registration", "submission", "selection", "payment"];

export const faqItems: FaqItem[] = [
  { category: "registration", question: "WHAT IS wHACKiest 2026?", answer: [
    { text: "wHACKiest 2026 is CodeRIT’s hackathon. Start by registering your team, choose a problem statement, and submit your idea PPT following the submission guidelines. " },
    { text: "Register Your Team", href: "/register" },
    { text: ": sign in with Google and enter your team and member details when registration is available." },
  ] },
  { category: "selection", question: "AT WHICH LEVEL IS THIS HACKATHON CONDUCTED?", answer: [{ text: "It’s a national-level, 24-hour offline hackathon hosted by CodeRIT at Ramaiah Institute of Technology, Bengaluru, open to undergraduate students from across India." }] },
  { category: "registration", question: "HOW MANY MEMBERS CAN PARTICIPATE IN A TEAM?", answer: [{ text: "Two to four members. Solo entries aren’t accepted, so find a crew early, and no one can be part of more than one team." }] },
  { category: "submission", question: "WHAT CAN WE BUILD?", answer: [{ text: "Anything that fits one of the four tracks: AI & Beyond, Web & Product, Social Impact or Open Innovation. If nothing fits, pitch it under Open Innovation." }] },
  { category: "submission", question: "WHAT IS THE QUALIFICATION TO PARTICIPATE?", answer: [{ text: "wHACKiest is open to all undergraduate students. Every participant must carry their college ID card to the venue." }] },
  { category: "payment", question: "WHAT IS THE PARTICIPATION FEE?", answer: [
    { text: "Registering and submitting your idea is free. Payment is required only after shortlisting, for external-college participants; the amount will be shared with shortlisted teams. Follow the " },
    { text: "payment instructions", href: "/payments" }, { text: " and deadline to confirm participation." },
  ] },
  { category: "selection", question: "IS THE HACKATHON OFFLINE AND HOW LONG DOES IT LAST?", answer: [{ text: "The problem statement release and idea submission happen online; shortlisted teams continue to the offline round, an in-person 24-hour build sprint at Ramaiah Institute of Technology on 1–2 December 2026. Shortlisted teams get reporting instructions before the day." }] },
  { category: "registration", question: "WHAT ARE THE RESTRICTIONS ON TEAM FORMATION FOR THE EVENT?", answer: [{ text: "Teams have 2–4 members, all from the same college; members can be from different years or branches. No individual can be part of more than one team, and every participant must follow the code of conduct." }] },
  { category: "selection", question: "WHAT ARE THE PERKS AND BENEFITS OF PARTICIPATING IN THE HACKATHON?", answer: [
    { text: "A ₹50,000 prize pool split across the top three teams, with special awards to be announced. For selection updates, visit " }, { text: "Shortlisted Teams", href: "/shortlisted" }, { text: " when results are announced, and check " }, { text: "Announcements", href: "/announcements" }, { text: " for official updates." },
  ] },
  { category: "registration", question: "I HAVE A QUESTION RELATED TO THE HACKATHON WHICH IS NOT LISTED ABOVE. WHAT SHOULD I DO?", answer: [{ text: "Write to " }, { text: "coderit@msrit.edu", href: "mailto:coderit@msrit.edu" }, { text: " or call a student coordinator: Mishka Tiwari (+91 82189 34580) or Kamal Karteek U (+91 91080 55864). Check " }, { text: "Announcements", href: "/announcements" }, { text: " for official updates." }] },
  { category: "submission", question: "HOW DO I RECEIVE THE IDEA SUBMISSION MAIL?", answer: [{ text: "Email delivery instructions have not been published on this website. Choose a problem statement and submit your idea PPT according to the official submission guidelines. Follow the registration instructions for the submission process." }] },
];

export const faqContent = {
  label: "FAQ / HELP CENTER",
  title: "GOT QUESTIONS?",
  subtitle: "A few answers before your next move.",
  // the official CodeRIT address, from the wHACKiest 2026 brochure
  contactHref: "mailto:coderit@msrit.edu" as string | null,
};
