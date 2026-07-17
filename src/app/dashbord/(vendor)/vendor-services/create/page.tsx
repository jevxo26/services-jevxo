"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload";
import { useCreateServiceMutation } from "@/redux/features/admin/service";
import { useGetAllCategoriesQuery } from "@/redux/features/admin/category";
import { useGetAllUsersQuery } from "@/redux/features/admin/user";
import { Sparkles, PlusCircle, Trash2, Image as ImageIcon, ArrowLeft, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/select";
import RichTextEditor from "@/components/ui/RichTextEditor";
import Link from "next/link";

export default function CreateVendorServicePage() {
  const router = useRouter();
  const rawRole = useAppSelector((state) => state.auth.role) || "vendor";
  const role = typeof rawRole === "string" ? rawRole.toLowerCase().replace(/\s+/g, "") : "client";
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id || currentUser?._id || "";

  const { data: apiCategoriesRes } = useGetAllCategoriesQuery();
  const { data: apiUsersRes } = useGetAllUsersQuery();
  const [createMut, { isLoading: isCreating }] = useCreateServiceMutation();

  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [overview, setOverview] = useState("");
  const [details, setDetails] = useState("");
  const [faq, setFaq] = useState<{ question: string; answer: string }[]>([]);
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("NONE");
  const [employeeIds, setEmployeeIds] = useState<number[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const allCategories = apiCategoriesRes?.data || (Array.isArray(apiCategoriesRes) ? apiCategoriesRes : []);
  const categoryOptions = [
    { value: "NONE", label: "ক্যাটাগরি নির্বাচন করুন" },
    ...allCategories.map((c: any) => ({
      value: String(c.id),
      label: c.name,
    })),
  ];

  const allUsers = apiUsersRes?.data || (Array.isArray(apiUsersRes) ? apiUsersRes : []);

  const employeeOptions = allUsers
    .filter((u: any) => u.role?.name === "Employee" || u.role === "Employee")
    .filter((u: any) => String(u.vendor?.id || u.vendor) === String(currentUserId))
    .map((u: any) => ({
      id: Number(u.id || u._id),
      name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown",
    }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const url = await uploadImage(file);
      setImage(url);
      toast.success("ছবি আপলোড সফল হয়েছে!");
    } catch (err: any) {
      toast.error(err.message || "ছবি আপলোড করতে ব্যর্থ হয়েছে");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("সার্ভিসের নাম প্রয়োজন");
      return;
    }
    if (!slug.trim()) {
      toast.error("স্লাগ প্রয়োজন");
      return;
    }
    try {
      await createMut({
        name: name.trim(),
        subtitle: subtitle.trim() || undefined,
        slug: slug.trim(),
        description: description.trim() || undefined,
        overview: overview.trim() || undefined,
        details: details.trim() || undefined,
        faq: faq.length > 0 ? faq : undefined,
        image: image || undefined,
        category_id: categoryId !== "NONE" ? Number(categoryId) : undefined,
        vendor_id: Number(currentUserId),
        employee_ids: employeeIds.length > 0 ? employeeIds : undefined,
      }).unwrap();
      toast.success("সার্ভিস সফলভাবে তৈরি হয়েছে!");
      router.push("/dashbord/vendor-services");
    } catch (err: any) {
      toast.error(err.data?.message || err.message || "সার্ভিস তৈরি করতে ব্যর্থ হয়েছে");
    }
  };

  if (role !== "superadmin" && role !== "vendor") {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-bold text-slate-800">প্রবেশাধিকার নেই</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
        <Link
          href="/dashbord/vendor-services"
          className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="text-[#4F46E5]" size={20} /> নতুন সার্ভিস যোগ করুন
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">প্ল্যাটফর্মে আপনার নতুন সার্ভিস অফার যোগ করুন।</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                সার্ভিস নাম *
              </label>
              <Input
                placeholder="e.g. AC Repairing"
                value={name}
                onChange={(e) => {
                  const val = e.target.value;
                  setName(val);
                  setSlug(
                    val
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)+/g, "")
                  );
                }}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">স্লাগ *</label>
              <Input placeholder="e.g. ac-repairing" value={slug} onChange={(e) => setSlug(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                সাবটাইটেল
              </label>
              <Input placeholder="সংক্ষিপ্ত ট্যাগলাইন" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                ক্যাটাগরি
              </label>
              <CustomSelect 
                options={categoryOptions} 
                value={categoryId} 
                onChange={(val) => {
                  setCategoryId(val);
                }} 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              এমপ্লয়ীজ (Employees)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-4 border border-slate-200 rounded-xl bg-slate-50">
              {employeeOptions.length > 0 ? (
                employeeOptions.map((emp: any) => (
                  <label key={emp.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-[#4F46E5] focus:ring-[#4F46E5]/30"
                      checked={employeeIds.includes(emp.id)}
                      onChange={(e) => {
                        if (e.target.checked) setEmployeeIds([...employeeIds, emp.id]);
                        else setEmployeeIds(employeeIds.filter((id) => id !== emp.id));
                      }}
                    />
                    <span className="text-sm text-slate-700">{emp.name}</span>
                  </label>
                ))
              ) : (
                <span className="text-xs text-slate-400 col-span-2">
                  আপনার কোনো এমপ্লয়ী পাওয়া যায়নি। অনুগ্রহ করে আগে আপনার অ্যাকাউন্টে এমপ্লয়ী যোগ করুন।
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              ডেসক্রিপশন
            </label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="এই সার্ভিস সম্পর্কে বর্ণনা করুন..."
              minHeight={150}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              ওভারভিউ
            </label>
            <RichTextEditor
              value={overview}
              onChange={setOverview}
              placeholder="সার্ভিস ওভারভিউ..."
              minHeight={150}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">বিস্তারিত</label>
            <RichTextEditor
              value={details}
              onChange={setDetails}
              placeholder="বিস্তারিত তথ্য..."
              minHeight={150}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">FAQs</label>
              <button
                type="button"
                onClick={() => setFaq([...faq, { question: "", answer: "" }])}
                className="text-xs text-[#4F46E5] font-bold hover:underline flex items-center gap-1"
              >
                <PlusCircle size={14} /> FAQ যোগ করুন
              </button>
            </div>
            <div className="space-y-4">
              {faq.map((f, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 relative"
                >
                  <button
                    type="button"
                    onClick={() => setFaq(faq.filter((_, idx) => idx !== i))}
                    className="absolute -top-2 -right-2 bg-[#E0E7FF] text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white rounded-full p-1.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                  <Input
                    placeholder="প্রশ্ন"
                    value={f.question}
                    onChange={(e) => {
                      const newFaq = [...faq];
                      newFaq[i].question = e.target.value;
                      setFaq(newFaq);
                    }}
                  />
                  <RichTextEditor
                    value={f.answer}
                    onChange={(val) => {
                      setFaq(faq.map((item, idx) =>
                        idx === i ? { ...item, answer: val } : item
                      ));
                    }}
                    placeholder="উত্তর"
                    minHeight={100}
                  />
                </div>
              ))}
              {faq.length === 0 && <p className="text-sm text-slate-400 italic">এখনো কোনো FAQ যোগ করা হয়নি।</p>}
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              সার্ভিস ছবি
            </label>
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="w-20 h-20 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 relative group shadow-sm">
                {image ? (
                  <>
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImage("")}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150 rounded-2xl"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <ImageIcon className="text-slate-400" size={24} />
                )}
              </div>
              <label className="cursor-pointer bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold px-4 py-2.5 rounded-lg inline-flex items-center gap-2 transition-all active:scale-[0.98]">
                {isUploadingImage ? "Uploading..." : "Browse Photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashbord/vendor-services")}
              className="px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
            >
              বাতিল করুন
            </button>
            <button
              type="submit"
              disabled={isCreating || isUploadingImage}
              className="bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-[#4F46E5]/10"
            >
              {isCreating ? "তৈরি হচ্ছে..." : "সার্ভিস তৈরি করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
