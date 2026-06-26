"use client";

import { useState } from "react";
import { Loader2, Tag } from "lucide-react";
import { toast } from "sonner";
import {
  useValidateCouponMutation,
  ValidateCouponResult,
} from "@/redux/features/admin/coupon";

interface CouponApplyProps {
  subtotal: number;
  serviceId?: number;
  packageId?: number;
  onApplied: (result: ValidateCouponResult | null) => void;
}

export function CouponApply({
  subtotal,
  serviceId,
  packageId,
  onApplied,
}: CouponApplyProps) {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<ValidateCouponResult | null>(null);
  const [validateCoupon, { isLoading }] = useValidateCouponMutation();

  const handleApply = async () => {
    if (!code.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    if (subtotal <= 0) {
      toast.error("Add services before applying a coupon");
      return;
    }

    try {
      const res = await validateCoupon({
        code: code.trim(),
        subtotal,
        service_id: serviceId,
        package_id: packageId,
      }).unwrap();
      const result = res.data;
      setApplied(result);
      onApplied(result);
      toast.success(`Coupon applied! You save ৳${Number(result.discount_amount).toLocaleString()}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid or expired coupon");
      setApplied(null);
      onApplied(null);
    }
  };

  const handleRemove = () => {
    setCode("");
    setApplied(null);
    onApplied(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Tag size={12} className="text-[#FF7C71]" />
        Coupon Code
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          disabled={!!applied}
          className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-1 focus:ring-[#FF7C71] focus:border-[#FF7C71] block p-3 outline-none transition-all font-semibold uppercase disabled:opacity-70"
        />
        {applied ? (
          <button
            type="button"
            onClick={handleRemove}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Remove
          </button>
        ) : (
          <button
            type="button"
            onClick={handleApply}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#FF7C71] hover:bg-[#E5675D] transition-colors cursor-pointer disabled:opacity-70 flex items-center gap-1.5"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : null}
            Apply
          </button>
        )}
      </div>
      {applied && (
        <p className="text-xs font-semibold text-emerald-600">
          {applied.coupon.code} applied — ৳{Number(applied.discount_amount).toLocaleString()} off
        </p>
      )}
    </div>
  );
}
