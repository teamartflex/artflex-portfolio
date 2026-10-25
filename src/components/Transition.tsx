"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, type ComponentProps } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { scroller, stage } from "@/lib/stage";

type Ctx = { navigate: (href: string) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const useTransitionNav = () => useContext(TransitionContext);

/**
 * Page transitions: a navy curtain with the gold monogram rises over the page,
 * the route changes underneath, then the curtain lifts away upwards and the
 * new page's hero entrance plays as it clears.
 */
export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const busy = useRef(false);
  const fallback = useRef<number | undefined>(undefined);

  const uncover = useCallback(() => {
    window.clearTimeout(fallback.current);
    scroller.toTop();
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      // deep links like /work#vayu land on their section while the curtain is still down
      const hash = window.location.hash;
      const target = hash ? document.querySelector<HTMLElement>(hash) : null;
      if (target) {
        const y = target.getBoundingClientRect().top + window.scrollY - 100;
        const lenis = scroller.get();
        if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
        else window.scrollTo(0, y);
      }
      const el = panel.current!;
      gsap.timeline({
        onComplete: () => {
          gsap.set(el, { yPercent: 100, visibility: "hidden" });
          busy.current = false;
          scroller.start();
        },
      })
        .add(() => stage.setCovering(false), 0.15)
        .to(el.querySelector("[data-mark]"), { y: -30, autoAlpha: 0, duration: 0.5, ease: "power3.in" }, 0)
        .to(el, { yPercent: -100, duration: 1, ease: "expo.inOut" }, 0.05);
    });
  }, []);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        const target = url.hash ? document.querySelector<HTMLElement>(url.hash) : null;
        const lenis = scroller.get();
        if (lenis) lenis.scrollTo(target ?? 0, { offset: -90, duration: 1.4 });
        else (target ?? document.documentElement).scrollIntoView({ behavior: "smooth" });
        return;
      }
      if (busy.current) return;

      if (prefersReducedMotion()) {
        router.push(href);
        return;
      }

      busy.current = true;
      pending.current = true;
      stage.setCovering(true);
      scroller.stop();
      const el = panel.current!;
      gsap.set(el, { yPercent: 100, visibility: "visible" });
      gsap.set(el.querySelector("[data-mark]"), { y: 30, autoAlpha: 0 });
      gsap.timeline({
        onComplete: () => {
          router.push(href, { scroll: false });
          // safety net if the route never resolves
          fallback.current = window.setTimeout(() => {
            if (pending.current) {
              pending.current = false;
              uncover();
            }
          }, 5000);
        },
      })
        .to(el, { yPercent: 0, duration: 0.85, ease: "expo.inOut" })
        .to(el.querySelector("[data-mark]"), { y: 0, autoAlpha: 1, duration: 0.6 }, 0.45);
    },
    [router, uncover],
  );

  useEffect(() => {
    if (pending.current) {
      pending.current = false;
      uncover();
    } else {
      // back/forward: Activity restores the page, just re-measure triggers
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }, [pathname, uncover]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={panel}
        aria-hidden
        className="invisible fixed inset-0 z-[80] flex items-center justify-center bg-ink"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gold/60" />
        <span
          data-mark
          className="logo-mask block aspect-[480/463] w-24 !bg-gold-light opacity-0 sm:w-28"
          style={{ maskImage: "url(/brand/mark.png)", WebkitMaskImage: "url(/brand/mark.png)" }}
        />
      </div>
    </TransitionContext.Provider>
  );
}

type TLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** next/link that routes through the curtain transition for same-tab navigations. */
export function TLink({ href, onNavigate, onClick, ...rest }: TLinkProps) {
  const { navigate } = useTransitionNav();
  const pathname = usePathname();
  return (
    <Link
      href={href}
      aria-current={pathname === href ? "page" : undefined}
      onClick={(e) => {
        onClick?.(e);
        // same-page hash/top links never trigger onNavigate's route change, handle them here
        const url = new URL(href, window.location.href);
        if (!e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0 && url.pathname === pathname) {
          e.preventDefault();
          navigate(href);
        }
      }}
      onNavigate={(e) => {
        onNavigate?.(e);
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    />
  );
}
