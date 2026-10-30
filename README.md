# wHACKiest 2026

## Editorial website

The full homepage follows the supplied mechanical-to-digital video theme, from the illustrated brass engine and valve display to the pinned circuit, channel selector, CRT prize pool, browser registration steps, FAQ accordion, and mock team sheet. The prize amounts are ₹25,000, ₹15,000, and ₹10,000. Replace the mock people and fictional partner marks in `src/lib/event-content.ts` before launch. Dates are still planning placeholders. The registration page is an interactive demonstration and does not send or store applications.

See [component sources and license notices](docs/component-sources.md) for the adapted Neobrutalism, 21st/Motion Primitives, and Prompt Kit components. See [generated editorial assets and prompts](docs/editorial-assets.md) for the two new optimized local images. Site-wide presentation lives in `src/app/editorial.css`.

Great UI scroll reveals, opposed curtain panels, and card divider interactions are adapted in the same visual system. `SmoothScrolling.tsx` adds gentle Lenis wheel easing while keeping native touch and reduced-motion scrolling. Display headings, card titles, body text, and technical labels share explicit typography roles. Local images are statically imported and delivered as fingerprinted WebP files without the image-optimization endpoint.

The hero uses `src/components/hero/HeroExperience.tsx` for spring-smoothed pointer perspective on the existing machine photograph, an independent floating layer, rotating engraved gears and dial markers, travelling signal strokes, and a cursor calibration reticle. The pause control freezes decorative animation. Motion also pauses outside the visible area below the fixed navigation and when the browser tab is hidden. Reduced motion and the no-JavaScript fallback render static artwork. Pointer movement uses MotionValues rather than React state.

The original palette combines ivory editorial sections with a dark circuit, tracks, and footer. Cream windows and paper cards complement the black, blue, and orange accents. The hero animation uses the existing ivory background.

## Interactive timeline

The homepage includes `src/components/sections/Timeline.tsx`, a reusable circuit journey with five stations. Bundles of angled conductors connect the vintage components into one continuous circuit, with a dominant processor at mission control. The landscape travels horizontally on desktop and mobile. Checkpoint windows always alternate above and below the signal line, including short desktop and mobile viewports. Orange identifies the active stage and blue identifies completed wiring.

- Replace event copy and dates in `src/components/sections/timeline-data.ts`. These are explicitly marked planning placeholders; they are not the official schedule. Displayed times are IST.
- Render `<Timeline />` for the default schedule, or pass a typed `TimelineCheckpoints` tuple through `checkpoints`. All five terminals must have an event.
- Use `datesAreTentative={false}` only after replacing the placeholder schedule with confirmed information. An optional `id` sets the section's navigation anchor.
- `timeline-layout.ts` contains the 3300 × 780 landscape, pin offset, and station coordinates. The travel mapping is nearly linear, with a short completion interval at the end. These are positions within the user's scroll, not timers or autoplay.
- `useCircuitProgress.ts` uses section-linked Motion scroll progress with subtle spring smoothing. A 650svh section and closer station spacing reduce horizontal movement per scroll. The shared source controls the whole camera, current, interconnecting bundles, branching traces, component lighting, and checkpoint activation. Reversing scroll reverses the scene. Lenis eases wheel input; touch remains native and no scroll delta is converted into artificial checkpoint steps.
- Upcoming card bodies stay transparent until the final approach. Their opacity rises continuously with journey progress and reaches one at the checkpoint. Reverse scrolling hides them again. The window frame and checkpoint label remain visible. Reduced motion and the no-JavaScript fallback keep all descriptions readable.
- The scene stays below the existing navigation while the sequence plays. Its camera follows the signal on every screen size, keeping each station in focus. Short or narrow viewports use denser card typography without changing placement. `timeline-geometry.ts` fits components and wire terminals to the actual available height; resizing recalibrates scale and framing.
- Previous/next arrows and five checkpoint indicators provide keyboard-accessible navigation. The final next arrow continues to the following section.
- Reduced motion bypasses the spring, removes the moving current marker, and changes branching traces in discrete states. The preference updates while the page is open. Without JavaScript, the scene becomes a native horizontal scroll area with all five event descriptions and placeholder dates.
- Styles live in `Timeline.module.css`. The local `[data-timeline-exit]` element marks the boundary available for the following section's integration.
- Transparent retro component photos live in `public/images/circuit/`. These optimized WebP assets replace the component drawings while SVG continues to drive the wiring, current, and lighting. See [asset notes and generation prompts](docs/circuit-assets.md).
- `ThemeTransition.tsx` provides two ivory/black chapter handoffs, before the timeline and after the tracks. Their halftone surfaces join the neighboring background colors exactly, while conductive lines reveal with scroll. They occupy their own space and never overlap section content. Shared section headings use scroll-linked reveals. Live reduced-motion preferences disable movement through `src/hooks/usePrefersReducedMotion.ts`.

Run `npm run dev` and open `http://localhost:3000/#timeline`. Verify gentle continuous travel, electrical current through the four connected wire bundles, all five stages, 100% completion, and reverse travel. Check previous/next navigation, stage indicators, responsive card visibility, reduced motion, and exiting into the next section. `npm run build` includes the TypeScript production check.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
