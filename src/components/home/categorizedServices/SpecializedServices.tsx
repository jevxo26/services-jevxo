// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplet,
  Phone,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  Clock,
  Loader2,
  X,
  Plus,
  Minus,
  Info,
  ShoppingCart,
  Trash2,
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
    description: "Non-invasive ultrasonic leak detection for hidden pipes. We fix everything from dripping faucets to underground line bursts.",
    price: "800",
    type: "normal",
  },
  {
    id: "plumbing-emergency",
    title: "Plumbing Emergency?",
    description: "Our rapid response team is available 24/7 for burst pipes, flooding, or severe blockages.",
    type: "emergency",
  },
];

export function SpecializedServices({
  nestedServices,
  serviceId,
  vendorId,
}: {
  nestedServices?: any[];
  serviceId?: number;
  vendorId?: number;
}) {
  const router = useRouter();
  const authUser = useAppSelector((state) => state.auth.user);
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  // Accordion & Selection State
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cartQuantities, setCartQuantities] = useState<Record<number, number>>({});
  const [activeService, setActiveService] = useState<SpecializedService | null>(null);

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
    location: "",
    notes: "",
  });
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResult | null>(null);

  const displayServices: SpecializedService[] = nestedServices && nestedServices.length > 0
    ? nestedServices.map((ns, idx) => {
      const isEmergency = nestedServices.length > 2 && idx === nestedServices.length - 1;
      return {
        id: String(ns.id),
        title: ns.name,
        description: ns.description || "Expert service technician ready to assist you.",
        price: ns.starting_price || ns.price,
        image: ns.image,
        subServices: ns.subServices || [],
        type: isEmergency ? ("emergency" as const) : ("normal" as const),
      };
    })
    : fallbackServices;

  const getCartItems = () =>
    displayServices.flatMap((service) =>
      (service.subServices || []).map((sub) => ({
        ...sub,
        parentTitle: service.title,
        quantity: cartQuantities[sub.id] || 0,
      }))
    ).filter((sub) => sub.quantity > 0);

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
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
      });
      return false;
    }

    if (cartItems.length === 0 && service) {
      const serviceSubs = service.subServices || [];
      if (serviceSubs.length > 0) {
        toast.warning("Please add at least one sub-service to your cart!");
        return false;
      }
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

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
    setCartQuantities((prev) => ({
      ...prev,
      [subId]: (prev[subId] || 0) + 1,
    }));
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
      toast.error(err?.data?.message || "Failed to place booking. Please try again.");
    }
  };

  return (
    <section className={`py-16 relative ${cartItems.length > 0 ? "pb-32" : ""}`}>
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
            className="text-[#FF7C71] hover:text-[#E5675D] font-semibold flex items-center gap-1 mt-4 md:mt-0 text-sm group"
          >
            View All Services{" "}
            <span className="group-hover:translate-x-1 transition">→</span>
          </Link>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {displayServices.map((service, index) => {
            const isExpanded = expandedId === service.id;
            const hasSubServices = service.subServices && service.subServices.length > 0;

            if (service.type === "emergency") {
              return (
                <div key={service.id} className="md:col-span-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#261817] text-white rounded-[32px] p-8 md:p-12 flex flex-col relative overflow-hidden h-full border border-slate-900"
                  >
                    <h3 className="text-3xl font-extrabold mb-4">{service.title}</h3>
                    <p className="text-slate-300 leading-relaxed mb-8 flex-1 whitespace-pre-line">
                      {service.description} Arrival in under 60 minutes.
                    </p>

                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute top-0 right-10 w-50 h-50 bg-[#FF7C71]/33 rounded-full blur-[66px]" />
                    </div>

                    <div className="flex flex-wrap gap-3 mt-auto z-10">
                      <a
                        href="tel:+8801335106726"
                        className="bg-[#FF7C71] hover:bg-[#E5675D] px-8 py-3.5 rounded-full font-bold flex items-center gap-2 transition cursor-pointer text-white no-underline text-sm shadow-lg shadow-rose-900/30"
                      >
                        <Phone className="w-4 h-4" />
                        Call Hotline
                      </a>
                    </div>

                    <div className="absolute bottom-8 right-8 text-right hidden sm:block">
                      <div className="text-7xl font-black text-[#FF7C71] leading-none">
                        60
                      </div>
                      <div className="text-[10px] uppercase tracking-[2px] font-bold text-slate-400 mt-1">
                        MINUTE ARRIVAL
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            }

            // Normal Service Cards
            return (
              <div key={service.id} className={`${index === 0 ? "md:col-span-8" : "md:col-span-4"} flex flex-col gap-3`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onClick={() => hasSubServices && toggleExpand(service.id)}
                  className={`bg-white z-10 border border-slate-100 rounded-[32px] p-6 hover:shadow-xl transition-all group flex flex-col h-full ${hasSubServices ? 'cursor-pointer hover:border-[#FF7C71]/30' : ''}`}
                >
                  <div className="flex justify-between items-start gap-4">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-16 h-16 rounded-2xl object-cover mb-6 shadow-xs border border-slate-100"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
                        <Droplet className="w-6 h-6 text-[#FF7C71]" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2 group-hover:text-[#FF7C71] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6 flex-1 whitespace-pre-line text-sm">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                    {service.price && (
                      <div>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                          Starting Price
                        </span>
                        <div className="text-[#FF7C71] font-black text-2xl">
                          ৳{Number(service.price).toLocaleString()}
                        </div>
                      </div>
                    )}

                    {!hasSubServices ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleInitiateBooking(service); }}
                        className="bg-[#FF7C71] hover:bg-[#E5675D] text-white px-7 py-3 rounded-full text-sm font-bold transition shadow-md shadow-rose-100 hover:shadow-lg cursor-pointer z-20"
                      >
                        Book Now
                      </button>
                    ) : (
                      <div className="text-slate-400 flex items-center gap-1 text-sm font-bold group-hover:text-[#FF7C71] transition-colors">
                        {isExpanded ? "Close" : "Explore"}
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* SubServices Expandable Panel - Now OUTSIDE the main card */}
                <AnimatePresence>
                  {isExpanded && hasSubServices && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-slate-50 border border-slate-100 p-5 rounded-[24px] space-y-4 shadow-inner mb-2">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Info size={14} className="text-[#FF7C71]" />
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
                                  : "border-slate-200 hover:border-slate-300 shadow-xs"
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
                                  <div className="mt-4 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-xl p-1">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUpdateQuantity(sub.id, -1);
                                        }}
                                        className="w-8 h-8 rounded-lg bg-white text-[#FF7C71] flex items-center justify-center hover:bg-rose-100 transition-colors cursor-pointer"
                                        aria-label="Decrease quantity"
                                      >
                                        <Minus size={14} strokeWidth={3} />
                                      </button>
                                      <span className="w-8 text-center text-sm font-black text-slate-800">
                                        {quantity}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUpdateQuantity(sub.id, 1);
                                        }}
                                        className="w-8 h-8 rounded-lg bg-white text-[#FF7C71] flex items-center justify-center hover:bg-rose-100 transition-colors cursor-pointer"
                                        aria-label="Increase quantity"
                                      >
                                        <Plus size={14} strokeWidth={3} />
                                      </button>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveFromCart(sub.id);
                                      }}
                                      className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
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
                                    className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 bg-[#FF7C71] text-white hover:bg-[#E5675D] shadow-sm shadow-rose-200"
                                  >
                                    <Plus size={14} strokeWidth={3} />
                                    Add to Cart
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="pt-4 mt-2 border-t border-slate-200 flex justify-end">
                          {(() => {
                            const hasSelection = service.subServices?.some((sub) => isInCart(sub.id));
                            const selectedCount = service.subServices?.reduce(
                              (sum, sub) => sum + getQuantity(sub.id),
                              0
                            ) || 0;
                            return (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleInitiateBooking(service); }}
                                disabled={!hasSelection}
                                className={`px-8 py-3 rounded-full text-sm font-bold transition shadow-md cursor-pointer ${hasSelection
                                  ? "bg-[#FF7C71] hover:bg-[#E5675D] text-white shadow-rose-100 hover:shadow-lg"
                                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                                  }`}
                              >
                                {hasSelection ? `Book Selected (${selectedCount})` : "Add services to cart"}
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
      </div>

      {/* Multi-booking cart bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pointer-events-none">
          <div className="max-w-4xl mx-auto pointer-events-auto bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[#FFF8F7] text-[#FF7C71] flex items-center justify-center shrink-0">
                <ShoppingCart size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-900">
                  {cartItemCount} service{cartItemCount === 1 ? "" : "s"} in cart
                </p>
                <p className="text-xs text-slate-500 font-semibold truncate">
                  {cartItems.map((item) => `${item.name}${item.quantity > 1 ? ` ×${item.quantity}` : ""}`).join(" · ")}
                </p>
                <p className="text-base font-black text-[#FF7C71] mt-1">
                  Total: ৳{cartTotal.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleClearCart}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                Clear
              </button>
              <button
                type="button"
                onClick={() => openBookingModal()}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#FF7C71] hover:bg-[#E5675D] transition-colors shadow-md cursor-pointer"
              >
                Book All ({cartItemCount})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Calendar size={20} className="text-[#FF7C71]" />
                Complete Booking Info
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {cartItems.length > 0 && (
                <div className="px-6 py-4 bg-[#FFF8F7] border-b border-slate-100/60 space-y-2.5">
                  <div className="text-xs font-bold text-[#FF7C71] uppercase tracking-wider flex items-center gap-1">
                    <ShoppingCart size={12} />
                    Booking Cart ({cartItemCount} item{cartItemCount === 1 ? "" : "s"})
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-2 pr-1">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-start gap-3 text-xs">
                        <div className="min-w-0">
                          <p className="font-bold text-slate-700 truncate">
                            {item.name}
                            {item.quantity > 1 ? ` ×${item.quantity}` : ""}
                          </p>
                          <p className="text-slate-400 font-semibold truncate">{item.parentTitle}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                              className="w-6 h-6 rounded-md text-[#FF7C71] flex items-center justify-center hover:bg-rose-50 transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} strokeWidth={3} />
                            </button>
                            <span className="w-5 text-center text-[11px] font-black text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                              className="w-6 h-6 rounded-md text-[#FF7C71] flex items-center justify-center hover:bg-rose-50 transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} strokeWidth={3} />
                            </button>
                          </div>
                          <span className="font-black text-slate-800 min-w-[4.5rem] text-right">
                            ৳{(Number(item.price) * item.quantity).toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                            aria-label="Remove from cart"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100/70 text-sm font-black text-slate-800">
                    <span>Subtotal</span>
                    <span className="text-slate-700">৳{cartTotal.toLocaleString()}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between items-center text-sm font-bold text-emerald-600">
                      <span>Coupon ({appliedCoupon.coupon.code})</span>
                      <span>-৳{Number(appliedCoupon.discount_amount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm font-black text-slate-800">
                    <span>Total Est. Price</span>
                    <span className="text-[#FF7C71] text-base">৳{payableTotal.toLocaleString()}</span>
                  </div>
                </div>
              )}

            <form onSubmit={handleConfirmBooking} className="p-6 space-y-5">
              {cartItems.length > 0 && (
                <CouponApply
                  subtotal={cartTotal}
                  serviceId={serviceId}
                  onApplied={setAppliedCoupon}
                />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Booking Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={bookingDetails.date}
                      onChange={(e) =>
                        setBookingDetails({ ...bookingDetails, date: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-1 focus:ring-[#FF7C71] focus:border-[#FF7C71] block p-3 outline-none transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Booking Time
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={bookingDetails.time}
                      onChange={(e) =>
                        setBookingDetails({ ...bookingDetails, time: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-1 focus:ring-[#FF7C71] focus:border-[#FF7C71] block p-3 outline-none transition-all font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Service Address *
                </label>
                <div className="relative">
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter your street address, house no, area..."
                    value={bookingDetails.location}
                    onChange={(e) =>
                      setBookingDetails({ ...bookingDetails, location: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-1 focus:ring-[#FF7C71] focus:border-[#FF7C71] block p-3 outline-none transition-all font-semibold resize-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Additional Notes
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    placeholder="Any specific requests or requirements..."
                    value={bookingDetails.notes}
                    onChange={(e) =>
                      setBookingDetails({ ...bookingDetails, notes: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-1 focus:ring-[#FF7C71] focus:border-[#FF7C71] block p-3 outline-none transition-all font-semibold resize-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => router.push("/dashbord/bookings")}
                  className="text-xs font-semibold text-slate-400 hover:text-[#FF7C71] transition-colors cursor-pointer"
                >
                  View My Bookings →
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isBooking}
                    className="px-6 py-2.5 text-sm font-bold text-white bg-[#FF7C71] hover:bg-[#E5675D] rounded-xl transition-colors shadow-md disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                  >
                    {isBooking ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
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
        </div>
      )}
    </section>
  );
}
