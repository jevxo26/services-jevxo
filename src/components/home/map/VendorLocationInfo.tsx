"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { Expert } from "./types";

function formatLocationLabel(name: string, banglaName?: string) {
  if (banglaName && banglaName !== name) {
    return `${name} · ${banglaName}`;
  }
  return name;
}

export default function VendorLocationInfo({
  expert,
  compact = false,
  variant = "default",
}: {
  expert: Expert;
  compact?: boolean;
  variant?: "default" | "light";
}) {
  const hasDistrict = Boolean(expert.district);
  const hasDivision = Boolean(expert.division);
  const textSize = compact ? "text-[10px] sm:text-[11px]" : "text-[11px] sm:text-xs";
  const isLight = variant === "light";
  const mutedClass = isLight ? "text-white/80" : "text-slate-500";
  const labelClass = isLight ? "text-white/60" : "text-slate-400";
  const strongClass = isLight ? "text-white font-semibold" : "text-slate-600 font-semibold";
  const pinClass = isLight ? "text-white" : "text-[#FF6014]";

  if (!hasDistrict && !hasDivision) {
    return (
      <p className={`${textSize} ${mutedClass} flex items-center gap-1`}>
        <MapPin className="w-3.5 h-3.5 shrink-0" />
        {expert.location}
      </p>
    );
  }

  return (
    <div className={`space-y-1 ${textSize} ${mutedClass}`}>
      {hasDistrict && (
        <p className={`flex items-start gap-1.5 ${strongClass}`}>
          <MapPin className={`w-3.5 h-3.5 shrink-0 ${pinClass} mt-0.5`} />
          <span>
            <span className={`${labelClass} font-bold uppercase tracking-wide text-[8px] sm:text-[10px] mr-1`}>
              District
            </span>
            {formatLocationLabel(expert.district, expert.districtBangla)}
          </span>
        </p>
      )}
      {hasDivision && (
        <p className={`pl-5 font-medium ${mutedClass}`}>
          <span className={`${labelClass} font-bold uppercase tracking-wide text-[8px] sm:text-[10px] mr-1`}>
            Division
          </span>
          {formatLocationLabel(expert.division, expert.divisionBangla)}
        </p>
      )}
      {expert.area ? (
        <p className={`pl-5 font-medium ${isLight ? "text-white/70" : "text-slate-400"}`}>
          <span className="font-bold uppercase tracking-wide text-[8px] sm:text-[10px] mr-1">Area</span>
          {expert.area}
        </p>
      ) : null}
      {expert.address ? (
        <p className={`pl-5 font-medium leading-relaxed ${isLight ? "text-white/70" : "text-slate-400"}`}>
          <span className="font-bold uppercase tracking-wide text-[8px] sm:text-[10px] mr-1">Address</span>
          {expert.address}
        </p>
      ) : null}
    </div>
  );
}
