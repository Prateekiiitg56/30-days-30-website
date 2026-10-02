"use client";

import Link from "next/link";
import { CartLineItem, OrderSummary, PaymentNote, SavedLookCard, TryOnCard, orderTotals } from "@/components/cart/CartParts";
import { EmptyState } from "@/components/Overlays";
import { ButtonLink } from "@/components/ui";
import { formatPrice } from "@/lib/catalogue";
import { cartCount, lineKey, useCart, useMounted } from "@/lib/store";

export default function CartPage() {
  const mounted = useMounted();
  const lines = useCart((s) => s.lines);

  if (!mounted) return <div className="container-x min-h-[60vh] py-10" aria-busy />;

  if (!lines.length) {
    return (
      <div className="container-x">
        <EmptyState title="Your cart is empty" action={<ButtonLink href="/shop/all">Continue shopping</ButtonLink>}>
          <p className="t-caption">Add clothes to unlock virtual try-on.</p>
        </EmptyState>
      </div>
    );
  }

  const { total } = orderTotals(lines);

  return (
    <div className="container-x pb-32 pt-8 md:pt-12 lg:pb-28">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12">
        <div className="lg:col-span-8">
          <h1 className="t-h1">Your cart ({cartCount(lines)})</h1>
          <ul data-reveal="stagger" className="mt-6 border-t border-line" aria-label="Items in your cart">
            {lines.map((l) => (
              <CartLineItem key={lineKey(l)} line={l} />
            ))}
          </ul>
          <Link href="/shop/all" className="t-label link-underline mt-6 inline-flex min-h-11 items-center">
            Continue shopping
          </Link>
        </div>

        <aside className="lg:col-span-4" aria-label="Try-on and order summary">
          <div data-reveal="stagger" className="flex flex-col gap-4 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
            <TryOnCard lines={lines} />
            <SavedLookCard />
            <OrderSummary lines={lines}>
              <ButtonLink href="/checkout" full className="mt-6 max-lg:hidden">
                Checkout
              </ButtonLink>
              <PaymentNote />
            </OrderSummary>
          </div>
        </aside>
      </div>

      {/* Mobile sticky checkout bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-chalk/95 px-5 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <p className="t-caption text-ink-soft">Total</p>
            <p className="text-[18px] font-medium">{formatPrice(total)}</p>
          </div>
          <ButtonLink href="/checkout" full>
            Checkout
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
