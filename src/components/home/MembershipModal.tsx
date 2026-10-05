'use client';

import { submitMembershipEnquiry } from '@/app/actions/leads';
import { BusinessSettings, Lead, MembershipPlan } from '@/types';
import { createPhoneLink, createWhatsAppLink } from '@/utils/whatsapp';
import { CheckCircle2, Dumbbell, MessageSquare, Phone, X } from 'lucide-react';
import React, { useState } from 'react';

interface MembershipModalProps {
  plan: MembershipPlan | null;
  isOpen: boolean;
  onClose: () => void;
  settings: BusinessSettings;
  onLeadSubmitted?: (lead: Lead) => void;
}

export const MembershipModal: React.FC<MembershipModalProps> = ({
  plan,
  isOpen,
  onClose,
  settings,
  onLeadSubmitted,
}) => {
  if (!isOpen) return null;

  const planName = plan ? plan.name : 'Custom Membership Plan';
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const waText = `Hi Shirsekar's Fitness Hub! I'd like to enquire about the ${planName} (${plan?.duration || 'standard duration'}) at your Bandra East center.`;
  const whatsappUrl = createWhatsAppLink(settings.whatsappNumber, waText);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (cleanPhone.length < 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitMembershipEnquiry({
        name: name.trim(),
        phone: cleanPhone,
        email: email.trim() || undefined,
        planName,
        duration: plan?.duration,
      });

      setIsSubmitting(false);
      if (res.success && res.lead) {
        if (onLeadSubmitted) onLeadSubmitted(res.lead);
        setSubmitted(true);
      } else {
        setError(res.error || 'Failed to submit enquiry.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setError('Failed to submit enquiry. Please use WhatsApp directly.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-2xl font-bold uppercase text-white">
              ENQUIRY SUBMITTED!
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-sm mx-auto">
              Our front desk manager has received your inquiry for <strong>{planName}</strong>. We will get back to you with the current seasonal discounts.
            </p>

            <div className="pt-2 flex flex-col gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat On WhatsApp Instantly</span>
              </a>
              <button
                onClick={onClose}
                className="w-full py-2.5 text-xs text-neutral-400 hover:text-white underline underline-offset-4 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1">
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Membership Details</span>
              </div>
              <h3 className="font-heading text-2xl font-bold uppercase text-white">
                {planName}
              </h3>
              {plan?.duration && (
                <p className="text-xs text-neutral-400 mt-0.5">
                  Duration: {plan.duration} · {plan.priceDisplay}
                </p>
              )}
            </div>

            {error && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-300 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Rane"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98201 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. anand@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
                >
                  {isSubmitting ? 'SUBMITTING...' : 'RECEIVE PLAN & PRICING DETAILS'}
                </button>

                <div className="relative my-3 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-800" />
                  </div>
                  <span className="relative bg-neutral-900 px-3 text-[11px] text-neutral-500 uppercase">
                    or connect directly
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={createPhoneLink(settings.phone)}
                    className="py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
