'use client';

import { Calendar, MessageSquare, Phone } from 'lucide-react';
import React from 'react';
import { BusinessSettings } from '../../types';
import { createPhoneLink, createWhatsAppLink } from '../../utils/whatsapp';

interface MobileStickyBarProps {
  settings: BusinessSettings;
  onOpenTrialModal: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({
  settings,
  onOpenTrialModal,
}) => {
  const trialWaMsg = createWhatsAppLink(
    settings.whatsappNumber,
    settings.trialWhatsappMessage
  );

  return (
    <aside
      aria-label="Quick contact actions"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 px-3 py-2 shadow-2xl safe-area-inset-bottom"
      style={{ maxHeight: '12vh' }}
    >
      <div className="grid grid-cols-3 gap-2 items-center">
        {/* Call button */}
        <a
          href={createPhoneLink(settings.phone)}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 active:bg-neutral-800 transition-colors text-center"
        >
          <Phone className="w-4 h-4 text-amber-400 mb-0.5" />
          <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">Call Gym</span>
        </a>

        {/* WhatsApp button */}
        <a
          href={trialWaMsg}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 active:bg-emerald-900/50 transition-colors text-center"
        >
          <MessageSquare className="w-4 h-4 text-emerald-400 mb-0.5" />
          <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">WhatsApp</span>
        </a>

        {/* Free Trial button */}
        <button
          onClick={onOpenTrialModal}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-amber-400 text-neutral-950 font-bold active:bg-amber-300 transition-colors text-center cursor-pointer shadow-sm"
        >
          <Calendar className="w-4 h-4 text-neutral-950 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight uppercase whitespace-nowrap">Free Trial</span>
        </button>
      </div>
    </aside>
  );
};
