import type { Metadata } from "next";
import { wrap } from "@/lib/ui";
import { SplitReveal } from "@/components/SplitReveal";
import { Reveal } from "@/components/Reveal";
import { WorkGrid } from "@/components/WorkGrid";
import { Gallery } from "@/components/Gallery";
import { gallery } from "@/lib/site";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Work",
  description: "Hospitality, jewellery, eyewear and dining brands that trust ArtFlex with their marketing.",
};

export default function WorkPage() {
  return (
    <>
      <section className={`${wrap} pb-16 pt-[calc(var(--nav-h)+4rem)] sm:pb-24 lg:pt-[calc(var(--nav-h)+5.5rem)]`}>
        <SplitReveal hero as="h1" className="display max-w-[13ch] text-[clamp(3.1rem,8.6vw,8rem)]">
          Brands we&apos;ve helped <em>grow.</em>
        </SplitReveal>
        <Reveal hero delay={0.35} as="p" className="mt-8 max-w-[46ch] text-lg leading-relaxed text-ink-soft sm:text-xl">
          Hospitality, jewellery, eyewear, dining and more. A few of the businesses that trust ArtFlex with their growth.
        </Reveal>
      </section>

      <section className={`${wrap} pb-24 sm:pb-36`} aria-label="Clients">
        <WorkGrid />
      </section>

      <section id="recent" className={`${wrap} scroll-mt-24 pb-24 sm:pb-36`}>
        <SplitReveal className="display mb-6 max-w-[16ch] text-[clamp(2.4rem,5vw,4.6rem)]">
          Recent shoots &amp; <em>campaigns</em>
        </SplitReveal>
        <Reveal as="p" className="mb-12 max-w-[50ch] text-lg leading-relaxed text-ink-soft">
          Food launches, cafe content and event coverage, shot and designed by the ArtFlex team. Tap any photo to view it larger.
        </Reveal>
        <Gallery shots={gallery} />
      </section>

      <CTASection
        title={
          <>
            Your brand could be <em>next.</em>
          </>
        }
      />
    </>
  );
}
