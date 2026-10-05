'use server';

import {
  AdminPayload,
  createAdminToken,
  getCurrentAdmin,
  removeAdminSessionCookie,
  setAdminSessionCookie,
  validateAdminCredentials,
} from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function loginAdminAction(formData: {
  email: string;
  pass: string;
}): Promise<{ success: boolean; error?: string; user?: AdminPayload }> {
  try {
    const isValid = validateAdminCredentials(formData.email, formData.pass);
    if (!isValid) {
      return {
        success: false,
        error: 'Invalid credentials. Default is admin@shirsekarfitness.com / admin123',
      };
    }

    const payload: AdminPayload = {
      id: 'admin-1',
      email: formData.email.toLowerCase().trim(),
      name: 'Gym Manager',
      role: 'super_admin',
    };

    const token = await createAdminToken(payload);
    await setAdminSessionCookie(token);

    revalidatePath('/admin');
    return { success: true, user: payload };
  } catch (err: any) {
    return { success: false, error: err.message || 'Login failed.' };
  }
}

export async function logoutAdminAction(): Promise<{ success: boolean }> {
  await removeAdminSessionCookie();
  revalidatePath('/admin');
  return { success: true };
}

export async function getAdminSessionAction(): Promise<AdminPayload | null> {
  return await getCurrentAdmin();
}
