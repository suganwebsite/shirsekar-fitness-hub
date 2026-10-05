'use server';

import { getCurrentAdmin } from '@/lib/auth';
import {
  createFAQ,
  createGalleryItem,
  createMembership,
  createProgram,
  createTestimonial,
  deleteFAQ,
  deleteGalleryItem,
  deleteMembership,
  deleteMessage,
  deleteProgram,
  deleteTestimonial,
  markMessageRead,
  updateBusinessSettings,
  updateFacility,
  updateFAQ,
  updateMembership,
  updateProgram,
  updateTestimonial,
} from '@/lib/db';
import {
  BusinessSettings,
  Facility,
  FAQItem,
  GalleryItem,
  MembershipPlan,
  Testimonial,
  TrainingProgram,
} from '@/types';
import { revalidatePath } from 'next/cache';

async function checkAuth() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}

// Settings
export async function updateSettingsAction(data: Partial<BusinessSettings>) {
  await checkAuth();
  const updated = await updateBusinessSettings(data);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, settings: updated };
}

// Memberships
export async function createMembershipAction(data: Omit<MembershipPlan, 'id'>) {
  await checkAuth();
  const created = await createMembership(data);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, plan: created };
}

export async function updateMembershipAction(id: string, updates: Partial<MembershipPlan>) {
  await checkAuth();
  const updated = await updateMembership(id, updates);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, plan: updated };
}

export async function deleteMembershipAction(id: string) {
  await checkAuth();
  await deleteMembership(id);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

// Programs
export async function createProgramAction(data: Omit<TrainingProgram, 'id'>) {
  await checkAuth();
  const created = await createProgram(data);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, program: created };
}

export async function updateProgramAction(id: string, updates: Partial<TrainingProgram>) {
  await checkAuth();
  const updated = await updateProgram(id, updates);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, program: updated };
}

export async function deleteProgramAction(id: string) {
  await checkAuth();
  await deleteProgram(id);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

// Facilities
export async function updateFacilityAction(id: string, updates: Partial<Facility>) {
  await checkAuth();
  const updated = await updateFacility(id, updates);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, facility: updated };
}

// Gallery
export async function createGalleryItemAction(data: Omit<GalleryItem, 'id'>) {
  await checkAuth();
  const created = await createGalleryItem(data);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, item: created };
}

export async function deleteGalleryItemAction(id: string) {
  await checkAuth();
  await deleteGalleryItem(id);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

// Testimonials
export async function createTestimonialAction(data: Omit<Testimonial, 'id'>) {
  await checkAuth();
  const created = await createTestimonial(data);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, testimonial: created };
}

export async function updateTestimonialAction(id: string, updates: Partial<Testimonial>) {
  await checkAuth();
  const updated = await updateTestimonial(id, updates);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, testimonial: updated };
}

export async function deleteTestimonialAction(id: string) {
  await checkAuth();
  await deleteTestimonial(id);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

// FAQs
export async function createFAQAction(data: Omit<FAQItem, 'id'>) {
  await checkAuth();
  const created = await createFAQ(data);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, faq: created };
}

export async function updateFAQAction(id: string, updates: Partial<FAQItem>) {
  await checkAuth();
  const updated = await updateFAQ(id, updates);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, faq: updated };
}

export async function deleteFAQAction(id: string) {
  await checkAuth();
  await deleteFAQ(id);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

// Messages
export async function markMessageReadAction(id: string) {
  await checkAuth();
  await markMessageRead(id);
  revalidatePath('/admin');
  return { success: true };
}

export async function deleteMessageAction(id: string) {
  await checkAuth();
  await deleteMessage(id);
  revalidatePath('/admin');
  return { success: true };
}
