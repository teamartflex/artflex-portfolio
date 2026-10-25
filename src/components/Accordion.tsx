"use client";

import { useId, useState } from "react";
import { Plus } from "@phosphor-icons/react";

/** FAQ accordion. Panels animate with the grid-rows trick (no height tweening). */
export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <div className="border-t border-ink/15">
      {items.map((it, i) => {
        const isOpen = open === i;
        const id = `${base}-${i}`;
        return (
          <div key={it.q} className="border-b border-ink/15">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-7"
              >
                <span className="display text-2xl transition-colors duration-300 group-hover:text-gold-deep sm:text-3xl">{it.q}</span>
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-[var(--ease-expo)] ${isOpen ? "rotate-45 border-ink bg-ink text-paper" : "border-ink/25 text-ink group-hover:border-ink"}`}
                >
                  <Plus className="size-4" weight="bold" aria-hidden />
                </span>
              </button>
            </h3>
            <div id={id} role="region" className="accordion-panel" data-open={isOpen}>
              <div>
                <p className="max-w-[62ch] pb-7 text-lg leading-relaxed text-ink-soft">{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
