'use client';

import { ExternalLink, Info, Star } from 'lucide-react';
import React from 'react';
import { BusinessSettings, Testimonial } from '../../types';

interface GoogleReviewsSectionProps {
  testimonials: Testimonial[];
  settings: BusinessSettings;
}

export const GoogleReviewsSection: React.FC<GoogleReviewsSectionProps> = ({
  testimonials,
  settings,
}) => {
  const publishedReviews = testimonials.filter((t) => t.isPublished);

  return (
    <section id="reviews" className="py-24 bg-neutral-900/40 border-t border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>Verified Public Feedback</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">
              REAL PEOPLE. REAL EXPERIENCES.
            </h2>
          </div>

          {/* Rating Summary Card */}
          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-4xl font-extrabold text-white tabular-nums">
                  {settings.googleRating}
                </span>
                <div className="flex flex-col">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                    <Star className="w-4 h-4 fill-amber-400/40" />
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    Google Average Rating
                  </span>
                </div>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Based on <strong className="text-white">{settings.googleReviewCount} Google Reviews</strong>
              </p>
            </div>

            <div className="h-10 w-px bg-neutral-800" />

            <a
              href={settings.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-neutral-700 hover:border-amber-400/60 rounded-xl text-xs font-bold uppercase font-heading tracking-wider transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>READ ALL GOOGLE REVIEWS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Authentic Feedback Transparency Callout */}
        <div className="mb-12 p-4 rounded-xl bg-neutral-950/80 border border-neutral-800/90 flex items-start gap-3 text-xs text-neutral-300">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Transparency Notice:</strong> Shirsekar's Fitness Hub values authentic feedback. Members appreciate our motivating atmosphere, helpful floor trainers under Fit Mantras, and affordable membership pricing. In response to member reviews regarding machine maintenance and hygiene, management continuously upgrades equipment and improves facility standards.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {publishedReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800/90 flex flex-col justify-between"
            >
              <div>
                {/* Rating stars & source */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400' : 'text-neutral-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500">
                    {rev.source}
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed mb-4 italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-900 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{rev.name}</h4>
                  <p className="text-[10px] text-neutral-500">{rev.role || 'Verified Member'}</p>
                </div>
                <span className="text-[10px] text-neutral-600">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Reviews CTA Section */}
        <div className="text-center pt-4">
          <a
            href={settings.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-800 text-xs font-heading font-bold uppercase tracking-wider transition-colors"
          >
            <span>VIEW ALL 43 GOOGLE REVIEWS ON GOOGLE MAPS</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </a>
        </div>
      </div>
    </section>
  );
};
