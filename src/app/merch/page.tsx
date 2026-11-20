import React, { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/db';
import MerchClient from './MerchClient';

export default async function MerchPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-zinc-500 p-8 font-mono text-xs">Loading Merch Catalog...</div>}>
      <MerchClient initialProducts={products} initialCategories={categories} />
    </Suspense>
  );
}
