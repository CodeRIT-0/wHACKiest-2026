"use client";

import { useEffect, useState } from "react";
import styles from "./Timeline.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

// Small live countdown on a timeline card: days, hours, minutes and seconds until the checkpoint.
// Shows dashes until mounted (so server and browser render the same), "Passed" once it's gone by.
export default function CheckpointCountdown({ dateTime }: { dateTime: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const left = now === null ? null : Math.floor((new Date(dateTime).getTime() - now) / 1000);

  if (left !== null && left <= 0) {
    return (
      <span className={styles.countdown} data-passed>
        Passed
      </span>
    );
  }

  const parts =
    left === null
      ? ["--", "--", "--", "--"]
      : [pad(Math.floor(left / 86400)), pad(Math.floor((left % 86400) / 3600)), pad(Math.floor((left % 3600) / 60)), pad(left % 60)];

  return (
    <span
      className={styles.countdown}
      role="timer"
      aria-label={left === null ? "Countdown" : `${parts[0]} days ${parts[1]} hours ${parts[2]} minutes to go`}
    >
      <span aria-hidden className={styles.countdownLead}>
        T−
      </span>
      {parts.map((v, i) => (
        <span key={i} aria-hidden>
          {v}
          <small>{"DHMS"[i]}</small>
        </span>
      ))}
    </span>
  );
}
