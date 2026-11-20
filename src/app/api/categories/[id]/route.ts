import { NextResponse } from 'next/server';
import { deleteCategory } from '@/lib/db';
import { cookies } from 'next/headers';

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
    await deleteCategory(id);
    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete category' }, { status: 500 });
  }
}
