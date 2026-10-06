import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '../../../lib/auth';
import { createContactMessage, deleteMessage, getContactMessages, markMessageRead } from '../../../lib/db';
import { contactMessageSchema } from '../../../lib/validations';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    const messages = await getContactMessages();
    return NextResponse.json({ success: true, messages });
  } catch (err: any) {
    console.error('Error fetching messages:', err);
    return NextResponse.json({ error: 'Failed to fetch messages.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }

    const created = await createContactMessage({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || undefined,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });

    return NextResponse.json({ success: true, message: created }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating contact message:', err);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: 'Message id is required.' }, { status: 400 });
    }

    const success = await markMessageRead(id);
    if (!success) {
      return NextResponse.json({ error: 'Message not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Marked as read.' });
  } catch (err: any) {
    console.error('Error marking message read:', err);
    return NextResponse.json({ error: 'Failed to update message.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Message id parameter is required.' }, { status: 400 });
    }

    const success = await deleteMessage(id);
    if (!success) {
      return NextResponse.json({ error: 'Message not found or delete failed.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Message deleted successfully.' });
  } catch (err: any) {
    console.error('Error deleting message:', err);
    return NextResponse.json({ error: 'Failed to delete message.' }, { status: 500 });
  }
}
