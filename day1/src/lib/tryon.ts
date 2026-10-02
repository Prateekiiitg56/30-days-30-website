import { canTryOn, fitsMode, getProduct, type Product, type Slot } from "./catalogue";
import { lineKey, type BodyMode, type CartLine } from "./store";

export interface Layer {
  key: string;
  line: CartLine;
  product: Product;
  slot: Slot;
  hex: string;
  colourName: string;
}

/** Layering order: bottom → full-length → top → outerwear (PRD V-10). */
const ORDER: Slot[] = ["bottom", "full", "top", "outer"];

export const conflicts = (a: Slot, b: Slot) =>
  a === b || (a === "full" && (b === "top" || b === "bottom")) || (b === "full" && (a === "top" || a === "bottom"));

export const tryableLines = (lines: CartLine[]) =>
  lines.filter((l) => {
    const p = getProduct(l.productId);
    return p && canTryOn(p);
  });

/**
 * Select `key`, dropping anything it would clash with (one item per slot;
 * a dress replaces top + bottom). Later picks swap earlier ones out.
 */
export function selectKey(selected: string[], key: string, lines: CartLine[]): string[] {
  const slotOf = (k: string) => {
    const l = lines.find((x) => lineKey(x) === k);
    return l && getProduct(l.productId)?.tryOn.slot;
  };
  const slot = slotOf(key);
  if (!slot) return selected;
  return [...selected.filter((k) => k !== key && !conflicts(slotOf(k) as Slot, slot)), key];
}

/** Default selection: every try-on-able item, resolved in cart order so later items win their slot. */
export const defaultSelection = (lines: CartLine[], only?: string | null) => {
  const tryable = tryableLines(lines);
  if (only && tryable.some((l) => lineKey(l) === only)) return [only];
  return tryable.reduce<string[]>((sel, l) => selectKey(sel, lineKey(l), lines), []);
};

export function visibleLayers(lines: CartLine[], selected: string[], mode: BodyMode): Layer[] {
  return lines
    .filter((l) => selected.includes(lineKey(l)))
    .map((line) => {
      const product = getProduct(line.productId)!;
      const c = product.colours.find((x) => x.id === line.colour) ?? product.colours[0];
      return { key: lineKey(line), line, product, slot: product.tryOn.slot!, hex: c.hex, colourName: c.name };
    })
    .filter((l) => fitsMode(l.product, mode))
    .sort((a, b) => ORDER.indexOf(a.slot) - ORDER.indexOf(b.slot));
}

/** Preview alt text, e.g. "Your photo wearing Oxblood Wool Coat, size M" (PRD §10). */
export const previewAlt = (layers: Layer[]) =>
  layers.length
    ? `Your photo wearing ${layers.map((l) => `${l.product.name} in ${l.colourName}, size ${l.line.size}`).join("; ")}`
    : "Your photo, no items shown";

/** A real render replaces the photo; a preview shows the photo with the pieces pinned to it. */
export type RenderResult = { kind: "render"; image: string } | { kind: "preview" };

/** The steps shown while a look is styled, in order. */
export const renderSteps = (layers: Layer[]) => [
  "Reading your pose",
  ...layers.map((l) => `Fitting the ${l.product.name.toLowerCase()}`),
  "Finishing the light",
];

// Outfits already styled this session come back instantly, as a real render cache would.
const styled = new Set<string>();

/**
 * Showcase mode: the try-on model is not connected, so this walks through the steps a real
 * render takes and returns the pinned preview. To go live, call `/api/tryon` here garment by
 * garment (bottom → top → outerwear, each from the previous result) and return `{ kind: "render" }`.
 */
export async function requestRender(
  photo: string,
  mode: BodyMode,
  layers: Layer[],
  opts: { signal?: AbortSignal; onStep?: (done: number, total: number) => void } = {},
): Promise<RenderResult> {
  const steps = renderSteps(layers);
  const key = `${photo.length}:${photo.slice(-64)}|${mode}|${layers.map((l) => l.key).join(",")}`;
  const quick = styled.has(key) || !layers.length;
  for (let i = 0; i < steps.length; i++) {
    opts.onStep?.(i, steps.length);
    await wait(quick ? 120 : i === 0 ? 1100 : 900 + Math.random() * 500, opts.signal);
  }
  opts.onStep?.(steps.length, steps.length);
  styled.add(key);
  return { kind: "preview" };
}

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => (clearTimeout(t), reject(signal.reason)), { once: true });
  });

/**
 * Read, downscale and re-encode the photo on-device. Keeps it small enough for
 * session storage and strips EXIF (location etc.) as a side effect.
 */
export async function preparePhoto(file: File): Promise<{ dataUrl: string; issue?: string }> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("decode"));
      i.src = url;
    });
    const scale = Math.min(1, 1400 / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, w, h);
    return { dataUrl: canvas.toDataURL("image/jpeg", 0.86), issue: qualityIssue(ctx, w, h, img) };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Lightweight on-device quality check (PRD V-6): size, orientation, darkness and blur. */
function qualityIssue(ctx: CanvasRenderingContext2D, w: number, h: number, img: HTMLImageElement): string | undefined {
  if (Math.min(img.naturalWidth, img.naturalHeight) < 480) return "This photo is quite small. Use one at least 480 px wide for a sharper preview.";
  if (w > h * 1.15) return "This photo is landscape. A portrait photo of you standing works best.";
  const sw = 96;
  const sh = Math.round((h / w) * sw);
  const small = document.createElement("canvas");
  small.width = sw;
  small.height = sh;
  const sctx = small.getContext("2d")!;
  sctx.drawImage(ctx.canvas, 0, 0, sw, sh);
  const { data } = sctx.getImageData(0, 0, sw, sh);
  const lum = new Float32Array(sw * sh);
  let sum = 0;
  for (let i = 0; i < lum.length; i++) {
    lum[i] = 0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2];
    sum += lum[i];
  }
  if (sum / lum.length < 55) return "This photo looks dark. Try again in even, bright light.";
  // Laplacian variance as a blur estimate.
  let acc = 0;
  let acc2 = 0;
  let n = 0;
  for (let y = 1; y < sh - 1; y++)
    for (let x = 1; x < sw - 1; x++) {
      const i = y * sw + x;
      const v = 4 * lum[i] - lum[i - 1] - lum[i + 1] - lum[i - sw] - lum[i + sw];
      acc += v;
      acc2 += v * v;
      n++;
    }
  const variance = acc2 / n - (acc / n) ** 2;
  if (variance < 18) return "This photo looks blurry. Hold the camera steady or tap to focus.";
  return undefined;
}
