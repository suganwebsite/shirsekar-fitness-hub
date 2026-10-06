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
    const validation = await validateAdminCredentials(formData.email, formData.pass);
    if (!validation.valid || !validation.user) {
      return {
        success: false,
        error: 'Invalid credentials. Default is admin@shirsekarfitness.com / admin123',
      };
    }

    const payload: AdminPayload = validation.user;

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
