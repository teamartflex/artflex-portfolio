"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { wrap } from "@/lib/ui";
import { SplitReveal } from "./SplitReveal";
import { Button } from "./Button";

/** Closing call to action: a navy panel that opens up to full width as it scrolls in. */
export function CTASection({
  title = (
    <>
      Ready to make your brand <em>impossible</em> to scroll past?
    </>
  ),
  body = "Tell us where you want to be in twelve months. We will show you how we get there.",
}: {
  title?: React.ReactNode;
  body?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-cta-panel]",
        { clipPath: "inset(6% 5% 6% 5% round 32px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 95%", end: "top 25%", scrub: true },
        },
      );
      gsap.to("[data-cta-rings]", {
        rotate: 120,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={`${wrap} py-16 sm:py-24`}>
      <div data-cta-panel className="on-ink relative overflow-hidden rounded-[var(--radius-card)] bg-ink px-6 py-20 text-paper sm:px-12 sm:py-28 lg:px-20">
        <div data-cta-rings aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[34rem] sm:-right-24">
          <span className="absolute inset-0 rounded-full border border-gold-light/20" />
          <span className="absolute inset-12 rounded-full border border-dashed border-gold-light/25" />
          <span className="absolute inset-28 rounded-full border border-gold-light/15" />
          <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-light" />
        </div>
        <div className="relative max-w-3xl">
          <SplitReveal className="display text-[clamp(2.4rem,5.6vw,5rem)]">{title}</SplitReveal>
          <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-paper/80">{body}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/contact" variant="light" size="lg">
              Start a project
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
