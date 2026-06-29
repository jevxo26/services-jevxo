"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useSubmitContactMutation } from "@/redux/features/landing/landingApi";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  MessageSquare,
  Shield,
  Headphones,
  Sparkles,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Button } from "@/components/ui/button";

/* ─── Types ──────────────────────────────────────────────────── */
interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

/* ─── Static data ────────────────────────────────────────────── */
const CONTACT_CHANNELS = [
  {
    icon: Phone,
    label: "Call Support",
    primary: "+880 9612-RAJSEBA",
    href: "tel:+8809612725732",
    secondary: "Emergency: +880 1712-345678",
    badge: "24/7 Hotline",
  },
  {
    icon: Mail,
    label: "Email Support",
    primary: "support@rajseba.com",
    href: "mailto:support@rajseba.com",
    secondary: "Partner: partners@rajseba.com",
    badge: "Replies in 4 hrs",
  },
  {
    icon: MapPin,
    label: "Visit HQ",
    primary: "House 24, Road 12, Banani",
    href: "https://maps.google.com/?q=Banani+Dhaka",
    secondary: "Dhaka-1213, Bangladesh",
    badge: "Sat – Thu (9AM-6PM)",
  },
];

const TRUST_BARS = [
  { icon: Shield, text: "100% Encrypted Enquiry" },
  { icon: Headphones, text: "Dedicated Customer Manager" },
  { icon: MessageSquare, text: "Response Within 4 Hours" },
];

const FAQS = [
  {
    question: "How do I schedule a home service on Rajseba?",
    answer:
      "Browse our service directory, pick the task required, and choose your preferred date/time slot using our calendar. A verified Rajseba professional will be matched to your booking instantly.",
  },
  {
    question: "What verification procedures do professionals go through?",
    answer:
      "Every technician goes through a multi-tier vetting process, including biometric National ID verification, criminal background checks, and a practical skill examination at the Rajseba Academy.",
  },
  {
    question: "What happens if there is accidental damage during service?",
    answer:
      "Your satisfaction and safety are our priorities. All Rajseba appointments are protected under our service insurance, covering accidental damages up to ৳10,000.",
  },
  {
    question: "Can I cancel or change my booking slot?",
    answer:
      "Yes, you can reschedule or cancel any scheduled booking up to 2 hours before the service slot begins directly through your dashboard without any cancellation penalty fee.",
  },
];

const SOCIAL_LINKS = [
  { icon: FaFacebookF, href: "https://facebook.com/rajseba", label: "Facebook" },
  { icon: FaInstagram, href: "https://instagram.com/rajseba", label: "Instagram" },
  { icon: FaLinkedinIn, href: "https://linkedin.com/company/rajseba", label: "LinkedIn" },
];

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

/* ─── Helper: section reveal wrapper ────────────────────────── */
function RevealSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ContactClientPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitContact, { isLoading }] = useSubmitContactMutation();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const glowY2 = useTransform(scrollYProgress, [0, 1], [0, 30]);

  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = "Full name is required";
    if (!form.email.trim()) next.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email address";
    if (!form.subject.trim()) next.subject = "Please select a subject";
    if (!form.message.trim()) next.message = "Message details are required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await submitContact(form).unwrap();
      setSubmitted(true);
      setForm(INITIAL_FORM);
    } catch (err) {
      console.error("Failed to submit contact form", err);
    }
  };

  /* ── Input style helpers ── */
  const inputBase =
    "w-full text-[12px] px-4 py-3 rounded-xl border bg-[#FAFAF9] text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-300 font-semibold focus:bg-white focus:ring-2";
  const inputNormal = `${inputBase} border-[#E7E5E4] focus:border-[#FF6014] focus:ring-[#FF6014]/10`;
  const inputError = `${inputBase} border-rose-300 focus:border-rose-400 focus:ring-rose-200/40 bg-rose-50/40`;

  return (
    <div className="min-h-screen ">
      <div
        className="absolute inset-0 bg-[url('/bg-icons-design.png')] bg-repeat opacity-10 pointer-events-none z-0"
        style={{ backgroundSize: 'auto' }}
      />

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative  pt-12 pb-10 md:pt-16 md:pb-12 "
      >
        {/* Ambient glows */}
        <motion.div
          style={{ y: glowY }}
          className="pointer-events-none absolute -top-32 right-0 w-[500px] h-[500px] bg-[#FF6014]/5 blur-[120px] rounded-full"
        />
        <motion.div
          style={{ y: glowY2 }}
          className="pointer-events-none absolute -bottom-16 left-1/4 w-[300px] h-[300px] bg-[#FF6014]/4 blur-[100px] rounded-full"
        />
        {/* Decorative corner arc */}
        <div className="pointer-events-none absolute top-0 right-0 w-64 h-64 border-l border-b border-[#FF6014]/6 rounded-bl-full" />

        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center relative z-10">
          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 text-[10px] font-extrabold text-[#FF6014] uppercase tracking-[.12em] bg-[#FFF4EE] px-3.5 py-1.5 rounded-full border border-[#FF6014]/20 mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014] animate-pulse" />
            Support Center
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-[clamp(28px,5vw,44px)] font-black text-slate-900 tracking-[-0.03em] leading-[1.12] mb-4"
          >
            How can we{" "}
            <span className="relative inline-block text-[#FF6014]">
              help you today?
              <span className="absolute bottom-1 left-0 w-full h-[3px] bg-[#FF6014]/15 rounded-full" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-[13px] text-slate-400 font-medium max-w-md mx-auto leading-[1.75] mb-7"
          >
            Reach our customer desk for bookings, billing, partner inquiries, or
            warranty claims. We reply within 4 hours.
          </motion.p>

          {/* Trust pills */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {TRUST_BARS.map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full"
              >
                <Icon className="w-3 h-3 text-[#FF6014]" />
                {text}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CHANNEL CARDS
      ══════════════════════════════════════════════════════════ */}
      <section className="py-6 md:py-8 bg-[#FAFAF9] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <RevealSection>
            <div className="grid md:grid-cols-3 gap-3">
              {CONTACT_CHANNELS.map(({ icon: Icon, label, primary, href, secondary, badge }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="group relative bg-white border border-slate-100 rounded-2xl p-5 flex items-start gap-4 hover:border-[#FF6014]/25 hover:shadow-[0_4px_24px_rgba(255,96,20,0.08)] transition-all duration-300 overflow-hidden"
                >
                  {/* Hover tint */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6014]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <span className="relative p-2.5 rounded-xl bg-[#FFF4EE] text-[#FF6014] flex-shrink-0 border border-[#FF6014]/10">
                    <Icon className="w-4.5 h-4.5" />
                  </span>
                  <div className="relative min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-[9px] uppercase tracking-[.12em] text-slate-400">
                        {label}
                      </h3>
                      <span className="text-[9px] font-bold text-[#FF6014] bg-[#FFF4EE] border border-[#FF6014]/15 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {badge}
                      </span>
                    </div>
                    <p className="text-[13px] font-black text-slate-800 group-hover:text-[#FF6014] transition-colors truncate">
                      {primary}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">{secondary}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FORM + SIDEBAR
      ══════════════════════════════════════════════════════════ */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-6 items-start">

            {/* ── Contact Form ── */}
            <RevealSection className="lg:col-span-7">
              <div className="relative bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden">
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF6014] via-[#FF8142] to-[#FF6014]/40 rounded-t-3xl" />

                <div className="mb-6 pt-1">
                  <h2 className="text-[17px] font-black text-slate-900 tracking-tight mb-1">
                    Send an inquiry
                  </h2>
                  <p className="text-[12px] text-slate-400 font-medium">
                    We typically respond within 4 hours on business days.
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      noValidate
                      className="space-y-4"
                    >
                      {/* Name & Email */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em]">
                            Full Name <span className="text-[#FF6014]">*</span>
                          </label>
                          <input
                            id="name" name="name" type="text"
                            placeholder="Mahbubur Rahman"
                            value={form.name}
                            onChange={handleChange}
                            className={errors.name ? inputError : inputNormal}
                          />
                          {errors.name && (
                            <p className="text-[10px] text-rose-500 font-bold">{errors.name}</p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em]">
                            Email Address <span className="text-[#FF6014]">*</span>
                          </label>
                          <input
                            id="email" name="email" type="email"
                            placeholder="yourname@gmail.com"
                            value={form.email}
                            onChange={handleChange}
                            className={errors.email ? inputError : inputNormal}
                          />
                          {errors.email && (
                            <p className="text-[10px] text-rose-500 font-bold">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      {/* Phone & Subject */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="phone" className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em]">
                            Phone{" "}
                            <span className="normal-case tracking-normal font-medium text-slate-300">(optional)</span>
                          </label>
                          <input
                            id="phone" name="phone" type="tel"
                            placeholder="+880 17XXXXXXXX"
                            value={form.phone}
                            onChange={handleChange}
                            className={inputNormal}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="subject" className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em]">
                            Subject Topic <span className="text-[#FF6014]">*</span>
                          </label>
                          <select
                            id="subject" name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            className={errors.subject ? inputError : inputNormal}
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: '36px', appearance: 'none' }}
                          >
                            <option value="" disabled>Select inquiry type…</option>
                            <option value="Booking Assistance">Booking Assistance</option>
                            <option value="Billing / Refund Claim">Billing / Refund Claim</option>
                            <option value="Technician Vetting Feedback">Technician Vetting Feedback</option>
                            <option value="Become a Partner">Become a Partner</option>
                            <option value="Other">Other Issues</option>
                          </select>
                          {errors.subject && (
                            <p className="text-[10px] text-rose-500 font-bold">{errors.subject}</p>
                          )}
                        </div>
                      </div>

                      {/* Message */}
                      <div className="space-y-1.5">
                        <label htmlFor="message" className="text-[10px] font-black text-slate-400 uppercase tracking-[.1em]">
                          Details & Context <span className="text-[#FF6014]">*</span>
                        </label>
                        <textarea
                          id="message" name="message" rows={4}
                          placeholder="Describe your issue or required service slot in detail…"
                          value={form.message}
                          onChange={handleChange}
                          className={`${errors.message ? inputError : inputNormal} resize-none leading-relaxed`}
                        />
                        {errors.message && (
                          <p className="text-[10px] text-rose-500 font-bold">{errors.message}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#FF6014] hover:bg-[#e84e53] disabled:opacity-60 text-white text-xs font-extrabold py-3.5 h-auto rounded-xl border-none transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        {isLoading ? "Sending Enquiry..." : "Submit Inquiry"}
                        <Send className="w-3.5 h-3.5" />
                      </Button>

                      <p className="text-center text-[10px] text-slate-300 font-medium pt-1">
                        Your data is encrypted and never shared with third parties.
                      </p>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center space-y-4 py-10"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                        className="mx-auto w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center"
                      >
                        <CheckCircle className="w-7 h-7 text-emerald-500" />
                      </motion.div>
                      <div>
                        <h3 className="text-[15px] font-black text-slate-900 mb-1">Inquiry Submitted!</h3>
                        <p className="text-[12px] text-slate-400 font-medium max-w-xs mx-auto leading-relaxed">
                          We've received your message and will email a response within 4 hours.
                        </p>
                      </div>
                      <Button
                        onClick={() => setSubmitted(false)}
                        className="bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-bold px-6 py-2.5 h-auto rounded-xl border border-slate-100 shadow-none transition-colors"
                      >
                        Send another message
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </RevealSection>

            {/* ── Sidebar ── */}
            <RevealSection className="lg:col-span-5 flex flex-col gap-4" delay={0.1}>

              {/* HQ Photo */}
              <div className="relative rounded-2xl overflow-hidden h-[210px] border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"
                  alt="Rajseba HQ Banani"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/20 to-transparent" />
                <div className="relative z-10 p-5 h-full flex flex-col justify-end">
                  <span className="inline-block text-[9px] font-black tracking-[.1em] text-[#FF6014] bg-white/95 px-2.5 py-1 rounded-full uppercase mb-2 w-fit">
                    Headquarters
                  </span>
                  <h3 className="font-black text-[13px] text-white mb-0.5">
                    Banani Operations Center
                  </h3>
                  <p className="text-[11px] text-white/55 font-medium">
                    Level 4, House 24, Road 12, Banani, Dhaka-1213
                  </p>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-[#FFF4EE]">
                    <Clock className="w-3.5 h-3.5 text-[#FF6014]" />
                  </div>
                  <h4 className="font-black text-[10px] text-slate-800 uppercase tracking-[.1em]">
                    Office Hours
                  </h4>
                </div>
                <ul className="space-y-2.5">
                  {[
                    ["Saturday – Thursday", "9:00 AM – 6:00 PM"],
                    ["Friday Hotline Support", "10:00 AM – 2:00 PM"],
                    ["Urgent Appliance Repairs", "24/7 Dispatch"],
                  ].map(([day, time], idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center text-[11px] pb-2.5 border-b border-slate-50 last:border-0 last:pb-0"
                    >
                      <span className="text-slate-400 font-medium">{day}</span>
                      <span className="font-black text-slate-800">{time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social */}
              <div className="bg-[#FFF4EE] border border-[#FF6014]/10 rounded-2xl p-5">
                <h4 className="font-black text-[11px] text-slate-800 mb-1.5">Join Our Community</h4>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-4">
                  Get updates on discount offers, appliance safety, and local technician audits.
                </p>
                <div className="flex gap-2">
                  {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-8 h-8 rounded-full bg-white border border-[#FF6014]/15 text-[#FF6014] flex items-center justify-center hover:bg-[#FF6014] hover:text-white hover:border-[#FF6014] transition-all duration-200 hover:scale-110"
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              </div>

            </RevealSection>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FAQ SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="  py-10 md:py-14">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <RevealSection className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#FF6014] uppercase tracking-[.12em] bg-[#FFF4EE] px-3.5 py-1.5 rounded-full border border-[#FF6014]/20 mb-4">
              <HelpCircle className="w-3 h-3" />
              General Help
            </span>
            <h2 className="text-[20px] md:text-[24px] font-black text-slate-900 tracking-tight mb-2">
              Frequently asked questions
            </h2>
            <p className="text-[12px] text-slate-400 font-medium">
              Quick answers to common support queries.
            </p>
          </RevealSection>

          <RevealSection delay={0.05}>
            <div className="space-y-2">
              {FAQS.map((faq, i) => {
                const isOpen = activeFaq === i;
                return (
                  <div
                    key={i}
                    className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? "border-[#FF6014]/20 shadow-[0_2px_12px_rgba(255,96,20,0.06)]" : "border-slate-100"
                      }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-3 p-4 text-left outline-none"
                    >
                      <span className={`text-[12px] font-bold transition-colors ${isOpen ? "text-[#FF6014]" : "text-slate-800"}`}>
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ${isOpen ? "rotate-180 text-[#FF6014]" : "text-slate-300"
                          }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-0 text-[12px] text-slate-400 font-medium leading-relaxed border-t border-slate-50 pt-3">
                            {faq.answer}
                          </div>
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

      {/* ══════════════════════════════════════════════════════════
          CTA STRIP
      ══════════════════════════════════════════════════════════ */}
      <RevealSection>
        <section className="relative bg-[#FF6014] py-10 md:py-14 overflow-hidden">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -top-16 -right-12 w-56 h-56 rounded-full bg-white/5 border border-white/8" />
          <div className="pointer-events-none absolute -bottom-10 -left-8 w-40 h-40 rounded-full bg-white/5 border border-white/8" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/3" />

          <div className="max-w-4xl mx-auto px-4 md:px-6 text-center space-y-5 relative z-10">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white/70 uppercase tracking-[.1em] bg-white/10 border border-white/15 px-3 py-1.5 rounded-full mb-1">
              <Sparkles className="w-3 h-3" />
              Verified Professionals
            </div>
            <h2 className="text-[20px] md:text-[26px] font-black text-white tracking-tight leading-tight">
              Ready to book an expert technician?
            </h2>
            <p className="text-[12px] text-white/65 max-w-md mx-auto font-medium leading-relaxed">
              Explore rates, choose a calendar slot, and get matched with background-verified professionals in Dhaka.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-1">
              <a
                href="/services"
                className="inline-flex items-center gap-2 bg-white text-[#FF6014] text-[11px] font-extrabold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
              >
                Explore Services
              </a>
              <a
                href="tel:+8809612725732"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-[11px] font-bold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Hotline
              </a>
            </div>
          </div>
        </section>
      </RevealSection>

    </div>
  );
}