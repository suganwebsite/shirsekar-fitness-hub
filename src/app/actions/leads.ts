'use server';

import { getCurrentAdmin } from '../../lib/auth';
import { createContactMessage, createLead, deleteLead, updateLeadStatus } from '../../lib/db';
import { contactMessageSchema, leadSubmissionSchema } from '../../lib/validations';
import { Lead, LeadStatus } from '../../types';

export async function createManualLeadAction(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: 'Unauthorized: Admin authentication required.' };
    }

    const parsed = leadSubmissionSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid lead data.' };
    }

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
    const parsed = leadSubmissionSchema.safeParse({
      ...data,
      source: 'free_trial',
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid form data.' };
    }

    const lead = await createLead({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || undefined,
      goal: parsed.data.goal,
      preferredDate: parsed.data.preferredDate,
      preferredTime: parsed.data.preferredTime,
      message: parsed.data.message,
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
    const rawData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: (formData.get('email') as string) || undefined,
      goal: (formData.get('goal') as string) || 'General Fitness',
      preferredDate: (formData.get('preferredDate') as string) || undefined,
      preferredTime: (formData.get('preferredTime') as string) || undefined,
      message: (formData.get('message') as string) || undefined,
      source: 'free_trial' as const,
    };

    const parsed = leadSubmissionSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Validation error.' };
    }

    const lead = await createLead({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || undefined,
      goal: parsed.data.goal,
      preferredDate: parsed.data.preferredDate,
      preferredTime: parsed.data.preferredTime,
      message: parsed.data.message,
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

    const rawData = {
      name,
      phone,
      email,
      goal: planName ? `Membership: ${planName}` : 'Membership Enquiry',
      message,
      source: 'membership_enquiry' as const,
    };

    const parsed = leadSubmissionSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Validation error.' };
    }

    const lead = await createLead({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || undefined,
      goal: parsed.data.goal,
      message: parsed.data.message,
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
    const rawData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: (formData.get('email') as string) || undefined,
      subject: (formData.get('subject') as string) || 'General Contact',
      message: formData.get('message') as string,
    };

    const parsed = contactMessageSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Validation error.' };
    }

    const contact = await createContactMessage({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || undefined,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });

    return { success: true, contact };
  } catch (err: any) {
    console.error('Server Action submitContactMessage error:', err);
    return { success: false, error: 'Failed to send message.' };
  }
}

export async function updateLeadStatusAction(id: string, status: LeadStatus, notes?: string) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: 'Unauthorized: Admin authentication required.' };
    }

    const success = await updateLeadStatus(id, status, notes);
    return { success };
  } catch (err: any) {
    console.error('Server Action updateLeadStatusAction error:', err);
    return { success: false, error: 'Failed to update lead status.' };
  }
}

export async function deleteLeadAction(id: string) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: 'Unauthorized: Admin authentication required.' };
    }

    const success = await deleteLead(id);
    return { success };
  } catch (err: any) {
    console.error('Server Action deleteLeadAction error:', err);
    return { success: false, error: 'Failed to delete lead.' };
  }
}
