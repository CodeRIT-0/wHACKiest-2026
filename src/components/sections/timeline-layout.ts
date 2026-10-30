/** Five stations in a continuous, panoramic circuit landscape. */
export const CIRCUIT_WIDTH = 3300;
export const CIRCUIT_HEIGHT = 780;
export const CIRCUIT_AXIS = 390;
export const TIMELINE_PIN_TOP = 112;
export const JOURNEY_INPUT = [0, 0.25, 0.5, 0.75, 0.98, 1];
export const JOURNEY_OUTPUT = [0, 1, 2, 3, 4, 4];

export const timelineStations = [
  {
    x: 400,
    progress: 0,
    stop: 0,
    placement: "above",
    asset: "transistor",
    component: "Q1 / SIGNAL IN",
  },
  {
    x: 1020,
    progress: 0.25,
    stop: 0.252,
    placement: "below",
    asset: "resistor",
    component: "R2 / CREW LOCK",
  },
  {
    x: 1640,
    progress: 0.5,
    stop: 0.502,
    placement: "above",
    asset: "chip",
    component: "U3 / MISSION CONTROL",
  },
  {
    x: 2260,
    progress: 0.75,
    stop: 0.752,
    placement: "below",
    asset: "capacitor",
    component: "C4 / 24H OFFLINE",
  },
  {
    x: 2880,
    progress: 0.98,
    stop: 0.99,
    placement: "above",
    asset: "chip",
    component: "U5 / FINAL OUTPUT",
  },
] as const;
