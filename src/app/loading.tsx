"use client";

import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

export default function Loading(): React.JSX.Element {
  const [animationData, setAnimationData] = useState<Record<
    string,
    unknown
  > | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/loding.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load loading animation");
        return res.json();
      })
      .then((data) => {
        if (active) setAnimationData(data as Record<string, unknown>);
      })
      .catch((err) => console.error("Error loading lottie animation:", err));

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      {/* Background Radial Glows for Premium Aesthetic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[450px] h-[250px] md:h-[450px] bg-[#FF7C71]/8 blur-[80px] md:blur-[110px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Lottie Loading Animation */}
        <div className="w-full max-w-[200px] sm:max-w-[240px] md:max-w-[280px] aspect-square flex items-center justify-center">
          {animationData ? (
            <Lottie
              animationData={animationData}
              loop
              autoplay
              className="w-full h-auto"
            />
          ) : (
            // Premium fallback spinner matching application primary color
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute w-16 h-16 border-4 border-slate-200 border-t-[#FF7C71] rounded-full animate-spin" />
              <div className="w-8 h-8 bg-[#FF7C71]/10 rounded-full animate-ping" />
            </div>
          )}
        </div>

        {/* Loading text with premium pulsing effect */}
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-[#FF7C71] font-bold text-sm tracking-widest uppercase animate-pulse font-sans">
            Please Wait
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-xs font-medium font-sans">
            Preparing your experience...
          </p>
        </div>
      </div>
    </div>
  );
}
