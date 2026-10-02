"use client";

import Image from "next/image";
import Link from "next/link";
import { canTryOn, formatPrice, type Product } from "@/lib/catalogue";
import { useMounted, useUI, useWishlist } from "@/lib/store";
import { IconButton, cx } from "./ui";

export function WishlistButton({ product, className }: { product: Product; className?: string }) {
  const mounted = useMounted();
  const on = useWishlist((s) => s.ids.includes(product.id)) && mounted;
  const toggle = useWishlist((s) => s.toggle);
  const toast = useUI((s) => s.toast);
  return (
    <IconButton
      icon="heart"
      label={`Save ${product.name} to wishlist`}
      pressed={on}
      onClick={() => {
        const added = toggle(product.id);
        toast({ message: added ? "Saved to wishlist" : "Removed from wishlist" });
      }}
      className={cx("bg-chalk text-ink hover:text-oxblood", on && "text-oxblood", className)}
    />
  );
}

export function ProductCard({ product, priority, sizes }: { product: Product; priority?: boolean; sizes?: string }) {
  return (
    <article className="group relative">
      <div data-tilt className="relative aspect-[3/4] overflow-hidden bg-stone transition-shadow duration-500 ease-brand group-hover:shadow-[0_24px_50px_-24px_rgba(31,20,22,0.45)]">
        <Image
          src={product.images[0]}
          alt={`${product.name} in ${product.colours[0].name}`}
          fill
          priority={priority}
          sizes={sizes ?? "(min-width: 1024px) 25vw, 50vw"}
          className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.03]"
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt=""
            fill
            sizes={sizes ?? "(min-width: 1024px) 25vw, 50vw"}
            className="hidden object-cover opacity-0 transition-opacity duration-500 ease-brand group-hover:opacity-100 md:block"
          />
        )}
        {canTryOn(product) && (
          <span data-depth className="absolute bottom-3 left-3 bg-blush-soft px-2 py-1 text-[10px] font-medium uppercase leading-tight tracking-[0.14em] md:px-2.5 md:text-[12px]">
            Try-on ready
          </span>
        )}
        <WishlistButton product={product} className="absolute right-3 top-3 z-10" />
      </div>
      <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h3 className="text-[15px] font-medium leading-snug sm:text-[16px]">
          {/* Stretched link: whole card is clickable, heart stays its own control. */}
          <Link href={`/product/${product.id}`} className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-oxblood">
            {product.name}
          </Link>
        </h3>
        <p className="shrink-0 text-[15px] text-ink-soft sm:text-[16px]">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}
