import { NextResponse } from 'next/server';
import { getProducts, saveProduct } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
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
    const product = await saveProduct(body);
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to save product' }, { status: 500 });
  }
}
