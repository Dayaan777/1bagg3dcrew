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
          {/* Animated Turntable Emblem Presentation */}
          <div className="relative inline-block mx-auto mb-3 group cursor-pointer">
            {/* Outer glowing pulsing halo */}
            <div className="absolute -inset-4 bg-gradient-to-r from-zinc-600/30 via-white/20 to-zinc-600/30 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition duration-700 animate-pulse" />

            {/* Chrome/Metallic Border Ring with bevel */}
            <div className="relative p-1 sm:p-1.5 rounded-full bg-gradient-to-b from-zinc-300 via-zinc-800 to-zinc-950 shadow-2xl shadow-black">
              <div className="p-0.5 sm:p-1 rounded-full bg-black">
                <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden border border-zinc-800/80 sm:border-2 shadow-[inset_0_0_25px_rgba(255,255,255,0.1)] transition-transform duration-500 group-hover:scale-[1.03]">
                  {/* Rotating Mechanical Air Suspension Division Badge */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/air-suspension-badge.png"
                    alt="1Bagg3dCrew Air Suspension Division Badge"
                    className="w-full h-full object-cover scale-[1.02] animate-spin-slow will-change-transform"
                  />
                  
                  {/* Subtle glass reflection shimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none rounded-full" />
                </div>
              </div>
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
