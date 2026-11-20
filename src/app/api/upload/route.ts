import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import path from 'path';
import fs from 'fs';
import { saveUploadedImage } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    if (!session || session.value !== 'authenticated') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';
    const ext = path.extname(file.name) || '.jpg';
    const imageId = 'img-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);

    // Save image to persistent Neon PostgreSQL database so it works flawlessly on serverless hosts (Netlify / Vercel)
    const publicUrl = await saveUploadedImage(imageId, file.name, mimeType, base64Data);

    // Also attempt writing to local public/uploads for local development convenience if filesystem is writable
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${cleanBase}_${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, buffer);
    } catch {
      // Serverless environments have read-only filesystems; ignore local disk write errors
    }

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Upload failed' }, { status: 500 });
  }
}
