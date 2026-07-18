import { Metadata } from "next";
import BlogClientPage from "./BlogClientPage";

export const metadata: Metadata = {
  title: "Blog - Jevxo Services | Home Service Tips & Guides",
  description: "Read expert home care tips, maintenance guides, and the latest insights from Jevxo Services — Bangladesh's most trusted home services platform.",
  keywords: ["jevxo services blog", "home care tips", "ac repair guide", "cleaning tips", "home maintenance Bangladesh"],
  openGraph: {
    title: "Blog - Jevxo Services | Home Service Tips & Guides",
    description: "Expert home care tips, maintenance guides, and trusted insights from Jevxo Services.",
    url: "https://jevxo.com/blog",
    siteName: "Jevxo Services",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return <BlogClientPage />;
}
