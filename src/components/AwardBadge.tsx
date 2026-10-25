"use client";

import { useId } from "react";

/** Circular "Two-time Odisha Gaurav Award winner" seal with slowly spinning text. */
export function AwardBadge({ className = "", tone = "paper" }: { className?: string; tone?: "paper" | "ink" }) {
  const onInk = tone === "ink";
  const pathId = `award-${useId().replace(/:/g, "")}`;
  return (
    // outer element takes positioning/size from the caller; inner owns the layout
    <div className={className} role="img" aria-label="Two-time Odisha Gaurav Award winner">
      <div
        className={`relative grid aspect-square w-full place-items-center rounded-full ${onInk ? "bg-ink text-paper" : "bg-paper text-ink"} shadow-[0_20px_60px_-25px_rgb(14_26_51/0.45)]`}
      >
        <svg viewBox="0 0 200 200" className="absolute inset-0 size-full motion-safe:animate-spin-slow" aria-hidden>
          <defs>
            <path id={pathId} d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
          </defs>
          <text className="fill-current font-sans text-[13px] font-semibold uppercase tracking-[0.22em]">
            <textPath href={`#${pathId}`}>Two-time Odisha Gaurav Award winner · </textPath>
          </text>
        </svg>
        <span className="absolute inset-[22%] rounded-full border border-gold/50" aria-hidden />
        <span className={`relative font-display text-[2.1em] italic leading-none ${onInk ? "text-gold-light" : "text-gold-deep"}`} aria-hidden>
          2&times;
        </span>
      </div>
    </div>
  );
}
