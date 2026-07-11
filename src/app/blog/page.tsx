import { Metadata } from "next";
import BlogClientPage from "./BlogClientPage";

export const metadata: Metadata = {
  title: "Blog & Client Reviews - Rajseba",
  description: "Read expert home care tips, guides, and real client reviews of Rajseba - Bangladesh's most trusted home services platform.",
  keywords: ["rajseba blog", "home care tips", "ac repair guide", "shifting hacks", "client reviews Bangladesh"],
  openGraph: {
    title: "Blog & Client Reviews - Rajseba",
    description: "Read expert home care tips, guides, and real client reviews of Rajseba.",
    url: "https://rajseba.com/blog",
    siteName: "Rajseba",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return <BlogClientPage />;
}
