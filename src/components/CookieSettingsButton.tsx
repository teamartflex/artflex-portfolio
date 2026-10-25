"use client";

import { openConsentSettings } from "@/lib/consent";

/** Reopens the cookie preferences panel. */
export function CookieSettingsButton({ className = "", label = "Change cookie settings" }: { className?: string; label?: string }) {
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      {label}
    </button>
  );
}
