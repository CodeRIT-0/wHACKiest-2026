"""Cut the travelling-clock image sequences out of the two source videos.

    python scripts/extract-clock-frames.py <dont_shatter.mp4> <back_of_the_clock.mp4> [--preview DIR]

Writes transparent webps to public/assets/clock-seq/{turn,shatter}/NNN.webp and a manifest
(src/lib/clock-frames.json) that ScrollClock reads. Needs opencv-python + numpy.

The videos are white sketch paper with the clock painted on top, so the matte is built from
three parts: the clock body (dark, solid, holes filled so the white dial stays opaque), the
orange/blue rings (picked out by saturation) and smoke (soft alpha from darkness). Thin
sketch lines are removed with a morphological opening before any of that counts.
"""
import json, os, sys
import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "assets", "clock-seq")
X0, X1 = 203, 1077  # picture area inside the pillarbox
WIDTH = 720  # output width; height follows the 874x720 picture
STEP = 2  # keep every 2nd frame (12 per second of source)
SEQUENCES = {
    # name: (video arg index, first frame, last frame, last frame with the white dial facing us)
    "turn": (0, 0, 100, 100),  # 3/4 front -> edge -> face-on
    "shatter": (1, 0, 138, 76),  # glass cracks, turns to the gears, bursts; stops before the camera zoom
}
MAX_GAP = 4000  # once the dial has turned away, only gaps this small (px) get filled

K = lambda r: cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (r, r))


def matte(bgr, dial=True):
    img = bgr.astype(np.float32) / 255
    h, w = img.shape[:2]
    paper = np.percentile(img.reshape(-1, 3), 92, axis=0)  # the sheet's white
    dark = np.clip(((paper - img) / paper).max(axis=2), 0, 1)
    mx, mn = img.max(axis=2), img.min(axis=2)
    sat = (mx - mn) / np.maximum(mx, 1e-3)

    # clock body: solid where it's clearly darker than paper, sketch lines opened away,
    # bezel gaps closed, then enclosed holes (the white dial) filled
    # rings are excluded here: they form closed loops, and filling those would paint their
    # interiors solid
    b, g, r = img[..., 0], img[..., 1], img[..., 2]
    warm = (r - b > 0.05) & (sat < 0.3)  # beige brush swoosh behind the clock (and brass gears)
    body = ((dark > 0.22) & (sat < 0.25) & ~warm | (dark > 0.45) & warm).astype(np.uint8) * 255  # swoosh tops out ~0.35, brass sits ~0.65
    body = cv2.morphologyEx(body, cv2.MORPH_OPEN, K(5))
    body = cv2.morphologyEx(body, cv2.MORPH_CLOSE, K(9))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(body)
    keep = np.zeros_like(body)
    for i in range(1, n):
        if stats[i, cv2.CC_STAT_AREA] > 1500:  # stray sketch marks don't become solid islands
            keep[lab == i] = 255
    # holes are found with the rings included (they cross the bezel and would otherwise leak the
    # dial out), then clipped to the clock's own outline so ring interiors stay clear
    ringish = ((sat > 0.28) & (dark > 0.12)).astype(np.uint8) * 255
    walls = cv2.morphologyEx(keep | ringish, cv2.MORPH_CLOSE, K(15))
    flood = walls.copy()
    cv2.floodFill(flood, np.zeros((h + 2, w + 2), np.uint8), (0, 0), 255)
    inside = cv2.bitwise_not(flood) | walls  # everything the outside paper cannot reach
    hull = np.zeros_like(body)
    pts = cv2.findNonZero(keep)
    if pts is not None:
        cv2.fillConvexPoly(hull, cv2.convexHull(pts), 255)
    fill = inside & hull & ~keep
    if not dial:
        # smoke encloses patches of paper that are not part of the clock; keep only small gaps
        n, lab, stats, _ = cv2.connectedComponentsWithStats(fill)
        small = np.isin(lab, [i for i in range(1, n) if stats[i, cv2.CC_STAT_AREA] < MAX_GAP])
        fill = np.where(small, fill, 0).astype(np.uint8)
    body = keep | fill
    body = cv2.GaussianBlur(cv2.erode(body, K(3)), (5, 5), 0).astype(np.float32) / 255

    # rings: strongly coloured strokes
    rings = np.clip((sat - 0.28) / 0.22, 0, 1) * np.clip((dark - 0.12) / 0.15, 0, 1)
    rings = cv2.GaussianBlur(cv2.morphologyEx(rings, cv2.MORPH_CLOSE, K(3)), (3, 3), 0)

    # smoke / shards: soft alpha from darkness, opened so 1-3px pencil lines vanish
    # the swoosh is warm and sits outside the clock; the brass gears are warm too but inside it
    soft = np.clip((dark - 0.1) / 0.32, 0, 1) * ~(warm & (hull == 0))
    soft = cv2.morphologyEx(soft, cv2.MORPH_OPEN, K(7))
    soft = cv2.GaussianBlur(soft, (3, 3), 0)

    a = np.maximum.reduce([body, rings, soft])
    # feather the picture edges so anything cut by the frame fades instead of ending on a line
    ramp = 36
    yy = np.minimum(np.arange(h), np.arange(h)[::-1])[:, None]
    xx = np.minimum(np.arange(w), np.arange(w)[::-1])[None, :]
    a *= np.clip(np.minimum(yy, xx) / ramp, 0, 1)

    # un-mix the paper out of semi-transparent pixels: c = a*F + (1-a)*paper
    fg = (img - (1 - a[..., None]) * paper) / np.maximum(a[..., None], 1e-3)
    fg = np.where(a[..., None] > 0.98, img, np.clip(fg, 0, 1))
    return np.dstack([fg, a])


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    preview = sys.argv[sys.argv.index("--preview") + 1] if "--preview" in sys.argv else None
    if preview in args:
        args.remove(preview)
    manifest = {}
    for name, (vi, start, end, dial_until) in SEQUENCES.items():
        cap = cv2.VideoCapture(args[vi])
        out_dir = os.path.join(OUT, name)
        os.makedirs(out_dir, exist_ok=True)
        for f in os.listdir(out_dir):
            os.remove(os.path.join(out_dir, f))
        count = 0
        for k in range(start, end + 1, STEP):
            cap.set(cv2.CAP_PROP_POS_FRAMES, k)
            ok, frame = cap.read()
            if not ok:
                break
            rgba = matte(frame[:, X0:X1], dial=k <= dial_until)
            h = round(rgba.shape[0] * WIDTH / rgba.shape[1])
            rgba = cv2.resize(rgba, (WIDTH, h), interpolation=cv2.INTER_AREA)
            px = (rgba * 255 + 0.5).astype(np.uint8)
            cv2.imwrite(os.path.join(out_dir, f"{count:03d}.webp"), px, [cv2.IMWRITE_WEBP_QUALITY, 82])
            if preview and k % 24 == 0:
                for tag, bg in (("light", (236, 247, 251)), ("dark", (28, 17, 11))):
                    al = rgba[..., 3:4]
                    comp = rgba[..., :3] * al + np.array(bg, np.float32) / 255 * (1 - al)
                    cv2.imwrite(os.path.join(preview, f"{name}-{k:03d}-{tag}.jpg"), (comp * 255).astype(np.uint8))
            count += 1
        manifest[name] = {"count": count, "width": WIDTH, "height": h}
        print(name, count, "frames")
    with open(os.path.join(ROOT, "src", "lib", "clock-frames.json"), "w") as fh:
        json.dump(manifest, fh, indent=2)
        fh.write("\n")


if __name__ == "__main__":
    main()
