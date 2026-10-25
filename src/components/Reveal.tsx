"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { stage } from "@/lib/stage";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** stagger direct children instead of animating the wrapper */
  stagger?: number;
  y?: number;
  delay?: number;
  hero?: boolean;
  start?: string;
  id?: string;
};

/** Fade-and-rise on scroll (or after the curtain lifts, for hero elements). */
export function Reveal({ as: Tag = "div", children, className = "", stagger, y = 36, delay = 0, hero, start = "top 88%", id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      gsap.set(el, { visibility: "visible" });
      if (prefersReducedMotion()) return;
      const targets = stagger !== undefined ? Array.from(el.children) : el;
      const vars: gsap.TweenVars = {
        y,
        autoAlpha: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: stagger ?? 0,
        delay,
      };
      if (hero) {
        const tween = gsap.from(targets, { ...vars, paused: true });
        return stage.onOpen(() => tween.play());
      }
      gsap.from(targets, { ...vars, scrollTrigger: { trigger: el, start, once: true } });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className} data-hero-reveal={hero ? "" : undefined}>
      {children}
    </Tag>
  );
}
