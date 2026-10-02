/* eslint-disable @next/next/no-img-element -- the photo is a local data URL */
import Image from "next/image";
import type { Slot } from "@/lib/catalogue";
import type { BodyMode } from "@/lib/store";
import type { Layer } from "@/lib/tryon";
import { cx } from "../ui";

/** Where each slot sits on a centred, portrait photo (percent of the 3:4 stage). */
const PIN: Record<BodyMode, Partial<Record<Slot, { x: number; y: number }>>> = {
  full: { top: { x: 62, y: 22 }, outer: { x: 36, y: 40 }, full: { x: 60, y: 46 }, bottom: { x: 40, y: 68 } },
  half: { top: { x: 63, y: 48 }, outer: { x: 34, y: 70 } },
};

/**
 * The look on the stage. A real render replaces the photo (`reveal` 0–100 clips it for the
 * Before/After slider); until then the photo is shown with each piece pinned where it's worn.
 */
export function LookPreview({
  photo,
  mode,
  layers,
  render,
  reveal = 100,
  pins = false,
  alt,
  className,
}: {
  photo: string;
  mode: BodyMode;
  layers: Layer[];
  render?: string | null;
  reveal?: number;
  pins?: boolean;
  alt: string;
  className?: string;
}) {
  return (
    <div className={cx("relative aspect-[3/4] overflow-hidden bg-stone", className)} role="img" aria-label={alt}>
      <img src={photo} alt="" className="absolute inset-0 size-full object-cover" />
      {render && (
        <img
          src={render}
          alt=""
          className="absolute inset-0 size-full object-cover"
          style={reveal < 100 ? { clipPath: `inset(0 ${100 - reveal}% 0 0)` } : undefined}
        />
      )}
      {pins && !render && (
        <>
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,24,25,0)_55%,rgba(28,24,25,0.28)_100%)]" />
          {layers.map((l, i) => {
            const at = PIN[mode][l.slot];
            return at ? <Pin key={l.key} layer={l} x={at.x} y={at.y} delay={i * 140} /> : null;
          })}
        </>
      )}
    </div>
  );
}

function Pin({ layer, x, y, delay }: { layer: Layer; x: number; y: number; delay: number }) {
  const right = x < 50; // label opens towards the middle, where there is always room for it
  return (
    <div
      aria-hidden
      className="anim-fade-up absolute"
      style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${delay}ms` }}
    >
      <span className="pin-dot absolute -left-2 -top-2 block size-4 rounded-full border-2 border-chalk bg-oxblood shadow-[0_2px_8px_rgba(0,0,0,0.35)]" />
      <span className={cx("absolute top-0 h-px w-6 bg-chalk/90", right ? "left-2" : "right-2")} />
      <div
        className={cx(
          "absolute -top-6 flex w-max max-w-[190px] items-center gap-2.5 bg-chalk/95 p-1.5 pr-3 shadow-[0_10px_28px_-12px_rgba(0,0,0,0.5)] backdrop-blur-sm",
          right ? "left-8" : "right-8",
        )}
      >
        <span className="relative h-10 w-8 shrink-0 overflow-hidden bg-stone">
          <Image src={layer.product.images[0]} alt="" fill sizes="32px" className="object-cover" />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[12px] font-medium">{layer.product.name}</span>
          <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-ink-soft">
            <span className="inline-block size-2.5 rounded-full border border-line" style={{ background: layer.hex }} />
            {layer.colourName} · {layer.line.size}
          </span>
        </span>
      </div>
    </div>
  );
}
