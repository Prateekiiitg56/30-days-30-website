"""
Build the hero runway clips (VP9 with alpha) from the green-screen shots.

Sources: public/images/main-model-video/shot1-greenscreen.mp4, shot-2greenscreen.mp4 and
shot3-greenscreen.mp4 (3840x2160, 30 fps). For every frame, at 1920x1080, this script:
  1. estimates a clean plate (the green screen with the model removed) by interpolating the
     screen around her, so the key follows the uneven lighting of the cyclorama,
  2. pulls a soft key from how far each pixel's chroma points along the local screen chroma,
     with a solid core, a 2 px choke against the generator's outline glow, and a garbage matte
     that drops the generator's corner sparkle and the light stand in shot 3,
  3. un-mixes the edge pixels (removes the plate from them), removes green bounce light, and gives
     the glowing rim the colour from just inside it, so edges carry only the model's own colour,
  4. extracts the real floor shadow from the footage (how much darker the floor is than an
     unshadowed floor) plus a thin contact shadow under the soles,
  5. encodes VP9 + alpha WebM.

Output: public/images/main-model-video/shot-N.webm and public/video/hero-runway-poster.webp
        (the last frame of the final shot, shown to Safari, which cannot play VP9 alpha,
        and to visitors who prefer reduced motion).

Run (Python 3.10+, ffmpeg on PATH):  pip install opencv-python-headless numpy
                                     python scripts/build_hero_video.py
"""
import subprocess
import tempfile
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public/images/main-model-video"
POSTER = ROOT / "public/video/hero-runway-poster.webp"
W, H = 1920, 1080
FPS = 30
SHADOW_RGB = np.array([46, 34, 32], np.float32)  # warm near-black, reads as a shadow on porcelain
SHADOW_REACH = 0.6  # floor shadow is looked for this many model heights either side of her feet
# Generator watermark (all shots) and the light stand at the right edge of shot 3 (x0, y0, x1, y1).
JUNK = [(1680, 840, 1800, 960), (1780, 900, W, H)]


def plate(rgb: np.ndarray, screen: np.ndarray) -> np.ndarray:
    """Clean plate: the screen colour everywhere, interpolated under the model (normalised blur)."""
    h, w = screen.shape
    size = (max(w // 4, 1), max(h // 4, 1))
    small = cv2.resize(rgb, size, interpolation=cv2.INTER_AREA)
    m = (cv2.resize(screen.astype(np.float32), size, interpolation=cv2.INTER_AREA) > 0.999).astype(np.float32)
    est, conf = None, None
    for sigma in (5, 18, 60):
        den = cv2.GaussianBlur(m, (0, 0), sigma)
        e = cv2.GaussianBlur(small * m[..., None], (0, 0), sigma) / np.maximum(den, 1e-6)[..., None]
        if est is None:
            est, conf = e, den
        else:
            k = np.clip(conf / 0.15, 0, 1)[..., None]
            est = k * est + (1 - k) * e
            conf = np.maximum(conf, den)
    return cv2.resize(est, (w, h), interpolation=cv2.INTER_LINEAR)


def diff(rgb: np.ndarray) -> np.ndarray:
    return rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2])


def model_mask(hard: np.ndarray, r: np.ndarray, ox: int, oy: int) -> np.ndarray:
    """Keep the model's blobs; drop noise, the watermark and the light stand. (ox, oy) is the
    position of this crop in the frame."""
    n, labels, stats, _ = cv2.connectedComponentsWithStats(hard, connectivity=8)
    keep = []
    for i in range(1, n):
        x, y, w, h, area = stats[i]
        x, y = x + ox, y + oy
        junk = any(x >= x0 - 8 and y >= y0 - 8 and x + w <= x1 + 8 and y + h <= y1 + 8 for x0, y0, x1, y1 in JUNK)
        if area >= 600 and not junk:
            keep.append((area, i))
    if not keep:
        return np.zeros_like(hard)
    biggest = max(a for a, _ in keep)
    ids = [i for a, i in keep if a >= biggest * 0.02]
    mask = np.isin(labels, ids).astype(np.uint8) * 255
    # Fill small enclosed specks of green-lit fabric (screen-ness about 0.75); keep real screen
    # (0.85 and up, e.g. a narrow gap between arm and body) and pockets cut by the frame edge open.
    n, labels, stats, _ = cv2.connectedComponentsWithStats(cv2.bitwise_not(mask), connectivity=4)
    ch, cw = mask.shape
    for i in range(1, n):
        x, y, w, h, area = stats[i]
        if area < 3000 and x > 0 and y > 0 and x + w < cw and y + h < ch and np.median(r[labels == i]) < 0.8:
            mask[labels == i] = 255
    return mask


def key(rgb: np.ndarray, screen_level: float, ox: int, oy: int):
    """RGB on green (a crop at (ox, oy) in the frame) -> (foreground RGB, alpha, model mask)."""
    p = plate(rgb, diff(rgb) > screen_level * 0.6)
    # Screen-ness: the pixel's chroma projected on the local screen chroma (1 = screen, <= 0 = model).
    # Works in shadow too, and keeps the green-lit, shaded trouser leg (about 0.35) apart from the screen.
    c = rgb - rgb.mean(-1, keepdims=True)
    s = p - p.mean(-1, keepdims=True)
    r = (c * s).sum(-1) / np.maximum((s * s).sum(-1), 1)

    # Silhouette: everything that is not clearly screen. Its interior is solid; only a thin rim and
    # the hair keep the soft key, so a shaded, green-tinted fold never turns see-through.
    hard = cv2.morphologyEx((r < 0.72).astype(np.uint8) * 255, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    body = model_mask(hard, r, ox, oy)
    solid = cv2.erode(body, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))) > 0
    soft = np.clip((0.9 - r) / (0.9 - 0.3), 0, 1)
    soft[solid] = 1
    # The generator left a light glow a few pixels wide around her outline: choke it by 2 px, but keep
    # pixels darker than the screen (stray hairs, the dark coat hem) at full detail.
    lum = np.array([0.2126, 0.7152, 0.0722], np.float32)
    dark = np.clip((p @ lum - rgb @ lum) / 15, 0, 1)
    choked = cv2.GaussianBlur(cv2.erode(soft, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))), (0, 0), 0.7)
    alpha = np.maximum(choked, soft * dark)
    near = cv2.dilate(body, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (61, 61)))
    alpha *= cv2.GaussianBlur(near.astype(np.float32) / 255, (0, 0), 4)

    # Un-mix with the physical coverage (1 - r): take the plate out of every partly transparent pixel.
    # The solid interior is not mixed with the screen (a green-lit fold only looks like it), so it stays.
    a = np.clip(1 - r, 0.05, 1)
    a[solid] = 1
    a = a[..., None]
    fg = np.clip(p + (rgb - p) / a, 0, 255)
    # Despill 1: remove whatever is left along the screen's own chroma (green bounce, residue in fine
    # hair). The chroma vector sums to zero, so brightness is kept.
    cf = fg - fg.mean(-1, keepdims=True)
    fg = np.clip(fg - np.maximum((cf * s).sum(-1) / np.maximum((s * s).sum(-1), 1), 0)[..., None] * s, 0, 255)
    # Despill 2: pull any remaining green down to a warm neutral (nothing in the outfit is green)
    # and hand part of the removed light back as warm white.
    capped = np.minimum(fg[..., 1], 0.75 * fg[..., 0] + 0.25 * fg[..., 2])
    spill = fg[..., 1] - capped
    fg[..., 1] = capped
    fg = np.clip(fg + spill[..., None] * 0.45 * np.array([1.0, 0.97, 0.94], np.float32), 0, 255)

    # Decontaminate the rim: the glowing outline pixels take the colour of the model from just inside
    # the glow and keep only their own alpha. Dark detail (hairs) keeps its own colour.
    core = cv2.erode(body, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))).astype(np.float32) / 255
    inner, conf = None, None
    for sigma in (2, 6, 18):
        den = cv2.GaussianBlur(core, (0, 0), sigma)
        e = cv2.GaussianBlur(fg * core[..., None], (0, 0), sigma) / np.maximum(den, 1e-6)[..., None]
        if inner is None:
            inner, conf = e, den
        else:
            w = np.clip(conf / 0.1, 0, 1)[..., None]
            inner = w * inner + (1 - w) * e
            conf = np.maximum(conf, den)
    rim = (((alpha > 0) & (core < 1)) * (0.8 - 0.8 * dark)).astype(np.float32)[..., None]
    inner -= fg
    inner *= rim
    fg += inner
    return fg, alpha, body


def floor_shadow(rgb: np.ndarray, alpha: np.ndarray, body: np.ndarray) -> np.ndarray:
    """Real cast shadow: how much darker the floor around the feet is than an unshadowed floor."""
    rh, rw = body.shape  # a region of the frame that reaches its bottom edge
    ys, xs = np.nonzero(body)
    if len(ys) < 2000:
        return np.zeros((rh, rw), np.float32)
    top, foot = ys.min(), ys.max()
    h = max(foot - top, 120)
    feet = xs[ys > foot - 0.08 * h]
    cx = (feet.min() + feet.max()) / 2
    x0, x1 = int(max(cx - SHADOW_REACH * h, 0)), int(min(cx + SHADOW_REACH * h, rw))
    y0, y1 = int(max(foot - 0.3 * h, 0)), rh
    lum = np.array([0.2126, 0.7152, 0.0722], np.float32)
    y = rgb[y0:y1, x0:x1] @ lum
    free = alpha[y0:y1, x0:x1] == 0

    # Unshadowed floor: a smooth surface fitted to the brighter floor pixels (shadows only darken),
    # re-fitted while dropping the pixels that sit below it.
    gy, gx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
    u, v = (gx - cx) / h, (gy - foot) / h
    basis = np.stack([np.ones_like(u), u, v, u * u, u * v, v * v], -1)
    use = free.copy()
    fit = None
    for _ in range(4):
        idx = np.flatnonzero(use)
        if len(idx) < 500:
            return np.zeros((rh, rw), np.float32)
        idx = idx[:: max(len(idx) // 20000, 1)]
        A, b = basis.reshape(-1, 6)[idx], y.reshape(-1)[idx]
        coef, *_ = np.linalg.lstsq(A, b, rcond=None)
        fit = basis @ coef
        res = y - fit
        noise = 1.4826 * np.median(np.abs(res[use]))
        use = free & (res > -1.5 * noise)

    dens = np.clip(1 - y / np.maximum(fit, 1), 0, 1)
    dens = np.clip((dens - 0.05) / 0.95, 0, 1)
    # Only the floor: fade out above the feet and towards the window sides.
    fade_y = np.clip((gy - (foot - 0.26 * h)) / (0.18 * h), 0, 1)
    fade_x = np.clip(np.minimum(gx - x0, x1 - gx) / (0.3 * h), 0, 1)
    dens *= (fade_y * fade_x) ** 1.5
    out = np.zeros((rh, rw), np.float32)
    out[y0:y1, x0:x1] = dens
    out = cv2.GaussianBlur(out, (0, 0), 2.5)

    # Contact shadow: a thin dark line where the soles meet the floor, which the soft studio
    # light barely shows on the green floor but every real photo has.
    drop = int(0.006 * h) + 2
    soles = np.zeros((rh, rw), np.float32)
    top_sole = int(foot - 0.035 * h)
    soles[top_sole + drop :] = body[top_sole : rh - drop] / 255
    contact = cv2.GaussianBlur(soles, (0, 0), sigmaX=0.012 * h + 3, sigmaY=0.004 * h + 1.5) * 0.55
    return 1 - (1 - out) * (1 - np.clip(contact, 0, 1))


def compose(fg: np.ndarray, alpha: np.ndarray, shade: np.ndarray) -> np.ndarray:
    """Model over its shadow -> straight-alpha RGBA. Fully clear pixels carry the nearest edge
    colour, so chroma subsampling in the encoder cannot bleed green or black into the edge."""
    out_a = alpha + shade * (1 - alpha)
    rgb = (fg * alpha[..., None] + SHADOW_RGB * (shade * (1 - alpha))[..., None]) / np.maximum(out_a, 1e-6)[..., None]
    wa = out_a[..., None]
    pad = cv2.GaussianBlur(rgb * wa, (0, 0), 6) / np.maximum(cv2.GaussianBlur(out_a, (0, 0), 6), 1e-6)[..., None]
    clear = out_a < 0.004
    rgb[clear] = pad[clear]
    return np.dstack([np.clip(rgb, 0, 255), out_a * 255])


def frame(rgb: np.ndarray) -> np.ndarray:
    """Key one frame. Only the box around the model and her floor is processed, which keeps
    memory low; the rest of the frame is plain screen and stays fully transparent."""
    out = np.zeros((H, W, 4), np.float32)
    s = 8
    d = diff(cv2.resize(rgb, (W // s, H // s), interpolation=cv2.INTER_AREA))
    screen_level = float(np.percentile(d, 70))
    rough = d < screen_level * 0.5
    for x0, y0, x1, y1 in JUNK:
        rough[y0 // s : y1 // s + 1, x0 // s : x1 // s + 1] = False
    ys, xs = np.nonzero(rough)
    if len(ys) < 20:
        return out
    m = 80  # screen margin the plate is interpolated from
    top, bottom, left, right = ys.min() * s, (ys.max() + 1) * s, xs.min() * s, (xs.max() + 1) * s
    reach = SHADOW_REACH * (bottom - top) + m
    cx = (left + right) / 2
    # Region: the model plus the floor her shadow can fall on, down to the bottom of the frame.
    ry0 = max(top - m, 0)
    rx0, rx1 = int(max(min(left - m, cx - reach), 0)), int(min(max(right + m, cx + reach), W))
    # Key: the model alone, in a tighter box inside the region.
    kx0, kx1 = max(left - m, rx0), min(right + m, rx1)
    fg, a, b = key(rgb[ry0:, kx0:kx1], screen_level, kx0, ry0)

    rh, rw = H - ry0, rx1 - rx0
    fgr = np.zeros((rh, rw, 3), np.float32)
    alpha = np.zeros((rh, rw), np.float32)
    body = np.zeros((rh, rw), np.uint8)
    fgr[:, kx0 - rx0 : kx1 - rx0], alpha[:, kx0 - rx0 : kx1 - rx0], body[:, kx0 - rx0 : kx1 - rx0] = fg, a, b
    del fg, a, b
    out[ry0:, rx0:rx1] = compose(fgr, alpha, floor_shadow(rgb[ry0:, rx0:rx1], alpha, body))
    return out


def build(src: Path, dst: Path) -> np.ndarray:
    # Decode (scaled to 1080p) through a pipe, key frame by frame to PNG, then encode. One frame at
    # a time: each keyed frame needs a few hundred MB of float buffers.
    dec = subprocess.Popen(["ffmpeg", "-v", "error", "-threads", "2", "-i", str(src), "-vf",
                            f"scale={W}:{H}:flags=lanczos", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                           stdout=subprocess.PIPE)
    with tempfile.TemporaryDirectory() as tmp:
        i = 0
        while buf := dec.stdout.read(W * H * 3):
            last = frame(np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32)).astype(np.uint8)
            cv2.imwrite(f"{tmp}/out{i:04d}.png", cv2.cvtColor(last, cv2.COLOR_RGBA2BGRA))
            if i % 60 == 0:
                print(f"  {src.name} frame {i}", flush=True)
            i += 1
        dec.wait()
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-i", f"{tmp}/out%04d.png",
                        "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "30",
                        "-deadline", "good", "-cpu-used", "2", "-row-mt", "1", "-threads", "4",
                        "-auto-alt-ref", "0", "-an", str(dst)], check=True)
    return last


if __name__ == "__main__":
    for n in (1, 2, 3):
        src = next(SRC.glob(f"shot{n}-greenscreen.mp4"), None) or next(SRC.glob(f"shot-{n}greenscreen.mp4"))
        last = build(src, SRC / f"shot-{n}.webm")
    cv2.imwrite(str(POSTER), cv2.cvtColor(last, cv2.COLOR_RGBA2BGRA), [cv2.IMWRITE_WEBP_QUALITY, 88])
    print("done")
