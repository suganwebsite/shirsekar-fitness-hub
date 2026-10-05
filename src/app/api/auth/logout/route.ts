import { NextResponse } from 'next/server';
import { removeAdminSessionCookie } from '../../../../lib/auth';

export async function POST() {
  try {
    await removeAdminSessionCookie();
    return NextResponse.json({ success: true, message: 'Logged out successfully.' });
  } catch (err: any) {
    console.error('Logout error:', err);
    return NextResponse.json({ error: 'Logout failed.' }, { status: 500 });
  }
}
