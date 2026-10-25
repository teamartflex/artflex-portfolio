"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { nav, site } from "@/lib/site";
import { TLink } from "./Transition";
import { CookieSettingsButton } from "./CookieSettingsButton";

/** Navy footer whose content slides up from beneath the page, ending on a giant ARTFLEX wordmark. */
export function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-foot-inner]", {
        yPercent: -35,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
      });
      gsap.from("[data-foot-letter]", {
        yPercent: 100,
        duration: 1.3,
        stagger: 0.05,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-foot-word]", start: "top 98%", once: true },
      });
    },
    { scope: root },
  );

  const year = 2026;

  return (
    <footer ref={root} className="on-ink relative overflow-hidden bg-ink text-paper">
      <div data-foot-inner className="mx-auto max-w-[1400px] px-4 pt-20 sm:px-6 lg:px-10 lg:pt-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="display max-w-sm text-4xl sm:text-5xl">
              Good brands deserve to be <em>found.</em>
            </p>
            <a
              href={`mailto:${site.email}`}
              className="link-underline mt-8 inline-block font-display text-2xl text-gold-light sm:text-3xl"
            >
              {site.email}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7">
            <div>
              <p className="mb-4 text-sm text-paper/60">Explore</p>
              <ul className="space-y-3">
                {[{ label: "Home", href: "/" }, ...nav].map((n) => (
                  <li key={n.href}>
                    <TLink href={n.href} className="link-underline text-paper/90 hover:text-paper">
                      {n.label}
                    </TLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm text-paper/60">Connect</p>
              <ul className="space-y-3">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="link-underline text-paper/90 hover:text-paper">
                      {s.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={site.whatsapp} target="_blank" rel="noreferrer" className="link-underline text-paper/90 hover:text-paper">
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="mb-4 text-sm text-paper/60">Reach us</p>
              <ul className="space-y-3 text-paper/90">
                <li>
                  <a href={site.phoneHref} className="link-underline">
                    {site.phone}
                  </a>
                </li>
                <li>{site.location}</li>
                <li className="text-gold-light">2&times; Odisha Gaurav Award</li>
              </ul>
            </div>
          </div>
        </div>

        <div data-foot-word aria-hidden className="mt-20 flex select-none justify-between overflow-hidden font-display leading-[0.8] tracking-[0.02em] text-[19vw] lg:text-[17.5vw]">
          {"ARTFLEX".split("").map((ch, i) => (
            <span key={i} data-foot-letter className={`inline-block ${i > 2 ? "text-gold-light" : "text-paper"}`}>
              {ch}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-paper/15 py-6 text-sm text-paper/70 md:flex-row md:items-center md:justify-between">
          <p>&copy; {year} ArtFlex. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <TLink href="/privacy-policy" className="link-underline hover:text-paper">
                Privacy policy
              </TLink>
            </li>
            <li>
              <TLink href="/cookie-policy" className="link-underline hover:text-paper">
                Cookie policy
              </TLink>
            </li>
            <li>
              <CookieSettingsButton label="Cookie settings" className="link-underline hover:text-paper" />
            </li>
            <li>
              <TLink href="#top" className="link-underline text-paper/85 hover:text-paper">
                Back to top
              </TLink>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
