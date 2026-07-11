"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Phone, Mail, MapPin, Clock, MessageSquare, Shield, Headphones,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export const CONTACT_CHANNELS = [
  { icon: Phone, label: "Call Support", primary: "01813-333373", href: "tel:01813333373", secondary: "Hotline: 01813-333373", badge: "24/7 Hotline" },
  { icon: Mail, label: "Email Support", primary: "info@rajseba.com", href: "mailto:info@rajseba.com", secondary: "Support: info@rajseba.com", badge: "Replies in 4 hrs" },
  { icon: MapPin, label: "Visit HQ", primary: "Rajshahi High-tech Park", href: "https://maps.google.com/?q=Rajshahi+High-tech+Park", secondary: "Rajshahi, Bangladesh", badge: "Sat – Thu (9AM-6PM)" },
];

export const TRUST_BARS = [
  { icon: Shield, text: "100% Encrypted Enquiry" },
  { icon: Headphones, text: "Dedicated Customer Manager" },
  { icon: MessageSquare, text: "Response Within 4 Hours" },
];

export const FAQS = [
  { question: "How do I schedule a home service on Rajseba?", answer: "Browse our service directory, pick the task required, and choose your preferred date/time slot using our calendar. A verified Rajseba professional will be matched to your booking instantly." },
  { question: "What verification procedures do professionals go through?", answer: "Every technician goes through a multi-tier vetting process, including biometric National ID verification, criminal background checks, and a practical skill examination at the Rajseba Academy." },
  { question: "What happens if there is accidental damage during service?", answer: "Your satisfaction and safety are our priorities. All Rajseba appointments are protected under our service insurance, covering accidental damages up to ৳10,000." },
  { question: "Can I cancel or change my booking slot?", answer: "Yes, you can reschedule or cancel any scheduled booking up to 2 hours before the service slot begins directly through your dashboard without any cancellation penalty fee." },
];

export const SOCIAL_LINKS = [
  { icon: FaFacebookF, href: "https://facebook.com/rajseba", label: "Facebook" },
  { icon: FaInstagram, href: "https://instagram.com/rajseba", label: "Instagram" },
  { icon: FaLinkedinIn, href: "https://linkedin.com/company/rajseba", label: "LinkedIn" },
];

export const OFFICE_HOURS = [
  ["Saturday – Thursday", "9:00 AM – 6:00 PM"],
  ["Friday Hotline Support", "10:00 AM – 2:00 PM"],
  ["Urgent Appliance Repairs", "24/7 Dispatch"]
];

export function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.5, ease: "easeOut", delay }} className={className}>
      {children}
    </motion.div>
  );
}
