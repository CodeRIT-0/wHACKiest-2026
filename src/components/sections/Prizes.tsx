import PrizeMachine from "./prizes/PrizeMachine";

// The prize pool sits encrypted on a retro desktop and scrolling is what decrypts it, one place
// at a time. Everything lives in prizes/PrizeMachine.
export default function Prizes() {
  return <PrizeMachine />;
}
