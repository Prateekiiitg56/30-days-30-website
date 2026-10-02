"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getProduct } from "./catalogue";

/* ---------- Cart ---------- */

export interface CartLine {
  productId: string;
  colour: string;
  size: string;
  qty: number;
}

export const lineKey = (l: Pick<CartLine, "productId" | "colour" | "size">) => `${l.productId}|${l.colour}|${l.size}`;

interface CartState {
  lines: CartLine[];
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  /** Change colour/size of a line in place. Merges into an identical line if one exists. */
  update: (key: string, patch: Partial<Pick<CartLine, "colour" | "size">>) => void;
  remove: (key: string) => { line: CartLine; index: number } | null;
  restore: (line: CartLine, index: number) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (line, qty = 1) =>
        set((s) => {
          const key = lineKey(line);
          const existing = s.lines.find((l) => lineKey(l) === key);
          if (existing) return { lines: s.lines.map((l) => (l === existing ? { ...l, qty: l.qty + qty } : l)) };
          return { lines: [...s.lines, { ...line, qty }] };
        }),
      setQty: (key, qty) =>
        set((s) => ({ lines: s.lines.map((l) => (lineKey(l) === key ? { ...l, qty: Math.max(1, Math.min(10, qty)) } : l)) })),
      update: (key, patch) =>
        set((s) => {
          const target = s.lines.find((l) => lineKey(l) === key);
          if (!target) return s;
          const next = { ...target, ...patch };
          const clash = s.lines.find((l) => l !== target && lineKey(l) === lineKey(next));
          if (clash) {
            return {
              lines: s.lines
                .filter((l) => l !== target)
                .map((l) => (l === clash ? { ...l, qty: Math.min(10, l.qty + target.qty) } : l)),
            };
          }
          return { lines: s.lines.map((l) => (l === target ? next : l)) };
        }),
      remove: (key) => {
        const index = get().lines.findIndex((l) => lineKey(l) === key);
        if (index < 0) return null;
        const line = get().lines[index];
        set((s) => ({ lines: s.lines.filter((_, i) => i !== index) }));
        return { line, index };
      },
      restore: (line, index) =>
        set((s) => {
          const lines = [...s.lines];
          lines.splice(Math.min(index, lines.length), 0, line);
          return { lines };
        }),
      clear: () => set({ lines: [] }),
    }),
    { name: "orvan-cart" },
  ),
);

export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty, 0);
export const cartSubtotal = (lines: CartLine[]) =>
  lines.reduce((sum, l) => sum + (getProduct(l.productId)?.price ?? 0) * l.qty, 0);

/* ---------- Wishlist ---------- */

interface WishState {
  ids: string[];
  toggle: (id: string) => boolean;
}

export const useWishlist = create<WishState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const has = get().ids.includes(id);
        set({ ids: has ? get().ids.filter((x) => x !== id) : [...get().ids, id] });
        return !has;
      },
    }),
    { name: "orvan-wishlist" },
  ),
);

/* ---------- Virtual Closet ---------- */

export type BodyMode = "full" | "half";

export interface SavedLook {
  id: string;
  photo: string;
  mode: BodyMode;
  items: { productId: string; colour: string; size: string }[];
  createdAt: number;
}

interface ClosetSession {
  photo: string | null;
  mode: BodyMode;
  setPhoto: (photo: string | null, mode?: BodyMode) => void;
  setMode: (mode: BodyMode) => void;
}

/** The photo lives in sessionStorage only — it is gone when the tab session ends (PRD §10). */
export const useClosetSession = create<ClosetSession>()(
  persist(
    (set) => ({
      photo: null,
      mode: "full",
      setPhoto: (photo, mode) => set((s) => ({ photo, mode: mode ?? s.mode })),
      setMode: (mode) => set({ mode }),
    }),
    { name: "orvan-closet", storage: createJSONStorage(() => sessionStorage) },
  ),
);

interface LookState {
  looks: SavedLook[];
  save: (look: Omit<SavedLook, "id" | "createdAt">) => void;
  remove: (id: string) => void;
}

/** Saved looks keep their photo until the shopper deletes them. */
export const useLooks = create<LookState>()(
  persist(
    (set) => ({
      looks: [],
      save: (look) =>
        // Keep only the latest look so a stored photo never piles up.
        set({ looks: [{ ...look, id: `look_${Date.now().toString(36)}`, createdAt: Date.now() }] }),
      remove: (id) => set((s) => ({ looks: s.looks.filter((l) => l.id !== id) })),
    }),
    { name: "orvan-looks" },
  ),
);

/* ---------- UI: mini-cart drawer + toasts ---------- */

export interface Toast {
  id: number;
  message: string;
  tone?: "default" | "success";
  action?: { label: string; onClick: () => void };
}

interface UIState {
  miniCart: { open: boolean; key?: string };
  openMiniCart: (key: string) => void;
  closeMiniCart: () => void;
  toasts: Toast[];
  toast: (t: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
}

let toastId = 0;
export const useUI = create<UIState>()((set, get) => ({
  miniCart: { open: false },
  openMiniCart: (key) => set({ miniCart: { open: true, key } }),
  closeMiniCart: () => set((s) => ({ miniCart: { ...s.miniCart, open: false } })),
  toasts: [],
  toast: (t) => {
    const id = ++toastId;
    // One toast at a time keeps the bottom-centre slot calm.
    set({ toasts: [{ ...t, id }] });
    setTimeout(() => get().dismiss(id), t.action ? 6000 : 4000);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Persisted stores read localStorage after mount; gate client-only values on this to avoid hydration mismatch. */
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
