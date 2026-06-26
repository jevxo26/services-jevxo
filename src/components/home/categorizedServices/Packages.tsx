"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { PackageOfferCard } from "@/components/home/packages/PackageOfferCard";
import { PackageBookingModal } from "@/components/home/packages/PackageBookingModal";
import {
  DisplayPackage,
  mapPackagesToDisplay,
} from "@/components/home/packages/packageOfferUtils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
} as const;

export function Packages({
  packages: inputPackages,
  serviceId,
  vendorId,
  serviceName,
  serviceImage,
}: {
  packages?: any[];
  serviceId?: number;
  vendorId?: number;
  serviceName?: string;
  serviceImage?: string;
}) {
  const router = useRouter();
  const authUser = useAppSelector((state) => state.auth.user);
  const [selectedPackage, setSelectedPackage] = useState<DisplayPackage | null>(
    null
  );

  if (!inputPackages || inputPackages.length === 0) {
    return null;
  }

  const displayPackages = mapPackagesToDisplay(inputPackages, {
    serviceId,
    serviceName,
    serviceImage,
    vendorId,
  });

  const handleBookPackage = (pkg: DisplayPackage) => {
    if (!authUser) {
      toast.error("Please login to proceed with booking!", {
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }
    setSelectedPackage(pkg);
  };

  return (
    <section className="py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#FF7C71]/10 border border-[#FF7C71]/20 text-[#FF7C71] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
              Exclusive Bundles
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Special Deals & Packages
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-md">
              Save more with bundled solutions tailored for this service.
            </p>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {displayPackages.map((pkg, index) => (
            <PackageOfferCard
              key={pkg.id}
              pkg={pkg}
              index={index}
              onBook={handleBookPackage}
            />
          ))}
        </motion.div>
      </div>

      {selectedPackage && (
        <PackageBookingModal
          selectedPackage={selectedPackage}
          onClose={() => setSelectedPackage(null)}
        />
      )}
    </section>
  );
}
