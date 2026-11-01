"use client";

import { useSyncExternalStore } from "react";

// One shared second-by-second clock for every live readout on the page. It ticks on the second
// boundary, so separate readouts (the countdown board, the seconds dial) always change together.
// Returns unix seconds, or `null` on the server and during hydration, so server and browser
// render the same markup and the live values arrive on the very next frame.

const listeners = new Set<() => void>();
let timer: ReturnType<typeof setTimeout> | undefined;
let current = 0;
// While nothing that shows the time is on screen (the hero has scrolled away), the ticks carry on
// but tell nobody, so the board and dial aren't re-rendered every second for no one to see.
// Coming back on screen catches them up at once.
let paused = false;

export function setNowPaused(next: boolean) {
  if (paused === next) return;
  paused = next;
  if (!paused) {
    current = read();
    listeners.forEach((notify) => notify());
  }
}

const read = () => Math.floor(Date.now() / 1000);

function schedule() {
  timer = setTimeout(
    () => {
      if (!paused) {
        current = read();
        listeners.forEach((notify) => notify());
      }
      schedule();
    },
    1000 - (Date.now() % 1000) + 5,
  );
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  if (listeners.size === 1) {
    current = read();
    schedule();
  }
  return () => {
    listeners.delete(notify);
    if (!listeners.size) {
      clearTimeout(timer);
      timer = undefined;
    }
  };
}

// cached between ticks: React may read the snapshot several times in one render
const getSnapshot = () => current || (current = read());
const getServerSnapshot = () => null;

export function useNow(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
