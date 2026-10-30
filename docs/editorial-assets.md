# Editorial images

Both new illustrations were created with the built-in image generation tool, copied into this repository, trimmed to their alpha bounds and compressed as WebP. Transparent backgrounds are preserved. The supplied video was inspected as a reference; no video frame is shipped as an image asset. No external photography or stock team portraits are used.

`src/lib/illustrations.ts` now statically imports both files, so a missing asset fails the build and each asset receives a fingerprinted URL. `next.config.ts` serves the already compressed local images without another image-optimization request. The hero uses Next's `preload` property. Browser verification deliberately blocks `/_next/image` and checks that both illustrations still decode at desktop, 150% display density, and mobile sizes.

## Mechanical engine

- Final file: `public/images/editorial/mechanical-engine.webp` (1400 × 903).
- Usage: homepage hero and supporting route illustration.
- Prompt:

> Create a production website illustration asset, transparent background with genuine alpha. A beautifully detailed antique mechanical computing time machine: polished aged brass gears, ivory clock dials, six mechanical odometer wheels, dark walnut instrument case, small knurled knobs, thin copper wiring. Late 19th century Babbage difference-engine meets 1940s scientific instrument. Isometric three-quarter overhead product photograph, object fully in frame, landscape composition with object occupying 90 percent, warm diffused museum lighting, realistic subtle contact shadows, muted ivory bronze black and tiny orange accents, editorial retro-futuristic hackathon website. Highly tactile miniature engineering details and handcrafted surfaces. No lettering, no logos, no people, no surrounding scene or background, no decorative frame. Object angled gently clockwise. Needs to look like a real precision scientific relic, NOT cartoon, NOT glossy game asset, NOT modern neon sci-fi. Save as a high resolution transparent cutout.

## Retro desktop

- Final file: `public/images/editorial/retro-desktop.webp` (1189 × 1191).
- Usage: prize display, with accessible live HTML prize pool text placed over the empty CRT screen.
- Prompt:

> A production website illustration: straight-on front view of a complete early 1980s beige personal desktop computer with a chunky CRT monitor sitting on a horizontal desktop system unit and matching full keyboard in front, beautifully aged warm ivory plastic, finely detailed keys and vents, thin black screen bezel, gently curved dark glass screen with a subtle teal-green glow. Photo-real editorial product illustration with lightly engraved technical details, authentic retro computing museum artifact. Entire computer, case and keyboard completely in frame with comfortable padding. Screen empty solid very dark green, reserved to overlay HTML text; no lettering, no brand names, no logos. Isolated on genuine transparent background, high resolution, soft warm light, small realistic shadow. Almost perfectly frontal, very slight top-down viewing angle so keyboard is visible. Muted cream grey black with tiny orange LED. No hands, no people, no desks, no scenery, no extraneous objects. NOT pixel art or cartoon. Portrait-to-square composition.

The valve display, punch cards, gears, role icons, and clearly marked mock team portraits are native CSS/SVG elements. The four existing photographic circuit assets and their prompts are documented in [circuit-assets.md](circuit-assets.md).
