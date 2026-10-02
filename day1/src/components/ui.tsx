"use client";

import Link from "next/link";
import { forwardRef, useEffect, useId, useRef, type ComponentProps, type ReactNode } from "react";
import type { Colour } from "@/lib/catalogue";
import { Icon, type IconName } from "./Icon";

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/* ---------- Button ---------- */

type Variant = "primary" | "brand" | "blush" | "secondary" | "secondary-light" | "link";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-porcelain hover:bg-oxblood",
  brand: "bg-oxblood text-on-brand hover:bg-oxblood-deep",
  blush: "bg-blush text-ink hover:bg-blush-soft",
  secondary: "border border-ink text-ink hover:bg-ink hover:text-porcelain",
  "secondary-light": "border border-on-brand/70 text-on-brand hover:bg-on-brand hover:text-oxblood",
  link: "",
};

interface BtnBase {
  variant?: Variant;
  size?: "md" | "sm";
  full?: boolean;
  icon?: IconName;
  iconAfter?: IconName;
}

const btnClass = ({ variant = "primary", size = "md", full }: BtnBase, extra?: string) =>
  variant === "link"
    ? cx("t-label link-underline inline-flex min-h-11 items-center gap-2 py-2", extra)
    : cx(
        "t-label inline-flex items-center justify-center gap-3 whitespace-nowrap transition-colors duration-200 ease-brand",
        "disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40",
        size === "md" ? "h-[54px] px-8 lg:px-11" : "h-11 px-5",
        full && "w-full",
        variants[variant],
        extra,
      );

export const Button = forwardRef<HTMLButtonElement, BtnBase & ComponentProps<"button">>(function Button(
  { variant, size, full, icon, iconAfter, className, children, type = "button", ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={btnClass({ variant, size, full }, className)} {...rest}>
      {icon && <Icon name={icon} size={18} />}
      {children}
      {iconAfter && <Icon name={iconAfter} size={18} />}
    </button>
  );
});

export function ButtonLink({
  variant,
  size,
  full,
  icon,
  iconAfter,
  className,
  children,
  ...rest
}: BtnBase & ComponentProps<typeof Link>) {
  return (
    <Link className={btnClass({ variant, size, full }, className)} {...rest}>
      {icon && <Icon name={icon} size={18} />}
      {children}
      {iconAfter && <Icon name={iconAfter} size={18} />}
    </Link>
  );
}

/** Round 44px icon button — the only rounded control besides swatches (DESIGN §4). */
export function IconButton({
  icon,
  label,
  className,
  pressed,
  ...rest
}: { icon: IconName; label: string; pressed?: boolean } & ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      className={cx(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ease-brand",
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={20} fill={pressed && icon === "heart" ? "currentColor" : "none"} />
    </button>
  );
}

/* ---------- Eyebrow ---------- */

export function Eyebrow({ children, rule, className }: { children: ReactNode; rule?: boolean; className?: string }) {
  return (
    <p className={cx("t-eyebrow flex items-center gap-4", className)}>
      {rule && <span aria-hidden className="h-px w-11 bg-current" />}
      {children}
    </p>
  );
}

/* ---------- Notice ---------- */

export function Notice({
  icon = "info",
  children,
  tone = "info",
  className,
}: {
  icon?: IconName;
  children: ReactNode;
  tone?: "info" | "warning" | "error";
  className?: string;
}) {
  return (
    <div
      className={cx(
        "flex items-start gap-3 bg-blush-soft px-4 py-3 text-[14px] leading-snug text-ink",
        className,
      )}
    >
      <Icon
        name={icon}
        size={16}
        className={cx(
          "mt-0.5 shrink-0",
          tone === "warning" && "text-warning",
          tone === "error" && "text-error",
          tone === "info" && "text-oxblood",
        )}
      />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/* ---------- Swatches & size pills ---------- */

export function Swatches({
  colours,
  value,
  onChange,
  name,
  size = 44,
}: {
  colours: Colour[];
  value: string;
  onChange: (id: string) => void;
  name: string;
  size?: 32 | 44;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-3">
      {colours.map((c) => {
        const selected = c.id === value;
        return (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={c.name}
            title={c.name}
            onClick={() => onChange(c.id)}
            // 44px hit area even for the compact 32px swatch.
            className={cx(
              "relative inline-flex items-center justify-center rounded-full",
              size === 32 ? "size-11" : "size-[52px]",
            )}
          >
            <span
              className={cx(
                "block rounded-full border border-ink/15 transition-shadow duration-200",
                selected && "shadow-[0_0_0_3px_var(--color-surface),0_0_0_5px_var(--color-brand)]",
              )}
              style={{ background: c.hex, width: size === 32 ? 28 : 40, height: size === 32 ? 28 : 40 }}
            />
          </button>
        );
      })}
    </div>
  );
}

export function SizePills({
  sizes,
  value,
  onChange,
  soldOut = [],
  invalid,
  describedBy,
}: {
  sizes: string[];
  value: string | null;
  onChange: (s: string) => void;
  soldOut?: string[];
  invalid?: boolean;
  describedBy?: string;
}) {
  return (
    <div role="radiogroup" aria-label="Size" aria-invalid={invalid} aria-describedby={describedBy} className="flex flex-wrap gap-2">
      {sizes.map((s) => {
        const out = soldOut.includes(s);
        const selected = value === s;
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-disabled={out}
            aria-label={out ? `${s}, sold out` : s}
            onClick={() => !out && onChange(s)}
            className={cx(
              "h-11 min-w-14 border px-3 text-[14px] font-medium tracking-[0.08em] transition-colors duration-200 ease-brand",
              selected ? "border-ink bg-ink text-porcelain" : "border-line bg-chalk hover:border-ink",
              out && "cursor-not-allowed text-ink-soft line-through hover:border-line",
              invalid && !selected && "border-error",
            )}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Quantity stepper ---------- */

export function QtyStepper({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="inline-flex h-11 items-stretch border border-line bg-chalk" role="group" aria-label={`Quantity for ${label}`}>
      <button
        type="button"
        className="flex w-11 items-center justify-center hover:bg-linen disabled:opacity-40"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <Icon name="minus" size={16} />
      </button>
      <output className="flex w-9 items-center justify-center text-[15px] font-medium" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className="flex w-11 items-center justify-center hover:bg-linen disabled:opacity-40"
        onClick={() => onChange(value + 1)}
        disabled={value >= 10}
        aria-label="Increase quantity"
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}

/* ---------- Form field ---------- */

export function Field({
  label,
  error,
  hint,
  className,
  as = "input",
  children,
  ...rest
}: {
  label: string;
  error?: string;
  hint?: string;
  as?: "input" | "select";
  children?: ReactNode;
} & ComponentProps<"input"> &
  Pick<ComponentProps<"select">, "onChange">) {
  const id = useId();
  const msgId = `${id}-msg`;
  const control = cx(
    "h-12 w-full border bg-chalk px-4 text-[16px] text-ink placeholder:text-ink-soft outline-none transition-colors",
    "focus:border-2 focus:border-oxblood focus:px-[15px]",
    error ? "border-2 border-error px-[15px]" : "border-line",
  );
  return (
    <div className={className}>
      <label htmlFor={id} className="t-label mb-2 block text-[12px]">
        {label}
      </label>
      {as === "select" ? (
        <select
          id={id}
          className={control}
          aria-invalid={!!error}
          aria-describedby={error || hint ? msgId : undefined}
          {...(rest as ComponentProps<"select">)}
        >
          {children}
        </select>
      ) : (
        <input id={id} className={control} aria-invalid={!!error} aria-describedby={error || hint ? msgId : undefined} {...rest} />
      )}
      {(error || hint) && (
        <p id={msgId} className={cx("t-caption mt-2 flex items-center gap-1.5", error ? "text-error" : "text-ink-soft")}>
          {error && <Icon name="alert" size={14} />}
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

/* ---------- Dialog: drawer (right / bottom sheet) and modal ---------- */

/**
 * Native <dialog> gives focus trapping, Esc to close and inert background for free.
 */
export function Dialog({
  open,
  onClose,
  label,
  variant = "modal",
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  variant?: "modal" | "drawer" | "sheet";
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && d.open) {
      d.close();
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={() => {
        document.documentElement.style.overflow = "";
        onClose();
      }}
      onClick={(e) => e.target === ref.current && onClose()}
      className={cx(
        "orvan-dialog m-0 max-h-none max-w-none bg-chalk p-0 text-ink shadow-overlay backdrop:bg-ink/40",
        variant === "drawer" && "dialog-drawer ml-auto h-dvh w-full sm:w-[420px]",
        variant === "sheet" && "dialog-sheet mt-auto max-h-[88dvh] w-full",
        variant === "modal" && "dialog-modal m-auto w-[min(640px,calc(100vw-32px))] max-h-[calc(100dvh-48px)]",
        className,
      )}
    >
      {open && children}
    </dialog>
  );
}

export function DialogHeader({ title, onClose }: { title: ReactNode; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
      <h2 className="t-label text-[14px]">{title}</h2>
      <IconButton icon="close" label="Close" onClick={onClose} className="-mr-2 hover:bg-linen" />
    </div>
  );
}

/* ---------- Image with Mauve Stone fallback ---------- */

export function PhotoFrame({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cx("relative overflow-hidden bg-stone", className)}>{children}</div>;
}
