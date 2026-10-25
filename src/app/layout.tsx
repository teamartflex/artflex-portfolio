import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { TransitionProvider } from "@/components/Transition";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Preloader } from "@/components/Preloader";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";

// Cormorant echoes the high-contrast serif in the ArtFlex logo; Manrope keeps body copy crisp.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://artflex.in"), // TODO(client): production domain
  title: {
    default: "ArtFlex | Digital & Performance Marketing, Odisha",
    template: "%s | ArtFlex",
  },
  description:
    "ArtFlex is a two-time Odisha Gaurav Award winning digital and performance marketing studio. Ads, social media, branding, content and websites that grow your business.",
  openGraph: {
    type: "website",
    siteName: "ArtFlex",
    images: ["/brand/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f3ee",
};

// Runs before paint: flags JS (hides hero copy until its entrance) and skips the
// preloader for visitors who have already seen it this session.
const boot = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('af-preloaded')==='1')d.classList.add('af-skip-preload')}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${manrope.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <a
          href="#main"
          className="fixed left-4 top-4 z-[110] -translate-y-24 rounded-full bg-ink px-5 py-3 text-paper transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <TransitionProvider>
          <Preloader />
          <SmoothScroll />
          <Nav />
          <main id="main" tabIndex={-1} className="outline-none">
            <span id="top" />
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </TransitionProvider>
      </body>
    </html>
  );
}
