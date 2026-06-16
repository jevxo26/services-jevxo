import {
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

const packages = [
  {
    title: "APARTMENT STARTER",
    price: "12,500",
    features: [
      "2× 2MP Indoor Cameras",
      "4-Channel DVR",
      "500GB Storage",
      "Free App Setup",
    ],
    buttonText: "Select Package",
    variant: "light",
  },
  {
    title: "FAMILY GUARD",
    price: "28,900",
    badge: "POPULAR",
    features: [
      "4× 5MP All-weather Cams",
      "8-Channel DVR",
      "1TB Storage + Smart Lock",
      "1 year Free Maintenance",
    ],
    buttonText: "Select Package",
    variant: "popular",
  },
  {
    title: "BUSINESS SUITE",
    price: "45,000",
    features: [
      "8× IP Cameras (Night Vision)",
      "16-Channel NVR",
      "2TB Server Storage",
      "24/7 Priority Support",
    ],
    buttonText: "Select Package",
    variant: "light",
  },
  {
    title: "CUSTOM SOLUTION",
    price: null,
    description:
      "For large estates, multi-floor offices, or high-security data centers. We design to your specs.",
    buttonText: "Talk to Expert",
    variant: "dark",
  },
];

export function Packages() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900">
            Exclusive Home Security Packages
          </h2>
          <p className="text-slate-600 mt-2">
            Save more with our bundled security solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-3xl p-8 relative flex flex-col h-full transition-all hover:-translate-y-1 ${
                pkg.variant === "popular"
                  ? "border-2 border-[#FF5A5F] bg-rose-50/50 shadow-xl"
                  : pkg.variant === "dark"
                    ? "bg-[#261817] text-white"
                    : "bg-white border border-slate-100"
              }`}
            >
              {/* Popular Badge */}
              {pkg.badge && (
                <div className="absolute -top-3 right-6 bg-[#FF5A5F] text-white text-xs font-bold px-4 py-1 rounded-full">
                  {pkg.badge}
                </div>
              )}

              <div className="mb-8">
                <h3
                  className={`text-lg font-semibold mb-4 ${pkg.variant === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  {pkg.title}
                </h3>

                {pkg.price ? (
                  <div className="mb-6">
                    <span className="text-4xl font-bold">৳{pkg.price}</span>
                  </div>
                ) : (
                  <div className="mb-6">
                    <h4 className="text-3xl font-bold mb-1">Get Quote</h4>
                  </div>
                )}
              </div>

              {/* Features or Description */}
              {pkg.features ? (
                <ul className="space-y-3 mb-10 flex-1">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Check className="w-5 h-5 text-[#FF5A5F] mt-0.5 flex-shrink-0" />
                      <span
                        className={
                          pkg.variant === "dark"
                            ? "text-slate-300"
                            : "text-slate-600"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 leading-relaxed mb-10 flex-1">
                  {pkg.description}
                </p>
              )}

              {/* Button */}
              <button
                className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all ${
                  pkg.variant === "dark"
                    ? "bg-slate-100 text-slate-900 hover:bg-slate-300"
                    : pkg.variant === "popular"
                      ? "bg-[#FF5A5F] text-white hover:bg-[#e04a4f]"
                      : "bg-[#261817]/90 text-white hover:bg-black"
                }`}
              >
                {pkg.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
