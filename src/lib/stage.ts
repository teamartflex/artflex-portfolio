"use client";

import type Lenis from "lenis";

/**
 * The "stage" is open when nothing is covering the page: the preloader has lifted
 * and no page transition is in progress. Hero entrances wait for it so they play
 * at the moment the visitor can actually see them.
 */
type Listener = () => void;

let preloading = true;
let covering = false;
const listeners = new Set<Listener>();

function flush() {
  if (preloading || covering) return;
  const pending = [...listeners];
  listeners.clear();
  pending.forEach((fn) => fn());
}

export const stage = {
  isOpen: () => !preloading && !covering,
  setPreloading(value: boolean) {
    preloading = value;
    flush();
  },
  setCovering(value: boolean) {
    covering = value;
    flush();
  },
  /** Runs `fn` once the stage is open. Returns an unsubscribe function. */
  onOpen(fn: Listener) {
    if (!preloading && !covering) {
      fn();
      return () => {};
    }
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};

let lenisInstance: Lenis | null = null;
export const scroller = {
  get: () => lenisInstance,
  set: (l: Lenis | null) => {
    lenisInstance = l;
  },
  stop: () => lenisInstance?.stop(),
  start: () => lenisInstance?.start(),
  toTop: () => {
    lenisInstance?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  },
};
