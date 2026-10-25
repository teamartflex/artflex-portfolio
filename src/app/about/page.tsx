import type { Metadata } from "next";
import Image from "next/image";
import { wrap } from "@/lib/ui";
import { studio } from "@/lib/site";
import { SplitReveal } from "@/components/SplitReveal";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";
import { AwardBadge } from "@/components/AwardBadge";
import { Parallax } from "@/components/Parallax";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "About",
  description: "ArtFlex is an Odisha-born, two-time Odisha Gaurav Award winning marketing studio, powered by freelance talent from across India.",
};

const values = [
  { title: "Measure everything", body: "If it can't be tracked, it can't be improved. Every campaign starts with clear numbers and honest reporting." },
  { title: "Craft that sells", body: "Beautiful work matters, but only when it moves people to call, visit or buy." },
  { title: "Local insight, national talent", body: "We understand Odisha's markets first hand and bring in the best specialists from across the country." },
  { title: "Straight answers", body: "Plain-language reports, realistic timelines and no jargon. You always know where your money is going." },
];

export default function AboutPage() {
  return (
    <>
      <section className={`${wrap} pb-20 pt-[calc(var(--nav-h)+4rem)] sm:pb-28 lg:pt-[calc(var(--nav-h)+5.5rem)]`}>
        <SplitReveal hero as="h1" className="display max-w-[14ch] text-[clamp(3.1rem,8.6vw,8rem)]">
          Odisha roots, <em>national</em> reach.
        </SplitReveal>
        <div className="mt-10 grid gap-8 md:grid-cols-12">
          <Reveal hero delay={0.35} as="p" className="max-w-[46ch] text-lg leading-relaxed text-ink-soft sm:text-xl md:col-span-6 md:col-start-7">
            ArtFlex began with a simple belief: local brands deserve marketing as sharp as any metro agency&apos;s.
          </Reveal>
        </div>
      </section>

      {/* Story: sticky logo lockup + text */}
      <section className={`${wrap} grid gap-14 pb-24 sm:pb-36 lg:grid-cols-12`}>
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
            <Parallax speed={-8} className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-ink/10">
              <span aria-hidden className="absolute inset-[8%] rounded-full border border-gold/30" />
              <span aria-hidden className="absolute inset-[16%] rounded-full border border-dashed border-gold/30 motion-safe:animate-spin-slow" />
              <Image src="/brand/logo.png" alt="ArtFlex logo" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-contain p-[18%]" />
            </Parallax>
          </div>
        </div>
        <div className="space-y-16 lg:col-span-6 lg:col-start-7 lg:pt-10">
          <div>
            <SplitReveal className="display text-[clamp(2.2rem,4.2vw,3.8rem)]">
              Started close to <em>home.</em>
            </SplitReveal>
            <Reveal as="p" className="mt-6 text-lg leading-relaxed text-ink-soft">
              We began by helping businesses we knew well: hotels, jewellers, eyewear stores and restaurants with great products that weren&apos;t being found online. We learned what makes customers here pick up the phone, and what makes them scroll past.
            </Reveal>
          </div>
          <div>
            <SplitReveal className="display text-[clamp(2.2rem,4.2vw,3.8rem)]">
              Built with talent from <em>everywhere.</em>
            </SplitReveal>
            <Reveal as="p" className="mt-6 text-lg leading-relaxed text-ink-soft">
              As our clients grew, so did we. Today a core team in Odisha leads every account, supported by freelancers we&apos;ve hired from across India. It keeps our work fresh, our costs honest and gives talented people real opportunities wherever they live.
            </Reveal>
          </div>
          <div>
            <SplitReveal className="display text-[clamp(2.2rem,4.2vw,3.8rem)]">
              Recognised, <em>twice.</em>
            </SplitReveal>
            <Reveal as="p" className="mt-6 text-lg leading-relaxed text-ink-soft">
              ArtFlex has received the Odisha Gaurav Award two times. It&apos;s a proud moment for the team, and a reminder that the people we work with expect our best every month.
            </Reveal>
          </div>
        </div>
      </section>

      {/* Behind the scenes: staggered portrait trio */}
      <section className={`${wrap} pb-24 sm:pb-36`}>
        <SplitReveal className="display mb-12 text-[clamp(2.4rem,5vw,4.6rem)]">
          Behind the <em>scenes</em>
        </SplitReveal>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
          {studio.map((s, i) => (
            <Parallax key={s.src} speed={[-6, 10, -12][i]} className={`${["", "md:mt-24", "col-span-2 mx-auto w-1/2 md:col-span-1 md:mx-0 md:mt-8 md:w-full"][i]}`}>
              <Reveal as="figure" delay={i * 0.12}>
                <div className="group relative aspect-[3/4] overflow-hidden rounded-[18px]">
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 768px) 30vw, 46vw"
                    className="object-cover object-top transition-transform duration-1000 ease-[var(--ease-expo)] group-hover:scale-[1.05]"
                  />
                </div>
                <figcaption className="mt-3 text-[15px] text-ink-soft">{s.caption}</figcaption>
              </Reveal>
            </Parallax>
          ))}
        </div>
      </section>

      {/* Values: hover-expanding rows */}
      <section className="bg-paper-2 py-24 sm:py-36">
        <div className={wrap}>
          <SplitReveal className="display mb-14 text-[clamp(2.4rem,5vw,4.6rem)]">
            What we <em>stand</em> for
          </SplitReveal>
          <Reveal stagger={0.1} as="ul" className="border-t border-ink/15">
            {values.map((v) => (
              <li key={v.title} className="group relative grid gap-3 border-b border-ink/15 py-8 md:grid-cols-12 md:items-center md:gap-8 md:py-10">
                <span aria-hidden className="absolute bottom-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100" />
                <h3 className="display text-[clamp(1.9rem,3.6vw,3.2rem)] transition-transform duration-700 ease-[var(--ease-expo)] md:col-span-6 md:group-hover:translate-x-4">
                  {v.title}
                </h3>
                <p className="max-w-[46ch] text-lg leading-relaxed text-ink-soft transition-colors duration-500 group-hover:text-ink md:col-span-5 md:col-start-8">
                  {v.body}
                </p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Award statement */}
      <section className={`${wrap} flex flex-col items-center py-24 text-center sm:py-36`}>
        <Reveal>
          <AwardBadge className="w-44 text-[17px] sm:w-56 sm:text-[20px]" />
        </Reveal>
        <SplitReveal className="display mt-12 max-w-[18ch] text-[clamp(2.4rem,5.4vw,5rem)]">
          Twice honoured with the <em>Odisha Gaurav</em> Award.
        </SplitReveal>
        <Reveal delay={0.2} className="mt-10">
          <Button href="/work">See our work</Button>
        </Reveal>
      </section>

      <CTASection />
    </>
  );
}
