'use client';

import { submitContactMessage } from '@/app/actions/leads';
import { BusinessSettings } from '@/types';
import { createPhoneLink, createWhatsAppLink } from '@/utils/whatsapp';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  Send,
} from 'lucide-react';
import React, { useState } from 'react';

interface LocationContactSectionProps {
  settings: BusinessSettings;
  onOpenTrialModal: () => void;
  onMessageSent?: (msg: { name: string; phone: string; email?: string; message: string }) => void;
}

export const LocationContactSection: React.FC<LocationContactSectionProps> = ({
  settings,
  onOpenTrialModal,
  onMessageSent,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Membership Enquiry');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await submitContactMessage({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        subject,
        message: message.trim(),
      });

      setIsSubmitting(false);
      if (res.success) {
        setIsSent(true);
        if (onMessageSent) {
          onMessageSent({
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim() || undefined,
            message: message.trim(),
          });
        }
        setName('');
        setPhone('');
        setEmail('');
        setMessage('');
      } else {
        setError(res.error || 'Failed to submit message.');
      }
    } catch {
      setIsSubmitting(false);
      setError('Failed to submit message. Please try WhatsApp directly.');
    }
  };

  const whatsappLink = createWhatsAppLink(
    settings.whatsappNumber,
    settings.whatsappDefaultMessage
  );

  return (
    <section id="location" className="py-24 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
            <MapPin className="w-4 h-4" />
            <span>Visit Us in Bandra East</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight mb-4">
            FIND OUR GYM & GET IN TOUCH
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            Conveniently situated at Mahatma Gandhi Vidyamandir in Government Colony. Drop by during operating hours or connect with our front desk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Left Column: Location & Quick Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Business Card */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {settings.marathiName}
                </span>
                <h3 className="font-heading text-2xl font-bold uppercase text-white mt-1">
                  {settings.businessName}
                </h3>
                <p className="text-xs text-neutral-400">
                  Managed by {settings.managementBy} ({settings.marathiManagement})
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs text-neutral-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Gym Address</span>
                    <p className="text-neutral-400 leading-relaxed">{settings.address}</p>
                    <p className="text-[11px] text-amber-400 mt-0.5">{settings.landmark}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-white block">Phone</span>
                    <a
                      href={createPhoneLink(settings.phone)}
                      className="text-amber-400 hover:underline font-bold text-sm"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-white block">Gym Operating Hours</span>
                    <p className="text-neutral-400">{settings.timingsWeekday}</p>
                    <p className="text-neutral-400">{settings.timingsSunday}</p>
                    <span className="text-[11px] text-emerald-400 font-medium">
                      ● {settings.currentStatusNote}
                    </span>
                  </div>
                </div>
              </div>

              {/* Four Primary Conversion Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-neutral-800">
                <a
                  href={createPhoneLink(settings.phone)}
                  className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-neutral-700"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>CALL NOW</span>
                </a>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WHATSAPP</span>
                </a>

                <a
                  href={settings.googleMapsDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-neutral-700"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-400" />
                  <span>GET DIRECTIONS</span>
                </a>

                <button
                  onClick={onOpenTrialModal}
                  className="py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>BOOK TRIAL</span>
                </button>
              </div>
            </div>

            {/* Direct Directions Note */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 flex items-center justify-between">
              <span>Looking for landmark help near Government Colony?</span>
              <a
                href={settings.googleMapsDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline font-semibold flex items-center gap-1 shrink-0 ml-2"
              >
                <span>Open in Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Right Column: Embedded Map & Contact Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Embedded Map Frame */}
            <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 aspect-[16/9] relative shadow-lg">
              <iframe
                title="Shirsekar's Fitness Hub Location Map"
                src={settings.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(85%) contrast(110%)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute top-3 left-3 bg-neutral-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-800 text-[11px] text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Bandra East · Government Colony</span>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800">
              <h3 className="font-heading text-lg font-bold uppercase text-white mb-1">
                SEND AN INQUIRY DIRECTLY TO RECEPTION
              </h3>
              <p className="text-xs text-neutral-400 mb-4">
                Have a specific question about facilities, timings, or personal training? Leave a message and our staff will respond.
              </p>

              {error && (
                <div className="p-3 mb-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs">
                  {error}
                </div>
              )}

              {isSent ? (
                <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Thank you! Your message has been sent to our gym desk. We will call or WhatsApp you back shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Your Name *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone / Mobile Number *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="email"
                      placeholder="Email (Optional)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                    />
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="Membership Enquiry">Membership Enquiry</option>
                      <option value="Personal Training Details">Personal Training Details</option>
                      <option value="Timing / Batch Query">Timing / Batch Query</option>
                      <option value="Equipment Query">Equipment Query</option>
                    </select>
                  </div>

                  <textarea
                    required
                    rows={2}
                    placeholder="Your message or questions... *"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none resize-none"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 hover:text-amber-300 border border-neutral-700 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'SENDING...' : 'SUBMIT INQUIRY'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
