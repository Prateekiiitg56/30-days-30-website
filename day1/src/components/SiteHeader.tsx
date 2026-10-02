"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { categories, formatPrice, FREE_DELIVERY_THRESHOLD } from "@/lib/catalogue";
import { cartCount, useCart, useMounted, useUI } from "@/lib/store";
import { Icon } from "./Icon";
import { Button, Dialog, DialogHeader, IconButton, cx } from "./ui";

export function AnnouncementBar() {
  return (
    <div className="on-dark bg-oxblood text-on-brand">
      <div className="container-x flex h-[var(--bar-h)] items-center justify-center md:justify-between">
        <p className="t-label text-[11px] md:text-[12px]">
          Free delivery on orders above {formatPrice(FREE_DELIVERY_THRESHOLD)}
        </p>
        <ul className="t-label hidden items-center gap-8 text-[12px] md:flex">
          <li><Link href="/help#app" className="hover:text-blush">Download app</Link></li>
          <li><Link href="/help#track" className="hover:text-blush">Track order</Link></li>
          <li><Link href="/help" className="hover:text-blush">Help</Link></li>
        </ul>
      </div>
    </div>
  );
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cx(
        "t-label relative inline-flex min-h-11 items-center",
        "after:absolute after:inset-x-0 after:bottom-2 after:h-0.5 after:origin-left after:bg-oxblood after:transition-transform after:duration-200 after:ease-brand",
        active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
      )}
    >
      {children}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useMounted();
  const count = cartCount(useCart((s) => s.lines));
  const toast = useUI((s) => s.toast);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => setMenu(false), [pathname]);

  const cartLabel = mounted ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart";
  const login = () => toast({ message: "Accounts are coming soon — checkout works as a guest." });

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/70 bg-porcelain/95 backdrop-blur-sm supports-[backdrop-filter]:bg-porcelain/85">
        <div className="container-x grid h-[var(--header-h)] grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Left: category nav (desktop) / menu (mobile) */}
          <nav aria-label="Categories" className="hidden gap-7 lg:flex xl:gap-9">
            {categories.map((c) => (
              <NavLink key={c.id} href={`/shop/${c.id}`} active={pathname === `/shop/${c.id}`}>
                {c.name}
              </NavLink>
            ))}
          </nav>
          <div className="flex lg:hidden">
            <IconButton icon="menu" label="Open menu" onClick={() => setMenu(true)} className="-ml-2.5 hover:bg-linen" />
            <IconButton icon="search" label="Search" onClick={() => setSearch(true)} className="hover:bg-linen md:hidden" />
          </div>

          <Link href="/" className="t-logo justify-self-center" aria-label="ORVAN home">
            ORVAN
          </Link>

          {/* Right: utilities */}
          <div className="flex items-center justify-end gap-1 lg:gap-6">
            <button type="button" onClick={() => setSearch(true)} className="t-label hidden min-h-11 items-center gap-2 hover:text-oxblood md:inline-flex">
              <Icon name="search" size={18} />
              <span className="hidden xl:inline">Search</span>
              <span className="sr-only xl:hidden">Search</span>
            </button>
            <button type="button" onClick={login} className="t-label hidden min-h-11 items-center gap-2 hover:text-oxblood lg:inline-flex">
              <Icon name="user" size={18} />
              <span className="hidden xl:inline">Login</span>
              <span className="sr-only xl:hidden">Login</span>
            </button>
            <Link href="/wishlist" className="t-label hidden min-h-11 items-center gap-2 hover:text-oxblood md:inline-flex">
              <Icon name="heart" size={18} />
              <span className="hidden xl:inline">Wishlist</span>
              <span className="sr-only xl:hidden">Wishlist</span>
            </Link>
            <Link
              href="/cart"
              aria-label={cartLabel}
              aria-current={pathname === "/cart" ? "page" : undefined}
              className="t-label -mr-2.5 inline-flex min-h-11 min-w-11 items-center justify-center gap-2 hover:text-oxblood lg:mr-0"
            >
              <Icon name="bag" size={20} />
              <span className="hidden xl:inline">Cart</span>
              <span
                aria-hidden
                className={cx(
                  "inline-flex h-5 min-w-5 items-center justify-center px-1 text-[11px] tracking-normal transition-colors",
                  mounted && count > 0 ? "bg-oxblood text-on-brand" : "bg-linen text-ink",
                )}
              >
                {mounted ? count : 0}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <Dialog open={menu} onClose={() => setMenu(false)} label="Menu" variant="drawer" className="!mr-auto !ml-0">
        <DialogHeader title="Menu" onClose={() => setMenu(false)} />
        <nav aria-label="Mobile" className="flex flex-1 flex-col overflow-y-auto px-6 py-4">
          <ul className="flex flex-col">
            {categories.map((c) => (
              <li key={c.id} className="border-b border-line">
                <Link href={`/shop/${c.id}`} className="t-h3 flex min-h-16 items-center justify-between">
                  {c.name}
                  <Icon name="arrow-right" size={20} />
                </Link>
              </li>
            ))}
          </ul>
          <ul className="t-label mt-8 flex flex-col gap-2">
            <li><Link href="/shop/all" className="flex min-h-11 items-center">New in</Link></li>
            <li><Link href="/wishlist" className="flex min-h-11 items-center gap-3"><Icon name="heart" size={18} />Wishlist</Link></li>
            <li><button type="button" onClick={login} className="t-label flex min-h-11 items-center gap-3"><Icon name="user" size={18} />Login</button></li>
            <li><Link href="/help" className="flex min-h-11 items-center">Help</Link></li>
          </ul>
        </nav>
      </Dialog>

      {/* Search */}
      <Dialog open={search} onClose={() => setSearch(false)} label="Search" variant="modal">
        <DialogHeader title="Search ORVAN" onClose={() => setSearch(false)} />
        <form
          role="search"
          className="flex flex-col gap-4 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(false);
            router.push(`/shop/all${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
          }}
        >
          <label htmlFor="site-search" className="sr-only">Search products</label>
          <div className="flex gap-2">
            <input
              id="site-search"
              type="search"
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Coats, satin, merino…"
              className="h-[54px] min-w-0 flex-1 border border-line bg-chalk px-4 text-[16px] outline-none focus:border-2 focus:border-oxblood"
            />
            <Button type="submit" className="!px-6">Search</Button>
          </div>
          <p className="t-caption text-ink-soft">Popular: <Link className="link-underline text-ink" href="/shop/all?q=coat" onClick={() => setSearch(false)}>coat</Link>, <Link className="link-underline text-ink" href="/shop/all?q=satin" onClick={() => setSearch(false)}>satin</Link>, <Link className="link-underline text-ink" href="/shop/all?q=merino" onClick={() => setSearch(false)}>merino</Link></p>
        </form>
      </Dialog>
    </>
  );
}
