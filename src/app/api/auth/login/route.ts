import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken, setAdminSessionCookie, validateAdminCredentials } from '../../../../lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const isValid = validateAdminCredentials(email, password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = await createAdminToken({
      id: 'admin-1',
      email: email.trim().toLowerCase(),
      name: "Shirsekar's Hub Admin",
      role: 'super_admin',
    });

    await setAdminSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: 'admin-1',
        email: email.trim().toLowerCase(),
        name: "Shirsekar's Hub Admin",
        role: 'super_admin',
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 });
  }
}
