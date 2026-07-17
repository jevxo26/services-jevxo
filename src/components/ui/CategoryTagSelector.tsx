"use client";

import React from "react";
import { Check } from "lucide-react";

interface CategoryTagSelectorProps {
  categories: { id: number | string; name: string }[];
  selectedIds: (number | string)[];
  onChange: (ids: (number | string)[]) => void;
  isLoading?: boolean;
  label?: string;
  hint?: string;
}

export function CategoryTagSelector({
  categories,
  selectedIds,
  onChange,
  isLoading = false,
  label,
  hint,
}: CategoryTagSelectorProps) {
  const toggle = (id: number | string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((v) => v !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
          {label}
        </label>
      )}
      {hint && (
        <p className="text-[10px] text-slate-400 font-medium mb-2">{hint}</p>
      )}
      {isLoading ? (
        <div className="flex flex-wrap gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-7 w-20 rounded-full bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="text-xs text-slate-400 italic">No categories available.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = selectedIds.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggle(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-150 cursor-pointer select-none
                  ${
                    isSelected
                      ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-sm shadow-rose-100"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-[#4F46E5]/40 hover:text-[#4F46E5] hover:bg-rose-50/50"
                  }`}
              >
                {isSelected && <Check size={11} strokeWidth={3} />}
                {cat.name}
              </button>
            );
          })}
        </div>
      )}
      {/* Hidden inputs for form submission */}
      {selectedIds.map((id) => (
        <input key={id} type="hidden" name="category_ids" value={id} />
      ))}
    </div>
  );
}
