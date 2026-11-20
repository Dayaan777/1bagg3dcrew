'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SiteSettings } from '@/lib/db';

interface CategoriesShowcaseProps {
  settings?: SiteSettings;
}

export default function CategoriesShowcase({ settings }: CategoriesShowcaseProps) {
  const airStatus = settings?.airSuspensionStatus || 'COMING SOON';

  return (
    <section className="bg-black py-16 px-4 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-2xl sm:text-3xl font-black text-white tracking-wider uppercase mb-10">
          Categories
        </h2>

        {/* Categories Grid (Clean & Minimalist, exactly as reference image 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Category 1: MERCH */}
          <Link
            href="/merch"
            className="group relative rounded-xl overflow-hidden border border-zinc-900 bg-zinc-950 aspect-[4/3] sm:aspect-[16/10] flex items-center justify-center transition-all duration-300 hover:border-zinc-700"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-45 group-hover:scale-105 transition-all duration-500"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

            <div className="relative z-10 text-center space-y-2">
              <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-widest group-hover:tracking-[0.25em] transition-all">
                MERCH
              </h3>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 group-hover:text-white block transition">
                Shop Now &rarr;
              </span>
            </div>
          </Link>

          {/* Category 2: AIR SUSPENSION KIT (as COMING SOON) */}
          <Link
            href="/air-suspension"
            className="group relative rounded-xl overflow-hidden border border-zinc-900 bg-zinc-950 aspect-[4/3] sm:aspect-[16/10] flex items-center justify-center transition-all duration-300 hover:border-zinc-700"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
              style={{
                backgroundImage: 'url(/logo.jpg)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />

            <div className="relative z-10 text-center space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold tracking-wider uppercase mb-1">
                {airStatus}
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-widest group-hover:tracking-[0.25em] transition-all">
                AIR SUSPENSION
              </h3>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 group-hover:text-amber-300 block transition">
                Explore &rarr;
              </span>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
