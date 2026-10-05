'use client';

import { Edit2, Eye, EyeOff, HelpCircle, Plus, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { FAQItem } from '../../types';

interface AdminFAQsProps {
  faqs: FAQItem[];
  onCreateFAQ: (faq: Omit<FAQItem, 'id'>) => void;
  onUpdateFAQ: (id: string, updates: Partial<FAQItem>) => void;
  onDeleteFAQ: (id: string) => void;
}

export const AdminFAQs: React.FC<AdminFAQsProps> = ({
  faqs,
  onCreateFAQ,
  onUpdateFAQ,
  onDeleteFAQ,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [isPublished, setIsPublished] = useState(true);

  const handleOpenCreate = () => {
    setIsModalOpen(true);
    setEditingFaq(null);
    setQuestion('');
    setAnswer('');
    setCategory('General');
    setIsPublished(true);
  };

  const handleOpenEdit = (faq: FAQItem) => {
    setEditingFaq(faq);
    setIsModalOpen(false);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category);
    setIsPublished(faq.isPublished);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    if (editingFaq) {
      onUpdateFAQ(editingFaq.id, {
        question: question.trim(),
        answer: answer.trim(),
        category: category.trim(),
        isPublished,
      });
      setEditingFaq(null);
    } else {
      onCreateFAQ({
        question: question.trim(),
        answer: answer.trim(),
        category: category.trim(),
        isPublished,
        order: faqs.length + 1,
      });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase text-white tracking-wide">
            FREQUENTLY ASKED QUESTIONS (FAQS)
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage answers about timings, Bandra East location, equipment, personal training, and trial rules.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className={`p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              !faq.isPublished ? 'opacity-60' : ''
            }`}
          >
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-neutral-950 text-amber-400 border border-neutral-800">
                  {faq.category}
                </span>
                <h3 className="font-heading text-base font-bold text-white uppercase">
                  {faq.question}
                </h3>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <button
                onClick={() => onUpdateFAQ(faq.id, { isPublished: !faq.isPublished })}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
                title={faq.isPublished ? 'Hide question' : 'Show question'}
              >
                {faq.isPublished ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-neutral-500" />}
                <span className="hidden sm:inline">{faq.isPublished ? 'Active' : 'Hidden'}</span>
              </button>

              <button
                onClick={() => handleOpenEdit(faq)}
                className="p-1.5 rounded-lg bg-neutral-800 text-amber-400 hover:bg-neutral-700"
                title="Edit FAQ"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  if (confirm(`Delete FAQ: "${faq.question}"?`)) {
                    onDeleteFAQ(faq.id);
                  }
                }}
                className="p-1.5 rounded-lg bg-neutral-800 text-neutral-500 hover:text-red-400"
                title="Delete FAQ"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Modal */}
      {(isModalOpen || editingFaq) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-heading text-lg font-bold uppercase text-white">
                {editingFaq ? 'EDIT FAQ' : 'CREATE NEW FAQ'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingFaq(null);
                }}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 my-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What are your peak gym hours?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Category Tag
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Timings, Membership, Location, Training"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Answer *
                </label>
                <textarea
                  required
                  rows={4}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Comprehensive, helpful answer for members..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded bg-neutral-950 border-neutral-800 text-amber-500"
                />
                <span>Active & Visible in Homepage FAQ Accordion</span>
              </label>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingFaq(null);
                  }}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase rounded-xl cursor-pointer"
                >
                  {editingFaq ? 'Save Changes' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
