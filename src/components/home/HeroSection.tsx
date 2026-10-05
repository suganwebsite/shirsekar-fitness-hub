'use client';

import {
  ArrowRight,
  Clock,
  Dumbbell,
  MapPin,
  MessageSquare,
  Shield,
  Star
} from 'lucide-react';
import React from 'react';
import { BusinessSettings } from '../../types';
import { createWhatsAppLink } from '../../utils/whatsapp';

interface HeroSectionProps {
  settings: BusinessSettings;
  onOpenTrialModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings, onOpenTrialModal }) => {
  const whatsappUrl = createWhatsAppLink(
    settings.whatsappNumber,
    settings.trialWhatsappMessage
  );

  return (
    <section className="relative min-h-[92vh] flex items-center pt-24 pb-16 overflow-hidden bg-neutral-950">
      {/* Background Hero Image with Measured High-Contrast Scrim */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={settings.heroImageUrl}
          alt="Shirsekar's Fitness Hub gym floor in Bandra East"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.1] scale-105 animate-in fade-in duration-1000"
          referrerPolicy="no-referrer"
        />
        {/* Subtle dark athletic gradient scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          {/* Subtitle / Management badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-700/80 mb-6 backdrop-blur-sm shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-xs font-semibold text-neutral-200 uppercase tracking-wider">
              {settings.marathiName} · Managed by {settings.managementBy}
            </span>
          </div>

          {/* Marquee Headline */}
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white leading-none mb-6">
            {settings.heroHeading}
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-xl text-neutral-300 font-normal leading-relaxed mb-8 max-w-2xl text-balance">
            {settings.heroDescription}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
            <button
              onClick={onOpenTrialModal}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-heading text-base font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-lg shadow-amber-400/20 flex items-center gap-2 group cursor-pointer"
            >
              <span>{settings.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 bg-neutral-900/90 hover:bg-neutral-800 text-emerald-400 hover:text-emerald-300 border border-emerald-500/40 rounded-xl font-heading text-base font-bold uppercase tracking-wider transition-all flex items-center gap-2 active:scale-95 shadow-sm"
            >
              <MessageSquare className="w-4 h-4 fill-emerald-400/20" />
              <span>{settings.secondaryCtaText}</span>
            </a>

            <a
              href="#memberships"
              className="px-4 py-3.5 text-neutral-300 hover:text-white text-sm font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>VIEW MEMBERSHIPS</span>
              <span className="text-neutral-500">→</span>
            </a>
          </div>

          {/* Trust Indicators Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-neutral-800/80">
            {/* Google Rating */}
            <a
              href={settings.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-amber-500/40 transition-colors group block"
            >
              <div className="flex items-center gap-1 text-amber-400 mb-1">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-heading text-lg font-bold text-white tabular-nums">
                  {settings.googleRating}
                </span>
                <span className="text-xs text-neutral-400">/ 5</span>
              </div>
              <p className="text-[11px] text-neutral-400 group-hover:text-amber-300 transition-colors">
                {settings.googleReviewCount}+ Google Reviews
              </p>
            </a>

            {/* Location Indicator */}
            <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
              <div className="flex items-center gap-1.5 text-neutral-200 mb-1">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-heading text-sm font-bold text-white truncate">
                  Bandra East
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 truncate">
                Government Colony, Mumbai
              </p>
            </div>

            {/* Operating Hours */}
            <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
              <div className="flex items-center gap-1.5 text-neutral-200 mb-1">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-heading text-sm font-bold text-white">
                  Open Today
                </span>
              </div>
              <p className="text-[11px] text-emerald-400/90 font-medium truncate">
                {settings.currentStatusNote}
              </p>
            </div>

            {/* Supervision & Management */}
            <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
              <div className="flex items-center gap-1.5 text-neutral-200 mb-1">
                <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-heading text-sm font-bold text-white truncate">
                  Fit Mantras
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 truncate">
                Professional Guidance
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
