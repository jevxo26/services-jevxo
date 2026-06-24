import { Metadata } from "next";
import CategoryDetailClientPage from "./CategoryDetailClientPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`https://rajseba-api-production.up.railway.app/services/slug/${slug}`, {
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    const service = json?.data;

    if (!service) {
      return {
        title: "Category Details - Rajseba",
        description: "Professional service category details.",
      };
    }

    return {
      title: `${service.name} - Expert Service Category | Rajseba`,
      description: service.description || `Book expert ${service.name} services in Bangladesh. Professional and trusted technicians at your service.`,
      openGraph: {
        title: `${service.name} - Rajseba`,
        description: service.description || `Book expert ${service.name} services in Bangladesh.`,
        url: `https://rajseba.com/categories/service/${slug}`,
        siteName: "Rajseba",
        locale: "en_US",
        type: "website",
      },
    };
  } catch {
    return {
      title: "Category Details - Rajseba",
      description: "Professional service category details.",
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryDetailClientPage slug={slug} />;
}
