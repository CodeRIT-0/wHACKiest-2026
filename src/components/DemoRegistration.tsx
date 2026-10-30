"use client";

import { useState, type FormEvent } from "react";
import { RetroButton } from "./ui/retro-button";

export default function DemoRegistration() {
  const [entry, setEntry] = useState<{ team: string; track: string } | null>(
    null,
  );
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setEntry({
      team: String(data.get("team")).trim(),
      track: String(data.get("track")),
    });
  }
  return (
    <>
      <div className="preview-banner">
        DEMO REGISTRATION / Nothing is sent. This is an interactive design
        preview.
      </div>
      {entry ? (
        <div className="demo-success" role="status">
          <span>ENTRY PREVIEW READY.</span>
          <h2>{entry.team}</h2>
          <p>{entry.track} / wHACKiest 2026</p>
          <p>
            This is a demo confirmation. Your team has not been registered for
            the event.
          </p>
          <RetroButton
            type="button"
            variant="paper"
            onClick={() => setEntry(null)}
          >
            Start another preview ↗
          </RetroButton>
        </div>
      ) : (
        <form className="demo-form" onSubmit={submit}>
          <label>
            Your name
            <input
              name="name"
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
              placeholder="Ada Lovelace"
            />
          </label>
          <label>
            Email address
            <input
              name="email"
              type="email"
              required
              maxLength={160}
              autoComplete="email"
              placeholder="ada@example.com"
            />
          </label>
          <label>
            Team name
            <input
              name="team"
              required
              minLength={2}
              maxLength={80}
              placeholder="The Difference Makers"
            />
          </label>
          <label>
            What are you curious about?
            <select name="track" defaultValue="" required>
              <option value="" disabled>
                Choose a direction
              </option>
              <option>AI & Beyond</option>
              <option>Web & Product</option>
              <option>Social Impact</option>
              <option>Open Innovation</option>
            </select>
          </label>
          <RetroButton type="submit">
            Preview your entry <span aria-hidden="true">↗</span>
          </RetroButton>
          <p>
            Official registration requirements will replace this mock flow
            before launch.
          </p>
        </form>
      )}
    </>
  );
}
