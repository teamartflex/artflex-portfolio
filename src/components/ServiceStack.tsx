"use client";

import { useRef } from "react";
import Image from "next/image";
import { Camera, ChartLineUp, Check, Globe, InstagramLogo, PenNib, type Icon } from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { services } from "@/lib/site";

const icons: Record<string, Icon> = {
  performance: ChartLineUp,
  social: InstagramLogo,
  branding: PenNib,
  content: Camera,
  web: Globe,
};

const tones = [
  { card: "bg-ink text-paper on-ink", soft: "text-paper/80", chip: "bg-paper/10", icon: "bg-gold-light text-ink" },
  { card: "bg-paper-2 text-ink", soft: "text-ink-soft", chip: "bg-ink/[0.06]", icon: "bg-ink text-gold-light" },
  { card: "bg-gradient-to-br from-[#efe3c6] via-[#e5d1a2] to-[#d3b578] text-ink", soft: "text-ink/80", chip: "bg-ink/[0.08]", icon: "bg-ink text-gold-light" },
  { card: "bg-white text-ink ring-1 ring-ink/10", soft: "text-ink-soft", chip: "bg-ink/[0.06]", icon: "bg-ink text-gold-light" },
  { card: "bg-ink-2 text-paper on-ink", soft: "text-paper/80", chip: "bg-paper/10", icon: "bg-gold-light text-ink" },
];

/**
 * Sticky card stack: each service card pins under the nav and the one before it
 * recedes (scales down and dims) as the next slides over it. Desktop only;
 * on small screens the cards simply stack.
 */
export function ServiceStack() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-stack-img]").forEach((img) => {
          gsap.fromTo(img, { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: img, start: "top bottom", end: "bottom 40%", scrub: true } });
        });
      });
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]");
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.to(card.querySelector("[data-stack-inner]"), {
            scale: 0.9,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 18%", scrub: true },
          });
          gsap.to(card.querySelector("[data-stack-shade]"), {
            opacity: 0.45,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 18%", scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="space-y-6 lg:space-y-[18vh]">
      {services.map((s, i) => {
        const t = tones[i % tones.length];
        const Icon = icons[s.slug] ?? ChartLineUp;
        return (
          <article key={s.slug} id={s.slug} data-stack-card className="scroll-mt-28 lg:sticky lg:top-[calc(var(--nav-h)+24px)]">
            <div
              data-stack-inner
              className={`relative origin-top overflow-hidden rounded-[var(--radius-card)] p-7 sm:p-10 lg:min-h-[68vh] lg:p-14 ${t.card}`}
            >
              <div data-stack-shade aria-hidden className="pointer-events-none absolute inset-0 z-10 bg-ink opacity-0" />
              <span aria-hidden className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full border border-current opacity-10" />
              <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-14">
                <div className="flex flex-col lg:col-span-7">
                  <span className={`grid size-16 place-items-center rounded-full ${t.icon}`}>
                    <Icon weight="duotone" className="size-8" aria-hidden />
                  </span>
                  <h2 className="display mt-8 text-[clamp(2.3rem,5vw,4.4rem)]">{s.title}</h2>
                  <p className={`mt-5 max-w-[46ch] text-lg leading-relaxed ${t.soft}`}>{s.body}</p>
                  <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-auto lg:pt-10">
                    {s.items.map((it) => (
                      <li key={it} className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 font-medium ${t.chip}`}>
                        <Check weight="bold" className="size-4 shrink-0" aria-hidden />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] sm:aspect-[16/10] lg:col-span-5 lg:aspect-auto lg:min-h-[420px]">
                  <div data-stack-img className="absolute inset-0">
                    <Image
                      src={s.image}
                      alt={s.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 36vw, 90vw"
                      className="object-cover"
                      style={{ objectPosition: s.imagePos }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
