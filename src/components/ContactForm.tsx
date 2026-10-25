"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { Check, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { scroller } from "@/lib/stage";
import { roles, services, site } from "@/lib/site";
import { Button } from "./Button";

type Mode = "brand" | "freelancer";
type Status = "idle" | "sending" | "sent" | "error";

const budgets = ["Under ₹25k / month", "₹25k to ₹75k / month", "₹75k to ₹2L / month", "₹2L+ / month", "Not sure yet"];

const field =
  "h-[52px] w-full rounded-[14px] border border-ink/30 bg-white/70 px-4 text-[16px] text-ink placeholder:text-ink-soft/80 transition-[border-color,box-shadow,background-color] duration-300 hover:border-ink/50 focus:border-gold focus:bg-white focus:outline-none focus:ring-4 focus:ring-gold/20 aria-[invalid=true]:border-[#a1302b]";

function Chip({ on, children, onClick }: { on: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-300 active:scale-95 ${
        on ? "border-ink bg-ink text-paper" : "border-ink/25 text-ink hover:border-ink/60"
      }`}
    >
      <span className={`grid overflow-hidden transition-all duration-300 ${on ? "w-4 opacity-100" : "w-0 opacity-0"}`}>
        <Check weight="bold" className="size-4" aria-hidden />
      </span>
      {children}
    </button>
  );
}

function Field({ label, name, error, optional, children }: { label: string; name: string; error?: string; optional?: boolean; children: React.ReactNode }) {
  // `name` here is the prefixed element id
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-semibold text-ink">
        {label} {optional && <span className="font-normal text-ink-soft">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="flex items-center gap-1.5 text-sm font-medium text-[#a1302b]">
          <WarningCircle className="size-4" aria-hidden /> {error}
        </p>
      )}
    </div>
  );
}

/** Custom checkbox: native input kept for accessibility, styled box with a check that pops in. */
function ConsentCheck({ id, name, error, onChange, children }: { id: string; name: string; error?: string; onChange?: () => void; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="group flex cursor-pointer items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          onChange={onChange}
          className="peer sr-only"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border-2 border-ink/45 bg-white/70 text-paper transition-all duration-300 group-hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:ring-4 peer-focus-visible:ring-gold/30 peer-aria-[invalid=true]:border-[#a1302b] [&>svg]:scale-0 [&>svg]:transition-transform [&>svg]:duration-300 peer-checked:[&>svg]:scale-100">
          <Check weight="bold" className="size-3.5" aria-hidden />
        </span>
        <span className="text-[15px] leading-relaxed text-ink-soft">{children}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className="ml-9 flex items-center gap-1.5 text-sm font-medium text-[#a1302b]">
          <WarningCircle className="size-4" aria-hidden /> {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm({ mode = "brand" }: { mode?: Mode }) {
  const root = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [picked, setPicked] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>("");
  const uid = useId().replace(/:/g, "");
  const fid = (n: string) => `${uid}-${n}`;

  // don't show a stale "sent" panel when a visitor navigates back to this page later
  useLayoutEffect(
    () => () => {
      setStatus((s) => (s === "sent" || s === "error" ? "idle" : s));
    },
    [],
  );

  useGSAP(
    () => {
      if (status === "sent") {
        // the success panel is shorter than the form, bring it into view
        const top = root.current!.getBoundingClientRect().top + window.scrollY - 120;
        const lenis = scroller.get();
        if (lenis) lenis.scrollTo(top, { duration: 1.2 });
        else window.scrollTo({ top, behavior: "smooth" });
        gsap.from("[data-sent] > *", { y: 30, autoAlpha: 0, stagger: 0.08, duration: 1 });
        gsap.from("[data-sent-icon]", { scale: 0, rotate: -90, duration: 1.2, ease: "back.out(1.8)" });
      }
    },
    { scope: root, dependencies: [status] },
  );

  const toggle = (v: string) => setPicked((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const next: Record<string, string> = {};
    if (!data.name?.trim()) next.name = "Please tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(data.email ?? "")) next.email = "Please enter a valid email address.";
    if (mode === "freelancer" && !data.portfolio?.trim()) next.portfolio = "Add a link to your portfolio or work samples.";
    if (mode === "freelancer" && picked.length === 0) next.picked = "Pick at least one role.";
    if (mode === "brand" && (data.message ?? "").trim().length < 10) next.message = "A sentence or two about your goals helps us prepare.";
    if (data.consent !== "on") next.consent = "Please give your consent so we can use these details to reply.";
    setErrors(next);
    if (Object.keys(next).length) {
      formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, mode, picked, budget, consent: data.consent === "on", marketing: data.marketing === "on" }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      formRef.current?.reset();
      setPicked([]);
      setBudget("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div ref={root} className="rounded-[var(--radius-card)] bg-white/70 p-8 ring-1 ring-ink/10 sm:p-12" role="status">
        <div data-sent className="flex flex-col items-start gap-5">
          <span data-sent-icon className="grid size-16 place-items-center rounded-full bg-ink text-gold-light">
            <CheckCircle weight="duotone" className="size-9" aria-hidden />
          </span>
          <h3 className="display text-4xl">{mode === "brand" ? "Thank you. We'll be in touch." : "Application received."}</h3>
          <p className="max-w-[44ch] text-lg leading-relaxed text-ink-soft">
            {mode === "brand"
              ? "Someone from our team will reply within one working day to set up a discovery call."
              : "We review every application. If your work fits an upcoming brief, we'll reach out by email."}
          </p>
          <Button variant="outline" arrow={false} onClick={() => setStatus("idle")}>
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  const chips = mode === "brand" ? services.map((s) => s.title) : roles;

  return (
    <div ref={root}>
      <form ref={formRef} noValidate onSubmit={onSubmit} className="relative grid gap-6 rounded-[var(--radius-card)] bg-white/50 p-6 ring-1 ring-ink/10 sm:grid-cols-2 sm:p-10">
        <Field label="Your name" name={fid("name")} error={errors.name}>
          <input id={fid("name")} name="name" autoComplete="name" placeholder="Full name" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${fid("name")}-error` : undefined} />
        </Field>
        <Field label="Email" name={fid("email")} error={errors.email}>
          <input id={fid("email")} name="email" type="email" autoComplete="email" placeholder="you@company.com" className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${fid("email")}-error` : undefined} />
        </Field>
        <Field label="Phone" name={fid("phone")} optional>
          <input id={fid("phone")} name="phone" type="tel" autoComplete="tel" placeholder="+91" className={field} />
        </Field>
        {mode === "brand" ? (
          <Field label="Business name" name={fid("company")} optional>
            <input id={fid("company")} name="company" autoComplete="organization" placeholder="Your brand" className={field} />
          </Field>
        ) : (
          <Field label="City" name={fid("city")} optional>
            <input id={fid("city")} name="city" autoComplete="address-level2" placeholder="Where you work from" className={field} />
          </Field>
        )}

        <fieldset className="sm:col-span-2">
          <legend className="mb-3 text-sm font-semibold text-ink">{mode === "brand" ? "What do you need help with?" : "What do you do?"}</legend>
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <Chip key={c} on={picked.includes(c)} onClick={() => toggle(c)}>
                {c}
              </Chip>
            ))}
          </div>
          {errors.picked && (
            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#a1302b]">
              <WarningCircle className="size-4" aria-hidden /> {errors.picked}
            </p>
          )}
        </fieldset>

        {mode === "brand" ? (
          <fieldset className="sm:col-span-2">
            <legend className="mb-3 text-sm font-semibold text-ink">
              Monthly marketing budget <span className="font-normal text-ink-soft">(optional)</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {budgets.map((b) => (
                <Chip key={b} on={budget === b} onClick={() => setBudget(budget === b ? "" : b)}>
                  {b}
                </Chip>
              ))}
            </div>
          </fieldset>
        ) : (
          <div className="sm:col-span-2">
            <Field label="Portfolio link" name={fid("portfolio")} error={errors.portfolio}>
              <input id={fid("portfolio")} name="portfolio" type="url" placeholder="Behance, Drive, Instagram or website" className={field} aria-invalid={!!errors.portfolio} aria-describedby={errors.portfolio ? `${fid("portfolio")}-error` : undefined} />
            </Field>
          </div>
        )}

        <div className="sm:col-span-2">
          <Field label={mode === "brand" ? "Tell us about your goals" : "Anything else we should know?"} name={fid("message")} error={errors.message} optional={mode === "freelancer"}>
            <textarea
              id={fid("message")}
              name="message"
              rows={5}
              placeholder={mode === "brand" ? "What are you selling, who to, and what would success look like?" : "Experience, tools, availability"}
              className={`${field} h-auto resize-y py-3.5 leading-relaxed`}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? `${fid("message")}-error` : undefined}
            />
          </Field>
        </div>

        {/* Consent: required for processing, marketing is a separate opt-in (DPDP Act) */}
        <fieldset className="grid gap-4 rounded-2xl bg-paper-2/70 p-5 sm:col-span-2">
          <legend className="sr-only">Your consent</legend>
          <ConsentCheck id={fid("consent")} name="consent" error={errors.consent} onChange={() => setErrors((e) => ({ ...e, consent: "" }))}>
            {mode === "brand"
              ? "I agree to ArtFlex collecting and using the details above to respond to my enquiry, as described in the "
              : "I agree to ArtFlex collecting and using the details above to review my application and contact me about freelance work, as described in the "}
            <a href="/privacy-policy" target="_blank" rel="noreferrer" className="font-medium text-ink underline underline-offset-2">
              privacy policy
            </a>
            . I can withdraw consent at any time.
          </ConsentCheck>
          <ConsentCheck id={fid("marketing")} name="marketing">
            Optional: send me occasional updates, offers and marketing insights from ArtFlex by email or WhatsApp.
          </ConsentCheck>
        </fieldset>

        {/* honeypot: real visitors never see or fill this */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Leave this empty
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-soft">We reply within one working day.</p>
          <Button type="submit" size="lg" disabled={status === "sending"}>
            {status === "sending" ? "Sending" : mode === "brand" ? "Send message" : "Apply now"}
          </Button>
        </div>

        {status === "error" && (
          <p role="alert" className="flex items-start gap-2 rounded-2xl bg-[#a1302b]/10 px-4 py-3 text-sm font-medium text-[#7d221e] sm:col-span-2">
            <WarningCircle className="mt-0.5 size-5 shrink-0" aria-hidden />
            <span>
              Something went wrong sending your message. Please try again, or email us at{" "}
              <a href={`mailto:${site.email}`} className="underline underline-offset-2">
                {site.email}
              </a>
              .
            </span>
          </p>
        )}
      </form>
    </div>
  );
}
