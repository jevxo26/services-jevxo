"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRegisterMutation, useVerifyOtpMutation, useResendOtpMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";

export function useSignupState() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams ? searchParams.get("redirect") : null;
  const dispatch = useAppDispatch();

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const [register, { isLoading }] = useRegisterMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();

  useEffect(() => {
    if (!isOtpSent || timeLeft === 0) return;
    const interval = setInterval(() => { setTimeLeft(prev => prev - 1); }, 1000);
    return () => clearInterval(interval);
  }, [isOtpSent, timeLeft]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) { toast.warning("Please agree to the Terms of Use and Privacy Policy."); return; }
    try {
      const response = await register(formData).unwrap();
      setIsOtpSent(true);
      setTimeLeft(300);
      setOtp(["", "", "", ""]);
      if (response.access_token || response.token) {
        const token = response.access_token || response.token;
        if (token) {
          localStorage.setItem("token", token);
          const date = new Date();
          date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
          const expires = "; expires=" + date.toUTCString();
          document.cookie = `token=${token}${expires}; path=/; SameSite=Lax`;
          document.cookie = `jevxo services_access_token=${token}${expires}; path=/; SameSite=Lax`;
        }
        const user = response.user || response;
        dispatch(setUser(user));
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Registration failed. Please try again.");
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
      const response = await verifyOtp({ phone: formData.phone, otpCode: enteredOtp }).unwrap();
      const token = response?.data?.accessToken || response?.accessToken || response?.data?.token || response?.token;
      if (token) {
        localStorage.setItem("token", token);
        const date = new Date();
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
        const expires = "; expires=" + date.toUTCString();
        document.cookie = `token=${token}${expires}; path=/; SameSite=Lax`;
        document.cookie = `jevxo services_access_token=${token}${expires}; path=/; SameSite=Lax`;
      }
      const user = response?.data?.user || response?.user;
      if (user) {
        dispatch(setUser(user));
        const userRole = (typeof user.role === "object" && user.role) ? user.role.name : (user.role || "client");
        const roleString = typeof userRole === "string" ? userRole.toLowerCase().replace(/\s+/g, "") : "client";
        const date = new Date();
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
        document.cookie = `jevxo services_user_role=${roleString}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
        toast.success("Registration successful!");
        if (redirectUrl) router.push(redirectUrl);
        else if (roleString === "client") router.push("/dashbord/overview");
        else router.push("/dashbord");
      } else {
        toast.success("Registration successful!");
        router.push(redirectUrl || "/dashbord/overview");
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Invalid OTP code.");
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp({ phone: formData.phone }).unwrap();
      setTimeLeft(300);
      setOtp(["", "", "", ""]);
      toast.success("Verification code has been resent to " + formData.phone);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to resend OTP.");
    }
  };

  return {
    formData, handleChange, agreeTerms, setAgreeTerms,
    isOtpSent, setIsOtpSent, otp, timeLeft,
    otpInputsRef, isLoading, isVerifying,
    handleSubmit, handleOtpChange, handleOtpKeyDown, handleVerifyOtp, handleResendOtp,
  };
}
