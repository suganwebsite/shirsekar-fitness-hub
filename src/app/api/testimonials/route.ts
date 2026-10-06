import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '../../../lib/auth';
import { createTestimonial, deleteTestimonial, getTestimonials, updateTestimonial } from '../../../lib/db';
import { testimonialSchema } from '../../../lib/validations';

export async function GET() {
  try {
    const testimonials = await getTestimonials();
    return NextResponse.json({ success: true, testimonials });
  } catch (err: any) {
    console.error('Error fetching testimonials:', err);
    return NextResponse.json({ error: 'Failed to fetch reviews.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = testimonialSchema.omit({ id: true }).safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }

    const created = await createTestimonial(body);
    return NextResponse.json({ success: true, testimonial: created }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating review:', err);
    return NextResponse.json({ error: 'Failed to create review.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Review id is required.' }, { status: 400 });
    }

    const updated = await updateTestimonial(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Review not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (err: any) {
    console.error('Error updating review:', err);
    return NextResponse.json({ error: 'Failed to update review.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Review id parameter is required.' }, { status: 400 });
    }

    const success = await deleteTestimonial(id);
    if (!success) {
      return NextResponse.json({ error: 'Review not found or delete failed.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Review deleted successfully.' });
  } catch (err: any) {
    console.error('Error deleting review:', err);
    return NextResponse.json({ error: 'Failed to delete review.' }, { status: 500 });
  }
}
