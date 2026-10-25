"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { scroller } from "@/lib/stage";
import { nav, site } from "@/lib/site";
import { TLink } from "./Transition";
import { Button } from "./Button";

export function Nav() {
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);

  // hide on scroll down, reveal on scroll up; solid backdrop once scrolled
  useGSAP(() => {
    const el = bar.current!;
    const hide = ScrollTrigger.create({
      start: "top -120",
      end: "max",
      onUpdate: (self) => {
        gsap.to(el, { yPercent: self.direction === 1 ? -110 : 0, duration: 0.6, ease: "power3.out", overwrite: true });
      },
      onLeaveBack: () => gsap.to(el, { yPercent: 0, duration: 0.6, overwrite: true }),
    });
    const tint = ScrollTrigger.create({
      start: "top -10",
      end: "max",
      onToggle: (self) => (el.dataset.scrolled = String(self.isActive)),
    });
    return () => {
      hide.kill();
      tint.kill();
    };
  });

  // menu timeline: circular wipe from the burger, then links rise in
  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      tl.current = gsap
        .timeline({ paused: true })
        .set(menu.current, { visibility: "visible" })
        .fromTo(
          menu.current,
          { clipPath: "circle(0% at calc(100% - 44px) 36px)" },
          { clipPath: "circle(150% at calc(100% - 44px) 36px)", duration: reduce ? 0.01 : 1, ease: "expo.inOut" },
        )
        .from("[data-menu-link]", { yPercent: 110, duration: reduce ? 0.01 : 1, stagger: 0.06, ease: "expo.out" }, reduce ? 0 : 0.45)
        .from("[data-menu-foot]", { autoAlpha: 0, y: 20, duration: 0.8 }, reduce ? 0 : 0.7);
    },
    { scope: menu },
  );

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (open) {
      scroller.stop();
      t.timeScale(1).play();
      menu.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    } else {
      scroller.start();
      t.timeScale(1.6).reverse();
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // close the menu if this layout is ever hidden
  useLayoutEffect(() => () => setOpen(false), []);

  return (
    <>
      <header
        ref={bar}
        data-scrolled="false"
        data-open={open}
        className="group/nav fixed inset-x-0 top-0 z-40 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-500 data-[open=true]:z-[60] data-[scrolled=true]:border-ink/10 data-[scrolled=true]:bg-paper/85 data-[scrolled=true]:backdrop-blur-md data-[open=true]:!border-transparent data-[open=true]:!bg-transparent data-[open=true]:!backdrop-blur-none"
      >
        <div className="mx-auto flex h-[var(--nav-h)] max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
          <TLink
            href="/"
            aria-label="ArtFlex home"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 transition-[filter] duration-500 group-data-[open=true]/nav:brightness-0 group-data-[open=true]/nav:invert"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/mark.png" alt="" className="h-10 w-auto transition-transform duration-700 ease-[var(--ease-expo)] group-hover:rotate-[-8deg] group-hover:scale-105" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/wordmark.png" alt="ArtFlex" className="hidden h-[11px] w-auto sm:block" />
          </TLink>

          <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
            {nav.map((item) => (
              <TLink key={item.href} href={item.href} className="link-underline py-1 text-[15px] font-medium text-ink">
                {item.label}
              </TLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button href="/contact" className="hidden transition-opacity duration-300 group-data-[open=true]/nav:pointer-events-none group-data-[open=true]/nav:opacity-0 sm:inline-block">
              Start a project
            </Button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative grid size-12 place-items-center rounded-full border border-ink/20 transition-colors duration-300 hover:bg-ink/5 active:scale-95 group-data-[open=true]/nav:border-paper/30 lg:hidden"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 h-[1.5px] w-full transition-all duration-500 ease-[var(--ease-expo)] ${open ? "top-1/2 rotate-45 bg-paper" : "top-0 bg-ink"}`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] w-full transition-all duration-500 ease-[var(--ease-expo)] ${open ? "top-1/2 -rotate-45 bg-paper" : "top-full bg-ink"}`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menu}
        id="mobile-menu"
        inert={!open}
        className="on-ink invisible fixed inset-0 z-50 flex flex-col justify-between bg-ink px-4 pb-8 pt-28 text-paper sm:px-6 lg:hidden"
      >
        <nav aria-label="Mobile">
          <ul className="space-y-1">
            {[{ label: "Home", href: "/" }, ...nav].map((item) => (
              <li key={item.href} className="overflow-hidden">
                <TLink
                  data-menu-link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="group inline-flex items-baseline gap-4 font-display text-[clamp(2.6rem,11vw,4.5rem)] leading-[1.1] transition-colors duration-300 hover:text-gold-light aria-[current=page]:text-gold-light"
                >
                  <span className="transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-3 group-hover:italic">
                    {item.label}
                  </span>
                </TLink>
              </li>
            ))}
          </ul>
        </nav>
        <div data-menu-foot className="space-y-5 border-t border-paper/15 pt-6">
          <a href={`mailto:${site.email}`} className="block text-lg text-paper/90">
            {site.email}
          </a>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-paper/70">
            {site.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="link-underline">
                {s.label}
              </a>
            ))}
          </div>
          <Button href="/contact" variant="light" onClick={() => setOpen(false)}>
            Start a project
          </Button>
        </div>
      </div>
    </>
  );
}
