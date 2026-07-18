"use client";

import { useState, useEffect, useRef } from "react";
import { useSendOtpMutation, useVerifyOtpMutation, useResendOtpMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { setTokens } from "@/lib/token";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function useLoginState() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams ? searchParams.get("redirect") : null;
  const dispatch = useAppDispatch();

  const [phone, setPhone] = useState("");
  const [remember, setRemember] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [lottieAnimation, setLottieAnimation] = useState<any>(null);

  const [sendOtp, { isLoading }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();

  useEffect(() => {
    fetch("/signup.json")
      .then((res) => { if (!res.ok) throw new Error("Failed to load Lottie"); return res.json(); })
      .then((data) => setLottieAnimation(data))
      .catch((err) => console.error("Error loading Lottie animation:", err));
  }, []);

  useEffect(() => {
    if (!isOtpSent) return;
    if (timeLeft === 0) return;
    const interval = setInterval(() => { setTimeLeft(prev => prev - 1); }, 1000);
    return () => clearInterval(interval);
  }, [isOtpSent, timeLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendOtp({ phone }).unwrap();
      setIsOtpSent(true);
      setTimeLeft(300);
      setOtp(["", "", "", ""]);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to send OTP. Please try again.");
    }
  };

  const handleOtpChange = (val: string, index: number) => {
    if (isNaN(Number(val))) return;
    const nextOtp = [...otp];
    nextOtp[index] = val.slice(-1);
    setOtp(nextOtp);
    if (val !== "" && index < 3) { otpInputsRef.current[index + 1]?.focus(); }
  };

  const handleOtpKeyDown = (key: string, index: number) => {
    if (key === "Backspace" && otp[index] === "" && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) { toast.error("Please enter a valid 4-digit OTP code."); return; }
    try {
      const response = await verifyOtp({ phone, otpCode: enteredOtp }).unwrap();
      const accessToken = response?.data?.accessToken || response?.accessToken || response?.data?.token || response?.token;
      const refreshToken = response?.data?.refreshToken || response?.refreshToken;
      if (accessToken) setTokens(accessToken, refreshToken || "");
      const user = response?.data?.user || response?.user;
      if (user) {
        const userRole = (typeof user.role === "object" && user.role) ? user.role.name : (user.role || "client");
        const roleString = typeof userRole === "string" ? userRole.toLowerCase().replace(/\s+/g, "") : "client";
        dispatch(setUser(user));
        const date = new Date();
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
        document.cookie = `jevxo services_user_role=${roleString}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
        toast.success("Login successful!");
        if (redirectUrl) router.push(redirectUrl);
        else if (roleString === "client") router.push("/dashbord/overview");
        else router.push("/dashbord");
      } else {
        toast.success("Login successful!");
        router.push(redirectUrl || "/dashbord/overview");
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Invalid OTP code.");
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp({ phone }).unwrap();
      setTimeLeft(300);
      setOtp(["", "", "", ""]);
      toast.success("Verification code resent to " + phone);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to resend OTP.");
    }
  };

  return {
    phone, setPhone, remember, setRemember,
    isOtpSent, setIsOtpSent,
    otp, setOtp, timeLeft,
    otpInputsRef, lottieAnimation,
    isLoading, isVerifying,
    handleSubmit, handleOtpChange, handleOtpKeyDown, handleVerifyOtp, handleResendOtp,
  };
}
