"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Zap, Gift, Sparkles, Loader2 } from "lucide-react";
import { useGetPublicPackagesQuery } from "@/redux/features/landing/landingApi";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PackageOfferCard } from "@/components/home/packages/PackageOfferCard";
import { PackageBookingModal } from "@/components/home/packages/PackageBookingModal";
import {
  DisplayPackage,
  mapPackagesToDisplay,
} from "@/components/home/packages/packageOfferUtils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
} as const;

// Countdown timer hook
function useCountdown(hours: number) {
  const [time, setTime] = useState(hours * 3600);
  useEffect(() => {
    const t = setInterval(() => setTime((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(time / 3600);
  const m = Math.floor((time % 3600) / 60);
  const s = time % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function SpecialOffers() {
  const countdown = useCountdown(6);
  const { data: packagesRes, isLoading } = useGetPublicPackagesQuery();

  const packagesData = packagesRes?.data || (Array.isArray(packagesRes) ? packagesRes : []);

  const router = useRouter();
  const authUser = useAppSelector((state) => state.auth.user);

  const [selectedPackage, setSelectedPackage] = useState<DisplayPackage | null>(null);

  const handleInitiateBooking = (pkg: DisplayPackage) => {
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
    <section className="py-5 md:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-14 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-[#FF6014]/10 border border-[#FF6014]/20 text-[#FF6014] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
            <Sparkles size={13} />
            Featured Promotions
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 md:w-8 md:h-8 text-[#FF6014]" />
            Special Deals & Packages
          </h2>
          <p className="mt-3 text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Grab exclusive deals and combo service packages prepared for your home care.
          </p>

          {/* Live Countdown */}
          <div className="mt-5 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-lg shadow-slate-900/10">
            <Clock size={15} className="text-[#FF6014] animate-pulse" />
            <span className="text-xs font-semibold text-slate-400">Offer ends in</span>
            <span className="text-sm font-black tabular-nums text-[#FF6014]">{countdown}</span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6014]" />
          </div>
        )}

        {/* All Packages — Flat Grid */}
        {!isLoading && packagesData.length > 0 && (() => {
          const displayPackages: DisplayPackage[] = packagesData.flatMap((section: any, sIdx: number) =>
            mapPackagesToDisplay(section.packages || [], {
              serviceId: section.service?.id,
              serviceName: section.service?.name || "",
              serviceImage: section.service?.image,
              vendorId: section.service?.vendor?.id,
              startIndex: sIdx * 10,
            })
          );

          return (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {displayPackages.map((pkg, index) => (
                <PackageOfferCard
                  key={pkg.id || index}
                  pkg={pkg}
                  index={index}
                  onBook={handleInitiateBooking}
                />
              ))}
            </motion.div>
          );
        })()}

        {/* Empty state if API has no packages */}
        {!isLoading && packagesData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-[#FF6014] mb-4">
              <Gift size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">No packages available yet</h3>
            <p className="text-sm text-slate-400 max-w-xs">Check back soon — our vendors are creating exclusive deals for you.</p>
          </div>
        )}


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
