"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { scroller, stage } from "@/lib/stage";

const KEY = "af-preloaded";

/**
 * First-visit intro: the gold ring draws, the monogram rises out of it, the counter
 * runs to 100 and the curtain lifts. Skipped on repeat visits in the same session
 * (an inline script in <head> hides it before paint) and under reduced motion.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      let seen = false;
      try {
        seen = sessionStorage.getItem(KEY) === "1";
      } catch {}

      if (seen || prefersReducedMotion()) {
        el.style.display = "none";
        stage.setPreloading(false);
        return;
      }

      scroller.stop();
      const count = { v: 0 };
      const counter = el.querySelector<HTMLElement>("[data-count]")!;
      const ring = el.querySelector<SVGCircleElement>("[data-ring]")!;
      const len = ring.getTotalLength();

      gsap.set(ring, { strokeDasharray: len, strokeDashoffset: len });
      gsap.set("[data-mark]", { clipPath: "inset(100% 0% 0% 0%)", scale: 1.08 });
      gsap.set("[data-word]", { clipPath: "inset(0% 100% 0% 0%)" });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(ring, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" }, 0)
        .to(count, {
          v: 100,
          duration: 2.2,
          ease: "power2.inOut",
          onUpdate: () => {
            counter.textContent = String(Math.round(count.v)).padStart(3, "0");
          },
        }, 0)
        .to("[data-mark]", { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.4 }, 0.5)
        .to("[data-word]", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut" }, 1.1)
        .to("[data-inner]", { y: -40, autoAlpha: 0, duration: 0.7, ease: "power3.in" }, 2.5)
        .add(() => {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
          scroller.start();
          stage.setPreloading(false);
        }, 2.95)
        .to(el, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, 2.85)
        .set(el, { display: "none" });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[90] flex items-center justify-center bg-paper"
      aria-hidden
    >
      <div data-inner className="flex flex-col items-center gap-8">
        <div className="relative grid size-44 place-items-center sm:size-56">
          <svg viewBox="0 0 200 200" className="absolute inset-0 size-full -rotate-90">
            <circle cx="100" cy="100" r="96" fill="none" stroke="var(--color-paper-3)" strokeWidth="1" />
            <circle data-ring cx="100" cy="100" r="96" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" />
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-mark src="/brand/mark.png" alt="" className="w-[62%]" />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-word src="/brand/wordmark.png" alt="" className="h-4 w-auto sm:h-5" />
      </div>
      <p className="absolute bottom-6 right-6 font-display text-5xl text-ink tabular-nums sm:bottom-10 sm:right-10 sm:text-7xl">
        <span data-count>000</span>
      </p>
      <p className="absolute bottom-8 left-6 text-sm text-ink-soft sm:bottom-12 sm:left-10">
        Digital &amp; performance marketing
      </p>
    </div>
  );
}
