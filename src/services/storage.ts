import {
  DEFAULT_BUSINESS_SETTINGS,
  DEFAULT_FACILITIES,
  DEFAULT_FAQS,
  DEFAULT_GALLERY,
  DEFAULT_MEMBERSHIP_PLANS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_TRAINING_PROGRAMS,
  INITIAL_SAMPLE_LEADS,
} from '../data/defaultData';
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
} from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'sfh_business_settings',
  LEADS: 'sfh_leads_data',
  MEMBERSHIPS: 'sfh_memberships_data',
  PROGRAMS: 'sfh_programs_data',
  FACILITIES: 'sfh_facilities_data',
  GALLERY: 'sfh_gallery_data',
  TESTIMONIALS: 'sfh_testimonials_data',
  FAQS: 'sfh_faqs_data',
  MESSAGES: 'sfh_contact_messages',
  AUTH: 'sfh_admin_auth',
  ADMIN_PASSWORD: 'sfh_admin_password',
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

export const subscribeToStorageChanges = (callback: Listener): (() => void) => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};

const notifySubscribers = () => {
  listeners.forEach((callback) => {
    try {
      callback();
    } catch (err) {
      console.error('Error notifying storage subscriber:', err);
    }
  });
};

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifySubscribers();
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

// ----------------- Business Settings -----------------
export const getBusinessSettings = (): BusinessSettings => {
  return getFromStorage<BusinessSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_BUSINESS_SETTINGS);
};

export const updateBusinessSettings = (newSettings: Partial<BusinessSettings>): BusinessSettings => {
  const current = getBusinessSettings();
  const updated = { ...current, ...newSettings };
  setToStorage(STORAGE_KEYS.SETTINGS, updated);
  return updated;
};

export const resetBusinessSettingsToDefault = (): BusinessSettings => {
  setToStorage(STORAGE_KEYS.SETTINGS, DEFAULT_BUSINESS_SETTINGS);
  return DEFAULT_BUSINESS_SETTINGS;
};

// ----------------- Leads & Trial Bookings -----------------
export const getLeads = (): Lead[] => {
  return getFromStorage<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_SAMPLE_LEADS);
};

export const createLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Lead => {
  const leads = getLeads();
  const now = new Date().toISOString();
  const newLead: Lead = {
    ...leadData,
    id: 'lead-' + Date.now(),
    createdAt: now,
    updatedAt: now,
  };
  const updated = [newLead, ...leads];
  setToStorage(STORAGE_KEYS.LEADS, updated);
  return newLead;
};

export const updateLeadStatus = (
  id: string,
  status: Lead['status'],
  notes?: string
): Lead | null => {
  const leads = getLeads();
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return null;

  const updatedLead: Lead = {
    ...leads[index],
    status,
    notes: notes !== undefined ? notes : leads[index].notes,
    updatedAt: new Date().toISOString(),
  };

  leads[index] = updatedLead;
  setToStorage(STORAGE_KEYS.LEADS, [...leads]);
  return updatedLead;
};

export const updateLead = (id: string, updates: Partial<Lead>): Lead | null => {
  const leads = getLeads();
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return null;

  const updatedLead: Lead = {
    ...leads[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  leads[index] = updatedLead;
  setToStorage(STORAGE_KEYS.LEADS, [...leads]);
  return updatedLead;
};

export const deleteLead = (id: string): boolean => {
  const leads = getLeads();
  const filtered = leads.filter((l) => l.id !== id);
  if (filtered.length === leads.length) return false;
  setToStorage(STORAGE_KEYS.LEADS, filtered);
  return true;
};

// ----------------- Memberships -----------------
export const getMemberships = (): MembershipPlan[] => {
  return getFromStorage<MembershipPlan[]>(STORAGE_KEYS.MEMBERSHIPS, DEFAULT_MEMBERSHIP_PLANS);
};

export const saveMemberships = (plans: MembershipPlan[]): void => {
  setToStorage(STORAGE_KEYS.MEMBERSHIPS, plans);
};

export const createMembership = (planData: Omit<MembershipPlan, 'id'>): MembershipPlan => {
  const plans = getMemberships();
  const newPlan: MembershipPlan = {
    ...planData,
    id: 'plan-' + Date.now(),
  };
  const updated = [...plans, newPlan];
  setToStorage(STORAGE_KEYS.MEMBERSHIPS, updated);
  return newPlan;
};

export const updateMembership = (id: string, updates: Partial<MembershipPlan>): MembershipPlan | null => {
  const plans = getMemberships();
  const idx = plans.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  plans[idx] = { ...plans[idx], ...updates };
  setToStorage(STORAGE_KEYS.MEMBERSHIPS, [...plans]);
  return plans[idx];
};

export const deleteMembership = (id: string): boolean => {
  const plans = getMemberships();
  const filtered = plans.filter((p) => p.id !== id);
  if (filtered.length === plans.length) return false;
  setToStorage(STORAGE_KEYS.MEMBERSHIPS, filtered);
  return true;
};

// ----------------- Training Programs -----------------
export const getPrograms = (): TrainingProgram[] => {
  return getFromStorage<TrainingProgram[]>(STORAGE_KEYS.PROGRAMS, DEFAULT_TRAINING_PROGRAMS);
};

export const savePrograms = (programs: TrainingProgram[]): void => {
  setToStorage(STORAGE_KEYS.PROGRAMS, programs);
};

export const createProgram = (programData: Omit<TrainingProgram, 'id'>): TrainingProgram => {
  const progs = getPrograms();
  const newProg: TrainingProgram = {
    ...programData,
    id: 'prog-' + Date.now(),
  };
  const updated = [...progs, newProg];
  setToStorage(STORAGE_KEYS.PROGRAMS, updated);
  return newProg;
};

export const updateProgram = (id: string, updates: Partial<TrainingProgram>): TrainingProgram | null => {
  const progs = getPrograms();
  const idx = progs.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  progs[idx] = { ...progs[idx], ...updates };
  setToStorage(STORAGE_KEYS.PROGRAMS, [...progs]);
  return progs[idx];
};

export const deleteProgram = (id: string): boolean => {
  const progs = getPrograms();
  const filtered = progs.filter((p) => p.id !== id);
  if (filtered.length === progs.length) return false;
  setToStorage(STORAGE_KEYS.PROGRAMS, filtered);
  return true;
};

// ----------------- Facilities -----------------
export const getFacilities = (): Facility[] => {
  return getFromStorage<Facility[]>(STORAGE_KEYS.FACILITIES, DEFAULT_FACILITIES);
};

export const saveFacilities = (facilities: Facility[]): void => {
  setToStorage(STORAGE_KEYS.FACILITIES, facilities);
};

export const updateFacility = (id: string, updates: Partial<Facility>): Facility | null => {
  const facs = getFacilities();
  const idx = facs.findIndex((f) => f.id === id);
  if (idx === -1) return null;
  facs[idx] = { ...facs[idx], ...updates };
  setToStorage(STORAGE_KEYS.FACILITIES, [...facs]);
  return facs[idx];
};

export const createFacilityItem = (facilityData: Omit<Facility, 'id'>): Facility => {
  const facs = getFacilities();
  const newFac: Facility = {
    ...facilityData,
    id: 'fac-' + Date.now(),
  };
  const updated = [...facs, newFac];
  setToStorage(STORAGE_KEYS.FACILITIES, updated);
  return newFac;
};

export const deleteFacility = (id: string): boolean => {
  const facs = getFacilities();
  const filtered = facs.filter((f) => f.id !== id);
  if (filtered.length === facs.length) return false;
  setToStorage(STORAGE_KEYS.FACILITIES, filtered);
  return true;
};

// ----------------- Gallery -----------------
export const getGallery = (): GalleryItem[] => {
  return getFromStorage<GalleryItem[]>(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
};

export const createGalleryItem = (itemData: Omit<GalleryItem, 'id'>): GalleryItem => {
  const items = getGallery();
  const newItem: GalleryItem = {
    ...itemData,
    id: 'gal-' + Date.now(),
  };
  const updated = [newItem, ...items];
  setToStorage(STORAGE_KEYS.GALLERY, updated);
  return newItem;
};

export const deleteGalleryItem = (id: string): boolean => {
  const items = getGallery();
  const filtered = items.filter((g) => g.id !== id);
  if (filtered.length === items.length) return false;
  setToStorage(STORAGE_KEYS.GALLERY, filtered);
  return true;
};

// ----------------- Testimonials -----------------
export const getTestimonials = (): Testimonial[] => {
  return getFromStorage<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, DEFAULT_TESTIMONIALS);
};

export const createTestimonial = (data: Omit<Testimonial, 'id'>): Testimonial => {
  const items = getTestimonials();
  const newItem: Testimonial = {
    ...data,
    id: 'test-' + Date.now(),
  };
  const updated = [newItem, ...items];
  setToStorage(STORAGE_KEYS.TESTIMONIALS, updated);
  return newItem;
};

export const updateTestimonial = (id: string, updates: Partial<Testimonial>): Testimonial | null => {
  const items = getTestimonials();
  const idx = items.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...updates };
  setToStorage(STORAGE_KEYS.TESTIMONIALS, [...items]);
  return items[idx];
};

export const deleteTestimonial = (id: string): boolean => {
  const items = getTestimonials();
  const filtered = items.filter((t) => t.id !== id);
  if (filtered.length === items.length) return false;
  setToStorage(STORAGE_KEYS.TESTIMONIALS, filtered);
  return true;
};

// ----------------- FAQs -----------------
export const getFAQs = (): FAQItem[] => {
  return getFromStorage<FAQItem[]>(STORAGE_KEYS.FAQS, DEFAULT_FAQS);
};

export const createFAQ = (data: Omit<FAQItem, 'id'>): FAQItem => {
  const faqs = getFAQs();
  const newItem: FAQItem = {
    ...data,
    id: 'faq-' + Date.now(),
  };
  const updated = [...faqs, newItem];
  setToStorage(STORAGE_KEYS.FAQS, updated);
  return newItem;
};

export const updateFAQ = (id: string, updates: Partial<FAQItem>): FAQItem | null => {
  const faqs = getFAQs();
  const idx = faqs.findIndex((f) => f.id === id);
  if (idx === -1) return null;
  faqs[idx] = { ...faqs[idx], ...updates };
  setToStorage(STORAGE_KEYS.FAQS, [...faqs]);
  return faqs[idx];
};

export const deleteFAQ = (id: string): boolean => {
  const faqs = getFAQs();
  const filtered = faqs.filter((f) => f.id !== id);
  if (filtered.length === faqs.length) return false;
  setToStorage(STORAGE_KEYS.FAQS, filtered);
  return true;
};

// ----------------- Contact Messages -----------------
export const getContactMessages = (): ContactMessage[] => {
  return getFromStorage<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
};

export const createContactMessage = (data: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>): ContactMessage => {
  const msgs = getContactMessages();
  const newMsg: ContactMessage = {
    ...data,
    id: 'msg-' + Date.now(),
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  setToStorage(STORAGE_KEYS.MESSAGES, [newMsg, ...msgs]);
  return newMsg;
};

export const markMessageRead = (id: string): void => {
  const msgs = getContactMessages();
  const updated = msgs.map((m) => (m.id === id ? { ...m, isRead: true } : m));
  setToStorage(STORAGE_KEYS.MESSAGES, updated);
};

export const deleteMessage = (id: string): boolean => {
  const msgs = getContactMessages();
  const filtered = msgs.filter((m) => m.id !== id);
  if (filtered.length === msgs.length) return false;
  setToStorage(STORAGE_KEYS.MESSAGES, filtered);
  return true;
};

// ----------------- Authentication -----------------
const DEFAULT_PASSWORD = 'admin123';

export const getStoredPassword = (): string => {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || DEFAULT_PASSWORD;
};

export const updateAdminPassword = (newPassword: string): void => {
  localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, newPassword);
};

export const getAdminAuth = (): AdminUser | null => {
  return getFromStorage<AdminUser | null>(STORAGE_KEYS.AUTH, null);
};

export const adminLogin = (email: string, pass: string): { success: boolean; error?: string } => {
  const validEmail = 'admin@shirsekarfitness.com';
  const validPass = getStoredPassword();

  if (email.trim().toLowerCase() === validEmail && pass === validPass) {
    const user: AdminUser = {
      id: 'admin-1',
      email: validEmail,
      name: 'Gym Manager',
      role: 'super_admin',
      lastLogin: new Date().toISOString(),
    };
    setToStorage(STORAGE_KEYS.AUTH, user);
    return { success: true };
  }
  return { success: false, error: 'Invalid email or password. Default is admin@shirsekarfitness.com / admin123' };
};

export const adminLogout = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    notifySubscribers();
  } catch (err) {
    console.error('Logout error:', err);
  }
};

// ----------------- Data Backup / Reset -----------------
export const exportAllData = () => {
  return {
    version: '1.0',
    exportDate: new Date().toISOString(),
    settings: getBusinessSettings(),
    leads: getLeads(),
    memberships: getMemberships(),
    programs: getPrograms(),
    facilities: getFacilities(),
    gallery: getGallery(),
    testimonials: getTestimonials(),
    faqs: getFAQs(),
    messages: getContactMessages(),
  };
};

export const resetAllToDefaults = () => {
  setToStorage(STORAGE_KEYS.SETTINGS, DEFAULT_BUSINESS_SETTINGS);
  setToStorage(STORAGE_KEYS.LEADS, INITIAL_SAMPLE_LEADS);
  setToStorage(STORAGE_KEYS.MEMBERSHIPS, DEFAULT_MEMBERSHIP_PLANS);
  setToStorage(STORAGE_KEYS.PROGRAMS, DEFAULT_TRAINING_PROGRAMS);
  setToStorage(STORAGE_KEYS.FACILITIES, DEFAULT_FACILITIES);
  setToStorage(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
  setToStorage(STORAGE_KEYS.TESTIMONIALS, DEFAULT_TESTIMONIALS);
  setToStorage(STORAGE_KEYS.FAQS, DEFAULT_FAQS);
  setToStorage(STORAGE_KEYS.MESSAGES, []);
};
