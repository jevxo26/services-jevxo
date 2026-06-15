"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Users, Wrench, Star, ShieldCheck, TrendingUp, BarChart3 } from 'lucide-react';

const stats = [
  { id: 1, label: 'Happy Customers', value: 50000, suffix: '+', display: '50,000+', icon: Users },
  { id: 2, label: 'Services Completed', value: 120000, suffix: '+', display: '120,000+', icon: Wrench },
  { id: 3, label: 'Verified Experts', value: 2500, suffix: '+', display: '2,500+', icon: ShieldCheck },
  { id: 4, label: 'Average Rating', value: 4.8, suffix: '/5', display: '4.8/5', icon: Star, isDecimal: true },
];

function useCountUp(target: number, duration: number = 2000, isDecimal = false, triggered = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!triggered) return;
    let start = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isDecimal
        ? parseFloat((eased * target).toFixed(1))
        : Math.floor(eased * target);
      setCount(current);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [triggered, target, duration, isDecimal]);

  return count;
}

function StatCard({ stat, triggered }: { stat: typeof stats[0]; triggered: boolean }) {
  const count = useCountUp(stat.value, 2200, stat.isDecimal, triggered);

  const formatNumber = (n: number) => {
    if (stat.isDecimal) return n.toFixed(1);
    return n.toLocaleString('en-US');
  };

  return (
    <div className="flex flex-col items-center group">
      <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
        <stat.icon className="w-8 h-8 text-[#FF5A5F]" />
      </div>
      <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tabular-nums">
        {triggered ? `${formatNumber(count)}${stat.suffix}` : '0'}
      </h3>
      <p className="text-slate-500 font-medium text-sm md:text-base">{stat.label}</p>
    </div>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="py-8 md:py-12 mt-15 bg-transparent relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">

        {/* Title */}
        <div className="mb-10 md:mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
            <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-[#FF5A5F]" />
            Our Platform Impact
          </h2>

          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            Providing top-notch home services with trust and excellence
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} triggered={triggered} />
          ))}
        </div>

      </div>
    </div>
  );
}