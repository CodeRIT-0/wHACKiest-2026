import { CONTACT_EMAIL, contactMailto } from "@/lib/contact";
import { participation } from "./participation";

export const faqCategories = [
  { id: "eligibility", label: "Eligibility & Teams" },
  { id: "registration", label: "Registration" },
  { id: "submissions", label: "Submissions & Selection" },
  { id: "payments", label: "Fees" },
  { id: "event", label: "Event Details" },
] as const;
export type FaqCategory = typeof faqCategories[number]["id"];
// Preserve the terminal's four existing illustrated information sources.
export type FaqSignalCategory = "registration" | "submission" | "selection" | "payment";

type AnswerPart = { text: string; href?: string; strong?: boolean; breakBefore?: boolean };
type FaqItem = { id: string; category: FaqCategory; signalCategory: FaqSignalCategory; question: string; answer: AnswerPart[] };

// Answers follow the currently confirmed wHACKiest 2026 event workflow.
export const faqItems: FaqItem[] = [
  { id: "event-level", category: "event", signalCategory: "selection", question: "At which level is this hackathon conducted?", answer: [{ text: "It’s a national-level, 24-hour offline hackathon hosted by CodeRIT at Ramaiah Institute of Technology, Bengaluru, open to undergraduate students from across India." }] },
  { id: "team-size", category: "eligibility", signalCategory: "registration", question: "How many members can participate in a team?", answer: [{ text: "Teams can consist of 2–4 members. Solo entries are not accepted. All members must be undergraduates from the same college, though they may be from different branches or years, and a participant cannot be part of more than one team." }] },
  { id: "what-to-build", category: "submissions", signalCategory: "submission", question: "What can we build?", answer: [{ text: "Participants can choose from the officially announced hackathon tracks and problem statements. Check " }, { text: "Announcements", href: "/announcements" }, { text: " for the latest information." }] },
  { id: "eligibility", category: "eligibility", signalCategory: "submission", question: "What is the qualification to participate?", answer: [{ text: "wHACKiest is open to all undergraduate students. Every participant must carry their college ID card to the venue." }] },
  { id: "registration-process", category: "registration", signalCategory: "registration", question: "How do we register for wHACKiest 2026?", answer: [
    { text: "Registration takes place on " }, { text: "Devnovate", href: participation.registrationHref }, { text: ", our official hackathon registration platform. The team leader creates a team, generates an invite code or link, and invites the other members. Devnovate automatically fetches each participant’s profile information. Teams must also answer the custom registration questions, including the required idea PPT. Registration closes on 24 November 2026 at 11:59 PM IST." },
  ] },
  { id: "idea-ppt", category: "submissions", signalCategory: "submission", question: "When and how do we submit our idea PPT?", answer: [{ text: "The idea PPT is submitted during registration, through the custom registration questions on Devnovate, before registration closes on 24 November 2026 at 11:59 PM IST. There is no separate PPT submission form or later PPT submission stage." }] },
  { id: "ideation-presentation", category: "submissions", signalCategory: "selection", question: "Will there be an ideation presentation?", answer: [{ text: "Yes. On 26–27 November 2026, registered teams take part in an online ideation presentation round, presenting their ideas and proposed solutions to the evaluation panel. Based on the evaluation, shortlisted teams, announced on 28 November, advance to the offline hackathon." }] },
  { id: "format-duration", category: "event", signalCategory: "selection", question: "Is the hackathon offline and how long does it last?", answer: [{ text: "Registration, PPT submission and the ideation presentation (26–27 November) take place online. Shortlisted teams take part in the offline 24-hour hackathon at Ramaiah Institute of Technology, Bengaluru, on 1–2 December 2026." }] },
  { id: "perks", category: "event", signalCategory: "selection", question: "What is the prize pool of wHACKiest 2026?", answer: [
    { text: "The total prize pool is ₹1,50,000 (1.5 Lakhs). Prize distribution and special award details will be announced through the official website and " }, { text: "Announcements", href: "/announcements" }, { text: ". For selection updates, visit " }, { text: "Shortlisted Teams", href: "/shortlisted" }, { text: " when results are announced." },
  ] },
  { id: "participation-fee", category: "payments", signalCategory: "payment", question: "Is there any registration fee to participate in wHACKiest 2026?", answer: [
    { text: "No. wHACKiest 2026 is completely free for everyone: there is no registration fee and no participation fee, including for shortlisted teams and participants from other colleges." },
  ] },
  { id: "shortlisted-teams", category: "event", signalCategory: "selection", question: "How will shortlisted teams be informed?", answer: [{ text: "Teams can check their selection status on the " }, { text: "Shortlisted Teams page", href: "/shortlisted" }, { text: " when results are announced on 28 November 2026. Further instructions regarding confirmation and offline participation will be communicated through official channels." }] },
  { id: "organizer-help", category: "event", signalCategory: "registration", question: "Whom should I contact for any queries regarding wHACKiest 2026?", answer: [
    { text: "For any queries or assistance regarding registration, participation or the event, feel free to contact our student coordinators:" },
    { text: "• Mishka Tiwari", strong: true, breakBefore: true }, { text: " – Student Coordinator" },
    { text: "Phone: ", breakBefore: true }, { text: "+91 8218934580", href: "tel:+918218934580" },
    { text: "• Kamal Karteek U", strong: true, breakBefore: true }, { text: " – Student Coordinator" },
    { text: "Phone: ", breakBefore: true }, { text: "+91 9108055864", href: "tel:+919108055864" },
    { text: "Email: ", strong: true, breakBefore: true }, { text: CONTACT_EMAIL, href: contactMailto() },
  ] },
];

export const faqContent = {
  label: "FAQ / HELP CENTER",
  title: "GOT QUESTIONS?",
  subtitle: "A few answers before your next move.",
  // the official CodeRIT address, from the wHACKiest 2026 brochure
  contactHref: contactMailto() as string | null,
};
