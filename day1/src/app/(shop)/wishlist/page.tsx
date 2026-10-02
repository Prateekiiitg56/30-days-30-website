"use client";

import { EmptyState } from "@/components/Overlays";
import { ProductCard } from "@/components/ProductCard";
import { ButtonLink } from "@/components/ui";
import { getProduct, type Product } from "@/lib/catalogue";
import { useMounted, useWishlist } from "@/lib/store";

export default function WishlistPage() {
  const mounted = useMounted();
  const ids = useWishlist((s) => s.ids);
  const items = ids.map(getProduct).filter(Boolean) as Product[];

  if (!mounted) return <div className="container-x min-h-[60vh]" aria-busy />;
  if (!items.length) {
    return (
      <div className="container-x">
        <EmptyState title="Your wishlist is empty" action={<ButtonLink href="/shop/all">Discover new in</ButtonLink>}>
          Tap the heart on any piece to keep it here.
        </EmptyState>
      </div>
    );
  }
  return (
    <div className="container-x pb-20 pt-10 md:pb-28 md:pt-12">
      <h1 className="t-h1">Wishlist ({items.length})</h1>
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
