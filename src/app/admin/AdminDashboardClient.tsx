'use client';

import { logoutAdminAction } from '@/app/actions/auth';
import {
  createFAQAction,
  createGalleryItemAction,
  createMembershipAction,
  createProgramAction,
  createTestimonialAction,
  deleteFAQAction,
  deleteGalleryItemAction,
  deleteMembershipAction,
  deleteMessageAction,
  deleteProgramAction,
  deleteTestimonialAction,
  markMessageReadAction,
  updateFacilityAction,
  updateFAQAction,
  updateMembershipAction,
  updateProgramAction,
  updateSettingsAction,
  updateTestimonialAction,
} from '@/app/actions/cms';
import {
  createManualLeadAction,
  deleteLeadAction,
  updateLeadStatusAction,
} from '@/app/actions/leads';
import { AdminFacilities } from '@/components/admin/AdminFacilities';
import { AdminFAQs } from '@/components/admin/AdminFAQs';
import { AdminGallery } from '@/components/admin/AdminGallery';
import { AdminLayout, AdminTab } from '@/components/admin/AdminLayout';
import { AdminLeads } from '@/components/admin/AdminLeads';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminMemberships } from '@/components/admin/AdminMemberships';
import { AdminMessages } from '@/components/admin/AdminMessages';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { AdminPrograms } from '@/components/admin/AdminPrograms';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { AdminTestimonials } from '@/components/admin/AdminTestimonials';
import {
  AdminUser,
  BusinessSettings,
  ContactMessage,
  Facility,
  FAQItem,
  GalleryItem,
  Lead,
  MembershipPlan,
  Testimonial,
  TrainingProgram,
} from '@/types';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface AdminDashboardClientProps {
  initialUser: AdminUser | null;
  initialSettings: BusinessSettings;
  initialLeads: Lead[];
  initialMemberships: MembershipPlan[];
  initialPrograms: TrainingProgram[];
  initialFacilities: Facility[];
  initialGallery: GalleryItem[];
  initialTestimonials: Testimonial[];
  initialFaqs: FAQItem[];
  initialMessages: ContactMessage[];
}

export const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({
  initialUser,
  initialSettings,
  initialLeads,
  initialMemberships,
  initialPrograms,
  initialFacilities,
  initialGallery,
  initialTestimonials,
  initialFaqs,
  initialMessages,
}) => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(initialUser);
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [memberships, setMemberships] = useState<MembershipPlan[]>(initialMemberships);
  const [programs, setPrograms] = useState<TrainingProgram[]>(initialPrograms);
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFaqs);
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = async () => {
    await logoutAdminAction();
    setCurrentUser(null);
    showToast('Signed out of Admin');
  };

  const newLeadsCount = leads.filter((l) => l.status === 'new').length;
  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  if (!currentUser) {
    return (
      <AdminLogin
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome back, ${user.name}`);
        }}
        onBackToWebsite={() => router.push('/')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-neutral-900 border border-amber-400 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      <AdminLayout
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        user={currentUser}
        settings={settings}
        onLogout={handleLogout}
        onViewWebsite={() => router.push('/')}
        newLeadsCount={newLeadsCount}
        unreadMessagesCount={unreadMessagesCount}
      >
        {currentTab === 'dashboard' && (
          <AdminOverview
            leads={leads}
            memberships={memberships}
            whatsappNumber={settings.whatsappNumber}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'leads' && (
          <AdminLeads
            leads={leads}
            onUpdateStatus={async (id, status, notes) => {
              await updateLeadStatusAction(id, status, notes);
              setLeads((prev) =>
                prev.map((l) => (l.id === id ? { ...l, status, notes } : l))
              );
              showToast('Lead status updated');
            }}
            onDeleteLead={async (id) => {
              await deleteLeadAction(id);
              setLeads((prev) => prev.filter((l) => l.id !== id));
              showToast('Lead removed');
            }}
            onCreateLead={async (newLeadData) => {
              const res = await createManualLeadAction(newLeadData);
              if (res.lead) {
                setLeads((prev) => [res.lead!, ...prev]);
                showToast('Lead created successfully');
              }
            }}
          />
        )}

        {currentTab === 'trials' && (
          <AdminLeads
            leads={leads}
            onlyTrials={true}
            onUpdateStatus={async (id, status, notes) => {
              await updateLeadStatusAction(id, status, notes);
              setLeads((prev) =>
                prev.map((l) => (l.id === id ? { ...l, status, notes } : l))
              );
              showToast('Trial booking updated');
            }}
            onDeleteLead={async (id) => {
              await deleteLeadAction(id);
              setLeads((prev) => prev.filter((l) => l.id !== id));
              showToast('Trial record deleted');
            }}
            onCreateLead={async (newLeadData) => {
              const res = await createManualLeadAction(newLeadData);
              if (res.lead) {
                setLeads((prev) => [res.lead!, ...prev]);
                showToast('Trial booking recorded');
              }
            }}
          />
        )}

        {currentTab === 'memberships' && (
          <AdminMemberships
            plans={memberships}
            onCreatePlan={async (plan) => {
              const res = await createMembershipAction(plan);
              if (res.plan) {
                setMemberships((prev) => [...prev, res.plan!]);
                showToast('Membership plan published');
              }
            }}
            onUpdatePlan={async (id, updates) => {
              await updateMembershipAction(id, updates);
              setMemberships((prev) =>
                prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
              );
              showToast('Membership plan updated');
            }}
            onDeletePlan={async (id) => {
              await deleteMembershipAction(id);
              setMemberships((prev) => prev.filter((p) => p.id !== id));
              showToast('Membership plan deleted');
            }}
          />
        )}

        {currentTab === 'programs' && (
          <AdminPrograms
            programs={programs}
            onCreateProgram={async (prog) => {
              const res = await createProgramAction(prog);
              if (res.program) {
                setPrograms((prev) => [...prev, res.program!]);
                showToast('Program added');
              }
            }}
            onUpdateProgram={async (id, updates) => {
              await updateProgramAction(id, updates);
              setPrograms((prev) =>
                prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
              );
              showToast('Program updated');
            }}
            onDeleteProgram={async (id) => {
              await deleteProgramAction(id);
              setPrograms((prev) => prev.filter((p) => p.id !== id));
              showToast('Program removed');
            }}
          />
        )}

        {currentTab === 'facilities' && (
          <AdminFacilities
            facilities={facilities}
            onUpdateFacility={async (id, updates) => {
              await updateFacilityAction(id, updates);
              setFacilities((prev) =>
                prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
              );
              showToast('Facility updated');
            }}
          />
        )}

        {currentTab === 'gallery' && (
          <AdminGallery
            galleryItems={gallery}
            onCreateItem={async (item) => {
              const res = await createGalleryItemAction(item);
              if (res.item) {
                setGallery((prev) => [res.item!, ...prev]);
                showToast('Photo added to gallery');
              }
            }}
            onDeleteItem={async (id) => {
              await deleteGalleryItemAction(id);
              setGallery((prev) => prev.filter((g) => g.id !== id));
              showToast('Photo deleted');
            }}
          />
        )}

        {currentTab === 'testimonials' && (
          <AdminTestimonials
            testimonials={testimonials}
            onCreateTestimonial={async (data) => {
              const res = await createTestimonialAction(data);
              if (res.testimonial) {
                setTestimonials((prev) => [res.testimonial!, ...prev]);
                showToast('Review added');
              }
            }}
            onUpdateTestimonial={async (id, updates) => {
              await updateTestimonialAction(id, updates);
              setTestimonials((prev) =>
                prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
              );
              showToast('Review updated');
            }}
            onDeleteTestimonial={async (id) => {
              await deleteTestimonialAction(id);
              setTestimonials((prev) => prev.filter((t) => t.id !== id));
              showToast('Review deleted');
            }}
          />
        )}

        {currentTab === 'faqs' && (
          <AdminFAQs
            faqs={faqs}
            onCreateFAQ={async (faq) => {
              const res = await createFAQAction(faq);
              if (res.faq) {
                setFaqs((prev) => [...prev, res.faq!]);
                showToast('FAQ added');
              }
            }}
            onUpdateFAQ={async (id, updates) => {
              await updateFAQAction(id, updates);
              setFaqs((prev) =>
                prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
              );
              showToast('FAQ updated');
            }}
            onDeleteFAQ={async (id) => {
              await deleteFAQAction(id);
              setFaqs((prev) => prev.filter((f) => f.id !== id));
              showToast('FAQ deleted');
            }}
          />
        )}

        {currentTab === 'messages' && (
          <AdminMessages
            messages={messages}
            onMarkRead={async (id) => {
              await markMessageReadAction(id);
              setMessages((prev) =>
                prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
              );
            }}
            onDeleteMessage={async (id) => {
              await deleteMessageAction(id);
              setMessages((prev) => prev.filter((m) => m.id !== id));
              showToast('Message deleted');
            }}
          />
        )}

        {currentTab === 'settings' && (
          <AdminSettings
            settings={settings}
            onUpdateSettings={async (updates) => {
              const res = await updateSettingsAction(updates);
              if (res.settings) {
                setSettings(res.settings);
                showToast('Business settings saved to database');
              }
            }}
            onResetDefaults={() => {
              router.refresh();
              showToast('Refreshed data');
            }}
          />
        )}
      </AdminLayout>
    </div>
  );
};
