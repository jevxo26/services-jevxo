import { Metadata } from "next";
import CategoryDetailClientPage from "./CategoryDetailClientPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const allRes = await fetch("https://service.api.jevxo.com/services/public", {
      next: { revalidate: 3600 },
    });
    const allJson = await allRes.json();
    const serviceObj = allJson?.data?.find((s: any) => s.slug === slug);
    if (!serviceObj) {
      return {
        title: "Category Details - Jevxo Services",
        description: "Professional service category details.",
      };
    }

    const res = await fetch(`https://service.api.jevxo.com/services/${serviceObj.id}`, {
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    const service = json?.data;

    if (!service) {
      return {
        title: "Category Details - Jevxo Services",
        description: "Professional service category details.",
      };
    }

    return {
      title: `${service.name} - Expert Service Category | Jevxo Services`,
      description: service.description || `Book expert ${service.name} services in Bangladesh. Professional and trusted technicians at your service.`,
      openGraph: {
        title: `${service.name} - Jevxo Services`,
        description: service.description || `Book expert ${service.name} services in Bangladesh.`,
        url: `https://jevxo.com/categories/service/${slug}`,
        siteName: "Jevxo Services",
        locale: "en_US",
        type: "website",
      },
    };
  } catch {
    return {
      title: "Category Details - Jevxo Services",
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
