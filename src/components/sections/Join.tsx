import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Reveal from "../motion/Reveal";
import Words from "../motion/Words";
import FindUs from "./join/FindUs";
import JoinMachine from "./join/JoinMachine";

// 2026, on black: the circuit ends at a brass calculating engine glowing brown, where it all started.
// Socials and the venue close out the page (registration steps have their own section).
export default function Join() {
  return (
    <section id="join" className="relative overflow-x-clip">
      <div className="relative z-10 mx-auto max-w-[1100px] px-6 pb-16 pt-28 text-center">
        <div data-trace>
          <JoinMachine />
        </div>
        <Reveal>
          <p className="mt-16 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            <span className="text-accent">09</span> / Register
          </p>
          <h2 data-words className="display-wide mx-auto mt-4 max-w-[14ch] text-[40px] uppercase leading-[0.95] sm:text-6xl md:text-7xl">
            <Words text="The next era starts with you" tail={<span className="text-accent">.</span>} />
          </h2>
          <p className="mx-auto mt-6 max-w-[42ch] text-muted">24 hours. Teams of two to four. One question: what will you build when every second counts?</p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 bg-accent px-7 py-4 text-sm font-semibold uppercase text-[#1a1a1a] transition-transform active:scale-[0.98]"
          >
            Register your team
            <ArrowRight size={14} weight="bold" />
          </Link>
        </Reveal>
      </div>

      <div className="relative z-10 mx-auto max-w-[1100px] px-6 pb-24 pt-8">
        <Reveal>
          <FindUs />
        </Reveal>
      </div>
    </section>
  );
}
