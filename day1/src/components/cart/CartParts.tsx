"use client";

import Image from "next/image";
import Link from "next/link";
import { canTryOn, DELIVERY_FEE, formatPrice, FREE_DELIVERY_THRESHOLD, getProduct } from "@/lib/catalogue";
import { cartSubtotal, lineKey, useCart, useLooks, useUI, type CartLine } from "@/lib/store";
import { tryableLines, visibleLayers } from "@/lib/tryon";
import { LookPreview } from "../closet/LookPreview";
import { Icon } from "../Icon";
import { ButtonLink, Eyebrow, QtyStepper, cx } from "../ui";

export function useRemoveWithUndo() {
  const remove = useCart((s) => s.remove);
  const restore = useCart((s) => s.restore);
  const toast = useUI((s) => s.toast);
  return (key: string) => {
    const removed = remove(key);
    if (removed) toast({ message: "Removed from cart", action: { label: "Undo", onClick: () => restore(removed.line, removed.index) } });
  };
}

export const orderTotals = (lines: CartLine[]) => {
  const subtotal = cartSubtotal(lines);
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  return { subtotal, delivery, total: subtotal + delivery };
};

export function CartLineItem({ line }: { line: CartLine }) {
  const product = getProduct(line.productId);
  const setQty = useCart((s) => s.setQty);
  const removeLine = useRemoveWithUndo();
  if (!product) return null;
  const key = lineKey(line);
  const colour = product.colours.find((c) => c.id === line.colour);

  return (
    <li className="flex gap-4 border-b border-line py-6 sm:gap-6">
      <Link href={`/product/${product.id}`} className="relative h-[160px] w-[120px] shrink-0 overflow-hidden bg-stone" tabIndex={-1} aria-hidden>
        <Image src={product.images[0]} alt="" fill sizes="120px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-medium leading-snug">
              <Link href={`/product/${product.id}`} className="hover:text-oxblood">{product.name}</Link>
            </h3>
            <p className="t-caption mt-1.5 text-ink-soft">
              {colour?.name} · {product.sizes.length > 1 ? `Size ${line.size}` : line.size}
            </p>
          </div>
          <p className="shrink-0 font-medium">{formatPrice(product.price * line.qty)}</p>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-3 pt-4">
          <QtyStepper value={line.qty} onChange={(n) => setQty(key, n)} label={product.name} />
          <div className="flex items-center gap-4">
            {canTryOn(product) ? (
              <Link href={`/closet?item=${encodeURIComponent(key)}`} className="t-label link-underline inline-flex min-h-11 items-center text-[12px] text-oxblood">
                Try on
              </Link>
            ) : (
              <span className="t-caption text-ink-soft">Try-on not available</span>
            )}
            <button
              type="button"
              onClick={() => removeLine(key)}
              className="t-label inline-flex min-h-11 items-center gap-1.5 text-[12px] text-ink-soft hover:text-ink"
              aria-label={`Remove ${product.name} from cart`}
            >
              <Icon name="trash" size={16} />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

/** Virtual Try-On card (PRD C-3, DESIGN §5). */
export function TryOnCard({ lines }: { lines: CartLine[] }) {
  const enabled = tryableLines(lines).length > 0;
  return (
    <section aria-labelledby="tryon-title" className="on-dark bg-oxblood p-7 text-on-brand md:p-8">
      <Eyebrow className="!text-[12px] text-blush">Virtual Closet</Eyebrow>
      <h2 id="tryon-title" className="t-h3 mt-2">See it on you</h2>
      <p className="mt-3 text-[15px] text-on-brand/90">Upload a photo and try everything in your cart before you buy.</p>
      <ButtonLink
        href="/closet"
        variant="blush"
        full
        className={cx("mt-6", !enabled && "pointer-events-none opacity-40")}
        aria-disabled={!enabled}
        tabIndex={enabled ? undefined : -1}
        icon="sparkle"
      >
        Try on in Virtual Closet
      </ButtonLink>
      {!enabled && <p className="t-caption mt-3 text-on-brand">Try-on is available for clothing.</p>}
      <p className="t-caption mt-4 flex items-center gap-2 text-on-brand/85">
        <Icon name="lock" size={14} /> Your photo stays private.
      </p>
    </section>
  );
}

export function OrderSummary({ lines, children }: { lines: CartLine[]; children?: React.ReactNode }) {
  const { subtotal, delivery, total } = orderTotals(lines);
  const toFree = FREE_DELIVERY_THRESHOLD - subtotal;
  return (
    <section aria-labelledby="summary-title" className="bg-chalk p-7 md:p-8">
      <h2 id="summary-title" className="t-label text-[13px]">Order summary</h2>
      <dl className="mt-6 flex flex-col gap-3 text-[15px]">
        <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
        <div className="flex justify-between"><dt className="text-ink-soft">Delivery</dt><dd>{delivery ? formatPrice(delivery) : "Free"}</dd></div>
        {toFree > 0 && subtotal > 0 && (
          <p className="t-caption text-ink-soft">Add {formatPrice(toFree)} more for free delivery.</p>
        )}
        <div className="mt-2 flex justify-between border-t border-line pt-4 text-[18px] font-medium"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
      </dl>
      {children}
    </section>
  );
}

/** "Your saved look" thumbnail that reopens the Closet (PRD C-7). */
export function SavedLookCard({ compact }: { compact?: boolean }) {
  const look = useLooks((s) => s.looks[0]);
  const removeLook = useLooks((s) => s.remove);
  if (!look) return null;
  const lines = look.items.map((i) => ({ ...i, qty: 1 }));
  const layers = visibleLayers(lines, lines.map(lineKey), look.mode);
  return (
    <section aria-labelledby="look-title" className={cx("flex gap-4 bg-chalk", compact ? "p-4" : "p-5")}>
      <LookPreview photo={look.photo} mode={look.mode} layers={layers} alt="Your saved look" className="w-[72px] shrink-0" />
      <div className="flex min-w-0 flex-col justify-center gap-1">
        <h2 id="look-title" className="t-label text-[12px]">Your saved look</h2>
        <p className="t-caption text-ink-soft">{layers.length} {layers.length === 1 ? "piece" : "pieces"}</p>
        {!compact && (
          <div className="flex gap-4">
            <Link href="/closet" className="t-label link-underline inline-flex min-h-11 items-center text-[12px]">Open in Closet</Link>
            <button type="button" onClick={() => removeLook(look.id)} className="t-label inline-flex min-h-11 items-center text-[12px] text-ink-soft hover:text-ink">
              Delete
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export function PaymentNote() {
  return (
    <div className="mt-5 flex flex-col items-center gap-3">
      <ul className="flex gap-2" aria-label="Accepted payments">
        {["UPI", "VISA", "MC", "RuPay"].map((p) => (
          <li key={p} className="border border-line bg-porcelain px-2 py-1 text-[11px] font-semibold tracking-[0.08em] text-ink-soft">{p}</li>
        ))}
      </ul>
      <p className="t-caption flex items-center gap-1.5 text-ink-soft"><Icon name="lock" size={14} /> Secure checkout</p>
    </div>
  );
}
