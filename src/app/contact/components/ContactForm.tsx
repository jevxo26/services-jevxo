"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactFormProps {
  form: any;
  errors: any;
  submitted: boolean;
  setSubmitted: (val: boolean) => void;
  isLoading: boolean;
  handleChange: (e: any) => void;
  handleSubmit: (e: any) => void;
}

export function ContactForm({
  form, errors, submitted, setSubmitted, isLoading, handleChange, handleSubmit
}: ContactFormProps) {
  const inputBase = "w-full text-[12px] px-4 py-3 rounded-xl border bg-[#FAFAF9] text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-350 font-semibold focus:bg-white focus:ring-2";
  const inputNormal = `${inputBase} border-[#E7E5E4] focus:border-[#4F46E5] focus:ring-[#4F46E5]/10`;
  const inputError = `${inputBase} border-rose-300 focus:border-rose-400 focus:ring-rose-200/40 bg-rose-50/40`;

  return (
    <div className="relative bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#4F46E5] via-[#FF8142] to-[#4F46E5]/40 rounded-t-3xl" />
      <div className="mb-6 pt-1">
        <h2 className="text-[17px] font-black text-slate-900 tracking-tight mb-1">Send an inquiry</h2>
        <p className="text-[12px] text-slate-400 font-medium">We typically respond within 4 hours on business days.</p>
      </div>
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {[{ id: "name", label: "Full Name", type: "text", placeholder: "Mahbubur Rahman", required: true }, { id: "email", label: "Email Address", type: "email", placeholder: "yourname@gmail.com", required: true }].map(({ id, label, type, placeholder, required }) => (
                <div key={id} className="space-y-1.5">
                  <label htmlFor={id} className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em]">{label} {required && <span className="text-[#4F46E5]">*</span>}</label>
                  <input id={id} name={id} type={type} placeholder={placeholder} value={form[id]} onChange={handleChange} className={errors[id] ? inputError : inputNormal} />
                  {errors[id] && <p className="text-[10px] text-rose-500 font-bold">{errors[id]}</p>}
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em]">Phone <span className="normal-case tracking-normal font-medium text-slate-300">(optional)</span></label>
                <input id="phone" name="phone" type="tel" placeholder="+880 17XXXXXXXX" value={form.phone} onChange={handleChange} className={inputNormal} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em]">Subject Topic <span className="text-[#4F46E5]">*</span></label>
                <select id="subject" name="subject" value={form.subject} onChange={handleChange} className={errors.subject ? inputError : inputNormal} style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: '36px', appearance: 'none' }}>
                  <option value="" disabled>Select inquiry type…</option>
                  <option value="Booking Assistance">Booking Assistance</option>
                  <option value="Billing / Refund Claim">Billing / Refund Claim</option>
                  <option value="Technician Vetting Feedback">Technician Vetting Feedback</option>
                  <option value="Become a Partner">Become a Partner</option>
                  <option value="Other">Other Issues</option>
                </select>
                {errors.subject && <p className="text-[10px] text-rose-500 font-bold">{errors.subject}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="message" className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em]">Details & Context <span className="text-[#4F46E5]">*</span></label>
              <textarea id="message" name="message" rows={4} placeholder="Describe your issue or required service slot in detail…" value={form.message} onChange={handleChange} className={`${errors.message ? inputError : inputNormal} resize-none leading-relaxed`} />
              {errors.message && <p className="text-[10px] text-rose-500 font-bold">{errors.message}</p>}
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-[#4F46E5] hover:bg-[#e84e53] disabled:opacity-60 text-white text-xs font-extrabold py-3.5 h-auto rounded-xl border-none transition-colors shadow-sm flex items-center justify-center gap-2">
              {isLoading ? "Sending Enquiry..." : "Submit Inquiry"}<Send className="w-3.5 h-3.5" />
            </Button>
          </motion.form>
        ) : (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center space-y-4 py-10">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, delay: 0.1 }} className="mx-auto w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-emerald-500" />
            </motion.div>
            <div>
              <h3 className="text-[15px] font-black text-slate-900 mb-1">Inquiry Submitted!</h3>
              <p className="text-[12px] text-slate-400 font-medium max-w-xs mx-auto leading-relaxed">We've received your message and will email a response within 4 hours.</p>
            </div>
            <Button onClick={() => setSubmitted(false)} className="bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-bold px-6 py-2.5 h-auto rounded-xl border border-slate-100 shadow-none transition-colors">Send another message</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
