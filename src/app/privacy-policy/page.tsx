import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { TLink } from "@/components/Transition";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ArtFlex collects, uses and protects the personal information you share with us.",
};

// TODO(client): have this reviewed by a legal professional before launch.
export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title={
        <>
          Privacy <em>policy</em>
        </>
      }
      updated="25 October 2026"
      intro="ArtFlex respects your privacy. This policy explains what personal information we collect through this website, why we collect it, and the choices and rights you have. It is written to meet India's Digital Personal Data Protection Act, 2023 (DPDP Act)."
    >
      <h2>Who we are</h2>
      <p>
        ArtFlex is a digital and performance marketing studio based in {site.location}, India. For the purposes of the DPDP Act, ArtFlex is the
        Data Fiduciary for personal data collected on this website. You can reach us at <a href={`mailto:${site.email}`}>{site.email}</a> or{" "}
        <a href={site.phoneHref}>{site.phone}</a>.
      </p>

      <h2>What we collect</h2>
      <p>We only collect information you choose to give us, plus a small amount of technical data:</p>
      <ul>
        <li>
          <strong>Project enquiries:</strong> your name, email address, phone number (optional), business name (optional), the services you are
          interested in, your budget range (optional) and your message.
        </li>
        <li>
          <strong>Freelancer applications:</strong> your name, email address, phone number (optional), city (optional), the roles you do, a link to
          your portfolio and any message you add.
        </li>
        <li>
          <strong>Consent records:</strong> the date and time you gave consent, the version of this policy you agreed to, and whether you opted in to
          marketing updates.
        </li>
        <li>
          <strong>Cookie choice:</strong> a cookie that remembers which categories of cookies you allowed. See our{" "}
          <TLink href="/cookie-policy">cookie policy</TLink>.
        </li>
      </ul>
      <p>We do not ask for, and ask you not to send, sensitive information such as financial account details, health data or government ID numbers.</p>

      <h2>Why we use it</h2>
      <ul>
        <li>To reply to your enquiry, prepare a proposal and arrange a discovery call.</li>
        <li>To review your freelancer application and contact you about suitable briefs.</li>
        <li>To send occasional marketing updates, only if you ticked the separate marketing box. You can opt out at any time.</li>
        <li>To keep records of the consent you gave, as the law requires.</li>
      </ul>
      <p>We process your data on the basis of the consent you give when you submit a form. We will not use it for any unrelated purpose without asking you first.</p>

      <h2>Who we share it with</h2>
      <p>We do not sell or rent your personal data. We share it only with service providers who help us run this website, under appropriate safeguards:</p>
      <ul>
        <li>
          <strong>Google (Gmail):</strong> form submissions are delivered to our inbox by email.
        </li>
        <li>
          <strong>Our hosting provider:</strong> which serves this website and may keep short-lived technical logs.
        </li>
        <li>
          <strong>Freelance team members:</strong> only the details needed to work on your project, and only after you become a client.
        </li>
      </ul>
      <p>We may also disclose information where required by law or to protect our legal rights.</p>

      <h2>How long we keep it</h2>
      <ul>
        <li>Project enquiries that do not become projects: up to 24 months, then deleted.</li>
        <li>Freelancer applications: up to 12 months, or until you ask us to remove them.</li>
        <li>Consent records: for as long as we hold the related data, plus any period required by law.</li>
      </ul>
      <p>If you withdraw consent, we will stop processing and delete your data unless the law requires us to keep it.</p>

      <h2>Your rights</h2>
      <p>Under the DPDP Act you have the right to:</p>
      <ul>
        <li>Ask for a summary of the personal data we hold about you and how we use it.</li>
        <li>Ask us to correct, complete or update your data.</li>
        <li>Ask us to erase your data.</li>
        <li>Withdraw your consent at any time. This is as easy as giving it: just email us.</li>
        <li>Nominate another person to exercise these rights on your behalf in case of death or incapacity.</li>
        <li>Have your grievances addressed by us, and, if you are not satisfied, complain to the Data Protection Board of India.</li>
      </ul>
      <p>
        To use any of these rights, email <a href={`mailto:${site.email}`}>{site.email}</a> with the subject &ldquo;Privacy request&rdquo;. We will
        respond within 30 days.
      </p>

      <h2>Grievance contact</h2>
      <p>
        For any complaint about how we handle your data, contact our grievance officer at <a href={`mailto:${site.email}`}>{site.email}</a>,{" "}
        {site.phone}, {site.location}, India.
      </p>

      <h2>Security</h2>
      <p>
        This website is served over HTTPS and form submissions are sent over encrypted connections. Access to enquiries is limited to the people who need
        it to respond. No method of transmission is completely secure, but we take reasonable steps to protect your data.
      </p>

      <h2>Children</h2>
      <p>This website is meant for businesses and working professionals. We do not knowingly collect personal data from anyone under 18.</p>

      <h2>Changes to this policy</h2>
      <p>
        If we change this policy we will update the date at the top of this page. When the change affects how we use your data, we will ask for your
        consent again.
      </p>
    </LegalPage>
  );
}
