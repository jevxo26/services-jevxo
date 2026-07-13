import { Metadata } from "next";
import BlogClientPage from "./BlogClientPage";

export const metadata: Metadata = {
  title: "Blog - Rajseba | Home Service Tips & Guides",
  description: "Read expert home care tips, maintenance guides, and the latest insights from Rajseba — Bangladesh's most trusted home services platform.",
  keywords: ["rajseba blog", "home care tips", "ac repair guide", "cleaning tips", "home maintenance Bangladesh"],
  openGraph: {
    title: "Blog - Rajseba | Home Service Tips & Guides",
    description: "Expert home care tips, maintenance guides, and trusted insights from Rajseba.",
    url: "https://rajseba.com/blog",
    siteName: "Rajseba",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return <BlogClientPage />;
}
