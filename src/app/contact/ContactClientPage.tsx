"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, HelpCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactState } from "@/app/contact/hooks/useContactState";
import {
  CONTACT_CHANNELS, TRUST_BARS, FAQS, SOCIAL_LINKS, OFFICE_HOURS, RevealSection
} from "@/app/contact/components/ContactComponents";
import { ContactForm } from "@/app/contact/components/ContactForm";

export default function ContactClientPage() {
  const { form, errors, submitted, setSubmitted, activeFaq, setActiveFaq, isLoading, heroRef, glowY, glowY2, handleChange, handleSubmit } = useContactState();

  return (
    <div className="relative bg-transparent flex-1 flex flex-col">
      <div className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0" style={{ backgroundSize: 'auto' }} />

      {/* HERO */}
      <section ref={heroRef} className="relative pt-12 pb-10 md:pt-16 md:pb-12">
        <motion.div style={{ y: glowY }} className="pointer-events-none absolute -top-32 right-0 w-[500px] h-[500px] bg-[#1E4E8C]/5 blur-[120px] rounded-full" />
        <motion.div style={{ y: glowY2 }} className="pointer-events-none absolute -bottom-16 left-1/4 w-[300px] h-[300px] bg-[#1E4E8C]/4 blur-[100px] rounded-full" />
        <div className="pointer-events-none absolute top-0 right-0 w-64 h-64 border-l border-b border-[#1E4E8C]/6 rounded-bl-full" />
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="inline-flex items-center gap-2 text-[10px] font-extrabold text-[#1E4E8C] uppercase tracking-[.12em] bg-[#FFF4EE] px-3.5 py-1.5 rounded-full border border-[#1E4E8C]/20 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E4E8C] animate-pulse" />Support Center
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className="text-2xl md:text-3xl lg:text-4xl font-medium text-slate-900 tracking-[-0.03em] leading-[1.12] mb-4">
            How can we <span className="relative inline-block text-[#1E4E8C]">help you today?<span className="absolute bottom-1 left-0 w-full h-[3px] bg-[#1E4E8C]/15 rounded-full" /></span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }} className="text-[13px] text-slate-400 font-medium max-w-md mx-auto leading-[1.75] mb-7">
            Reach our customer desk for bookings, billing, partner inquiries, or warranty claims. We reply within 4 hours.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.24 }} className="flex flex-wrap justify-center gap-2">
            {TRUST_BARS.map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-50 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                <Icon className="w-3 h-3 text-[#1E4E8C]" />{text}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CONTACT CHANNELS */}
      <section className="py-6 md:py-8 bg-transparent border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <RevealSection>
            <div className="grid md:grid-cols-3 gap-3">
              {CONTACT_CHANNELS.map(({ icon: Icon, label, primary, href, secondary, badge }) => (
                <motion.a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="group relative bg-white border border-slate-100 rounded-2xl p-5 flex items-start gap-4 hover:border-[#1E4E8C]/25 hover:shadow-[0_4px_24px_rgba(30, 78, 140,0.08)] transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1E4E8C]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <span className="relative p-2.5 rounded-xl bg-[#FFF4EE] text-[#1E4E8C] flex-shrink-0 border border-[#1E4E8C]/10"><Icon className="w-4.5 h-4.5" /></span>
                  <div className="relative min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-[9px] uppercase tracking-[.12em] text-slate-400">{label}</h3>
                      <span className="text-[9px] font-bold text-[#1E4E8C] bg-[#FFF4EE] border border-[#1E4E8C]/15 px-2 py-0.5 rounded-full whitespace-nowrap">{badge}</span>
                    </div>
                    <p className="text-[13px] font-black text-slate-800 group-hover:text-[#1E4E8C] transition-colors truncate">{primary}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{secondary}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* FORM + SIDEBAR */}
      <section className="py-8 md:py-12 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            <RevealSection className="lg:col-span-7">
              <ContactForm form={form} errors={errors} submitted={submitted} setSubmitted={setSubmitted} isLoading={isLoading} handleChange={handleChange} handleSubmit={handleSubmit} />
            </RevealSection>

            <RevealSection className="lg:col-span-5 flex flex-col gap-4" delay={0.1}>
              <div className="relative rounded-2xl overflow-hidden h-[210px] border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop" alt="Rajseba HQ Rajshahi" fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/20 to-transparent" />
                <div className="relative z-10 p-5 h-full flex flex-col justify-end">
                  <span className="inline-block text-[9px] font-black tracking-[.1em] text-[#1E4E8C] bg-white/95 px-2.5 py-1 rounded-full uppercase mb-2 w-fit">Headquarters</span>
                  <h3 className="font-black text-[13px] text-white mb-0.5">Rajshahi Operations Center</h3>
                  <p className="text-[11px] text-white/55 font-medium">Rajshahi High-tech Park, Rajshahi, Bangladesh</p>
                </div>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-2 mb-4"><div className="p-1.5 rounded-lg bg-[#FFF4EE]"><Clock className="w-3.5 h-3.5 text-[#1E4E8C]" /></div><h4 className="font-black text-[10px] text-slate-800 uppercase tracking-[.1em]">Office Hours</h4></div>
                <ul className="space-y-2.5">
                  {OFFICE_HOURS.map(([day, time], idx) => (
                    <li key={idx} className="flex justify-between items-center text-[11px] pb-2.5 border-b border-slate-50 last:border-0 last:pb-0"><span className="text-slate-400 font-medium">{day}</span><span className="font-black text-slate-800">{time}</span></li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#FFF4EE] border border-[#1E4E8C]/10 rounded-2xl p-5">
                <h4 className="font-black text-[11px] text-slate-800 mb-1.5">Join Our Community</h4>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-4">Get updates on discount offers, appliance safety, and local technician audits.</p>
                <div className="flex gap-2">
                  {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-8 h-8 rounded-full bg-white border border-[#1E4E8C]/15 text-[#1E4E8C] flex items-center justify-center hover:bg-[#1E4E8C] hover:text-white hover:border-[#1E4E8C] transition-all duration-200 hover:scale-110">
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pt-10 pb-4 md:py-14">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <RevealSection className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#1E4E8C] uppercase tracking-[.12em] bg-[#FFF4EE] px-3.5 py-1.5 rounded-full border border-[#1E4E8C]/20 mb-4"><HelpCircle className="w-3 h-3" />General Help</span>
            <h2 className="text-lg md:text-xl font-medium text-slate-900 tracking-tight mb-2">Frequently asked questions</h2>
            <p className="text-[12px] text-slate-400 font-medium">Quick answers to common support queries.</p>
          </RevealSection>
          <RevealSection delay={0.05}>
            <div className="space-y-2">
              {FAQS.map((faq, i) => {
                const isOpen = activeFaq === i;
                return (
                  <div key={i} className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? "border-[#1E4E8C]/20 shadow-[0_2px_12px_rgba(30, 78, 140,0.06)]" : "border-slate-100"}`}>
                    <button type="button" onClick={() => setActiveFaq(isOpen ? null : i)} className="w-full flex items-center justify-between gap-3 p-4 text-left outline-none">
                      <span className={`text-[12px] font-bold transition-colors ${isOpen ? "text-[#1E4E8C]" : "text-slate-800"}`}>{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ${isOpen ? "rotate-180 text-[#1E4E8C]" : "text-slate-300"}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="overflow-hidden">
                          <div className="px-4 pb-4 pt-3 text-[12px] text-slate-400 font-medium leading-relaxed border-t border-slate-50">{faq.answer}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}