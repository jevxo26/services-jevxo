"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplet,
  Phone,
  ChevronDown,
  ChevronUp,
  Calendar,
  Plus,
  Minus,
} from "lucide-react";
import Link from "next/link";

interface SubService {
  id: number;
  name: string;
  price: string;
  description?: string;
  image1?: string;
  image2?: string;
  faq?: { question: string; answer: string }[];
}

interface SpecializedService {
  id: string;
  title: string;
  description: string;
  price?: string;
  image?: string;
  subServices?: SubService[];
  type: "normal" | "emergency";
}

const fallbackServices: SpecializedService[] = [
  {
    id: "leak-repair",
    title: "Leak Repair & Detection",
    description:
      "Non-invasive ultrasonic leak detection for hidden pipes. We fix everything from dripping faucets to underground line bursts.",
    price: "800",
    type: "normal",
  },
  {
    id: "plumbing-emergency",
    title: "Plumbing Emergency?",
    description:
      "Our rapid response team is available 24/7 for burst pipes, flooding, or severe blockages.",
    type: "emergency",
  },
];

export function SpecializedServices({
  nestedServices,
  serviceId,
  vendorId,
  serviceImage,
  serviceName,
  cartQuantities,
  onUpdateQuantity,
  onAddToCart,
  onRemoveFromCart,
  onInitiateBooking,
  onSubServiceClick,
  selectedSubServiceId,
}: {
  nestedServices?: any[];
  serviceId?: number;
  vendorId?: number;
  serviceImage?: string;
  serviceName?: string;
  cartQuantities: Record<number, number>;
  onUpdateQuantity: (subId: number, delta: number) => void;
  onAddToCart: (service: any, subId: number) => void;
  onRemoveFromCart: (subId: number) => void;
  onInitiateBooking: (service: any) => void;
  onSubServiceClick?: (subService: any) => void;
  selectedSubServiceId?: number | null;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const displayServices: SpecializedService[] =
    nestedServices && nestedServices.length > 0
      ? nestedServices.map((ns, idx) => {
        const isEmergency =
          nestedServices.length > 2 && idx === nestedServices.length - 1;

        // Filter sub-services so we only show the ones belonging to this nested service (ns.id)
        const filteredSubs = (ns.subServices || ns.sub_services || []).filter((sub: any) => {
          const parentId = sub.nested_service_id || sub.nestedServiceId || sub.nestedService?.id;
          return !parentId || Number(parentId) === Number(ns.id);
        });

        return {
          id: String(ns.id),
          title: ns.name,
          description:
            ns.description || "Expert service technician ready to assist you.",
          price: ns.starting_price || ns.price,
          image: ns.image,
          subServices: filteredSubs,
          type: isEmergency ? ("emergency" as const) : ("normal" as const),
        };
      })
      : fallbackServices;

  const isInCart = (subId: number) => (cartQuantities[subId] || 0) > 0;
  const getQuantity = (subId: number) => cartQuantities[subId] || 0;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleInitiateBooking = (service: SpecializedService) => {
    const serviceSubs = service.subServices || [];
    if (serviceSubs.length > 0) {
      const hasSelection = serviceSubs.some((ss) => isInCart(ss.id));
      if (!hasSelection) {
        // Find first subservice and add it, or request user to add one
        onAddToCart(service, serviceSubs[0].id);
      }
    }
    onInitiateBooking(service);
  };

  return (
    <section className="py-4 md:py-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#FF6014]/10 border border-[#FF6014]/20 text-[#FF6014] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
            Available Services
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Our Specialized Services
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Transparent pricing and expert craftsmanship.
          </p>
        </div>
        <Link
          href="/services"
          className="text-[#FF6014] hover:text-[#E0530A] font-bold text-sm flex items-center gap-1 group self-start sm:self-auto"
        >
          View All Services{" "}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* Main Single Column Layout */}
      <div className="flex flex-col gap-5">
        {displayServices.map((service, index) => {
          const isExpanded = expandedId === service.id;
          const hasSubServices =
            service.subServices && service.subServices.length > 1;

          /* Emergency card */
          if (service.type === "emergency") {
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#261817] text-white rounded-[32px] p-6 sm:p-8
                  flex flex-col relative overflow-hidden border border-slate-900 min-h-[180px]"
              >
                {/* Glow */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 right-10 w-48 h-48 bg-[#FF6014]/20 rounded-full blur-[60px]" />
                </div>

                <h3 className="text-xl sm:text-2xl font-black mb-2 z-10">
                  {service.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-5 max-w-xl z-10 font-medium">
                  {service.description} Arrival in under 60 minutes.
                </p>

                <div className="flex flex-wrap gap-3 mt-auto z-10">
                  <a
                    href="tel:01813333373"
                    className="inline-flex items-center gap-2 bg-[#FF6014] hover:bg-[#E0530A]
                      px-6 py-3 rounded-full font-bold text-xs text-white
                      transition shadow-lg shadow-rose-900/20 cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    Call Hotline
                  </a>
                </div>

                <div className="absolute bottom-6 right-8 text-right hidden sm:block z-10">
                  <div className="text-5xl font-black text-[#FF6014] leading-none">60</div>
                  <div className="text-[9px] uppercase tracking-[2px] font-bold text-slate-400 mt-1">
                    Minute Arrival
                  </div>
                </div>
              </motion.div>
            );
          }

          /* Normal service card */
          return (
            <div key={service.id} className="flex flex-col gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => hasSubServices && toggleExpand(service.id)}
                className={`rounded-[32px] p-6 md:p-8 border transition-all duration-300 group flex flex-col sm:flex-row sm:items-center justify-between gap-6
                  ${isExpanded
                    ? "bg-gradient-to-br from-white via-white to-[#FFF8F4]/30 border-[#FF6014]/45 shadow-md shadow-[#FF6014]/5 -translate-y-0.5"
                    : "bg-white border-slate-100/90 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-lg hover:-translate-y-0.5"
                  }
                  ${hasSubServices ? "cursor-pointer hover:border-[#FF6014]/30" : ""}`}
              >
                <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6 min-w-0 flex-1">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-[24px] object-cover shadow-xs border border-slate-100 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-rose-50 rounded-[24px] flex items-center justify-center flex-shrink-0 border border-rose-100/50">
                      <Droplet className="w-8 h-8 text-[#FF6014]" />
                    </div>
                  )}
                  <div className="min-w-0 space-y-1">
                    <h3 className="text-lg md:text-xl font-black text-slate-800 group-hover:text-[#FF6014] transition-colors leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold max-w-xl">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end border-t sm:border-t-0 border-slate-50 pt-4 sm:pt-0 gap-5 shrink-0">
                  {service.price && (
                    <div className="text-left sm:text-right">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                        Starting Price
                      </span>
                      <div className="text-[#FF6014] font-black text-lg sm:text-xl">
                        ৳{Number(service.price).toLocaleString()}
                      </div>
                    </div>
                  )}

                  {!hasSubServices ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInitiateBooking(service);
                      }}
                      className="inline-flex items-center gap-1.5 bg-[#FF6014] hover:bg-[#E0530A]
                        text-white px-5 py-2.5 rounded-full text-xs font-bold
                        transition shadow-md shadow-rose-100 cursor-pointer active:scale-95"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Book Now
                    </button>
                  ) : (
                    <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95
                      ${isExpanded
                        ? "bg-[#FFF8F4] text-[#FF6014] border-[#FF6014]/40 hover:bg-[#FF6014]/10"
                        : "bg-slate-50/65 text-slate-500 border-slate-100 hover:bg-rose-50 hover:text-[#FF6014] hover:border-[#FF6014]/20"
                      }`}
                    >
                      {isExpanded ? "Hide Options" : "View Options"}
                      {isExpanded ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </div>
                  )}

                </div>
              </motion.div>

              {/* SubServices Expandable Panel */}
              <AnimatePresence>
                {isExpanded && hasSubServices && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-[#FFF8F4]/30 border border-slate-100 p-5 rounded-[28px] shadow-xs mt-3">
                      <div className="flex flex-col gap-3">
                        {service.subServices?.map((sub) => {
                          const isAdded = isInCart(sub.id);
                          const quantity = getQuantity(sub.id);
                          const isSelected = selectedSubServiceId === sub.id;
                          return (
                            <div
                              key={sub.id}
                              onClick={() => onSubServiceClick?.({ ...sub, parentTitle: service.title, parentService: service })}
                              className={`flex items-center justify-between p-4 rounded-2xl border bg-white transition-all gap-4 cursor-pointer group
                                ${isSelected
                                  ? "border-[#FF6014]/50 shadow-md ring-2 ring-[#FF6014]/10 bg-gradient-to-br from-white to-[#FFF8F4]/50"
                                  : isAdded
                                    ? "border-[#FF6014]/30 shadow-xs bg-gradient-to-br from-white to-[#FFF8F4]/20 hover:border-[#FF6014]/50"
                                    : "border-slate-100 hover:border-[#FF6014]/30 hover:shadow-sm"
                                }`}
                            >
                              <div className="min-w-0 flex-1">
                                <h4 className={`text-sm font-bold leading-snug transition-colors ${isSelected ? "text-[#FF6014]" : "text-slate-800 group-hover:text-[#FF6014]"}`}>
                                  {sub.name}
                                </h4>
                                <div className="text-[#FF6014] text-sm font-black mt-0.5">
                                  ৳{Number(sub.price).toLocaleString()}
                                </div>
                              </div>

                              <div className="shrink-0 w-28" onClick={(e) => e.stopPropagation()}>
                                {isAdded ? (
                                  <div className="flex items-center gap-1 bg-[#FFF8F4] border border-[#FF6014]/20 rounded-xl p-0.5 w-full justify-between">
                                    <button
                                      type="button"
                                      onClick={() => onUpdateQuantity(sub.id, -1)}
                                      className="w-7 h-7 rounded-lg bg-white text-[#FF6014] flex items-center justify-center hover:bg-rose-50 transition shadow-xs cursor-pointer"
                                    >
                                      <Minus size={11} strokeWidth={3} />
                                    </button>
                                    <span className="text-xs font-black text-slate-800">{quantity}</span>
                                    <button
                                      type="button"
                                      onClick={() => onUpdateQuantity(sub.id, 1)}
                                      className="w-7 h-7 rounded-lg bg-white text-[#FF6014] flex items-center justify-center hover:bg-rose-50 transition shadow-xs cursor-pointer"
                                    >
                                      <Plus size={11} strokeWidth={3} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      onAddToCart(service, sub.id);
                                      onSubServiceClick?.({ ...sub, parentTitle: service.title, parentService: service });
                                    }}
                                    className="w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 bg-[#FF6014] text-white hover:bg-[#E0530A] shadow-xs"
                                  >
                                    <Plus size={12} strokeWidth={3} />
                                    Add
                                  </button>
                                )}
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}