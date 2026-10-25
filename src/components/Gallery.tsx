"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { CaretLeft, CaretRight, MagnifyingGlassPlus, X } from "@phosphor-icons/react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { scroller } from "@/lib/stage";
import type { Shot } from "@/lib/site";

/**
 * Masonry of recent shoots. Each photo wipes up into view on scroll; clicking
 * opens a full-screen lightbox (native <dialog>, so focus and Esc are handled)
 * with arrow keys, buttons and swipe to browse.
 */
export function Gallery({ shots }: { shots: Shot[] }) {
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const swipeX = useRef<number | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-shot]").forEach((el) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 92%", once: true } });
        tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0% round 18px)" }, { clipPath: "inset(0% 0% 0% 0% round 18px)", duration: 1.4, ease: "expo.inOut" }).from(
          el.querySelector("img"),
          { scale: 1.35, duration: 1.8, ease: "expo.out" },
          0.1,
        );
      });
    },
    { scope: root },
  );

  // animate each newly shown photo in the lightbox
  useGSAP(
    () => {
      if (index === null || prefersReducedMotion()) return;
      gsap.fromTo(stageRef.current, { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "expo.out" });
    },
    { dependencies: [index] },
  );

  // Activity hides this page instead of unmounting it: never leave the lightbox open
  useLayoutEffect(
    () => () => {
      dialog.current?.close();
    },
    [],
  );

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
    scroller.stop();
  };
  const step = (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + shots.length) % shots.length));

  const shot = index !== null ? shots[index] : null;

  return (
    <div ref={root}>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {shots.map((s, i) => (
          <figure key={s.src} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`View larger: ${s.caption}`}
              className="group relative block w-full overflow-hidden rounded-[18px] focus-visible:outline-offset-4"
            >
              <div data-shot className="relative overflow-hidden rounded-[18px]" style={{ aspectRatio: `${s.w} / ${s.h}` }}>
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
                  className="object-cover transition-transform duration-1000 ease-[var(--ease-expo)] group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/25" />
                <span className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-paper text-ink opacity-0 transition-all duration-500 ease-[var(--ease-expo)] group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:hover)]:translate-y-2 group-hover:translate-y-0">
                  <MagnifyingGlassPlus className="size-5" aria-hidden />
                </span>
              </div>
            </button>
            <figcaption className="mt-3 text-[15px] text-ink-soft">{s.caption}</figcaption>
          </figure>
        ))}
      </div>

      <dialog
        ref={dialog}
        aria-label="Photo viewer"
        data-lenis-prevent
        onClose={() => {
          setIndex(null);
          scroller.start();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-ink/95 p-0 text-paper backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
      >
        {shot && (
          <div
            className="relative flex h-full flex-col items-center justify-center gap-5 px-4 py-16 sm:px-20"
            onPointerDown={(e) => (swipeX.current = e.clientX)}
            onPointerUp={(e) => {
              if (swipeX.current === null) return;
              const dx = e.clientX - swipeX.current;
              if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
              swipeX.current = null;
            }}
          >
            <div ref={stageRef} className="relative h-[72dvh] w-full max-w-5xl">
              <Image key={shot.src} src={shot.src} alt={shot.alt} fill sizes="90vw" className="object-contain" priority />
            </div>
            <p className="text-center text-paper/85">{shot.caption}</p>

            <button
              type="button"
              autoFocus
              onClick={() => dialog.current?.close()}
              aria-label="Close"
              className="absolute right-4 top-4 grid size-12 place-items-center rounded-full border border-paper/25 transition-colors duration-300 hover:bg-paper hover:text-ink active:scale-95"
            >
              <X className="size-5" aria-hidden />
            </button>
            {(
              [
                [-1, "Previous photo", CaretLeft, "left-3 sm:left-6"],
                [1, "Next photo", CaretRight, "right-3 sm:right-6"],
              ] as const
            ).map(([dir, label, Icon, pos]) => (
              <button
                key={label}
                type="button"
                onClick={() => step(dir)}
                aria-label={label}
                className={`absolute top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-paper/10 transition-colors duration-300 hover:bg-gold-light hover:text-ink active:scale-95 ${pos}`}
              >
                <Icon className="size-5" weight="bold" aria-hidden />
              </button>
            ))}
          </div>
        )}
      </dialog>
    </div>
  );
}
