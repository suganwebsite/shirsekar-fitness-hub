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
import { isDatabaseConfigured, prisma } from './prisma';

const memoryStore = {
  settings: { ...DEFAULT_BUSINESS_SETTINGS },
  leads: [...INITIAL_SAMPLE_LEADS],
  memberships: [...DEFAULT_MEMBERSHIP_PLANS],
  programs: [...DEFAULT_TRAINING_PROGRAMS],
  facilities: [...DEFAULT_FACILITIES],
  gallery: [...DEFAULT_GALLERY],
  testimonials: [...DEFAULT_TESTIMONIALS],
  faqs: [...DEFAULT_FAQS],
  messages: [] as ContactMessage[],
};

let hasSeeded = false;

async function seedPostgreSQL() {
  if (hasSeeded || !isDatabaseConfigured()) return;
  try {
    const existing = await prisma.businessSetting.findUnique({ where: { id: 'default' } });
    if (!existing) {
      console.log('Seeding initial gym business data into PostgreSQL...');
      await prisma.businessSetting.create({
        data: {
          id: 'default',
          ...DEFAULT_BUSINESS_SETTINGS,
        },
      });

      for (const fac of DEFAULT_FACILITIES) {
        await prisma.facility.upsert({
          where: { id: fac.id },
          update: {},
          create: fac,
        });
      }

      for (const prog of DEFAULT_TRAINING_PROGRAMS) {
        await prisma.trainingProgram.upsert({
          where: { id: prog.id },
          update: {},
          create: prog,
        });
      }

      for (const plan of DEFAULT_MEMBERSHIP_PLANS) {
        await prisma.membershipPlan.upsert({
          where: { id: plan.id },
          update: {},
          create: plan,
        });
      }

      for (const gal of DEFAULT_GALLERY) {
        await prisma.galleryItem.upsert({
          where: { id: gal.id },
          update: {},
          create: gal,
        });
      }

      for (const test of DEFAULT_TESTIMONIALS) {
        await prisma.testimonial.upsert({
          where: { id: test.id },
          update: {},
          create: test,
        });
      }

      for (const faq of DEFAULT_FAQS) {
        await prisma.faqItem.upsert({
          where: { id: faq.id },
          update: {},
          create: faq,
        });
      }

      for (const lead of INITIAL_SAMPLE_LEADS) {
        await prisma.lead.upsert({
          where: { id: lead.id },
          update: {},
          create: {
            ...lead,
            createdAt: new Date(lead.createdAt),
            updatedAt: new Date(lead.updatedAt),
          },
        });
      }
      console.log('Seeding complete.');
    }
    hasSeeded = true;
  } catch (err) {
    console.error('Database seed error:', err);
  }
}

export async function getBusinessSettings(): Promise<BusinessSettings> {
  if (!isDatabaseConfigured()) return memoryStore.settings;
  try {
    await seedPostgreSQL();
    const dbSettings = await prisma.businessSetting.findUnique({ where: { id: 'default' } });
    if (dbSettings) {
      return {
        ...DEFAULT_BUSINESS_SETTINGS,
        ...dbSettings,
      } as BusinessSettings;
    }
  } catch (err) {
    console.error('Error fetching settings from DB:', err);
  }
  return memoryStore.settings;
}

export async function updateBusinessSettings(updates: Partial<BusinessSettings>): Promise<BusinessSettings> {
  if (!isDatabaseConfigured()) {
    memoryStore.settings = { ...memoryStore.settings, ...updates };
    return memoryStore.settings;
  }
  try {
    const updated = await prisma.businessSetting.upsert({
      where: { id: 'default' },
      update: updates,
      create: {
        id: 'default',
        ...DEFAULT_BUSINESS_SETTINGS,
        ...updates,
      },
    });
    return { ...DEFAULT_BUSINESS_SETTINGS, ...updated } as BusinessSettings;
  } catch (err) {
    console.error('Error updating settings in DB:', err);
    memoryStore.settings = { ...memoryStore.settings, ...updates };
    return memoryStore.settings;
  }
}

export async function getLeads(): Promise<Lead[]> {
  if (!isDatabaseConfigured()) return memoryStore.leads;
  try {
    await seedPostgreSQL();
    const dbLeads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return dbLeads.map((l: any) => ({
      ...l,
      email: l.email || undefined,
      preferredDate: l.preferredDate || undefined,
      preferredTime: l.preferredTime || undefined,
      message: l.message || undefined,
      notes: l.notes || undefined,
      status: l.status as Lead['status'],
      source: l.source as Lead['source'],
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
    }));
  } catch (err) {
    console.error('Error fetching leads from DB:', err);
    return memoryStore.leads;
  }
}

export async function createLead(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
  const now = new Date().toISOString();
  const fallbackLead: Lead = {
    ...data,
    id: 'lead-' + Date.now(),
    createdAt: now,
    updatedAt: now,
  };

  if (!isDatabaseConfigured()) {
    memoryStore.leads = [fallbackLead, ...memoryStore.leads];
    return fallbackLead;
  }

  try {
    const created = await prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        goal: data.goal,
        preferredDate: data.preferredDate || null,
        preferredTime: data.preferredTime || null,
        message: data.message || null,
        status: data.status || 'new',
        source: data.source || 'free_trial',
        notes: data.notes || null,
      },
    });
    return {
      ...created,
      email: created.email || undefined,
      preferredDate: created.preferredDate || undefined,
      preferredTime: created.preferredTime || undefined,
      message: created.message || undefined,
      notes: created.notes || undefined,
      status: created.status as Lead['status'],
      source: created.source as Lead['source'],
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  } catch (err) {
    console.error('Error creating lead in DB:', err);
    memoryStore.leads = [fallbackLead, ...memoryStore.leads];
    return fallbackLead;
  }
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<Lead | null> {
  if (!isDatabaseConfigured()) {
    const idx = memoryStore.leads.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    memoryStore.leads[idx] = { ...memoryStore.leads[idx], ...updates, updatedAt: new Date().toISOString() };
    return memoryStore.leads[idx];
  }

  try {
    const updated = await prisma.lead.update({
      where: { id },
      data: {
        status: updates.status,
        notes: updates.notes,
        name: updates.name,
        phone: updates.phone,
        email: updates.email,
        goal: updates.goal,
      },
    });
    return {
      ...updated,
      email: updated.email || undefined,
      preferredDate: updated.preferredDate || undefined,
      preferredTime: updated.preferredTime || undefined,
      message: updated.message || undefined,
      notes: updated.notes || undefined,
      status: updated.status as Lead['status'],
      source: updated.source as Lead['source'],
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  } catch (err) {
    console.error('Error updating lead in DB:', err);
    return null;
  }
}

export async function updateLeadStatus(id: string, status: Lead['status'], notes?: string): Promise<boolean> {
  const result = await updateLead(id, { status, notes });
  return Boolean(result);
}

export async function deleteLead(id: string): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    memoryStore.leads = memoryStore.leads.filter((l) => l.id !== id);
    return true;
  }
  try {
    await prisma.lead.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function getMemberships(): Promise<MembershipPlan[]> {
  if (!isDatabaseConfigured()) return memoryStore.memberships;
  try {
    await seedPostgreSQL();
    const plans = await prisma.membershipPlan.findMany({ orderBy: { order: 'asc' } });
    if (!plans || plans.length === 0) return DEFAULT_MEMBERSHIP_PLANS;
    return plans.map((p: any) => ({
      ...p,
      discountOffer: p.discountOffer || undefined,
    }));
  } catch (err) {
    console.error('Error fetching memberships from DB:', err);
    return DEFAULT_MEMBERSHIP_PLANS;
  }
}

export async function createMembership(data: Omit<MembershipPlan, 'id'>): Promise<MembershipPlan> {
  if (!isDatabaseConfigured()) {
    const newPlan = { ...data, id: 'plan-' + Date.now() };
    memoryStore.memberships.push(newPlan);
    return newPlan;
  }
  const created = await prisma.membershipPlan.create({
    data: {
      ...data,
      discountOffer: data.discountOffer || null,
    },
  });
  return { ...created, discountOffer: created.discountOffer || undefined };
}

export async function updateMembership(id: string, updates: Partial<MembershipPlan>): Promise<MembershipPlan | null> {
  if (!isDatabaseConfigured()) {
    const idx = memoryStore.memberships.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    memoryStore.memberships[idx] = { ...memoryStore.memberships[idx], ...updates };
    return memoryStore.memberships[idx];
  }
  try {
    const updated = await prisma.membershipPlan.update({
      where: { id },
      data: updates,
    });
    return { ...updated, discountOffer: updated.discountOffer || undefined };
  } catch {
    return null;
  }
}

export async function deleteMembership(id: string): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    memoryStore.memberships = memoryStore.memberships.filter((p) => p.id !== id);
    return true;
  }
  try {
    await prisma.membershipPlan.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function getFacilities(): Promise<Facility[]> {
  if (!isDatabaseConfigured()) return memoryStore.facilities;
  try {
    await seedPostgreSQL();
    const facs = await prisma.facility.findMany({ orderBy: { order: 'asc' } });
    if (!facs || facs.length === 0) return DEFAULT_FACILITIES;
    return facs;
  } catch {
    return DEFAULT_FACILITIES;
  }
}

export async function updateFacility(id: string, updates: Partial<Facility>): Promise<Facility | null> {
  if (!isDatabaseConfigured()) {
    const idx = memoryStore.facilities.findIndex((f) => f.id === id);
    if (idx === -1) return null;
    memoryStore.facilities[idx] = { ...memoryStore.facilities[idx], ...updates };
    return memoryStore.facilities[idx];
  }
  try {
    return await prisma.facility.update({ where: { id }, data: updates });
  } catch {
    return null;
  }
}

export async function createFacility(data: Omit<Facility, 'id'>): Promise<Facility> {
  if (!isDatabaseConfigured()) {
    const newFac = { ...data, id: 'fac-' + Date.now() };
    memoryStore.facilities.push(newFac);
    return newFac;
  }
  return await prisma.facility.create({ data });
}

export async function deleteFacility(id: string): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    memoryStore.facilities = memoryStore.facilities.filter((f) => f.id !== id);
    return true;
  }
  try {
    await prisma.facility.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function getPrograms(): Promise<TrainingProgram[]> {
  if (!isDatabaseConfigured()) return memoryStore.programs;
  try {
    await seedPostgreSQL();
    const progs = await prisma.trainingProgram.findMany({ orderBy: { order: 'asc' } });
    if (!progs || progs.length === 0) return DEFAULT_TRAINING_PROGRAMS;
    return progs.map((p: any) => ({
      ...p,
      difficulty: p.difficulty as TrainingProgram['difficulty'],
    }));
  } catch {
    return DEFAULT_TRAINING_PROGRAMS;
  }
}

export async function createProgram(data: Omit<TrainingProgram, 'id'>): Promise<TrainingProgram> {
  if (!isDatabaseConfigured()) {
    const newProg = { ...data, id: 'prog-' + Date.now() };
    memoryStore.programs.push(newProg);
    return newProg;
  }
  const created = await prisma.trainingProgram.create({ data });
  return { ...created, difficulty: created.difficulty as TrainingProgram['difficulty'] };
}

export async function updateProgram(id: string, updates: Partial<TrainingProgram>): Promise<TrainingProgram | null> {
  if (!isDatabaseConfigured()) {
    const idx = memoryStore.programs.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    memoryStore.programs[idx] = { ...memoryStore.programs[idx], ...updates };
    return memoryStore.programs[idx];
  }
  try {
    const updated = await prisma.trainingProgram.update({ where: { id }, data: updates });
    return { ...updated, difficulty: updated.difficulty as TrainingProgram['difficulty'] };
  } catch {
    return null;
  }
}

export async function deleteProgram(id: string): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    memoryStore.programs = memoryStore.programs.filter((p) => p.id !== id);
    return true;
  }
  try {
    await prisma.trainingProgram.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function getGallery(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) return memoryStore.gallery;
  try {
    await seedPostgreSQL();
    const items = await prisma.galleryItem.findMany({ orderBy: { order: 'asc' } });
    if (!items || items.length === 0) return DEFAULT_GALLERY;
    return items.map((g: any) => ({
      ...g,
      category: g.category as GalleryItem['category'],
      caption: g.caption || undefined,
    }));
  } catch {
    return DEFAULT_GALLERY;
  }
}

export async function createGalleryItem(data: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
  if (!isDatabaseConfigured()) {
    const newItem = { ...data, id: 'gal-' + Date.now() };
    memoryStore.gallery.unshift(newItem);
    return newItem;
  }
  const created = await prisma.galleryItem.create({
    data: {
      ...data,
      caption: data.caption || null,
    },
  });
  return {
    ...created,
    category: created.category as GalleryItem['category'],
    caption: created.caption || undefined,
  };
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    memoryStore.gallery = memoryStore.gallery.filter((g) => g.id !== id);
    return true;
  }
  try {
    await prisma.galleryItem.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isDatabaseConfigured()) return memoryStore.testimonials;
  try {
    await seedPostgreSQL();
    const items = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
    if (!items || items.length === 0) return DEFAULT_TESTIMONIALS;
    return items.map((t: any) => ({
      ...t,
      role: t.role || undefined,
      source: t.source as Testimonial['source'],
    }));
  } catch {
    return DEFAULT_TESTIMONIALS;
  }
}

export async function createTestimonial(data: Omit<Testimonial, 'id'>): Promise<Testimonial> {
  if (!isDatabaseConfigured()) {
    const newItem = { ...data, id: 'test-' + Date.now() };
    memoryStore.testimonials.unshift(newItem);
    return newItem;
  }
  const created = await prisma.testimonial.create({
    data: {
      ...data,
      role: data.role || null,
    },
  });
  return {
    ...created,
    role: created.role || undefined,
    source: created.source as Testimonial['source'],
  };
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | null> {
  if (!isDatabaseConfigured()) {
    const idx = memoryStore.testimonials.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    memoryStore.testimonials[idx] = { ...memoryStore.testimonials[idx], ...updates };
    return memoryStore.testimonials[idx];
  }
  try {
    const updated = await prisma.testimonial.update({ where: { id }, data: updates });
    return {
      ...updated,
      role: updated.role || undefined,
      source: updated.source as Testimonial['source'],
    };
  } catch {
    return null;
  }
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    memoryStore.testimonials = memoryStore.testimonials.filter((t) => t.id !== id);
    return true;
  }
  try {
    await prisma.testimonial.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function getFAQs(): Promise<FAQItem[]> {
  if (!isDatabaseConfigured()) return memoryStore.faqs;
  try {
    await seedPostgreSQL();
    const items = await prisma.faqItem.findMany({ orderBy: { order: 'asc' } });
    if (!items || items.length === 0) return DEFAULT_FAQS;
    return items;
  } catch {
    return DEFAULT_FAQS;
  }
}

export async function createFAQ(data: Omit<FAQItem, 'id'>): Promise<FAQItem> {
  if (!isDatabaseConfigured()) {
    const newItem = { ...data, id: 'faq-' + Date.now() };
    memoryStore.faqs.push(newItem);
    return newItem;
  }
  return await prisma.faqItem.create({ data });
}

export async function updateFAQ(id: string, updates: Partial<FAQItem>): Promise<FAQItem | null> {
  if (!isDatabaseConfigured()) {
    const idx = memoryStore.faqs.findIndex((f) => f.id === id);
    if (idx === -1) return null;
    memoryStore.faqs[idx] = { ...memoryStore.faqs[idx], ...updates };
    return memoryStore.faqs[idx];
  }
  try {
    return await prisma.faqItem.update({ where: { id }, data: updates });
  } catch {
    return null;
  }
}

export async function deleteFAQ(id: string): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    memoryStore.faqs = memoryStore.faqs.filter((f) => f.id !== id);
    return true;
  }
  try {
    await prisma.faqItem.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (!isDatabaseConfigured()) return memoryStore.messages;
  try {
    const msgs = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
    return msgs.map((m: any) => ({
      ...m,
      email: m.email || undefined,
      subject: m.subject || undefined,
      createdAt: m.createdAt.toISOString(),
    }));
  } catch {
    return memoryStore.messages;
  }
}

export async function createContactMessage(data: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>): Promise<ContactMessage> {
  const now = new Date().toISOString();
  const fallbackMsg: ContactMessage = {
    ...data,
    id: 'msg-' + Date.now(),
    isRead: false,
    createdAt: now,
  };
  if (!isDatabaseConfigured()) {
    memoryStore.messages = [fallbackMsg, ...memoryStore.messages];
    return fallbackMsg;
  }
  try {
    const created = await prisma.contactMessage.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        subject: data.subject || null,
        message: data.message,
        isRead: false,
      },
    });
    return {
      ...created,
      email: created.email || undefined,
      subject: created.subject || undefined,
      createdAt: created.createdAt.toISOString(),
    };
  } catch (err) {
    console.error('Error creating contact message in DB:', err);
    memoryStore.messages = [fallbackMsg, ...memoryStore.messages];
    return fallbackMsg;
  }
}

export async function markMessageRead(id: string): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    memoryStore.messages = memoryStore.messages.map((m) => (m.id === id ? { ...m, isRead: true } : m));
    return true;
  }
  try {
    await prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
    return true;
  } catch {
    return false;
  }
}

export async function deleteMessage(id: string): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    memoryStore.messages = memoryStore.messages.filter((m) => m.id !== id);
    return true;
  }
  try {
    await prisma.contactMessage.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
