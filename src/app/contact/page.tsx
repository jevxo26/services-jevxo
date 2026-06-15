"use client";

import { useState, useRef } from "react";
import Image from "next/image";
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
    secondary: "Alt: +880 1712-345678",
    badge: "24 / 7 Hotline",
  },
  {
    icon: Mail,
    label: "Email Us",
    primary: "support@rajseba.com",
    href: "mailto:support@rajseba.com",
    secondary: "Corporate: info@rajseba.com",
    badge: "Reply within 4 hrs",
  },
  {
    icon: MapPin,
    label: "Visit Office",
    primary: "Level 4, House 24, Road 12, Banani",
    href: "https://maps.google.com/?q=Banani+Dhaka",
    secondary: "Dhaka-1213, Bangladesh",
    badge: "Sat – Thu  9 AM – 6 PM",
  },
];

const TRUST_BARS = [
  { icon: Shield, text: "100% Secure Enquiry" },
  { icon: Headphones, text: "Dedicated Account Manager" },
  { icon: MessageSquare, text: "Response in 4 Hours" },
];

const FAQS = [
  {
    question: "How do I book a service on Rajseba?",
    answer:
      "Browse service categories on the homepage, select what you need, pick a date and time, and confirm. A background-verified professional will be assigned immediately. You'll receive an SMS and in-app confirmation.",
  },
  {
    question: "Are all service professionals background-verified?",
    answer:
      "Yes — 100%. Every provider completes a multi-step vetting process: criminal record checks, technical skill assessments, and professional reference reviews before they can accept a booking.",
  },
  {
    question: "What if I'm not satisfied with the completed work?",
    answer:
      "We stand behind every job with our Quality Guarantee. Report the issue within 24 hours via the app or our hotline and we'll either dispatch a replacement expert or issue a full refund — your choice.",
  },
  {
    question: "Can I reschedule or cancel a confirmed booking?",
    answer:
      "Absolutely. Cancel or reschedule any upcoming booking up to 2 hours before the service start time, directly from your dashboard or by calling our support line. No penalty for first-time changes.",
  },
  {
    question: "How do I become a Rajseba service partner?",
    answer:
      "Apply through the 'Become a Partner' page or email partners@rajseba.com with your trade certificate and NID. Our vendor operations team will schedule an onboarding call within 2 business days.",
  },
  {
    question: "Is my payment information safe on the platform?",
    answer:
      "All transactions are processed through PCI-DSS compliant payment gateways. We never store raw card numbers — every payment is tokenized and encrypted end-to-end.",
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

/* ─── Reusable animation variants ───────────────────────────── */
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut", delay },
  }),
};

const slideLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const slideRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
};

/* ─── Helper: section reveal wrapper ────────────────────────── */
function RevealSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Component ─────────────────────────────────────────────── */
export default function ContactPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  /* Parallax for hero glows */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  /* Validation */
  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email";
    if (!form.subject.trim()) next.subject = "Please select a subject";
    if (!form.message.trim()) next.message = "Message cannot be empty";
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
    setLoading(true);
    /* TODO: replace with real API call */
    await new Promise((res) => setTimeout(res, 1200));
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => setForm(INITIAL_FORM), 400);
  };

  const inputBase =
    "w-full text-sm px-4 py-3 rounded-xl border bg-white text-slate-800 outline-none transition-all placeholder:text-slate-300";
  const inputNormal = `${inputBase} border-slate-200 focus:border-[#FF5A5F] focus:ring-2 focus:ring-[#FF5A5F]/10`;
  const inputError = `${inputBase} border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-400/10 bg-rose-50/40`;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative bg-white border-b border-slate-100 py-14 md:py-20 overflow-hidden"
      >
        {/* Parallax ambient glows */}
        <motion.div
          style={{ y: glowY }}
          className="pointer-events-none absolute -top-24 right-0 w-[520px] h-[520px] bg-[#FF5A5F]/7 blur-[130px] rounded-full"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 30]) }}
          className="pointer-events-none absolute bottom-0 left-1/4 w-[320px] h-[320px] bg-[#FF5A5F]/4 blur-[100px] rounded-full"
        />

        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-5"
          >
            {/* Badge */}
            <motion.span
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0 }}
              className="inline-block text-xs font-black text-[#FF5A5F] uppercase tracking-widest bg-[#FFF0F1] px-4 py-1.5 rounded-full border border-rose-100/60"
            >
              Support Center
            </motion.span>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
              className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight"
            >
              We&apos;re here whenever{" "}
              <motion.span
                className="text-[#FF5A5F] inline-block"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.45, ease: "easeOut" }}
              >
                you need us
              </motion.span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
              className="text-sm md:text-base text-slate-500 leading-relaxed max-w-xl mx-auto"
            >
              Reach our team for booking support, service complaints, partnership
              requests, or any urgent household emergency — we respond fast.
            </motion.p>

            {/* Trust micro-bar */}
            <motion.div
              variants={staggerFast}
              className="flex flex-wrap justify-center gap-5 pt-2"
            >
              {TRUST_BARS.map(({ icon: Icon, text }, i) => (
                <motion.span
                  key={text}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.18 + i * 0.06 }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500"
                >
                  <Icon className="w-3.5 h-3.5 text-[#FF5A5F]" />
                  {text}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ CHANNEL CARDS ════════════════════════════════════════ */}
      <section className="bg-white py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <RevealSection>
            <div className="grid md:grid-cols-3 gap-5">
              {CONTACT_CHANNELS.map(({ icon: Icon, label, primary, href, secondary, badge }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
                  viewport={{ once: true, margin: "-60px" }}
                  whileHover={{ y: -5, boxShadow: "0 12px 32px rgba(255,90,95,0.10)" }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-white border border-slate-100 rounded-3xl p-6 flex items-start gap-4 hover:border-[#FF5A5F]/25 transition-colors duration-300"
                >
                  <motion.span
                    className="p-3.5 rounded-2xl bg-[#FFF0F1] text-[#FF5A5F] flex-shrink-0"
                    whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wide">
                        {label}
                      </h3>
                      <span className="text-[10px] font-bold text-[#FF5A5F] bg-[#FFF0F1] px-2 py-0.5 rounded-full whitespace-nowrap">
                        {badge}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-[#FF5A5F] transition-colors truncate">
                      {primary}
                    </p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{secondary}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ══ FORM + SIDEBAR ═══════════════════════════════════════ */}
      <section className="bg-white py-4 md:py-8 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">

            {/* FORM — 7 cols */}
            <RevealSection className="lg:col-span-7">
              <motion.div

                className="bg-white border border-slate-100 rounded-[32px] p-7 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.02)]"
              >
                <div className="mb-7">
                  <h2 className="text-lg md:text-xl font-extrabold text-slate-900">Send a message</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Our team replies within 4 hours on business days.
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSubmit}
                      noValidate
                      className="space-y-5"
                    >
                      {/* Row 1 */}
                      <div className="grid md:grid-cols-2 gap-5">
                        {[
                          { id: "name", label: "Full Name", type: "text", autoComplete: "name", placeholder: "e.g. Mahbubur Rahman", required: true },
                          { id: "email", label: "Email Address", type: "email", autoComplete: "email", placeholder: "your@email.com", required: true },
                        ].map(({ id, label, type, autoComplete, placeholder, required }, i) => (
                          <div key={id} className="space-y-1.5">
                            <label htmlFor={id} className="text-xs font-extrabold text-slate-600 uppercase tracking-wide">
                              {label} {required && <span className="text-[#FF5A5F]">*</span>}
                            </label>
                            <motion.input
                              id={id}
                              name={id}
                              type={type}
                              autoComplete={autoComplete}
                              placeholder={placeholder}
                              value={form[id as keyof FormState]}
                              onChange={handleChange}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.06 }}
                              whileFocus={{ scale: 1.005, boxShadow: "0 0 0 3px rgba(255,90,95,0.10)" }}
                              className={errors[id as keyof FormState] ? inputError : inputNormal}
                            />
                            <AnimatePresence>
                              {errors[id as keyof FormState] && (
                                <motion.p
                                  initial={{ opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -4 }}
                                  className="text-xs text-rose-500 font-medium"
                                >
                                  {errors[id as keyof FormState]}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>

                      {/* Row 2 */}
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label htmlFor="phone" className="text-xs font-extrabold text-slate-600 uppercase tracking-wide">
                            Phone <span className="text-slate-300 font-medium normal-case tracking-normal">(optional)</span>
                          </label>
                          <motion.input
                            id="phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            placeholder="+880 1XXX-XXXXXX"
                            value={form.phone}
                            onChange={handleChange}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0 }}
                            whileFocus={{ scale: 1.005, boxShadow: "0 0 0 3px rgba(255,90,95,0.10)" }}
                            className={inputNormal}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="subject" className="text-xs font-extrabold text-slate-600 uppercase tracking-wide">
                            Subject <span className="text-[#FF5A5F]">*</span>
                          </label>
                          <motion.select
                            id="subject"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.07 }}
                            className={`${errors.subject ? inputError : inputNormal} appearance-none`}
                          >
                            <option value="" disabled>Select a topic…</option>
                            <option value="Booking Issue">Booking Issue</option>
                            <option value="Service Quality Complaint">Service Quality Complaint</option>
                            <option value="Refund Request">Refund Request</option>
                            <option value="Become a Partner">Become a Partner</option>
                            <option value="Media / Press">Media / Press</option>
                            <option value="Other">Other</option>
                          </motion.select>
                          <AnimatePresence>
                            {errors.subject && (
                              <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                className="text-xs text-rose-500 font-medium"
                              >
                                {errors.subject}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="space-y-1.5">
                        <label htmlFor="message" className="text-xs font-extrabold text-slate-600 uppercase tracking-wide">
                          Your Message <span className="text-[#FF5A5F]">*</span>
                        </label>
                        <motion.textarea
                          id="message"
                          name="message"
                          rows={5}
                          placeholder="Describe your issue or request in detail — the more context, the faster we can help."
                          value={form.message}
                          onChange={handleChange}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                          whileFocus={{ scale: 1.005, boxShadow: "0 0 0 3px rgba(255,90,95,0.10)" }}
                          className={`${errors.message ? inputError : inputNormal} resize-none`}
                        />
                        <AnimatePresence>
                          {errors.message && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="text-xs text-rose-500 font-medium"
                            >
                              {errors.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Submit */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.14 }}
                        whileTap={{ scale: 0.985 }}
                      >
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-[#FF5A5F] hover:bg-[#e84e53] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-extrabold py-3.5 h-auto rounded-xl border-none transition-colors shadow-md hover:shadow-[0_8px_24px_rgba(255,90,95,0.35)] flex items-center justify-center gap-2"
                        >
                          <AnimatePresence mode="wait">
                            {loading ? (
                              <motion.span
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                              >
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                                Sending…
                              </motion.span>
                            ) : (
                              <motion.span
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                              >
                                <Send className="w-4 h-4" />
                                Send Message
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </Button>
                      </motion.div>

                      <p className="text-center text-[11px] text-slate-400">
                        By submitting, you agree to our{" "}
                        <a href="/privacy" className="underline hover:text-[#FF5A5F]">
                          Privacy Policy
                        </a>.
                      </p>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 120, damping: 14 }}
                      className="text-center space-y-5 py-12"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                        className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm"
                      >
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="space-y-1.5"
                      >
                        <h3 className="text-lg font-extrabold text-slate-900">Message sent!</h3>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto">
                          We&apos;ve received your enquiry and will reply to{" "}
                          <span className="font-semibold text-slate-700">
                            {form.email || "your email"}
                          </span>{" "}
                          within 4 hours.
                        </p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Button
                          onClick={() => setSubmitted(false)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold px-6 py-3 h-auto rounded-xl border-none transition-all active:scale-95 cursor-pointer"
                        >
                          Send another message
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </RevealSection>

            {/* SIDEBAR — 5 cols */}
            <RevealSection className="lg:col-span-5">
              <motion.div className="flex flex-col gap-5">

                {/* Office photo */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-60px" }}
                  whileHover={{ scale: 1.015 }}
                  className="relative rounded-[28px] overflow-hidden min-h-[260px] border border-slate-100 shadow-sm flex flex-col justify-end"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"
                    alt="Rajseba Banani headquarters"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/20 to-transparent" />
                  <div className="relative z-10 p-6 space-y-1">
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="inline-block text-[10px] font-black tracking-widest text-[#FF5A5F] bg-white/90 px-2.5 py-1 rounded-full uppercase mb-1"
                    >
                      Headquarters
                    </motion.span>
                    <h3 className="text-white font-extrabold text-base leading-snug">
                      Come meet the team in Banani
                    </h3>
                    <p className="text-slate-300 text-xs font-medium">
                      Level 4, House 24, Road 12, Banani, Dhaka — Sat to Thu, 9 AM – 6 PM
                    </p>
                  </div>
                </motion.div>

                {/* Office hours */}
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FF5A5F]" />
                    <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                      Office Hours
                    </h4>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    {[
                      ["Saturday – Thursday", "9:00 AM – 6:00 PM"],
                      ["Friday (on-call only)", "10:00 AM – 2:00 PM"],
                      ["Public Holidays", "Emergency line only"],
                    ].map(([day, time], i) => (
                      <motion.li
                        key={day}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.45 + i * 0.07 }}
                        className="flex justify-between"
                      >
                        <span className="font-medium text-slate-500">{day}</span>
                        <span className="font-extrabold text-slate-800">{time}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Social */}
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                  viewport={{ once: true, margin: "-60px" }}
                  className="bg-[#FFF0F1] border border-rose-100 rounded-3xl p-6 space-y-4"
                >
                  <h4 className="font-extrabold text-slate-900 text-sm">Follow Rajseba</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Stay updated with service launches, seasonal offers, and home-care tips.
                  </p>
                  <div className="flex gap-3">
                    {SOCIAL_LINKS.map(({ icon: Icon, href, label }, i) => (
                      <motion.a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.07 }}
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-9 h-9 rounded-full bg-white border border-rose-100 text-[#FF5A5F] flex items-center justify-center hover:bg-[#FF5A5F] hover:text-white hover:border-[#FF5A5F] transition-colors duration-200 shadow-xs"
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>

              </motion.div>
            </RevealSection>

          </div>
        </div>
      </section>

      {/* ══ FAQ ══════════════════════════════════════════════════ */}
      <section className="bg-slate-50/60 border-t border-slate-100 py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 md:px-6">

          <RevealSection>
            <div className="text-center mb-10">
              <motion.span
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#FF5A5F] uppercase tracking-widest mb-3"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                FAQ
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.07 }}
                viewport={{ once: true, margin: "-60px" }}
                className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight"
              >
                Answers to common questions
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.14 }}
                viewport={{ once: true, margin: "-60px" }}
                className="text-sm text-slate-400 mt-2"
              >
                Can&apos;t find what you&apos;re looking for?{" "}
                <a href="mailto:support@rajseba.com" className="text-[#FF5A5F] font-semibold hover:underline">
                  Email us directly.
                </a>
              </motion.p>
            </div>
          </RevealSection>

          <RevealSection>
            <div className="space-y-3">
              {FAQS.map((faq, i) => {
                const isOpen = activeFaq === i;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.05 }}
                    viewport={{ once: true, margin: "-60px" }}
                    layout
                    className="bg-white border rounded-2xl overflow-hidden transition-colors duration-200"
                    style={{ borderColor: isOpen ? "rgba(255,90,95,0.2)" : "rgb(241 245 249)" }}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between px-5 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A5F]/40 rounded-2xl"
                    >
                      <span
                        className={`text-sm font-bold pr-4 transition-colors duration-200 ${isOpen ? "text-[#FF5A5F]" : "text-slate-800"
                          }`}
                      >
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <ChevronDown
                          className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${isOpen ? "text-[#FF5A5F]" : "text-slate-400"
                            }`}
                        />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-xs md:text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-3">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </RevealSection>

        </div>
      </section>

      {/* ══ CTA STRIP ════════════════════════════════════════════ */}
      <RevealSection>
        <motion.section

          className="bg-[#FF5A5F] py-12 md:py-16 relative overflow-hidden"
        >
          {/* Decorative circle */}
          <motion.div
            className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-white/5"
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />

          <div className="max-w-4xl mx-auto px-4 md:px-6 text-center space-y-5 relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true, margin: "-60px" }}
              className="text-xl md:text-2xl font-extrabold text-white tracking-tight"
            >
              Ready to book a trusted home service?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
              viewport={{ once: true, margin: "-60px" }}
              className="text-sm text-rose-100 max-w-md mx-auto leading-relaxed"
            >
              Browse 20+ service categories and get matched with a verified professional in minutes.
            </motion.p>
            <div className="flex flex-wrap gap-3 justify-center">
              <motion.a
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.16 }}
                viewport={{ once: true, margin: "-60px" }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                href="/services"
                className="inline-flex items-center gap-2 bg-white text-[#FF5A5F] text-xs font-extrabold px-6 py-3.5 rounded-xl hover:bg-rose-50 transition-colors shadow-sm"
              >
                Explore Services
              </motion.a>
              <motion.a
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.22 }}
                viewport={{ once: true, margin: "-60px" }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                href="tel:+8809612725732"
                className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white text-xs font-extrabold px-6 py-3.5 rounded-xl hover:bg-white/25 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Now
              </motion.a>
            </div>
          </div>
        </motion.section>
      </RevealSection>

    </div>
  );
}