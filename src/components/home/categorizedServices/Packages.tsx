"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PackageOfferCard } from "../packages/PackageOfferCard";
import { PackageBookingModal } from "../packages/PackageBookingModal";
import { DisplayPackage, mapPackagesToDisplay } from "../packages/packageOfferUtils";

interface RawPackage {
  id: number;
  name: string;
  price: string;
  description?: string;
  service_id?: number;
  vendor_id?: number;
}

const fallbackRawPackages = [
  {
    id: 1,
    name: "Basic Leak Repair Bundle",
    price: "1500",
    description: "Fix up to 3 minor leaks, includes complete pipe inspection and 30-day warranty.",
    features: ["3 Minor Repairs", "Pipe Inspection", "30-day Warranty"],
  },
  {
    id: 2,
    name: "Premium Plumbing Checkup",
    price: "3200",
    description: "Full home inspection, pressure testing, drain cleaning, and 1 major repair.",
    features: ["Full Home Inspection", "Pressure Testing", "Drain Cleaning", "1 Major Repair"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function Packages({
  packages,
  serviceId,
  vendorId,
  serviceName,
  serviceImage,
}: {
  packages?: RawPackage[];
  serviceId?: number;
  vendorId?: number;
  serviceName?: string;
  serviceImage?: string;
}) {
  const [selectedPackage, setSelectedPackage] = useState<DisplayPackage | null>(null);

  const displayPackages = mapPackagesToDisplay(
    packages && packages.length > 0 ? packages : fallbackRawPackages,
    {
      serviceId: serviceId || 1,
      serviceName: serviceName || "",
      serviceImage,
      vendorId,
    }
  );

  const handleBookPackage = (pkg: DisplayPackage) => {
    setSelectedPackage(pkg);
  };

  return (
    <section className="py-6 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#FF6014]/10 border border-[#FF6014]/20 text-[#FF6014] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
            Exclusive Bundles
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Special Deals & Packages
          </h2>
          <p className="text-slate-500 text-sm mt-1 max-w-md font-medium">
            Save more with bundled solutions tailored for this service.
          </p>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
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

      {selectedPackage && (
        <PackageBookingModal
          selectedPackage={selectedPackage}
          onClose={() => setSelectedPackage(null)}
        />
      )}
    </section>
  );
}
