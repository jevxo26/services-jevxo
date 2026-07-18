import { Metadata } from "next";
import AboutClientPage from "./AboutClientPage";

export const metadata: Metadata = {
  title: "About Us - Jevxo Services",
  description: "Learn about Jevxo Services, Bangladesh's most reliable and secure ecosystem for on-demand home services. We connect premium homes with vetted professionals.",
  keywords: ["about jevxo services", "home services company", "verified experts Bangladesh", "home care services"],
  openGraph: {
    title: "About Us - Jevxo Services",
    description: "Learn about Jevxo Services, Bangladesh's most reliable and secure ecosystem for on-demand home services.",
    url: "https://jevxo.com/about",
    siteName: "Jevxo Services",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return <AboutClientPage />;
}