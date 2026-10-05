'use client';

import { Footer } from '@/components/common/Footer';
import { MobileStickyBar } from '@/components/common/MobileStickyBar';
import { Navbar } from '@/components/common/Navbar';
import { WhatsAppFloatingButton } from '@/components/common/WhatsAppFloatingButton';
import { AboutSection } from '@/components/home/AboutSection';
import { FacilitiesSection } from '@/components/home/FacilitiesSection';
import { FAQSection } from '@/components/home/FAQSection';
import { FreeTrialLeadForm } from '@/components/home/FreeTrialLeadForm';
import { GallerySection } from '@/components/home/GallerySection';
import { GoogleReviewsSection } from '@/components/home/GoogleReviewsSection';
import { HeroSection } from '@/components/home/HeroSection';
import { LocationContactSection } from '@/components/home/LocationContactSection';
import { MembershipModal } from '@/components/home/MembershipModal';
import { MembershipSection } from '@/components/home/MembershipSection';
import { TrainingProgramsSection } from '@/components/home/TrainingProgramsSection';
import {
  BusinessSettings,
  Facility,
  FAQItem,
  GalleryItem,
  MembershipPlan,
  Testimonial,
  TrainingProgram,
} from '@/types';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface HomePageClientProps {
  initialSettings: BusinessSettings;
  initialFacilities: Facility[];
  initialPrograms: TrainingProgram[];
  initialMemberships: MembershipPlan[];
  initialGallery: GalleryItem[];
  initialTestimonials: Testimonial[];
  initialFaqs: FAQItem[];
  isAdmin: boolean;
}

export const HomePageClient: React.FC<HomePageClientProps> = ({
  initialSettings,
  initialFacilities,
  initialPrograms,
  initialMemberships,
  initialGallery,
  initialTestimonials,
  initialFaqs,
  isAdmin,
}) => {
  const router = useRouter();
  const [settings] = useState<BusinessSettings>(initialSettings);
  const [facilities] = useState<Facility[]>(initialFacilities);
  const [programs] = useState<TrainingProgram[]>(initialPrograms);
  const [memberships] = useState<MembershipPlan[]>(initialMemberships);
  const [gallery] = useState<GalleryItem[]>(initialGallery);
  const [testimonials] = useState<Testimonial[]>(initialTestimonials);
  const [faqs] = useState<FAQItem[]>(initialFaqs);

  // Modal states
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [trialGoal, setTrialGoal] = useState<string>('');
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<MembershipPlan | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleNavigateAdmin = () => {
    router.push('/admin');
  };

  const handleOpenTrialModalWithGoal = (goal: string) => {
    setTrialGoal(goal);
    setIsTrialModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400 selection:text-neutral-950">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-neutral-900 border border-amber-400 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        settings={settings}
        onOpenTrialModal={() => setIsTrialModalOpen(true)}
        onNavigateAdmin={handleNavigateAdmin}
        isAdmin={isAdmin}
      />

      <main className="flex-1">
        <HeroSection
          settings={settings}
          onOpenTrialModal={() => setIsTrialModalOpen(true)}
        />

        <AboutSection
          settings={settings}
          onOpenTrialModal={() => setIsTrialModalOpen(true)}
        />

        <FacilitiesSection
          facilities={facilities}
          onOpenTrialModal={() => setIsTrialModalOpen(true)}
        />

        <TrainingProgramsSection
          programs={programs}
          onSelectProgram={(progName) => {
            handleOpenTrialModalWithGoal(progName);
          }}
        />

        <MembershipSection
          plans={memberships}
          onSelectPlan={(plan) => setSelectedPlanForModal(plan)}
          onOpenGeneralEnquiry={() => setSelectedPlanForModal(memberships[0] || null)}
        />

        <FreeTrialLeadForm
          settings={settings}
          prefilledGoal={trialGoal}
          onLeadSubmitted={() => {
            showToast('Trial registered successfully!');
          }}
        />

        <GoogleReviewsSection
          testimonials={testimonials}
          settings={settings}
        />

        <GallerySection galleryItems={gallery} />

        <FAQSection faqs={faqs} />

        <LocationContactSection
          settings={settings}
          onOpenTrialModal={() => setIsTrialModalOpen(true)}
          onMessageSent={() => {
            showToast('Message sent to front desk!');
          }}
        />
      </main>

      <Footer
        settings={settings}
        onNavigateAdmin={handleNavigateAdmin}
        isAdmin={isAdmin}
      />

      <MobileStickyBar
        settings={settings}
        onOpenTrialModal={() => setIsTrialModalOpen(true)}
      />

      <WhatsAppFloatingButton settings={settings} />

      {/* Quick Trial Booking Modal */}
      {isTrialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsTrialModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close trial modal"
            >
              ✕
            </button>
            <FreeTrialLeadForm
              settings={settings}
              prefilledGoal={trialGoal}
              onLeadSubmitted={() => {
                showToast('Trial booking recorded!');
              }}
            />
          </div>
        </div>
      )}

      {/* Membership Enquiry Modal */}
      <MembershipModal
        plan={selectedPlanForModal}
        isOpen={Boolean(selectedPlanForModal)}
        onClose={() => setSelectedPlanForModal(null)}
        settings={settings}
        onLeadSubmitted={() => {
          showToast('Membership enquiry sent!');
        }}
      />
    </div>
  );
};
