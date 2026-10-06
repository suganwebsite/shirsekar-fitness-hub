/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Footer } from './components/common/Footer';
import { MobileStickyBar } from './components/common/MobileStickyBar';
import { Navbar } from './components/common/Navbar';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';
import { AboutSection } from './components/home/AboutSection';
import { FacilitiesSection } from './components/home/FacilitiesSection';
import { FAQSection } from './components/home/FAQSection';
import { FreeTrialLeadForm } from './components/home/FreeTrialLeadForm';
import { GallerySection } from './components/home/GallerySection';
import { GoogleReviewsSection } from './components/home/GoogleReviewsSection';
import { HeroSection } from './components/home/HeroSection';
import { LocationContactSection } from './components/home/LocationContactSection';
import { MembershipModal } from './components/home/MembershipModal';
import { MembershipSection } from './components/home/MembershipSection';
import { TrainingProgramsSection } from './components/home/TrainingProgramsSection';

// Admin Components
import { AdminFacilities } from './components/admin/AdminFacilities';
import { AdminFAQs } from './components/admin/AdminFAQs';
import { AdminGallery } from './components/admin/AdminGallery';
import { AdminLayout, AdminTab } from './components/admin/AdminLayout';
import { AdminLeads } from './components/admin/AdminLeads';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminMemberships } from './components/admin/AdminMemberships';
import { AdminMessages } from './components/admin/AdminMessages';
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminPrograms } from './components/admin/AdminPrograms';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminTestimonials } from './components/admin/AdminTestimonials';

import {
  adminLogout,
  createFacilityItem,
  createFAQ,
  createGalleryItem,
  createLead,
  createMembership,
  createProgram,
  createTestimonial,
  deleteFAQ,
  deleteGalleryItem,
  deleteLead,
  deleteMembership,
  deleteMessage,
  deleteProgram,
  deleteTestimonial,
  getAdminAuth,
  getBusinessSettings,
  getContactMessages,
  getFacilities,
  getFAQs,
  getGallery,
  getLeads,
  getMemberships,
  getPrograms,
  getTestimonials,
  markMessageRead,
  subscribeToStorageChanges,
  updateBusinessSettings,
  updateFacility,
  updateFAQ,
  updateLeadStatus,
  updateMembership,
  updateProgram,
  updateTestimonial,
} from './services/storage';

import { BusinessSettings, Facility, FAQItem, GalleryItem, Lead, MembershipPlan, Testimonial, TrainingProgram } from './types';

export default function App() {
  const [settings, setSettings] = useState<BusinessSettings>(getBusinessSettings);
  const [facilities, setFacilities] = useState<Facility[]>(getFacilities);
  const [programs, setPrograms] = useState<TrainingProgram[]>(getPrograms);
  const [memberships, setMemberships] = useState<MembershipPlan[]>(getMemberships);
  const [gallery, setGallery] = useState<GalleryItem[]>(getGallery);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(getTestimonials);
  const [faqs, setFaqs] = useState<FAQItem[]>(getFAQs);
  const [leads, setLeads] = useState<Lead[]>(getLeads);
  const [messages, setMessages] = useState(getContactMessages);
  const [adminUser, setAdminUser] = useState(getAdminAuth);

  // Navigation & View state
  const [isAdminView, setIsAdminView] = useState(false);
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAdm = window.location.hash.startsWith('#/admin') || window.location.pathname.startsWith('/admin');
      setIsAdminView(isAdm);
      if (isAdm) {
        const parts = window.location.hash.split('/');
        if (parts[2]) {
          setAdminTab(parts[2] as AdminTab);
        }
      }
    }
  }, []);

  // Modals state
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [trialGoal, setTrialGoal] = useState<string>('');
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<MembershipPlan | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Sync state when storage changes
  const reloadData = () => {
    setSettings(getBusinessSettings());
    setFacilities(getFacilities());
    setPrograms(getPrograms());
    setMemberships(getMemberships());
    setGallery(getGallery());
    setTestimonials(getTestimonials());
    setFaqs(getFAQs());
    setLeads(getLeads());
    setMessages(getContactMessages());
    setAdminUser(getAdminAuth());
  };

  useEffect(() => {
    const unsubscribe = subscribeToStorageChanges(reloadData);
    return () => unsubscribe();
  }, []);

  // Sync route hash
  useEffect(() => {
    const handleHash = () => {
      const isAdm = window.location.hash.startsWith('#/admin');
      setIsAdminView(isAdm);
      if (isAdm) {
        const parts = window.location.hash.split('/');
        if (parts[2]) {
          setAdminTab(parts[2] as AdminTab);
        }
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigateAdmin = (tab: AdminTab = 'dashboard') => {
    setAdminTab(tab);
    setIsAdminView(true);
    window.location.hash = `#/admin/${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewWebsite = () => {
    setIsAdminView(false);
    window.location.hash = '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTrialModalWithGoal = (goal: string) => {
    setTrialGoal(goal);
    setIsTrialModalOpen(true);
  };

  const newLeadsCount = leads.filter((l) => l.status === 'new').length;
  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400 selection:text-neutral-950">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-neutral-900 border border-amber-400 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      {isAdminView ? (
        /* ------------------ ADMIN SECTION ------------------ */
        !adminUser ? (
          <AdminLogin
            onLoginSuccess={() => {
              setAdminUser(getAdminAuth());
              showToast('Welcome to Gym Operations Portal');
            }}
            onBackToWebsite={handleViewWebsite}
          />
        ) : (
          <AdminLayout
            currentTab={adminTab}
            onSelectTab={(tab) => {
              setAdminTab(tab);
              window.location.hash = `#/admin/${tab}`;
            }}
            user={adminUser}
            settings={settings}
            onLogout={() => {
              adminLogout();
              setAdminUser(null);
              showToast('Logged out of Admin');
            }}
            onViewWebsite={handleViewWebsite}
            newLeadsCount={newLeadsCount}
            unreadMessagesCount={unreadMessagesCount}
          >
            {adminTab === 'dashboard' && (
              <AdminOverview
                leads={leads}
                memberships={memberships}
                whatsappNumber={settings.whatsappNumber}
                onNavigateTab={(tab) => {
                  setAdminTab(tab);
                  window.location.hash = `#/admin/${tab}`;
                }}
              />
            )}

            {adminTab === 'leads' && (
              <AdminLeads
                leads={leads}
                onUpdateStatus={(id, status, notes) => {
                  updateLeadStatus(id, status, notes);
                  showToast('Lead status updated');
                }}
                onDeleteLead={(id) => {
                  deleteLead(id);
                  showToast('Lead deleted');
                }}
                onCreateLead={(newLead) => {
                  createLead(newLead);
                  showToast('Lead created successfully');
                }}
              />
            )}

            {adminTab === 'trials' && (
              <AdminLeads
                leads={leads}
                onlyTrials={true}
                onUpdateStatus={(id, status, notes) => {
                  updateLeadStatus(id, status, notes);
                  showToast('Trial booking updated');
                }}
                onDeleteLead={(id) => {
                  deleteLead(id);
                  showToast('Trial record deleted');
                }}
                onCreateLead={(newLead) => {
                  createLead(newLead);
                  showToast('Trial record created');
                }}
              />
            )}

            {adminTab === 'memberships' && (
              <AdminMemberships
                plans={memberships}
                onCreatePlan={(plan) => {
                  createMembership(plan);
                  showToast('Membership plan created');
                }}
                onUpdatePlan={(id, updates) => {
                  updateMembership(id, updates);
                  showToast('Membership plan updated');
                }}
                onDeletePlan={(id) => {
                  deleteMembership(id);
                  showToast('Membership plan deleted');
                }}
              />
            )}

            {adminTab === 'programs' && (
              <AdminPrograms
                programs={programs}
                onCreateProgram={(prog) => {
                  createProgram(prog);
                  showToast('Training program created');
                }}
                onUpdateProgram={(id, updates) => {
                  updateProgram(id, updates);
                  showToast('Training program updated');
                }}
                onDeleteProgram={(id) => {
                  deleteProgram(id);
                  showToast('Training program deleted');
                }}
              />
            )}

            {adminTab === 'facilities' && (
              <AdminFacilities
                facilities={facilities}
                onUpdateFacility={(id, updates) => {
                  updateFacility(id, updates);
                  showToast('Facility zone updated');
                }}
              />
            )}

            {adminTab === 'gallery' && (
              <AdminGallery
                galleryItems={gallery}
                onCreateItem={(item) => {
                  createGalleryItem(item);
                  showToast('Photo added to gallery');
                }}
                onDeleteItem={(id) => {
                  deleteGalleryItem(id);
                  showToast('Photo removed');
                }}
              />
            )}

            {adminTab === 'testimonials' && (
              <AdminTestimonials
                testimonials={testimonials}
                onCreateTestimonial={(data) => {
                  createTestimonial(data);
                  showToast('Review added');
                }}
                onUpdateTestimonial={(id, updates) => {
                  updateTestimonial(id, updates);
                  showToast('Review updated');
                }}
                onDeleteTestimonial={(id) => {
                  deleteTestimonial(id);
                  showToast('Review deleted');
                }}
              />
            )}

            {adminTab === 'faqs' && (
              <AdminFAQs
                faqs={faqs}
                onCreateFAQ={(faq) => {
                  createFAQ(faq);
                  showToast('FAQ created');
                }}
                onUpdateFAQ={(id, updates) => {
                  updateFAQ(id, updates);
                  showToast('FAQ updated');
                }}
                onDeleteFAQ={(id) => {
                  deleteFAQ(id);
                  showToast('FAQ deleted');
                }}
              />
            )}

            {adminTab === 'messages' && (
              <AdminMessages
                messages={messages}
                onMarkRead={(id) => markMessageRead(id)}
                onDeleteMessage={(id) => {
                  deleteMessage(id);
                  showToast('Message deleted');
                }}
              />
            )}

            {adminTab === 'settings' && (
              <AdminSettings
                settings={settings}
                onUpdateSettings={(newSettings) => {
                  updateBusinessSettings(newSettings);
                  showToast('Business settings saved');
                }}
                onResetDefaults={() => {
                  reloadData();
                  showToast('Data reset to defaults');
                }}
              />
            )}
          </AdminLayout>
        )
      ) : (
        /* ------------------ PUBLIC WEBSITE ------------------ */
        <>
          <Navbar
            settings={settings}
            onOpenTrialModal={() => setIsTrialModalOpen(true)}
            onNavigateAdmin={() => handleNavigateAdmin('dashboard')}
            isAdmin={Boolean(adminUser)}
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
            onNavigateAdmin={() => handleNavigateAdmin('dashboard')}
            isAdmin={Boolean(adminUser)}
          />

          <MobileStickyBar
            settings={settings}
            onOpenTrialModal={() => setIsTrialModalOpen(true)}
          />

          <WhatsAppFloatingButton settings={settings} />

          {/* Quick Trial Booking Modal Triggered from Nav / Buttons */}
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
        </>
      )}
    </div>
  );
}
