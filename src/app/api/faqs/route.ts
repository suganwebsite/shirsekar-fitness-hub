import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '../../../lib/auth';
import { createFAQ, deleteFAQ, getFAQs, updateFAQ } from '../../../lib/db';
import { faqSchema } from '../../../lib/validations';

export async function GET() {
  try {
    const faqs = await getFAQs();
    return NextResponse.json({ success: true, faqs });
  } catch (err: any) {
    console.error('Error fetching FAQs:', err);
    return NextResponse.json({ error: 'Failed to fetch FAQs.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = faqSchema.omit({ id: true }).safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }

    const created = await createFAQ(body);
    return NextResponse.json({ success: true, faq: created }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating FAQ:', err);
    return NextResponse.json({ error: 'Failed to create FAQ.' }, { status: 500 });
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
      return NextResponse.json({ error: 'FAQ id is required.' }, { status: 400 });
    }

    const updated = await updateFAQ(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'FAQ not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, faq: updated });
  } catch (err: any) {
    console.error('Error updating FAQ:', err);
    return NextResponse.json({ error: 'Failed to update FAQ.' }, { status: 500 });
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
      return NextResponse.json({ error: 'FAQ id parameter is required.' }, { status: 400 });
    }

    const success = await deleteFAQ(id);
    if (!success) {
      return NextResponse.json({ error: 'FAQ not found or delete failed.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'FAQ deleted successfully.' });
  } catch (err: any) {
    console.error('Error deleting FAQ:', err);
    return NextResponse.json({ error: 'Failed to delete FAQ.' }, { status: 500 });
  }
}
