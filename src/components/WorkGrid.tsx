"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, canHover, prefersReducedMotion } from "@/lib/gsap";
import { clients } from "@/lib/site";

const spans = ["md:col-span-7", "md:col-span-5 md:mt-28", "md:col-span-5", "md:col-span-7 md:mt-28", "md:col-span-6", "md:col-span-6 md:mt-28"];

/** Client cards: rise in on scroll, tilt toward the cursor with a moving sheen. */
export function WorkGrid() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const cleanups: (() => void)[] = [];
      gsap.utils.toArray<HTMLElement>("[data-work-card]").forEach((card) => {
        gsap.from(card, { y: 90, autoAlpha: 0, duration: 1.4, scrollTrigger: { trigger: card, start: "top 92%", once: true } });
        gsap.from(card.querySelector("[data-work-logo]"), {
          scale: 1.25,
          duration: 1.8,
          scrollTrigger: { trigger: card, start: "top 92%", once: true },
        });

        if (!canHover()) return;
        const tilt = card.querySelector<HTMLElement>("[data-tilt]")!;
        const sheen = card.querySelector<HTMLElement>("[data-sheen]")!;
        const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.8, ease: "power3.out" });
        const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.8, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = tilt.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          ry((px - 0.5) * 10);
          rx((0.5 - py) * 8);
          gsap.to(sheen, { opacity: 1, background: `radial-gradient(500px circle at ${px * 100}% ${py * 100}%, rgb(255 255 255 / 0.22), transparent 45%)`, duration: 0.3 });
        };
        const leave = () => {
          rx(0);
          ry(0);
          gsap.to(sheen, { opacity: 0, duration: 0.5 });
        };
        tilt.addEventListener("pointermove", move);
        tilt.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          tilt.removeEventListener("pointermove", move);
          tilt.removeEventListener("pointerleave", leave);
        });
      });
      return () => cleanups.forEach((fn) => fn());
    },
    { scope: root },
  );

  return (
    <div ref={root} className="grid gap-x-8 gap-y-14 md:grid-cols-12">
      {clients.map((c, i) => (
        <article key={c.slug} id={c.slug} data-work-card className={`scroll-mt-28 ${spans[i % spans.length]}`}>
          <div className="[perspective:1200px]">
            <div
              data-tilt
              className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] shadow-[0_30px_60px_-35px_rgb(14_26_51/0.45)] [transform-style:preserve-3d]"
              style={{ background: c.tone }}
            >
              <div data-work-logo className="absolute inset-0">
                <Image src={c.logo} alt={`${c.name} logo`} fill sizes="(min-width: 768px) 55vw, 100vw" className="object-contain p-10 sm:p-16" />
              </div>
              <div data-sheen aria-hidden className="pointer-events-none absolute inset-0 opacity-0" />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2 className="display text-3xl sm:text-4xl">{c.name}</h2>
            <p className="text-ink-soft">{c.sector}</p>
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {c.services.map((s) => (
              <li key={s} className="rounded-full border border-ink/15 px-3 py-1.5 text-[13px] font-medium text-ink">
                {s}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
