import { Metadata } from "next";
import BlogDetailClient from "./BlogDetailClient";

export const metadata: Metadata = {
  title: "Article Details - Rajseba Blog",
  description: "Read helpful articles, guidelines, and expert tips for your home repair, appliance, and cleaning needs on Rajseba.",
};

export default function Page({ params }: { params: { id: string } }) {
  return <BlogDetailClient id={Number(params.id)} />;
}
