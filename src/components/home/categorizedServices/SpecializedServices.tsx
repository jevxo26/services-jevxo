import { motion } from "framer-motion";
import { Droplet, Phone } from "lucide-react";
import Link from "next/link";

interface SpecializedService {
  id: string;
  title: string;
  description: string;
  price?: string;
  priceLabel?: string;
  badge?: string;
  icon?: React.ReactNode;
  type: "normal" | "emergency";
  ctaText?: string;
  onCtaClick?: () => void;
}

const specializedServices: SpecializedService[] = [
  {
    id: "leak-repair",
    title: "Leak Repair & Detection",
    description:
      "Non-invasive ultrasonic leak detection for hidden pipes. We fix everything from dripping faucets to underground line bursts.",
    price: "৳800/hr",
    icon: <Droplet className="w-7 h-7 text-[#FF5A5F]" />,
    type: "normal",
  },
  {
    id: "pipe-installation",
    title: "Pipe Installation",
    description:
      "Complete PVC & PPR piping for new constructions or renovations.",
    price: "৳1,500",
    priceLabel: "From",
    type: "normal",
  },
  {
    id: "sanitary-fitting",
    title: "Sanitary Fitting",
    description:
      "Premium installation of commodes, basins, and luxury shower systems.",
    price: "৳1,200",
    priceLabel: "From",
    type: "normal",
  },
  {
    id: "plumbing-emergency",
    title: "Plumbing Emergency?",
    description:
      "Our rapid response team is available 24/7 for burst pipes, flooding, or severe blockages.",
    type: "emergency",
    ctaText: "Call Hotline",
  },
];

export function SpecializedServices({ nestedServices }: { nestedServices?: any[] }) {
  const displayServices = nestedServices && nestedServices.length > 0
    ? nestedServices.map((ns, idx) => {
        // If there's 3 or more services, make the last one an emergency card for UI design style
        const isEmergency = nestedServices.length > 2 && idx === nestedServices.length - 1;
        return {
          id: String(ns.id),
          title: ns.name,
          description: ns.description || "Expert service technician ready to assist you.",
          price: (ns.starting_price || ns.price) ? `৳${ns.starting_price || ns.price}` : undefined,
          priceLabel: undefined as string | undefined,
          type: isEmergency ? "emergency" as const : "normal" as const,
          icon: <Droplet className="w-7 h-7 text-[#FF5A5F]" />,
          ctaText: isEmergency ? "Call Hotline" : undefined,
        };
      })
    : specializedServices;

  return (
    <section className="">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-wide">
              Our Specialized Services
            </h2>
            <p className="text-slate-600 mt-1">
              Transparent pricing and expert craftsmanship.
            </p>
          </div>
          <Link
            href="/services"
            className="text-[#FF5A5F] hover:text-[#e04a4f] font-medium flex items-center gap-1 mt-4 md:mt-0 text-sm group"
          >
            View All Services{" "}
            <span className="group-hover:translate-x-1 transition">→</span>
          </Link>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {displayServices.map((service, index) => {
            if (service.type === "emergency") {
              return (
                <div key={service.id} className="md:col-span-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#261817] text-white rounded-3xl p-8 md:p-12 flex flex-col relative overflow-hidden h-full"
                  >
                    <h3 className="text-3xl font-bold mb-4">{service.title}</h3>
                    <p className="text-slate-300 leading-relaxed mb-8 flex-1">
                      {service.description} Arrival in under 60 minutes.
                    </p>

                    {/* Subtle Glow Effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute top-0 right-10 w-50 h-50 bg-[#FF5A5F]/33 rounded-full blur-[66px]" />
                    </div>

                    <div className="flex flex-wrap gap-3 mt-auto">
                      <button className="bg-[#FF5A5F] hover:bg-[#e04a4f] px-8 py-3.5 rounded-full font-semibold flex items-center gap-2 transition">
                        <Phone className="w-5 h-5" />
                        {service.ctaText || "Call Hotline"}
                      </button>
                      <button className="border border-white/40 hover:bg-white/10 px-8 py-3.5 rounded-full font-semibold transition">
                        Chat Now
                      </button>
                    </div>

                    {/* 60 Minute Badge */}
                    <div className="absolute bottom-8 right-8 text-right">
                      <div className="text-7xl font-bold text-[#FF5A5F] leading-none">
                        60
                      </div>
                      <div className="text-sm uppercase tracking-[2px] text-slate-400">
                        MINUTE ARRIVAL
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            }

            // Normal Service Cards
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`bg-white z-10 border border-slate-100 rounded-3xl p-4 md:p-6 hover:shadow-xl transition-all group ${
                  index === 0 ? "md:col-span-8" : "md:col-span-4"
                }`}
              >
                {service.icon ? (
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
                    {service.icon}
                  </div>
                ) : (
                  <div className="mb-12"></div>
                )}

                <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-8 flex-1">
                  {service.description}
                </p>

                <div className="flex items-center justify-between">
                  {service.price && (
                    <div>
                      {service.priceLabel && (
                        <span className="text-slate-500 text-sm">From </span>
                      )}
                      <span className="text-[#FF5A5F] font-bold text-2xl">
                        {service.price}
                      </span>
                    </div>
                  )}

                  <button className="bg-[#FF5A5F] hover:bg-[#e04a4f] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition">
                    Book Now
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
