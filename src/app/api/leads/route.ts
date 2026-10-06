import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '../../../lib/auth';
import { createLead, deleteLead, getLeads, updateLeadStatus } from '../../../lib/db';
import { leadSubmissionSchema } from '../../../lib/validations';
import { LeadStatus } from '../../../types';

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
    const parsed = leadSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }

    const lead = await createLead({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || undefined,
      goal: parsed.data.goal,
      preferredDate: parsed.data.preferredDate || undefined,
      preferredTime: parsed.data.preferredTime || undefined,
      message: parsed.data.message || undefined,
      status: 'new',
      source: parsed.data.source || 'free_trial',
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating lead:', err);
    return NextResponse.json({ error: 'Failed to submit enquiry.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Lead id and status are required.' }, { status: 400 });
    }

    const updated = await updateLeadStatus(id, status as LeadStatus, notes);
    if (!updated) {
      return NextResponse.json({ error: 'Lead not found or update failed.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Lead updated successfully.' });
  } catch (err: any) {
    console.error('Error updating lead:', err);
    return NextResponse.json({ error: 'Failed to update lead.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Lead id parameter is required.' }, { status: 400 });
    }

    const deleted = await deleteLead(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Lead not found or delete failed.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Lead deleted successfully.' });
  } catch (err: any) {
    console.error('Error deleting lead:', err);
    return NextResponse.json({ error: 'Failed to delete lead.' }, { status: 500 });
  }
}
