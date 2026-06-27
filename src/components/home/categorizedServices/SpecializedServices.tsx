"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplet,
  Phone,
  ChevronDown,
  ChevronUp,
  Calendar,
  Loader2,
  X,
  Plus,
  Minus,
  Info,
  ShoppingCart,
  Trash2,
  ShieldCheck,
  Award,
  Clock,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { useCreateBookingMutation } from "@/redux/features/admin/booking";
import { ValidateCouponResult } from "@/redux/features/admin/coupon";
import { CouponApply } from "@/components/home/booking/CouponApply";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SubService {
  id: number;
  name: string;
  price: string;
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

const trustPoints = [
  { icon: ShieldCheck, text: "Insured and bonded work" },
  { icon: Award, text: "License verified experts" },
  { icon: Clock, text: "On-time guarantee" },
  { icon: Star, text: "98% satisfaction rate" },
];

export function SpecializedServices({
  nestedServices,
  serviceId,
  vendorId,
  serviceImage,
  serviceName,
}: {
  nestedServices?: any[];
  serviceId?: number;
  vendorId?: number;
  serviceImage?: string;
  serviceName?: string;
}) {
  const router = useRouter();
  const authUser = useAppSelector((state) => state.auth.user);
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cartQuantities, setCartQuantities] = useState<Record<number, number>>({});
  const [activeService, setActiveService] = useState<SpecializedService | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
    location: "",
    notes: "",
  });
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResult | null>(null);

  const displayServices: SpecializedService[] =
    nestedServices && nestedServices.length > 0
      ? nestedServices.map((ns, idx) => {
        const isEmergency =
          nestedServices.length > 2 && idx === nestedServices.length - 1;
        return {
          id: String(ns.id),
          title: ns.name,
          description:
            ns.description || "Expert service technician ready to assist you.",
          price: ns.starting_price || ns.price,
          image: ns.image,
          subServices: ns.subServices || [],
          type: isEmergency ? ("emergency" as const) : ("normal" as const),
        };
      })
      : fallbackServices;

  const getCartItems = () =>
    displayServices
      .flatMap((service) =>
        (service.subServices || []).map((sub) => ({
          ...sub,
          parentTitle: service.title,
          quantity: cartQuantities[sub.id] || 0,
        }))
      )
      .filter((sub) => sub.quantity > 0);

  const cartItems = getCartItems();
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0
  );
  const payableTotal = appliedCoupon ? appliedCoupon.final_price : cartTotal;

  const isInCart = (subId: number) => (cartQuantities[subId] || 0) > 0;
  const getQuantity = (subId: number) => cartQuantities[subId] || 0;

  const openBookingModal = (service?: SpecializedService | null) => {
    if (!authUser) {
      toast.error("Please login to proceed with booking!", {
        action: { label: "Login", onClick: () => router.push("/login") },
      });
      return false;
    }
    if (cartItems.length === 0 && !service) {
      toast.warning("Your cart is empty. Add services before booking.");
      return false;
    }
    setActiveService(service || null);
    setAppliedCoupon(null);
    setIsModalOpen(true);
    return true;
  };

  const toggleExpand = (id: string) =>
    setExpandedId(expandedId === id ? null : id);

  const handleInitiateBooking = (service: SpecializedService) => {
    const serviceSubs = service.subServices || [];
    if (serviceSubs.length > 0) {
      const hasSelection = serviceSubs.some((ss) => isInCart(ss.id));
      if (!hasSelection && cartItems.length === 0) {
        toast.warning("Please add at least one sub-service to your cart!");
        return;
      }
    }
    openBookingModal(service);
  };

  const handleAddToCart = (service: SpecializedService, subId: number) => {
    if (!authUser) {
      toast.error("Please login to add services!", {
        action: { label: "Login", onClick: () => router.push("/login") },
      });
      return;
    }
    setExpandedId(service.id);
    setCartQuantities((prev) => ({ ...prev, [subId]: (prev[subId] || 0) + 1 }));
    toast.success("Added to booking cart", { duration: 1500 });
  };

  const handleUpdateQuantity = (subId: number, delta: number) => {
    setCartQuantities((prev) => {
      const nextQty = (prev[subId] || 0) + delta;
      if (nextQty <= 0) {
        const { [subId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [subId]: nextQty };
    });
  };

  const handleRemoveFromCart = (subId: number) => {
    setCartQuantities((prev) => {
      const { [subId]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleClearCart = () => {
    setCartQuantities({});
    setActiveService(null);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDetails.date || !bookingDetails.location) {
      toast.error("Booking Date and Service Location are required!");
      return;
    }
    const subServiceItems = cartItems.map((item) => ({
      sub_service_id: item.id,
      quantity: item.quantity,
    }));
    const payload = {
      user_id: authUser?.id,
      vendor_id: vendorId,
      service_id: serviceId,
      date: bookingDetails.date,
      time: bookingDetails.time || undefined,
      location: bookingDetails.location,
      notes: bookingDetails.notes || undefined,
      sub_service_items: subServiceItems,
      coupon_code: appliedCoupon?.coupon.code,
    };
    try {
      await createBooking(payload).unwrap();
      toast.success(
        cartItemCount > 1
          ? `${cartItemCount} services booked successfully! ✅`
          : "Booking placed successfully! ✅",
        {
          description: "View and track your booking from your dashboard.",
          action: {
            label: "Track Booking →",
            onClick: () => router.push("/dashbord/bookings"),
          },
          duration: 6000,
        }
      );
      setIsModalOpen(false);
      setCartQuantities({});
      setActiveService(null);
      setAppliedCoupon(null);
      setBookingDetails({ date: "", time: "", location: "", notes: "" });
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Failed to place booking. Please try again."
      );
    }
  };

  return (
    <section
      id="specialized-services"
      className={`py-12 md:py-16 relative ${cartItems.length > 0 ? "pb-36 md:pb-28" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* ── Section Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
              Our Specialized Services
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Transparent pricing and expert craftsmanship.
            </p>
          </div>
          <Link
            href="/services"
            className="text-[#FF7C71] hover:text-[#E5675D] font-semibold text-sm flex items-center gap-1 group self-start sm:self-auto"
          >
            View All Services{" "}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* ── Two-Column Layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] lg:grid-cols-[1fr_400px] gap-6 items-start">

          {/* ── LEFT: Scrollable Service Cards ── */}
          <div
            className="flex flex-col gap-4
              md:max-h-[620px] md:overflow-y-auto md:pr-2
              [&::-webkit-scrollbar]:w-1
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-rose-200
              [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {displayServices.map((service, index) => {
              const isExpanded = expandedId === service.id;
              const hasSubServices =
                service.subServices && service.subServices.length > 0;

              /* ── Emergency card ── */
              if (service.type === "emergency") {
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#261817] text-white rounded-[28px] p-6 sm:p-8
                      flex flex-col relative overflow-hidden border border-slate-900 min-h-[200px]"
                  >
                    {/* Glow */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute top-0 right-10 w-48 h-48 bg-[#FF7C71]/20 rounded-full blur-[60px]" />
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold mb-3 z-10">
                      {service.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-1 z-10">
                      {service.description} Arrival in under 60 minutes.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-auto z-10">
                      <a
                        href="tel:+8801335106726"
                        className="inline-flex items-center gap-2 bg-[#FF7C71] hover:bg-[#E5675D]
                          px-6 py-3 rounded-full font-bold text-sm text-white
                          transition shadow-lg shadow-rose-900/20 cursor-pointer"
                      >
                        <Phone className="w-4 h-4" />
                        Call Hotline
                      </a>
                    </div>

                    <div className="absolute bottom-6 right-6 text-right hidden sm:block z-10">
                      <div className="text-6xl font-black text-[#FF7C71] leading-none">60</div>
                      <div className="text-[10px] uppercase tracking-[2px] font-bold text-slate-400 mt-1">
                        Minute Arrival
                      </div>
                    </div>
                  </motion.div>
                );
              }

              /* ── Normal service card ── */
              return (
                <div key={service.id} className="flex flex-col gap-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    onClick={() => hasSubServices && toggleExpand(service.id)}
                    className={`bg-white border border-slate-100 rounded-[28px] p-5 sm:p-6
                      hover:shadow-lg transition-all group flex flex-col
                      ${hasSubServices ? "cursor-pointer hover:border-[#FF7C71]/30" : ""}`}
                  >
                    <div className="flex justify-between items-start gap-3 mb-4">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-slate-100 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <Droplet className="w-5 h-5 text-[#FF7C71]" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 group-hover:text-[#FF7C71] transition-colors leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-5 flex-1">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto gap-3 flex-wrap">
                      {service.price && (
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                            Starting Price
                          </span>
                          <div className="text-[#FF7C71] font-black text-xl">
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
                          className="inline-flex items-center gap-1.5 bg-[#FF7C71] hover:bg-[#E5675D]
                            text-white px-5 py-2.5 rounded-full text-sm font-bold
                            transition shadow-md shadow-rose-100 cursor-pointer active:scale-95"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          Book Now
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 text-sm font-bold text-slate-400 group-hover:text-[#FF7C71] transition-colors">
                          {isExpanded ? "Close" : "Explore"}
                          {isExpanded ? (
                            <ChevronUp size={15} />
                          ) : (
                            <ChevronDown size={15} />
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
                        <div className="bg-slate-50 border border-slate-100 p-4 sm:p-5 rounded-[24px] space-y-4 shadow-inner">
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Info size={13} className="text-[#FF7C71]" />
                            Explore & Add to Cart
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {service.subServices?.map((sub) => {
                              const isAdded = isInCart(sub.id);
                              const quantity = getQuantity(sub.id);
                              return (
                                <div
                                  key={sub.id}
                                  className={`flex flex-col justify-between p-4 rounded-2xl border bg-white transition-all ${isAdded
                                      ? "border-[#FF7C71] shadow-sm ring-1 ring-[#FF7C71]/20"
                                      : "border-slate-200 hover:border-slate-300"
                                    }`}
                                >
                                  <div>
                                    <h4 className="text-sm font-bold text-slate-800 leading-snug">
                                      {sub.name}
                                    </h4>
                                    <div className="text-[#FF7C71] text-lg font-black mt-1">
                                      ৳{Number(sub.price).toLocaleString()}
                                    </div>
                                  </div>

                                  {isAdded ? (
                                    <div className="mt-3 flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 rounded-xl p-1">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleUpdateQuantity(sub.id, -1);
                                          }}
                                          className="w-7 h-7 rounded-lg bg-white text-[#FF7C71] flex items-center justify-center hover:bg-rose-100 transition cursor-pointer"
                                          aria-label="Decrease"
                                        >
                                          <Minus size={13} strokeWidth={3} />
                                        </button>
                                        <span className="w-7 text-center text-sm font-black text-slate-800">
                                          {quantity}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleUpdateQuantity(sub.id, 1);
                                          }}
                                          className="w-7 h-7 rounded-lg bg-white text-[#FF7C71] flex items-center justify-center hover:bg-rose-100 transition cursor-pointer"
                                          aria-label="Increase"
                                        >
                                          <Plus size={13} strokeWidth={3} />
                                        </button>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveFromCart(sub.id);
                                        }}
                                        className="text-xs font-bold text-slate-400 hover:text-rose-500 transition cursor-pointer"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(service, sub.id);
                                      }}
                                      className="mt-3 w-full py-2.5 rounded-xl text-xs font-bold transition-all
                                        flex items-center justify-center gap-1.5 cursor-pointer active:scale-95
                                        bg-[#FF7C71] text-white hover:bg-[#E5675D] shadow-sm shadow-rose-200"
                                    >
                                      <Plus size={13} strokeWidth={3} />
                                      Add to Cart
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                            {(() => {
                              const hasSelection = service.subServices?.some((sub) =>
                                isInCart(sub.id)
                              );
                              const selectedCount =
                                service.subServices?.reduce(
                                  (sum, sub) => sum + getQuantity(sub.id),
                                  0
                                ) || 0;
                              return (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleInitiateBooking(service);
                                  }}
                                  disabled={!hasSelection}
                                  className={`px-7 py-3 rounded-full text-sm font-bold transition cursor-pointer w-full sm:w-auto
                                    flex items-center justify-center gap-2
                                    ${hasSelection
                                      ? "bg-[#FF7C71] hover:bg-[#E5675D] text-white shadow-md shadow-rose-100"
                                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    }`}
                                >
                                  <Calendar className="w-4 h-4" />
                                  {hasSelection
                                    ? `Book Selected (${selectedCount})`
                                    : "Add services to cart"}
                                </button>
                              );
                            })()}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* ── RIGHT: Sticky Image + Trust Panel ── */}
          <div className="hidden md:flex flex-col gap-4 md:sticky md:top-24">
            {/* Main service image */}
            {serviceImage ? (
              <div className="w-full aspect-[4/3] rounded-[28px] overflow-hidden border border-slate-100 shadow-md">
                <img
                  src={serviceImage}
                  alt={serviceName || "Service image"}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-[4/3] rounded-[28px] bg-rose-50 flex items-center justify-center border border-slate-100">
                <Droplet className="w-14 h-14 text-[#FF7C71] opacity-20" />
              </div>
            )}

            {/* Trust bullets */}
            <div className="bg-white border border-slate-100 rounded-[24px] p-5 space-y-3 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Why choose us
              </p>
              {trustPoints.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#FF7C71]" />
                  </div>
                  <span className="text-sm text-slate-600 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Floating Cart Bar ── */}
      <AnimatePresence>
        {cartItems.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 sm:px-4 sm:pb-4 pointer-events-none"
          >
            <div
              className="max-w-2xl mx-auto pointer-events-auto bg-white border border-slate-200
                shadow-2xl rounded-2xl p-3 sm:p-4
                flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#FFF8F7] text-[#FF7C71] flex items-center justify-center shrink-0">
                  <ShoppingCart size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900 leading-tight">
                    {cartItemCount} service{cartItemCount === 1 ? "" : "s"} in cart
                  </p>
                  <p className="text-xs text-slate-400 font-semibold truncate">
                    {cartItems
                      .map(
                        (item) =>
                          `${item.name}${item.quantity > 1 ? ` ×${item.quantity}` : ""}`
                      )
                      .join(" · ")}
                  </p>
                  <p className="text-sm font-black text-[#FF7C71]">
                    Total: ৳{cartTotal.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="px-3 py-2.5 rounded-xl text-xs font-bold text-slate-500
                    hover:bg-slate-50 border border-slate-200 transition cursor-pointer
                    flex items-center gap-1.5"
                >
                  <Trash2 size={13} />
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => openBookingModal()}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white
                    bg-[#FF7C71] hover:bg-[#E5675D] transition shadow-md cursor-pointer"
                >
                  Book All ({cartItemCount})
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Booking Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              className="bg-white w-full sm:max-w-lg sm:rounded-[32px] rounded-t-[32px]
                shadow-2xl overflow-hidden border border-slate-100 max-h-[95dvh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Calendar size={18} className="text-[#FF7C71]" />
                  Complete Booking Info
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto flex-1">
                {/* Cart Summary */}
                {cartItems.length > 0 && (
                  <div className="px-5 py-4 bg-[#FFF8F7] border-b border-slate-100/60 space-y-2">
                    <div className="text-xs font-bold text-[#FF7C71] uppercase tracking-wider flex items-center gap-1">
                      <ShoppingCart size={11} />
                      Booking Cart ({cartItemCount} item{cartItemCount === 1 ? "" : "s"})
                    </div>
                    <div className="max-h-32 overflow-y-auto space-y-2 pr-1">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-start gap-3 text-xs"
                        >
                          <div className="min-w-0">
                            <p className="font-bold text-slate-700 truncate">
                              {item.name}
                              {item.quantity > 1 ? ` ×${item.quantity}` : ""}
                            </p>
                            <p className="text-slate-400 font-semibold truncate">
                              {item.parentTitle}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5">
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(item.id, -1)}
                                className="w-6 h-6 rounded-md text-[#FF7C71] flex items-center justify-center hover:bg-rose-50 transition cursor-pointer"
                              >
                                <Minus size={11} strokeWidth={3} />
                              </button>
                              <span className="w-5 text-center text-[11px] font-black text-slate-800">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(item.id, 1)}
                                className="w-6 h-6 rounded-md text-[#FF7C71] flex items-center justify-center hover:bg-rose-50 transition cursor-pointer"
                              >
                                <Plus size={11} strokeWidth={3} />
                              </button>
                            </div>
                            <span className="font-black text-slate-800 min-w-[4rem] text-right">
                              ৳{(Number(item.price) * item.quantity).toLocaleString()}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="text-slate-400 hover:text-rose-500 transition cursor-pointer"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100/70 text-sm font-black text-slate-800">
                      <span>Subtotal</span>
                      <span>৳{cartTotal.toLocaleString()}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between items-center text-sm font-bold text-emerald-600">
                        <span>Coupon ({appliedCoupon.coupon.code})</span>
                        <span>-৳{Number(appliedCoupon.discount_amount).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm font-black text-slate-800">
                      <span>Total Est. Price</span>
                      <span className="text-[#FF7C71] text-base">
                        ৳{payableTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleConfirmBooking} className="p-5 space-y-4">
                  {cartItems.length > 0 && (
                    <CouponApply
                      subtotal={cartTotal}
                      serviceId={serviceId}
                      onApplied={setAppliedCoupon}
                    />
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Booking Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingDetails.date}
                        onChange={(e) =>
                          setBookingDetails({ ...bookingDetails, date: e.target.value })
                        }
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm
                          rounded-xl focus:ring-1 focus:ring-[#FF7C71] focus:border-[#FF7C71]
                          p-3 outline-none transition font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Booking Time
                      </label>
                      <input
                        type="time"
                        value={bookingDetails.time}
                        onChange={(e) =>
                          setBookingDetails({ ...bookingDetails, time: e.target.value })
                        }
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm
                          rounded-xl focus:ring-1 focus:ring-[#FF7C71] focus:border-[#FF7C71]
                          p-3 outline-none transition font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Service Address *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter your street address, house no, area..."
                      value={bookingDetails.location}
                      onChange={(e) =>
                        setBookingDetails({ ...bookingDetails, location: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm
                        rounded-xl focus:ring-1 focus:ring-[#FF7C71] focus:border-[#FF7C71]
                        p-3 outline-none transition font-semibold resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Additional Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Any specific requests or requirements..."
                      value={bookingDetails.notes}
                      onChange={(e) =>
                        setBookingDetails({ ...bookingDetails, notes: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm
                        rounded-xl focus:ring-1 focus:ring-[#FF7C71] focus:border-[#FF7C71]
                        p-3 outline-none transition font-semibold resize-none"
                    />
                  </div>

                  <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => router.push("/dashbord/bookings")}
                      className="text-xs font-semibold text-slate-400 hover:text-[#FF7C71] transition cursor-pointer text-center sm:text-left"
                    >
                      View My Bookings →
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-bold text-slate-500
                          hover:bg-slate-50 rounded-xl transition cursor-pointer border border-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isBooking}
                        className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-white
                          bg-[#FF7C71] hover:bg-[#E5675D] rounded-xl transition shadow-md
                          disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isBooking ? (
                          <>
                            <Loader2 size={15} className="animate-spin" />
                            Placing...
                          </>
                        ) : cartItemCount > 1 ? (
                          `Confirm ${cartItemCount} Services`
                        ) : (
                          "Confirm Booking"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}