import { Metadata } from "next";
import ContactClientPage from "./ContactClientPage";

export const metadata: Metadata = {
  title: "Contact Us - Jevxo Services Support Center",
  description: "Get in touch with Jevxo Services. Reach our 24/7 hotline at 01813-333373 or email info@jevxo.com for booking support, refunds, or general enquiries.",
  keywords: ["contact jevxo services", "jevxo services phone number", "jevxo services email", "jevxo services office address", "home service support"],
  openGraph: {
    title: "Contact Us - Jevxo Services Support Center",
    description: "Get in touch with Jevxo Services. Reach our 24/7 hotline or send us a message directly.",
    url: "https://jevxo.com/contact",
    siteName: "Jevxo Services",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return <ContactClientPage />;
}