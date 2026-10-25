"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { stage } from "@/lib/stage";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** hero copy waits for the preloader / page curtain instead of scroll position */
  hero?: boolean;
  delay?: number;
  /** "lines" rise out of masks; "chars" for short display words */
  by?: "lines" | "chars";
  id?: string;
};

/** Masked line-by-line headline reveal (GSAP SplitText, re-splits on resize). */
export function SplitReveal({ as: Tag = "h2", children, className = "", hero, delay = 0, by = "lines", id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      if (prefersReducedMotion()) {
        gsap.set(el, { visibility: "visible" });
        return;
      }

      let tween: gsap.core.Tween | null = null;
      let played = false;

      SplitText.create(el, {
        type: by === "chars" ? "lines,chars" : "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { visibility: "visible" });
          const targets = by === "chars" ? self.chars : self.lines;
          tween = gsap.from(targets, {
            yPercent: 120,
            rotate: by === "chars" ? 0 : 2.5,
            transformOrigin: "0% 100%",
            duration: by === "chars" ? 1.1 : 1.35,
            ease: "expo.out",
            stagger: by === "chars" ? 0.025 : 0.11,
            delay,
            paused: !played,
          });
          return tween;
        },
      });

      const play = () => {
        played = true;
        tween?.play();
      };

      if (hero) return stage.onOpen(play);

      const st = ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: play });
      return () => st.kill();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className} data-hero-reveal="">
      {children}
    </Tag>
  );
}
