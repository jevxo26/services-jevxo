"use client";

import React from "react";

interface VendorCategoryTagsProps {
  categories: string[];
  max?: number;
  size?: "sm" | "md";
}

export default function VendorCategoryTags({
  categories,
  max = 6,
  size = "sm",
}: VendorCategoryTagsProps) {
  if (!categories.length) return null;

  const shown = categories.slice(0, max);
  const extra = categories.length - max;
  const tagClass =
    size === "sm"
      ? "text-[10px] font-bold px-2 py-0.5 rounded-full"
      : "text-[11px] font-semibold px-2.5 py-1 rounded-full";

  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((category) => (
        <span
          key={category}
          className={`${tagClass} bg-slate-100 text-slate-600 border border-slate-200`}
        >
          {category}
        </span>
      ))}
      {extra > 0 && (
        <span className={`${tagClass} bg-[#EEF2FF] text-[#1E4E8C] border border-[#1E4E8C]/20`}>
          +{extra} more
        </span>
      )}
    </div>
  );
}
