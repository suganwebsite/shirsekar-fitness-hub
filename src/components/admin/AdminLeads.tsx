'use client';

import {
  Calendar,
  Check,
  Edit2,
  Filter,
  MessageSquare,
  Phone,
  Plus,
  Search,
  Trash2,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { Lead, LeadSource, LeadStatus } from '../../types';
import { createPhoneLink, createWhatsAppLink } from '../../utils/whatsapp';

interface AdminLeadsProps {
  leads: Lead[];
  onUpdateStatus: (id: string, status: LeadStatus, notes?: string) => void;
  onDeleteLead: (id: string) => void;
  onCreateLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onlyTrials?: boolean;
}

export const AdminLeads: React.FC<AdminLeadsProps> = ({
  leads,
  onUpdateStatus,
  onDeleteLead,
  onCreateLead,
  onlyTrials = false,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>(onlyTrials ? 'free_trial' : 'all');
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [statusInput, setStatusInput] = useState<LeadStatus>('new');
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

  // New Lead manual entry state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newGoal, setNewGoal] = useState('Strength Training');
  const [newSource, setNewSource] = useState<LeadSource>(onlyTrials ? 'free_trial' : 'phone_call');

  const filteredLeads = leads.filter((lead) => {
    if (onlyTrials && lead.source !== 'free_trial') return false;
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
    if (sourceFilter !== 'all' && lead.source !== sourceFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = lead.name.toLowerCase().includes(q);
      const matchPhone = lead.phone.includes(q);
      const matchGoal = lead.goal.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchGoal) return false;
    }
    return true;
  });

  const handleOpenEdit = (lead: Lead) => {
    setEditingLead(lead);
    setNoteInput(lead.notes || '');
    setStatusInput(lead.status);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
    onUpdateStatus(editingLead.id, statusInput, noteInput);
    setEditingLead(null);
  };

  const handleCreateManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    onCreateLead({
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim() || undefined,
      goal: newGoal,
      status: 'new',
      source: newSource,
    });

    setIsNewLeadModalOpen(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase text-white tracking-wide">
            {onlyTrials ? 'FREE TRIAL BOOKINGS' : 'ALL LEADS & INQUIRIES'}
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            {onlyTrials
              ? 'Members who scheduled a complimentary session at Bandra East'
              : 'Complete register of prospective members, trial bookings, and walk-ins'}
          </p>
        </div>

        <button
          onClick={() => setIsNewLeadModalOpen(true)}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lead Manually</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by name, phone, or goal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5" />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:border-amber-400 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="follow-up">Follow-up</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>

          {!onlyTrials && (
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:border-amber-400 focus:outline-none"
            >
              <option value="all">All Sources</option>
              <option value="free_trial">Free Trial</option>
              <option value="membership_enquiry">Membership Enquiry</option>
              <option value="contact_form">Contact Form</option>
              <option value="phone_call">Phone Call</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          )}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-950/80 border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Prospect</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Goal / Program</th>
                <th className="py-3 px-4">Preferred Slot</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-white block text-sm">{lead.name}</span>
                    <span className="text-[10px] text-neutral-500 capitalize">
                      {lead.source.replace('_', ' ')} · {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-neutral-200 tabular-nums block font-medium">
                      {lead.phone}
                    </span>
                    {lead.email && (
                      <span className="text-[10px] text-neutral-500 block truncate max-w-[150px]">
                        {lead.email}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-300">
                    <span className="font-medium">{lead.goal}</span>
                    {lead.message && (
                      <p className="text-[10px] text-neutral-500 line-clamp-1 italic mt-0.5">
                        "{lead.message}"
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-400">
                    {lead.preferredDate && (
                      <span className="text-white block font-medium">
                        {lead.preferredDate}
                      </span>
                    )}
                    <span className="text-[11px] text-neutral-400">
                      {lead.preferredTime || 'Flexible'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase inline-block ${
                        lead.status === 'new'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : lead.status === 'converted'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : lead.status === 'follow-up'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : lead.status === 'contacted'
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-400 max-w-[160px]">
                    <span className="text-[11px] line-clamp-2">
                      {lead.notes || <em className="text-neutral-600">No notes</em>}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* WhatsApp shortcut */}
                      <a
                        href={createWhatsAppLink(
                          lead.phone,
                          `Hi ${lead.name}, this is Shirsekar's Fitness Hub (Fit Mantras), Bandra East. We received your request for ${lead.goal}. Are you available for a quick chat?`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40 transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>

                      {/* Phone call shortcut */}
                      <a
                        href={createPhoneLink(lead.phone)}
                        className="p-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
                        title="Call Phone"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>

                      {/* Edit / Notes */}
                      <button
                        onClick={() => handleOpenEdit(lead)}
                        className="p-1.5 rounded-lg bg-neutral-800 text-amber-400 hover:bg-neutral-700 transition-colors"
                        title="Update Status / Note"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (confirm(`Delete lead record for ${lead.name}?`)) {
                            onDeleteLead(lead.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-neutral-800 text-neutral-500 hover:text-red-400 hover:bg-neutral-700 transition-colors"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12 text-neutral-400 text-xs">
            No leads matching current filters or search query.
          </div>
        )}
      </div>

      {/* Edit Status & Notes Modal */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-heading text-lg font-bold uppercase text-white">
                UPDATE PROSPECT STATUS
              </h3>
              <button
                onClick={() => setEditingLead(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-1 text-xs text-neutral-300">
              <p>
                <strong>Lead:</strong> {editingLead.name} ({editingLead.phone})
              </p>
              <p>
                <strong>Goal:</strong> {editingLead.goal}
              </p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Change Status
                </label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as LeadStatus)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="new">New (Uncontacted)</option>
                  <option value="contacted">Contacted (Spoke / WhatsApp sent)</option>
                  <option value="follow-up">Follow-up (Trial session pending)</option>
                  <option value="converted">Converted (Joined Gym / Paid)</option>
                  <option value="lost">Lost / Not Interested</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Staff Internal Notes
                </label>
                <textarea
                  rows={3}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="e.g. Visited gym on Tuesday, interested in 3-month package..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Lead Entry Modal */}
      {isNewLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-heading text-lg font-bold uppercase text-white">
                ADD NEW PROSPECT / WALK-IN
              </h3>
              <button
                onClick={() => setIsNewLeadModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-4 my-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Prospect Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sanjay Verma"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98200 99999"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. sanjay@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Fitness Goal
                </label>
                <select
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="Strength Training">Strength Training</option>
                  <option value="Weight Loss & Cardio">Weight Loss & Cardio</option>
                  <option value="Muscle Building">Muscle Building</option>
                  <option value="Personal Training">Personal Training</option>
                  <option value="General Fitness">General Fitness</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Source
                </label>
                <select
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value as LeadSource)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="phone_call">Phone Call to Reception</option>
                  <option value="whatsapp">Direct WhatsApp</option>
                  <option value="free_trial">Walk-in Free Trial</option>
                  <option value="membership_enquiry">Walk-in Membership Enquiry</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsNewLeadModalOpen(false)}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase rounded-xl"
                >
                  Create Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
