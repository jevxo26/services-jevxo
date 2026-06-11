"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Star, CheckCircle, Briefcase } from "lucide-react";

// Clean Data Architecture - Dynamic Copy
const LOGIN_CONTENT = {
  title: "Welcome back",
  subtitle: "Access your premium home services dashboard.",
  labels: {
    email: "EMAIL ADDRESS",
    password: "PASSWORD",
    emailPlaceholder: "name@company.com",
    passwordPlaceholder: "••••••••",
  },
  rememberMe: "Remember me",
  forgotPass: "Forgot password?",
  submitText: "Login to Account",
  dividerText: "OR CONTINUE WITH",
  footerText: "Don't have an account? ",
  footerLink: "Sign up",
  testimonial: {
    title: "Effortless living, professionally managed.",
    text: '"Rajseba has completely transformed how I manage my home repairs. Fast, reliable, and always premium quality."',
    author: "Elena Rodriguez",
    role: "Premium Member since 2022",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 14
    }
  }
} as const;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login Submit:", { email, password, remember });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white grid md:grid-cols-2 overflow-hidden">
      
      {/* Left Column - Form Section (Full width on Mobile, 50% on Desktop) */}
      <div className="flex flex-col justify-between p-6 md:p-12 lg:p-16 max-w-lg mx-auto w-full h-full min-h-[500px]">

        {/* Content Box */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="my-auto py-8 space-y-8"
        >
          {/* Titles */}
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {LOGIN_CONTENT.title}
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              {LOGIN_CONTENT.subtitle}
            </p>
          </motion.div>

          {/* Form */}
          <motion.form onSubmit={handleSubmit} variants={itemVariants} className="space-y-5">
            {/* Email Address */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 tracking-wider">
                {LOGIN_CONTENT.labels.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={LOGIN_CONTENT.labels.emailPlaceholder}
                  className="w-full pl-11 pr-4 py-3 bg-[#F9F9FB] border border-slate-200/50 rounded-xl text-sm placeholder-slate-400 text-slate-800 outline-none focus:bg-white focus:border-[#FF5A5F] focus:ring-2 focus:ring-red-100 transition-all duration-300"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 tracking-wider">
                {LOGIN_CONTENT.labels.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={LOGIN_CONTENT.labels.passwordPlaceholder}
                  className="w-full pl-11 pr-12 py-3 bg-[#F9F9FB] border border-slate-200/50 rounded-xl text-sm placeholder-slate-400 text-slate-800 outline-none focus:bg-white focus:border-[#FF5A5F] focus:ring-2 focus:ring-red-100 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Pass link */}
            <div className="flex justify-between items-center text-xs md:text-sm pt-2">
              <label className="flex items-center gap-2 text-slate-600 font-semibold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 accent-[#FF5A5F] rounded border-slate-300 text-[#FF5A5F] focus:ring-[#FF5A5F]"
                />
                {LOGIN_CONTENT.rememberMe}
              </label>
              <Link href="#" className="text-[#FF5A5F] font-bold hover:underline">
                {LOGIN_CONTENT.forgotPass}
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#FF5A5F] hover:bg-[#FF4449] text-white font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.985] text-base cursor-pointer"
            >
              {LOGIN_CONTENT.submitText}
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </motion.form>

          {/* OR Divider */}
          <motion.div variants={itemVariants} className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative bg-white px-4 text-xs font-bold text-slate-400 tracking-wider">
              {LOGIN_CONTENT.dividerText}
            </span>
          </motion.div>

          {/* Social Logins */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 transition-colors font-bold text-sm text-slate-700 cursor-pointer">
              <svg className="h-4.5 w-4.5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 transition-colors font-bold text-sm text-slate-700 cursor-pointer">
              <svg className="h-4.5 w-4.5 flex-shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.5-.63.73-1.18 1.87-1.03 2.98 1.1.09 2.22-.53 2.96-1.42"/>
              </svg>
              Apple
            </button>
          </motion.div>

          {/* Footer Navigation */}
          <motion.div variants={itemVariants} className="text-center text-sm font-semibold text-slate-500">
            {LOGIN_CONTENT.footerText}
            <Link href="/register" className="text-[#FF5A5F] hover:underline font-extrabold ml-1">
              {LOGIN_CONTENT.footerLink}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Column - Branded Review Panel (Hidden on Mobile, flex on Desktop) */}
      <div className="hidden md:flex flex-col justify-center items-center p-12 bg-[#FAF8F8] relative overflow-hidden border-l border-slate-100/50 h-full">
        {/* Floating background blobs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose-400/5 blur-[80px] rounded-full pointer-events-none" />
        
        {/* Top-Right Decorative Floating Badge Buttons */}
        <div className="absolute top-8 right-8 flex gap-3">
          <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-[#FF5A5F] shadow-sm">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-[#FF5A5F] shadow-sm">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        {/* Floating Testimonial Review card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 80 }}
          className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_15px_45px_rgba(0,0,0,0.02)] max-w-sm border border-slate-100/60 relative z-10 space-y-6"
        >
          {/* Stars */}
          <div className="flex gap-1 text-amber-400">
            {[...Array(LOGIN_CONTENT.testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs font-bold text-slate-400 ml-2 pt-0.5">5.0 RATING</span>
          </div>

          {/* Title and review details */}
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-snug">
            {LOGIN_CONTENT.testimonial.title}
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed italic">
            {LOGIN_CONTENT.testimonial.text}
          </p>

          {/* Author avatar metadata block */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
            <div className="relative w-11 h-11 bg-slate-100 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
              <Image
                src={LOGIN_CONTENT.testimonial.avatar}
                alt={LOGIN_CONTENT.testimonial.author}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm md:text-base">
                {LOGIN_CONTENT.testimonial.author}
              </h4>
              <p className="text-xs text-slate-400 font-bold tracking-wide">
                {LOGIN_CONTENT.testimonial.role}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
    </div>
  );
}