import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '../../../lib/auth';
import { createFacility, deleteFacility, getFacilities, updateFacility } from '../../../lib/db';
import { facilitySchema } from '../../../lib/validations';

export async function GET() {
  try {
    const facilities = await getFacilities();
    return NextResponse.json({ success: true, facilities });
  } catch (err: any) {
    console.error('Error fetching facilities:', err);
    return NextResponse.json({ error: 'Failed to fetch facilities.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = facilitySchema.omit({ id: true }).safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }

    const created = await createFacility(body);
    return NextResponse.json({ success: true, facility: created }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating facility:', err);
    return NextResponse.json({ error: 'Failed to create facility.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Facility id is required.' }, { status: 400 });
    }

    const updated = await updateFacility(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Facility not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, facility: updated });
  } catch (err: any) {
    console.error('Error updating facility:', err);
    return NextResponse.json({ error: 'Failed to update facility.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Facility id parameter is required.' }, { status: 400 });
    }

    const success = await deleteFacility(id);
    if (!success) {
      return NextResponse.json({ error: 'Facility not found or delete failed.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Facility deleted successfully.' });
  } catch (err: any) {
    console.error('Error deleting facility:', err);
    return NextResponse.json({ error: 'Failed to delete facility.' }, { status: 500 });
  }
}
