"use client";

import Image from "next/image";
import { useState } from "react";
import { canTryOn, formatPrice, FREE_DELIVERY_THRESHOLD, type Product } from "@/lib/catalogue";
import { lineKey, useCart, useUI } from "@/lib/store";
import { Icon } from "./Icon";
import { WishlistButton } from "./ProductCard";
import { Button, Dialog, DialogHeader, SizePills, Swatches, cx } from "./ui";

export function ProductDetail({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const [colour, setColour] = useState(product.colours[0].id);
  const oneSize = product.sizes.length === 1;
  const [size, setSize] = useState<string | null>(oneSize ? product.sizes[0] : null);
  const [error, setError] = useState(false);
  const [guide, setGuide] = useState(false);
  const add = useCart((s) => s.add);
  const openMiniCart = useUI((s) => s.openMiniCart);
  const colourName = product.colours.find((c) => c.id === colour)!.name;

  const onAdd = () => {
    if (!size) {
      setError(true);
      document.getElementById("size-label")?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    add({ productId: product.id, colour, size });
    openMiniCart(lineKey({ productId: product.id, colour, size }));
  };

  return (
    <div className="mt-6 grid gap-10 md:mt-8 md:grid-cols-12 md:gap-8 xl:gap-16">
      {/* Gallery */}
      <div data-reveal className="md:col-span-7 md:grid md:grid-cols-[88px_1fr] md:gap-4 lg:gap-6">
        <div className="relative order-2 aspect-[3/4] overflow-hidden bg-stone md:order-none md:col-start-2">
          {product.images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={i === 0 ? `${product.name}, front view` : `${product.name}, detail`}
              fill
              priority={i === 0}
              sizes="(min-width: 768px) 55vw, 100vw"
              className={cx("object-cover transition-opacity duration-300 ease-brand", i === active ? "opacity-100" : "opacity-0")}
            />
          ))}
          {canTryOn(product) && (
            <span className="t-caption absolute bottom-4 left-4 bg-blush-soft px-2.5 py-1 font-medium uppercase tracking-[0.14em]">
              Try-on ready
            </span>
          )}
        </div>
        <ul className="mt-3 flex gap-3 md:col-start-1 md:row-start-1 md:mt-0 md:flex-col" aria-label="Product images">
          {product.images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1} of ${product.images.length}`}
                aria-current={i === active}
                className={cx(
                  "relative block aspect-[3/4] w-[72px] overflow-hidden bg-stone md:w-full",
                  "after:absolute after:inset-0 after:border-2 after:transition-colors",
                  i === active ? "after:border-ink" : "after:border-transparent hover:after:border-line",
                )}
              >
                <Image src={src} alt="" fill sizes="88px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Details */}
      <div className="md:col-span-5">
        <div data-reveal="stagger" className="md:sticky md:top-[calc(var(--header-h)+32px)]">
          <p className="t-label text-[12px] text-ink-soft">{product.type}</p>
          <h1 className="t-h1 mt-3 !text-[clamp(28px,2.6vw,40px)]">{product.name}</h1>
          <p className="t-body-l mt-3 text-ink-soft">{formatPrice(product.price)}</p>

          <div className="mt-8 border-t border-line pt-6">
            <p className="t-label text-[12px]">
              Colour <span className="ml-2 font-normal normal-case tracking-normal text-ink-soft">{colourName}</span>
            </p>
            <div className="mt-3 -ml-1">
              <Swatches colours={product.colours} value={colour} onChange={setColour} name="Colour" />
            </div>
          </div>

          {!oneSize && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p id="size-label" className="t-label text-[12px]">Size</p>
                <button type="button" onClick={() => setGuide(true)} className="t-label link-underline min-h-11 text-[12px]">
                  Size guide
                </button>
              </div>
              <div className="mt-2">
                <SizePills
                  sizes={product.sizes}
                  soldOut={product.soldOut}
                  value={size}
                  invalid={error}
                  describedBy={error ? "size-error" : undefined}
                  onChange={(s) => {
                    setSize(s);
                    setError(false);
                  }}
                />
              </div>
              {error && (
                <p id="size-error" role="alert" className="t-caption mt-3 flex items-center gap-1.5 text-error">
                  <Icon name="alert" size={14} /> Select a size to add this to your cart.
                </p>
              )}
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <Button full onClick={onAdd} aria-describedby={!size ? "add-hint" : undefined}>
              Add to cart
            </Button>
            <WishlistButton product={product} className="!size-[54px] !rounded-none border border-ink bg-transparent" />
          </div>
          {!size && (
            <p id="add-hint" className="t-caption mt-2 text-ink-soft">
              Choose a size first.
            </p>
          )}

          {canTryOn(product) ? (
            <p className="mt-4 flex items-start gap-3 bg-blush-soft px-4 py-3 text-[14px]">
              <Icon name="sparkle" size={16} className="mt-0.5 shrink-0 text-oxblood" />
              Add to cart to try it on in the Virtual Closet.
            </p>
          ) : (
            <p className="t-caption mt-4 text-ink-soft">Try-on is available for adult clothing.</p>
          )}

          <div className="mt-8 border-t border-line">
            {[
              ["Details", product.description],
              ["Fabric & care", product.fabric],
              ["Delivery & returns", `Free delivery on orders above ${formatPrice(FREE_DELIVERY_THRESHOLD)}. Free returns within 30 days.`],
            ].map(([title, body], i) => (
              <details key={title} className="group border-b border-line" open={i === 0}>
                <summary className="t-label flex min-h-14 cursor-pointer list-none items-center justify-between text-[13px] [&::-webkit-details-marker]:hidden">
                  {title}
                  <Icon name="plus" size={16} className="transition-transform duration-200 group-open:rotate-45" />
                </summary>
                <p className="pb-5 text-ink-soft">{body}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={guide} onClose={() => setGuide(false)} label="Size guide">
        <DialogHeader title="Size guide" onClose={() => setGuide(false)} />
        <div className="overflow-auto p-6">
          <p className="t-caption mb-4 text-ink-soft">Body measurements in centimetres.</p>
          <table className="w-full text-left text-[14px]">
            <caption className="sr-only">Adult sizes</caption>
            <thead>
              <tr className="t-label border-b border-ink text-[11px]">
                {["Size", "Chest", "Waist", "Hip"].map((h) => (
                  <th key={h} scope="col" className="py-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["XS", "80–84", "62–66", "86–90"],
                ["S", "85–89", "67–71", "91–95"],
                ["M", "90–95", "72–77", "96–101"],
                ["L", "96–102", "78–84", "102–108"],
                ["XL", "103–110", "85–92", "109–116"],
              ].map((r) => (
                <tr key={r[0]} className="border-b border-line">
                  {r.map((c, i) => (i === 0 ? <th key={i} scope="row" className="py-3 pr-4 font-medium">{c}</th> : <td key={i} className="py-3 pr-4 text-ink-soft">{c}</td>))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="t-caption mt-4 text-ink-soft">Kids sizes follow age: 4Y fits 98–104 cm height, 12Y fits 146–152 cm.</p>
        </div>
      </Dialog>
    </div>
  );
}
