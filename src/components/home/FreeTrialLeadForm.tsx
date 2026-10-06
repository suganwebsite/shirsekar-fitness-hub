'use client';

import { createLead } from '../../services/storage';
import { BusinessSettings, Lead } from '../../types';
import { createPhoneLink, createWhatsAppLink } from '../../utils/whatsapp';
import {
  Calendar,
  CheckCircle,
  Clock,
  Dumbbell,
  MessageSquare,
  Phone,
  Send,
  User,
} from 'lucide-react';
import React, { useState } from 'react';

interface FreeTrialLeadFormProps {
  settings: BusinessSettings;
  prefilledGoal?: string;
  onLeadSubmitted?: (lead: Lead) => void;
}

export const FreeTrialLeadForm: React.FC<FreeTrialLeadFormProps> = ({
  settings,
  prefilledGoal = '',
  onLeadSubmitted,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [goal, setGoal] = useState(prefilledGoal || 'Strength Training');
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('Evening (6:00 PM – 8:00 PM)');
  const [message, setMessage] = useState('');
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newLead = createLead({
        name: name.trim(),
        phone: cleanPhone,
        email: email.trim() || undefined,
        goal,
        preferredDate: visitDate || undefined,
        preferredTime: visitTime,
        message: message.trim() || undefined,
        status: 'new',
        source: 'free_trial',
      });

      setIsSubmitting(false);
      setSubmittedLead(newLead);
      if (onLeadSubmitted) onLeadSubmitted(newLead);
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Failed to submit booking. Please try WhatsApp directly.');
    }
  };

  const handleReset = () => {
    setSubmittedLead(null);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
  };

  return (
    <section id="free-trial" className="py-24 bg-neutral-950 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-sm">
          {submittedLead ? (
            /* Success Confirmation State */
            <div className="text-center py-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                  Trial Booking Confirmed
                </span>
                <h3 className="font-heading text-3xl font-extrabold uppercase text-white mb-2">
                  THANK YOU, {submittedLead.name.split(' ')[0]}!
                </h3>
                <p className="text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
                  Your free trial has been recorded in our reception register. Our team under Fit Mantras will welcome you at <strong>Mahatma Gandhi Vidyamandir, Bandra East</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 max-w-md mx-auto text-left text-xs space-y-1.5 text-neutral-300">
                <p>
                  <strong>Goal:</strong> {submittedLead.goal}
                </p>
                {submittedLead.preferredDate && (
                  <p>
                    <strong>Date:</strong> {submittedLead.preferredDate}
                  </p>
                )}
                <p>
                  <strong>Preferred Time:</strong> {submittedLead.preferredTime}
                </p>
                <p>
                  <strong>Registered Phone:</strong> {submittedLead.phone}
                </p>
              </div>

              {/* Action Buttons for Next Steps */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={createWhatsAppLink(
                    settings.whatsappNumber,
                    `Hi Shirsekar's Fitness Hub! I just booked a free trial for ${submittedLead.name} (${submittedLead.goal}). Preferred time: ${submittedLead.preferredTime}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Confirm On WhatsApp</span>
                </a>

                <a
                  href={createPhoneLink(settings.phone)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-neutral-700"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Call Reception</span>
                </a>
              </div>

              <div>
                <button
                  onClick={handleReset}
                  className="text-xs text-neutral-400 hover:text-white underline underline-offset-4 cursor-pointer"
                >
                  Book another session / Reset form
                </button>
              </div>
            </div>
          ) : (
            /* Lead Generation Form */
            <div>
              <div className="text-center max-w-xl mx-auto mb-10">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
                  <Dumbbell className="w-4 h-4" />
                  <span>Complimentary Session</span>
                </div>
                <h2 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight mb-3">
                  READY TO START?
                </h2>
                <p className="text-sm text-neutral-400">
                  Book your complimentary free trial workout at Shirsekar's Fitness Hub in Bandra East. Experience our floor, equipment, and training atmosphere with zero obligation.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-xs text-red-300 text-center">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Your Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                      />
                      <User className="w-4 h-4 text-neutral-500 absolute right-3.5 top-3.5" />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Phone Number (Mobile) *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 98200 12345"
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                      />
                      <Phone className="w-4 h-4 text-neutral-500 absolute right-3.5 top-3.5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Fitness Goal */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Primary Fitness Goal
                    </label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                    >
                      <option value="Strength Training">Strength & Free Weights Training</option>
                      <option value="Weight Loss & Conditioning">Weight Loss & Conditioning</option>
                      <option value="Muscle Building">Muscle Building & Hypertrophy</option>
                      <option value="Beginner Gym Orientation">Beginner Gym Orientation</option>
                      <option value="1-on-1 Personal Training">1-on-1 Personal Training</option>
                      <option value="General Fitness">General Fitness & Wellness</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Preferred Date */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Preferred Visit Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      />
                      <Calendar className="w-4 h-4 text-neutral-500 absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Preferred Time Slot */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Preferred Time Window
                    </label>
                    <div className="relative">
                      <select
                        value={visitTime}
                        onChange={(e) => setVisitTime(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      >
                        <option value="Early Morning (6:00 AM – 8:00 AM)">Early Morning (6:00 AM – 8:00 AM)</option>
                        <option value="Mid Morning (8:00 AM – 11:00 AM)">Mid Morning (8:00 AM – 11:00 AM)</option>
                        <option value="Afternoon (12:00 PM – 4:00 PM)">Afternoon (12:00 PM – 4:00 PM)</option>
                        <option value="Evening (5:00 PM – 7:30 PM)">Evening (5:00 PM – 7:30 PM)</option>
                        <option value="Late Evening (7:30 PM – 10:00 PM)">Late Evening (7:30 PM – 10:00 PM)</option>
                      </select>
                      <Clock className="w-4 h-4 text-neutral-500 absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Message / Special Notes */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Any Questions or Medical Considerations (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. First time in gym, recovering from shoulder strain, or inquiring about evening batches."
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-heading font-extrabold text-base uppercase tracking-wider rounded-xl transition-all active:scale-[0.99] cursor-pointer shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'RECORDING BOOKING...' : 'BOOK MY FREE TRIAL'}</span>
                  </button>
                  <p className="text-center text-[11px] text-neutral-500 mt-2.5">
                    No spam. Your details are solely used to coordinate your session at Bandra East.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
