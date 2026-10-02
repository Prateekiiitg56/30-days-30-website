import { Fragment } from "react";

const PHRASES = ["New collection", "Try it on before it ships", "Oxblood season", "Free returns in 30 days"];

/** Editorial ticker between hero and category band. Duplicated once for a seamless loop. */
export function Marquee() {
  const run = (hidden?: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {PHRASES.map((p, i) => (
        <Fragment key={p}>
          <span className={i % 2 ? "text-oxblood" : "text-ink"}>{p}</span>
          <span aria-hidden className="mx-8 inline-block size-2.5 rotate-45 bg-oxblood md:mx-12" />
        </Fragment>
      ))}
    </div>
  );
  return (
    <section aria-label="Highlights" className="marquee overflow-hidden border-y border-line bg-porcelain py-5 md:py-7">
      <div className="marquee-track t-h2 flex w-max whitespace-nowrap !text-[clamp(28px,4vw,56px)]">
        {run()}
        {run(true)}
      </div>
    </section>
  );
}
