import {
  AdminPayload,
  createAdminToken,
  getCurrentAdmin,
  removeAdminSessionCookie,
  setAdminSessionCookie,
  validateAdminCredentials,
} from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const admin = await getCurrentAdmin();
  return NextResponse.json({ authenticated: Boolean(admin), user: admin });
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const isValid = validateAdminCredentials(email, password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const payload: AdminPayload = {
      id: 'admin-1',
      email: email.toLowerCase().trim(),
      name: 'Gym Manager',
      role: 'super_admin',
    };

    const token = await createAdminToken(payload);
    await setAdminSessionCookie(token);

    return NextResponse.json({ success: true, user: payload });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  await removeAdminSessionCookie();
  return NextResponse.json({ success: true });
}
