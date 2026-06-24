import { Metadata } from "next";
import AboutClientPage from "./AboutClientPage";

export const metadata: Metadata = {
  title: "About Us - Rajseba",
  description: "Learn about Rajseba, Bangladesh's most reliable and secure ecosystem for on-demand home services. We connect premium homes with vetted professionals.",
  keywords: ["about rajseba", "home services company", "verified experts Bangladesh", "home care services"],
  openGraph: {
    title: "About Us - Rajseba",
    description: "Learn about Rajseba, Bangladesh's most reliable and secure ecosystem for on-demand home services.",
    url: "https://rajseba.com/about",
    siteName: "Rajseba",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return <AboutClientPage />;
}