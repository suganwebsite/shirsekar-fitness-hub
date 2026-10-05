'use client';

import { Check, Dumbbell } from 'lucide-react';
import React, { useState } from 'react';
import { Facility } from '../../types';

interface FacilitiesSectionProps {
  facilities: Facility[];
  onOpenTrialModal: () => void;
}

export const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({
  facilities,
  onOpenTrialModal,
}) => {
  const activeFacilities = facilities.filter((f) => f.isActive);
  const [activeTab, setActiveTab] = useState<string>(activeFacilities[0]?.id || '');

  const selectedFacility =
    activeFacilities.find((f) => f.id === activeTab) || activeFacilities[0];

  return (
    <section id="facilities" className="py-24 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
              <Dumbbell className="w-4 h-4" />
              <span>Training Spaces</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">
              GYM FACILITIES & EQUIPMENT
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-md">
            Purpose-built workout zones designed for strength development, cardiovascular endurance, and guided functional training.
          </p>
        </div>

        {/* Category Tabs (Segmented Button Controls) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {activeFacilities.map((fac) => (
            <button
              key={fac.id}
              onClick={() => setActiveTab(fac.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-heading uppercase font-bold tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                selectedFacility?.id === fac.id
                  ? 'bg-amber-400 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/10'
                  : 'bg-neutral-900/90 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white'
              }`}
            >
              {fac.title}
            </button>
          ))}
        </div>

        {/* Active Facility Spotlight Showcase */}
        {selectedFacility && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-neutral-900/70 border border-neutral-800/80 rounded-3xl p-6 sm:p-8 lg:p-10">
            {/* Visual Frame */}
            <div className="lg:col-span-7 relative rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-950 border border-neutral-800">
              <img
                src={selectedFacility.image}
                alt={selectedFacility.title}
                className="w-full h-full object-cover object-center filter brightness-[0.9]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-neutral-950/80 px-2.5 py-1 rounded border border-neutral-800 inline-block mb-1">
                  {selectedFacility.category}
                </span>
                <p className="text-sm font-semibold text-white">
                  Available to all hub members
                </p>
              </div>
            </div>

            {/* Description & Highlights */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Featured Zone
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-tight mt-1 mb-3">
                  {selectedFacility.title}
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {selectedFacility.description}
                </p>
              </div>

              {/* Highlights List */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Key Zone Amenities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedFacility.highlights.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-neutral-200 bg-neutral-950/80 px-3 py-2 rounded-lg border border-neutral-800/80"
                    >
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center gap-3">
                <button
                  onClick={onOpenTrialModal}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Test This Facility
                </button>
                <a
                  href="#contact"
                  className="text-xs text-neutral-400 hover:text-white font-medium underline underline-offset-4"
                >
                  Ask Reception →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
