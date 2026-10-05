'use client';

import { Check, Edit2, Layers, X } from 'lucide-react';
import React, { useState } from 'react';
import { Facility } from '../../types';

interface AdminFacilitiesProps {
  facilities: Facility[];
  onUpdateFacility: (id: string, updates: Partial<Facility>) => void;
}

export const AdminFacilities: React.FC<AdminFacilitiesProps> = ({
  facilities,
  onUpdateFacility,
}) => {
  const [editingFac, setEditingFac] = useState<Facility | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [highlightsText, setHighlightsText] = useState('');
  const [image, setImage] = useState('');

  const handleOpenEdit = (fac: Facility) => {
    setEditingFac(fac);
    setTitle(fac.title);
    setCategory(fac.category);
    setDescription(fac.description);
    setHighlightsText(fac.highlights.join('\n'));
    setImage(fac.image);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFac) return;

    const highlights = highlightsText
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    onUpdateFacility(editingFac.id, {
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      highlights,
      image: image.trim(),
    });

    setEditingFac(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold uppercase text-white tracking-wide">
          GYM FACILITIES & EQUIPMENT ZONES
        </h1>
        <p className="text-xs text-neutral-400 mt-0.5">
          Edit descriptions, equipment categories, amenities, and imagery for all training zones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facilities.map((fac) => (
          <div
            key={fac.id}
            className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800">
                  {fac.category}
                </span>
                <button
                  onClick={() => handleOpenEdit(fac)}
                  className="p-1.5 rounded-lg bg-neutral-800 text-amber-400 hover:bg-neutral-700 transition-colors"
                  title="Edit Facility"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-neutral-950 mb-4 border border-neutral-800">
                <img
                  src={fac.image}
                  alt={fac.title}
                  className="w-full h-full object-cover filter brightness-90"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h3 className="font-heading text-lg font-bold uppercase text-white mb-2">
                {fac.title}
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                {fac.description}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-neutral-800/80">
                <span className="text-[10px] font-bold uppercase text-neutral-500 block">
                  Highlighted Features:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {fac.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-neutral-300">
                      <Check className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingFac && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-heading text-lg font-bold uppercase text-white">
                EDIT FACILITY: {editingFac.title}
              </h3>
              <button
                onClick={() => setEditingFac(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 my-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Zone Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Category Tag *
                </label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Zone Image URL or Local Path
                </label>
                <input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Highlights / Amenities (One per line)
                </label>
                <textarea
                  rows={3}
                  value={highlightsText}
                  onChange={(e) => setHighlightsText(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingFac(null)}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase rounded-xl cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
