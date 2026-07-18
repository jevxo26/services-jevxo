import { Metadata } from "next";
import TermsClientPage from "./TermsClientPage";

export const metadata: Metadata = {
  title: "Terms of Service - Jevxo Services",
  description: "Read the Terms of Service of Jevxo Services to understand our user agreement, booking policies, warranty, and liability terms.",
  keywords: ["terms of service", "terms and conditions", "user agreement", "jevxo services rules"],
  openGraph: {
    title: "Terms of Service - Jevxo Services",
    description: "Read our Terms of Service to understand our user policies and booking agreements.",
    url: "https://jevxo.com/terms",
    siteName: "Jevxo Services",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return <TermsClientPage />;
}
