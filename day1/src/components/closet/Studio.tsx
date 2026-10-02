/* eslint-disable @next/next/no-img-element -- local data URL */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { canTryOn, fitsMode, formatPrice, getProduct } from "@/lib/catalogue";
import { lineKey, useCart, useClosetSession, useLooks, useUI, type BodyMode, type CartLine } from "@/lib/store";
import { defaultSelection, previewAlt, renderSteps, requestRender, selectKey, visibleLayers, type RenderResult } from "@/lib/tryon";
import { orderTotals, useRemoveWithUndo } from "../cart/CartParts";
import { Icon } from "../Icon";
import { EmptyState } from "../Overlays";
import { Button, ButtonLink, Notice, Swatches, cx } from "../ui";
import { LookPreview } from "./LookPreview";

type Status = "generating" | "ready";

export function Studio({ only, onChangePhoto }: { only: string | null; onChangePhoto: (mode?: BodyMode) => void }) {
  const lines = useCart((s) => s.lines);
  const update = useCart((s) => s.update);
  const removeLine = useRemoveWithUndo();
  const { photo, mode } = useClosetSession();
  const saveLook = useLooks((s) => s.save);
  const toast = useUI((s) => s.toast);

  const [selected, setSelected] = useState<string[]>(() => defaultSelection(lines, only));
  const [status, setStatus] = useState<Status>("generating");
  const [result, setResult] = useState<RenderResult>({ kind: "preview" });
  const [compare, setCompare] = useState(false);
  const [reveal, setReveal] = useState(50);
  const [zoom, setZoom] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [step, setStep] = useState<{ done: number; total: number }>({ done: 0, total: 0 });

  const layers = useMemo(() => visibleLayers(lines, selected, mode), [lines, selected, mode]);
  const steps = useMemo(() => renderSteps(layers), [layers]);
  const canCompare = result.kind === "render" && status === "ready";
  const signature = layers.map((l) => l.key).join(",");
  const run = useRef(0);

  // Regenerate whenever the visible outfit changes; crossfade on the new signature.
  useEffect(() => {
    if (!photo) return;
    const id = ++run.current;
    // Cancel the previous outfit's render when the selection changes mid-way.
    const ctrl = new AbortController();
    setStatus("generating");
    setStep({ done: 0, total: 0 });
    requestRender(photo, mode, layers, {
      signal: ctrl.signal,
      onStep: (done, total) => id === run.current && setStep({ done, total }),
    })
      .then((res) => {
        if (id !== run.current) return;
        setResult(res);
        setStatus("ready");
      })
      .catch(() => {});
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, photo, mode]);

  const toggle = (key: string, on: boolean) =>
    setSelected((sel) => (on ? selectKey(sel, key, lines) : sel.filter((k) => k !== key)));

  const change = (line: CartLine, patch: { colour?: string; size?: string }) => {
    const oldKey = lineKey(line);
    const next = { ...line, ...patch };
    update(oldKey, patch);
    setSelected((sel) => sel.map((k) => (k === oldKey ? lineKey(next) : k)));
    const p = getProduct(line.productId)!;
    toast({
      message: patch.size
        ? `Size changed to ${patch.size} — cart updated.`
        : `Colour changed to ${p.colours.find((c) => c.id === patch.colour)?.name} — cart updated.`,
    });
  };

  if (!lines.length) {
    return (
      <div className="container-x">
        <EmptyState title="Your cart is empty" action={<ButtonLink href="/shop/all">Continue shopping</ButtonLink>}>
          <p className="t-caption">Add clothes to try them on here.</p>
        </EmptyState>
      </div>
    );
  }
  if (!photo) return null;

  const { total } = orderTotals(lines);
  const tryCount = lines.filter((l) => canTryOn(getProduct(l.productId)!)).length;
  const onSave = () => {
    saveLook({ photo, mode, items: layers.map((l) => ({ productId: l.line.productId, colour: l.line.colour, size: l.line.size })) });
    toast({ message: "Look saved to your cart", tone: "success" });
  };
  const modeLabel = mode === "full" ? "Full body" : "Half body";

  const stage = (
    <div className="relative mx-auto w-full">
      {/* Width is capped by the available height so the 3:4 stage always fits on screen. */}
      <div className="relative mx-auto aspect-[3/4] w-full max-w-[min(100%,var(--stage-max))] overflow-hidden bg-stone">
        <div
          key={`${signature}-${result.kind}-${status}`}
          className={cx("absolute inset-0 transition-transform duration-300 ease-brand", status === "ready" && "anim-fade-in")}
          style={{ transform: zoom ? "scale(1.6)" : undefined, transformOrigin: "50% 30%" }}
        >
          <LookPreview
            photo={photo}
            mode={mode}
            layers={layers}
            render={result.kind === "render" ? result.image : null}
            reveal={compare ? reveal : 100}
            pins={status === "ready"}
            alt={status === "ready" ? previewAlt(layers) : "Styling your look"}
            className="!absolute inset-0 !aspect-auto"
          />
        </div>

        {status === "generating" && <Styling steps={steps} done={step.done} />}

        {/* Chips: mode + count */}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="t-label bg-chalk/90 px-2.5 py-1.5 text-[11px]">{modeLabel}</span>
          <span className="t-label bg-chalk/90 px-2.5 py-1.5 text-[11px]">
            {layers.length} {layers.length === 1 ? "item" : "items"}
          </span>
        </div>

        {compare && canCompare && (
          <>
            <span aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 bg-chalk shadow" style={{ left: `${reveal}%` }} />
            <span className="t-label pointer-events-none absolute bottom-16 left-3 bg-ink/80 px-2 py-1 text-[10px] text-porcelain">After</span>
            <span className="t-label pointer-events-none absolute bottom-16 right-3 bg-ink/80 px-2 py-1 text-[10px] text-porcelain">Before</span>
            <label className="absolute inset-x-4 bottom-4">
              <span className="sr-only">Compare before and after</span>
              <input
                type="range"
                min={0}
                max={100}
                value={reveal}
                onChange={(e) => setReveal(Number(e.target.value))}
                className="h-11 w-full cursor-ew-resize accent-oxblood"
              />
            </label>
          </>
        )}

        <button
          type="button"
          onClick={() => setZoom((z) => !z)}
          aria-pressed={zoom}
          aria-label={zoom ? "Zoom out" : "Zoom in"}
          className={cx("absolute right-3 inline-flex size-11 items-center justify-center rounded-full bg-chalk/95 hover:bg-chalk", compare && canCompare ? "top-3" : "bottom-3")}
        >
          <Icon name={zoom ? "zoom-out" : "zoom-in"} size={20} />
        </button>
      </div>
      {status === "ready" && result.kind === "preview" && layers.length > 0 && (
        <p className="t-caption mt-3 flex items-center justify-center gap-2 text-center text-ink-soft">
          <Icon name="sparkle" size={14} className="shrink-0 text-oxblood" />
          Showcase preview — pieces pinned to your photo.
        </p>
      )}
      {status === "ready" && layers.length === 0 && (
        <Notice icon="eye-off" className="mt-3">Nothing selected. Tick an item to see it on you.</Notice>
      )}
    </div>
  );

  const rail = (compact: boolean) => (
    <ul className={cx(compact ? "flex snap-x gap-3 overflow-x-auto px-5 pb-2" : "flex flex-col gap-3")} aria-label="Items in your cart">
      {lines.map((l) => (
        <RailCard
          key={lineKey(l)}
          line={l}
          mode={mode}
          compact={compact}
          checked={selected.includes(lineKey(l))}
          onToggle={(on) => toggle(lineKey(l), on)}
          onChange={(patch) => change(l, patch)}
          onRemove={() => {
            setSelected((sel) => sel.filter((k) => k !== lineKey(l)));
            removeLine(lineKey(l));
          }}
          onSwitchPhoto={() => onChangePhoto("full")}
        />
      ))}
    </ul>
  );

  const actions = (
    <>
      <Button variant="secondary" full icon="bookmark" onClick={onSave} disabled={!layers.length || status !== "ready"}>
        Save look
      </Button>
      {canCompare && (
        <Button variant="secondary" full icon="compare" aria-pressed={compare} onClick={() => setCompare((c) => !c)}>
          {compare ? "Hide compare" : "Before / After"}
        </Button>
      )}
    </>
  );

  return (
    <>
      {/* Desktop: 3 columns */}
      <div className="hidden min-h-0 flex-1 gap-6 px-6 pb-6 pt-6 lg:grid lg:grid-cols-[260px_1fr_380px] xl:grid-cols-[300px_1fr_420px] xl:gap-8 xl:px-10">
        <aside aria-label="Your photo" className="flex flex-col gap-4">
          <div className="flex gap-4 bg-chalk p-4">
            <img src={photo} alt="Your photo" className="aspect-[3/4] w-20 shrink-0 bg-stone object-cover" />
            <div className="flex flex-col justify-center gap-1">
              <p className="t-label text-[12px]">{modeLabel}</p>
              <button type="button" onClick={() => onChangePhoto()} className="t-label link-underline min-h-11 self-start text-[12px]">
                Change photo
              </button>
            </div>
          </div>
          {actions}
          {layers.length > 0 && (
            <section aria-labelledby="look-sum-title" className="border-t border-line pt-5">
              <h2 id="look-sum-title" className="t-label text-[12px]">This look</h2>
              <ul className="mt-3 flex flex-col gap-2 text-[14px]">
                {layers.map((l) => (
                  <li key={l.key} className="flex items-baseline justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="size-2.5 shrink-0 rounded-full border border-line" style={{ background: l.hex }} />
                      <span className="truncate">{l.product.name}</span>
                    </span>
                    <span className="shrink-0 text-ink-soft">{formatPrice(l.product.price)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex justify-between border-t border-line pt-3 text-[15px] font-medium">
                <span>Look total</span>
                <span>{formatPrice(layers.reduce((sum, l) => sum + l.product.price * l.line.qty, 0))}</span>
              </p>
            </section>
          )}
          <p className="t-caption mt-auto flex items-start gap-2 text-ink-soft">
            <Icon name="lock" size={16} className="shrink-0" />
            Your photo stays private and is deleted after your session.
          </p>
        </aside>

        <section aria-label="Preview" className="min-h-0 [--stage-max:calc((100dvh-72px-48px-64px)*0.75)]">{stage}</section>

        <aside aria-labelledby="rail-title" className="flex min-h-0 flex-col">
          <h2 id="rail-title" className="t-label text-[13px]">In your cart ({lines.length})</h2>
          <div className="-mr-2 mt-4 min-h-0 flex-1 overflow-y-auto pr-2">{rail(false)}</div>
          <div className="mt-4 border-t border-line pt-4">
            <p className="flex justify-between text-[17px] font-medium">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <ButtonLink href="/checkout" full>Checkout</ButtonLink>
              <ButtonLink href="/cart" variant="secondary" full>Back to cart</ButtonLink>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile / tablet: stage on top, bottom sheet with the rail, sticky actions */}
      <div className="flex flex-1 flex-col lg:hidden">
        <section aria-label="Preview" className="px-5 pt-4 md:px-10" style={{ paddingBottom: sheetOpen ? 0 : 236 }}>
          <div className="mx-auto max-w-[480px] [--stage-max:calc((100dvh-64px-236px-100px)*0.75)]">{stage}</div>
          <div className="mx-auto mt-3 flex max-w-[480px] items-center justify-between">
            <button type="button" onClick={() => onChangePhoto()} className="t-label link-underline min-h-11 text-[12px]">
              Change photo
            </button>
            {canCompare && (
              <button type="button" aria-pressed={compare} onClick={() => setCompare((c) => !c)} className="t-label inline-flex min-h-11 items-center gap-2 text-[12px]">
                <Icon name="compare" size={16} /> {compare ? "Hide compare" : "Before / After"}
              </button>
            )}
          </div>
        </section>

        <div
          className={cx(
            "fixed inset-x-0 bottom-0 z-30 flex flex-col bg-chalk shadow-overlay transition-[max-height] duration-300 ease-brand",
            sheetOpen ? "max-h-[82dvh]" : "max-h-[236px]",
          )}
        >
          <button
            type="button"
            onClick={() => setSheetOpen((o) => !o)}
            aria-expanded={sheetOpen}
            aria-controls="closet-sheet"
            className="flex min-h-12 w-full flex-col items-center justify-center gap-1.5 pt-2"
          >
            <span aria-hidden className="h-1 w-10 rounded-full bg-line" />
            <span className="t-label flex items-center gap-2 text-[12px]">
              In your cart ({lines.length})
              <Icon name="chevron" size={14} className={cx("transition-transform", !sheetOpen && "rotate-180")} />
            </span>
          </button>
          <div id="closet-sheet" className="min-h-0 flex-1 overflow-y-auto">
            {sheetOpen ? <div className="px-5 pb-4">{rail(false)}</div> : rail(true)}
          </div>
          <div className="flex gap-3 border-t border-line px-5 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3">
            <Button variant="secondary" icon="bookmark" onClick={onSave} disabled={!layers.length || status !== "ready"} className="!px-5">
              Save
            </Button>
            <ButtonLink href="/checkout" full>
              Checkout · {formatPrice(total)}
            </ButtonLink>
          </div>
        </div>
      </div>

      {tryCount === 0 && (
        <p className="sr-only" role="status">None of the items in your cart can be tried on.</p>
      )}
    </>
  );
}

/** Styling state: the photo under a scan line, with the steps ticking off one by one. */
function Styling({ steps, done }: { steps: string[]; done: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden" role="status" aria-live="polite">
      <div className="absolute inset-0 bg-ink/35 backdrop-blur-[2px] backdrop-grayscale-[0.6]" />
      <div aria-hidden className="scan-line absolute inset-x-0 top-0 h-full">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(233,185,164,0)_0%,rgba(233,185,164,0.28)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-blush shadow-[0_0_14px_2px_rgba(233,185,164,0.8)]" />
      </div>
      <div className="absolute inset-x-4 bottom-4 bg-chalk/95 p-4 shadow-overlay backdrop-blur-sm sm:inset-x-auto sm:left-1/2 sm:w-[300px] sm:-translate-x-1/2">
        <p className="t-label flex items-center gap-2 text-[12px]">
          <Icon name="sparkle" size={14} className="text-oxblood" /> Styling your look…
        </p>
        <ol className="mt-3 flex flex-col gap-2">
          {steps.map((label, i) => {
            const state = i < done ? "done" : i === done ? "now" : "next";
            return (
              <li key={label} className={cx("flex items-center gap-2.5 text-[13px] transition-colors", state === "next" && "text-ink-soft/70")}>
                <span
                  className={cx(
                    "inline-flex size-4 shrink-0 items-center justify-center rounded-full",
                    state === "done" && "bg-oxblood text-on-brand",
                    state === "now" && "animate-spin border-[1.5px] border-oxblood border-t-transparent",
                    state === "next" && "border border-line",
                  )}
                >
                  {state === "done" && <Icon name="check" size={10} />}
                </span>
                <span className="truncate first-letter:uppercase">{label}</span>
              </li>
            );
          })}
        </ol>
        <div className="mt-4 h-0.5 overflow-hidden bg-line">
          <div
            className="h-full origin-left bg-oxblood transition-transform duration-500 ease-brand"
            style={{ transform: `scaleX(${steps.length ? Math.max(0.04, done / steps.length) : 0.04})` }}
          />
        </div>
      </div>
    </div>
  );
}

function RailCard({
  line,
  mode,
  compact,
  checked,
  onToggle,
  onChange,
  onRemove,
  onSwitchPhoto,
}: {
  line: CartLine;
  mode: BodyMode;
  compact: boolean;
  checked: boolean;
  onToggle: (on: boolean) => void;
  onChange: (patch: { colour?: string; size?: string }) => void;
  onRemove: () => void;
  onSwitchPhoto: () => void;
}) {
  const p = getProduct(line.productId)!;
  const tryable = canTryOn(p);
  const fits = fitsMode(p, mode);
  const dimmed = !tryable || !fits;
  const id = `rail-${lineKey(line).replace(/[^a-z0-9]/gi, "")}`;
  const colour = p.colours.find((c) => c.id === line.colour);

  const checkbox = tryable && fits && (
    <label className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2" htmlFor={`${id}-show`}>
      <input
        id={`${id}-show`}
        type="checkbox"
        checked={checked}
        onChange={(e) => onToggle(e.target.checked)}
        className="size-5 cursor-pointer accent-oxblood"
      />
      <span className="sr-only">Show {p.name} in preview</span>
      <Icon name={checked ? "eye" : "eye-off"} size={18} className={checked ? "text-ink" : "text-ink-soft"} />
    </label>
  );

  if (compact) {
    return (
      <li className="w-[210px] shrink-0 snap-start">
        <div className={cx("flex h-[120px] gap-3 border border-line bg-porcelain p-2", dimmed && "opacity-60")}>
          <div className="relative h-full w-[78px] shrink-0 bg-stone">
            <Image src={p.images[0]} alt="" fill sizes="78px" className="object-cover" />
          </div>
          <div className="flex min-w-0 flex-col justify-between">
            <p className="line-clamp-2 text-[13px] font-medium leading-tight">{p.name}</p>
            <p className="t-caption text-ink-soft">{colour?.name} · {line.size}</p>
            {checkbox || <p className="t-caption text-ink-soft">{!tryable ? "Try-on not available" : "Needs a full-body photo"}</p>}
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className={cx("bg-chalk p-4 transition-opacity", dimmed && "bg-chalk/60")}>
      <div className="flex gap-4">
        <div className={cx("relative h-[112px] w-[84px] shrink-0 bg-stone", dimmed && "opacity-50")}>
          <Image src={p.images[0]} alt="" fill sizes="84px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className={cx("min-w-0", dimmed && "text-ink-soft")}>
              <h3 className="text-[15px] font-medium leading-snug">{p.name}</h3>
              <p className="t-caption mt-1">{formatPrice(p.price)}</p>
            </div>
            {checkbox}
          </div>
          {tryable ? (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <div className="-ml-1.5">
                <Swatches colours={p.colours} value={line.colour} onChange={(c) => onChange({ colour: c })} name={`${p.name} colour`} size={32} />
              </div>
              <label className="sr-only" htmlFor={`${id}-size`}>{p.name} size</label>
              <select
                id={`${id}-size`}
                value={line.size}
                onChange={(e) => onChange({ size: e.target.value })}
                className="h-11 border border-line bg-porcelain px-3 text-[14px] outline-none focus:border-2 focus:border-oxblood"
              >
                {p.sizes.map((s) => (
                  <option key={s} value={s} disabled={p.soldOut?.includes(s)}>
                    {s}{p.soldOut?.includes(s) ? " — sold out" : ""}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="t-caption mt-2 text-ink-soft">{colour?.name} · {line.size} · Try-on not available</p>
          )}
        </div>
      </div>
      {tryable && !fits && (
        <Notice icon="alert" tone="warning" className="mt-3">
          Needs a full-body photo.{" "}
          <button type="button" onClick={onSwitchPhoto} className="link-underline font-medium">
            Switch photo
          </button>
        </Notice>
      )}
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={onRemove}
          className="t-label inline-flex min-h-11 items-center gap-1.5 text-[12px] text-ink-soft hover:text-ink"
          aria-label={`Remove ${p.name} from cart`}
        >
          <Icon name="trash" size={16} /> Remove
        </button>
      </div>
    </li>
  );
}
