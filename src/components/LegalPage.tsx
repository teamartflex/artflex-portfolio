import type { ReactNode } from "react";
import { wrap } from "@/lib/ui";
import { SplitReveal } from "./SplitReveal";
import { Reveal } from "./Reveal";

/** Shared shell for policy pages: animated title, effective date and readable prose column. */
export function LegalPage({ title, updated, intro, children }: { title: ReactNode; updated: string; intro: string; children: ReactNode }) {
  return (
    <section className={`${wrap} grid gap-12 pb-24 pt-[calc(var(--nav-h)+4rem)] sm:pb-36 lg:grid-cols-12 lg:pt-[calc(var(--nav-h)+5.5rem)]`}>
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
          <SplitReveal hero as="h1" className="display text-[clamp(2.8rem,6vw,5rem)]">
            {title}
          </SplitReveal>
          <Reveal hero delay={0.3} as="p" className="mt-6 text-ink-soft">
            Last updated {updated}
          </Reveal>
        </div>
      </div>
      <Reveal hero delay={0.35} className="legal lg:col-span-7 lg:col-start-6">
        <p className="!text-xl !text-ink">{intro}</p>
        {children}
      </Reveal>
    </section>
  );
}
