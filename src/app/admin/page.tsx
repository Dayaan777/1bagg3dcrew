import React from 'react';
import { getProducts, getSettings, getWaitlistLeads, getCategories } from '@/lib/db';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  const [products, settings, waitlist, categories] = await Promise.all([
    getProducts(),
    getSettings(),
    getWaitlistLeads(),
    getCategories()
  ]);

  return (
    <AdminClient
      initialProducts={products}
      initialSettings={settings}
      initialWaitlist={waitlist}
      initialCategories={categories}
    />
  );
}
