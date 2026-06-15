"use client";
import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';

const faqs = [
  {
    question: "How do I book a service on Rajseba?",
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
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-16 md:py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* Left — Text */}
          <div className="md:sticky md:top-24">
            <span className="text-sm font-medium tracking-widest uppercase text-[#FF5A5F] block mb-3">
              Got questions?
            </span>
            <h2 className="text-3xl md:text-4xl text-slate-800 font-semibold leading-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-8">
              Find answers to the most common questions about our services and booking process.
            </p>

            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#FF5A5F] border border-[#FF5A5F]/25 rounded-full px-5 py-2.5 hover:bg-[#FF5A5F]/5 transition-colors duration-200"
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
                    ? 'border-[#FF5A5F]/40 shadow-sm'
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
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-[#FF5A5F]/10 text-[#FF5A5F]' : 'bg-slate-100 text-slate-400'
                        }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-350 ease-in-out ${isOpen ? 'rotate-180' : ''
                          }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`grid transition-all duration-350 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-slate-500 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}