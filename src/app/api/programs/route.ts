import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '../../../lib/auth';
import { createProgram, deleteProgram, getPrograms, updateProgram } from '../../../lib/db';
import { trainingProgramSchema } from '../../../lib/validations';

export async function GET() {
  try {
    const programs = await getPrograms();
    return NextResponse.json({ success: true, programs });
  } catch (err: any) {
    console.error('Error fetching programs:', err);
    return NextResponse.json({ error: 'Failed to fetch programs.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = trainingProgramSchema.omit({ id: true }).safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }

    const created = await createProgram(body);
    return NextResponse.json({ success: true, program: created }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating program:', err);
    return NextResponse.json({ error: 'Failed to create program.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Program id is required.' }, { status: 400 });
    }

    const updated = await updateProgram(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Program not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, program: updated });
  } catch (err: any) {
    console.error('Error updating program:', err);
    return NextResponse.json({ error: 'Failed to update program.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Program id parameter is required.' }, { status: 400 });
    }

    const success = await deleteProgram(id);
    if (!success) {
      return NextResponse.json({ error: 'Program not found or delete failed.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Program deleted successfully.' });
  } catch (err: any) {
    console.error('Error deleting program:', err);
    return NextResponse.json({ error: 'Failed to delete program.' }, { status: 500 });
  }
}
