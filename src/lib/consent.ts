"use client";

import { policyVersion } from "./site";

/**
 * Cookie consent store. The visitor's choice lives in a first-party cookie
 * (`af_consent`) together with the policy version it was given against, so a
 * policy update asks again. Optional tags (analytics, ads pixels) must check
 * `hasConsent()` or listen for the `af:consent` event before loading.
 */
export type ConsentChoice = { analytics: boolean; marketing: boolean };
export type ConsentRecord = ConsentChoice & { necessary: true; version: string; date: string };

const COOKIE = "af_consent";
const MAX_AGE = 60 * 60 * 24 * 180; // 6 months, then we ask again

export const CONSENT_EVENT = "af:consent";
export const OPEN_SETTINGS_EVENT = "af:consent-open";

export function readConsent(): ConsentRecord | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE}=`));
  if (!raw) return null;
  try {
    const rec = JSON.parse(decodeURIComponent(raw.slice(COOKIE.length + 1))) as ConsentRecord;
    return rec.version === policyVersion ? rec : null;
  } catch {
    return null;
  }
}

export function saveConsent(choice: ConsentChoice) {
  const rec: ConsentRecord = { necessary: true, ...choice, version: policyVersion, date: new Date().toISOString() };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(rec))}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: rec }));
  return rec;
}

export function hasConsent(category: keyof ConsentChoice) {
  return readConsent()?.[category] === true;
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}
