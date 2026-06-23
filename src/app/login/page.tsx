"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  ArrowRight, Star, ShieldCheck, Loader2, Sparkles,
  Phone, CheckCircle2, Users, Award, Clock, ChevronRight
} from "lucide-react"
import { useSendOtpMutation, useVerifyOtpMutation, useResendOtpMutation } from "@/redux/features/auth/authApi"
import { useAppDispatch } from "@/redux/hooks"
import { setUser } from "@/redux/features/auth/authSlice"
import { setTokens } from "@/lib/token"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams ? searchParams.get("redirect") : null
  const dispatch = useAppDispatch()

  const [phone, setPhone] = useState("")
  const [remember, setRemember] = useState(false)

  const [isOtpSent, setIsOtpSent] = useState(false)
  const [otp, setOtp] = useState(["", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(300)
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([])

  const [sendOtp, { isLoading }] = useSendOtpMutation()
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation()
  const [resendOtp] = useResendOtpMutation()

  useEffect(() => {
    if (!isOtpSent) return
    if (timeLeft === 0) return
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isOtpSent, timeLeft])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await sendOtp({ phone }).unwrap()
      setIsOtpSent(true)
      setTimeLeft(300)
      setOtp(["", "", "", ""])
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to send OTP. Please try again.")
    }
  }

  const handleOtpChange = (val: string, index: number) => {
    if (isNaN(Number(val))) return
    const nextOtp = [...otp]
    nextOtp[index] = val.slice(-1)
    setOtp(nextOtp)
    if (val !== "" && index < 3) {
      otpInputsRef.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (key: string, index: number) => {
    if (key === "Backspace" && otp[index] === "" && index > 0) {
      otpInputsRef.current[index - 1]?.focus()
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const enteredOtp = otp.join("")
    if (enteredOtp.length < 4) {
      toast.error("Please enter a valid 4-digit OTP code.")
      return
    }
    try {
      const response = await verifyOtp({ phone, otpCode: enteredOtp }).unwrap()
      const accessToken = response?.data?.accessToken || response?.accessToken || response?.data?.token || response?.token
      const refreshToken = response?.data?.refreshToken || response?.refreshToken
      if (accessToken) setTokens(accessToken, refreshToken || "")

      const user = response?.data?.user || response?.user
      if (user) {
        const userRole = (typeof user.role === "object" && user.role) ? user.role.name : (user.role || "client")
        const roleString = typeof userRole === "string" ? userRole.toLowerCase().replace(/\s+/g, "") : "client"
        dispatch(setUser(user))
        const date = new Date()
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000)
        document.cookie = `rajseba_user_role=${roleString}; expires=${date.toUTCString()}; path=/; SameSite=Lax`
        toast.success("Login successful!")
        if (redirectUrl) router.push(redirectUrl)
        else if (roleString === "client") router.push("/dashbord/overview")
        else router.push("/dashbord")
      } else {
        toast.success("Login successful!")
        router.push(redirectUrl || "/dashbord/overview")
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Invalid OTP code.")
    }
  }

  const handleResendOtp = async () => {
    try {
      await resendOtp({ phone }).unwrap()
      setTimeLeft(300)
      setOtp(["", "", "", ""])
      toast.success("Verification code resent to " + phone)
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to resend OTP.")
    }
  }

  const stats = [
    { icon: Users, value: "50K+", label: "Happy Clients" },
    { icon: Award, value: "4.9★", label: "Avg Rating" },
    { icon: CheckCircle2, value: "200K+", label: "Jobs Done" },
    { icon: Clock, value: "24/7", label: "Support" },
  ]

  const features = [
    "Verified & background-checked professionals",
    "On-time service guarantee",
    "Secure payment & full refund policy",
    "Live booking tracking",
  ]

  return (
    <div className="min-h-screen w-full overflow-hidden bg-white flex">

      {/* ===== LEFT PANEL — Dark Premium ===== */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col relative overflow-hidden bg-slate-950">

        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="/cleaner-hero.png"
            alt="Home services"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/92 via-slate-900/80 to-rose-950/70" />
        </div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "48px 48px"
          }}
        />

        {/* Glow blob */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-rose-600/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-12 xl:px-16 py-12">

          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 group w-fit">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF7C71] to-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
              <Sparkles size={19} className="stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-white text-2xl tracking-tight">Rajseba</span>
          </Link>

          {/* Hero copy */}
          <div className="mt-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-rose-500/15 border border-rose-500/25 text-rose-400 px-4 py-1.5 rounded-full text-xs font-bold mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              Bangladesh's #1 Home Service Platform
            </div>

            <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight">
              Expert care for<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
                every corner
              </span><br />
              of your home.
            </h1>

            <p className="text-slate-400 text-base mt-5 max-w-sm leading-relaxed font-medium">
              From deep cleaning to AC repairs — Rajseba brings trusted professionals directly to your door.
            </p>

            {/* Feature list */}
            <ul className="mt-8 space-y-3">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                  <div className="w-5 h-5 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={12} className="text-rose-400" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-4 border-t border-white/10 pt-8">
            {stats.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="text-center">
                  <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                    <Icon size={16} className="text-rose-400" />
                  </div>
                  <div className="text-white font-black text-lg leading-tight">{s.value}</div>
                  <div className="text-slate-500 text-[10px] font-semibold mt-0.5">{s.label}</div>
                </div>
              )
            })}
          </div>

          {/* Testimonial card */}
          <div className="mt-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
              ))}
              <span className="text-slate-400 text-[10px] font-bold ml-2 mt-0.5">5.0</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed italic">
              "Rajseba transformed how I manage home repairs. Always on time and premium quality."
            </p>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
                alt="Elena Rodriguez"
                className="w-9 h-9 rounded-full object-cover border-2 border-rose-500/30"
              />
              <div>
                <p className="text-white text-xs font-bold">Elena Rodriguez</p>
                <p className="text-slate-500 text-[10px] font-medium">Premium Member since 2022</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL — Form ===== */}
      <div className="flex-1 flex flex-col relative overflow-y-auto">

        {/* Subtle bg pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #FF7C71 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }}
        />

        <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-16 xl:px-20 py-10 relative z-10">

          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-[#FF7C71] to-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-500/25">
                <Sparkles size={17} className="stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-[#FF7C71] text-2xl tracking-tight">Rajseba</span>
            </Link>
          </div>

          {!isOtpSent ? (
            /* ---- STEP 1: Phone number form ---- */
            <div className="w-full max-w-[420px] mx-auto">

              {/* Header */}
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-500 px-3.5 py-1.5 rounded-full text-xs font-bold mb-5 border border-rose-100">
                  <ShieldCheck size={13} className="stroke-[2.5]" />
                  Secure OTP Login
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Welcome back 👋
                </h2>
                <p className="text-slate-500 text-sm font-medium mt-2.5 leading-relaxed">
                  Enter your phone number and we'll send you a login code instantly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Phone field */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative group">
                    {/* Country flag & code */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10 border-r border-slate-200 pr-3">
                      <span className="text-base leading-none">🇧🇩</span>
                      <span className="text-xs font-bold text-slate-500">+880</span>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXX-XXXXXX"
                      className="w-full pl-[88px] pr-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-400/10 focus:outline-none transition-all text-sm font-semibold text-slate-800 placeholder-slate-400"
                      required
                    />
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-4.5 w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${remember ? "bg-rose-500 border-rose-500" : "bg-white border-slate-300 group-hover:border-rose-300"}`}>
                        {remember && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                    </div>
                    <span className="text-sm text-slate-600 font-semibold">Remember me</span>
                  </label>
                  <Link href="/help" className="text-xs text-rose-500 hover:underline font-semibold">
                    Need help?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#FF7C71] to-rose-600 hover:from-[#FF7C71] hover:to-rose-700 disabled:opacity-60 text-white text-sm font-black py-4 rounded-2xl shadow-xl shadow-rose-500/25 hover:shadow-rose-500/35 transition-all flex items-center justify-center gap-2 focus:outline-none active:scale-[0.99] mt-1"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Send Login Code
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-xs text-slate-400 font-semibold">or continue with</span>
                  </div>
                </div>

                {/* Social/Quick login hint */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-3 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-colors cursor-pointer">
                    <Phone size={15} className="text-slate-400" />
                    Bkash / Nagad
                  </div>
                  <div className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-3 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                  </div>
                </div>
              </form>

              {/* Sign up link */}
              <p className="text-center text-sm text-slate-500 font-medium mt-8">
                Don't have an account?{" "}
                <Link href="/signup" className="text-[#FF7C71] hover:underline font-bold">
                  Create one free →
                </Link>
              </p>

              {/* Trust badges */}
              <div className="mt-10 flex items-center justify-center gap-5 flex-wrap">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  SSL Encrypted
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  Privacy Protected
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                  <Award size={13} className="text-amber-500" />
                  Trusted by 50K+
                </div>
              </div>
            </div>
          ) : (
            /* ---- STEP 2: OTP Verification ---- */
            <div className="w-full max-w-[400px] mx-auto">

              <div className="mb-10">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-rose-500/30">
                  <ShieldCheck size={30} className="stroke-[2]" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 text-center tracking-tight">Check your phone</h2>
                <p className="text-slate-500 text-sm text-center font-medium mt-2.5 leading-relaxed">
                  We sent a 4-digit code to{" "}
                  <span className="font-black text-slate-800">{phone}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">

                {/* OTP inputs */}
                <div className="flex justify-center gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      ref={(el) => { otpInputsRef.current[idx] = el }}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e.key, idx)}
                      className={`w-14 h-16 rounded-2xl border-2 text-center text-2xl font-black focus:outline-none transition-all shadow-sm ${digit
                          ? "border-rose-500 bg-rose-50 text-rose-600"
                          : "border-slate-200 bg-slate-50 text-slate-800 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-400/10"
                        }`}
                      required
                    />
                  ))}
                </div>

                {/* Timer */}
                <div className="text-center">
                  {timeLeft > 0 ? (
                    <div className="inline-flex items-center gap-2 text-slate-500 text-sm font-semibold">
                      <Clock size={14} className="text-rose-400" />
                      Resend code in{" "}
                      <span className="text-rose-500 font-black tabular-nums">
                        {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? "0" + (timeLeft % 60) : timeLeft % 60}
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-rose-500 hover:underline font-black text-sm flex items-center gap-1 mx-auto"
                    >
                      Resend Code <ChevronRight size={14} />
                    </button>
                  )}
                </div>

                {/* Verify button */}
                <button
                  type="submit"
                  disabled={isVerifying || otp.join("").length < 4}
                  className="w-full bg-gradient-to-r from-[#FF7C71] to-rose-600 hover:from-[#FF7C71] hover:to-rose-700 disabled:opacity-50 text-white text-sm font-black py-4 rounded-2xl shadow-xl shadow-rose-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 focus:outline-none"
                >
                  {isVerifying ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Verify & Sign In
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </>
                  )}
                </button>
              </form>

              <button
                type="button"
                onClick={() => setIsOtpSent(false)}
                className="mt-6 w-full text-sm text-slate-500 hover:text-slate-800 font-semibold text-center hover:underline transition-colors"
              >
                ← Change phone number
              </button>

              {/* Security note */}
              <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-semibold">
                <ShieldCheck size={13} className="text-emerald-500" />
                Your code expires in 5 minutes. Never share it with anyone.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-6 text-[11px] text-slate-400 font-medium relative z-10 border-t border-slate-100 mx-6">
          © 2024 Rajseba Services Ltd. · All rights reserved.
          <Link href="/privacy" className="ml-3 text-slate-400 hover:text-rose-500 transition-colors">Privacy</Link>
          <Link href="/terms" className="ml-3 text-slate-400 hover:text-rose-500 transition-colors">Terms</Link>
        </div>
      </div>
    </div>
  )
}