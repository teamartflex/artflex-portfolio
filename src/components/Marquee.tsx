"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Seamless loop that speeds up with scroll velocity and follows scroll direction.
 * Pauses (eases down) while hovered so a logo can be inspected.
 */
export function Marquee({ children, speed = 40, className = "", label }: { children: ReactNode; speed?: number; className?: string; label?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const track = root.current!.querySelector<HTMLElement>("[data-track]")!;
      const loop = gsap.to(track, { xPercent: -50, ease: "none", duration: speed, repeat: -1 });

      let dir = 1;
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          dir = self.direction;
          const v = Math.min(Math.abs(self.getVelocity()) / 220, 6);
          gsap.to(loop, { timeScale: dir * (1 + v), duration: 0.25, overwrite: true });
          gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.25, ease: "power2.out" });
        },
      });

      const el = root.current!;
      const slow = () => gsap.to(loop, { timeScale: 0.15 * dir, duration: 0.8, overwrite: true });
      const resume = () => gsap.to(loop, { timeScale: dir, duration: 0.8, overwrite: true });
      el.addEventListener("pointerenter", slow);
      el.addEventListener("pointerleave", resume);
      return () => {
        st.kill();
        el.removeEventListener("pointerenter", slow);
        el.removeEventListener("pointerleave", resume);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`relative overflow-hidden ${className}`} aria-label={label} role={label ? "region" : undefined}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper to-transparent sm:w-32" />
      <div data-track className="flex w-max motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center motion-reduce:hidden" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
