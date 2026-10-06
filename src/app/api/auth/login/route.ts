import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken, setAdminSessionCookie, validateAdminCredentials } from '../../../../lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const validation = await validateAdminCredentials(email, password);
    if (!validation.valid || !validation.user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = await createAdminToken(validation.user);

    await setAdminSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: validation.user,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 });
  }
}
