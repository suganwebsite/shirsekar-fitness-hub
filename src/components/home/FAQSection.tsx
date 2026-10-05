'use client';

import { ChevronDown, HelpCircle } from 'lucide-react';
import React, { useState } from 'react';
import { FAQItem } from '../../types';

interface FAQSectionProps {
  faqs: FAQItem[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const publishedFaqs = faqs.filter((f) => f.isPublished);
  const [openIds, setOpenIds] = useState<string[]>([publishedFaqs[0]?.id || '']);

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section id="faq" className="py-24 bg-neutral-900/50 border-t border-neutral-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight mb-4">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-sm text-neutral-400">
            Everything you need to know about joining, timings, facilities, and workout routines at Shirsekar's Fitness Hub.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {publishedFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-neutral-950 border border-neutral-800/90 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-base sm:text-lg font-bold uppercase text-white tracking-wide">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-amber-400 text-neutral-950 border-amber-400' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-neutral-300 leading-relaxed border-t border-neutral-900/80 pt-3 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400">
          <span>Have a question not listed here? </span>
          <a
            href="#contact"
            className="text-amber-400 hover:underline font-bold ml-1 inline-flex items-center"
          >
            Contact our reception desk →
          </a>
        </div>
      </div>
    </section>
  );
};
