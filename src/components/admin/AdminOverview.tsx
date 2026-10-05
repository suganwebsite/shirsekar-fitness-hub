'use client';

import {
  ArrowUpRight,
  CalendarCheck,
  CheckCircle,
  Clock,
  CreditCard,
  Dumbbell,
  MessageSquare,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users
} from 'lucide-react';
import React from 'react';
import { Lead, MembershipPlan } from '../../types';
import { createPhoneLink, createWhatsAppLink } from '../../utils/whatsapp';

interface AdminOverviewProps {
  leads: Lead[];
  memberships: MembershipPlan[];
  whatsappNumber: string;
  onNavigateTab: (tab: any) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  leads,
  memberships,
  whatsappNumber,
  onNavigateTab,
}) => {
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'new').length;
  const followUps = leads.filter((l) => l.status === 'follow-up').length;
  const converted = leads.filter((l) => l.status === 'converted').length;
  const trialBookings = leads.filter((l) => l.source === 'free_trial').length;
  const activePlansCount = memberships.filter((p) => p.isActive).length;

  const conversionRate = totalLeads > 0 ? Math.round((converted / totalLeads) * 100) : 0;

  const metricCards = [
    {
      label: 'TOTAL LEADS',
      value: totalLeads,
      icon: Users,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/20',
      sub: 'All inquiries received',
    },
    {
      label: 'NEW LEADS',
      value: newLeads,
      icon: UserPlus,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/20',
      sub: 'Awaiting first contact',
    },
    {
      label: 'FOLLOW-UPS',
      value: followUps,
      icon: Clock,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      border: 'border-yellow-400/20',
      sub: 'Trial scheduled / In talk',
    },
    {
      label: 'CONVERTED',
      value: converted,
      icon: UserCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'border-emerald-400/20',
      sub: `${conversionRate}% conversion rate`,
    },
    {
      label: 'TRIAL BOOKINGS',
      value: trialBookings,
      icon: CalendarCheck,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
      border: 'border-purple-400/20',
      sub: 'Free trial requests',
    },
    {
      label: 'ACTIVE PLANS',
      value: activePlansCount,
      icon: CreditCard,
      color: 'text-rose-400',
      bg: 'bg-rose-400/10',
      border: 'border-rose-400/20',
      sub: 'Published memberships',
    },
  ];

  const recentLeads = [...leads].slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase text-white tracking-wide">
            OPERATIONS & RECEPTION DASHBOARD
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time inquiry capture, conversion tracking, and membership pipeline for Bandra East.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('leads')}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
          >
            Manage All Leads
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metricCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  {card.label}
                </span>
                <div className={`p-1.5 rounded-lg ${card.bg} ${card.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                  {card.value}
                </span>
                <p className="text-[11px] text-neutral-500 mt-0.5 truncate">
                  {card.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics / Funnel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Conversion Funnel */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-base font-bold uppercase text-white">
                LEAD CONVERSION FUNNEL
              </h3>
              <p className="text-xs text-neutral-400">
                Visitor inquiry pipeline status distribution
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/80">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{conversionRate}% Success</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: 'New Inquiries', count: newLeads, color: 'bg-blue-500' },
              { label: 'Contacted & In Talks', count: leads.filter((l) => l.status === 'contacted').length, color: 'bg-sky-500' },
              { label: 'Follow-ups & Trials', count: followUps, color: 'bg-amber-400' },
              { label: 'Converted to Members', count: converted, color: 'bg-emerald-500' },
              { label: 'Lost / Inactive', count: leads.filter((l) => l.status === 'lost').length, color: 'bg-neutral-600' },
            ].map((step, idx) => {
              const pct = totalLeads > 0 ? Math.round((step.count / totalLeads) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-300 font-medium">{step.label}</span>
                    <span className="text-neutral-400 tabular-nums font-semibold">
                      {step.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-950 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${step.color} transition-all duration-500`}
                      style={{ width: `${Math.max(pct, step.count > 0 ? 5 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Acquisition Source Distribution */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-base font-bold uppercase text-white mb-1">
              INQUIRY SOURCES
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Where new gym prospects are initiating contact
            </p>

            <div className="space-y-3">
              {[
                {
                  source: 'Free Trial Form',
                  count: leads.filter((l) => l.source === 'free_trial').length,
                  pct: totalLeads > 0 ? Math.round((leads.filter((l) => l.source === 'free_trial').length / totalLeads) * 100) : 0,
                  icon: CalendarCheck,
                },
                {
                  source: 'Membership Enquiries',
                  count: leads.filter((l) => l.source === 'membership_enquiry').length,
                  pct: totalLeads > 0 ? Math.round((leads.filter((l) => l.source === 'membership_enquiry').length / totalLeads) * 100) : 0,
                  icon: CreditCard,
                },
                {
                  source: 'Contact Desk Messages',
                  count: leads.filter((l) => l.source === 'contact_form').length,
                  pct: totalLeads > 0 ? Math.round((leads.filter((l) => l.source === 'contact_form').length / totalLeads) * 100) : 0,
                  icon: MessageSquare,
                },
              ].map((src, i) => {
                const Icon = src.icon;
                return (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          {src.source}
                        </span>
                        <span className="text-[10px] text-neutral-500">
                          {src.count} inquiries captured
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400 tabular-nums">
                      {src.pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800">
            <span className="text-[11px] text-neutral-400">
              Tip: Reach out to leads within 15 minutes via WhatsApp for highest conversion rates.
            </span>
          </div>
        </div>
      </div>

      {/* Recent Leads Activity Table */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base font-bold uppercase text-white">
              RECENT PROSPECTS & TRIAL REQUESTS
            </h3>
            <p className="text-xs text-neutral-400">
              Latest submissions received through the website
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('leads')}
            className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>View All ({totalLeads})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Contact</th>
                <th className="py-2.5 px-3">Goal</th>
                <th className="py-2.5 px-3">Preferred Time</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-semibold text-white block">{lead.name}</span>
                    <span className="text-[10px] text-neutral-500 capitalize">{lead.source.replace('_', ' ')}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-neutral-200 tabular-nums">{lead.phone}</span>
                    {lead.email && (
                      <span className="text-[10px] text-neutral-500 block">{lead.email}</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-neutral-300">{lead.goal}</td>
                  <td className="py-3 px-3 text-neutral-400">{lead.preferredTime || 'Flexible'}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        lead.status === 'new'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : lead.status === 'converted'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : lead.status === 'follow-up'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <a
                      href={createWhatsAppLink(
                        lead.phone,
                        `Hi ${lead.name}, this is Shirsekar's Fitness Hub (Fit Mantras), Bandra East. Regarding your inquiry for ${lead.goal}:`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 text-[11px] font-semibold transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
