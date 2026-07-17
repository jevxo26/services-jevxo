"use client";

import React from "react";
import { X, Trash2, Folder, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomSelect } from "@/components/ui/select";
import { Category } from "@/redux/features/admin/category";

interface CategoryModalProps {
  editingCategory: Category | null;
  setIsModalOpen: (val: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  name: string;
  setName: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  order: number;
  setOrder: (val: number) => void;
  icon: string;
  setIcon: (val: string) => void;
  isUploadingImage: boolean;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  parentId: string;
  setParentId: (val: string) => void;
  parentOptions: any[];
  isCreating: boolean;
  isUpdating: boolean;
}

export default function CategoryModal({
  editingCategory,
  setIsModalOpen,
  handleSubmit,
  name,
  setName,
  description,
  setDescription,
  order,
  setOrder,
  icon,
  setIcon,
  isUploadingImage,
  handleImageChange,
  parentId,
  setParentId,
  parentOptions,
  isCreating,
  isUpdating,
}: CategoryModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Category Name *
            </label>
            <Input
              placeholder="e.g. Home Cleaning"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Description
            </label>
            <Textarea
              placeholder="Provide a brief description of the category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-2xl border border-slate-200/80 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/20 focus-visible:border-rose-400/80 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Display Order
            </label>
            <Input
              type="number"
              placeholder="0"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Category Image / Icon
            </label>
            <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div className="w-16 h-16 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 relative group shadow-sm">
                {icon ? (
                  <>
                    <img src={icon} alt="Category Icon" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setIcon("")}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150 rounded-2xl"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <Folder className="text-slate-400" size={24} />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <label className="cursor-pointer bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10">
                    {isUploadingImage ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <PlusCircle size={14} /> Upload Image
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                  </label>
                  {icon && (
                    <button
                      type="button"
                      onClick={() => setIcon("")}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all active:scale-[0.98]"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">Supports JPG, PNG, GIF. Max file size 5MB.</p>
              </div>
            </div>
          </div>

          <div>
            <CustomSelect
              label="Parent Category"
              options={parentOptions}
              value={parentId}
              onChange={(val) => setParentId(val)}
              placeholder="Select a parent category"
            />
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
              {editingCategory ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
