"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Phone, ArrowRight, Star, Briefcase, ShieldCheck, Loader2 } from "lucide-react"
import { useLoginMutation, useVerifyOtpMutation, useResendOtpMutation } from "@/redux/features/auth/authApi"
import { useAppDispatch } from "@/redux/hooks"
import { setUser } from "@/redux/features/auth/authSlice"
import { useRouter } from "next/navigation"
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  const [phone, setPhone] = useState("")
  const [remember, setRemember] = useState(false)
  
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(59)
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([])

  const [login, { isLoading, error }] = useLoginMutation()
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation()
  const [resendOtp] = useResendOtpMutation()

  // Timer countdown hook for OTP resend limit
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
      const response = await login({ phone }).unwrap()
      
      setIsOtpSent(true)
      setTimeLeft(59)
      setOtp(["", "", "", "", "", ""])
      
      // If the backend returns credentials here, we can set them, otherwise we do it on verifyOtp
      if (response.access_token || response.token) {
        const token = response.access_token || response.token;
        if (token) localStorage.setItem('token', token);
        const user = response.user || response;
        dispatch(setUser(user))
      }
    } catch (err: any) {
      console.error("Login failed:", err)
      toast.error(err.data?.message || "Failed to send OTP. Please try again.")
    }
  }

  const handleOtpChange = (val: string, index: number) => {
    if (isNaN(Number(val))) return

    const nextOtp = [...otp]
    nextOtp[index] = val.slice(-1)
    setOtp(nextOtp)

    if (val !== "" && index < 5) {
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
    if (enteredOtp.length < 6) {
      toast.warning("Please enter a valid 6-digit OTP code.")
      return
    }

    try {
      const response = await verifyOtp({ phone, otp: enteredOtp }).unwrap()
      
      // If credentials are only provided after OTP verify
      if (response.access_token || response.token) {
        const token = response.access_token || response.token;
        if (token) localStorage.setItem('token', token);
        const user = response.user || response;
        dispatch(setUser(user))
      }
      
      router.push("/dashbord/overview")
    } catch (err: any) {
      console.error("OTP verification failed:", err)
      toast.error(err.data?.message || "Invalid OTP code.")
    }
  }

  const handleResendOtp = async () => {
    try {
      await resendOtp({ phone }).unwrap()
      setTimeLeft(59)
      setOtp(["", "", "", "", "", ""])
      toast.success("Verification code has been resent to " + phone)
    } catch (err: any) {
      console.error("Failed to resend OTP:", err)
      toast.error(err.data?.message || "Failed to resend OTP.")
    }
  }

  return (
    <div className="min-h-screen w-full overflow-hidden bg-white">
      {!isOtpSent ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left Column: Form */}
          <div className="flex flex-col justify-between p-6 sm:p-12 min-h-screen relative overflow-hidden">
            
            {/* Background Watermark Pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.14]"
              style={{
                backgroundImage: "url('/Group1.png')",
                backgroundPosition: "center",
                backgroundRepeat: "repeat",
                backgroundSize: "850px"
              }}
            />

            {/* Brand Header with Icon */}
            <div className="relative z-10 flex items-center gap-2.5">
              <span className="w-10 h-10 bg-[#FF565C] rounded-xl flex items-center justify-center text-white shrink-0 shadow-md shadow-[#FF565C]/20">
                <Briefcase size={18} className="stroke-[2.5]" />
              </span>
              <Link href="/" className="inline-block">
                <span className="font-extrabold text-slate-900 text-3xl tracking-tight">Rajseba</span>
              </Link>
            </div>

            {/* Form Content */}
            <div className="w-full max-w-[420px] mx-auto py-10 relative z-10">
              <div className="space-y-2 mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back
                </h1>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Login with your phone number to access your dashboard.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1(555) 000-0000"
                      className="w-full pl-12 pr-4 py-3.5 rounded-[14px] bg-[#F3F4F6] border border-transparent focus:bg-white focus:border-gray-305 focus:ring-2 focus:ring-[#FF565C]/15 focus:outline-none transition-all text-sm text-gray-800 placeholder-gray-450"
                      required
                    />
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex justify-between items-center text-xs md:text-sm pt-1 select-none">
                  <label className="flex items-center gap-2.5 text-gray-600 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-350 text-[#FF565C] focus:ring-[#FF565C]/30 focus:ring-2 accent-[#FF565C] cursor-pointer"
                    />
                    Remember me
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#FF565C] hover:bg-[#FF464C] disabled:bg-[#FF565C]/70 text-white text-sm font-bold py-3.5 rounded-[14px] shadow-sm shadow-[#FF565C]/10 transition-all flex items-center justify-center gap-2 focus:outline-none mt-2"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Send Login Code <ArrowRight size={18} /></>}
                </button>
              </form>

              {/* Social Divider */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-[1px] bg-gray-200/80 flex-1" />
                  <span className="text-[10px] text-gray-455 font-bold tracking-wider uppercase">Or Continue With</span>
                  <div className="h-[1px] bg-gray-200/80 flex-1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-[14px] border border-gray-205 hover:bg-gray-50 transition-colors text-xs font-bold text-gray-700 focus:outline-none">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                      alt="google"
                      className="w-4 h-4"
                    />
                    Google
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-[14px] border border-gray-205 hover:bg-gray-50 transition-colors text-xs font-bold text-gray-700 focus:outline-none">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                      alt="apple"
                      className="w-4 h-4"
                    />
                    Apple
                  </button>
                </div>
              </div>

              {/* Footer Navigation */}
              <div className="text-center text-sm text-gray-500 font-medium mt-6">
                Don't have an account?{" "}
                <Link href="/signup" className="text-[#FF565C] hover:underline font-bold ml-1">
                  Sign up
                </Link>
              </div>
            </div>

            {/* Footer Copyright */}
            <div className="text-left text-xs text-gray-400 relative z-10 pt-4">
              © 2024 Rajseba Services. All rights reserved.
            </div>

          </div>

          {/* Right Column: Hero Cover */}
          <div className="hidden lg:block w-full h-full relative overflow-hidden bg-slate-900">
            <img
              src="/cleaner-hero.png"
              alt="Home clean interior"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Floating Badges */}
            <div className="absolute top-8 right-8 flex gap-3 z-10">
              <div className="w-11 h-11 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-[#FF565C] shadow-md border border-white/20">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="w-11 h-11 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-[#FF565C] shadow-md border border-white/20">
                <Briefcase className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>

            {/* Floating Review Card */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-6">
              <div className="bg-white/90 backdrop-blur-md p-8 rounded-[32px] border border-white/20 shadow-xl space-y-5">
                {/* Stars */}
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-500 pt-0.5 ml-1">5.0 RATING</span>
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">
                  Effortless living, professionally managed.
                </h2>
                
                {/* Quote */}
                <p className="text-sm text-slate-500 leading-relaxed italic">
                  "Rajseba has completely transformed how I manage my home repairs. Fast, reliable, and always premium quality."
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-200/60">
                  <div className="relative w-11 h-11 bg-slate-100 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
                      alt="Elena Rodriguez"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-850 text-sm md:text-base">
                      Elena Rodriguez
                    </h4>
                    <p className="text-xs text-slate-400 font-extrabold tracking-wide">
                      Premium Member since 2022
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Step 2: Verification Screen */
        <div className="min-h-screen bg-slate-50/20 flex flex-col justify-center items-center p-4 relative overflow-hidden">

          {/* Background Watermark Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.14]"
            style={{
              backgroundImage: "url('/Group1.png')",
              backgroundPosition: "center",
              backgroundRepeat: "repeat",
              backgroundSize: "850px"
            }}
          />

          <div className="w-full max-w-[460px] bg-white/95 backdrop-blur-md p-8 sm:p-12 rounded-[40px] border border-slate-100 shadow-xl text-center space-y-7 relative z-10 animate-in zoom-in duration-300">
            <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center text-[#FF565C] mx-auto">
              <ShieldCheck size={26} className="stroke-[2.5]" />
            </div>

            <div className="space-y-2.5">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Verify Your Number</h2>
              <p className="text-xs text-slate-450 font-semibold leading-relaxed px-4">
                We've sent a 6-digit code to <strong className="text-slate-800">{phone || "+880 1712-XXXXXX"}</strong>
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
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-[#FF565C] hover:underline font-black focus:outline-none"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              {/* Verify & Proceed Submit Button */}
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-[#FF565C] hover:bg-[#FF464C] disabled:bg-[#FF565C]/70 text-[#ffffff] text-xs font-black py-4 rounded-[14px] shadow-sm shadow-[#FF565C]/10 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 focus:outline-none"
              >
                {isVerifying ? <Loader2 size={18} className="animate-spin" /> : <>VERIFY & PROCEED <span className="text-sm font-extrabold">→</span></>}
              </button>
            </form>

            {/* Option to change phone number */}
            <button
              type="button"
              onClick={() => setIsOtpSent(false)}
              className="text-xs text-slate-500 hover:text-slate-855 hover:underline font-bold flex items-center justify-center gap-1 mx-auto focus:outline-none"
            >
              Change Phone Number
            </button>
          </div>

          <span className="text-[10px] text-slate-400 font-extrabold mt-6 block text-center relative z-10">
            🔒 Your connection is secure and encrypted
          </span>
        </div>
      )}
    </div>
  )
}
