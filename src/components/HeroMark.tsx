"use client";

import { useRef } from "react";
import { ChartLineUp, InstagramLogo, PenNib } from "@phosphor-icons/react";
import { gsap, useGSAP, canHover, prefersReducedMotion } from "@/lib/gsap";
import { stage } from "@/lib/stage";
import { AwardBadge } from "./AwardBadge";

const chips = [
  { label: "Performance ads", Icon: ChartLineUp, pos: "right-[-2%] top-[14%]", depth: 38 },
  { label: "Social media", Icon: InstagramLogo, pos: "left-[-4%] top-[42%]", depth: 26 },
  { label: "Branding", Icon: PenNib, pos: "right-[4%] bottom-[12%]", depth: 46 },
];

/**
 * Hero visual built from the real ArtFlex monogram: a gold orbit draws itself,
 * the mark rises, service chips float in. Layers drift with the cursor at
 * different depths and the composition eases upward as the page scrolls.
 */
export function HeroMark() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const orbit = el.querySelector<SVGCircleElement>("[data-orbit]")!;
      const len = orbit.getTotalLength();

      if (prefersReducedMotion()) {
        gsap.set(el, { visibility: "visible" });
        return;
      }

      gsap.set(el, { visibility: "visible" });
      const intro = gsap
        .timeline({ paused: true })
        .fromTo(orbit, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" }, 0)
        .from("[data-ring]", { scale: 0.6, autoAlpha: 0, duration: 1.8, ease: "expo.out" }, 0.1)
        .from("[data-mark]", { yPercent: 18, scale: 0.86, autoAlpha: 0, filter: "blur(8px)", duration: 1.6, ease: "expo.out" }, 0.35)
        .from("[data-chip]", { y: 30, scale: 0.8, autoAlpha: 0, duration: 1.1, stagger: 0.12, ease: "back.out(1.6)" }, 0.9)
        .from("[data-badge]", { rotate: -120, scale: 0.4, autoAlpha: 0, duration: 1.4, ease: "expo.out" }, 1.0);

      const offOpen = stage.onOpen(() => intro.play());

      // continuous gentle float on chips
      gsap.utils.toArray<HTMLElement>("[data-chip-float]").forEach((c, i) => {
        gsap.to(c, { y: i % 2 ? 10 : -10, duration: 2.6 + i * 0.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
      });

      // scroll: composition eases up and the orbit turns
      gsap.to("[data-scroll-layer]", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-ring]", {
        rotate: 90,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });

      // pointer depth parallax
      let onMove: ((e: PointerEvent) => void) | undefined;
      if (canHover()) {
        const layers = gsap.utils.toArray<HTMLElement>("[data-depth]").map((node) => ({
          d: Number(node.dataset.depth),
          x: gsap.quickTo(node, "x", { duration: 1.2, ease: "power3.out" }),
          y: gsap.quickTo(node, "y", { duration: 1.2, ease: "power3.out" }),
        }));
        onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          layers.forEach((l) => {
            l.x(nx * l.d);
            l.y(ny * l.d);
          });
        };
        window.addEventListener("pointermove", onMove);
      }

      return () => {
        offOpen();
        if (onMove) window.removeEventListener("pointermove", onMove);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} data-hero-reveal className="relative mx-auto aspect-square w-full max-w-[560px]">
      <div data-scroll-layer className="absolute inset-0">
        {/* orbit + rings */}
        <div data-depth="10" className="absolute inset-0">
          <div data-ring className="absolute inset-0">
            <svg viewBox="0 0 400 400" className="absolute inset-0 size-full" aria-hidden>
              <circle cx="200" cy="200" r="196" fill="none" stroke="var(--color-ink)" strokeOpacity="0.08" />
              <circle data-orbit cx="200" cy="200" r="196" fill="none" stroke="var(--color-gold)" strokeWidth="1.4" strokeLinecap="round" transform="rotate(-120 200 200)" />
              <circle cx="200" cy="200" r="150" fill="none" stroke="var(--color-gold)" strokeOpacity="0.25" strokeDasharray="2 7" />
              <circle cx="200" cy="4" r="5" fill="var(--color-gold)" />
            </svg>
          </div>
        </div>

        {/* soft disc + monogram */}
        <div data-depth="18" className="absolute inset-[17%] rounded-full bg-gradient-to-br from-paper-2 via-paper to-paper-3/70 shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_40px_80px_-40px_rgb(126_96_41/0.45)]" />
        <div data-depth="30" className="absolute inset-[26%] grid place-items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-mark src="/brand/mark.png" alt="ArtFlex monogram" className="w-full" fetchPriority="high" />
        </div>

        {/* floating service chips */}
        {chips.map(({ label, Icon, pos, depth }) => (
          <div key={label} data-depth={depth} className={`absolute ${pos}`}>
            <div data-chip>
              <div
                data-chip-float
                className="flex items-center gap-2 rounded-full border border-ink/10 bg-paper/90 py-2 pl-2 pr-4 text-[13px] font-medium text-ink shadow-[0_14px_30px_-16px_rgb(14_26_51/0.4)] backdrop-blur sm:text-sm"
              >
                <span className="grid size-7 place-items-center rounded-full bg-ink text-gold-light">
                  <Icon weight="duotone" className="size-4" aria-hidden />
                </span>
                {label}
              </div>
            </div>
          </div>
        ))}

        <div data-depth="54" className="absolute bottom-[2%] left-[2%] w-[27%] min-w-[104px]">
          <div data-badge>
            <AwardBadge className="w-full text-[clamp(14px,2.2vw,22px)]" tone="ink" />
          </div>
        </div>
      </div>
    </div>
  );
}
