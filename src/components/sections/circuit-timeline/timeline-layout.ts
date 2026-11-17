/** Six stations in a continuous, panoramic circuit landscape, 620 units apart. */
export const CIRCUIT_WIDTH = 3920;
export const CIRCUIT_HEIGHT = 780;
export const CIRCUIT_AXIS = 390;
export const TIMELINE_PIN_TOP = 0; // our nav floats and hides on scroll, so the scene pins to the very top
export const JOURNEY_INPUT = [0, 0.2, 0.4, 0.6, 0.8, 0.98, 1];
export const JOURNEY_OUTPUT = [0, 1, 2, 3, 4, 5, 5];

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
    progress: 0.2,
    stop: 0.202,
    placement: "below",
    asset: "resistor",
    component: "R2 / CREW LOCK",
  },
  {
    x: 1640,
    progress: 0.4,
    stop: 0.402,
    placement: "above",
    asset: "chip",
    component: "U3 / MISSION CONTROL",
  },
  {
    x: 2260,
    progress: 0.6,
    stop: 0.602,
    placement: "below",
    asset: "transistor",
    component: "Q4 / SELECTION GATE",
  },
  {
    x: 2880,
    progress: 0.8,
    stop: 0.802,
    placement: "above",
    asset: "capacitor",
    component: "C5 / 24 HOURS OFFLINE",
  },
  {
    x: 3500,
    progress: 0.98,
    stop: 0.99,
    placement: "below",
    asset: "chip",
    component: "U6 / FINAL OUTPUT",
  },
] as const;

export const LAST_STATION = timelineStations.length - 1;
