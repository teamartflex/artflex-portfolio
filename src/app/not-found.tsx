import { wrap } from "@/lib/ui";
import { SplitReveal } from "@/components/SplitReveal";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <section className={`${wrap} flex min-h-[100dvh] flex-col items-start justify-center pt-[var(--nav-h)]`}>
      <p className="font-display text-[clamp(6rem,20vw,14rem)] italic leading-none text-gold">404</p>
      <SplitReveal hero as="h1" className="display mt-4 text-[clamp(2.4rem,5vw,4.4rem)]">
        This page wandered <em>off.</em>
      </SplitReveal>
      <Reveal hero delay={0.3} className="mt-10">
        <Button href="/">Back to home</Button>
      </Reveal>
    </section>
  );
}
