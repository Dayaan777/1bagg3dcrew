'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Wrench } from 'lucide-react';
import { SiteSettings, Product } from '@/lib/db';
import { useCart } from '@/context/CartContext';

interface AirSuspensionClientProps {
  settings: SiteSettings;
  featuredProducts?: Product[];
}

export default function AirSuspensionClient({ settings, featuredProducts = [] }: AirSuspensionClientProps) {
  const { addItem } = useCart();

  const handleQuickAdd = (p: Product) => {
    const size = p.sizes && p.sizes.length > 0 ? p.sizes[0] : 'Universal';
    addItem(p, size, 1);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-6 pb-24">
      {/* AIR SUSPENSION PRODUCTS CATALOG - DIRECTLY BELOW NAVBAR */}
      <section className="px-4 max-w-7xl mx-auto" id="products">
        {/* Section Header with Official Air Suspension Badge */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="relative inline-block mx-auto mb-2 group">
            <div className="absolute -inset-2 bg-gradient-to-r from-zinc-700/30 via-white/20 to-zinc-700/30 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition duration-700" />
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-zinc-800 shadow-2xl bg-black mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/air-suspension-badge.png"
                alt="1Bagg3dCrew Air Suspension Division Badge"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block">
            DIVISION 02 • PERFORMANCE CHASSIS
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            Air Systems & Component Catalog
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Direct bolt-on kits, digital management units, compressor setups, and universal air strut hardware.
          </p>
        </div>

        {/* Product Grid */}
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-zinc-950 rounded-2xl border border-zinc-850 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition group shadow-xl"
              >
                <Link href={`/merch/${p.slug}`} className="block relative aspect-square bg-zinc-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image || '/logo.png'}
                    alt={p.title}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider bg-black/80 text-emerald-400 border border-emerald-500/30 uppercase">
                      IN STOCK
                    </span>
                  </div>
                </Link>

                <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                      AIR SUSPENSION
                    </span>
                    <Link href={`/merch/${p.slug}`}>
                      <h3 className="text-sm font-bold text-white hover:text-amber-400 transition line-clamp-2 mt-1 leading-snug">
                        {p.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
                      {p.description || 'Precision valved bolt-on air strut system.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                    <span className="text-base font-bold font-mono text-white">
                      ${p.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleQuickAdd(p)}
                      className="px-3.5 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 shadow"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 px-4 bg-zinc-950 rounded-2xl border border-zinc-900 max-w-xl mx-auto space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-amber-400">
              <Wrench className="w-6 h-6 animate-pulse" />
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
              COMING SOON
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
              Air Kits Dropping Soon
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-mono max-w-md mx-auto">
              Our precision air suspension systems, billet reservoirs, and digital management systems are currently in pre-release preparation.
            </p>
            <div className="pt-2">
              <Link
                href="/merch"
                className="inline-block px-6 py-3 bg-white text-black text-xs font-mono font-bold uppercase rounded-lg hover:bg-zinc-200 transition"
              >
                Browse Merch Catalog &rarr;
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
