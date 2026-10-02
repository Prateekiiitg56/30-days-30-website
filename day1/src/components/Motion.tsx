"use client";

import { animate, createAnimatable, createDrawable, onScroll, splitText, stagger } from "animejs";
import { useEffect } from "react";

/**
 * Site-wide motion, driven by data attributes so pages stay declarative:
 *
 *   data-reveal            fade + rise when scrolled into view
 *   data-reveal="stagger"  same, per child, with a 3D lift and stagger
 *   data-split             heading words rise out of a mask, one by one
 *   data-parallax="60"     drifts ±60px against scroll
 *   data-tilt              3D tilt toward the pointer (children with data-depth float above)
 *   data-draw              strokes of the SVG icons inside are drawn in
 *   data-magnetic          button leans toward the pointer
 *
 * Client-rendered pages (cart, wishlist…) add nodes after mount, so a
 * MutationObserver wires anything new. Everything is skipped under reduced motion.
 */
export function Motion() {
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("motion")) return;

    const done = new WeakSet<Element>();
    const cleanups: (() => void)[] = [];
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const once = (el: Element) => (done.has(el) ? false : (done.add(el), true));
    const track = (a: { revert: () => unknown }) => cleanups.push(() => a.revert());
    const enter = (target: Element) => onScroll({ target, enter: "bottom-=40 top", repeat: false });

    const wire = (root: ParentNode) => {
      const all = <T extends Element = HTMLElement>(sel: string) => {
        const list = Array.from(root.querySelectorAll<T>(sel));
        if (root instanceof Element && root.matches(sel)) list.unshift(root as unknown as T);
        return list.filter(once);
      };

      all("[data-reveal]").forEach((el) => {
        const staggered = el.getAttribute("data-reveal") === "stagger";
        const targets = staggered ? Array.from(el.children) : [el];
        track(
          animate(targets, {
            opacity: [0, 1],
            y: [staggered ? 56 : 32, 0],
            ...(staggered ? { rotateX: [18, 0] } : {}),
            duration: 1100,
            ease: "outExpo",
            delay: stagger(90),
            autoplay: enter(el),
            // From here anime owns the inline state; children added later (filters) show normally.
            onBegin: () => el.setAttribute("data-revealed", ""),
          }),
        );
      });

      all("[data-split]").forEach((el) => {
        const split = splitText(el, { words: { wrap: "clip" } });
        el.style.opacity = "1";
        track(
          animate(split.words, {
            y: ["110%", "0%"],
            rotateZ: [4, 0],
            duration: 1200,
            ease: "outExpo",
            delay: stagger(70),
            autoplay: enter(el),
          }),
        );
        cleanups.push(() => split.revert());
      });

      all("[data-parallax]").forEach((el) => {
        const d = Number(el.dataset.parallax) || 60;
        track(
          animate(el, {
            y: [-d, d],
            ease: "linear",
            autoplay: onScroll({ target: el, enter: "bottom top", leave: "top bottom", sync: 0.25 }),
          }),
        );
      });

      all("[data-draw]").forEach((el) => {
        const strokes = createDrawable(el.querySelectorAll("svg path, svg circle, svg rect"));
        track(
          animate(strokes, {
            draw: ["0 0", "0 1"],
            duration: 1400,
            ease: "inOutQuad",
            delay: stagger(60),
            autoplay: enter(el),
          }),
        );
      });

      if (!finePointer) return;

      all("[data-tilt]").forEach((el) => {
        if (el.parentElement) el.parentElement.style.perspective = "1000px";
        const tilt = createAnimatable(el, { rotateX: 700, rotateY: 700, ease: "out(3)" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          tilt.rotateY(((e.clientX - r.left) / r.width - 0.5) * 10);
          tilt.rotateX(((e.clientY - r.top) / r.height - 0.5) * -10);
        };
        const leave = () => tilt.rotateX(0).rotateY(0);
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
          tilt.revert();
        });
      });

      all("[data-magnetic]").forEach((el) => {
        const pull = createAnimatable(el, { x: 600, y: 600, ease: "out(3)" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          pull.x((e.clientX - r.left - r.width / 2) * 0.25).y((e.clientY - r.top - r.height / 2) * 0.35);
        };
        const leave = () => pull.x(0).y(0);
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
          pull.revert();
        });
      });
    };

    wire(document);
    const mo = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => n instanceof Element && wire(n));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      cleanups.forEach((c) => c());
    };
  }, []);

  return null;
}

