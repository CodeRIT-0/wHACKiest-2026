# Retro circuit image assets

Created with the built-in `image_gen` tool for the Whackiest timeline. Original generated images remain in the image generation library; optimized transparent WebP cutouts are stored in `public/images/circuit/`.

The wires, current, component glow, labels, and checkpoint highlights remain SVG/CSS driven by the shared scroll progress value. The artwork itself contains no animation or baked-in orange lighting.

## Shared generation prompt

Use case: product-mockup. Asset type: transparent raster cutout for a retro-computing website circuit diagram. Photorealistic archival electronics catalog photography with subtly aged warm materials, precise mechanical detail, soft warm top-left studio light, very restrained contact shadow, sharp edges. One isolated component, centered, large in a square canvas with approximately 8% transparent margin. Genuine transparent alpha background, no solid background, no checkerboard baked in, no board, no extra parts, no decorative wires, no logos, no readable text, no captions. Orthographic near top-down view with a very slight front-facing perspective so the physical thickness is visible, aligned squarely to the frame, no dramatic rotation. Materials must read clearly at 100px display size. Do not add orange glow or lighting effects; those will be applied by code.

## Component prompts and final files

### chip

File: `public/images/circuit/retro-chip.webp`

Subject: one vintage 1970s square black-brown ceramic microprocessor, with many aged gold and tinned metal pins radiating symmetrically from all four sides. Large dark flat square central inset, completely blank, approximately half the chip body width, suitable for a small software-controlled text overlay. Warm charcoal ceramic, oxidized brass, fine scratches and subtle tactile manufacturing detail. All pins fully visible. The chip occupies about 82% of the image width.

### resistor

File: `public/images/circuit/retro-resistor.webp`

Subject: one vintage beige ceramic axial resistor, long axis precisely horizontal. Two thin straight silver wire leads extend from left and right ends. Rounded capsule body with red, red, brown, and gold color bands, slightly aged natural ceramic texture and convincing brushed metal leads. Body occupies the central 55% of the total component width. The component including leads occupies 85% of canvas width, centered vertically.

### capacitor

File: `public/images/circuit/retro-capacitor.webp`

Subject: one vintage black-brown cylindrical electrolytic capacitor upright vertically, with a visible brushed aluminum top cap and subtle cross-scored vent. Two thin parallel tinned silver leads extend downward. Slight warm patina, tactile matte casing, worn but unbranded, slender ivory polarity stripe without readable text. Cylinder body occupies approximately the top 65% of the entire component height. Whole component including leads is fully visible and occupies 84% of canvas height.

### transistor

File: `public/images/circuit/retro-transistor.webp`

Subject: one vintage 1960s metal-can transistor, a small cylindrical brushed steel TO-5 can with an aged warm brass flange and subtly domed cap. Three slender straight silver wire legs extend downward from the flange, visibly separated. Beautiful tarnished silver, faint gold patina, real tactile manufacturing detail. The can and flange occupy the upper 50% of total component height, and the leads the lower 50%. The complete component occupies 82% of canvas height.
