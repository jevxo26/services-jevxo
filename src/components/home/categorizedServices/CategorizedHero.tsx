import {
  Zap,
  ShieldCheck,
  Heart,
  Loader2,
  Star,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  useGetSavedServicesQuery,
  useToggleSavedServiceMutation,
} from "@/redux/features/admin/user";
import { useAppSelector } from "@/redux/hooks";

interface CategorizedHeroProps {
  id?: number;
  name?: string;
  description?: string;
  image?: string;
  categoryName?: string;
  rating?: number | string;
  reviewsCount?: number;
  bookingsCount?: number;
}

export function CategorizedHero({
  id,
  name,
  description,
  image,
  categoryName,
  rating = 0,
  reviewsCount = 0,
  bookingsCount = 0,
}: CategorizedHeroProps) {
  const displayName =
    name || "Certified Electrical Experts in Dhaka";

  const displayDesc =
    description ||
    "From flickering lights to full-house wiring, our certified technicians ensure your home's safety with premium electrical solutions.";

  const authUser = useAppSelector((state) => state.auth.user);

  const { data: savedServicesRes, isLoading: isLoadingSaved } =
    useGetSavedServicesQuery(undefined, {
      skip: !authUser,
    });

  const [toggleSavedService, { isLoading: isToggling }] =
    useToggleSavedServiceMutation();

  const savedServices = savedServicesRes?.data || [];

  const isSaved = id
    ? savedServices.some((s: any) => s.id === id)
    : false;

  const handleToggleSave = async () => {
    if (!authUser || !id) return;

    try {
      await toggleSavedService(id).unwrap();
    } catch (err) {
      console.error("Failed to toggle save", err);
    }
  };

  return (
    <div className="py-12 md:py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2.5">
              <div className="inline-flex items-center gap-2 bg-[#fff0f0] text-[#FF7C71] px-4 py-1.5 rounded-full text-sm font-semibold">
                <Zap className="w-4 h-4" />
                Top Rated Services
              </div>

              {categoryName && (
                <div className="inline-flex items-center gap-1.5 bg-[#FFF8F7] border border-[#FF7C71]/20 text-[#FF7C71] px-4 py-1.5 rounded-full text-sm font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  {categoryName}
                </div>
              )}
            </div>

            {/* Title */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl md:text-5xl max-w-xl font-bold leading-tight text-slate-900">
                {displayName}
              </h1>

              {authUser && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleToggleSave}
                  disabled={isToggling || isLoadingSaved}
                  className="p-3 bg-white rounded-full border border-slate-100 shadow-sm flex-shrink-0 focus:outline-none"
                >
                  {isToggling ? (
                    <Loader2
                      size={24}
                      className="animate-spin text-slate-400"
                    />
                  ) : (
                    <Heart
                      size={24}
                      className={
                        isSaved
                          ? "fill-[#FF7C71] text-[#FF7C71]"
                          : "text-slate-400"
                      }
                    />
                  )}
                </motion.button>
              )}
            </div>

            {/* Ratings & Bookings */}
            {(Number(rating) > 0 || bookingsCount > 0) && (
              <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-500">
                {Number(rating) > 0 && (
                  <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-xl border border-amber-100/60">
                    <Star className="w-4 h-4 fill-current text-amber-500" />
                    <span>{rating} Rating</span>
                    <span className="text-slate-400 font-normal">
                      ({reviewsCount} reviews)
                    </span>
                  </div>
                )}

                {bookingsCount > 0 && (
                  <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-xl border border-emerald-100/60">
                    <span className="font-bold text-emerald-800">
                      {bookingsCount}
                    </span>{" "}
                    Bookings Done
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed whitespace-pre-line line-clamp-6">
              {displayDesc}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#FF7C71] hover:bg-[#E5675D] text-white px-8 py-3.5 rounded-full font-semibold flex items-center gap-2 transition-all shadow-lg"
              >
                Book Now
                <span className="text-xl">→</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white border border-slate-200 hover:border-slate-300 px-8 py-3.5 rounded-full font-semibold text-slate-700 transition-all"
              >
                View Rate Card
              </motion.button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative mt-12 md:mt-0">
            {image ? (
              <div className="w-64 h-64 md:w-[350px] md:h-[350px] lg:w-[450px] lg:h-[450px] rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                <img
                  src={image}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="bg-rose-100 w-64 h-64 md:w-[350px] md:h-[350px] lg:w-[450px] lg:h-[450px] rounded-2xl" />
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white absolute -bottom-5 left-1/2 -translate-x-1/2 md:left-10 lg:left-20 rounded-3xl shadow-xl p-6 md:p-8 w-full max-w-[340px] border border-slate-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#fff0f0] rounded-2xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-7 h-7 text-[#FF7C71]" />
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    Verified Professional
                  </p>
                  <p className="text-sm text-slate-500">
                    Rajseba Guarantee
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}