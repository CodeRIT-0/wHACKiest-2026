// Draws the team pass as a 1080×1350 PNG (Instagram / LinkedIn portrait post) for sharing.
// Public by design: team name, member names and size only — no USNs, contact details or team ID.

export type PassCard = { teamName: string; size: number; names: string[] };

const W = 1080;
const H = 1350;
const C = { paper: "#fff9ec", ink: "#050505", night: "#0c0b0a", cream: "#fff9ec", muted: "#aaa397", line: "#2b2823", accent: "#fd9c36", blue: "#4c8dff" };

/** the next/font family stacks the site already loaded, read from its CSS variables */
function fontStacks() {
  const css = getComputedStyle(document.body);
  const read = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  return {
    sans: read("--font-space-grotesk", "system-ui, sans-serif"),
    mono: read("--font-jetbrains-mono", "ui-monospace, monospace"),
    display: read("--font-archivo", "system-ui, sans-serif"),
  };
}

type Ctx = CanvasRenderingContext2D & { letterSpacing?: string; fontStretch?: string };

function spaced(ctx: Ctx, px: number) {
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${px}px`;
}

function wrap(ctx: Ctx, text: string, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth || !line) line = next;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function ellipsis(ctx: Ctx, text: string, maxWidth: number) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxWidth) t = t.slice(0, -1);
  return `${t}…`;
}

function barcode(ctx: Ctx, seed: string, x: number, y: number, width: number, height: number) {
  let h = 2166136261;
  for (const ch of seed || "wHACKiest") h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  let cx = x;
  for (let i = 0; cx < x + width; i++) {
    h = Math.imul(h ^ (h >>> 13), 1274126177) + i;
    const w = (1 + (Math.abs(h) % 3)) * 4;
    if (cx + w > x + width) break;
    ctx.globalAlpha = i % 7 === 0 ? 0.5 : 1;
    ctx.fillRect(cx, y, w, height);
    cx += w + 4;
  }
  ctx.globalAlpha = 1;
}

export async function renderPass(card: PassCard): Promise<Blob> {
  const f = fontStacks();
  // make sure the web fonts are ready before canvas measures with them
  await Promise.all(
    [`800 96px ${f.display}`, `700 40px ${f.sans}`, `500 22px ${f.mono}`].map(spec => document.fonts?.load(spec).catch(() => undefined)),
  );

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d") as Ctx;
  ctx.textBaseline = "alphabetic";

  // paper + graph grid
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(5,5,5,0.06)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 36) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(W, y + 0.5);
    ctx.stroke();
  }

  // masthead
  ctx.fillStyle = C.ink;
  ctx.font = `500 22px ${f.mono}`;
  spaced(ctx, 4);
  ctx.fillText("CODERIT PRESENTS", 90, 110);
  ctx.textAlign = "right";
  ctx.fillText("24H · NATIONAL HACKATHON", W - 90, 110);
  ctx.textAlign = "left";
  ctx.font = `800 84px ${f.display}`;
  if ("fontStretch" in ctx) ctx.fontStretch = "expanded";
  spaced(ctx, -3);
  ctx.fillText("WHACKIEST 2026", 86, 196);
  const mastheadWidth = ctx.measureText("WHACKIEST 2026").width;
  ctx.fillStyle = C.accent;
  ctx.fillText(".", 86 + mastheadWidth + 2, 196);

  // the ticket: orange offset shadow, ink border, night card
  const tx = 90, ty = 236, tw = 900, th = 1004;
  ctx.fillStyle = C.accent;
  ctx.fillRect(tx + 18, ty + 18, tw, th);
  ctx.fillStyle = C.ink;
  ctx.fillRect(tx - 4, ty - 4, tw + 8, th + 8);
  ctx.fillStyle = C.night;
  ctx.fillRect(tx, ty, tw, th);

  const px = tx + 50;
  const inner = tw - 100;

  // header bar
  ctx.font = `500 20px ${f.mono}`;
  if ("fontStretch" in ctx) ctx.fontStretch = "normal";
  spaced(ctx, 4);
  ctx.fillStyle = C.cream;
  ctx.fillText("TEAM PASS / WHACKIEST 2026", px, ty + 62);
  ctx.fillStyle = C.line;
  ctx.fillRect(tx, ty + 96, tw, 2);

  // team name: as large as fits in two lines
  ctx.fillStyle = C.muted;
  ctx.fillText("TEAM", px, ty + 150);
  let size = 88;
  let lines: string[] = [];
  const team = card.teamName.toUpperCase();
  for (; size >= 48; size -= 4) {
    ctx.font = `800 ${size}px ${f.display}`;
    if ("fontStretch" in ctx) ctx.fontStretch = "expanded";
    spaced(ctx, -size * 0.04);
    lines = wrap(ctx, team, inner);
    if (lines.length <= 2 && lines.every(l => ctx.measureText(l).width <= inner)) break;
  }
  ctx.fillStyle = C.cream;
  let y = ty + 150 + size * 1.05;
  for (const line of lines.slice(0, 2)) {
    ctx.fillText(ellipsis(ctx, line, inner), px - 4, y);
    y += size * 1.02;
  }
  if ("fontStretch" in ctx) ctx.fontStretch = "normal";

  // format + size
  y += 30;
  ctx.font = `500 20px ${f.mono}`;
  spaced(ctx, 4);
  ctx.fillStyle = C.muted;
  ctx.fillText("FORMAT", px, y);
  ctx.textAlign = "right";
  ctx.fillText("SIZE", tx + tw - 50, y);
  ctx.textAlign = "left";
  y += 44;
  ctx.font = `700 34px ${f.sans}`;
  spaced(ctx, 0);
  ctx.fillStyle = C.cream;
  ctx.fillText("24 hours, offline", px, y);
  ctx.textAlign = "right";
  ctx.font = `500 34px ${f.mono}`;
  ctx.fillText(String(card.size).padStart(2, "0"), tx + tw - 50, y);
  ctx.textAlign = "left";

  // crew
  y += 56;
  ctx.font = `500 20px ${f.mono}`;
  spaced(ctx, 4);
  ctx.fillStyle = C.muted;
  ctx.fillText("CREW", px, y);
  y += 18;
  card.names.forEach((name, i) => {
    ctx.fillStyle = C.line;
    ctx.fillRect(px, y, inner, 2);
    ctx.font = `500 20px ${f.mono}`;
    spaced(ctx, 2);
    ctx.fillStyle = C.blue;
    ctx.fillText(String(i + 1).padStart(2, "0"), px, y + 40);
    ctx.font = `500 30px ${f.sans}`;
    spaced(ctx, 0);
    ctx.fillStyle = C.cream;
    ctx.fillText(ellipsis(ctx, name, inner - 70), px + 64, y + 41);
    y += 58;
  });
  ctx.fillStyle = C.line;
  ctx.fillRect(px, y, inner, 2);

  // perforation with notches cut out of both edges
  const perf = ty + th - 150;
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 3;
  ctx.setLineDash([14, 10]);
  ctx.beginPath();
  ctx.moveTo(tx + 30, perf);
  ctx.lineTo(tx + tw - 30, perf);
  ctx.stroke();
  ctx.setLineDash([]);
  for (const nx of [tx, tx + tw]) {
    ctx.beginPath();
    ctx.arc(nx, perf, 24, 0, Math.PI * 2);
    ctx.fillStyle = C.paper;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = C.ink;
    ctx.stroke();
  }

  // stub
  ctx.font = `500 20px ${f.mono}`;
  spaced(ctx, 4);
  ctx.fillStyle = C.muted;
  ctx.fillText("SEE YOU AT", px, perf + 58);
  ctx.font = `700 34px ${f.sans}`;
  spaced(ctx, 0);
  ctx.fillStyle = C.cream;
  ctx.fillText("RIT, Bengaluru", px, perf + 104);
  ctx.fillStyle = C.cream;
  barcode(ctx, card.teamName, tx + tw - 50 - 280, perf + 40, 280, 72);

  // stamp, slapped across the header bar
  ctx.save();
  ctx.translate(tx + tw - 200, ty + 70);
  ctx.rotate((-12 * Math.PI) / 180);
  ctx.font = `700 34px ${f.mono}`;
  spaced(ctx, 7);
  const label = "REGISTERED";
  const lw = ctx.measureText(label).width;
  ctx.strokeStyle = C.accent;
  ctx.lineWidth = 6;
  ctx.strokeRect(-lw / 2 - 22, -38, lw + 40, 64);
  ctx.fillStyle = C.accent;
  ctx.textAlign = "center";
  ctx.fillText(label, 0, 10);
  ctx.restore();

  // footer
  ctx.textAlign = "left";
  ctx.fillStyle = C.ink;
  ctx.font = `700 30px ${f.sans}`;
  spaced(ctx, 0);
  ctx.fillText("We're in. See you at the hack.", 90, H - 48);
  ctx.font = `500 20px ${f.mono}`;
  spaced(ctx, 3);
  ctx.textAlign = "right";
  ctx.fillText(window.location.host.toUpperCase(), W - 90, H - 50);

  return new Promise((resolve, reject) => canvas.toBlob(b => (b ? resolve(b) : reject(new Error("Could not draw the pass"))), "image/png"));
}
