'use server';

import { createContactMessage, createLead, deleteLead, updateLeadStatus } from '../../lib/db';
import { Lead, LeadStatus } from '../../types';

export async function createManualLeadAction(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const lead = await createLead(data);
    return { success: true, lead };
  } catch (err: any) {
    console.error('Server Action createManualLeadAction error:', err);
    return { success: false, error: 'Failed to create lead.' };
  }
}

export async function submitFreeTrialLead(data: {
  name: string;
  phone: string;
  email?: string;
  goal?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
}) {
  try {
    const lead = await createLead({
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim(),
      goal: data.goal || 'Strength Training',
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      message: data.message?.trim(),
      status: 'new',
      source: 'free_trial',
    });
    return { success: true, lead };
  } catch (err: any) {
    console.error('Server Action submitFreeTrialLead error:', err);
    return { success: false, error: 'Failed to submit free trial.' };
  }
}

export async function submitTrialLead(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = (formData.get('email') as string) || undefined;
    const goal = (formData.get('goal') as string) || 'General Fitness';
    const preferredDate = (formData.get('preferredDate') as string) || undefined;
    const preferredTime = (formData.get('preferredTime') as string) || undefined;
    const message = (formData.get('message') as string) || undefined;

    if (!name || !phone) {
      return { success: false, error: 'Name and phone are required.' };
    }

    const lead = await createLead({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      goal,
      preferredDate,
      preferredTime,
      message: message?.trim(),
      status: 'new',
      source: 'free_trial',
    });

    return { success: true, lead };
  } catch (err: any) {
    console.error('Server Action submitTrialLead error:', err);
    return { success: false, error: 'Failed to submit free trial request.' };
  }
}

export async function submitMembershipEnquiry(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const planName = formData.get('planName') as string;
    const email = (formData.get('email') as string) || undefined;
    const message = (formData.get('message') as string) || undefined;

    if (!name || !phone) {
      return { success: false, error: 'Name and phone are required.' };
    }

    const lead = await createLead({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      goal: planName ? `Membership: ${planName}` : 'Membership Enquiry',
      message: message?.trim(),
      status: 'new',
      source: 'membership_enquiry',
    });

    return { success: true, lead };
  } catch (err: any) {
    console.error('Server Action submitMembershipEnquiry error:', err);
    return { success: false, error: 'Failed to submit membership enquiry.' };
  }
}

export async function submitContactMessage(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = (formData.get('email') as string) || undefined;
    const subject = (formData.get('subject') as string) || 'General Contact';
    const message = formData.get('message') as string;

    if (!name || !phone || !message) {
      return { success: false, error: 'Name, phone, and message are required.' };
    }

    const contact = await createContactMessage({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return { success: true, contact };
  } catch (err: any) {
    console.error('Server Action submitContactMessage error:', err);
    return { success: false, error: 'Failed to send message.' };
  }
}

export async function updateLeadStatusAction(id: string, status: LeadStatus, notes?: string) {
  try {
    const success = await updateLeadStatus(id, status, notes);
    return { success };
  } catch (err: any) {
    console.error('Server Action updateLeadStatusAction error:', err);
    return { success: false, error: 'Failed to update lead status.' };
  }
}

export async function deleteLeadAction(id: string) {
  try {
    const success = await deleteLead(id);
    return { success };
  } catch (err: any) {
    console.error('Server Action deleteLeadAction error:', err);
    return { success: false, error: 'Failed to delete lead.' };
  }
}
