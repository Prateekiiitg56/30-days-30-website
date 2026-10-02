"""
Build flat garment images for the Virtual Closet try-on model (PRD §9: garmentImage per colour).

Product photos show the garment on a model; try-on models need the garment alone.
For every try-on product this script:
  1. segments the clothing with rembg's u2net_cloth_seg model,
  2. cuts the garment out of the product photo onto white, framed 3:4 (768x1024),
  3. writes one recoloured version per catalogue colour.

Output: public/images/garments/<productId>-<colourId>.webp

Run (Python 3.10+):  pip install "rembg[cpu]" pillow numpy opencv-python-headless
                     python scripts/extract_garments.py
Keep the colour list in sync with src/lib/catalogue.ts.
"""
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public/images/products"
OUT = ROOT / "public/images/garments"

# productId: (slot, [(colourId, hex), ...]); the first colour is the one in the photo.
PRODUCTS = {
    "w-coat": ("outer", [("oxblood", "#5C1A1F"), ("camel", "#B08A62"), ("black", "#1C1A1A")]),
    "w-dress": ("full", [("blush", "#E9B9A4"), ("ink", "#262033"), ("garnet", "#6B1E24")]),
    "w-trouser": ("bottom", [("ecru", "#E6DCCB"), ("black", "#1C1A1A")]),
    "w-shirt": ("top", [("white", "#F7F5F0"), ("blush", "#E9B9A4")]),
    "m-blazer": ("outer", [("stone", "#CDBFA8"), ("navy", "#23283A")]),
    "m-knit": ("top", [("oxblood", "#5C1A1F"), ("charcoal", "#3A3A3C"), ("oat", "#D8CBB5")]),
    "m-trouser": ("bottom", [("charcoal", "#3A3A3C"), ("taupe", "#8B7B6E")]),
    "m-tee": ("top", [("white", "#F7F5F0"), ("black", "#1C1A1A")]),
}

# u2net_cloth_seg returns four stacked square masks: 0 upper, 1 lower (partial), 2 lower, 3 full-length.
PANELS = {"top": [0], "outer": [0, 3], "bottom": [2], "full": [3]}


def garment_mask(photo: Image.Image, slot: str, session) -> np.ndarray:
    seg = np.asarray(remove(photo, session=session, post_process_mask=True))[..., 3]
    size = seg.shape[1]
    panels = [seg[i * size:(i + 1) * size] for i in range(4)]
    best = max((panels[i] for i in PANELS[slot]), key=lambda m: (m > 128).sum())
    mask = cv2.resize(best, photo.size, interpolation=cv2.INTER_LINEAR)
    # keep the largest connected piece (drops stray bits like a hand or shoe)
    n, labels, stats, _ = cv2.connectedComponentsWithStats((mask > 128).astype(np.uint8))
    if n > 1:
        keep = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        mask = np.where(labels == keep, mask, 0)
    return cv2.GaussianBlur(mask.astype(np.float32) / 255, (0, 0), 0.8)


def frame(rgb: np.ndarray, alpha: np.ndarray) -> Image.Image:
    ys, xs = np.where(alpha > 0.5)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    comp = rgb * alpha[..., None] + 255 * (1 - alpha[..., None])
    crop = Image.fromarray(comp[y0:y1 + 1, x0:x1 + 1].astype(np.uint8))
    W, H = 768, 1024
    scale = min((W * 0.86) / crop.width, (H * 0.9) / crop.height)
    crop = crop.resize((round(crop.width * scale), round(crop.height * scale)), Image.LANCZOS)
    canvas = Image.new("RGB", (W, H), "white")
    canvas.paste(crop, ((W - crop.width) // 2, (H - crop.height) // 2))
    return canvas


def recolour(rgb: np.ndarray, alpha: np.ndarray, hex_: str) -> np.ndarray:
    """Move the garment to the target colour while keeping its folds and shading."""
    lab = cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2LAB).astype(np.float32)
    target = cv2.cvtColor(np.array([[[int(hex_[i:i + 2], 16) for i in (1, 3, 5)]]], np.uint8), cv2.COLOR_RGB2LAB)[0, 0].astype(np.float32)
    m = alpha > 0.5
    L = lab[..., 0]
    mean_l, std_l = L[m].mean(), max(L[m].std(), 1)
    # shading relative to the garment's own mean, re-centred on the target lightness
    new_l = target[0] + (L - mean_l) * min(1.0, 38 / std_l)
    lab[..., 0] = np.where(m, np.clip(new_l, 0, 255), L)
    lab[..., 1] = np.where(m, target[1], lab[..., 1])
    lab[..., 2] = np.where(m, target[2], lab[..., 2])
    return cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB).astype(np.float32)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    session = new_session("u2net_cloth_seg")
    for pid, (slot, colours) in PRODUCTS.items():
        photo = Image.open(SRC / f"{pid}-1.webp").convert("RGB")
        alpha = garment_mask(photo, slot, session)
        rgb = np.asarray(photo, np.float32)
        for i, (cid, hex_) in enumerate(colours):
            pixels = rgb if i == 0 else recolour(rgb, alpha, hex_)
            frame(pixels, alpha).save(OUT / f"{pid}-{cid}.webp", "WEBP", quality=90)
            print("wrote", f"{pid}-{cid}.webp")


if __name__ == "__main__":
    main()
