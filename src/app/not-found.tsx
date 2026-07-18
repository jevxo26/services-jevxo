"use client";

import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import Link from "next/link";
import { Home, ChevronLeft } from "lucide-react";

export default function NotFound(): React.JSX.Element {
    const [animationData, setAnimationData] = useState<Record<
        string,
        unknown
    > | null>(null);

    useEffect(() => {
        let active = true;

        fetch("/Not-Found.json")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load animation");
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
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-16">


            {/* ── Main content ── */}
            <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center gap-6 sm:gap-8">

                {/* Lottie animation / skeleton */}
                <div className="w-full max-w-[300px] sm:max-w-[360px] md:max-w-[420px]">
                    {animationData ? (
                        <Lottie
                            animationData={animationData}
                            loop
                            autoplay
                            className="w-full h-auto"
                        />
                    ) : (
                        <div className="h-64 sm:h-72 md:h-80 w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse" />
                    )}
                </div>

                {/* 404 badge */}
                <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-500 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                    Error 404
                </div>

                {/* Heading + subtext */}
                <div className="flex flex-col gap-3">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-500 leading-tight font-sans">
                        Page Not Found
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-sm mx-auto leading-relaxed font-sans">
                        Looks like this page took a detour. The link might be broken, or the
                        page may have been moved or deleted.
                    </p>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">

                    {/* Go Home */}
                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                       bg-[#1E4E8C] hover:bg-[#123C73] active:scale-95
                       text-white font-semibold text-sm
                       px-7 py-3 rounded-full
                       shadow-md shadow-[#1E4E8C]/30
                       transition-all duration-200 cursor-pointer"
                    >
                        <Home size={16} strokeWidth={2.2} />
                        Go Home
                    </Link>

                    {/* Go Back */}
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                       bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-95
                       text-slate-900 dark:text-slate-100 font-semibold text-sm
                       px-7 py-3 rounded-full
                       border border-slate-200 dark:border-slate-800
                       transition-all duration-200 cursor-pointer"
                    >
                        <ChevronLeft size={16} strokeWidth={2.2} />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
