"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, ChartLineUp, Camera, Globe, InstagramLogo, PenNib, type Icon } from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { services } from "@/lib/site";
import { TLink } from "./Transition";
import { SplitReveal } from "./SplitReveal";

const icons: Record<string, Icon> = {
  performance: ChartLineUp,
  social: InstagramLogo,
  branding: PenNib,
  content: Camera,
  web: Globe,
};

const tones = [
  "bg-ink text-paper on-ink",
  "bg-paper-2 text-ink",
  "bg-gradient-to-br from-[#efe3c6] via-[#e2cc96] to-[#cfae68] text-ink",
  "bg-white text-ink ring-1 ring-ink/10",
  "bg-ink-2 text-paper on-ink",
];

/**
 * On every screen size the section pins and vertical scrolling pans the service
 * cards sideways; once the last card is in view the page scrolls on past it.
 * Each card's photo drifts inside its frame and its icon turns into place as it arrives.
 * Reduced motion: a plain swipeable scroll-snap row instead.
 */
export function HorizontalServices() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const t = track.current!;
        const distance = () => Math.max(0, t.scrollWidth - window.innerWidth);
        const pan = gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.to("[data-pan-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "top top", end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true },
        });
        gsap.utils.toArray<HTMLElement>("[data-service-card]").forEach((card) => {
          const st = { trigger: card, containerAnimation: pan, scrub: true };
          gsap.fromTo(card.querySelector("[data-card-img]"), { xPercent: 8 }, { xPercent: -8, ease: "none", scrollTrigger: { ...st, start: "left right", end: "right left" } });
          gsap.from(card.querySelector("[data-icon]"), { rotate: -120, scale: 0.4, ease: "none", scrollTrigger: { ...st, start: "left 100%", end: "left 55%" } });
          gsap.from(card.querySelector("[data-card-body]"), { x: 60, opacity: 0, ease: "none", scrollTrigger: { ...st, start: "left 95%", end: "left 60%" } });
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} className="relative overflow-hidden" aria-labelledby="services-heading">
      <div
        ref={track}
        className="flex h-[100svh] w-max items-center gap-4 px-4 sm:gap-6 sm:px-6 lg:h-[100dvh] lg:px-10 motion-reduce:h-auto motion-reduce:w-auto motion-reduce:snap-x motion-reduce:snap-mandatory motion-reduce:scroll-px-4 motion-reduce:overflow-x-auto motion-reduce:py-16"
      >
        <div className="w-[84vw] max-w-[520px] shrink-0 snap-start self-center pr-4 sm:w-[60vw] lg:w-[34vw] lg:max-w-none lg:pr-10">
          <SplitReveal id="services-heading" className="display text-[clamp(2.4rem,4.6vw,4.6rem)]">
            Everything your brand needs to <em>grow</em> online.
          </SplitReveal>
          <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-ink-soft">
            One team for strategy, creative and media, so nothing gets lost between agencies.
          </p>
          <TLink href="/services" className="link-underline mt-8 inline-flex items-center gap-2 font-medium text-ink">
            Explore services <ArrowUpRight className="size-4" aria-hidden />
          </TLink>
        </div>

        {services.map((s, i) => {
          const Icon = icons[s.slug] ?? ChartLineUp;
          const dark = tones[i].includes("on-ink");
          return (
            <article
              key={s.slug}
              data-service-card
              className={`relative flex h-[min(76svh,640px)] w-[80vw] max-w-[440px] shrink-0 snap-start flex-col overflow-hidden rounded-[var(--radius-card)] sm:w-[56vw] lg:h-[74vh] lg:max-h-[680px] lg:w-[min(30vw,460px)] ${tones[i]}`}
            >
              <div className="relative m-2.5 h-[44%] shrink-0 overflow-hidden rounded-[18px] sm:m-3">
                <div data-card-img className="absolute inset-y-0 -left-[12%] -right-[12%]">
                  <Image
                    src={s.image}
                    alt={s.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 30vw, 80vw"
                    className="object-cover"
                    style={{ objectPosition: s.imagePos }}
                  />
                </div>
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/35 to-transparent" />
              </div>
              <div className="relative flex flex-1 flex-col justify-between px-6 pb-6 pt-2 sm:px-8 sm:pb-8">
                <span
                  data-icon
                  className={`absolute -top-9 right-6 grid size-14 place-items-center rounded-full shadow-[0_10px_30px_-10px_rgb(14_26_51/0.5)] sm:right-8 ${dark ? "bg-gold-light text-ink" : "bg-ink text-gold-light"}`}
                >
                  <Icon weight="duotone" className="size-7" aria-hidden />
                </span>
                <div data-card-body>
                  <h3 className="display pr-16 text-[1.9rem] leading-[1.05] sm:text-[2.3rem]">{s.title}</h3>
                  <p className={`mt-3 max-w-[34ch] leading-relaxed ${dark ? "text-paper/80" : "text-ink-soft"}`}>{s.short}</p>
                </div>
                <ul className="mt-4 flex flex-wrap gap-2 [@media(max-height:700px)]:hidden">
                  {s.items.slice(0, 3).map((it) => (
                    <li
                      key={it}
                      className={`rounded-full px-3 py-1.5 text-[13px] font-medium ${dark ? "bg-paper/10 text-paper" : "bg-ink/[0.06] text-ink"}`}
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
        <div aria-hidden className="w-[2vw] shrink-0 lg:w-[6vw]" />
      </div>

      <div aria-hidden className="absolute inset-x-4 bottom-6 h-px bg-ink/10 sm:inset-x-6 lg:inset-x-10 lg:bottom-10 motion-reduce:hidden">
        <div data-pan-progress style={{ transform: "scaleX(0)" }} className="h-full origin-left bg-gold" />
      </div>
    </section>
  );
}
