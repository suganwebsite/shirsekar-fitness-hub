'use client';

import { ArrowRight, Flame } from 'lucide-react';
import React from 'react';
import { TrainingProgram } from '../../types';

interface TrainingProgramsSectionProps {
  programs: TrainingProgram[];
  onSelectProgram: (programName: string) => void;
}

export const TrainingProgramsSection: React.FC<TrainingProgramsSectionProps> = ({
  programs,
  onSelectProgram,
}) => {
  const activePrograms = programs.filter((p) => p.isActive);

  return (
    <section id="training" className="py-24 bg-neutral-900/50 border-t border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
            <Flame className="w-4 h-4" />
            <span>Targeted Workouts</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight mb-4">
            GOAL-ORIENTED TRAINING PROGRAMS
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            Whether your priority is fat loss, muscle growth, or building lasting strength, we have structured frameworks suitable for every experience level.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activePrograms.map((prog) => (
            <div
              key={prog.id}
              className="group bg-neutral-950 rounded-2xl border border-neutral-800/90 overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all duration-300 shadow-lg hover:shadow-amber-500/5"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                  <img
                    src={prog.image}
                    alt={prog.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
                  
                  {/* Clean unboxed metadata discipline */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-xs text-amber-300 font-semibold drop-shadow">
                    <span>{prog.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span>{prog.duration}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-heading text-xl font-bold uppercase text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {prog.title}
                  </h3>

                  <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                    {prog.description}
                  </p>

                  <div className="pt-3 border-t border-neutral-800/80">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                      Who It's For:
                    </span>
                    <p className="text-xs text-neutral-400 leading-normal">
                      {prog.targetAudience}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => onSelectProgram(prog.title)}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 group-hover:bg-amber-400 text-neutral-200 group-hover:text-neutral-950 font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border border-neutral-800 group-hover:border-amber-400"
                >
                  <span>GET STARTED</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
