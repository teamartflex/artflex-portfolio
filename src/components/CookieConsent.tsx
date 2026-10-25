"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Cookie } from "@phosphor-icons/react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { stage } from "@/lib/stage";
import { OPEN_SETTINGS_EVENT, readConsent, saveConsent, type ConsentChoice } from "@/lib/consent";
import { TLink } from "./Transition";

type Mode = "hidden" | "banner" | "prefs";

const categories: { key: keyof ConsentChoice | "necessary"; title: string; body: string }[] = [
  { key: "necessary", title: "Essential", body: "Remember your cookie choice and keep the site working. Always on." },
  { key: "analytics", title: "Analytics", body: "Help us understand which pages are useful, using anonymous visit statistics." },
  { key: "marketing", title: "Marketing", body: "Let ad platforms like Meta and Google measure our campaigns and show relevant ads." },
];

function Switch({ checked, disabled, onChange, labelledBy }: { checked: boolean; disabled?: boolean; onChange?: () => void; labelledBy: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      disabled={disabled}
      onClick={onChange}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${checked ? "bg-ink" : "bg-ink/20"}`}
    >
      <span
        className={`absolute left-1 top-1 size-5 rounded-full bg-paper shadow transition-transform duration-500 ease-[var(--ease-expo)] ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

/**
 * Cookie consent banner. Slides in once the intro has finished, offers
 * equally weighted Accept / Reject buttons plus per-category preferences,
 * and can be reopened any time from the footer's "Cookie settings" link.
 */
export function CookieConsent() {
  const panel = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("hidden");
  const [choice, setChoice] = useState<ConsentChoice>({ analytics: false, marketing: false });
  const ids = useId();

  useEffect(() => {
    let timer: number | undefined;
    const off = readConsent()
      ? () => {}
      : stage.onOpen(() => {
          timer = window.setTimeout(() => setMode("banner"), 900);
        });
    const reopen = () => {
      const current = readConsent();
      setChoice({ analytics: !!current?.analytics, marketing: !!current?.marketing });
      setMode("prefs");
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => {
      off();
      window.clearTimeout(timer);
      window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
    };
  }, []);

  useGSAP(
    () => {
      if (mode === "hidden" || prefersReducedMotion()) return;
      gsap.fromTo(panel.current, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: "expo.out" });
    },
    { dependencies: [mode === "hidden"] },
  );

  const decide = (c: ConsentChoice) => {
    saveConsent(c);
    const done = () => setMode("hidden");
    if (prefersReducedMotion()) return done();
    gsap.to(panel.current, { y: 30, autoAlpha: 0, duration: 0.45, ease: "power3.in", onComplete: done });
  };

  if (mode === "hidden") return null;

  return (
    <div
      ref={panel}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`${ids}-title`}
      aria-describedby={`${ids}-desc`}
      data-lenis-prevent
      className="fixed inset-x-3 bottom-3 z-[70] max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-[var(--radius-card)] bg-paper p-6 text-ink shadow-[0_30px_80px_-20px_rgb(14_26_51/0.45)] ring-1 ring-ink/10 sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-[440px] sm:p-7"
    >
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-gold-light">
          <Cookie weight="duotone" className="size-6" aria-hidden />
        </span>
        <div>
          <h2 id={`${ids}-title`} className="display text-2xl">
            {mode === "prefs" ? "Cookie preferences" : "We value your privacy"}
          </h2>
          <p id={`${ids}-desc`} className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            We use essential cookies to run this site. With your permission we&apos;d also use analytics and marketing cookies. Read our{" "}
            <TLink href="/cookie-policy" className="font-medium text-ink underline underline-offset-2">
              cookie policy
            </TLink>{" "}
            and{" "}
            <TLink href="/privacy-policy" className="font-medium text-ink underline underline-offset-2">
              privacy policy
            </TLink>
            .
          </p>
        </div>
      </div>

      {mode === "prefs" && (
        <ul className="mt-6 space-y-3">
          {categories.map((c) => {
            const on = c.key === "necessary" ? true : choice[c.key];
            const labelId = `${ids}-${c.key}`;
            return (
              <li key={c.key} className="flex items-start justify-between gap-4 rounded-2xl bg-paper-2 p-4">
                <div>
                  <p id={labelId} className="font-semibold">
                    {c.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{c.body}</p>
                </div>
                <Switch
                  checked={on}
                  disabled={c.key === "necessary"}
                  labelledBy={labelId}
                  onChange={c.key === "necessary" ? undefined : () => setChoice((p) => ({ ...p, [c.key]: !p[c.key as keyof ConsentChoice] }))}
                />
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-6 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => decide({ analytics: false, marketing: false })}
          className="h-11 rounded-full border border-ink/30 text-sm font-semibold transition-colors duration-300 hover:border-ink hover:bg-ink/5 active:scale-[0.97]"
        >
          Reject optional
        </button>
        <button
          type="button"
          onClick={() => decide({ analytics: true, marketing: true })}
          className="h-11 rounded-full bg-ink text-sm font-semibold text-paper transition-colors duration-300 hover:bg-gold hover:text-ink active:scale-[0.97]"
        >
          Accept all
        </button>
        {mode === "prefs" ? (
          <button
            type="button"
            onClick={() => decide(choice)}
            className="col-span-2 h-11 rounded-full bg-gold-light text-sm font-semibold text-ink transition-colors duration-300 hover:bg-gold active:scale-[0.97]"
          >
            Save my choices
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setMode("prefs")}
            className="col-span-2 h-10 text-sm font-semibold text-ink underline-offset-4 hover:underline"
          >
            Manage preferences
          </button>
        )}
      </div>
    </div>
  );
}
