import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { TLink } from "@/components/Transition";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Which cookies and similar technologies the ArtFlex website uses, and how to control them.",
};

// TODO(client): if you add analytics or ad pixels, list each cookie in the table below.
export default function CookiePolicyPage() {
  return (
    <LegalPage
      title={
        <>
          Cookie <em>policy</em>
        </>
      }
      updated="25 October 2026"
      intro="Cookies are small text files a website stores on your device. This page explains which ones the ArtFlex website uses and how you can control them."
    >
      <h2>Your choice</h2>
      <p>
        When you first visit, we ask whether you accept optional cookies. Essential cookies are always on because the site needs them. Analytics and
        marketing cookies are only set if you allow them, and you can change your mind at any time.
      </p>
      <p>
        <CookieSettingsButton className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-semibold text-paper transition-colors duration-300 hover:bg-gold hover:text-ink active:scale-[0.97]" />
      </p>

      <h2>Cookies we use</h2>
      <div className="-mx-1 overflow-x-auto px-1">
        <table className="min-w-[560px]">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Category</th>
              <th scope="col">Purpose</th>
              <th scope="col">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>af_consent</td>
              <td>Essential</td>
              <td>Remembers your cookie choices and the policy version you agreed to.</td>
              <td>6 months</td>
            </tr>
            <tr>
              <td>af-preloaded</td>
              <td>Essential (session storage)</td>
              <td>Skips the intro animation after you have seen it once in this visit. Not a cookie, cleared when you close the tab.</td>
              <td>Session</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Analytics cookies</h2>
      <p>
        If you allow them, analytics cookies help us count visits and see which pages are useful. We do not currently run any analytics tools. If we
        add one, it will only load after you opt in, and we will list its cookies here.
      </p>

      <h2>Marketing cookies</h2>
      <p>
        If you allow them, marketing cookies let platforms such as Meta and Google measure our advertising and show you relevant ads. They will never load
        unless you opt in.
      </p>

      <h2>Managing cookies in your browser</h2>
      <p>
        You can also block or delete cookies in your browser settings. Blocking essential cookies means the site will ask for your cookie choice on every
        visit.
      </p>

      <h2>Questions</h2>
      <p>
        For more about how we handle personal data, read our <TLink href="/privacy-policy">privacy policy</TLink> or email{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
