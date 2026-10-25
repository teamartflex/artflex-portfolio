"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { scroller } from "@/lib/stage";

/** Lenis smooth scrolling driven by the GSAP ticker, plus a gold reading-progress bar. */
export function SmoothScroll() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);

    if (!prefersReducedMotion()) {
      lenis = new Lenis({ lerp: 0.095, wheelMultiplier: 1, touchMultiplier: 1.2 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      scroller.set(lenis);
    }

    const progress = gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.4 },
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      progress.scrollTrigger?.kill();
      progress.kill();
      gsap.ticker.remove(tick);
      lenis?.destroy();
      scroller.set(null);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[45] h-[2px]">
      <div ref={bar} style={{ transform: "scaleX(0)" }} className="h-full origin-left bg-gold" />
    </div>
  );
}
