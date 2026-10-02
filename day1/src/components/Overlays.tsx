"use client";

import Image from "next/image";
import Link from "next/link";
import { getProduct, formatPrice } from "@/lib/catalogue";
import { lineKey, useCart, useUI } from "@/lib/store";
import { Icon } from "./Icon";
import { ButtonLink, Dialog, DialogHeader, cx } from "./ui";

/** Mini-cart drawer — opens after "Add to cart" (PRD P-3, DESIGN §6.3). */
export function MiniCart() {
  const { open, key } = useUI((s) => s.miniCart);
  const close = useUI((s) => s.closeMiniCart);
  const line = useCart((s) => s.lines.find((l) => lineKey(l) === key));
  const product = line && getProduct(line.productId);
  const colour = product?.colours.find((c) => c.id === line?.colour);

  return (
    <Dialog open={open} onClose={close} label="Added to cart" variant="drawer">
      <DialogHeader
        title={
          <span className="flex items-center gap-2 text-success">
            <Icon name="check-circle" size={18} /> Added to cart
          </span>
        }
        onClose={close}
      />
      {product && line && (
        <div className="flex flex-1 flex-col overflow-y-auto p-6">
          <div className="flex gap-5">
            <div className="relative h-[160px] w-[120px] shrink-0 bg-stone">
              <Image src={product.images[0]} alt="" fill sizes="120px" className="object-cover" />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="font-medium">{product.name}</p>
              <p className="t-caption text-ink-soft">
                {colour?.name} · Size {line.size} · Qty {line.qty}
              </p>
              <p className="mt-1">{formatPrice(product.price)}</p>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-4 pt-10">
            {product.tryOn.enabled && (
              <p className="flex items-center gap-3 bg-blush-soft px-4 py-3 text-[14px]">
                <Icon name="sparkle" size={16} className="shrink-0 text-oxblood" />
                Try it on from your cart.
              </p>
            )}
            <ButtonLink href="/cart" full onClick={close}>
              View cart
            </ButtonLink>
            <button type="button" onClick={close} className="t-label link-underline mx-auto min-h-11">
              Continue shopping
            </button>
          </div>
        </div>
      )}
    </Dialog>
  );
}

/** Toasts — Ink, bottom-centre, 4s (DESIGN §5). */
export function Toaster() {
  const toasts = useUI((s) => s.toasts);
  const dismiss = useUI((s) => s.dismiss);
  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-0 z-[60]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cx(
            "pointer-events-auto fixed bottom-[calc(24px+env(safe-area-inset-bottom))] left-1/2 flex w-max max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-4 bg-ink px-5 py-3.5 text-[14px] text-porcelain shadow-overlay",
            "[animation:toast-in_320ms_var(--ease)_both] max-md:bottom-[calc(96px+env(safe-area-inset-bottom))]",
          )}
        >
          {t.tone === "success" && <Icon name="check-circle" size={18} className="shrink-0 text-blush" />}
          <span>{t.message}</span>
          {t.action && (
            <button
              type="button"
              className="t-label -my-2 min-h-11 text-blush underline underline-offset-4 on-dark"
              onClick={() => {
                t.action!.onClick();
                dismiss(t.id);
              }}
            >
              {t.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, children, action }: { title: string; children?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center md:py-28">
      <Icon name="bag" size={32} className="text-oxblood" />
      <h1 className="t-h2 mt-6">{title}</h1>
      {children && <div className="mt-4 text-ink-soft">{children}</div>}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}

export function Breadcrumb({ items }: { items: [string, string?][] }) {
  return (
    <nav aria-label="Breadcrumb" className="t-caption text-ink-soft">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map(([label, href], i) => (
          <li key={label} className="flex items-center gap-2">
            {href ? <Link href={href} className="hover:text-ink hover:underline">{label}</Link> : <span aria-current="page" className="text-ink">{label}</span>}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
