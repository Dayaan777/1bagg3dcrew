import React from 'react';
import HeroSection from '@/components/HeroSection';
import CategoriesShowcase from '@/components/CategoriesShowcase';
import FeaturedProducts from '@/components/FeaturedProducts';
import { getProducts, getSettings } from '@/lib/db';
import Link from 'next/link';




export default async function HomePage() {
  const [products, settings] = await Promise.all([
    getProducts(),
    getSettings()
  ]);

  return (
    <div className="bg-black text-white">
      {/* 1. Hero with Logo */}
      <HeroSection settings={settings} />

      {/* 2. Featured Merch Products (RUINED-style dark streetwear grid) */}
      <FeaturedProducts products={products} />

      {/* 3. Categories: MERCH & AIR SUSPENSION KIT (as COMING SOON) */}
      <CategoriesShowcase settings={settings} />

      {/* 4. Brand Manifesto Statement */}
      <section className="bg-black py-20 px-4 border-t border-zinc-900 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-zinc-500 font-mono text-xs tracking-[0.3em] uppercase">
            THE 1BAGG3D MANIFESTO
          </span>
          <blockquote className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-zinc-100 leading-snug">
            “STATIC GETS STUCK. AIR GETS RESPECT. LIVE YOUR LIFE ON AIR.”
          </blockquote>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Built from scratch for the stance enthusiasts who demand spotless wheel fitment at the meet and smooth highway cruising on the way back home.
          </p>
          <div className="pt-4">
            <Link
              href="/about"
              className="text-xs font-mono text-zinc-400 hover:text-white underline underline-offset-4 tracking-widest uppercase"
            >
              Read Full Brand Story & Mission &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
