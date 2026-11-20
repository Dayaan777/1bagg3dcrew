import { NextResponse } from 'next/server';
import { getCategories, saveCategory } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    if (!session || session.value !== 'authenticated') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const category = await saveCategory(body);
    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to save category' }, { status: 500 });
  }
}
