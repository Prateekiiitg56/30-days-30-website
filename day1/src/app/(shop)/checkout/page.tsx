"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { orderTotals, SavedLookCard } from "@/components/cart/CartParts";
import { Icon } from "@/components/Icon";
import { EmptyState } from "@/components/Overlays";
import { Button, ButtonLink, Field, cx } from "@/components/ui";
import { formatPrice, getProduct } from "@/lib/catalogue";
import { lineKey, useCart, useMounted } from "@/lib/store";

const DELIVERY = [
  { id: "standard", label: "Standard", note: "3–5 working days", price: 0 },
  { id: "express", label: "Express", note: "Next working day", price: 299 },
];
const PAYMENT = [
  { id: "upi", label: "UPI" },
  { id: "card", label: "Card" },
  { id: "cod", label: "Cash on delivery" },
];

type Form = Record<"email" | "phone" | "name" | "address" | "city" | "pin", string>;
const empty: Form = { email: "", phone: "", name: "", address: "", city: "", pin: "" };

function validate(f: Form) {
  const e: Partial<Form> = {};
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address.";
  if (!/^[6-9]\d{9}$/.test(f.phone.replace(/\D/g, "").slice(-10))) e.phone = "Enter a 10-digit mobile number.";
  if (f.name.trim().length < 2) e.name = "Enter your full name.";
  if (f.address.trim().length < 6) e.address = "Enter your street address.";
  if (!f.city.trim()) e.city = "Enter your city.";
  if (!/^\d{6}$/.test(f.pin)) e.pin = "Enter a 6-digit PIN code.";
  return e;
}

export default function CheckoutPage() {
  const mounted = useMounted();
  const router = useRouter();
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Partial<Form>>({});
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("upi");
  const [submitting, setSubmitting] = useState(false);

  if (!mounted) return <div className="container-x min-h-[60vh]" aria-busy />;
  if (!lines.length) {
    return (
      <div className="container-x">
        <EmptyState title="Your cart is empty" action={<ButtonLink href="/shop/all">Continue shopping</ButtonLink>} />
      </div>
    );
  }

  const totals = orderTotals(lines);
  const deliveryFee = (DELIVERY.find((d) => d.id === delivery)?.price ?? 0) + totals.delivery;
  const total = totals.subtotal + deliveryFee;

  const bind = (k: keyof Form) => ({
    value: form[k],
    error: errors[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
      if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSubmitting(true);
    const order = `ORV-${Date.now().toString(36).slice(-6).toUpperCase()}`;
    setTimeout(() => {
      clear();
      router.push(`/checkout/confirmation?order=${order}&email=${encodeURIComponent(form.email)}`);
    }, 600);
  };

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <div className="container-x pb-20 pt-8 md:pb-28 md:pt-12">
      <h1 className="t-h1">Checkout</h1>
      <p className="t-caption mt-2 flex items-center gap-1.5 text-ink-soft">
        <Icon name="lock" size={14} /> Demo checkout — no payment is taken.
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-12">
        <form onSubmit={submit} noValidate className="flex flex-col gap-12 lg:col-span-7">
          {errorCount > 0 && (
            <p role="alert" className="flex items-center gap-2 border-l-2 border-error bg-chalk px-4 py-3 text-[14px] text-error">
              <Icon name="alert" size={16} /> Check the {errorCount} highlighted {errorCount === 1 ? "field" : "fields"}.
            </p>
          )}
          <fieldset className="flex flex-col gap-5">
            <legend className="t-label mb-5 text-[13px]">1 · Contact</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Email" name="email" type="email" autoComplete="email" {...bind("email")} />
              <Field label="Mobile" name="phone" type="tel" autoComplete="tel" inputMode="tel" {...bind("phone")} />
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-5">
            <legend className="t-label mb-5 text-[13px]">2 · Address</legend>
            <Field label="Full name" name="name" autoComplete="name" {...bind("name")} />
            <Field label="Street address" name="address" autoComplete="street-address" {...bind("address")} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="City" name="city" autoComplete="address-level2" {...bind("city")} />
              <Field label="PIN code" name="pin" inputMode="numeric" autoComplete="postal-code" maxLength={6} {...bind("pin")} />
            </div>
          </fieldset>

          <fieldset>
            <legend className="t-label mb-5 text-[13px]">3 · Delivery</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {DELIVERY.map((d) => (
                <OptionCard key={d.id} name="delivery" checked={delivery === d.id} onChange={() => setDelivery(d.id)}>
                  <span className="font-medium">{d.label}</span>
                  <span className="t-caption text-ink-soft">{d.note}</span>
                  <span className="t-caption">{d.price ? formatPrice(d.price) : "Included"}</span>
                </OptionCard>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="t-label mb-5 text-[13px]">4 · Payment</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {PAYMENT.map((p) => (
                <OptionCard key={p.id} name="payment" checked={payment === p.id} onChange={() => setPayment(p.id)}>
                  <span className="font-medium">{p.label}</span>
                </OptionCard>
              ))}
            </div>
            <p className="t-caption mt-3 text-ink-soft">This is a demo. You won&rsquo;t be asked for payment details.</p>
          </fieldset>

          <Button type="submit" full disabled={submitting}>
            {submitting ? "Placing order…" : `Place order · ${formatPrice(total)}`}
          </Button>
        </form>

        <aside className="lg:col-span-5" aria-labelledby="checkout-summary">
          <div className="flex flex-col gap-4 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
            <section className="bg-chalk p-7">
              <h2 id="checkout-summary" className="t-label text-[13px]">Your order</h2>
              <ul className="mt-5 flex flex-col gap-4">
                {lines.map((l) => {
                  const p = getProduct(l.productId)!;
                  return (
                    <li key={lineKey(l)} className="flex gap-4">
                      <div className="relative h-20 w-[60px] shrink-0 bg-stone">
                        <Image src={p.images[0]} alt="" fill sizes="60px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-medium leading-snug">{p.name}</p>
                        <p className="t-caption text-ink-soft">
                          {p.colours.find((c) => c.id === l.colour)?.name} · {l.size} · Qty {l.qty}
                        </p>
                      </div>
                      <p className="text-[15px]">{formatPrice(p.price * l.qty)}</p>
                    </li>
                  );
                })}
              </ul>
              <dl className="mt-6 flex flex-col gap-2 border-t border-line pt-5 text-[15px]">
                <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-soft">Delivery</dt><dd>{deliveryFee ? formatPrice(deliveryFee) : "Free"}</dd></div>
                <div className="mt-2 flex justify-between border-t border-line pt-4 text-[18px] font-medium"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
              </dl>
            </section>
            <SavedLookCard compact />
          </div>
        </aside>
      </div>
    </div>
  );
}

function OptionCard({ name, checked, onChange, children }: { name: string; checked: boolean; onChange: () => void; children: React.ReactNode }) {
  return (
    <label
      className={cx(
        "flex cursor-pointer items-start gap-3 border bg-chalk p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-oxblood",
        checked ? "border-2 border-ink p-[15px]" : "border-line hover:border-ink",
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="mt-1 size-4 accent-oxblood focus-visible:outline-none" />
      <span className="flex flex-col gap-0.5">{children}</span>
    </label>
  );
}
