// Registration rules, shared by the form (src/components/register) and mirrored in the
// Google Apps Script that receives submissions (apps-script/registration/Code.gs).
// If you change a rule here, change it there too: the script is the one that enforces it.

export const TEAM_SIZES = [2, 3, 4] as const;
export type TeamSize = (typeof TEAM_SIZES)[number];

export const MAX_PPT_MB = 10;
export const PPT_EXTENSIONS = [".ppt", ".pptx", ".pdf"];

/** WhatsApp community invite shown after registering. Empty = "link coming soon". */
export const WHATSAPP_COMMUNITY_URL = "";

/** Team IDs look like WH26-K7M3QX (made by the Apps Script from the leader's email + a secret). */
export const TEAM_ID = /^WH26-[A-Z0-9]{6}$/;
export const normaliseTeamId = (value: string) => {
  const v = value.toUpperCase().replace(/[\s]+/g, "");
  return /^[A-Z0-9]{6}$/.test(v) ? `WH26-${v}` : v.replace(/^WH26(?=[A-Z0-9]{6}$)/, "WH26-");
};

export type Member = { name: string; usn: string };

export type RegistrationDraft = {
  teamName: string;
  leaderName: string;
  leaderUsn: string;
  leaderEmail: string;
  leaderContact: string;
  size: TeamSize;
  /** always three slots; only the first `size - 1` are part of the team */
  members: Member[];
};

export type FieldErrors = Partial<Record<string, string>>;

/**
 * USNs are 1 + a two-letter college code + 24, 25 or 26 + five letters/digits, any college
 * (1MS24CS001, 1RV25IS042). 2026 USNs end in -T: 1MS26CS001-T.
 * Spaces anywhere are dropped and a 2026 USN is written with "-T" whether or not the hyphen was
 * typed, so "1ms26cs001  -T", "1MS26CS001 T" and "1MS26CS001-T" are all the same USN.
 */
export const normaliseUsn = (value: string) => {
  const v = value.toUpperCase().replace(/\s+/g, "");
  const tagged = /^(1[A-Z]{2}26[A-Z0-9]{5})-?T$/.exec(v);
  return tagged ? `${tagged[1]}-T` : v;
};
/** keeps the last 10 digits of an Indian number typed as +91…, 0… or with spaces */
export const normalisePhone = (value: string) => value.replace(/\D/g, "").replace(/^(?:91|0)(?=\d{10}$)/, "");

const USN = /^(?:1[A-Z]{2}2[45][A-Z0-9]{5}|1[A-Z]{2}26[A-Z0-9]{5}-T)$/;
const PHONE = /^[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const activeMembers = (draft: RegistrationDraft) => draft.members.slice(0, draft.size - 1);

function checkName(value: string, label: string) {
  const v = value.trim();
  if (!v) return `Enter the ${label}.`;
  if (v.length < 2 || v.length > 60) return `The ${label} should be 2–60 characters.`;
}

function checkUsn(value: string) {
  const v = normaliseUsn(value);
  if (!v) return "Enter the USN.";
  if (USN.test(v)) return;
  if (/^1[A-Z]{2}26[A-Z0-9]{5}$/.test(v)) return "2026 USNs end in -T, like 1MS26CS001-T.";
  return "Enter a USN like 1MS24CS001, 1RV25IS042 or 1MS26CS001-T.";
}

export function validateRegistration(draft: RegistrationDraft): FieldErrors {
  const errors: FieldErrors = {};
  const team = draft.teamName.trim();
  if (!team) errors.teamName = "Give your team a name.";
  else if (team.length < 2 || team.length > 40) errors.teamName = "Team names are 2–40 characters.";

  errors.leaderName = checkName(draft.leaderName, "leader's name");
  errors.leaderUsn = checkUsn(draft.leaderUsn);
  errors.leaderEmail = checkEmail(draft.leaderEmail);
  const phone = normalisePhone(draft.leaderContact);
  if (!phone) errors.leaderContact = "Enter the leader's contact number.";
  else if (!PHONE.test(phone)) errors.leaderContact = "Enter a 10-digit Indian mobile number.";

  // every USN in the team must be different
  const seen = new Set<string>();
  if (!errors.leaderUsn) seen.add(normaliseUsn(draft.leaderUsn));
  activeMembers(draft).forEach((member, i) => {
    errors[`members.${i}.name`] = checkName(member.name, "member's name");
    const usnError = checkUsn(member.usn);
    const usn = normaliseUsn(member.usn);
    if (usnError) errors[`members.${i}.usn`] = usnError;
    else if (seen.has(usn)) errors[`members.${i}.usn`] = "This USN is already used by someone in your team.";
    else seen.add(usn);
  });

  return prune(errors);
}

function prune(errors: FieldErrors) {
  for (const key of Object.keys(errors)) if (!errors[key]) delete errors[key];
  return errors;
}

export function checkEmail(value: string) {
  if (!value.trim()) return "Enter the leader's email.";
  if (!EMAIL.test(value.trim())) return "That email doesn't look right.";
}

export function checkPpt(file: File | null) {
  if (!file) return "Upload your idea PPT.";
  const name = file.name.toLowerCase();
  if (!PPT_EXTENSIONS.some(ext => name.endsWith(ext))) return "Upload a .ppt, .pptx or .pdf file.";
  if (file.size > MAX_PPT_MB * 1024 * 1024) return `Keep the file under ${MAX_PPT_MB} MB.`;
}

export type SubmissionDraft = { teamId: string; leaderEmail: string; track: string; file: File | null };

export function validateSubmission(draft: SubmissionDraft): FieldErrors {
  const id = normaliseTeamId(draft.teamId);
  return prune({
    teamId: !id ? "Enter your team ID." : TEAM_ID.test(id) ? undefined : "Team IDs look like WH26-K7M3QX.",
    leaderEmail: checkEmail(draft.leaderEmail),
    track: draft.track ? undefined : "Choose a track.",
    file: checkPpt(draft.file),
  });
}
