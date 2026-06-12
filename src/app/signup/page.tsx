"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, Phone, Briefcase, Check, ShieldCheck, PenTool, Loader2 } from "lucide-react"
import { useRegisterMutation, useVerifyOtpMutation, useResendOtpMutation } from "@/redux/features/auth/authApi"
import { useAppDispatch } from "@/redux/hooks"
import { setUser } from "@/redux/features/auth/authSlice"
import Link from "next/link"
import { toast } from "sonner";

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
      const response = await verifyOtp({ phone: formData.phone, otp: enteredOtp }).unwrap()
      console.log("OTP Verified successfully:", enteredOtp)
      
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
      await resendOtp({ phone: formData.phone }).unwrap()
      setTimeLeft(59)
      setOtp(["", "", "", "", "", ""])
      toast.success("Verification code has been resent to " + formData.phone)
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

            {/* Brand Header */}
            <div className="relative z-10">
              <Link href="/" className="inline-block">
                <span className="font-extrabold text-[#FF565C] text-4xl tracking-tight">Rajseba</span>
              </Link>
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
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3.5 rounded-[14px] bg-[#F3F4F6] border border-transparent focus:bg-white focus:border-gray-305 focus:ring-2 focus:ring-[#FF565C]/15 focus:outline-none transition-all text-sm text-gray-800 placeholder-gray-450"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className="w-full pl-12 pr-4 py-3.5 rounded-[14px] bg-[#F3F4F6] border border-transparent focus:bg-white focus:border-gray-305 focus:ring-2 focus:ring-[#FF565C]/15 focus:outline-none transition-all text-sm text-gray-800 placeholder-gray-455"
                      required
                    />
                  </div>
                </div>

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
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1(555) 000-0000"
                      className="w-full pl-12 pr-4 py-3.5 rounded-[14px] bg-[#F3F4F6] border border-transparent focus:bg-white focus:border-gray-305 focus:ring-2 focus:ring-[#FF565C]/15 focus:outline-none transition-all text-sm text-gray-800 placeholder-gray-455"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3.5 rounded-[14px] bg-[#F3F4F6] border border-transparent focus:bg-white focus:border-gray-305 focus:ring-2 focus:ring-[#FF565C]/15 focus:outline-none transition-all text-sm text-gray-800 placeholder-gray-455"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-650 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-350 text-[#FF565C] focus:ring-[#FF565C]/30 focus:ring-2 accent-[#FF565C] cursor-pointer"
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
                  className="w-full bg-[#FF565C] hover:bg-[#FF464C] disabled:bg-[#FF565C]/70 text-white text-sm font-bold py-3.5 rounded-[14px] shadow-sm shadow-[#FF565C]/10 transition-all focus:outline-none mt-2 flex justify-center items-center"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Create Account"}
                </button>
              </form>

              {/* Social Login */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-[1px] bg-gray-200/80 flex-1" />
                  <span className="text-[10px] text-gray-455 font-bold tracking-wider uppercase">Or Sign Up With</span>
                  <div className="h-[1px] bg-gray-200/80 flex-1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-[14px] border border-gray-205 hover:bg-gray-50 transition-colors text-xs font-bold text-gray-700 focus:outline-none">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                      alt="google"
                      className="w-4 h-4"
                    />
                    GOOGLE
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-[14px] border border-gray-205 hover:bg-gray-50 transition-colors text-xs font-bold text-gray-700 focus:outline-none">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                      alt="apple"
                      className="w-4 h-4"
                    />
                    APPLE
                  </button>
                </div>
              </div>
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
                  <div className="w-14 h-14 bg-[#FF565C] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#FF565C]/25">
                    <Briefcase size={22} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-lg">Your Trusted Home Partner</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Professional services at your doorstep.</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200/60 text-center">
                  <div>
                    <span className="text-2xl font-black text-slate-800 block">50k+</span>
                    <span className="text-[9px] text-slate-450 font-extrabold uppercase tracking-widest mt-1.5 block">Active Users</span>
                  </div>
                  <div className="border-x border-slate-200/60">
                    <span className="text-2xl font-black text-slate-800 block">4.9/5</span>
                    <span className="text-[9px] text-slate-450 font-extrabold uppercase tracking-widest mt-1.5 block">Avg Rating</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-800 block">120+</span>
                    <span className="text-[9px] text-slate-450 font-extrabold uppercase tracking-widest mt-1.5 block leading-normal">Expert Categories</span>
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
