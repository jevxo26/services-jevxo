"use client";

import { useState } from "react";
import { Calendar, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { useCreateBookingMutation } from "@/redux/features/admin/booking";
import { ValidateCouponResult } from "@/redux/features/admin/coupon";
import { CouponApply } from "@/components/home/booking/CouponApply";
import { DisplayPackage } from "./packageOfferUtils";

export function PackageBookingModal({
  selectedPackage,
  onClose,
  onSuccess,
}: {
  selectedPackage: DisplayPackage | null;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();
  const authUser = useAppSelector((state) => state.auth.user);
  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
    location: "",
    notes: "",
  });
  const [packageQuantity, setPackageQuantity] = useState(1);
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResult | null>(
    null
  );

  if (!selectedPackage) return null;

  const packageUnitPrice = selectedPackage.price
    ? Number(String(selectedPackage.price).replace(/,/g, ""))
    : 0;
  const packageSubtotal = packageUnitPrice * packageQuantity;
  const packagePayableTotal = appliedCoupon
    ? appliedCoupon.final_price
    : packageSubtotal;

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingDetails.date || !bookingDetails.location) {
      toast.error("Booking Date and Service Location are required!");
      return;
    }

    const payload = {
      user_id: authUser?.id,
      package_id: selectedPackage.id,
      service_id: selectedPackage.serviceId,
      vendor_id: selectedPackage.vendorId || 1,
      quantity: packageQuantity,
      coupon_code: appliedCoupon?.coupon.code,
      date: bookingDetails.date,
      time: bookingDetails.time || undefined,
      location: bookingDetails.location,
      notes: bookingDetails.notes || undefined,
    };

    try {
      await createBooking(payload).unwrap();
      toast.success("Your package booking has been placed successfully!");
      onClose();
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to place booking. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Calendar size={20} className="text-[#FF7C71]" />
            Complete Booking Info
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4 bg-[#FFF8F7] border-b border-slate-100/60 space-y-2.5">
          <div className="text-xs font-bold text-[#FF7C71] uppercase tracking-wider">
            Selected Package
          </div>
          <div className="flex justify-between items-center text-sm font-bold text-slate-800">
            <span>{selectedPackage.title}</span>
            {selectedPackage.price && (
              <span className="text-[#FF7C71] text-base">
                ৳{packagePayableTotal.toLocaleString()}
              </span>
            )}
          </div>
          {appliedCoupon && (
            <p className="text-xs font-semibold text-emerald-600">
              Coupon {appliedCoupon.coupon.code} — saved ৳
              {Number(appliedCoupon.discount_amount).toLocaleString()}
            </p>
          )}
        </div>

        <form onSubmit={handleConfirmBooking} className="p-6 space-y-5">
          <CouponApply
            subtotal={packageSubtotal}
            serviceId={selectedPackage.serviceId}
            packageId={selectedPackage.id}
            onApplied={setAppliedCoupon}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPackageQuantity((qty) => Math.max(1, qty - 1))}
                className="w-10 h-10 rounded-xl border border-slate-200 text-[#FF7C71] font-black hover:bg-rose-50 transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="w-12 text-center text-lg font-black text-slate-800">
                {packageQuantity}
              </span>
              <button
                type="button"
                onClick={() => setPackageQuantity((qty) => qty + 1)}
                className="w-10 h-10 rounded-xl border border-slate-200 text-[#FF7C71] font-black hover:bg-rose-50 transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Booking Date *
              </label>
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
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Booking Time
              </label>
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

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
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
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-1 focus:ring-[#FF7C71] focus:border-[#FF7C71] block p-3 outline-none transition-all font-semibold resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Additional Notes
            </label>
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

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
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
              ) : (
                "Confirm Booking"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
