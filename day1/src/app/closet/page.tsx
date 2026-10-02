"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { PhotoStep } from "@/components/closet/PhotoStep";
import { Studio } from "@/components/closet/Studio";
import { Icon } from "@/components/Icon";
import { cx } from "@/components/ui";
import { useClosetSession, useMounted } from "@/lib/store";

export default function ClosetPage() {
  return (
    <Suspense>
      <Closet />
    </Suspense>
  );
}

function Closet() {
  const mounted = useMounted();
  const params = useSearchParams();
  const router = useRouter();
  const photo = useClosetSession((s) => s.photo);
  const setMode = useClosetSession((s) => s.setMode);
  const [step, setStep] = useState<1 | 2 | null>(null);

  // Returning in the same session skips Step 1 (PRD §7 rules).
  useEffect(() => {
    if (mounted && step === null) setStep(photo ? 2 : 1);
  }, [mounted, photo, step]);

  useEffect(() => {
    document.title = step === 1 ? "Add your photo · Virtual Closet · ORVAN" : "Try-on studio · Virtual Closet · ORVAN";
    window.scrollTo(0, 0);
  }, [step]);

  const only = params.get("item");

  return (
    <div className={cx("flex flex-col bg-porcelain", step === 2 ? "min-h-dvh lg:h-dvh" : "min-h-dvh")}>
      <header className="border-b border-line bg-porcelain">
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 px-3 md:h-[72px] md:px-6 xl:px-10">
          <Link href="/cart" className="t-label inline-flex min-h-11 items-center gap-2 justify-self-start px-2 text-[12px] hover:text-oxblood">
            <Icon name="arrow-left" size={18} />
            <span className="hidden sm:inline">Back to cart</span>
            <span className="sm:hidden">Cart</span>
          </Link>
          <p className="t-label text-[13px] tracking-[0.22em] md:text-[14px]">Virtual Closet</p>
          <ol className="t-label flex items-center gap-2 justify-self-end text-[11px] md:gap-3 md:text-[12px]" aria-label="Steps">
            {(["Photo", "Try on"] as const).map((label, i) => {
              const n = (i + 1) as 1 | 2;
              const current = step === n;
              return (
                <li key={label} className="flex items-center gap-2" aria-current={current ? "step" : undefined}>
                  {i > 0 && <span aria-hidden className="hidden text-ink-soft md:inline">·</span>}
                  <span
                    className={cx(
                      "inline-flex size-6 items-center justify-center text-[11px] tracking-normal",
                      current ? "bg-oxblood text-on-brand" : "bg-linen text-ink-soft",
                    )}
                  >
                    {n}
                  </span>
                  <span className={cx("hidden md:inline", !current && "text-ink-soft")}>{label}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="flex min-h-0 flex-1 flex-col outline-none">
        {step === 1 && <PhotoStep onContinue={() => setStep(2)} />}
        {step === 2 && (
          <Studio
            only={only}
            onChangePhoto={(mode) => {
              if (mode) setMode(mode);
              setStep(1);
              if (only) router.replace("/closet");
            }}
          />
        )}
      </main>
    </div>
  );
}
