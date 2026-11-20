import { NextResponse } from 'next/server';
import { getProductById, deleteProduct } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to retrieve product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    if (!session || session.value !== 'authenticated') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await deleteProduct(id);
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
