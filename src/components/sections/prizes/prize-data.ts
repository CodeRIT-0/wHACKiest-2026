import { Medal, Star, Trophy, type Icon } from "@phosphor-icons/react";

// The prize pool, held encrypted on the machine in PrizeMachine until scrolling decrypts it.
export type Prize = {
  id: string;
  /** the filename, kept back until this place has been decrypted */
  file: string;
  place: string;
  /** short form for the CRT, where every column counts */
  short: string;
  name: string;
  amount: number;
  blurb: string;
  icon: Icon;
  /** phosphor colour this prize is drawn in, on screen and on its label */
  hue: string;
};

// TODO: confirm the split with the organising team (must add up to the ₹50,000 pool)
export const PRIZES: Prize[] = [
  {
    id: "first",
    file: "WINNER.DAT",
    place: "1st place",
    short: "1st",
    name: "Winner",
    amount: 25000,
    blurb: "Top build of the weekend.",
    icon: Trophy,
    hue: "#ffb35c",
  },
  {
    id: "second",
    file: "RUNNER.DAT",
    place: "2nd place",
    short: "2nd",
    name: "Runner-up",
    amount: 15000,
    blurb: "Second on the board.",
    icon: Medal,
    hue: "#7aa7ff",
  },
  {
    id: "third",
    file: "THIRD.DAT",
    place: "3rd place",
    short: "3rd",
    name: "2nd runner-up",
    amount: 10000,
    blurb: "Third on the board.",
    icon: Star,
    hue: "#5df2a8",
  },
];

export const TOTAL = PRIZES.reduce((sum, p) => sum + p.amount, 0);

export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
/** the amount with every digit masked, for a place that has not been decrypted yet */
export const masked = (n: number) => inr(n).replace(/\d/g, "?");

