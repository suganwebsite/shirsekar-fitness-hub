'use client';

import { Edit2, Eye, EyeOff, Plus, Star, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { Testimonial } from '../../types';

interface AdminTestimonialsProps {
  testimonials: Testimonial[];
  onCreateTestimonial: (data: Omit<Testimonial, 'id'>) => void;
  onUpdateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
  onDeleteTestimonial: (id: string) => void;
}

export const AdminTestimonials: React.FC<AdminTestimonialsProps> = ({
  testimonials,
  onCreateTestimonial,
  onUpdateTestimonial,
  onDeleteTestimonial,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [source, setSource] = useState<Testimonial['source']>('Google Review');
  const [isPublished, setIsPublished] = useState(true);

  const handleOpenCreate = () => {
    setIsModalOpen(true);
    setEditingItem(null);
    setName('');
    setRole('Verified Google Reviewer');
    setRating(5);
    setComment('');
    setSource('Google Review');
    setIsPublished(true);
  };

  const handleOpenEdit = (item: Testimonial) => {
    setEditingItem(item);
    setIsModalOpen(false);
    setName(item.name);
    setRole(item.role || '');
    setRating(item.rating);
    setComment(item.comment);
    setSource(item.source);
    setIsPublished(item.isPublished);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    if (editingItem) {
      onUpdateTestimonial(editingItem.id, {
        name: name.trim(),
        role: role.trim() || undefined,
        rating,
        comment: comment.trim(),
        source,
        isPublished,
      });
      setEditingItem(null);
    } else {
      onCreateTestimonial({
        name: name.trim(),
        role: role.trim() || undefined,
        rating,
        comment: comment.trim(),
        source,
        date: 'Verified Review',
        isPublished,
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
            GOOGLE REVIEWS & MEMBER TESTIMONIALS
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage authentic customer feedback from Google Maps and gym members.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Authentic Review</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className={`p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between ${
              !t.isPublished ? 'opacity-60' : ''
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3.5 h-3.5 ${
                        idx < t.rating ? 'fill-amber-400' : 'text-neutral-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase">
                  {t.source}
                </span>
              </div>

              <p className="text-xs text-neutral-300 italic mb-4 leading-relaxed">
                "{t.comment}"
              </p>

              <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800/80">
                <span className="font-bold text-white">{t.name}</span>
                <span>{t.role || 'Member'}</span>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-neutral-800 flex items-center justify-between">
              <button
                onClick={() => onUpdateTestimonial(t.id, { isPublished: !t.isPublished })}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
              >
                {t.isPublished ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-neutral-500" />}
                <span>{t.isPublished ? 'Published' : 'Hidden'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(t)}
                  className="p-1.5 rounded-lg bg-neutral-800 text-amber-400 hover:bg-neutral-700"
                  title="Edit Review"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete review from ${t.name}?`)) {
                      onDeleteTestimonial(t.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-neutral-800 text-neutral-500 hover:text-red-400"
                  title="Delete Review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {(isModalOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-heading text-lg font-bold uppercase text-white">
                {editingItem ? 'EDIT REVIEW' : 'ADD AUTHENTIC REVIEW'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingItem(null);
                }}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 my-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Reviewer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohit S."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Role or Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Regular Member · Bandra East"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                    Rating (Stars)
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                    Source
                  </label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Google Review">Google Review</option>
                    <option value="Member Feedback">Member Direct Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Review Text *
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter the authentic member review text..."
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
                <span>Publish on Website Reviews Section</span>
              </label>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase rounded-xl cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
