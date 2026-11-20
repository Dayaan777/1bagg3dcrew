import { NextResponse } from 'next/server';
import { addWaitlistLead, getWaitlistLeads } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    if (!session || session.value !== 'authenticated') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const leads = await getWaitlistLeads();
    return NextResponse.json({ success: true, leads });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch waitlist' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { email, vehicleModel } = await request.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address' }, { status: 400 });
    }

    const lead = await addWaitlistLead(email, vehicleModel || '');
    return NextResponse.json({ success: true, lead });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to join waitlist' }, { status: 500 });
  }
}
