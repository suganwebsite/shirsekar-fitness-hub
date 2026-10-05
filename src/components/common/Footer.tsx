'use client';

import {
  Clock,
  Dumbbell,
  ExternalLink,
  Instagram,
  Lock,
  Mail,
  MapPin,
  Phone
} from 'lucide-react';
import React, { useState } from 'react';
import { BusinessSettings } from '../../types';
import { createPhoneLink, createWhatsAppLink } from '../../utils/whatsapp';
import { PolicyModal } from './PolicyModals';

interface FooterProps {
  settings: BusinessSettings;
  onNavigateAdmin: () => void;
  isAdmin: boolean;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigateAdmin, isAdmin }) => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  return (
    <>
      <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-800/80 pt-16 pb-20 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
            {/* Column 1: Brand & Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-white">
                    {settings.businessName}
                  </h3>
                  <p className="text-[11px] text-amber-400 font-medium">
                    {settings.marathiName}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-0.5">
                  Operations & Standards
                </span>
                <p className="text-xs font-semibold text-neutral-200">
                  Managed by <span className="text-amber-400">{settings.managementBy}</span>
                </p>
                <p className="text-[11px] text-neutral-400">
                  {settings.marathiManagement}
                </p>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed">
                Dedicated neighborhood gym in Government Colony, Bandra East, Mumbai. Focused on strength training, body conditioning, and genuine fitness results.
              </p>

              {settings.instagramUrl && (
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="#about" className="hover:text-amber-400 transition-colors">
                    About the Hub
                  </a>
                </li>
                <li>
                  <a href="#facilities" className="hover:text-amber-400 transition-colors">
                    Gym Facilities & Equipment
                  </a>
                </li>
                <li>
                  <a href="#training" className="hover:text-amber-400 transition-colors">
                    Training Programs
                  </a>
                </li>
                <li>
                  <a href="#memberships" className="hover:text-amber-400 transition-colors">
                    Membership Packages
                  </a>
                </li>
                <li>
                  <a href="#gallery" className="hover:text-amber-400 transition-colors">
                    Hub Gallery
                  </a>
                </li>
                <li>
                  <a href="#reviews" className="hover:text-amber-400 transition-colors">
                    Google Reviews (3.9 ★)
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-amber-400 transition-colors">
                    Frequently Asked Questions
                  </a>
                </li>
                <li>
                  <a href="#location" className="hover:text-amber-400 transition-colors">
                    Location & Directions
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Details */}
            <div>
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white mb-4">
                Contact & Location
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white block font-medium">Bandra East Center</span>
                    <p className="text-neutral-400 leading-snug">{settings.address}</p>
                    <a
                      href={settings.googleMapsDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline mt-1"
                    >
                      <span>Get Directions on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <a
                      href={createPhoneLink(settings.phone)}
                      className="text-white font-medium hover:text-amber-400 transition-colors"
                    >
                      {settings.phone}
                    </a>
                    <span className="text-[11px] text-neutral-400 block">
                      Direct Front Desk line
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-white font-medium hover:text-amber-400 transition-colors"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 4: Timings & Trust */}
            <div>
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white mb-4">
                Gym Timings
              </h4>
              <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2.5 text-xs mb-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="flex items-center gap-1.5 text-neutral-300 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mon – Sat</span>
                  </span>
                  <span className="text-white font-bold tabular-nums">6:00 AM – 10:30 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-neutral-300 font-medium">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Sunday</span>
                  </span>
                  <span className="text-neutral-300 font-medium tabular-nums">7:00 AM – 1:00 PM</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{settings.currentStatusNote}</span>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                <a
                  href={createWhatsAppLink(settings.whatsappNumber, settings.whatsappDefaultMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  WhatsApp: +91 77100 39324
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-center sm:text-left">
              <span>© 2026 Shirsekar's Fitness Hub. Managed by Fit Mantras. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-5">
              <button
                onClick={() => setModalType('privacy')}
                className="hover:text-neutral-300 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <span>·</span>
              <button
                onClick={() => setModalType('terms')}
                className="hover:text-neutral-300 transition-colors cursor-pointer"
              >
                Terms & Conditions
              </button>
              <span>·</span>
              <button
                onClick={onNavigateAdmin}
                className="inline-flex items-center gap-1 text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>{isAdmin ? 'Admin Console' : 'Staff Portal'}</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      <PolicyModal
        type={modalType}
        onClose={() => setModalType(null)}
        settings={settings}
      />
    </>
  );
};
