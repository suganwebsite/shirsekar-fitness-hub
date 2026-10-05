'use client';

import { ChevronRight, Dumbbell, Menu, Phone, ShieldCheck, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BusinessSettings } from '../../types';
import { createPhoneLink } from '../../utils/whatsapp';

interface NavbarProps {
  settings: BusinessSettings;
  onOpenTrialModal: () => void;
  onNavigateAdmin: () => void;
  isAdmin: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenTrialModal,
  onNavigateAdmin,
  isAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Training', href: '#training' },
    { name: 'Memberships', href: '#memberships' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Location', href: '#location' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 shadow-xl py-3'
          : 'bg-gradient-to-b from-neutral-950/90 via-neutral-950/60 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="flex items-center gap-2 group text-white tracking-tight focus:outline-none"
            aria-label="Shirsekar's Fitness Hub Home"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-neutral-950 transition-colors">
              <Dumbbell className="w-4 h-4" />
            </div>
            <span className="font-heading text-lg sm:text-xl font-bold uppercase tracking-wider text-white group-hover:text-amber-400 transition-colors whitespace-nowrap">
              {settings.businessName}
            </span>
          </a>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-300">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-amber-400 transition-colors whitespace-nowrap py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-amber-400 after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary actions */}
          <div className="flex items-center gap-3">
            <a
              href={createPhoneLink(settings.phone)}
              className="hidden md:flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-white px-3 py-2 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 transition-colors whitespace-nowrap"
              title="Call Gym Reception"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings.phone}</span>
            </a>

            <button
              onClick={onOpenTrialModal}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-lg transition-all shadow-md shadow-amber-500/10 whitespace-nowrap cursor-pointer"
            >
              BOOK FREE TRIAL
            </button>

            <button
              onClick={onNavigateAdmin}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 rounded-lg border border-neutral-800 hover:bg-neutral-900 transition-colors cursor-pointer"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500/70" />
              <span>{isAdmin ? 'Admin' : 'Login'}</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950 border-b border-neutral-800 px-4 pt-3 pb-6 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3">
            <div className="pb-2 border-b border-neutral-800/80 flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                {settings.marathiName} · Bandra East
              </span>
              <span className="text-xs text-amber-400 font-medium">
                {settings.currentStatusNote}
              </span>
            </div>

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-neutral-200 hover:text-amber-400 flex items-center justify-between py-2 border-b border-neutral-900"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-neutral-600" />
              </a>
            ))}

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={createPhoneLink(settings.phone)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-neutral-800 bg-neutral-900 text-sm font-semibold text-neutral-200"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call {settings.phone}</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTrialModal();
                }}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg text-sm font-bold uppercase tracking-wider"
              >
                Book Free Trial
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateAdmin();
                }}
                className="flex items-center justify-center gap-2 py-2 text-xs text-neutral-400 hover:text-neutral-200"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isAdmin ? 'Go to Admin Dashboard' : 'Admin Staff Login'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
