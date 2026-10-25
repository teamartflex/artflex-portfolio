import type { Metadata } from "next";
import { EnvelopeSimple, InstagramLogo, MapPin, Phone, WhatsappLogo } from "@phosphor-icons/react/ssr";
import { wrap } from "@/lib/ui";
import { site } from "@/lib/site";
import { SplitReveal } from "@/components/SplitReveal";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with ArtFlex. Tell us about your brand and goals and we'll reply within one working day.",
};

const channels = [
  { Icon: EnvelopeSimple, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { Icon: Phone, label: "Call", value: site.phone, href: site.phoneHref },
  { Icon: WhatsappLogo, label: "WhatsApp", value: site.phone, href: site.whatsapp },
  { Icon: InstagramLogo, label: "Instagram", value: "@artflex_in", href: site.socials[0].href },
  { Icon: MapPin, label: "Based in", value: site.location },
];

export default function ContactPage() {
  return (
    <section className={`${wrap} grid gap-14 pb-24 pt-[calc(var(--nav-h)+4rem)] sm:pb-36 lg:grid-cols-12 lg:pt-[calc(var(--nav-h)+5.5rem)]`}>
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
          <SplitReveal hero as="h1" className="display text-[clamp(3rem,7vw,6.4rem)]">
            Let&apos;s talk about your <em>brand.</em>
          </SplitReveal>
          <Reveal hero delay={0.35} as="p" className="mt-7 max-w-[40ch] text-lg leading-relaxed text-ink-soft sm:text-xl">
            Share a few details and we&apos;ll set up a free discovery call within one working day.
          </Reveal>
          <Reveal hero delay={0.5} stagger={0.08} as="ul" className="mt-12 space-y-3">
            {channels.map(({ Icon, label, value, href }) => {
              const body = (
                <>
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ink text-gold-light transition-transform duration-500 ease-[var(--ease-expo)] group-hover:rotate-[-10deg] group-hover:scale-110">
                    <Icon weight="duotone" className="size-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm text-ink-soft">{label}</span>
                    <span className="block text-lg font-medium text-ink">{value}</span>
                  </span>
                </>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="group flex items-center gap-4 rounded-2xl p-2 transition-colors duration-300 hover:bg-paper-2"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-2">{body}</div>
                  )}
                </li>
              );
            })}
          </Reveal>
        </div>
      </div>
      <Reveal hero delay={0.4} className="lg:col-span-7">
        <ContactForm mode="brand" />
      </Reveal>
    </section>
  );
}
