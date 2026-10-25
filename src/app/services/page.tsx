import type { Metadata } from "next";
import { wrap } from "@/lib/ui";
import { faqs, process } from "@/lib/site";
import { SplitReveal } from "@/components/SplitReveal";
import { Reveal } from "@/components/Reveal";
import { ServiceStack } from "@/components/ServiceStack";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { Accordion } from "@/components/Accordion";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Services",
  description: "Performance marketing, social media management, branding, content production, websites and SEO from ArtFlex.",
};

export default function ServicesPage() {
  return (
    <>
      <section className={`${wrap} pb-16 pt-[calc(var(--nav-h)+4rem)] sm:pb-24 lg:pt-[calc(var(--nav-h)+5.5rem)]`}>
        <Reveal hero as="p" className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-gold-deep">
          Services
        </Reveal>
        <SplitReveal hero as="h1" className="display max-w-[15ch] text-[clamp(3.1rem,8.6vw,8rem)]" delay={0.05}>
          Services built around <em>results.</em>
        </SplitReveal>
        <Reveal hero delay={0.35} as="p" className="mt-8 max-w-[46ch] text-lg leading-relaxed text-ink-soft sm:text-xl">
          From the first ad to the hundredth reel, everything we make is designed to be measured and improved.
        </Reveal>
      </section>

      <section className={`${wrap} pb-24 sm:pb-36`} aria-label="Our services">
        <ServiceStack />
      </section>

      <section className="bg-paper-2 py-24 sm:py-36">
        <div className={`${wrap} grid gap-14 lg:grid-cols-12`}>
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
              <SplitReveal className="display text-[clamp(2.4rem,5vw,4.6rem)]">
                How we <em>work</em>
              </SplitReveal>
              <Reveal as="p" delay={0.15} className="mt-6 max-w-[40ch] text-lg leading-relaxed text-ink-soft">
                A simple, transparent process, so you always know what is happening and why.
              </Reveal>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ProcessTimeline steps={process} />
          </div>
        </div>
      </section>

      <section className={`${wrap} grid gap-12 py-24 sm:py-36 lg:grid-cols-12`}>
        <div className="lg:col-span-4">
          <SplitReveal className="display text-[clamp(2.4rem,5vw,4.6rem)]">
            Questions, <em>answered</em>
          </SplitReveal>
        </div>
        <Reveal className="lg:col-span-8">
          <Accordion items={faqs} />
        </Reveal>
      </section>

      <CTASection />
    </>
  );
}
