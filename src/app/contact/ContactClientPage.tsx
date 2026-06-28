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
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
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
  const [loading, setLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 50]);

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
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => setForm(INITIAL_FORM), 300);
  };

  const inputBase =
    "w-full text-xs px-4 py-3 rounded-xl border bg-white text-slate-800 outline-none transition-all placeholder:text-slate-400 font-semibold";
  const inputNormal = `${inputBase} border-slate-200 focus:border-[#FF6014] focus:ring-2 focus:ring-[#FF6014]/10`;
  const inputError = `${inputBase} border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-300/10 bg-rose-50/40`;

  return (
    <div className="min-h-screen bg-slate-50/20 overflow-x-hidden text-slate-800">
      {/* ══ HERO SECTION ══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative bg-white border-b border-slate-100 py-8 md:py-12 overflow-hidden"
      >
        <motion.div
          style={{ y: glowY }}
          className="pointer-events-none absolute -top-24 right-0 w-[450px] h-[450px] bg-[#FF6014]/6 blur-[110px] rounded-full"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 20]) }}
          className="pointer-events-none absolute bottom-0 left-1/4 w-[280px] h-[280px] bg-blue-500/3 blur-[90px] rounded-full"
        />

        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center relative z-10 space-y-4">
          <span className="inline-block text-[10px] font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100/50">
            Support Center
          </span>

          <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 tracking-tight leading-tight">
            How Can We{" "}
            <span className="text-[#FF6014] relative inline-block">
              Help You Today?
              <span className="absolute bottom-1 left-0 w-full h-1 bg-[#FF6014]/15 rounded-full" />
            </span>
          </h1>

          <p className="text-xs md:text-sm text-slate-500 font-semibold max-w-xl mx-auto leading-relaxed">
            Reach out to our customer support desk regarding service bookings, partner inquiries, billing clarifications, or warranty claims.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            {TRUST_BARS.map(({ icon: Icon, text }, i) => (
              <span
                key={text}
                className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider"
              >
                <Icon className="w-3.5 h-3.5 text-blue-500" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CHANNEL CARDS SECTION ════════════════════════════════ */}
      <section className="py-6 md:py-8 bg-white border-b border-slate-100/80">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <RevealSection>
            <div className="grid md:grid-cols-3 gap-4">
              {CONTACT_CHANNELS.map(({ icon: Icon, label, primary, href, secondary, badge }, i) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group bg-white border border-slate-100 rounded-2xl p-5 flex items-start gap-4 hover:border-blue-500/20 hover:shadow-md transition-all duration-300"
                >
                  <span className="p-3 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-[10px] uppercase tracking-wide">
                        {label}
                      </h3>
                      <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {badge}
                      </span>
                    </div>
                    <p className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                      {primary}
                    </p>
                    <p className="text-[11px] text-slate-400 font-semibold">{secondary}</p>
                  </div>
                </a>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ══ FORM + DETAILS ROW ═══════════════════════════════════ */}
      <section className="py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            
            {/* Contact Form Card */}
            <RevealSection className="lg:col-span-7">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs">
                <div className="mb-6">
                  <h2 className="text-base md:text-lg font-black text-slate-900">Send an Inquiry</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    Please fill out the form below. We typically respond within 4 hours.
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                      {/* Name & Email */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="name" className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                            Full Name <span className="text-[#FF6014]">*</span>
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="e.g. Mahbubur Rahman"
                            value={form.name}
                            onChange={handleChange}
                            className={errors.name ? inputError : inputNormal}
                          />
                          {errors.name && (
                            <p className="text-[10px] text-rose-500 font-bold">{errors.name}</p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="email" className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                            Email Address <span className="text-[#FF6014]">*</span>
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
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
                          <label htmlFor="phone" className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                            Phone Number <span className="text-slate-350 font-medium normal-case tracking-normal">(optional)</span>
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+880 17XXXXXXXX"
                            value={form.phone}
                            onChange={handleChange}
                            className={inputNormal}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="subject" className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                            Subject Topic <span className="text-[#FF6014]">*</span>
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            className={errors.subject ? inputError : inputNormal}
                          >
                            <option value="" disabled>Select inquiry type...</option>
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

                      {/* Message Box */}
                      <div className="space-y-1.5">
                        <label htmlFor="message" className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                          Details & Context <span className="text-[#FF6014]">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          placeholder="Please provide details about your issue or required service slot..."
                          value={form.message}
                          onChange={handleChange}
                          className={`${errors.message ? inputError : inputNormal} resize-none`}
                        />
                        {errors.message && (
                          <p className="text-[10px] text-rose-500 font-bold">{errors.message}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#FF6014] hover:bg-[#e84e53] disabled:opacity-60 text-white text-xs font-extrabold py-3.5 h-auto rounded-xl border-none transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        {loading ? "Sending Enquiry..." : "Submit Inquiry"}
                        <Send className="w-3.5 h-3.5" />
                      </Button>
                    </form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-4 py-8"
                    >
                      <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-black text-slate-900">Enquiry Submitted!</h3>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                          We have received your message and will email a response back within 4 hours.
                        </p>
                      </div>
                      <Button
                        onClick={() => setSubmitted(false)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-extrabold px-5 py-2.5 h-auto rounded-lg border-none"
                      >
                        Send another message
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </RevealSection>

            {/* Sidebar Columns */}
            <RevealSection className="lg:col-span-5 flex flex-col gap-4">
              {/* HQ Office Photo */}
              <div className="relative rounded-2xl overflow-hidden min-h-[220px] border border-slate-100 shadow-xs flex flex-col justify-end">
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"
                  alt="Rajseba HQ Banani"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />
                <div className="relative z-10 p-5 space-y-1 text-white">
                  <span className="inline-block text-[9px] font-black tracking-widest text-[#FF6014] bg-white/95 px-2 py-0.5 rounded-full uppercase">
                    Headquarters
                  </span>
                  <h3 className="font-extrabold text-sm">Banani Operations Center</h3>
                  <p className="text-slate-300 text-[10px] font-medium">
                    Level 4, House 24, Road 12, Banani, Dhaka-1213
                  </p>
                </div>
              </div>

              {/* Office Hours Card */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FF6014]" />
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                    Office Hours
                  </h4>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  {[
                    ["Saturday – Thursday", "9:00 AM – 6:00 PM"],
                    ["Friday Hotline Support", "10:00 AM – 2:00 PM"],
                    ["Urgent Appliance Repairs", "24/7 Dispatch Availability"],
                  ].map(([day, time], idx) => (
                    <li key={idx} className="flex justify-between border-b border-slate-50 pb-1.5 last:border-0 last:pb-0">
                      <span className="font-semibold text-slate-500">{day}</span>
                      <span className="font-extrabold text-slate-800">{time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Channels */}
              <div className="bg-[#FFF8F4] border border-rose-100 rounded-2xl p-5 space-y-3">
                <h4 className="font-black text-slate-900 text-xs">Join Our Community</h4>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  Get updates about discount offers, appliance safety codes, and local technician audits.
                </p>
                <div className="flex gap-2">
                  {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-white border border-rose-100 text-[#FF6014] flex items-center justify-center hover:bg-[#FF6014] hover:text-white transition-colors duration-200"
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

      {/* ══ FAQ SECTION ══════════════════════════════════════════ */}
      <section className="bg-white border-t border-slate-100/80 py-8 md:py-10">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <RevealSection className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100/50 mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              General Help
            </span>
            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
              Inquiries FAQ
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Need immediate answers? Read our most common service desk responses.
            </p>
          </RevealSection>

          <RevealSection>
            <div className="space-y-2">
              {FAQS.map((faq, i) => {
                const isOpen = activeFaq === i;
                return (
                  <div
                    key={i}
                    className="bg-white border border-slate-100 rounded-xl overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left outline-none font-bold text-slate-800 text-xs md:text-sm"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                          isOpen ? "rotate-180 text-[#FF6014]" : ""
                        }`}
                      />
                    </button>
                    
                    {isOpen && (
                      <div className="px-4 pb-4 pt-0 text-xs text-slate-500 font-semibold leading-relaxed border-t border-slate-50 pt-2.5">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ══ CTA STRIP SECTION ════════════════════════════════════ */}
      <RevealSection>
        <section className="bg-[#FF6014] py-8 md:py-10 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 md:px-6 text-center space-y-4 relative z-10">
            <h2 className="text-lg md:text-xl font-black text-white tracking-tight">
              Ready to Book an Expert Technician?
            </h2>
            <p className="text-xs text-rose-100 max-w-md mx-auto font-medium">
              Explore rates, choose a calendar slot, and get matched with background-verified professionals in Dhaka.
            </p>
            <div className="flex flex-wrap gap-2.5 justify-center">
              <a
                href="/services"
                className="inline-flex items-center gap-2 bg-white text-[#FF6014] text-[10px] font-extrabold px-5 py-3 rounded-xl hover:bg-rose-50 transition-colors shadow-sm"
              >
                Explore Services
              </a>
              <a
                href="tel:+8809612725732"
                className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-[10px] font-extrabold px-5 py-3 rounded-xl hover:bg-white/20 transition-colors"
              >
                <Phone className="w-3 h-3" />
                Call Hotline
              </a>
            </div>
          </div>
        </section>
      </RevealSection>
    </div>
  );
}
