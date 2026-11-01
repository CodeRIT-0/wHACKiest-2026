// Only the pool is public for now. The split between places and the special awards are still to be
// announced, so they are deliberately not in this file: anything here ships in the page's code,
// where anyone could read it, however it looks on screen.
export const TOTAL = 50000;

export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
