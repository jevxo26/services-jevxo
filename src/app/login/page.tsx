"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import {
  ArrowRight, Star, ShieldCheck, Loader2, Sparkles,
  Phone, CheckCircle2, Users, Award, Clock, ChevronRight, ChevronLeft
} from "lucide-react"
import { useSendOtpMutation, useVerifyOtpMutation, useResendOtpMutation } from "@/redux/features/auth/authApi"
import { useAppDispatch } from "@/redux/hooks"
import { setUser } from "@/redux/features/auth/authSlice"
import { setTokens } from "@/lib/token"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

// Dynamically import Lottie to avoid SSR issues
const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((m) => m.Player),
  { ssr: false }
)

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

    "On-time service guarantee",
    "Secure payment & full refund policy",
    "Live booking tracking",
  ]

  return (
    <div className="min-h-screen w-full overflow-hidden bg-white flex">

      {/* ===== LEFT PANEL — Lottie Animation ===== */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[50%] flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">

        {/* Soft background circles */}
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-[#FF6014]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 bg-orange-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center px-10">
          {/* Brand badge */}
          <div className="inline-flex items-center gap-2 bg-[#FF6014]/10 border border-[#FF6014]/20 text-[#FF6014] px-4 py-1.5 rounded-full text-xs font-bold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6014] animate-pulse" />
            Bangladesh's #1 Home Service Platform
          </div>

          {/* Lottie Player */}
          <div className="w-full max-w-[420px] xl:max-w-[480px]">
            <Player
              autoplay
              loop
              src="/signup.json"
              style={{ width: "100%", height: "auto" }}
            />
          </div>

          <h2 className="text-2xl xl:text-3xl font-black text-slate-800 leading-tight mt-4">
            Welcome back to{" "}
            <span className="text-[#FF6014]">Rajseba</span>
          </h2>


          {/* Feature list */}
          <ul className="mt-6 space-y-2.5 text-left w-full max-w-xs">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                <div className="w-5 h-5 rounded-full bg-[#FF6014]/15 border border-[#FF6014]/25 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={12} className="text-[#FF6014]" />
                </div>
                {f}
              </li>
            ))}
          </ul>

          {/* Stats row */}
          <div className="flex items-center gap-8 mt-8 pt-6 border-t border-slate-200/60 w-full justify-center">
            {stats.map((s, i) => {
              const Icon = s.icon
              return (
                <React.Fragment key={i}>
                  {i > 0 && <div className="w-px h-10 bg-slate-200" />}
                  <div className="text-center">
                    <p className="text-xl font-black text-slate-800">{s.value}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{s.label}</p>
                  </div>
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL — Form ===== */}
      <div className="flex-1 flex flex-col relative overflow-y-auto">

        {/* Subtle bg pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #FF6014 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }}
        />

        {/* Back to home */}
        <div className="relative z-10 px-6 sm:px-10 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#FF6014] transition-colors group"
          >
            <ChevronLeft size={17} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-6 relative z-10">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex flex-col items-center">
            <Link href="/" className="flex flex-col items-center gap-2.5 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6014] to-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-500/25">
                <Sparkles size={20} className="stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-[#FF6014] text-xl tracking-tight">Rajseba</span>
            </Link>
          </div>

          {!isOtpSent ? (
            /* ---- STEP 1: Phone number form ---- */
            <div className="w-full max-w-[440px] bg-white rounded-3xl sm:rounded-none border border-slate-200 sm:border-0 shadow-xl sm:shadow-none px-6 py-8 sm:px-2 sm:py-0">

              {/* Centered Header */}
              <div className="flex flex-col items-center text-center mb-8">
                <Link href="/" className="flex flex-col items-center gap-2.5 group mb-5 lg:flex hidden">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FF6014] to-rose-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-400/25 group-hover:scale-105 transition-transform">
                    <Sparkles size={24} className="stroke-[2]" />
                  </div>
                  <span className="font-black text-xl text-slate-900 tracking-tight">Rajseba</span>
                </Link>

                <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-500 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 border border-rose-100">
                  <ShieldCheck size={13} className="stroke-[2.5]" />
                  Secure OTP Login
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  Welcome back 👋
                </h2>
                <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed max-w-xs">
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
                  className="w-full bg-gradient-to-r from-[#FF6014] to-rose-600 hover:from-[#FF6014] hover:to-rose-700 disabled:opacity-60 text-white text-sm font-black py-4 rounded-2xl shadow-xl shadow-rose-500/25 hover:shadow-rose-500/35 transition-all flex items-center justify-center gap-2 focus:outline-none active:scale-[0.99] mt-1"
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


              </form>

              {/* Sign up link */}
              <p className="text-center text-sm text-slate-500 font-medium mt-8">
                Don't have an account?{" "}
                <Link href="/signup" className="text-[#FF6014] hover:underline font-bold">
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
                  className="w-full bg-gradient-to-r from-[#FF6014] to-rose-600 hover:from-[#FF6014] hover:to-rose-700 disabled:opacity-50 text-white text-sm font-black py-4 rounded-2xl shadow-xl shadow-rose-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 focus:outline-none"
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
        <div className="text-center py-5 text-[11px] text-slate-400 font-medium relative z-10 border-t border-slate-100 mx-6 space-y-1">
          <div>
            © {new Date().getFullYear()} Rajseba Services Ltd. · All rights reserved.
            <Link href="/privacy" className="ml-3 text-slate-400 hover:text-[#FF6014] transition-colors">Privacy</Link>
            <Link href="/terms" className="ml-3 text-slate-400 hover:text-[#FF6014] transition-colors">Terms</Link>
          </div>
          <div>
            Developed by{" "}
            <a
              href="https://jevxo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF6014] hover:underline font-semibold"
            >
              Jevxo
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}