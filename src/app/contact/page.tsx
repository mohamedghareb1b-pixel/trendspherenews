import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the TrendSphere team.",
  robots: { index: true, follow: true },
};

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "contact@example.com";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-md space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-bold">Contact Us</h1>
        <p className="mt-2 text-gray-600">
          Questions, feedback, or press inquiries? Send us a message and we&apos;ll get back to
          you.
        </p>
      </div>

      <ContactForm fallbackEmail={CONTACT_EMAIL} />
    </div>
  );
}
