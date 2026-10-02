"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icon";
import { Button } from "./ui";

const columns = [
  { title: "Shop", links: [["Men", "/shop/men"], ["Women", "/shop/women"], ["Kids", "/shop/kids"], ["Beauty", "/shop/beauty"], ["New in", "/shop/all"]] },
  { title: "Help", links: [["Track order", "/help#track"], ["Delivery & returns", "/help#returns"], ["Size guide", "/help#sizes"], ["Contact", "/help#contact"]] },
  { title: "Virtual Closet", links: [["How it works", "/help#closet"], ["Photo privacy", "/help#privacy"], ["Your cart", "/cart"]] },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  return (
    <footer className="on-dark bg-ink text-porcelain">
      <div className="container-x grid gap-12 py-16 md:py-20 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-5">
          <p className="t-logo">ORVAN</p>
          <p className="t-body-l mt-6 max-w-sm text-porcelain/80">Fashion that moves with you. Try it on before it ships.</p>

          <form
            className="mt-10 max-w-md"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              setState(/^\S+@\S+\.\S+$/.test(email) ? "done" : "error");
            }}
          >
            <label htmlFor="newsletter" className="t-label text-[12px]">Newsletter</label>
            {state === "done" ? (
              <p className="mt-4 flex items-center gap-2 text-blush" role="status">
                <Icon name="check-circle" size={18} /> You&rsquo;re on the list.
              </p>
            ) : (
              <>
                <div className="mt-3 flex">
                  <input
                    id="newsletter"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setState("idle");
                    }}
                    placeholder="Your email"
                    aria-invalid={state === "error"}
                    aria-describedby={state === "error" ? "newsletter-err" : undefined}
                    className="h-[54px] min-w-0 flex-1 border border-porcelain/30 bg-transparent px-4 text-[16px] text-porcelain placeholder:text-porcelain/60 outline-none focus:border-blush"
                  />
                  <Button type="submit" variant="blush" className="!px-6">Sign up</Button>
                </div>
                {state === "error" && (
                  <p id="newsletter-err" className="t-caption mt-2 flex items-center gap-1.5 text-blush">
                    <Icon name="alert" size={14} /> Enter a valid email address.
                  </p>
                )}
              </>
            )}
          </form>
        </div>

        <div data-reveal="stagger" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="t-label text-[12px] text-blush">{col.title}</h2>
              <ul className="mt-5 flex flex-col">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="inline-flex min-h-10 items-center text-[15px] text-porcelain/85 hover:text-blush">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-porcelain/15">
        <div className="container-x flex flex-col-reverse gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <p className="t-caption text-porcelain/70">© {new Date().getFullYear()} ORVAN. All rights reserved.</p>
          <ul className="-ml-2.5 flex gap-1" aria-label="Social">
            {(["instagram", "pinterest", "youtube"] as const).map((s) => (
              <li key={s}>
                <a href={`https://www.${s}.com`} target="_blank" rel="noreferrer" className="inline-flex size-11 items-center justify-center rounded-full hover:text-blush">
                  <Icon name={s} size={20} label={`ORVAN on ${s[0].toUpperCase() + s.slice(1)}`} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
