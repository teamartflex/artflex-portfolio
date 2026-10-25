import { ArrowUpRight, MapPinLine, UsersThree } from "@phosphor-icons/react/ssr";
import { wrap } from "@/lib/ui";
import { clients, stripOnlyLogos } from "@/lib/site";
import { SplitReveal } from "@/components/SplitReveal";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";
import { HeroMark } from "@/components/HeroMark";
import { Marquee } from "@/components/Marquee";
import { ClientLogo } from "@/components/ClientLogo";
import { WordScrub } from "@/components/WordScrub";
import { HorizontalServices } from "@/components/HorizontalServices";
import { StudioCollage } from "@/components/StudioCollage";
import { Counter } from "@/components/Counter";
import { AwardBadge } from "@/components/AwardBadge";
import { WorkList } from "@/components/WorkList";
import { CTASection } from "@/components/CTASection";
import { TLink } from "@/components/Transition";

export default function Home() {
  return (
    <>
      {/* Hero: asymmetric split, copy left, live monogram right */}
      <section className={`${wrap} grid min-h-[100dvh] items-center gap-10 pb-12 pt-[calc(var(--nav-h)+2rem)] lg:grid-cols-12 lg:gap-6 lg:pb-16`}>
        <div className="lg:col-span-7">
          <Reveal hero as="p" className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-gold-deep">
            Digital &amp; performance marketing
          </Reveal>
          <SplitReveal hero as="h1" className="display text-[clamp(3.1rem,8.2vw,7.4rem)]" delay={0.05}>
            Attention, turned into <em>revenue.</em>
          </SplitReveal>
          <Reveal hero delay={0.35} as="p" className="mt-7 max-w-[44ch] text-lg leading-relaxed text-ink-soft sm:text-xl">
            An award-winning studio from Odisha, building brands people notice, trust and buy from.
          </Reveal>
          <Reveal hero delay={0.5} stagger={0.1} className="mt-10 flex flex-wrap items-center gap-3">
            <Button href="/contact" size="lg">
              Start a project
            </Button>
            <Button href="/work" variant="outline" size="lg">
              See our work
            </Button>
          </Reveal>
        </div>
        <div className="lg:col-span-5">
          <HeroMark />
        </div>
      </section>

      {/* Client logo wall */}
      <section aria-label="Clients" className="border-y border-ink/10 py-10 sm:py-14">
        <Reveal as="p" className={`${wrap} mb-8 text-center text-ink-soft`}>
          Brands we&apos;ve grown with
        </Reveal>
        <Marquee speed={60} label="Client logos">
          {clients.map((c) => (
            <TLink key={c.slug} href={`/work#${c.slug}`} className="group mx-8 grid h-24 place-items-center sm:mx-14" aria-label={c.name}>
              <ClientLogo client={c} height={72} className="group-hover:scale-110 group-hover:!bg-gold-deep" />
            </TLink>
          ))}
          {stripOnlyLogos.map((c) => (
            <span key={c.slug} className="group mx-8 grid h-24 place-items-center sm:mx-14">
              <ClientLogo client={c} height={72} className="group-hover:scale-110 group-hover:!bg-gold-deep" />
            </span>
          ))}
        </Marquee>
      </section>

      {/* Manifesto */}
      <section className={`${wrap} py-28 sm:py-40`}>
        <WordScrub
          className="display mx-auto max-w-[22ch] text-center text-[clamp(2.1rem,5vw,4.6rem)] leading-[1.12]"
          text="We are strategists, designers, filmmakers and media buyers under one roof. Every rupee we spend for you is tracked, tested and pushed toward growth you can measure."
        />
      </section>

      <HorizontalServices />

      <StudioCollage />

      {/* Award */}
      <section className={`${wrap} grid items-center gap-12 py-24 sm:py-36 lg:grid-cols-12`}>
        <div className="flex items-center gap-6 sm:gap-10 lg:col-span-6">
          <p aria-hidden className="font-display text-[clamp(9rem,26vw,21rem)] italic leading-[0.85] text-gold">
            <Counter to={2} />
            <span className="ml-2 text-[0.5em]">&times;</span>
          </p>
          <AwardBadge className="w-32 shrink-0 text-[14px] sm:w-44 sm:text-[17px]" />
        </div>
        <div className="lg:col-span-6">
          <SplitReveal className="display text-[clamp(2.4rem,4.8vw,4.4rem)]">
            Two-time winner of the <em>Odisha Gaurav</em> Award.
          </SplitReveal>
          <Reveal as="p" delay={0.2} className="mt-6 max-w-[46ch] text-lg leading-relaxed text-ink-soft">
            Recognised twice for our work in digital marketing in Odisha. We treat it as a standard to keep, not a trophy to polish.
          </Reveal>
          <Reveal delay={0.3} className="mt-8">
            <TLink href="/about" className="link-underline inline-flex items-center gap-2 font-medium">
              Our story <ArrowUpRight className="size-4" aria-hidden />
            </TLink>
          </Reveal>
        </div>
      </section>

      {/* Freelance collective bento: 4 items, 4 cells */}
      <section className={`${wrap} pb-24 sm:pb-36`}>
        <SplitReveal className="display mb-12 max-w-[18ch] text-[clamp(2.4rem,5vw,4.6rem)]">
          A national bench of <em>creative</em> talent.
        </SplitReveal>
        <Reveal stagger={0.12} className="grid gap-4 md:grid-cols-6 md:grid-rows-[auto_auto]">
          <div className="flex flex-col justify-between gap-10 rounded-[var(--radius-card)] bg-paper-2 p-8 sm:p-10 md:col-span-4 md:row-span-2">
            <UsersThree weight="duotone" className="size-12 text-gold-deep" aria-hidden />
            <div>
              <p className="display max-w-[20ch] text-3xl sm:text-[2.6rem]">
                Specialists for every job, without agency bloat.
              </p>
              <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
                Our core team leads strategy and quality. For each brief we bring in hand-picked freelancers from across India, so you get the right designer, editor or media buyer every time.
              </p>
            </div>
          </div>
          <div className="on-ink relative overflow-hidden rounded-[var(--radius-card)] bg-ink p-8 text-paper md:col-span-2">
            <span aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full border border-gold-light/25" />
            <MapPinLine weight="duotone" className="size-9 text-gold-light" aria-hidden />
            <p className="display mt-8 text-3xl">Talent from across the nation</p>
            <p className="mt-3 text-paper/75">Designers, editors, writers and media buyers, wherever they live.</p>
          </div>
          <TLink
            href="/careers"
            className="group relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-card)] bg-gradient-to-br from-[#efe3c6] via-[#e2cc96] to-[#cfae68] p-8 md:col-span-2"
          >
            <p className="text-ink/80">Freelancer?</p>
            <p className="display mt-10 flex items-end justify-between gap-4 text-3xl">
              Join the collective
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ink text-paper transition-transform duration-500 ease-[var(--ease-expo)] group-hover:rotate-45 group-hover:scale-110">
                <ArrowUpRight className="size-5" aria-hidden />
              </span>
            </p>
          </TLink>
        </Reveal>
      </section>

      {/* Work index */}
      <section className={`${wrap} pb-16`}>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <SplitReveal className="display text-[clamp(2.4rem,5vw,4.6rem)]">
            Selected <em>clients</em>
          </SplitReveal>
          <Reveal>
            <Button href="/work" variant="outline">
              See our work
            </Button>
          </Reveal>
        </div>
        <WorkList />
      </section>

      <CTASection />
    </>
  );
}
