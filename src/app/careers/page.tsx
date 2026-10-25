import type { Metadata } from "next";
import { Briefcase, GlobeHemisphereEast, Lightning, TrendUp, Asterisk } from "@phosphor-icons/react/ssr";
import { wrap } from "@/lib/ui";
import { roles } from "@/lib/site";
import { SplitReveal } from "@/components/SplitReveal";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";
import { Marquee } from "@/components/Marquee";
import { StepsLine } from "@/components/StepsLine";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the ArtFlex freelance collective. We hire designers, editors, writers and marketers from across India.",
};

const perks = [
  { Icon: GlobeHemisphereEast, title: "Work from anywhere", body: "Our network spans the country. All you need is good work and a reliable connection." },
  { Icon: Briefcase, title: "Real brands", body: "Hotels, retailers, restaurants and growing businesses with real budgets and real goals." },
  { Icon: Lightning, title: "Clear briefs", body: "Every job comes with a proper brief, references and a single point of contact." },
  { Icon: TrendUp, title: "Grow with us", body: "Consistent freelancers get more work, bigger accounts and a voice in the creative." },
];

const steps = [
  { title: "Apply", body: "Share your portfolio and the kind of work you love doing." },
  { title: "Get matched", body: "When a brief fits your skills, we reach out with the details." },
  { title: "Deliver", body: "Work with our core team on feedback until it's right." },
  { title: "Get paid", body: "Clear rates agreed upfront, paid on completion." },
];

export default function CareersPage() {
  return (
    <>
      <section className={`${wrap} pb-16 pt-[calc(var(--nav-h)+4rem)] sm:pb-24 lg:pt-[calc(var(--nav-h)+5.5rem)]`}>
        <Reveal hero as="p" className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-gold-deep">
          The ArtFlex collective
        </Reveal>
        <SplitReveal hero as="h1" className="display max-w-[14ch] text-[clamp(3.1rem,8.6vw,8rem)]" delay={0.05}>
          Do your best work, <em>from anywhere.</em>
        </SplitReveal>
        <Reveal hero delay={0.35} as="p" className="mt-8 max-w-[46ch] text-lg leading-relaxed text-ink-soft sm:text-xl">
          We hire talented freelancers across India. Real brands, clear briefs and room to grow.
        </Reveal>
        <Reveal hero delay={0.5} className="mt-10">
          <Button href="/careers#apply" size="lg">
            Apply now
          </Button>
        </Reveal>
      </section>

      <section aria-label="Roles we hire for" className="border-y border-ink/10 py-8 sm:py-10">
        <Marquee speed={30}>
          {roles.map((r) => (
            <span key={r} className="mx-6 flex items-center gap-12 font-display text-[clamp(2.2rem,5vw,4.4rem)] italic text-ink sm:mx-8">
              {r}
              <Asterisk weight="bold" className="size-8 text-gold" aria-hidden />
            </span>
          ))}
        </Marquee>
      </section>

      {/* Perks bento: 4 items, 4 cells */}
      <section className={`${wrap} py-24 sm:py-36`}>
        <SplitReveal className="display mb-12 max-w-[16ch] text-[clamp(2.4rem,5vw,4.6rem)]">
          Why freelancers <em>stay</em> with us
        </SplitReveal>
        <Reveal stagger={0.1} className="grid gap-4 md:grid-cols-12">
          {perks.map(({ Icon, title, body }, i) => {
            const layout = ["md:col-span-7 bg-ink text-paper on-ink", "md:col-span-5 bg-paper-2", "md:col-span-5 bg-gradient-to-br from-[#efe3c6] via-[#e2cc96] to-[#cfae68]", "md:col-span-7 bg-white ring-1 ring-ink/10"][i];
            const dark = i === 0;
            return (
              <div key={title} className={`group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[var(--radius-card)] p-8 sm:p-10 ${layout}`}>
                <span
                  aria-hidden
                  className={`absolute -right-16 -top-16 size-48 rounded-full border transition-transform duration-1000 ease-[var(--ease-expo)] group-hover:scale-125 ${dark ? "border-gold-light/25" : "border-ink/10"}`}
                />
                <Icon weight="duotone" className={`size-10 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:-rotate-12 group-hover:scale-110 ${dark ? "text-gold-light" : "text-gold-deep"}`} aria-hidden />
                <div className="mt-10">
                  <h3 className="display text-3xl sm:text-4xl">{title}</h3>
                  <p className={`mt-3 max-w-[42ch] text-lg leading-relaxed ${dark ? "text-paper/80" : "text-ink-soft"}`}>{body}</p>
                </div>
              </div>
            );
          })}
        </Reveal>
      </section>

      <section className="bg-paper-2 py-24 sm:py-32">
        <div className={wrap}>
          <SplitReveal className="display mb-14 text-[clamp(2.4rem,5vw,4.6rem)]">
            How it <em>works</em>
          </SplitReveal>
          <StepsLine steps={steps} />
        </div>
      </section>

      <section id="apply" className={`${wrap} grid scroll-mt-24 gap-12 py-24 sm:py-36 lg:grid-cols-12`}>
        <div className="lg:col-span-4">
          <SplitReveal className="display text-[clamp(2.4rem,5vw,4.6rem)]">
            Apply to the <em>collective</em>
          </SplitReveal>
          <Reveal as="p" delay={0.15} className="mt-6 max-w-[36ch] text-lg leading-relaxed text-ink-soft">
            Tell us what you do best. We keep every application on file and reach out when the right brief comes in.
          </Reveal>
        </div>
        <Reveal className="lg:col-span-8">
          <ContactForm mode="freelancer" />
        </Reveal>
      </section>
    </>
  );
}
