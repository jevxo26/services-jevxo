import { Metadata } from "next";
import PrivacyClientPage from "./PrivacyClientPage";

export const metadata: Metadata = {
  title: "Privacy Policy - Jevxo Services",
  description: "Read the Privacy Policy of Jevxo Services to understand how we collect, use, protect, and manage your personal data on Bangladesh's top home services platform.",
  keywords: ["privacy policy", "data protection", "jevxo services privacy", "user data Bangladesh"],
  openGraph: {
    title: "Privacy Policy - Jevxo Services",
    description: "Read our Privacy Policy to learn how we protect your personal information.",
    url: "https://jevxo.com/privacy",
    siteName: "Jevxo Services",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return <PrivacyClientPage />;
}
