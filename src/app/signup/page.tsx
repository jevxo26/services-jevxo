"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, Phone, Briefcase, Check, ShieldCheck, PenTool } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(59)
  
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([])

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  })

  // Timer countdown hook for OTP resend limit
  useEffect(() => {
    if (!isOtpSent) return
    if (timeLeft === 0) return
    
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isOtpSent, timeLeft])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreeTerms) {
      alert("Please agree to the Terms of Use and Privacy Policy.")
      return
    }
    // Transition to OTP screen
    setIsOtpSent(true)
    setTimeLeft(59)
    setOtp(["", "", "", "", "", ""])
  }

  const handleOtpChange = (val: string, index: number) => {
    if (isNaN(Number(val))) return
    
    const nextOtp = [...otp]
    nextOtp[index] = val.slice(-1) // grab last input character
    setOtp(nextOtp)

    // Move to next input field
    if (val !== "" && index < 5) {
      otpInputsRef.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (key: string, index: number) => {
    if (key === "Backspace" && otp[index] === "" && index > 0) {
      otpInputsRef.current[index - 1]?.focus()
    }
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    const enteredOtp = otp.join("")
    if (enteredOtp.length < 6) {
      alert("Please enter a valid 6-digit OTP code.")
      return
    }
    
    // Developer API connection point:
    // ==========================================
    // const response = await fetch('/api/verify', { method: 'POST', body: JSON.stringify({ phone: formData.phone, code: enteredOtp }) });
    // ==========================================

    console.log("OTP Verified successfully:", enteredOtp)
    router.push("/dashbord/overview")
  }

  const handleResendOtp = () => {
    setTimeLeft(59)
    setOtp(["", "", "", "", "", ""])
    alert("Verification code has been resent to " + formData.phone)
  }

  return (
    <div className="min-h-screen w-full overflow-hidden bg-white">
      
      {!isOtpSent ? (
        /* Step 1: Split-screen Signup Form */
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left Column: Form */}
          <div className="flex flex-col justify-between p-6 sm:p-12 min-h-screen relative overflow-hidden">
            
            {/* Background Watermark Pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.14]"
              style={{
                backgroundImage: "url('/Group1.png'), url('/Group2.png')",
                backgroundPosition: "top left, bottom right",
                backgroundRepeat: "repeat, repeat",
                backgroundSize: "750px"
              }}
            />

            {/* Brand Header */}
            <div className="relative z-10">
              <Link href="/" className="inline-block">
                <span className="font-black text-[#FF464C] text-3xl tracking-tight">Rajseba</span>
              </Link>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Create your account to access premium home services instantly.
              </p>
            </div>

            {/* Form */}
            <div className="w-full max-w-[420px] mx-auto py-10 relative z-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 focus:bg-white focus:border-rose-350 focus:ring-4 focus:ring-rose-500/5 outline-none transition-all text-xs font-bold text-slate-800"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 focus:bg-white focus:border-rose-350 focus:ring-4 focus:ring-rose-500/5 outline-none transition-all text-xs font-bold text-slate-800"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+880 1712-XXXXXX"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 focus:bg-white focus:border-rose-350 focus:ring-4 focus:ring-rose-500/5 outline-none transition-all text-xs font-bold text-slate-800"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 focus:bg-white focus:border-rose-350 focus:ring-4 focus:ring-rose-500/5 outline-none transition-all text-xs font-bold text-slate-800"
                      required
                    />
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-2 h-auto hover:bg-transparent"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setAgreeTerms(!agreeTerms)}
                    className={`w-5 h-5 p-0 min-w-0 rounded border flex items-center justify-center transition-all focus:outline-none hover:bg-transparent ${
                      agreeTerms
                        ? "bg-[#FF5B60] border-[#FF5B60] text-white hover:bg-[#FF5B60] hover:text-white"
                        : "border-slate-250 bg-slate-50/60 hover:bg-slate-50/60"
                    }`}
                  >
                    {agreeTerms && <Check size={12} className="stroke-[3]" />}
                  </Button>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    I agree to the{" "}
                    <Link href="#" className="text-[#FF5B60] hover:underline font-bold">
                      Terms of Use
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-[#FF5B60] hover:underline font-bold">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-[#FF5B60] hover:bg-[#FF464C] text-white text-xs font-extrabold py-3.5 h-auto rounded-2xl shadow-sm shadow-rose-500/10 active:scale-[0.99] transition-all focus:outline-none mt-2"
                >
                  Create Account
                </Button>
              </form>

              {/* Social Login */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-[1px] bg-slate-100 flex-1" />
                  <span className="text-[9px] text-slate-400 font-extrabold tracking-widest uppercase">Or Sign Up With</span>
                  <div className="h-[1px] bg-slate-100 flex-1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="flex items-center justify-center gap-2 py-3 px-4 h-auto rounded-2xl border border-slate-100 hover:bg-slate-50 hover:text-slate-700 transition-colors text-[10px] font-black text-slate-700 focus:outline-none active:scale-[0.98]">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                      alt="google"
                      className="w-4 h-4"
                    />
                    GOOGLE
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center gap-2 py-3 px-4 h-auto rounded-2xl border border-slate-100 hover:bg-slate-50 hover:text-slate-700 transition-colors text-[10px] font-black text-slate-700 focus:outline-none active:scale-[0.98]">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                      alt="apple"
                      className="w-4 h-4"
                    />
                    APPLE
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer Login Info */}
            <div className="text-center text-xs text-slate-500 font-semibold relative z-10 pt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-[#FF5B60] hover:underline font-extrabold ml-1">
                Login
              </Link>
            </div>

          </div>

          {/* Right Column: Hero Cover (Desktop Only) */}
          <div className="hidden lg:block w-full h-full relative overflow-hidden bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&auto=format&fit=crop&q=80"
              alt="Home clean interior"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/20" />

            {/* Trust Floating Card */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-[460px] px-6">
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-[32px] border border-slate-100/40 shadow-xl space-y-6">
                
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 bg-[#FF5B60] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-500/10">
                    <Briefcase size={22} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-lg">Your Trusted Home Partner</h4>
                    <p className="text-xs text-slate-500 font-bold mt-0.5">Professional services at your doorstep.</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
                  <div>
                    <span className="text-2xl font-black text-[#FF5B60] block">50k+</span>
                    <span className="text-[9px] text-slate-450 font-black uppercase tracking-widest mt-1.5 block">Active Users</span>
                  </div>
                  <div className="border-x border-rose-100">
                    <span className="text-2xl font-black text-[#FF5B60] block">4.9/5</span>
                    <span className="text-[9px] text-slate-450 font-black uppercase tracking-widest mt-1.5 block">Avg Rating</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-[#FF5B60] block">120+</span>
                    <span className="text-[9px] text-slate-450 font-black uppercase tracking-widest mt-1.5 block leading-normal">Expert Categories</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Step 2: Verification Screen (OTP Modal view matching mockup) */
        <div className="min-h-screen bg-slate-50/20 flex flex-col justify-center items-center p-4 relative overflow-hidden">
          
          {/* Background Watermark Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.14]"
            style={{
              backgroundImage: "url('/Group1.png'), url('/Group2.png')",
              backgroundPosition: "top left, bottom right",
              backgroundRepeat: "repeat, repeat",
              backgroundSize: "750px"
            }}
          />

          <div className="w-full max-w-[460px] bg-white/95 backdrop-blur-md p-8 sm:p-12 rounded-[40px] border border-slate-100 shadow-xl text-center space-y-7 relative z-10 animate-in zoom-in duration-300">
            <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center text-[#FF5B60] mx-auto">
              <ShieldCheck size={26} className="stroke-[2.5]" />
            </div>

            <div className="space-y-2.5">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Verify Your Number</h2>
              <p className="text-xs text-slate-450 font-semibold leading-relaxed px-4">
                We've sent a 6-digit code to <strong className="text-slate-800">{formData.phone || "+880 1712-XXXXXX"}</strong>
              </p>
            </div>

            {/* OTP Code Inputs Form */}
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-center gap-2.5">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => { otpInputsRef.current[idx] = el }}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e.key, idx)}
                    className="w-12 h-12 rounded-xl border border-slate-150 bg-slate-50/60 focus:bg-white text-center text-lg font-black focus:outline-none focus:border-rose-450 focus:ring-4 focus:ring-rose-500/5 outline-none transition-all text-slate-800"
                    required
                  />
                ))}
              </div>

              {/* Timer Countdown */}
              <div className="text-xs text-rose-500 font-extrabold tracking-wide">
                {timeLeft > 0 ? (
                  `Resend code in 00:${timeLeft < 10 ? "0" + timeLeft : timeLeft}`
                ) : (
                  <Button
                    variant="link"
                    type="button"
                    onClick={handleResendOtp}
                    className="text-[#FF5B60] hover:underline font-black focus:outline-none p-0 h-auto"
                  >
                    Resend Code
                  </Button>
                )}
              </div>

              {/* Verify & Proceed Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#FF5B60] hover:bg-[#FF464C] text-white text-xs font-black py-4 h-auto rounded-2xl shadow-sm shadow-rose-500/10 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 focus:outline-none"
              >
                VERIFY & PROCEED <span className="text-sm font-extrabold">→</span>
              </Button>
            </form>

            {/* Option to change phone number */}
            <Button
              variant="link"
              type="button"
              onClick={() => setIsOtpSent(false)}
              className="text-xs text-slate-500 hover:text-slate-850 hover:underline hover:no-underline font-bold flex items-center justify-center gap-1 mx-auto focus:outline-none p-0 h-auto"
            >
              Change Phone Number
            </Button>
          </div>

          <span className="text-[10px] text-slate-400 font-extrabold mt-6 block text-center relative z-10">
            🔒 Your connection is secure and encrypted
          </span>
        </div>
      )}

    </div>
  )
}
