import { Metadata } from "next";
import ContactClientPage from "./ContactClientPage";

export const metadata: Metadata = {
  title: "Contact Us - Rajseba Support Center",
  description: "Get in touch with Rajseba. Reach our 24/7 hotline at 01813-333373 or email info@rajseba.com for booking support, refunds, or general enquiries.",
  keywords: ["contact rajseba", "rajseba phone number", "rajseba email", "rajseba office address", "home service support"],
  openGraph: {
    title: "Contact Us - Rajseba Support Center",
    description: "Get in touch with Rajseba. Reach our 24/7 hotline or send us a message directly.",
    url: "https://rajseba.com/contact",
    siteName: "Rajseba",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return <ContactClientPage />;
}