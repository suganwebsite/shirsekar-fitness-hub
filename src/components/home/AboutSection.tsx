'use client';

import {
  Activity,
  CheckCircle2,
  Clock,
  Compass,
  Dumbbell,
  ShieldCheck,
  Users
} from 'lucide-react';
import React from 'react';
import { BusinessSettings } from '../../types';

interface AboutSectionProps {
  settings: BusinessSettings;
  onOpenTrialModal: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings, onOpenTrialModal }) => {
  const highlights = [
    {
      icon: Dumbbell,
      title: 'Dedicated Strength Zone',
      desc: 'Free weights, dumbbells, Olympic plates, and compound barbell setups built for consistent progressive overload.',
    },
    {
      icon: Compass,
      title: 'Bandra East Hub Location',
      desc: 'Conveniently situated at Mahatma Gandhi Vidyamandir, Government Colony — easy access for residents and BKC professionals.',
    },
    {
      icon: Clock,
      title: 'Late Evening Access Till 10:30 PM',
      desc: 'Extended gym hours from 6:00 AM to 10:30 PM, accommodating both early birds and busy post-work schedules.',
    },
    {
      icon: Users,
      title: 'Supportive Training Atmosphere',
      desc: 'An authentic community gym where members focus on personal progress, proper form, and steady consistency without intimidation.',
    },
    {
      icon: Activity,
      title: 'Cardio & Conditioning Essentials',
      desc: 'Treadmills and cardio stations for active endurance, warm-ups, and fat loss conditioning.',
    },
    {
      icon: ShieldCheck,
      title: 'Managed by Fit Mantras',
      desc: 'Professional operational oversight focused on training discipline, clean guidance, and community value.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-neutral-900/60 border-y border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Story & Philosophy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Why Shirsekar's Fitness Hub?
            </div>

            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight leading-tight">
              A LOCAL FITNESS HUB COMMITTED TO REAL EFFORT & PROGRESS
            </h2>

            <p className="text-base text-neutral-300 leading-relaxed">
              Located at <strong>Mahatma Gandhi Vidyamandir</strong> along JL Shirshekar Marg in Government Colony, <strong>{settings.businessName}</strong> provides Bandra East with a genuine, results-driven workout environment.
            </p>

            <p className="text-sm text-neutral-400 leading-relaxed">
              Whether you are lifting weights for the first time or training for strength and body recomposition, our gym provides the essential tools, supportive energy, and structured floor guidance you need to make workouts a consistent part of your routine.
            </p>

            {/* Management Spotlight Card */}
            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Management Credibility
                </span>
                <h4 className="font-heading text-lg font-bold text-white uppercase">
                  Managed by Fit Mantras ({settings.marathiManagement})
                </h4>
                <p className="text-xs text-neutral-400 leading-normal">
                  Bringing structured training principles, continuous floor assistance, and reliable gym operations to the Bandra East fitness community.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={onOpenTrialModal}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-heading font-bold uppercase text-sm rounded-xl transition-all cursor-pointer shadow-md"
              >
                Experience With a Free Trial
              </button>
              <a
                href="#location"
                className="text-xs font-semibold text-neutral-300 hover:text-white underline underline-offset-4"
              >
                View Map & Directions →
              </a>
            </div>
          </div>

          {/* Right Column: Key Pillars Bento Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800/90 hover:border-neutral-700 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading text-base font-bold text-white uppercase mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
