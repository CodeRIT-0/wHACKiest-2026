import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToPosition } from "../system/SmoothScroll";

// The About story has no place of its own on the page: it plays inside the pinned hero, so a plain
// #anchor can't reach it. Links scroll to the point in the hero's pin where it's fully on screen
export const HERO_TRIGGER_ID = "hero";
export const STORY_HASH = "#story";
const STORY_PROGRESS = 0.74; // the prints have landed and the clock has just burst

// false when the hero isn't pinned (reduced motion), so the caller can fall back
export function scrollToStory() {
  const st = ScrollTrigger.getById(HERO_TRIGGER_ID);
  if (!st) return false;
  scrollToPosition(st.start + (st.end - st.start) * STORY_PROGRESS);
  return true;
}
