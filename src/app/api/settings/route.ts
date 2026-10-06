import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '../../../lib/auth';
import { getBusinessSettings, updateBusinessSettings } from '../../../lib/db';

export async function GET() {
  try {
    const settings = await getBusinessSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    console.error('Error fetching settings:', err);
    return NextResponse.json({ error: 'Failed to fetch settings.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const updates = await req.json();
    const updated = await updateBusinessSettings(updates);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    console.error('Error updating settings:', err);
    return NextResponse.json({ error: 'Failed to update settings.' }, { status: 500 });
  }
}
