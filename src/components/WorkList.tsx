"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";
import { gsap, useGSAP, canHover } from "@/lib/gsap";
import { clients } from "@/lib/site";
import { TLink } from "./Transition";

/**
 * Client index. On desktop a preview card follows the cursor and slides
 * between client logos as you move down the list.
 */
export function WorkList() {
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const reel = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const card = preview.current!;
      gsap.set(card, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0 });
      if (!canHover()) return;

      const x = gsap.quickTo(card, "x", { duration: 0.7, ease: "power3.out" });
      const y = gsap.quickTo(card, "y", { duration: 0.7, ease: "power3.out" });

      const onEnter = () => gsap.to(card, { scale: 1, autoAlpha: 1, rotate: -4, duration: 0.6, ease: "expo.out" });
      const onLeave = () => gsap.to(card, { scale: 0.6, autoAlpha: 0, rotate: 0, duration: 0.5, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        x(e.clientX - r.left);
        y(e.clientY - r.top);
      };
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]");
      const rowHandlers = rows.map((row, i) => {
        const fn = () => gsap.to(reel.current, { yPercent: -100 * i, duration: 0.8, ease: "expo.out" });
        row.addEventListener("pointerenter", fn);
        return () => row.removeEventListener("pointerenter", fn);
      });

      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);
      el.addEventListener("pointermove", onMove);
      return () => {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
        el.removeEventListener("pointermove", onMove);
        rowHandlers.forEach((off) => off());
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative">
      <ul className="border-t border-ink/15">
        {clients.map((c) => (
          <li key={c.slug} data-row>
            <TLink
              href={`/work#${c.slug}`}
              className="group relative flex items-center gap-4 border-b border-ink/15 py-6 sm:py-8"
            >
              <span
                aria-hidden
                className="absolute bottom-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100"
              />
              <span
                className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl lg:hidden"
                style={{ background: c.tone }}
              >
                <Image src={c.logo} alt="" fill sizes="56px" className="object-contain p-1.5" />
              </span>
              <span className="display min-w-0 flex-1 text-[clamp(1.7rem,4.2vw,3.6rem)] leading-[1.05] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3 lg:group-hover:translate-x-6">
                {c.name}
              </span>
              <span className="hidden text-ink-soft transition-colors duration-300 group-hover:text-ink md:block">{c.sector}</span>
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-ink/20 transition-all duration-500 ease-[var(--ease-expo)] group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                <ArrowUpRight className="size-4" aria-hidden />
              </span>
            </TLink>
          </li>
        ))}
      </ul>

      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 z-10 hidden aspect-[4/3] w-80 overflow-hidden rounded-[var(--radius-card)] opacity-0 shadow-[0_40px_80px_-30px_rgb(14_26_51/0.55)] lg:block"
      >
        <div ref={reel} className="h-full">
          {clients.map((c) => (
            <div key={c.slug} className="relative h-full" style={{ background: c.tone }}>
              <Image src={c.logo} alt="" fill sizes="320px" className="object-contain p-6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
