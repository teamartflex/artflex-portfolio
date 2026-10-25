// Central content for the ArtFlex site.
// TODO(client): confirm client sectors and the services listed per client before going live.

export const site = {
  name: "ArtFlex",
  tagline: "Digital & performance marketing",
  /** every enquiry and application is delivered here */
  email: "team.artflex@gmail.com",
  phone: "+91 89172 72384",
  phoneHref: "tel:+918917272384",
  whatsapp: "https://wa.me/918917272384",
  location: "Brahmapur, Ganjam, Odisha",
  socials: [{ label: "Instagram", href: "https://www.instagram.com/artflex_in/" }],
};

/** Bump when the privacy or cookie policy text changes; stored with every consent record. */
export const policyVersion = "2026-10-25";

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
] as const;

export type Client = {
  slug: string;
  name: string;
  sector: string;
  services: string[];
  /** native background colour behind the colour logo (matches the image edge exactly) */
  tone: string;
  /** colour logo file (keeps its native background) */
  logo: string;
  /** white+alpha silhouette for CSS mask recolouring */
  mask: string;
  /** mask aspect ratio (w / h) */
  ratio: number;
};

export const clients: Client[] = [
  {
    slug: "vinayak-jewellers",
    name: "Vinayak Jewellers",
    sector: "Jewellery retail",
    services: ["Social media", "Performance ads", "Festive campaigns"], // TODO(client)
    tone: "#000000",
    logo: "/clients/vinayak-jewellers.jpg",
    mask: "/clients/vinayak-jewellers-mask.png",
    ratio: 640 / 521,
  },
  {
    slug: "shankar-bhavan",
    name: "Shankar Bhavan",
    sector: "Business hotel",
    services: ["Brand presence", "Google Business", "Content"], // TODO(client)
    tone: "#fdfdf3",
    logo: "/clients/shankar-bhavan.png",
    mask: "/clients/shankar-bhavan-mask.png",
    ratio: 391 / 262,
  },
  {
    slug: "optico-india",
    name: "Optico India",
    sector: "Eyewear retail",
    services: ["Performance ads", "Social media", "Reels"], // TODO(client)
    tone: "#f4f1ea",
    logo: "/clients/optico-india.png",
    mask: "/clients/optico-india-mask.png",
    ratio: 1,
  },
  {
    slug: "vayu",
    name: "Vayu by Shankar Bhavan",
    sector: "Dining",
    services: ["Launch campaign", "Social media", "Food shoots"], // TODO(client)
    tone: "#000000",
    logo: "/clients/vayu.jpg",
    mask: "/clients/vayu-mask.png",
    ratio: 640 / 371,
  },
  {
    slug: "welcome-agency",
    name: "Welcome Agency",
    sector: "Services",
    services: ["Branding", "Lead generation"], // TODO(client)
    tone: "#fdfbec",
    logo: "/clients/welcome-agency.jpg",
    mask: "/clients/welcome-agency-mask.png",
    ratio: 640 / 468,
  },
  {
    slug: "vayu-go",
    name: "Vayu Go",
    sector: "Brand launch",
    services: ["Identity rollout", "Social media"], // TODO(client)
    tone: "#000000",
    logo: "/clients/vayu-go.jpg",
    mask: "/clients/vayu-go-mask.png",
    ratio: 640 / 278,
  },
  {
    slug: "tara-tarini-optics",
    name: "Tara Tarini Optics",
    sector: "Eyewear retail",
    services: ["Social media", "Performance ads"], // TODO(client)
    tone: "#f4f1ea",
    logo: "/clients/tara-tarini-optics.png",
    mask: "/clients/tara-tarini-optics-mask.png",
    ratio: 413 / 227,
  },
  {
    slug: "chandan-construction",
    name: "Chandan Construction & Real Estate",
    sector: "Construction & real estate",
    services: ["Lead generation", "Social media"], // TODO(client)
    tone: "#f4f1ea",
    logo: "/clients/chandan-construction.png",
    mask: "/clients/chandan-construction-mask.png",
    ratio: 413 / 259,
  },
  {
    slug: "odia-grihasthali",
    name: "Odia Grihasthali Properties",
    sector: "Real estate",
    services: ["Lead generation", "Performance ads"], // TODO(client)
    tone: "#f4f1ea",
    logo: "/clients/odia-grihasthali.png",
    mask: "/clients/odia-grihasthali-mask.png",
    ratio: 390 / 186,
  },
];

/** Logos shown only in the scrolling logo strip (brand name not confirmed yet). */
export const stripOnlyLogos: Pick<Client, "slug" | "name" | "mask" | "ratio">[] = [
  // TODO(client): add the brand name, then move this into `clients` above
  { slug: "sjg-monogram", name: "Client logo", mask: "/clients/sjg-monogram-mask.png", ratio: 195 / 277 },
];

export type Service = {
  slug: string;
  title: string;
  short: string;
  body: string;
  items: string[];
  image: string;
  imageAlt: string;
  /** CSS object-position so baked-in poster text stays out of the crop */
  imagePos: string;
};

export const services: Service[] = [
  {
    slug: "performance",
    title: "Performance Marketing",
    short: "Ads on Meta, Google and YouTube that are built to convert, then tuned every week.",
    body: "We plan, launch and optimise paid campaigns around the numbers that matter to you: leads, calls, store visits and sales.",
    items: ["Meta & Instagram Ads", "Google Search & Display", "YouTube campaigns", "Lead-gen funnels", "Retargeting", "Conversion tracking"],
    image: "/work/strategy-session.jpg",
    imageAlt: "Strategist mapping a digital marketing plan on a whiteboard",
    imagePos: "50% 22%",
  },
  {
    slug: "social",
    title: "Social Media Management",
    short: "A consistent, recognisable presence that keeps your audience coming back.",
    body: "Content calendars, design, captions, community replies and monthly reviews, handled end to end by one accountable team.",
    items: ["Content calendars", "Post & story design", "Reels strategy", "Community management", "Influencer collaborations", "Monthly reporting"],
    image: "/work/vayu-slow-mornings.jpg",
    imageAlt: "Social post for Vayu: two cappuccinos on a cafe table, captioned Brewed for slow mornings",
    imagePos: "50% 60%",
  },
  {
    slug: "branding",
    title: "Branding & Identity",
    short: "Logos, colour, type and voice that make a business look as good as it is.",
    body: "From a first logo to a full rebrand, we build identities that work on a hoarding, a menu card and a phone screen.",
    items: ["Logo design", "Brand guidelines", "Packaging", "Print collateral", "Signage", "Brand voice"],
    image: "/work/artflex-brand.jpg",
    imageAlt: "ArtFlex brand card with the gold AF monogram",
    imagePos: "50% 40%",
  },
  {
    slug: "content",
    title: "Content & Production",
    short: "Photo and video that stops the scroll and shows your product at its best.",
    body: "Product shoots, reels, ad films and behind-the-scenes content, produced by our in-house team and national crew network.",
    items: ["Product photography", "Reels & short video", "Ad films", "Food & hospitality shoots", "Motion graphics", "Copywriting"],
    image: "/work/shoot-capturing-moments.jpg",
    imageAlt: "Camera on a gimbal filming inside a saree store",
    imagePos: "50% 30%",
  },
  {
    slug: "web",
    title: "Websites & SEO",
    short: "Fast websites and local search visibility so customers find you first.",
    body: "Landing pages, business websites and Google Business Profile optimisation that turn searches into enquiries.",
    items: ["Business websites", "Landing pages", "Local SEO", "Google Business Profile", "Speed & analytics", "WhatsApp integration"],
    image: "/work/code-and-ideas.jpg",
    imageAlt: "Code on a monitor beside an open notebook and glasses",
    imagePos: "50% 25%",
  },
];

export type Shot = { src: string; alt: string; caption: string; w: number; h: number };

/** Recent shoots and campaign creatives. TODO(client): confirm captions/attribution. */
export const gallery: Shot[] = [
  { src: "/work/vayu-sushi-launch.jpg", alt: "Hot dawn fried sushi plated on a slate, Vayu launch creative", caption: "Vayu, sushi launch creative", w: 1280, h: 1600 },
  { src: "/work/christmas-evening-3.jpg", alt: "Two guests posing with Santa at a rooftop restaurant", caption: "Christmas evening, event shoot", w: 1440, h: 1080 },
  { src: "/work/vayu-seafood-boil.jpg", alt: "Seafood boil with crab and corn beside steamed rice, new launch creative", caption: "Vayu, seafood boil launch", w: 1280, h: 1600 },
  { src: "/work/vayu-chef.jpg", alt: "Chef serving a dish at a sunlit restaurant table", caption: "Vayu, kitchen and hospitality shoot", w: 1280, h: 1600 },
  { src: "/work/christmas-evening-1.jpg", alt: "Group of guests with Santa on a rooftop at night", caption: "Christmas evening, event shoot", w: 1440, h: 1083 },
  { src: "/work/vayu-slow-mornings.jpg", alt: "Two cappuccinos on a cafe table, captioned Brewed for slow mornings", caption: "Vayu, cafe social post", w: 1280, h: 1600 },
  { src: "/work/christmas-evening-2.jpg", alt: "Guest shaking hands with Santa", caption: "Christmas evening, event shoot", w: 1440, h: 1083 },
  { src: "/work/christmas-evening-4.jpg", alt: "Guest smiling with Santa on the rooftop", caption: "Christmas evening, event shoot", w: 1440, h: 1083 },
];

/** Behind-the-scenes posters (small source files, keep them at card size). */
export const studio: Shot[] = [
  { src: "/work/shoot-exploring-new-places.jpg", alt: "Videographer filming a retail storefront", caption: "On location", w: 533, h: 733 },
  { src: "/work/strategy-session.jpg", alt: "Strategist planning content on a whiteboard", caption: "Strategy first", w: 526, h: 736 },
  { src: "/work/shoot-capturing-moments.jpg", alt: "Camera rig filming in a saree store", caption: "Capturing moments", w: 354, h: 745 },
];

export const process = [
  { title: "Discover", body: "We learn your business, customers and competitors, and agree on the numbers that define success." },
  { title: "Plan", body: "A clear channel, content and budget plan, with timelines everyone can see." },
  { title: "Create", body: "Design, copy, shoots and campaign builds from specialists matched to the job." },
  { title: "Launch", body: "Campaigns go live with tracking in place from day one, so every rupee is accounted for." },
  { title: "Optimise", body: "Weekly tuning and monthly reviews. What works gets more budget. What doesn't gets cut." },
];

export const faqs = [
  {
    q: "Do you work with businesses outside Odisha?",
    a: "Yes. Our core team is in Odisha and our freelance network spans India, so we run campaigns wherever your customers are.",
  },
  {
    q: "What ad budget do I need to start?",
    a: "It depends on your goals and market. After a discovery call we recommend a starting budget and scale it as results come in.",
  },
  {
    q: "How soon will I see results?",
    a: "Paid campaigns usually show early signals within the first few weeks. SEO and organic social build steadily over a few months.",
  },
  {
    q: "Can I start with just one service?",
    a: "Absolutely. Many clients start with ads or social media and add more once they see what works.",
  },
  {
    q: "Who will handle my account?",
    a: "A dedicated account lead from our core team, supported by specialists from our network for each piece of work.",
  },
];

export const roles = [
  "Graphic Designers",
  "Video Editors",
  "Content Writers",
  "Performance Marketers",
  "Photographers",
  "Social Media Managers",
  "Motion Designers",
  "Web Developers",
];
