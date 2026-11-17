// The organisers' inbox. Every "contact the organisers" link opens a new mail to it, with the
// To field filled in and a subject line so the team can sort the inbox.
export const CONTACT_EMAIL = "coderit@msrit.edu";

export const contactMailto = (subject = "wHACKiest 2026 query") =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
