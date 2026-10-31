// Where the reader is on the computing timeline, as a fractional index into ERAS
// (2.4 = 40% of the way from the third stop to the fourth). ColourJourney writes it on every
// scroll update; the era rail reads it without re-rendering React.

type Listener = (position: number) => void;

const listeners = new Set<Listener>();
let current = 0;

export function publishPosition(position: number) {
  current = position;
  listeners.forEach((fn) => fn(position));
}

export function subscribePosition(fn: Listener) {
  listeners.add(fn);
  fn(current);
  return () => {
    listeners.delete(fn);
  };
}

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));

export function mixHex(a: string, b: string, t: number) {
  const ca = hex(a);
  const cb = hex(b);
  return `#${ca.map((v, i) => Math.round(v + (cb[i] - v) * t).toString(16).padStart(2, "0")).join("")}`;
}

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const smoothstep = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};
