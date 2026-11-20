import React from 'react';
import { getSettings, getProducts } from '@/lib/db';
import AirSuspensionClient from './AirSuspensionClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AirSuspensionPage() {
  const [settings, products] = await Promise.all([
    getSettings(),
    getProducts()
  ]);

  const featuredAirProducts = products.filter(p => p.featureInAirSuspension === true);

  return (
    <AirSuspensionClient
      settings={settings}
      featuredProducts={featuredAirProducts}
    />
  );
}
