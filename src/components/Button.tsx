"use client";

import { useRef, type ReactNode } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { gsap, useGSAP, canHover, prefersReducedMotion } from "@/lib/gsap";
import { TLink } from "./Transition";

type Variant = "solid" | "outline" | "light";

const styles: Record<Variant, { base: string; fill: string; hoverText: string }> = {
  // ink pill, gold fill on hover (gold on ink text = 5.5:1)
  solid: { base: "bg-ink text-paper", fill: "bg-gold", hoverText: "group-hover:text-ink" },
  outline: { base: "border border-ink/25 text-ink", fill: "bg-ink", hoverText: "group-hover:text-paper" },
  // for navy surfaces
  light: { base: "bg-paper text-ink", fill: "bg-gold-light", hoverText: "group-hover:text-ink" },
};

type Props = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: "md" | "lg";
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  arrow?: boolean;
};

/**
 * Pill button with two micro-interactions:
 * - magnetic pull toward the cursor (fine pointers only)
 * - a fill that grows from the exact point the cursor entered
 */
export function Button({ children, href, variant = "solid", size = "md", type = "button", disabled, onClick, className = "", arrow = true }: Props) {
  const wrap = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const s = styles[variant];

  useGSAP(
    () => {
      const el = wrap.current!;
      const label = el.querySelector("[data-label]");
      const blob = fill.current!;

      const onMove = (e: PointerEvent) => {
        if (!canHover() || prefersReducedMotion()) return;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(el, { x: x * 0.28, y: y * 0.4, duration: 0.6, ease: "power3.out" });
        gsap.to(label, { x: x * 0.12, y: y * 0.16, duration: 0.6, ease: "power3.out" });
      };
      const onEnter = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const size = Math.hypot(r.width, r.height) * 2.2;
        gsap.set(blob, { left: e.clientX - r.left, top: e.clientY - r.top, width: size, height: size, xPercent: -50, yPercent: -50 });
        gsap.fromTo(blob, { scale: 0 }, { scale: 1, duration: 0.7, ease: "power3.out" });
      };
      const onLeave = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        gsap.to([el, label], { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.35)" });
        gsap.set(blob, { left: e.clientX - r.left, top: e.clientY - r.top });
        gsap.to(blob, { scale: 0, duration: 0.5, ease: "power3.out" });
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: wrap },
  );

  const pad = size === "lg" ? "h-14 px-8 text-base" : "h-12 px-6 text-[15px]";
  const inner = (
    <>
      <span ref={fill} aria-hidden style={{ transform: "scale(0)" }} className={`pointer-events-none absolute rounded-full ${s.fill}`} />
      <span data-label className={`relative z-10 inline-flex items-center gap-2 whitespace-nowrap font-medium transition-colors duration-300 ${s.hoverText}`}>
        {children}
        {arrow && (
          <ArrowUpRight
            weight="bold"
            className="size-4 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:rotate-45"
            aria-hidden
          />
        )}
      </span>
    </>
  );

  const cls = `group relative inline-flex items-center justify-center overflow-hidden rounded-full ${pad} ${s.base} transition-transform duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60`;

  return (
    <span ref={wrap} className={`inline-block will-change-transform ${className}`}>
      {href ? (
        href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") ? (
          <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
            {inner}
          </a>
        ) : (
          <TLink href={href} className={cls}>
            {inner}
          </TLink>
        )
      ) : (
        <button type={type} disabled={disabled} onClick={onClick} className={cls}>
          {inner}
        </button>
      )}
    </span>
  );
}
