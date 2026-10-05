'use client';

import {
  Check,
  CreditCard,
  Edit2,
  Eye,
  EyeOff,
  Plus,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { MembershipPlan } from '../../types';

interface AdminMembershipsProps {
  plans: MembershipPlan[];
  onCreatePlan: (plan: Omit<MembershipPlan, 'id'>) => void;
  onUpdatePlan: (id: string, updates: Partial<MembershipPlan>) => void;
  onDeletePlan: (id: string) => void;
}

export const AdminMemberships: React.FC<AdminMembershipsProps> = ({
  plans,
  onCreatePlan,
  onUpdatePlan,
  onDeletePlan,
}) => {
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [priceDisplay, setPriceDisplay] = useState('');
  const [duration, setDuration] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [discountOffer, setDiscountOffer] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const handleOpenCreate = () => {
    setIsCreating(true);
    setEditingPlan(null);
    setName('');
    setTagline('');
    setPriceDisplay('Plans tailored to your duration');
    setDuration('Monthly / Quarterly');
    setFeaturesText('Access to strength and free weights floor\nAccess to cardio conditioning machines\nLocker room access\nOpen till 10:30 PM');
    setDiscountOffer('');
    setIsFeatured(false);
    setIsActive(true);
  };

  const handleOpenEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setIsCreating(false);
    setName(plan.name);
    setTagline(plan.tagline);
    setPriceDisplay(plan.priceDisplay);
    setDuration(plan.duration);
    setFeaturesText(plan.features.join('\n'));
    setDiscountOffer(plan.discountOffer || '');
    setIsFeatured(plan.isFeatured);
    setIsActive(plan.isActive);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const features = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    if (isCreating) {
      onCreatePlan({
        name: name.trim(),
        tagline: tagline.trim(),
        priceDisplay: priceDisplay.trim(),
        duration: duration.trim(),
        features,
        discountOffer: discountOffer.trim() || undefined,
        isFeatured,
        isActive,
        order: plans.length + 1,
      });
      setIsCreating(false);
    } else if (editingPlan) {
      onUpdatePlan(editingPlan.id, {
        name: name.trim(),
        tagline: tagline.trim(),
        priceDisplay: priceDisplay.trim(),
        duration: duration.trim(),
        features,
        discountOffer: discountOffer.trim() || undefined,
        isFeatured,
        isActive,
      });
      setEditingPlan(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase text-white tracking-wide">
            MEMBERSHIP PACKAGES & PRICING
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure membership tiers, features, durations, and seasonal promotions displayed on the website.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Plan</span>
        </button>
      </div>

      {/* Grid of Membership Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 rounded-2xl bg-neutral-900 border flex flex-col justify-between transition-colors relative ${
              plan.isFeatured
                ? 'border-amber-400/80 shadow-lg shadow-amber-500/5'
                : 'border-neutral-800'
            } ${!plan.isActive ? 'opacity-60' : ''}`}
          >
            {plan.isFeatured && (
              <span className="absolute top-4 right-4 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] uppercase font-bold text-neutral-400">
                  {plan.duration}
                </span>
              </div>

              <h3 className="font-heading text-xl font-bold uppercase text-white mb-1">
                {plan.name}
              </h3>
              <p className="text-xs text-neutral-400 mb-3">{plan.tagline}</p>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 mb-4">
                <span className="font-heading text-base font-bold text-white block">
                  {plan.priceDisplay}
                </span>
                {plan.discountOffer && (
                  <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
                    {plan.discountOffer}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 mb-6">
                <span className="text-[10px] font-bold uppercase text-neutral-500 block">
                  Included Features ({plan.features.length})
                </span>
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              <button
                onClick={() => onUpdatePlan(plan.id, { isActive: !plan.isActive })}
                className={`text-xs flex items-center gap-1 font-medium transition-colors ${
                  plan.isActive ? 'text-neutral-400 hover:text-white' : 'text-amber-400'
                }`}
                title={plan.isActive ? 'Hide on website' : 'Show on website'}
              >
                {plan.isActive ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Hidden</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(plan)}
                  className="p-1.5 rounded-lg bg-neutral-800 text-amber-400 hover:bg-neutral-700"
                  title="Edit Plan"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete membership plan "${plan.name}"?`)) {
                      onDeletePlan(plan.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-neutral-800 text-neutral-500 hover:text-red-400"
                  title="Delete Plan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {(isCreating || editingPlan) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h3 className="font-heading text-lg font-bold uppercase text-white">
                {isCreating ? 'CREATE NEW MEMBERSHIP TIER' : `EDIT: ${editingPlan?.name}`}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingPlan(null);
                }}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 my-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Plan Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Standard 3-Month Plan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Tagline / Subtext
                </label>
                <input
                  type="text"
                  placeholder="e.g. Most popular choice for consistent workouts"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                    Duration Label *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3 Months / Quarterly"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                    Price Text / Guidance *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Value packages with guidance"
                    value={priceDisplay}
                    onChange={(e) => setPriceDisplay(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Promotional Offer / Discount Badge (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Free 1-Week Personal Trainer Trial Included"
                  value={discountOffer}
                  onChange={(e) => setDiscountOffer(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Plan Features (One per line)
                </label>
                <textarea
                  rows={4}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="Access to strength floor&#10;Access to cardio machines&#10;Locker & shower facilities"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-0"
                  />
                  <span>Mark as "Most Popular" (Highlighted)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-0"
                  />
                  <span>Active & Visible on Website</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingPlan(null);
                  }}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase rounded-xl cursor-pointer"
                >
                  {isCreating ? 'Create Plan' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
