"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone, Shield, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Clean Data Architecture - Dynamic Page Copy
const REGISTER_CONTENT = {
  badge: "JOIN RAJSEBA",
  heroTitle: "Expert care for your",
  heroAccent: "premium home.",
  heroDesc: "Experience the pinnacle of hospitality and safety with our curated selection of professional home services in Bangladesh.",
  benefits: [
    {
      title: "Verified Professionals",
      description: "Every provider is strictly vetted for your safety.",
      icon: Shield,
    },
    {
      title: "Effortless Booking",
      description: "Schedule and track services in just a few taps.",
      icon: Clock,
    }
  ],
  formTitle: "Create Account",
  formSubtitle: "Welcome! Let's get your profile set up.",
  fields: {
    nameLabel: "Full Name",
    namePlaceholder: "John Doe",
    emailLabel: "Email Address",
    emailPlaceholder: "john@example.com",
    phoneLabel: "Phone Number",
    phonePlaceholder: "+880 1XXX XXXXXX",
    passLabel: "Password",
    passPlaceholder: "••••••••",
  },
  submitText: "Create Account",
  termsText: "By signing up, you agree to our ",
  termsLink: "Terms of Service",
  privacyLink: "Privacy Policy",
  alreadyHaveText: "Already have an account? ",
  loginLink: "Login"
};

// Entrance Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 85,
      damping: 14,
    }
  }
} as const;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register Submit:", formData);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAF8F8] flex items-center justify-center py-12 px-4 md:px-6 overflow-hidden">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl w-full grid md:grid-cols-2 gap-12 lg:gap-16 items-center"
      >
        
        {/* Left Side - Hero Section (Hidden on Mobile, flex on Desktop) */}
        <div className="hidden md:flex flex-col justify-center space-y-8 pl-4 lg:pl-8">
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 bg-[#FF5A5F] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-6">
              {REGISTER_CONTENT.badge}
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
              {REGISTER_CONTENT.heroTitle}{" "}
              <span className="text-[#FF5A5F] block lg:inline">{REGISTER_CONTENT.heroAccent}</span>
            </h1>
            <p className="mt-4 text-base lg:text-lg text-slate-600 max-w-md leading-relaxed">
              {REGISTER_CONTENT.heroDesc}
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <div className="space-y-6">
            {REGISTER_CONTENT.benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  className="flex gap-4 items-start"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 text-[#FF5A5F] shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">
                      {benefit.title}
                    </h4>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Styled Bottom Gradient Illustration Block */}
          <motion.div 
            variants={itemVariants}
            className="mt-4 rounded-3xl overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.03)] h-44 bg-gradient-to-r from-slate-200 to-slate-400/80 opacity-90 relative"
          >
            {/* Background design accents */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.5px]" />
          </motion.div>
        </div>

        {/* Right Side - Register Form Card */}
        <motion.div 
          variants={itemVariants}
          className="w-full max-w-lg mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-slate-100 p-8 md:p-12 relative overflow-hidden">
            
            {/* Header copy */}
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {REGISTER_CONTENT.formTitle}
              </h2>
              <p className="text-slate-500 mt-2 text-sm">
                {REGISTER_CONTENT.formSubtitle}
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-bold text-slate-700">
                  {REGISTER_CONTENT.fields.nameLabel}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={REGISTER_CONTENT.fields.namePlaceholder}
                    className="w-full pl-11 pr-4 py-3 bg-[#F9F9FB] border border-slate-200/50 rounded-xl text-sm placeholder-slate-400 text-slate-800 outline-none focus:bg-white focus:border-[#FF5A5F] focus:ring-2 focus:ring-red-100 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-bold text-slate-700">
                  {REGISTER_CONTENT.fields.emailLabel}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={REGISTER_CONTENT.fields.emailPlaceholder}
                    className="w-full pl-11 pr-4 py-3 bg-[#F9F9FB] border border-slate-200/50 rounded-xl text-sm placeholder-slate-400 text-slate-800 outline-none focus:bg-white focus:border-[#FF5A5F] focus:ring-2 focus:ring-red-100 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-bold text-slate-700">
                  {REGISTER_CONTENT.fields.phoneLabel}
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={REGISTER_CONTENT.fields.phonePlaceholder}
                    className="w-full pl-11 pr-4 py-3 bg-[#F9F9FB] border border-slate-200/50 rounded-xl text-sm placeholder-slate-400 text-slate-800 outline-none focus:bg-white focus:border-[#FF5A5F] focus:ring-2 focus:ring-red-100 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-bold text-slate-700">
                  {REGISTER_CONTENT.fields.passLabel}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={REGISTER_CONTENT.fields.passPlaceholder}
                    className="w-full pl-11 pr-12 py-3 bg-[#F9F9FB] border border-slate-200/50 rounded-xl text-sm placeholder-slate-400 text-slate-800 outline-none focus:bg-white focus:border-[#FF5A5F] focus:ring-2 focus:ring-red-100 transition-all duration-300"
                    required
                  />
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-2 h-auto hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Create Account Action Button */}
              <Button
                type="submit"
                className="w-full bg-[#FF5A5F] hover:bg-[#FF4449] text-white font-bold py-4 h-auto rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.985] text-base mt-6 cursor-pointer"
              >
                {REGISTER_CONTENT.submitText}
                <ArrowRight className="w-4.5 h-4.5" />
              </Button>
            </form>

            {/* Terms and Signin Links */}
            <div className="mt-8 text-center text-xs md:text-sm">
              <p className="text-slate-500 leading-relaxed">
                {REGISTER_CONTENT.termsText}
                <Link href="#" className="text-[#FF5A5F] font-bold hover:underline">
                  {REGISTER_CONTENT.termsLink}
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-[#FF5A5F] font-bold hover:underline">
                  {REGISTER_CONTENT.privacyLink}
                </Link>
                .
              </p>
              <p className="mt-4 text-slate-500 font-semibold">
                {REGISTER_CONTENT.alreadyHaveText}
                <Link
                  href="/login"
                  className="text-[#FF5A5F] font-extrabold hover:underline"
                >
                  {REGISTER_CONTENT.loginLink}
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
        
      </motion.div>
    </div>
  );
}
