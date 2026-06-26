export interface DisplayPackage {
  id: number;
  title: string;
  price: string | null;
  image: string | null;
  features: string[];
  buttonText: string;
  variant: "light" | "popular" | "dark";
  badge?: string;
  description?: string;
  serviceId?: number;
  serviceName?: string;
  vendorId?: number;
}

function normalizePackageFeatures(pkg: any): string[] {
  if (Array.isArray(pkg.features)) {
    return pkg.features.map(String).map((f) => f.trim()).filter(Boolean);
  }

  if (typeof pkg.features === "string" && pkg.features.trim()) {
    return pkg.features
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
  }

  if (pkg.items?.length > 0) {
    return pkg.items
      .map((it: any) => it.nestedService?.name)
      .filter(Boolean);
  }

  return [];
}

export function mapPackagesToDisplay(
  rawPackages: any[],
  options?: {
    serviceId?: number;
    serviceName?: string;
    serviceImage?: string;
    vendorId?: number;
    startIndex?: number;
  }
): DisplayPackage[] {
  const startIndex = options?.startIndex ?? 0;

  return rawPackages.map((pkg, idx) => {
    const globalIdx = startIndex + idx;
    const variant =
      globalIdx % 3 === 1 ? "popular" : globalIdx % 3 === 2 ? "dark" : "light";
    const features = normalizePackageFeatures(pkg);

    return {
      id: pkg.id,
      title: (pkg.name || "Package").toUpperCase(),
      price: pkg.price != null && pkg.price !== ""
        ? Number(pkg.price).toLocaleString()
        : null,
      image: pkg.image || options?.serviceImage || null,
      features,
      buttonText: "Book Package",
      variant,
      badge: variant === "popular" ? "POPULAR" : undefined,
      description: pkg.description?.trim() || undefined,
      serviceId: options?.serviceId ?? pkg.service?.id,
      serviceName: options?.serviceName ?? pkg.service?.name ?? "",
      vendorId: options?.vendorId ?? pkg.service?.vendor?.id,
    };
  });
}
