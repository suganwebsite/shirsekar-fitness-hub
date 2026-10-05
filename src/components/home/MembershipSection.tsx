'use client';

import { ArrowRight, Check, CreditCard, Sparkles } from 'lucide-react';
import React from 'react';
import { MembershipPlan } from '../../types';

interface MembershipSectionProps {
  plans: MembershipPlan[];
  onSelectPlan: (plan: MembershipPlan) => void;
  onOpenGeneralEnquiry: () => void;
}

export const MembershipSection: React.FC<MembershipSectionProps> = ({
  plans,
  onSelectPlan,
  onOpenGeneralEnquiry,
}) => {
  const activePlans = plans.filter((p) => p.isActive);

  return (
    <section id="memberships" className="py-24 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
            <CreditCard className="w-4 h-4" />
            <span>Transparent Membership</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight mb-4">
            MEMBERSHIP PLANS TAILORED TO YOUR GOALS
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            Flexible durations, zero hidden charges, and packages designed to support your regular routine in Bandra East.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
          {activePlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.isFeatured
                  ? 'bg-neutral-900 border-2 border-amber-400/80 shadow-2xl shadow-amber-500/10 -translate-y-2'
                  : 'bg-neutral-950 border border-neutral-800/90 hover:border-neutral-700'
              }`}
            >
              {plan.isFeatured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-400 text-neutral-950 text-xs font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Most Popular</span>
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="pb-6 border-b border-neutral-800/80">
                  <h3 className="font-heading text-2xl font-bold uppercase text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-neutral-400 min-h-[32px]">
                    {plan.tagline}
                  </p>
                </div>

                {/* Duration & Pricing Context */}
                <div className="py-6 border-b border-neutral-800/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                    {plan.duration}
                  </span>
                  <div className="font-heading text-xl font-bold text-white tracking-tight">
                    {plan.priceDisplay}
                  </div>
                  {plan.discountOffer && (
                    <p className="text-xs text-emerald-400 font-semibold mt-1">
                      {plan.discountOffer}
                    </p>
                  )}
                </div>

                {/* Features List */}
                <div className="py-6 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                    What's Included:
                  </span>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                        <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-neutral-800/80">
                <button
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    plan.isFeatured
                      ? 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-md'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700/80 hover:border-amber-400/50'
                  }`}
                >
                  <span>ENQUIRE NOW</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Global CTA Banner */}
        <div className="p-8 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-heading text-xl font-bold uppercase text-white mb-1">
              LOOKING FOR STUDENT DISCOUNTS OR CUSTOM QUARTERLY PACKAGES?
            </h3>
            <p className="text-xs text-neutral-400">
              Speak directly with front desk reception at Mahatma Gandhi Vidyamandir to discuss custom schedules.
            </p>
          </div>
          <button
            onClick={onOpenGeneralEnquiry}
            className="px-6 py-3 bg-neutral-950 hover:bg-neutral-800 text-amber-400 border border-amber-500/40 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
          >
            GET MEMBERSHIP DETAILS
          </button>
        </div>
      </div>
    </section>
  );
};
