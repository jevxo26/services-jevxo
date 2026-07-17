"use client";

import { useAppSelector } from "@/redux/hooks";
import { X, Upload, Loader2 } from "lucide-react";
import { Blog } from "@/redux/features/admin/blog";

interface BlogModalProps {
  editingBlog: Blog | null;
  setIsModalOpen: (open: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  images: string[];
  setImages: (images: string[]) => void;
  title: string;
  setTitle: (title: string) => void;
  overview: string;
  setOverview: (overview: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  isUploadingImage: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeImage: (index: number) => void;
  isCreating: boolean;
  isUpdating: boolean;
}

export default function BlogModal({
  editingBlog,
  setIsModalOpen,
  handleSubmit,
  images,
  title,
  setTitle,
  overview,
  setOverview,
  description,
  setDescription,
  isUploadingImage,
  handleImageUpload,
  removeImage,
  isCreating,
  isUpdating,
}: BlogModalProps) {
  const lang = useAppSelector((state) => state.lang.value);
  const isLoading = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-100 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-800 text-lg">
            {editingBlog
              ? lang === "bn"
                ? "ব্লগ সম্পাদন করুন"
                : "Edit Blog"
              : lang === "bn"
              ? "নতুন ব্লগ তৈরি করুন"
              : "Create New Blog"}
          </h3>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === "bn" ? "শিরোনাম" : "Title"} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lang === "bn" ? "ব্লগের শিরোনাম লিখুন..." : "Enter blog title..."}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#4F46E5]/30 focus:ring-4 focus:ring-[#EEF2FF] transition-all"
            />
          </div>

          {/* Overview */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === "bn" ? "সংক্ষিপ্ত বিবরণ (Overview)" : "Overview (Short Summary)"}
            </label>
            <textarea
              rows={2}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder={lang === "bn" ? "ব্লগের সংক্ষিপ্ত সারমর্ম লিখুন..." : "Enter a brief summary of the blog..."}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#4F46E5]/30 focus:ring-4 focus:ring-[#EEF2FF] transition-all resize-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === "bn" ? "বিস্তারিত বিবরণ (Description)" : "Detailed Content"} <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={lang === "bn" ? "ব্লগের মূল বিস্তারিত লিখুন..." : "Write the main body content of the blog..."}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#4F46E5]/30 focus:ring-4 focus:ring-[#EEF2FF] transition-all"
            />
          </div>

          {/* Images Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {lang === "bn" ? "ব্লগ ছবিসমূহ (সর্বোচ্চ ৩টি)" : "Blog Images (Max 3)"}
              </label>
              <span className="text-[10px] font-bold text-slate-400">
                {images.length}/3 {lang === "bn" ? "টি আপলোড করা হয়েছে" : "uploaded"}
              </span>
            </div>

            {/* Upload Box */}
            {images.length < 3 && (
              <div className="relative group border-2 border-dashed border-slate-200 hover:border-[#4F46E5]/30 rounded-2xl p-6 transition-all bg-slate-50/50 hover:bg-white text-center flex flex-col items-center justify-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {isUploadingImage ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
                    <span className="text-xs font-semibold text-slate-500">
                      {lang === "bn" ? "ছবি আপলোড হচ্ছে..." : "Uploading image..."}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-[#EEF2FF] text-[#4F46E5] rounded-2xl group-hover:scale-105 transition-transform duration-250">
                      <Upload size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-slate-700 block">
                        {lang === "bn" ? "ক্লিক করে ছবি আপলোড করুন" : "Click to upload an image"}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                        PNG, JPG, JPEG up to 5MB
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-2">
                {images.map((img, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden aspect-[4/3] border border-slate-100 shadow-sm bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1.5 right-1.5 p-1 bg-slate-900/60 hover:bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      <X size={14} />
                    </button>
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-slate-900/60 text-white font-bold text-[9px] rounded-full">
                      #{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-slate-100 pt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold rounded-xl text-xs transition-all active:scale-[0.98]"
            >
              {lang === "bn" ? "বাতিল" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-[#4F46E5]/15"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {lang === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving..."}
                </>
              ) : (
                <>
                  {editingBlog ? (lang === "bn" ? "হালনাগাদ করুন" : "Update Blog") : (lang === "bn" ? "তৈরি করুন" : "Create Blog")}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
