"use client";

import React from "react";
import { X, Trash2, Image as ImageIcon, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Hero } from "@/redux/features/admin/hero";
import { useGetAllCategoriesQuery } from "@/redux/features/admin/category";

interface HeroModalProps {
  editingHero: Hero | null;
  setIsModalOpen: (val: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  images: string[];
  setImages: (val: string[]) => void;
  text: string;
  setText: (val: string) => void;
  subtext: string;
  setSubtext: (val: string) => void;
  link: string;
  setLink: (val: string) => void;
  isUploadingImage: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  isCreating: boolean;
  isUpdating: boolean;
}

export default function HeroModal({
  editingHero,
  setIsModalOpen,
  handleSubmit,
  images,
  text,
  setText,
  subtext,
  setSubtext,
  link,
  setLink,
  isUploadingImage,
  handleImageUpload,
  removeImage,
  isCreating,
  isUpdating,
}: HeroModalProps) {
  const { data: apiCategoriesRes, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery();
  const allCategories = apiCategoriesRes?.data || (Array.isArray(apiCategoriesRes) ? apiCategoriesRes : []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {editingHero ? "Edit Hero Section" : "Add New Hero Section"}
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Main Title / Text
            </label>
            <Input
              placeholder="e.g. Find Your Next Professional Service Provider"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Subtext
            </label>
            <Textarea
              placeholder="Provide descriptive subtext..."
              value={subtext}
              onChange={(e) => setSubtext(e.target.value)}
              className="rounded-2xl border border-slate-200/80 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/20 focus-visible:border-rose-400/80 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Link to Category (Optional)
            </label>
            <select
              value={allCategories.find((c: any) => `/categories/${c.id}` === link)?.id || ""}
              onChange={(e) => {
                const catId = e.target.value;
                if (catId) {
                  setLink(`/categories/${catId}`);
                } else {
                  setLink("");
                }
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#4F46E5]/40 focus:ring-2 focus:ring-rose-100 transition-all font-medium"
            >
              <option value="">-- Select Category to Redirect --</option>
              {isCategoriesLoading ? (
                <option value="" disabled>Loading categories...</option>
              ) : (
                allCategories.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Redirect Link (Or Type Custom Link)
            </label>
            <Input
              placeholder="e.g. /services or https://..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Hero Images / Slides
            </label>
            
            {/* Images Grid */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {images.map((img, idx) => (
                <div key={idx} className="aspect-square bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden relative group shadow-sm">
                  <img src={img} alt={`Hero ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150 rounded-2xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {/* Upload Button Block */}
              <label className="aspect-square border-2 border-dashed border-slate-200 hover:border-[#4F46E5] rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-[#4F46E5] cursor-pointer transition-all bg-slate-50/50 hover:bg-[#EEF2FF]/30">
                {isUploadingImage ? (
                  <div className="w-5 h-5 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <PlusCircle size={20} />
                    <span className="text-[10px] font-bold mt-1">Upload</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                  className="hidden"
                />
              </label>
            </div>
            
            <p className="text-[10px] text-slate-400">Upload one or more images. Click on an image to remove it.</p>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-brand-primary hover:bg-brand-dark disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
            >
              {editingHero ? "Save Changes" : "Create Hero"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
