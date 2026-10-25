"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { gallery } from "@/lib/site";
import { TLink } from "./Transition";
import { SplitReveal } from "./SplitReveal";

// hand-placed collage: [shot index, grid placement, parallax speed]
// row 1: heading + two portraits; row 2: wide event shot tucked under the heading + one portrait
const layout: [number, string, number][] = [
  [0, "col-span-1 md:col-span-3 md:col-start-7 md:mt-24", -10],
  [2, "col-span-1 md:col-span-3 md:col-start-10", 8],
  [1, "col-span-2 md:col-span-6 md:col-start-1 md:-mt-16", -5],
  [3, "col-span-1 md:col-span-3 md:col-start-8 md:mt-16", 10],
  [5, "col-span-1 md:hidden", 6],
];

/**
 * "Fresh from the studio": recent shoots at staggered depths. Each frame wipes
 * open as it arrives and then drifts at its own speed while scrolling.
 */
export function StudioCollage() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-collage]").forEach((el) => {
        const speed = Number(el.dataset.speed);
        gsap.fromTo(el, { yPercent: speed / 2 }, { yPercent: -speed / 2, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        const frame = el.querySelector("[data-frame]");
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top 90%", once: true } })
          .fromTo(frame, { clipPath: "inset(12% 12% 12% 12% round 18px)" }, { clipPath: "inset(0% 0% 0% 0% round 18px)", duration: 1.6, ease: "expo.inOut" })
          .from(el.querySelector("img"), { scale: 1.3, duration: 2, ease: "expo.out" }, 0);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="mx-auto w-full max-w-[1400px] overflow-hidden px-4 py-24 sm:px-6 sm:py-36 lg:px-10">
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-12">
        <div className="col-span-2 mb-8 md:col-span-5 md:row-span-1 md:mb-0 md:self-center">
          <SplitReveal className="display text-[clamp(2.4rem,5vw,4.6rem)]">
            Fresh from the <em>studio.</em>
          </SplitReveal>
          <p className="mt-6 max-w-[38ch] text-lg leading-relaxed text-ink-soft">
            Launch creatives, food shoots and event coverage we&apos;ve produced for our clients recently.
          </p>
          <TLink href="/work#recent" className="link-underline mt-8 inline-flex items-center gap-2 font-medium">
            See recent work <ArrowUpRight className="size-4" aria-hidden />
          </TLink>
        </div>
        {layout.map(([i, place, speed]) => {
          const s = gallery[i];
          return (
            <figure key={s.src} data-collage data-speed={speed} className={place}>
              <TLink href="/work#recent" className="group block" aria-label={s.caption}>
                <div data-frame className="relative overflow-hidden rounded-[18px]" style={{ aspectRatio: `${s.w} / ${s.h}` }}>
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 768px) 40vw, 46vw"
                    className="object-cover transition-transform duration-1000 ease-[var(--ease-expo)] group-hover:scale-[1.05]"
                  />
                </div>
              </TLink>
              <figcaption className="mt-3 text-sm text-ink-soft">{s.caption}</figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
