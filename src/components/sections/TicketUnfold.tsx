import Link from "next/link";
import { participation } from "@/content/participation";

export default function TicketUnfold({ visible, onRegister }: { visible: boolean; onRegister: () => void }) {
  return <div className="procedure-cta-slot" data-visible={visible} inert={!visible} aria-hidden={!visible}>
    <span className="ticket-stub-label" aria-hidden="true">wH / ADMIT YOUR NEXT IDEA · 2026</span>
    <Link href={participation.registrationHref} className="procedure-cta" onClick={event => { event.preventDefault(); onRegister(); }} aria-haspopup="dialog" tabIndex={visible ? undefined : -1}>REGISTER YOUR TEAM <span aria-hidden="true">↗</span></Link>
    <p className="procedure-note">{participation.paymentNote}</p>
  </div>;
}
