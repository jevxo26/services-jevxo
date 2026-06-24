import { Metadata } from "next";
import ServiceDetailClientPage from "./ServiceDetailClientPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`https://rajseba-api-production.up.railway.app/services/${id}`, {
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    const service = json?.data;

    if (!service) {
      return {
        title: "Service Details - Rajseba",
        description: "Professional home services details.",
      };
    }

    return {
      title: `${service.name} - Professional Home Services | Rajseba`,
      description: service.description || `Book professional ${service.name} services in Bangladesh. Vetted experts, safe and guaranteed satisfaction.`,
      openGraph: {
        title: `${service.name} - Rajseba`,
        description: service.description || `Professional ${service.name} services in Bangladesh.`,
        url: `https://rajseba.com/services/${id}`,
        siteName: "Rajseba",
        locale: "en_US",
        type: "website",
      },
    };
  } catch {
    return {
      title: "Service Details - Rajseba",
      description: "Professional home services details.",
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ServiceDetailClientPage id={id} />;
}
