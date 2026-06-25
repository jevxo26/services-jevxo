"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Mail,
  User,
  Phone,
  Check,
  ShieldCheck,
  Loader2,
  ArrowRight,
  Sparkles,
  ChevronLeft,
} from "lucide-react"
import { useRegisterMutation, useVerifyOtpMutation, useResendOtpMutation } from "@/redux/features/auth/authApi"
import { useAppDispatch } from "@/redux/hooks"
import { setUser } from "@/redux/features/auth/authSlice"
import Link from "next/link"
import { toast } from "sonner"

// Dynamically import Lottie to avoid SSR issues
const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((m) => m.Player),
  { ssr: false }
)

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams ? searchParams.get("redirect") : null
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [otp, setOtp] = useState(["", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(300)

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([])

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

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

  const dispatch = useAppDispatch()
  const [register, { isLoading }] = useRegisterMutation()
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation()
  const [resendOtp] = useResendOtpMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreeTerms) {
      toast.warning("Please agree to the Terms of Use and Privacy Policy.")
      return
    }
    try {
      const response = await register(formData).unwrap()
      setIsOtpSent(true)
      setTimeLeft(300)
      setOtp(["", "", "", ""])

      if (response.access_token || response.token) {
        const token = response.access_token || response.token
        if (token) {
          localStorage.setItem("token", token)
          const date = new Date()
          date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000)
          const expires = "; expires=" + date.toUTCString()
          document.cookie = `token=${token}${expires}; path=/; SameSite=Lax`
          document.cookie = `rajseba_access_token=${token}${expires}; path=/; SameSite=Lax`
        }
        const user = response.user || response
        dispatch(setUser(user))
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Registration failed. Please try again.")
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
      const response = await verifyOtp({ phone: formData.phone, otpCode: enteredOtp }).unwrap()
      const token = response?.data?.accessToken || response?.accessToken || response?.data?.token || response?.token
      if (token) {
        localStorage.setItem("token", token)
        const date = new Date()
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000)
        const expires = "; expires=" + date.toUTCString()
        document.cookie = `token=${token}${expires}; path=/; SameSite=Lax`
        document.cookie = `rajseba_access_token=${token}${expires}; path=/; SameSite=Lax`
      }

      const user = response?.data?.user || response?.user
      if (user) {
        dispatch(setUser(user))
        const userRole = (typeof user.role === "object" && user.role) ? user.role.name : (user.role || "client")
        const roleString = typeof userRole === "string" ? userRole.toLowerCase().replace(/\s+/g, "") : "client"

        const date = new Date()
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000)
        const expires = "; expires=" + date.toUTCString()
        document.cookie = `rajseba_user_role=${roleString}${expires}; path=/; SameSite=Lax`

        toast.success("Registration successful!")
        if (redirectUrl) router.push(redirectUrl)
        else if (roleString === "client") router.push("/dashbord/overview")
        else router.push("/dashbord")
      } else {
        toast.success("Registration successful!")
        router.push(redirectUrl || "/dashbord/overview")
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Invalid OTP code.")
    }
  }

  const handleResendOtp = async () => {
    try {
      await resendOtp({ phone: formData.phone }).unwrap()
      setTimeLeft(300)
      setOtp(["", "", "", ""])
      toast.success("Verification code has been resent to " + formData.phone)
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to resend OTP.")
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">

      {/* ===== LEFT PANEL — Lottie Animation ===== */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[50%] flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">

        {/* Soft background circles */}
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-[#FF7C71]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 bg-orange-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center px-10">
          {/* Brand badge */}
          <div className="inline-flex items-center gap-2 bg-[#FF7C71]/10 border border-[#FF7C71]/20 text-[#FF7C71] px-4 py-1.5 rounded-full text-xs font-bold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7C71] animate-pulse" />
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
            Start your journey with{" "}
            <span className="text-[#FF7C71]">Rajseba</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-3 max-w-sm leading-relaxed">
            Join 50,000+ happy customers who trust Rajseba for professional home services every day.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-8 mt-8 pt-6 border-t border-slate-200/60 w-full justify-center">
            <div className="text-center">
              <p className="text-2xl font-black text-slate-800">50K+</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Happy Clients</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-black text-slate-800">4.9★</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Avg Rating</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-black text-slate-800">120+</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Services</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL — Form ===== */}
      <div className="flex-1 flex flex-col justify-center overflow-y-auto relative">

        {/* Subtle dot bg */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #FF7C71 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Back to home button */}
        <div className="relative z-10 px-6 sm:px-10 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#FF7C71] transition-colors group"
          >
            <ChevronLeft size={17} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
        </div>

        <div className="relative z-10 px-4 sm:px-10 xl:px-20 py-8">

          {!isOtpSent ? (
            <div className="w-full max-w-[420px] mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm sm:shadow-none sm:border-0 sm:rounded-none p-6 sm:p-0">

              {/* Centered Branded Header */}
              <div className="flex flex-col items-center text-center mb-10">
                <Link href="/" className="flex flex-col items-center gap-3 group mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FF7C71] to-rose-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-400/30 group-hover:scale-105 transition-transform">
                    <Sparkles size={28} className="stroke-[2]" />
                  </div>
                  <span className="font-black text-2xl text-slate-900 tracking-tight">Rajseba</span>
                </Link>

                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  Create Account
                </h1>
                <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed">
                  Sign up to access premium home services.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <User size={17} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#FF7C71] focus:ring-4 focus:ring-[#FF7C71]/10 focus:outline-none transition-all text-sm font-medium text-slate-900 placeholder-slate-400"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail size={17} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#FF7C71] focus:ring-4 focus:ring-[#FF7C71]/10 focus:outline-none transition-all text-sm font-medium text-slate-900 placeholder-slate-400"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Phone size={17} />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="01712-XXXXXX"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#FF7C71] focus:ring-4 focus:ring-[#FF7C71]/10 focus:outline-none transition-all text-sm font-medium text-slate-900 placeholder-slate-400"
                      required
                    />
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative mt-0.5 shrink-0">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="sr-only"
                        required
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${agreeTerms ? "bg-[#FF7C71] border-[#FF7C71]" : "bg-white border-slate-300 group-hover:border-[#FF7C71]/50"}`}>
                        {agreeTerms && <Check size={12} className="text-white stroke-[3]" />}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium select-none leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" className="text-[#FF7C71] hover:underline font-semibold">Terms of Use</Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-[#FF7C71] hover:underline font-semibold">Privacy Policy</Link>.
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 bg-[#FF7C71] hover:bg-[#FF7C71]/90 disabled:opacity-70 text-white text-[15px] font-bold py-3.5 rounded-xl shadow-lg shadow-[#FF7C71]/20 hover:shadow-[#FF7C71]/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>





              {/* Login link */}
              <p className="text-center text-[14px] text-slate-500 font-medium mt-7">
                Already have an account?{" "}
                <Link href="/login" className="text-[#FF7C71] hover:underline font-semibold">
                  Login
                </Link>
              </p>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-5 flex-wrap mt-8">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  SSL Encrypted
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                  <Check size={13} className="text-emerald-500" />
                  Privacy Protected
                </div>
              </div>

              {/* Footer */}
              <p className="text-center text-[11px] text-slate-400 font-medium mt-8">
                © {new Date().getFullYear()} Rajseba Services. All rights reserved.
              </p>

              <p className="text-center text-[11px] text-slate-400 font-medium mt-1">
                Developed by Aftab Farhan
              </p>
            </div>
          ) : (
            /* ===== OTP Verification Screen ===== */
            <div className="w-full max-w-[420px] mx-auto flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF7C71] to-rose-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-rose-400/30">
                <ShieldCheck size={30} className="stroke-[2]" />
              </div>

              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Verify Your Number</h2>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-2 px-4">
                We've sent a 4-digit code to{" "}
                <strong className="text-slate-800">{formData.phone || "+880 1712-XXXXXX"}</strong>
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-6 w-full mt-8">
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
                        ? "border-[#FF7C71] bg-rose-50 text-[#FF7C71]"
                        : "border-slate-200 bg-slate-50 text-slate-800 focus:border-[#FF7C71] focus:bg-white focus:ring-4 focus:ring-[#FF7C71]/10"
                        }`}
                      required
                    />
                  ))}
                </div>

                {/* Timer */}
                <div className="text-xs text-[#FF7C71] font-extrabold tracking-wide">
                  {timeLeft > 0 ? (
                    `Resend code in 0${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? "0" + (timeLeft % 60) : timeLeft % 60}`
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-[#FF7C71] hover:underline font-black focus:outline-none"
                    >
                      Resend Code
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-[#FF7C71] hover:bg-[#FF7C71]/90 disabled:opacity-75 text-white text-sm font-black py-4 rounded-xl shadow-lg shadow-rose-400/25 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 focus:outline-none"
                >
                  {isVerifying ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      VERIFY & PROCEED
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </>
                  )}
                </button>
              </form>

              <button
                type="button"
                onClick={() => setIsOtpSent(false)}
                className="mt-5 text-xs text-slate-500 hover:text-slate-800 hover:underline font-bold focus:outline-none"
              >
                ← Change Phone Number
              </button>

              <span className="text-[10px] text-slate-400 font-extrabold mt-6 flex items-center justify-center gap-1">
                <ShieldCheck size={12} className="text-emerald-500" />
                Your connection is secure and encrypted
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}