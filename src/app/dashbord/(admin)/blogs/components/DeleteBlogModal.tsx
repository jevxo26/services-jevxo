"use client";

import { useAppSelector } from "@/redux/hooks";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Blog } from "@/redux/features/admin/blog";

interface DeleteBlogModalProps {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;
  blogToDelete: Blog | null;
  setBlogToDelete: (blog: Blog | null) => void;
  handleDelete: () => Promise<void>;
}

export default function DeleteBlogModal({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  blogToDelete,
  setBlogToDelete,
  handleDelete,
}: DeleteBlogModalProps) {
  const lang = useAppSelector((state) => state.lang.value);

  if (!isDeleteModalOpen || !blogToDelete) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-100 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-rose-50/50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-slate-800">
              {lang === "bn" ? "ব্লগ মুছে ফেলুন" : "Delete Blog"}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsDeleteModalOpen(false);
              setBlogToDelete(null);
            }}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Trash2 size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-slate-800 text-base leading-snug">
              {lang === "bn" ? "আপনি কি নিশ্চিত?" : "Are you sure?"}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed px-4">
              {lang === "bn"
                ? `আপনি কি সত্যিই "${blogToDelete.title}" ব্লগটি মুছে ফেলতে চান? এই অ্যাকশনটি পূর্বাবস্থায় ফিরিয়ে আনা যাবে না।`
                : `Do you really want to delete the blog "${blogToDelete.title}"? This action cannot be undone.`}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={() => {
              setIsDeleteModalOpen(false);
              setBlogToDelete(null);
            }}
            className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold rounded-xl text-xs transition-all active:scale-[0.98]"
          >
            {lang === "bn" ? "বাতিল" : "Cancel"}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all active:scale-[0.98] shadow-md shadow-rose-600/10"
          >
            {lang === "bn" ? "মুছে ফেলুন" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
