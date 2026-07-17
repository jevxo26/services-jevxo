"use client";

import React, { useState } from "react";
import { X, Ticket, AlertCircle, Info, Zap, Loader2 } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { useCreateSupportTicketMutation } from "@/redux/features/client/helpApi";
import { toast } from "sonner";

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const priorities = [
  { value: "low",    label: "Low",    icon: Info,         color: "text-slate-500", bg: "bg-slate-100 border-slate-200" },
  { value: "medium", label: "Medium", icon: AlertCircle,  color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  { value: "high",   label: "High",   icon: Zap,          color: "text-rose-600",  bg: "bg-rose-50 border-rose-200" },
];

const categories = [
  { value: "booking", label: "Booking Problem" },
  { value: "payment", label: "Billing & Payment" },
  { value: "account", label: "Account & Access" },
  { value: "other",   label: "Other / General" },
];

export default function TicketModal({ isOpen, onClose }: TicketModalProps) {
  const lang = useAppSelector((state) => state.lang.value);

  const [form, setForm] = useState({
    subject: "",
    description: "",
    priority: "medium",
    category: "booking",
  });

  const [createTicket, { isLoading: isSubmitting }] = useCreateSupportTicketMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.description.trim()) {
      toast.error(lang === "bn" ? "বিষয় ও বিবরণ লিখুন" : "Subject and description are required");
      return;
    }

    try {
      await createTicket({
        subject: form.subject.trim(),
        description: form.description.trim(),
        priority: form.priority,
        category: form.category,
      }).unwrap();

      toast.success(lang === "bn" ? "টিকেট সফলভাবে তৈরি হয়েছে!" : "Support ticket created successfully!");
      setForm({ subject: "", description: "", priority: "medium", category: "booking" });
      onClose();
    } catch (err) {
      toast.error(lang === "bn" ? "টিকেট তৈরি ব্যর্থ হয়েছে" : "Failed to create support ticket");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#4F46E5]/10 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3 relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#4338CA] flex items-center justify-center shadow-lg shadow-[#4F46E5]/25">
              <Ticket size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                {lang === "bn" ? "নতুন সাপোর্ট টিকেট" : "New Support Ticket"}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {lang === "bn" ? "গ্রাহকের পক্ষ থেকে টিকেট তৈরি করুন" : "Submit a support request on behalf of a client"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-auto w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              {lang === "bn" ? "বিষয়বস্তু" : "Ticket Subject"} <span className="text-[#4F46E5]">*</span>
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder={lang === "bn" ? "সমস্যার সংক্ষিপ্ত বিবরণ..." : "Brief summary of the issue..."}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10 transition-all"
            />
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                {lang === "bn" ? "ক্যাটাগরি" : "Category"}
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-[#4F46E5] transition-all"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                {lang === "bn" ? "গুরুত্ব" : "Priority"}
              </label>
              <div className="flex gap-1.5">
                {priorities.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setForm({ ...form, priority: p.value })}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[10px] font-black border transition-all ${
                      form.priority === p.value
                        ? `${p.bg} ${p.color} shadow-sm`
                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    <p.icon size={11} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              {lang === "bn" ? "বিস্তারিত বিবরণ" : "Description"} <span className="text-[#4F46E5]">*</span>
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder={lang === "bn" ? "সমস্যার বিস্তারিত বিবরণ দিন..." : "Provide detailed information about the issue..."}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10 transition-all resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            {lang === "bn" ? "বাতিল" : "Cancel"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#4338CA] text-white text-sm font-black shadow-lg shadow-[#4F46E5]/25 hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <><Loader2 size={15} className="animate-spin" /> {lang === "bn" ? "তৈরি হচ্ছে..." : "Creating..."}</>
            ) : (
              <><Ticket size={15} /> {lang === "bn" ? "টিকেট তৈরি করুন" : "Open Ticket"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
