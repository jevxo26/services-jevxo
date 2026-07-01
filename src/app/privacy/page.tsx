import { Metadata } from "next";
import PrivacyClientPage from "./PrivacyClientPage";

export const metadata: Metadata = {
  title: "Privacy Policy - Rajseba",
  description: "Read the Privacy Policy of Rajseba to understand how we collect, use, protect, and manage your personal data on Bangladesh's top home services platform.",
  keywords: ["privacy policy", "data protection", "rajseba privacy", "user data Bangladesh"],
  openGraph: {
    title: "Privacy Policy - Rajseba",
    description: "Read our Privacy Policy to learn how we protect your personal information.",
    url: "https://rajseba.com/privacy",
    siteName: "Rajseba",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return <PrivacyClientPage />;
}
