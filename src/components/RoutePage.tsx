import Image from "next/image";
import { RetroLink } from "./ui/retro-button";
import { mechanicalEngine } from "@/lib/illustrations";

export default function RoutePage({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="route-section section-shell">
      <div className="route-layout">
        <div className="route-copy">
          <p className="section-eyebrow">WHACKIEST 2026 / THE NEXT CHAPTER</p>
          <h1>{title}</h1>
          <p className="route-description">{text}</p>
          <RetroLink href="/" variant="paper">
            Back to the beginning
          </RetroLink>
          <div className="route-instrument">
            <Image
              src={mechanicalEngine}
              alt="A brass mechanical computing instrument"
              sizes="300px"
            />
          </div>
        </div>
        <div className="browser-window">
          <div className="browser-title">
            <span>
              <i />
              <i />
              <i />
            </span>
            <span>WHACKIEST / {title.toUpperCase()}</span>
            <span>↗</span>
          </div>
          <div className="route-window">
            {children ?? (
              <>
                <span className="mono-label">TRANSMISSION STANDBY</span>
                <h2>
                  THE NEXT UPDATE
                  <br />
                  IS ON ITS WAY.
                </h2>
                <p>Check back for the latest information from CodeRIT.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
