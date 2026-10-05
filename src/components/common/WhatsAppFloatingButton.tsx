'use client';

import { MessageCircle, Send, X } from 'lucide-react';
import React, { useState } from 'react';
import { BusinessSettings } from '../../types';
import { createWhatsAppLink } from '../../utils/whatsapp';

interface WhatsAppFloatingButtonProps {
  settings: BusinessSettings;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);

  const quickMessages = [
    {
      label: 'Book Free Trial Workout',
      text: "Hi! I'd like to book a free trial workout session at Shirsekar's Fitness Hub in Bandra East.",
    },
    {
      label: 'Membership Fees & Plans',
      text: "Hi, I'm interested in joining Shirsekar's Fitness Hub. Please share your current membership plans and fees.",
    },
    {
      label: 'Personal Training Info',
      text: "Hi, I'd like to enquire about 1-on-1 personal training packages under Fit Mantras.",
    },
  ];

  return (
    <div className="fixed bottom-16 md:bottom-6 right-4 md:right-6 z-30 flex flex-col items-end">
      {/* Popover dialog */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-neutral-900 border border-neutral-700/80 rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Shirsekar's Fitness Hub
              </h4>
              <p className="text-[11px] text-neutral-400">Managed by Fit Mantras · Bandra East</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white p-1 rounded-md"
              aria-label="Close WhatsApp prompt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="my-3 space-y-2">
            <p className="text-xs text-neutral-300">
              Need quick answers or want to book your trial? Choose a prompt below:
            </p>
            {quickMessages.map((msg, index) => (
              <a
                key={index}
                href={createWhatsAppLink(settings.whatsappNumber, msg.text)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full text-left p-2.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-xs text-neutral-200 hover:text-white border border-neutral-700/60 flex items-center justify-between group transition-colors block"
              >
                <span>{msg.label}</span>
                <Send className="w-3 h-3 text-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity ml-2 shrink-0" />
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-800 text-center">
            <a
              href={createWhatsAppLink(settings.whatsappNumber, settings.whatsappDefaultMessage)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Or start a custom chat</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 flex items-center justify-center shadow-lg shadow-emerald-500/25 transition-transform hover:scale-105 active:scale-95 cursor-pointer relative"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp with Shirsekar's Fitness Hub"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-neutral-950"></span>
      </button>
    </div>
  );
};
