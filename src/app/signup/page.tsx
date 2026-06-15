"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Briefcase,
  Check,
  ShieldCheck,
  PenTool,
  Loader2,
  Sparkles,
  ArrowRight,
  Home,
  Star,
  Users,
  Award
} from "lucide-react"
import { useRegisterMutation, useVerifyOtpMutation, useResendOtpMutation } from "@/redux/features/auth/authApi"
import { useAppDispatch } from "@/redux/hooks"
import { setUser } from "@/redux/features/auth/authSlice"
import Link from "next/link"
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams ? searchParams.get("redirect") : null
  const [showPassword, setShowPassword] = useState(false)
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

  const dispatch = useAppDispatch()
  const [register, { isLoading, error }] = useRegisterMutation()
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
      // Transition to OTP screen on success
      setIsOtpSent(true)
      setTimeLeft(300)
      setOtp(["", "", "", ""])

      // If the backend returns credentials here, we can set them, otherwise we do it on verifyOtp
      if (response.access_token || response.token) {
        const token = response.access_token || response.token;
        if (token) {
          localStorage.setItem('token', token);
          const date = new Date();
          date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
          const expires = "; expires=" + date.toUTCString();
          document.cookie = `token=${token}${expires}; path=/; SameSite=Lax`;
          document.cookie = `rajseba_access_token=${token}${expires}; path=/; SameSite=Lax`;
        }
        const user = response.user || response;
        dispatch(setUser(user))
      }
    } catch (err: any) {
      console.error("Registration failed:", err)
      toast.error(err.data?.message || "Registration failed. Please try again.")
    }
  }

  const handleOtpChange = (val: string, index: number) => {
    if (isNaN(Number(val))) return

    const nextOtp = [...otp]
    nextOtp[index] = val.slice(-1) // grab last input character
    setOtp(nextOtp)

    // Move to next input field
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
      alert("Please enter a valid 4-digit OTP code.")
      return
    }

    try {
      const response = await verifyOtp({ phone: formData.phone, otpCode: enteredOtp }).unwrap()
      console.log("OTP Verified successfully:", enteredOtp)

      const token = response?.data?.accessToken || response?.accessToken || response?.data?.token || response?.token;
      if (token) {
        localStorage.setItem('token', token);
        const date = new Date();
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
        const expires = "; expires=" + date.toUTCString();
        document.cookie = `token=${token}${expires}; path=/; SameSite=Lax`;
        document.cookie = `rajseba_access_token=${token}${expires}; path=/; SameSite=Lax`;
      }

      const user = response?.data?.user || response?.user;
      if (user) {
        dispatch(setUser(user));

        // Redirect based on role
        const userRole = (typeof user.role === 'object' && user.role) ? user.role.name : (user.role || 'client');
        const roleString = typeof userRole === 'string' ? userRole.toLowerCase().replace(/\s+/g, '') : "client";

        const date = new Date();
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
        const expires = "; expires=" + date.toUTCString();
        document.cookie = `rajseba_user_role=${roleString}${expires}; path=/; SameSite=Lax`;

        if (redirectUrl) {
          router.push(redirectUrl)
        } else if (roleString === "client") {
          router.push("/dashbord/overview")
        } else {
          router.push("/dashbord")
        }
      } else {
        if (redirectUrl) {
          router.push(redirectUrl)
        } else {
          router.push("/dashbord/overview")
        }
      }
    } catch (err: any) {
      console.error("OTP verification failed:", err)
      toast.error(err.data?.message || "Invalid OTP code.")
    }
  }

  const handleResendOtp = async () => {
    try {
      await resendOtp({ phone: formData.phone }).unwrap()
      setTimeLeft(300)
      setOtp(["", "", "", ""])
      alert("Verification code has been resent to " + formData.phone)
    } catch (err: any) {
      console.error("Failed to resend OTP:", err)
      toast.error(err.data?.message || "Failed to resend OTP.")
    }
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
                backgroundImage: "url('/Group1.png')",
                backgroundPosition: "center",
                backgroundRepeat: "repeat",
                backgroundSize: "850px"
              }}
            />

            {/* Brand Header with Premium Icon */}
            <div className="relative z-10">

              <p className="text-sm text-gray-500 font-medium mt-2 leading-relaxed">
                Create your account to access premium home services<br />instantly.
              </p>
            </div>

            {/* Form */}
            <div className="w-full max-w-[420px] mx-auto py-10 relative z-10">
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <User size={18} className="text-gray-400 group-focus-within:text-[#FF565C] transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3.5 rounded-[14px] bg-[#F3F4F6] border-2 border-transparent focus:bg-white focus:border-[#FF565C]/30 focus:ring-4 focus:ring-[#FF565C]/10 focus:outline-none transition-all text-sm text-gray-800 placeholder-gray-450 shadow-sm"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <Mail size={18} className="text-gray-400 group-focus-within:text-[#FF565C] transition-colors" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className="w-full pl-12 pr-4 py-3.5 rounded-[14px] bg-[#F3F4F6] border-2 border-transparent focus:bg-white focus:border-[#FF565C]/30 focus:ring-4 focus:ring-[#FF565C]/10 focus:outline-none transition-all text-sm text-gray-800 placeholder-gray-450 shadow-sm"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <Phone size={18} className="text-gray-400 group-focus-within:text-[#FF565C] transition-colors" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1(555) 000-0000"
                      className="w-full pl-12 pr-4 py-3.5 rounded-[14px] bg-[#F3F4F6] border-2 border-transparent focus:bg-white focus:border-[#FF565C]/30 focus:ring-4 focus:ring-[#FF565C]/10 focus:outline-none transition-all text-sm text-gray-800 placeholder-gray-450 shadow-sm"
                      required
                    />
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-2 border-gray-300 text-[#FF565C] focus:ring-[#FF565C]/30 focus:ring-2 accent-[#FF565C] cursor-pointer"
                    required
                  />
                  <label htmlFor="agreeTerms" className="text-xs text-gray-500 font-medium select-none cursor-pointer">
                    I agree to the{" "}
                    <Link href="#" className="text-[#FF565C] hover:underline font-semibold">
                      Terms of Use
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-[#FF565C] hover:underline font-semibold">
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#FF565C] to-rose-600 hover:from-[#FF464C] hover:to-rose-700 disabled:from-[#FF565C]/70 disabled:to-rose-600/70 text-white text-sm font-bold py-3.5 rounded-[14px] shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all focus:outline-none mt-2 flex justify-center items-center gap-2 active:scale-[0.99]"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Footer Login Info */}
            <div className="text-center text-sm text-gray-500 font-medium relative z-10 pt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-[#FF565C] hover:underline font-bold ml-1">
                Login
              </Link>
            </div>

          </div>

          {/* Right Column: Hero Cover (Desktop Only) */}
          <div className="hidden lg:block w-full h-full relative overflow-hidden bg-slate-900">
            <img
              src="/kitchen-cleaning-hero.png"
              alt="Home clean interior"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Trust Floating Card */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-6">
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-[32px] border border-white/20 shadow-xl space-y-6">

                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FF565C] to-rose-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-500/25">
                    <Home size={22} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-lg">Your Trusted Home Partner</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Professional services at your doorstep.</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200/60 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users size={16} className="text-[#FF565C]" />
                      <span className="text-2xl font-black text-slate-800">50k+</span>
                    </div>
                    <span className="text-[9px] text-slate-450 font-extrabold uppercase tracking-widest mt-1.5 block">Active Users</span>
                  </div>
                  <div className="border-x border-slate-200/60">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star size={16} className="text-[#FF565C]" />
                      <span className="text-2xl font-black text-slate-800">4.9/5</span>
                    </div>
                    <span className="text-[9px] text-slate-450 font-extrabold uppercase tracking-widest mt-1.5 block">Avg Rating</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Award size={16} className="text-[#FF565C]" />
                      <span className="text-2xl font-black text-slate-800">120+</span>
                    </div>
                    <span className="text-[9px] text-slate-450 font-extrabold uppercase tracking-widest mt-1.5 block">Expert Categories</span>
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
                We've sent a 4-digit code to <strong className="text-slate-800">{formData.phone || "+880 1712-XXXXXX"}</strong>
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
                    className="w-12 h-12 rounded-xl border-2 border-slate-200 bg-slate-50/60 focus:bg-white text-center text-lg font-black focus:outline-none focus:border-[#FF565C]/50 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all text-slate-800 shadow-sm"
                    required
                  />
                ))}
              </div>

              {/* Timer Countdown */}
              <div className="text-xs text-rose-500 font-extrabold tracking-wide">
                {timeLeft > 0 ? (
                  `Resend code in 0${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? "0" + (timeLeft % 60) : timeLeft % 60}`
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
                className="w-full bg-gradient-to-r from-[#FF565C] to-rose-600 hover:from-[#FF464C] hover:to-rose-700 disabled:from-[#FF565C]/70 disabled:to-rose-600/70 text-white text-sm font-black py-4 rounded-[14px] shadow-lg shadow-rose-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 focus:outline-none"
              >
                {isVerifying ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    VERIFY & PROCEED
                    <ArrowRight size={18} className="font-extrabold" strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>

            {/* Option to change phone number */}
            <button
              type="button"
              onClick={() => setIsOtpSent(false)}
              className="text-xs text-slate-500 hover:text-slate-800 hover:underline font-bold flex items-center justify-center gap-1 mx-auto focus:outline-none"
            >
              Change Phone Number
            </button>
          </div>

          <span className="text-[10px] text-slate-400 font-extrabold mt-6 flex items-center justify-center gap-1 relative z-10">
            <ShieldCheck size={12} className="text-green-500" />
            Your connection is secure and encrypted
          </span>
        </div>
      )}
    </div>
  )
}