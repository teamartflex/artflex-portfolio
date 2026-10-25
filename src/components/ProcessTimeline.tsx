"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Step = { title: string; body: string };

/** Vertical timeline: a gold line fills as you scroll and each step lights up when the line reaches it. */
export function ProcessTimeline({ steps }: { steps: Step[] }) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        root.current!.querySelectorAll("[data-step]").forEach((s) => s.setAttribute("data-active", "true"));
        return;
      }
      gsap.fromTo(
        "[data-line]",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 60%", end: "bottom 60%", scrub: 0.5 } },
      );
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
        gsap.from(step.querySelector("[data-step-body]"), {
          x: 40,
          autoAlpha: 0,
          duration: 1.1,
          scrollTrigger: { trigger: step, start: "top 75%", once: true },
        });
        ScrollTrigger.create({
          trigger: step,
          start: "top 60%",
          onEnter: () => (step.dataset.active = "true"),
          onLeaveBack: () => (step.dataset.active = "false"),
        });
      });
    },
    { scope: root },
  );

  return (
    <ol ref={root} className="relative">
      <span aria-hidden className="absolute bottom-6 left-[19px] top-6 w-px bg-ink/15 sm:left-[23px]" />
      <span
        aria-hidden
        data-line
        style={{ transform: "scaleY(0)" }}
        className="absolute bottom-6 left-[19px] top-6 w-px origin-top bg-gold sm:left-[23px]"
      />
      {steps.map((s, i) => (
        <li key={s.title} data-step data-active="false" className="group relative grid grid-cols-[40px_1fr] gap-6 pb-14 last:pb-0 sm:grid-cols-[48px_1fr] sm:gap-10">
          <span className="relative z-10 grid size-10 place-items-center rounded-full border border-ink/20 bg-paper font-display text-lg text-ink-soft transition-all duration-500 group-data-[active=true]:border-gold group-data-[active=true]:bg-ink group-data-[active=true]:text-gold-light sm:size-12 sm:text-xl">
            {i + 1}
          </span>
          <div data-step-body className="pt-1">
            <h3 className="display text-3xl sm:text-4xl">{s.title}</h3>
            <p className="mt-3 max-w-[52ch] text-lg leading-relaxed text-ink-soft">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
