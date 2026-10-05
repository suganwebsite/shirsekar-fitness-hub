'use client';

import { CheckCircle, Mail, MessageSquare, Phone, Trash2 } from 'lucide-react';
import React from 'react';
import { ContactMessage } from '../../types';
import { createPhoneLink, createWhatsAppLink } from '../../utils/whatsapp';

interface AdminMessagesProps {
  messages: ContactMessage[];
  onMarkRead: (id: string) => void;
  onDeleteMessage: (id: string) => void;
}

export const AdminMessages: React.FC<AdminMessagesProps> = ({
  messages,
  onMarkRead,
  onDeleteMessage,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold uppercase text-white tracking-wide">
          CONTACT DESK MESSAGES
        </h1>
        <p className="text-xs text-neutral-400 mt-0.5">
          General questions and member messages sent through the website contact form.
        </p>
      </div>

      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-5 rounded-2xl bg-neutral-900 border transition-colors ${
              msg.isRead ? 'border-neutral-800' : 'border-amber-500/40 bg-neutral-900/90'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm">{msg.name}</span>
                {!msg.isRead && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-neutral-950 uppercase">
                    Unread
                  </span>
                )}
                {msg.subject && (
                  <span className="text-[10px] text-amber-400 px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800">
                    {msg.subject}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-neutral-500">
                {new Date(msg.createdAt).toLocaleString()}
              </span>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed my-3 bg-neutral-950 p-3 rounded-xl border border-neutral-800/80">
              "{msg.message}"
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-neutral-400 border-t border-neutral-800/60">
              <div className="flex items-center gap-4">
                <span>Phone: <strong className="text-white">{msg.phone}</strong></span>
                {msg.email && (
                  <span>Email: <strong className="text-white">{msg.email}</strong></span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={createWhatsAppLink(
                    msg.phone,
                    `Hi ${msg.name}, this is Shirsekar's Fitness Hub, Bandra East. Regarding your inquiry: `
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onMarkRead(msg.id)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Reply on WhatsApp</span>
                </a>

                <a
                  href={createPhoneLink(msg.phone)}
                  className="p-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
                  title="Call Phone"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>

                {!msg.isRead && (
                  <button
                    onClick={() => onMarkRead(msg.id)}
                    className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
                    title="Mark Read"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                )}

                <button
                  onClick={() => {
                    if (confirm(`Delete message from ${msg.name}?`)) {
                      onDeleteMessage(msg.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-neutral-800 text-neutral-500 hover:text-red-400"
                  title="Delete Message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-16 bg-neutral-900/40 rounded-2xl border border-neutral-800 text-neutral-400 text-xs">
            <Mail className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <p>Your inbox is currently empty. Website inquiries will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
