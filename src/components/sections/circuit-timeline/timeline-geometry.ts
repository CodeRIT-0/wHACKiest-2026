import { timelineStations } from "./timeline-layout";

/** Keep the actual component and every wire terminal inside the measured drawing. */
export function circuitHardwareGeometry(index: number, height: number) {
  const station = timelineStations[index];
  const below = station.placement === "above";
  const axis = height / 2;
  const preferred =
    station.asset === "resistor"
      ? { width: 132, height: 23 }
      : station.asset === "chip"
        ? { width: index === 2 ? 220 : 150, height: index === 2 ? 220 : 150 }
        : station.asset === "capacitor"
          ? { width: 39, height: 124 }
          : { width: 62, height: 131 };
  const available = Math.max(32, (height / 2 - 26) * 0.58);
  const size = Math.min(1, available / preferred.height);
  const image = {
    width: preferred.width * size,
    height: preferred.height * size,
  };
  const cy = axis + (below ? 1 : -1) * (image.height / 2 + 22);
  const terminalRoom = below ? height - cy - 16 : cy - 16;
  const fanReach = Math.max(
    20,
    Math.min(index === 2 ? 190 : 125, terminalRoom - 18),
  );
  return { axis, below, direction: below ? 1 : -1, cy, image, fanReach };
}
