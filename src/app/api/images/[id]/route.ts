import { NextResponse } from 'next/server';
import { getUploadedImage } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const img = await getUploadedImage(id);

    if (!img) {
      return new NextResponse('Image not found', { status: 404 });
    }

    return new Response(new Uint8Array(img.buffer), {
      status: 200,
      headers: {
        'Content-Type': img.mimeType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return new NextResponse('Internal error serving image', { status: 500 });
  }
}
