import { Metadata } from "next";
import HelpClientPage from "./HelpClientPage";

export const metadata: Metadata = {
  title: "Help Center - Jevxo Services",
  description: "Find answers to your questions, learn how to manage bookings, and contact our customer support team. Bangladesh's most trusted home services platform.",
  keywords: [
    "jevxo services help center",
    "customer support",
    "home services support",
    "AC repair warranty",
    "booking help",
    "Refund policy Jevxo Services",
  ],
  openGraph: {
    title: "Help Center - Jevxo Services",
    description: "Find answers to your questions, learn how to manage bookings, and contact our customer support team.",
    url: "https://jevxo.com/help",
    siteName: "Jevxo Services",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return <HelpClientPage />;
}
