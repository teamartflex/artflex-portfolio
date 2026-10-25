"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Horizontal steps joined by a gold line that draws across as the row scrolls into view. */
export function StepsLine({ steps }: { steps: { title: string; body: string }[] }) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 75%", once: true } });
      tl.fromTo("[data-steps-line]", { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: "power3.inOut" }, 0)
        .from("[data-step-node]", { scale: 0, duration: 0.8, stagger: 0.35, ease: "back.out(2)" }, 0.1)
        .from("[data-step-copy]", { y: 30, autoAlpha: 0, duration: 1, stagger: 0.35 }, 0.25);
    },
    { scope: root },
  );

  return (
    <ol ref={root} className="relative grid gap-10 md:grid-cols-4 md:gap-8">
      <span aria-hidden className="absolute left-0 right-0 top-6 hidden h-px bg-ink/15 md:block" />
      <span aria-hidden data-steps-line style={{ transform: "scaleX(0)" }} className="absolute left-0 right-0 top-6 hidden h-px origin-left bg-gold md:block" />
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex gap-5 md:block">
          <span data-step-node className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full bg-ink font-display text-xl text-gold-light">
            {i + 1}
          </span>
          <div data-step-copy className="md:mt-8">
            <h3 className="display text-3xl">{s.title}</h3>
            <p className="mt-3 max-w-[30ch] text-lg leading-relaxed text-ink-soft">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
