/* eslint-disable @next/next/no-img-element -- local data URL preview */
"use client";

import { useId, useRef, useState } from "react";
import { useClosetSession, type BodyMode } from "@/lib/store";
import { preparePhoto } from "@/lib/tryon";
import { Icon, type IconName } from "../Icon";
import { Button, Eyebrow, Notice, cx } from "../ui";

const MAX = 10 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

/** Sample models, so the Closet can be tried without a photo of your own. */
const SAMPLES: Record<BodyMode, { src: string; label: string }[]> = {
  full: [
    { src: "/images/products/w-trouser-1.webp", label: "Sample model, woman, full body" },
    { src: "/images/products/m-trouser-1.webp", label: "Sample model, man, full body" },
  ],
  half: [
    { src: "/images/products/w-shirt-1.webp", label: "Sample model, woman, half body" },
    { src: "/images/products/m-tee-1.webp", label: "Sample model, man, half body" },
  ],
};

const tips: { icon: IconName; text: string }[] = [
  { icon: "user", text: "Face the camera and stand straight." },
  { icon: "figure-full", text: "Hold your arms slightly away from your body." },
  { icon: "swap", text: "Wear fitted clothes so the pieces sit naturally." },
  { icon: "image", text: "Use a plain background." },
  { icon: "sun", text: "Stand in even, bright light." },
];

export function ModeToggle({ value, onChange }: { value: BodyMode; onChange: (m: BodyMode) => void }) {
  const opts: { id: BodyMode; label: string; icon: IconName }[] = [
    { id: "full", label: "Full body", icon: "figure-full" },
    { id: "half", label: "Half body", icon: "figure-half" },
  ];
  return (
    <div role="radiogroup" aria-label="Photo type" className="grid grid-cols-2 bg-linen p-1">
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={cx(
            "t-label flex h-12 items-center justify-center gap-2.5 text-[12px] transition-colors duration-200 ease-brand",
            value === o.id ? "bg-ink text-porcelain" : "text-ink hover:bg-chalk/60",
          )}
        >
          <Icon name={o.icon} size={18} />
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function PhotoStep({ onContinue }: { onContinue: () => void }) {
  const session = useClosetSession();
  const [mode, setMode] = useState<BodyMode>(session.mode);
  const [photo, setPhoto] = useState<string | null>(session.photo);
  const [consent, setConsent] = useState(!!session.photo);
  const [issue, setIssue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sample, setSample] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);
  const consentId = useId();

  const accept = async (file?: File, isSample = false) => {
    setError(null);
    setIssue(null);
    if (!file) return;
    setSample(isSample);
    const heic = /\.hei[cf]$/i.test(file.name);
    if (!TYPES.includes(file.type) && !heic) return setError("Use a JPG, PNG or HEIC photo.");
    if (file.size > MAX) return setError("This photo is over 10 MB. Choose a smaller one.");
    setBusy(true);
    try {
      const { dataUrl, issue } = await preparePhoto(file);
      setPhoto(dataUrl);
      setIssue(issue ?? null);
    } catch {
      setError(heic ? "This browser can't open HEIC photos. Export it as JPG and try again." : "We couldn't read this photo. Try another one.");
    } finally {
      setBusy(false);
    }
  };

  const pickSample = async (src: string) => {
    setBusy(true);
    try {
      const blob = await (await fetch(src)).blob();
      await accept(new File([blob], src.split("/").pop()!, { type: blob.type }), true);
    } catch {
      setBusy(false);
      setError("We couldn't load the sample. Try again.");
    }
  };

  // A sample model isn't the shopper's photo, so the photo consent doesn't apply to it.
  const ready = !!photo && (consent || sample) && !busy;

  return (
    <div className="container-x grid gap-12 pb-16 pt-8 md:pt-12 lg:grid-cols-12 lg:gap-8">
      <div className="mx-auto w-full max-w-[560px] lg:col-span-7 lg:col-start-2 xl:col-start-3 xl:col-span-6">
        <Eyebrow className="text-oxblood">Step 1</Eyebrow>
        <h1 className="t-h1 mt-2">Add your photo</h1>

        <div className="mt-8">
          <ModeToggle value={mode} onChange={setMode} />
          <p className="t-caption mt-3 text-ink-soft">
            {mode === "full"
              ? "Head to toe in frame. You can try on every clothing item."
              : "Head to hips in frame. You can try on tops, jackets and outerwear."}
          </p>
        </div>

        {/* Upload zone */}
        <div className="mt-6">
          {photo ? (
            <div className="flex gap-5 border border-line bg-chalk p-4">
              <img src={photo} alt="Your uploaded photo" className="aspect-[3/4] w-[120px] shrink-0 bg-stone object-cover" />
              <div className="flex min-w-0 flex-col justify-center gap-2">
                <p className="flex items-center gap-2 font-medium text-success">
                  <Icon name="check-circle" size={18} /> Photo added
                </p>
                <p className="t-caption text-ink-soft">{sample ? "Sample model — no photo of yours is used." : "Only you can see it."}</p>
                <div className="flex flex-wrap gap-x-5">
                  <button type="button" onClick={() => fileRef.current?.click()} className="t-label link-underline min-h-11 text-[12px]">
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      setIssue(null);
                      setSample(false);
                      session.setPhoto(null);
                    }}
                    className="t-label min-h-11 text-[12px] text-ink-soft hover:text-ink"
                  >
                    {sample ? "Remove sample" : "Delete photo"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                accept(e.dataTransfer.files[0]);
              }}
              className={cx(
                "flex h-[240px] flex-col items-center justify-center gap-4 px-6 text-center transition-colors duration-200",
                drag ? "border-[1.5px] border-solid border-oxblood bg-blush-soft" : "border-[1.5px] border-dashed border-ink-soft bg-chalk",
              )}
              aria-busy={busy}
            >
              {busy ? (
                <p className="t-label text-[12px] text-ink-soft">Preparing your photo…</p>
              ) : (
                <>
                  <Icon name="upload" size={28} className="text-oxblood" />
                  <div>
                    <p className="font-medium">Upload or take a photo</p>
                    <p className="t-caption mt-1 text-ink-soft">JPG, PNG or HEIC · up to 10 MB</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button size="sm" icon="upload" onClick={() => fileRef.current?.click()}>
                      Choose photo
                    </Button>
                    <Button size="sm" variant="secondary" icon="camera" onClick={() => camRef.current?.click()}>
                      Take photo
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
          {!photo && (
            <div className="mt-4 flex items-center gap-4 bg-linen p-3 pr-4">
              <div className="flex shrink-0 gap-2">
                {SAMPLES[mode].map((m) => (
                  <button
                    key={m.src}
                    type="button"
                    onClick={() => pickSample(m.src)}
                    disabled={busy}
                    aria-label={`Use ${m.label.toLowerCase()}`}
                    className="group relative h-[72px] w-[54px] overflow-hidden bg-stone outline-offset-2 disabled:opacity-60"
                  >
                    <img src={m.src} alt="" className="size-full object-cover transition-transform duration-500 ease-brand group-hover:scale-110" />
                  </button>
                ))}
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-medium">No photo to hand?</p>
                <p className="t-caption mt-0.5 text-ink-soft">Try the Closet on one of our sample models.</p>
              </div>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/heic,image/heif,.heic,.heif" className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => { accept(e.target.files?.[0]); e.target.value = ""; }} />
          <input ref={camRef} type="file" accept="image/*" capture="user" className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => { accept(e.target.files?.[0]); e.target.value = ""; }} />

          <div aria-live="polite" className="mt-3 flex flex-col gap-3">
            {error && (
              <Notice icon="alert" tone="error">{error}</Notice>
            )}
            {issue && (
              <Notice icon="alert" tone="warning">
                {issue}{" "}
                <button type="button" onClick={() => fileRef.current?.click()} className="link-underline font-medium">
                  Retake
                </button>
                <span className="text-ink-soft"> — or continue with this one.</span>
              </Notice>
            )}
          </div>
        </div>

        {/* Tips */}
        <section aria-labelledby="tips-title" className="mt-8">
          <h2 id="tips-title" className="t-label text-[12px]">Photo tips</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {tips.map((t) => (
              <li key={t.text} className="flex items-start gap-3 text-[15px]">
                <Icon name={t.icon} size={18} className="mt-0.5 shrink-0 text-oxblood" />
                {t.text}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 lg:hidden">
          <PhotoExamples />
        </div>

        {/* Consent (not needed for a sample model) */}
        <div className={cx("mt-8 flex items-start gap-3 border-t border-line pt-6", sample && "hidden")}>
          <input
            id={consentId}
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 size-6 shrink-0 cursor-pointer accent-oxblood"
          />
          <label htmlFor={consentId} className="cursor-pointer text-[15px]">
            I&rsquo;m 18 or older and agree my photo is used only to create this preview.
          </label>
        </div>

        <Button
          full
          className="mt-6"
          disabled={!ready}
          aria-describedby="continue-note"
          iconAfter="arrow-right"
          onClick={() => {
            session.setPhoto(photo, mode);
            onContinue();
          }}
        >
          Continue
        </Button>
        <p id="continue-note" className="t-caption mt-2 text-ink-soft">
          {!photo ? "Add a photo or pick a sample to continue." : !consent && !sample ? "Tick the box above to continue." : "Next: see your cart on you."}
        </p>

        <p className="t-caption mt-10 flex items-start gap-2 text-ink-soft">
          <Icon name="lock" size={16} className="shrink-0" />
          Used only for your preview and never shared. Deleted after your session unless you save a look.
        </p>
      </div>

      <aside className="hidden lg:col-span-3 lg:block" aria-label="Photo examples">
        <div className="sticky top-[104px]">
          <PhotoExamples />
        </div>
      </aside>
    </div>
  );
}

/** "Good photo" and "Avoid" illustrations (PRD V-7). */
function PhotoExamples() {
  const figure = (x: number, dark = false, arms: "out" | "crossed" = "out") => (
    <g fill={dark ? "#3a2c2e" : "#6E5A5C"}>
      <circle cx={x} cy="30" r="9" />
      <path d={`M${x - 13} 44h26l2 44h-8l-2 50h-6l-1-44-1 44h-6l-2-50h-8z`} />
      {arms === "out" ? (
        <path d={`M${x - 13} 46l-10 38 5 1 9-30zM${x + 13} 46l10 38-5 1-9-30z`} />
      ) : (
        <path d={`M${x - 14} 58h28v8h-28z`} />
      )}
    </g>
  );
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-5">
      <figure className="bg-chalk p-4">
        <svg viewBox="0 0 120 150" className="w-full bg-stone" role="img" aria-label="Good photo: one person, full body, arms slightly away, plain background">
          {figure(60)}
        </svg>
        <figcaption className="t-label mt-3 flex items-center gap-2 text-[12px] text-success">
          <Icon name="check-circle" size={16} /> Good photo
        </figcaption>
      </figure>
      <figure className="bg-chalk p-4">
        <svg viewBox="0 0 120 150" className="w-full bg-[#9d8f88]" role="img" aria-label="Avoid: several people, crossed arms, dark or busy background">
          <rect x="0" y="0" width="120" height="150" fill="#8c7d76" />
          <rect x="72" y="12" width="36" height="60" fill="#7a6b64" />
          {figure(40, true, "crossed")}
          {figure(82, true)}
        </svg>
        <figcaption className="t-label mt-3 flex items-center gap-2 text-[12px] text-error">
          <Icon name="close" size={16} /> Avoid
        </figcaption>
        <p className="t-caption mt-1 text-ink-soft">Several people, crossed arms, dark or busy backgrounds.</p>
      </figure>
    </div>
  );
}
