import { Metadata } from "next";
import HelpClientPage from "./HelpClientPage";

export const metadata: Metadata = {
  title: "Help Center - Rajseba",
  description: "Find answers to your questions, learn how to manage bookings, and contact our customer support team. Bangladesh's most trusted home services platform.",
  keywords: [
    "rajseba help center",
    "customer support",
    "home services support",
    "AC repair warranty",
    "booking help",
    "Refund policy Rajseba",
  ],
  openGraph: {
    title: "Help Center - Rajseba",
    description: "Find answers to your questions, learn how to manage bookings, and contact our customer support team.",
    url: "https://rajseba.com/help",
    siteName: "Rajseba",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return <HelpClientPage />;
}
