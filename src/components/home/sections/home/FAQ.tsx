"use client";
import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "How do I book a service on Jevxo Services?",
    answer: "Booking is simple! Just browse our categories, select the service you need, choose a convenient time slot, and confirm your booking. Our professional will arrive at your doorstep."
  },
  {
    question: "Are the service professionals verified?",
    answer: "Yes, absolutely. All our service professionals go through a rigorous background check and skill assessment before they are onboarded to ensure your safety and quality of service."
  },
  {
    question: "What if I am not satisfied with the service?",
    answer: "Customer satisfaction is our top priority. If you're not happy with the service, please reach out to our support team within 24 hours, and we will arrange a rework or provide a refund."
  },
  {
    question: "Are there any hidden charges?",
    answer: "No, we maintain 100% transparency. The price you see during checkout is the final price for the service. Any extra parts or materials needed will be billed separately with your approval."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="pt-5 pb-2 md:py-8 lg:py-10 bg-transparent">
      <div className="w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ type: "spring", stiffness: 85, damping: 16 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start"
        >

          {/* Left — Text */}
          <div className="md:sticky md:top-24 flex flex-col items-center text-center md:items-start md:text-left">
            <span className="inline-flex items-center gap-2 bg-[#1E4E8C]/10 border border-[#1E4E8C]/20 text-[#1E4E8C] px-3.5 py-1.5 rounded-full text-xs font-bold mb-4">
              Got questions?
            </span>
            <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-slate-900 tracking-tight leading-tight mb-4 flex items-center justify-center md:justify-start gap-2">
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-[#1E4E8C]" />
              Frequently Asked <span className="text-[#1E4E8C]">Questions</span>
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8">
              Find answers to the most common questions about our services and booking process.
            </p>

            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#1E4E8C] border border-[#1E4E8C]/25 rounded-full px-5 py-2.5 hover:bg-[#1E4E8C]/5 transition-colors duration-200"
            >
              <MessageCircle className="w-4 h-4" />
              Still need help? Contact us
            </a>
          </div>

          {/* Right — Accordion */}
          <div className="flex flex-col gap-2">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border bg-white overflow-hidden transition-all duration-300 ${isOpen
                    ? 'border-[#1E4E8C]/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <button
                    className="w-full  flex items-center justify-between gap-4 px-5 py-5 text-left focus:outline-none"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium text-slate-900 text-[15px] leading-snug">
                      {faq.question}
                    </span>
                    <div
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-[#1E4E8C]/10 text-[#1E4E8C]' : 'bg-slate-100 text-slate-400'
                        }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-350 ease-in-out ${isOpen ? 'rotate-180' : ''
                          }`}
                      />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-slate-500 text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </motion.div>
      </div>
    </div>
  );
}