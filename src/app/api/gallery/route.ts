import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '../../../lib/auth';
import { createGalleryItem, deleteGalleryItem, getGallery } from '../../../lib/db';

export async function GET() {
  try {
    const items = await getGallery();
    return NextResponse.json({ success: true, items });
  } catch (err: any) {
    console.error('Error fetching gallery:', err);
    return NextResponse.json({ error: 'Failed to fetch gallery.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title || !body.imageUrl) {
      return NextResponse.json({ error: 'Title and imageUrl are required.' }, { status: 400 });
    }

    const created = await createGalleryItem(body);
    return NextResponse.json({ success: true, item: created }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating gallery item:', err);
    return NextResponse.json({ error: 'Failed to add photo.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Gallery id parameter is required.' }, { status: 400 });
    }

    const success = await deleteGalleryItem(id);
    if (!success) {
      return NextResponse.json({ error: 'Item not found or delete failed.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Photo deleted successfully.' });
  } catch (err: any) {
    console.error('Error deleting gallery item:', err);
    return NextResponse.json({ error: 'Failed to delete photo.' }, { status: 500 });
  }
}
