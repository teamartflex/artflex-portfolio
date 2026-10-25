// Receives project enquiries and freelancer applications and emails them to the ArtFlex inbox.
//
// Delivery uses Gmail SMTP. Set these in .env.local (local) and in your host's environment (production):
//   SMTP_USER=team.artflex@gmail.com
//   SMTP_PASS=<16-character Gmail app password>   (Google Account > Security > App passwords)
// Optional: CONTACT_TO (defaults to site.email), CONTACT_DRY_RUN=1 (log instead of sending, for testing).

import nodemailer from "nodemailer";
import { policyVersion, site } from "@/lib/site";

type Payload = Record<string, unknown>;

const LIMITS: Record<string, number> = { name: 120, email: 160, phone: 40, company: 160, city: 120, portfolio: 400, message: 5000, budget: 60 };

const clean = (v: unknown, max: number) =>
  String(v ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim()
    .slice(0, max);

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// light per-instance rate limit: 5 submissions per 10 minutes per IP
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(request: Request) {
  let data: Payload;
  try {
    data = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // honeypot filled: pretend success, send nothing
  if (clean(data.website, 200)) return Response.json({ ok: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return Response.json({ ok: false, error: "Too many requests" }, { status: 429 });

  const mode = data.mode === "freelancer" ? "freelancer" : "brand";
  const f = Object.fromEntries(Object.entries(LIMITS).map(([k, max]) => [k, clean(data[k], max)]));
  const picked = Array.isArray(data.picked) ? data.picked.slice(0, 12).map((p) => clean(p, 60)).filter(Boolean) : [];

  if (!f.name || !/^\S+@\S+\.\S+$/.test(f.email)) {
    return Response.json({ ok: false, error: "Name and a valid email are required" }, { status: 422 });
  }
  if (data.consent !== true) {
    return Response.json({ ok: false, error: "Consent is required" }, { status: 422 });
  }

  const consentedAt = new Date().toISOString();
  const marketing = data.marketing === true;
  const rows: [string, string][] = [
    ["Name", f.name],
    ["Email", f.email],
    ["Phone", f.phone],
    ...(mode === "brand"
      ? ([
          ["Business", f.company],
          ["Interested in", picked.join(", ")],
          ["Monthly budget", f.budget],
        ] as [string, string][])
      : ([
          ["City", f.city],
          ["Roles", picked.join(", ")],
          ["Portfolio", f.portfolio],
        ] as [string, string][])),
    ["Message", f.message],
    ["Consent to process", `Yes, ${consentedAt} (privacy policy version ${policyVersion})`],
    ["Marketing opt-in", marketing ? "Yes" : "No"],
  ];
  const filled = rows.filter(([, v]) => v);

  const subject = mode === "brand" ? `New project enquiry: ${f.name}${f.company ? ` (${f.company})` : ""}` : `Freelancer application: ${f.name}`;
  const text = filled.map(([k, v]) => `${k}: ${v}`).join("\n\n");
  const html = `<div style="font-family:Arial,sans-serif;color:#0e1a33">
<h2 style="font-family:Georgia,serif;font-weight:normal">${esc(subject)}</h2>
<table cellpadding="8" style="border-collapse:collapse;font-size:14px">${filled
    .map(([k, v]) => `<tr><td style="color:#46506a;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join("")}</table>
<p style="color:#46506a;font-size:12px">Sent from the contact form on the ArtFlex website. Reply to this email to answer ${esc(f.name)} directly.</p></div>`;

  const to = process.env.CONTACT_TO || site.email;

  if (process.env.CONTACT_DRY_RUN === "1") {
    console.info("[contact:dry-run]", { to, subject, text });
    return Response.json({ ok: true });
  }

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    console.error("[contact] SMTP_USER / SMTP_PASS are not set, cannot deliver enquiry");
    return Response.json({ ok: false, error: "Email delivery is not configured" }, { status: 503 });
  }

  try {
    const transport = nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user, pass } });
    await transport.sendMail({
      from: `"ArtFlex Website" <${user}>`,
      to,
      replyTo: { name: f.name, address: f.email },
      subject,
      text,
      html,
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[contact] send failed", err);
    return Response.json({ ok: false, error: "Could not send" }, { status: 502 });
  }
}
