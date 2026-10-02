"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { categories, products, type Product } from "@/lib/catalogue";
import { Icon } from "./Icon";
import { EmptyState } from "./Overlays";
import { ProductCard } from "./ProductCard";
import { Button, Dialog, DialogHeader, cx } from "./ui";

const PRICES = [
  { id: "u3", label: "Under ₹3,000", test: (p: number) => p < 3000 },
  { id: "3-7", label: "₹3,000 – ₹7,000", test: (p: number) => p >= 3000 && p <= 7000 },
  { id: "o7", label: "Over ₹7,000", test: (p: number) => p > 7000 },
];
const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "new", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
];

export function Listing(props: { category: string }) {
  return (
    <Suspense>
      <ListingInner {...props} />
    </Suspense>
  );
}

function ListingInner({ category }: { category: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [sheet, setSheet] = useState(false);

  const q = params.get("q")?.toLowerCase() ?? "";
  const sort = params.get("sort") ?? "featured";
  const sizes = params.getAll("size");
  const colours = params.getAll("colour");
  const price = params.get("price");
  const cats = params.getAll("cat");

  const base = useMemo(() => (category === "all" ? products : products.filter((p) => p.category === category)), [category]);

  const set = (key: string, value: string | null, multi = false) => {
    const next = new URLSearchParams(params);
    if (multi && value) {
      const all = next.getAll(key);
      next.delete(key);
      (all.includes(value) ? all.filter((v) => v !== value) : [...all, value]).forEach((v) => next.append(key, v));
    } else if (value && next.get(key) !== value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  const results = useMemo(() => {
    let list = base.filter(
      (p) =>
        (!q || `${p.name} ${p.type} ${p.category} ${p.colours.map((c) => c.name).join(" ")}`.toLowerCase().includes(q)) &&
        (!cats.length || cats.includes(p.category)) &&
        (!sizes.length || p.sizes.some((s) => sizes.includes(s))) &&
        (!colours.length || p.colours.some((c) => colours.includes(c.id))) &&
        (!price || PRICES.find((r) => r.id === price)?.test(p.price)),
    );
    if (sort === "new") list = [...list].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [base, q, cats, sizes, colours, price, sort]);

  const allSizes = [...new Set(base.flatMap((p) => p.sizes))];
  const allColours = [...new Map(base.flatMap((p) => p.colours).map((c) => [c.id, c])).values()];
  const activeCount = sizes.length + colours.length + cats.length + (price ? 1 : 0);

  const filters = (bar: boolean) => (
    <FilterGroups
      bar={bar}
      showCats={category === "all"}
      cats={cats}
      sizes={allSizes}
      activeSizes={sizes}
      colours={allColours}
      activeColours={colours}
      price={price}
      onToggle={set}
    />
  );

  return (
    <>
      {q && (
        <p className="mt-3 text-ink-soft">
          Results for <span className="text-ink">&ldquo;{params.get("q")}&rdquo;</span>
        </p>
      )}

      {/* Filter bar — sticky row on desktop, sheet on mobile */}
      <div className="sticky top-[var(--header-h)] z-30 -mx-5 mt-8 border-y border-line bg-porcelain/95 px-5 backdrop-blur-sm md:-mx-10 md:px-10 xl:mx-0 xl:px-0">
        <div className="flex min-h-16 items-center justify-between gap-4">
          <div className="hidden items-center gap-2 lg:flex">{filters(true)}</div>
          <Button variant="secondary" size="sm" icon="filter" onClick={() => setSheet(true)} className="lg:hidden">
            Filter{activeCount ? ` (${activeCount})` : ""}
          </Button>
          <div className="flex items-center gap-4">
            <p className="t-caption hidden text-ink-soft sm:block" aria-live="polite">
              {results.length} {results.length === 1 ? "item" : "items"}
            </p>
            <label className="sr-only" htmlFor="sort">Sort by</label>
            <div className="relative">
              <select
                id="sort"
                value={sort}
                onChange={(e) => set("sort", e.target.value === "featured" ? null : e.target.value)}
                className="t-label h-11 appearance-none border border-line bg-chalk pl-4 pr-10 text-[12px] outline-none focus:border-oxblood"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
              <Icon name="chevron" size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </div>

      {results.length ? (
        <div data-reveal="stagger" className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
          {results.map((p: Product, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nothing matches"
          action={
            <Button variant="secondary" onClick={() => router.replace(pathname, { scroll: false })}>
              Clear filters
            </Button>
          }
        >
          Try removing a filter or searching for something else.
        </EmptyState>
      )}

      <Dialog open={sheet} onClose={() => setSheet(false)} label="Filters" variant="sheet">
        <DialogHeader title="Filter" onClose={() => setSheet(false)} />
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-8">{filters(false)}</div>
        </div>
        <div className="flex gap-3 border-t border-line p-4">
          <Button variant="secondary" full onClick={() => router.replace(pathname, { scroll: false })}>Clear</Button>
          <Button full onClick={() => setSheet(false)}>Show {results.length}</Button>
        </div>
      </Dialog>
    </>
  );
}

function Chip({ active, onClick, children, label }: { active: boolean; onClick: () => void; children: React.ReactNode; label?: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      onClick={onClick}
      className={cx(
        "inline-flex h-11 items-center gap-2 border px-3.5 text-[13px] font-medium tracking-[0.06em] transition-colors duration-200",
        active ? "border-ink bg-ink text-porcelain" : "border-line bg-chalk hover:border-ink",
      )}
    >
      {children}
    </button>
  );
}

function FilterGroups({
  bar,
  showCats,
  cats,
  sizes,
  activeSizes,
  colours,
  activeColours,
  price,
  onToggle,
}: {
  bar: boolean;
  showCats: boolean;
  cats: string[];
  sizes: string[];
  activeSizes: string[];
  colours: { id: string; name: string; hex: string }[];
  activeColours: string[];
  price: string | null;
  onToggle: (key: string, value: string | null, multi?: boolean) => void;
}) {
  const group = (title: string, active: number, children: React.ReactNode) =>
    bar ? (
      <FilterPopover title={title} active={active}>
        {children}
      </FilterPopover>
    ) : (
      <fieldset>
        <legend className="t-label mb-3 text-[12px]">{title}</legend>
        <div className="flex flex-wrap gap-2">{children}</div>
      </fieldset>
    );
  return (
    <>
      {showCats &&
        group(
          "Category",
          cats.length,
          categories.map((c) => (
            <Chip key={c.id} active={cats.includes(c.id)} onClick={() => onToggle("cat", c.id, true)}>
              {c.name}
            </Chip>
          )),
        )}
      {group(
        "Size",
        activeSizes.length,
        sizes.map((s) => (
          <Chip key={s} active={activeSizes.includes(s)} onClick={() => onToggle("size", s, true)} label={`Size ${s}`}>
            {s}
          </Chip>
        )),
      )}
      {group(
        "Colour",
        activeColours.length,
        colours.map((c) => (
          <Chip key={c.id} active={activeColours.includes(c.id)} onClick={() => onToggle("colour", c.id, true)}>
            <span aria-hidden className="size-4 rounded-full border border-ink/15" style={{ background: c.hex }} />
            {c.name}
          </Chip>
        )),
      )}
      {group(
        "Price",
        price ? 1 : 0,
        PRICES.map((r) => (
          <Chip key={r.id} active={price === r.id} onClick={() => onToggle("price", r.id)}>
            {r.label}
          </Chip>
        )),
      )}
    </>
  );
}

/** Desktop filter: a disclosure button with a floating panel. Closes on outside click and Esc. */
function FilterPopover({ title, active, children }: { title: string; active: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (ref.current?.open && !ref.current.contains(e.target as Node)) ref.current.open = false;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && ref.current?.open) {
        ref.current.open = false;
        ref.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  return (
    <details ref={ref} className="group relative">
      <summary
        className={cx(
          "t-label flex h-11 cursor-pointer list-none items-center gap-2 border px-4 text-[12px] transition-colors [&::-webkit-details-marker]:hidden",
          active ? "border-ink" : "border-transparent hover:border-line",
        )}
      >
        {title}
        {active > 0 && <span className="inline-flex size-5 items-center justify-center bg-oxblood text-[11px] tracking-normal text-on-brand">{active}</span>}
        <Icon name="chevron" size={14} className="transition-transform group-open:rotate-180" />
      </summary>
      <div className="absolute left-0 top-[calc(100%+8px)] z-40 flex w-max max-w-[480px] flex-wrap gap-2 bg-chalk p-4 shadow-overlay">
        {children}
      </div>
    </details>
  );
}
