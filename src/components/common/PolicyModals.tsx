'use client';

import { Shield, X } from 'lucide-react';
import React from 'react';
import { BusinessSettings } from '../../types';

interface PolicyModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
  settings: BusinessSettings;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose, settings }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wider">
              {type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-neutral-300 leading-relaxed">
          {type === 'privacy' ? (
            <>
              <p>
                <strong>{settings.businessName}</strong> (Managed by {settings.managementBy}) respects your privacy and is committed to protecting the personal information you share with us.
              </p>
              <h4 className="font-bold text-white text-base">1. Information We Collect</h4>
              <p>
                When you book a free trial, request membership details, or contact us through this website, we collect your name, phone number, email address, and fitness goals.
              </p>
              <h4 className="font-bold text-white text-base">2. How We Use Your Information</h4>
              <p>
                We use this information exclusively to coordinate trial bookings, provide membership counseling, schedule orientations, and respond to your inquiries via phone or WhatsApp. We do not sell or rent your personal data to third parties.
              </p>
              <h4 className="font-bold text-white text-base">3. Data Security</h4>
              <p>
                We take administrative and technical precautions to safeguard your contact details.
              </p>
              <h4 className="font-bold text-white text-base">4. Contact Us</h4>
              <p>
                For questions regarding your information, contact our reception at {settings.address} or call {settings.phone}.
              </p>
            </>
          ) : (
            <>
              <p>
                Welcome to <strong>{settings.businessName}</strong>, managed by {settings.managementBy}. By using this website or booking a free trial workout session, you acknowledge and agree to the following terms:
              </p>
              <h4 className="font-bold text-white text-base">1. Free Trial Eligibility</h4>
              <p>
                Free trial sessions are available to first-time prospective members residing or working in Mumbai. A valid government photo ID may be requested at reception prior to entering the training floor.
              </p>
              <h4 className="font-bold text-white text-base">2. Physical Readiness & Safety</h4>
              <p>
                Members and trial guests are responsible for exercising within their safe medical limits. Please inform our gym staff of any pre-existing health conditions or injuries before beginning any physical exercise.
              </p>
              <h4 className="font-bold text-white text-base">3. Gym Etiquette & Facility Rules</h4>
              <p>
                Clean athletic footwear, gym attire, and personal towels are required on the gym floor. Weights, dumbbells, and plates must be safely re-racked after each set.
              </p>
              <h4 className="font-bold text-white text-base">4. Management Discretion</h4>
              <p>
                Membership policies, package durations, and operational hours are governed under Fit Mantras management at Mahatma Gandhi Vidyamandir, Bandra East.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
