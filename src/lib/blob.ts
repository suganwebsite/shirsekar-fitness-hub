import { del, put } from '@vercel/blob';

export async function uploadImageToBlob(
  file: File | Blob,
  filename: string
): Promise<{ url: string; error?: string }> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not set. Falling back to data URL for preview.');
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString('base64');
      const mimeType = (file as File).type || 'image/jpeg';
      return { url: `data:${mimeType};base64,${base64}` };
    }

    const cleanFilename = `gallery/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const blob = await put(cleanFilename, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return { url: blob.url };
  } catch (err: any) {
    console.error('Vercel Blob upload failed:', err);
    return { url: '', error: err.message || 'Image upload to Vercel Blob failed.' };
  }
}

export async function deleteImageFromBlob(url: string): Promise<boolean> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN || !url || !url.startsWith('https://')) {
      return true;
    }
    await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
    return true;
  } catch (err: any) {
    console.error('Vercel Blob delete failed:', err);
    return false;
  }
}
