"use client";

import { createAnimatable, createTimeline, onScroll, animate, stagger } from "animejs";
import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { ButtonLink, Eyebrow } from "../ui";

// Runway sequence (walk across → approach → pose): three VP9-alpha clips keyed from the green-screen
// shots with their real floor shadow, built by scripts/build_hero_video.py. They play back to back,
// crossfading over the last FADE seconds.
const SHOTS = [1, 2, 3].map((n) => `/images/main-model-video/shot-${n}.webm`);
const POSTER = "/video/hero-runway-poster.webp"; // final pose of the last shot
const FADE = 0.6;
const WORD = "ORVAN".split("");

/**
 * Hero — giant ORVAN wordmark with the model standing in front of it (DESIGN §6.1.3).
 *
 * Depth is built from three planes inside one perspective stage:
 *   back  — the wordmark (letters drop in, drifts away on scroll)
 *   mid   — the model (VP9-alpha runway sequence; plays once and holds the final pose)
 *   front — copy and CTAs
 * The pointer tilts the planes by different amounts, so the scene reads as 3D.
 * Safari cannot play VP9 alpha, so it gets the still cutout instead.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const activeRef = useRef(0);
  const [active, setActiveState] = useState(0);
  const [canAlpha, setCanAlpha] = useState(true);
  const setActive = (i: number) => {
    activeRef.current = i;
    setActiveState(i);
  };

  // Video: plays from the first shot every time the home page mounts (landing, refresh, coming back);
  // pauses while off-screen to save CPU/battery and resumes when scrolled back.
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/safari/i.test(ua) && !/chrome|chromium|crios|android|edg/i.test(ua)) return setCanAlpha(false);
    const stage = root.current;
    if (!stage) return;
    // Reduced motion: no playback, show the final pose (the last shot's poster).
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setActive(SHOTS.length - 1);
    // If the browser refuses autoplay (e.g. battery saver), hold the final pose instead of an empty stage.
    const blocked = (err: DOMException) => err.name === "NotAllowedError" && setActive(SHOTS.length - 1);
    const io = new IntersectionObserver(([e]) => {
      const v = videos.current[activeRef.current];
      if (!v || v.ended) return;
      if (e.isIntersecting) v.play().catch(blocked);
      else v.pause();
    });
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  // Hand over to the next shot just before the current one ends, so the two overlap during the crossfade.
  const onTime = (i: number) => (e: SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    const next = videos.current[i + 1];
    if (i !== activeRef.current || !next || v.duration - v.currentTime > FADE) return;
    next.currentTime = 0;
    setActive(i + 1);
    next.play().catch(() => {});
  };

  // Motion: intro timeline, scroll depth, pointer parallax.
  useEffect(() => {
    const el = root.current;
    if (!el || !document.documentElement.classList.contains("motion")) return;
    const q = <T extends Element = HTMLElement>(s: string) => el.querySelector<T>(s)!;

    const intro = createTimeline({ defaults: { ease: "outExpo" } })
      .add(el.querySelectorAll(".hero-letter"), {
        opacity: [0, 1],
        y: ["55%", "0%"],
        rotateX: [-80, 0],
        duration: 1400,
        delay: stagger(80),
      })
      .add(q("[data-hero-model]"), { opacity: [0, 1], duration: 900 }, 0)
      .add(el.querySelectorAll("[data-hero-ui]"), { opacity: [0, 1], y: [24, 0], duration: 1000, delay: stagger(90) }, 520);

    // Scroll: the wordmark falls back and fades while the model lifts — planes separate.
    const scrollWord = animate(q("[data-hero-scroll-word]"), {
      y: [0, 160],
      scale: [1, 1.14],
      opacity: [1, 0.12],
      ease: "linear",
      autoplay: onScroll({ target: el, enter: "top top", leave: "top bottom", sync: 0.3 }),
    });
    const scrollModel = animate(q("[data-hero-scroll-model]"), {
      y: [0, -70],
      ease: "linear",
      autoplay: onScroll({ target: el, enter: "top top", leave: "top bottom", sync: 0.3 }),
    });

    // Pointer parallax — only for real hover pointers.
    let offPointer = () => {};
    if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const params = { x: 900, y: 900, rotateX: 900, rotateY: 900, ease: "out(3)" };
      const word = createAnimatable(q("[data-hero-depth-word]"), params);
      const model = createAnimatable(q("[data-hero-depth-model]"), params);
      const ui = createAnimatable(el.querySelectorAll("[data-hero-depth-ui]"), { x: 900, y: 900, ease: "out(3)" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        word.x(dx * -36).y(dy * -18).rotateY(dx * 10).rotateX(dy * -6);
        model.x(dx * 22).y(dy * 10).rotateY(dx * -4);
        ui.x(dx * 10).y(dy * 6);
      };
      const reset = () => {
        word.x(0).y(0).rotateX(0).rotateY(0);
        model.x(0).y(0).rotateY(0);
        ui.x(0).y(0);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", reset);
      offPointer = () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", reset);
        word.revert();
        model.revert();
        ui.revert();
      };
    }

    return () => {
      intro.revert();
      scrollWord.revert();
      scrollModel.revert();
      offPointer();
    };
  }, []);

  return (
    <section ref={root} aria-labelledby="hero-title" className="hero-stage relative overflow-hidden bg-porcelain">
      {/* Studio light: soft warm pool behind the model, so the cutout sits in a lit space rather than on flat colour */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_57%_62%,#faf6f2_0%,rgba(250,246,242,0)_70%),linear-gradient(180deg,rgba(232,221,213,0)_55%,rgba(232,221,213,0.9)_100%)]" />

      <div className="container-x relative h-[calc(100svh-var(--header-h)-var(--bar-h))] min-h-[600px] max-h-[820px] md:min-h-[680px] [perspective:1400px]">
        <div data-hero-ui className="absolute left-5 top-8 z-20 md:left-10 md:top-12 xl:left-[110px]">
          <div data-hero-depth-ui>
            <Eyebrow rule className="whitespace-nowrap text-oxblood max-sm:!text-[10px] max-sm:!tracking-[0.28em]">
              <span className="text-ink">Fashion that moves with you.</span>
            </Eyebrow>
          </div>
        </div>

        {/* Back plane: giant wordmark */}
        <div className="pointer-events-none absolute inset-x-0 top-[30%] z-0 -translate-y-1/2 md:top-[44%]">
          <div data-hero-scroll-word className="origin-center">
            <h1
              id="hero-title"
              data-hero-depth-word
              className="t-display-xl select-none text-center text-ink [transform-style:preserve-3d]"
              style={{ fontSize: "clamp(84px, 22.5vw, 330px)", marginRight: "-0.05em" }}
            >
              <span aria-hidden className="inline-flex">
                {WORD.map((l, i) => (
                  <span key={i} className="hero-letter inline-block origin-[50%_100%]">
                    {l}
                  </span>
                ))}
              </span>
              <span className="sr-only">ORVAN — Fashion that moves with you</span>
            </h1>
          </div>
        </div>

        {/* Mid plane: model */}
        {/* 16:9 stage the width of the hero; on phones it is sized by height and centred, so she crosses the visible middle */}
        <div className="pointer-events-none absolute bottom-[104px] left-1/2 z-10 aspect-video h-[62%] -translate-x-1/2 md:inset-0 md:bottom-0 md:h-full md:w-full md:translate-x-0 md:left-0 md:aspect-auto">
          <div data-hero-scroll-model className="size-full">
            <div data-hero-model className="size-full">
              <div data-hero-depth-model className="relative size-full">
                {canAlpha ? (
                  <div role="img" aria-label="Model in an oxblood wool coat, cream knit and ecru trousers" className="relative size-full">
                    {SHOTS.map((src, i) => (
                      <video
                        key={src}
                        ref={(el) => {
                          videos.current[i] = el;
                        }}
                        aria-hidden
                        className="absolute inset-0 h-full w-full object-contain object-bottom transition-opacity duration-[600ms] ease-linear [filter:saturate(0.92)_contrast(1.02)]"
                        style={{ opacity: i === active ? 1 : 0 }}
                        src={src}
                        poster={i === SHOTS.length - 1 ? POSTER : undefined}
                        muted
                        playsInline
                        preload="auto"
                        onTimeUpdate={onTime(i)}
                      />
                    ))}
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={POSTER} alt="Model in an oxblood wool coat, cream knit and ecru trousers" className="relative h-full w-full object-contain object-bottom" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Front plane: CTAs */}
        <div data-hero-ui className="absolute bottom-6 left-5 right-5 z-20 sm:right-auto md:bottom-12 md:left-10 xl:left-[110px]">
          <div data-hero-depth-ui className="flex items-center justify-between gap-4 md:justify-start md:gap-8">
            <ButtonLink href="/shop/all" className="flex-1 sm:flex-none" data-magnetic>
              Shop now
            </ButtonLink>
            <ButtonLink href="/shop/all?sort=new" variant="link" className="shrink-0">
              Explore new in
            </ButtonLink>
          </div>
        </div>

        <div data-hero-ui className="absolute bottom-12 right-10 z-20 hidden md:block xl:right-[110px]">
          <div data-hero-depth-ui>
            <p className="t-label text-[12px]">New collection {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>

      {/* Fine film grain over the whole scene unifies video compression with the flat background */}
      <div aria-hidden className="grain pointer-events-none absolute inset-0 z-30" />
    </section>
  );
}
