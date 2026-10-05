import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '../../../lib/auth';
import { createLead, getLeads } from '../../../lib/db';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    const leads = await getLeads();
    return NextResponse.json({ success: true, leads });
  } catch (err: any) {
    console.error('Error fetching leads:', err);
    return NextResponse.json({ error: 'Failed to retrieve leads.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, goal, email, preferredDate, preferredTime, message, source } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone number are required.' }, { status: 400 });
    }

    const lead = await createLead({
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim() : undefined,
      goal: goal ? String(goal) : 'General Fitness',
      preferredDate: preferredDate || undefined,
      preferredTime: preferredTime || undefined,
      message: message ? String(message).trim() : undefined,
      status: 'new',
      source: source || 'free_trial',
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating lead:', err);
    return NextResponse.json({ error: 'Failed to submit enquiry.' }, { status: 500 });
  }
}
