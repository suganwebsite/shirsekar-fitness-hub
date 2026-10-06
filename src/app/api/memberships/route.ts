import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '../../../lib/auth';
import { createMembership, deleteMembership, getMemberships, updateMembership } from '../../../lib/db';
import { membershipPlanSchema } from '../../../lib/validations';

export async function GET() {
  try {
    const plans = await getMemberships();
    return NextResponse.json({ success: true, plans });
  } catch (err: any) {
    console.error('Error fetching memberships:', err);
    return NextResponse.json({ error: 'Failed to fetch memberships.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = membershipPlanSchema.omit({ id: true }).safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }

    const created = await createMembership(body);
    return NextResponse.json({ success: true, plan: created }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating membership:', err);
    return NextResponse.json({ error: 'Failed to create membership.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: 'Plan id is required.' }, { status: 400 });
    }

    const updated = await updateMembership(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Plan not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, plan: updated });
  } catch (err: any) {
    console.error('Error updating membership:', err);
    return NextResponse.json({ error: 'Failed to update membership.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Plan id parameter is required.' }, { status: 400 });
    }

    const success = await deleteMembership(id);
    if (!success) {
      return NextResponse.json({ error: 'Plan not found or failed to delete.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Plan deleted successfully.' });
  } catch (err: any) {
    console.error('Error deleting membership:', err);
    return NextResponse.json({ error: 'Failed to delete membership.' }, { status: 500 });
  }
}
