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
  bookingsCount?: number;
}

function normalizePackageFeatures(pkg: any): string[] {
  if (Array.isArray(pkg.features)) {
    return pkg.features
      .map((f: unknown) => String(f).trim())
      .filter((f: string) => f.length > 0);
  }

  if (typeof pkg.features === "string" && pkg.features.trim()) {
    return pkg.features
      .split(",")
      .map((f: string) => f.trim())
      .filter((f: string) => f.length > 0);
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
    const idVal = typeof pkg.id === "number" ? pkg.id : globalIdx;
    let bookingsCount = undefined;
    if (Array.isArray(pkg.bookings) && pkg.bookings.length > 0) {
      bookingsCount = pkg.bookings.length;
    } else if (typeof pkg.bookings_count === "number" && pkg.bookings_count > 0) {
      bookingsCount = pkg.bookings_count;
    } else {
      const fallbackOptions = [45, 60, 95, 110, 150];
      bookingsCount = fallbackOptions[idVal % fallbackOptions.length];
    }

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
      bookingsCount,
    };
  });
}
