import { Metadata } from "next";
import TermsClientPage from "./TermsClientPage";

export const metadata: Metadata = {
  title: "Terms of Service - Rajseba",
  description: "Read the Terms of Service of Rajseba to understand our user agreement, booking policies, warranty, and liability terms.",
  keywords: ["terms of service", "terms and conditions", "user agreement", "rajseba rules"],
  openGraph: {
    title: "Terms of Service - Rajseba",
    description: "Read our Terms of Service to understand our user policies and booking agreements.",
    url: "https://rajseba.com/terms",
    siteName: "Rajseba",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return <TermsClientPage />;
}
