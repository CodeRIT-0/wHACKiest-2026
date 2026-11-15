/**
 * wHACKiest 2026 — registration + PPT submission backend.
 *
 * action "register" (the /register page): enforces the rules (mirrors src/content/registration.ts),
 *   rejects a USN or leader contact that's already registered, makes a team ID from the leader's
 *   email and a secret, and appends one row per team to the "Registrations" sheet.
 * action "submit" (the hidden /uplink page): checks team ID + leader email, records the team's
 *   track, saves the PPT to Drive and links it on the team's row. Re-uploading replaces both.
 *
 * Setup: see README.md next to this file.
 */

// ---- config -------------------------------------------------------------------------------
const CONFIG = {
  SHEET_NAME: "Registrations",
  /** Drive folder for the PPTs: the long ID from the folder's URL (drive.google.com/drive/folders/<ID>) */
  PPT_FOLDER_ID: "PASTE_DRIVE_FOLDER_ID_HERE",
  /** flip either to false (then deploy a new version) to close it without touching the website */
  REGISTRATION_OPEN: true,
  SUBMISSIONS_OPEN: true,
  MAX_PPT_MB: 10,
  TEAM_ID_PREFIX: "WH26-",
};

const HEADERS = [
  "Timestamp", "Team ID", "Team Name", "Track", "Team Size",
  "Leader Name", "Leader USN", "Leader Email", "Leader Contact",
  "Member 2 Name", "Member 2 USN", "Member 3 Name", "Member 3 USN", "Member 4 Name", "Member 4 USN",
  "Status", "PPT", "PPT Submitted At",
];
const COL = Object.fromEntries(HEADERS.map((h, i) => [h, i]));
const MEMBER_USN_COLS = [COL["Member 2 USN"], COL["Member 3 USN"], COL["Member 4 USN"]];

// no 0/O, 1/I/L: IDs get read out over the phone and typed by hand
const ID_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
// 1 + college code + 24/25 + 5 chars, or 1 + college code + 26 + 5 chars + -T (any college); usnOf() writes a 2026 USN with "-T" however it was spaced
const USN = /^(?:1[A-Z]{2}2[45][A-Z0-9]{5}|1[A-Z]{2}26[A-Z0-9]{5}-T)$/;
const PHONE = /^[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TEAM_ID = /^WH26-[A-Z0-9]{6}$/;
const PPT_TYPES = {
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".pdf": "application/pdf",
};

// ---- entry points -------------------------------------------------------------------------
function doGet() {
  return json({ ok: true, registration: CONFIG.REGISTRATION_OPEN, submissions: CONFIG.SUBMISSIONS_OPEN });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    // honeypot: humans never fill this; pretend success so bots don't retry
    if (data.website) return json({ ok: true, id: CONFIG.TEAM_ID_PREFIX + "XXXXXX" });

    if (data.action === "submit") return json(submitPpt(data, lock));
    return json(register(data, lock));
  } catch (err) {
    if (err && err.userFacing) return json({ ok: false, error: err.message, field: err.field });
    console.error(err);
    return json({ ok: false, error: "Something went wrong on our side. Please try again in a minute." });
  } finally {
    lock.releaseLock();
  }
}

// ---- register -----------------------------------------------------------------------------
function register(data, lock) {
  if (!CONFIG.REGISTRATION_OPEN) throw userError("Registrations are closed.");
  const team = cleanTeam(data);

  // one registration at a time, so two teams can't claim the same USN simultaneously
  lock.waitLock(30000);
  const sheet = getSheet();
  const rows = readRows(sheet);
  assertUnique(rows, team);
  const id = teamIdFor(team.leaderEmail, new Set(rows.map(r => r[COL["Team ID"]])));

  const row = new Array(HEADERS.length).fill("");
  row[COL["Timestamp"]] = new Date();
  row[COL["Team ID"]] = id;
  row[COL["Team Name"]] = team.teamName;
  row[COL["Team Size"]] = team.size;
  row[COL["Leader Name"]] = team.leaderName;
  row[COL["Leader USN"]] = team.leaderUsn;
  row[COL["Leader Email"]] = team.leaderEmail;
  row[COL["Leader Contact"]] = team.leaderContact;
  team.members.forEach((m, i) => {
    row[COL["Member 2 Name"] + i * 2] = m.name;
    row[COL["Member 2 USN"] + i * 2] = m.usn;
  });
  row[COL["Status"]] = "Registered";
  sheet.appendRow(row);
  SpreadsheetApp.flush();

  return { ok: true, id: id };
}

/** WH26- + 6 characters from SHA-256(secret | email | n): stable per email, unguessable without the secret */
function teamIdFor(email, taken) {
  const secret = idSecret();
  for (let n = 0; n < 50; n++) {
    const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, `${secret}|${email}|${n}`, Utilities.Charset.UTF_8);
    let code = "";
    for (let i = 0; i < 6; i++) code += ID_ALPHABET[(bytes[i] + 256) % ID_ALPHABET.length];
    const id = CONFIG.TEAM_ID_PREFIX + code;
    if (!taken.has(id)) return id;
  }
  throw new Error("Could not make a unique team ID");
}

/** random secret, made once and kept in Script Properties (never in the code, which may be public) */
function idSecret() {
  const props = PropertiesService.getScriptProperties();
  let secret = props.getProperty("ID_SECRET");
  if (!secret) {
    secret = Utilities.getUuid() + Utilities.getUuid();
    props.setProperty("ID_SECRET", secret);
  }
  return secret;
}

// ---- submit PPT ---------------------------------------------------------------------------
function submitPpt(data, lock) {
  if (!CONFIG.SUBMISSIONS_OPEN) throw userError("PPT submissions are closed.");
  const teamId = text(data.teamId).toUpperCase();
  if (!TEAM_ID.test(teamId)) throw userError("Team IDs look like WH26-K7M3QX.", "teamId");
  const email = text(data.leaderEmail).toLowerCase();
  if (!EMAIL.test(email)) throw userError("That email doesn't look right.", "leaderEmail");
  const track = text(data.track);
  if (!track || track.length > 80) throw userError("Choose a track.", "track");
  const file = cleanFile(data.file);

  lock.waitLock(30000);
  const sheet = getSheet();
  const rows = readRows(sheet);
  const index = rows.findIndex(r => r[COL["Team ID"]] === teamId);
  // same message for both, so the form can't be used to find out which team IDs exist
  if (index === -1 || text(rows[index][COL["Leader Email"]]).toLowerCase() !== email) {
    throw userError("That team ID and leader email don't match a registered team.", "teamId");
  }
  const row = rows[index];
  if (row[COL["Status"]] === "Withdrawn") throw userError("This team has withdrawn. Contact the organisers.", "teamId");

  const previous = row[COL["PPT"]];
  const safeTeam = text(row[COL["Team Name"]]).replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "_") || "team";
  const blob = Utilities.newBlob(Utilities.base64Decode(file.data), PPT_TYPES[file.ext], `${teamId}_${safeTeam}${file.ext}`);
  const url = DriveApp.getFolderById(CONFIG.PPT_FOLDER_ID).createFile(blob).getUrl();

  const sheetRow = index + 2;
  sheet.getRange(sheetRow, COL["Track"] + 1).setValue(track);
  sheet.getRange(sheetRow, COL["PPT"] + 1, 1, 2).setValues([[url, new Date()]]);
  SpreadsheetApp.flush();

  // the newest upload is the one that counts; bin the old one so reviewers never see two
  const oldId = previous && (String(previous).match(/[-\w]{25,}/) || [])[0];
  if (oldId) {
    try {
      DriveApp.getFileById(oldId).setTrashed(true);
    } catch (err) {
      console.warn("Could not trash previous PPT", oldId, err);
    }
  }

  return { ok: true, teamName: row[COL["Team Name"]], replaced: Boolean(previous) };
}

// ---- validation ---------------------------------------------------------------------------
function userError(message, field) {
  const err = new Error(message);
  err.userFacing = true;
  err.field = field;
  return err;
}

const text = v => String(v == null ? "" : v).trim();
const usnOf = v => {
  const s = text(v).toUpperCase().replace(/\s+/g, "");
  const tagged = /^(1[A-Z]{2}26[A-Z0-9]{5})-?T$/.exec(s);
  return tagged ? `${tagged[1]}-T` : s;
};
const phoneOf = v => text(v).replace(/\D/g, "").replace(/^(?:91|0)(?=\d{10}$)/, "");

function name(value, label, field) {
  const v = text(value);
  if (v.length < 2 || v.length > 60) throw userError(`Enter the ${label} (2–60 characters).`, field);
  return v;
}

function usn(value, field) {
  const v = usnOf(value);
  if (/^1[A-Z]{2}26[A-Z0-9]{5}$/.test(v)) throw userError("2026 USNs end in -T, like 1MS26CS001-T.", field);
  if (!USN.test(v)) throw userError("Enter a USN like 1MS24CS001, 1RV25IS042 or 1MS26CS001-T.", field);
  return v;
}

function cleanTeam(data) {
  const teamName = text(data.teamName);
  if (teamName.length < 2 || teamName.length > 40) throw userError("Team names are 2–40 characters.", "teamName");

  const size = Number(data.size);
  if ([2, 3, 4].indexOf(size) === -1) throw userError("Teams have 2 to 4 members.", "size");

  const leaderName = name(data.leaderName, "leader's name", "leaderName");
  const leaderUsn = usn(data.leaderUsn, "leaderUsn");
  const leaderEmail = text(data.leaderEmail).toLowerCase();
  if (!EMAIL.test(leaderEmail)) throw userError("That email doesn't look right.", "leaderEmail");
  const leaderContact = phoneOf(data.leaderContact);
  if (!PHONE.test(leaderContact)) throw userError("Enter a 10-digit Indian mobile number.", "leaderContact");

  const raw = Array.isArray(data.members) ? data.members : [];
  if (raw.length !== size - 1) throw userError("Add every member of your team.", "members.0.name");
  const seen = [leaderUsn];
  const members = raw.map((m, i) => {
    const member = { name: name(m && m.name, "member's name", `members.${i}.name`), usn: usn(m && m.usn, `members.${i}.usn`) };
    if (seen.indexOf(member.usn) !== -1) throw userError("This USN is already used by someone in your team.", `members.${i}.usn`);
    seen.push(member.usn);
    return member;
  });

  return { teamName, size, leaderName, leaderUsn, leaderEmail, leaderContact, members };
}

function cleanFile(file) {
  file = file || {};
  const fileName = text(file.name);
  const ext = (fileName.match(/\.[^.]+$/) || [""])[0].toLowerCase();
  if (!PPT_TYPES[ext] || !file.data) throw userError("Upload a .ppt, .pptx or .pdf file.", "file");
  // base64 is 4/3 the size of the file
  if (String(file.data).length * 0.75 > CONFIG.MAX_PPT_MB * 1024 * 1024) throw userError(`Keep the file under ${CONFIG.MAX_PPT_MB} MB.`, "file");
  return { name: fileName, ext, data: file.data };
}

function assertUnique(rows, team) {
  const usns = new Set();
  const phones = new Set();
  rows.forEach(r => {
    if (r[COL["Status"]] === "Withdrawn") return; // organisers can free a team's USNs by marking it Withdrawn
    usns.add(usnOf(r[COL["Leader USN"]]));
    MEMBER_USN_COLS.forEach(c => r[c] && usns.add(usnOf(r[c])));
    phones.add(phoneOf(r[COL["Leader Contact"]]));
  });

  if (usns.has(team.leaderUsn)) throw userError(`USN ${team.leaderUsn} is already registered with another team.`, "leaderUsn");
  team.members.forEach((m, i) => {
    if (usns.has(m.usn)) throw userError(`USN ${m.usn} is already registered with another team.`, `members.${i}.usn`);
  });
  if (phones.has(team.leaderContact)) throw userError("This contact number is already registered with another team.", "leaderContact");
}

// ---- storage ------------------------------------------------------------------------------
function getSheet() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) sheet = book.insertSheet(CONFIG.SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    // plain text for everything people typed, so USNs and phone numbers keep their digits
    sheet.getRange(2, COL["Team ID"] + 1, sheet.getMaxRows() - 1, COL["Status"]).setNumberFormat("@");
  }
  return sheet;
}

function readRows(sheet) {
  const count = sheet.getLastRow() - 1;
  return count < 1 ? [] : sheet.getRange(2, 1, count, HEADERS.length).getDisplayValues();
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor: creates the sheet, the ID secret, and grants Drive/Sheets permissions. */
function setup() {
  getSheet();
  idSecret();
  DriveApp.getFolderById(CONFIG.PPT_FOLDER_ID).getName();
}
