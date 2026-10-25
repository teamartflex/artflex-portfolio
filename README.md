# ArtFlex website

Multi-page animated marketing site for ArtFlex (digital & performance marketing, Odisha).
Built with Next.js 16 (App Router, Cache Components), Tailwind CSS v4, GSAP (ScrollTrigger + SplitText) and Lenis.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

## Pages

| Route       | What's on it                                                                 |
| ----------- | ---------------------------------------------------------------------------- |
| `/`         | Hero with live monogram, client marquee, manifesto, pinned services pan (all screen sizes), studio collage, award, collective bento, client index, CTA |
| `/services` | Sticky service card stack with photos, scroll-drawn process timeline, FAQ     |
| `/work`     | Client grid with tilt + sheen cards (`/work#vayu`), recent shoots gallery with lightbox (`/work#recent`) |
| `/about`    | Story, behind-the-scenes photos, values, award                                |
| `/careers`  | Freelancer collective: roles marquee, perks, steps, application form         |
| `/contact`  | Contact channels + project enquiry form                                       |
| `/privacy-policy`, `/cookie-policy` | DPDP Act 2023 privacy notice and cookie policy                |

## Where things live

- `src/lib/site.ts`: **all copy and data** (contact details, clients, services, process, FAQs, roles)
- `src/app/globals.css`: design tokens (colours, fonts, radius)
- `src/components/`: animated building blocks (each one documents its motion at the top)
- `public/brand`, `public/clients`: logos (colour versions + `-mask.png` silhouettes used for the navy/gold recolouring)
- `public/work`: shoot and campaign photos (web-sized copies of the originals in `works/`). Add new ones to `gallery` in `site.ts`.

## Enquiry emails (required before launch)

Both forms post to `/api/contact`, which emails every submission to **team.artflex@gmail.com** via Gmail SMTP,
with the visitor set as Reply-To and their consent record included.

1. On the team.artflex@gmail.com Google account, turn on 2-Step Verification.
2. Create an app password: Google Account > Security > App passwords.
3. Copy `.env.example` to `.env.local` and set `SMTP_PASS` to that 16-character password. Set the same variables on your host (e.g. Vercel > Project > Settings > Environment Variables).

Without these variables the form shows an error that points visitors to the email address. `CONTACT_DRY_RUN=1` logs submissions instead of sending them, for testing.

## Privacy and consent

- **Cookie banner** (`src/components/CookieConsent.tsx`): Essential / Analytics / Marketing, equal-weight Accept and Reject, reopened from "Cookie settings" in the footer. The choice is stored in the `af_consent` cookie for 6 months.
- **Adding analytics or ad pixels later:** load them only when `hasConsent("analytics")` / `hasConsent("marketing")` from `src/lib/consent.ts` is true (listen for the `af:consent` event to load right after opt-in), and list their cookies on `/cookie-policy`.
- **Form consent:** a required processing-consent checkbox and a separate, optional marketing opt-in. The API rejects submissions without consent.
- Changing either policy: update the text and bump `policyVersion` in `site.ts`, which asks visitors for consent again.
- Have both policy pages reviewed by a legal professional before launch.

## Before going live

Search the code for `TODO(client)`:

1. **Client sectors, services and photo captions** in `src/lib/site.ts`: best guesses, please confirm.
2. **Domain** in `src/app/layout.tsx` (`metadataBase`).
3. **Email setup** (see above).

## Motion notes

- Everything respects `prefers-reduced-motion` (no preloader, no smooth scroll, no pinning; the services pan becomes a swipe row).
- The preloader plays once per browser session.
- Page changes play a navy curtain transition; hero copy animates only once the curtain or preloader has lifted.
- With `cacheComponents`, Next keeps recently visited pages mounted but hidden, so components scope all GSAP work to their own refs and clean up in `useGSAP`.
- Tailwind v4 `scale-*`/`translate-*` utilities use standalone CSS properties that stack with GSAP transforms. Don't put them on elements GSAP animates; set initial states with inline `transform` or `gsap.set` instead.
