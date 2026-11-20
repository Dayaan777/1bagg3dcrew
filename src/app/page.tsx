import React from 'react';
import HeroSection from '@/components/HeroSection';
import CategoriesShowcase from '@/components/CategoriesShowcase';
import FeaturedProducts from '@/components/FeaturedProducts';
import { getProducts, getSettings } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

      {/* 4. Brand Manifesto Statement with Speed Graphic Insignia */}
      <section className="relative bg-black py-24 px-4 border-t border-zinc-900 overflow-hidden text-center">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-white/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Official 1Bagg3d Crew Speed Motion Emblem */}
          <div className="relative group cursor-pointer mb-6 animate-float-gentle">
            <div className="relative w-48 sm:w-60 md:w-72 aspect-[4/3] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-speed.png"
                alt="1Bagg3dCrew Motorsport Division Insignia"
                className="w-full h-full object-contain filter drop-shadow-[0_4px_20px_rgba(255,255,255,0.12)] transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          <span className="text-zinc-500 font-mono text-[11px] tracking-[0.35em] uppercase mb-4 block">
            THE 1BAGG3D MANIFESTO
          </span>

          <blockquote className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-zinc-100 leading-tight max-w-3xl mb-6">
            “STATIC GETS STUCK. AIR GETS RESPECT. <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">LIVE YOUR LIFE ON AIR.</span>”
          </blockquote>

          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed mb-8 font-normal">
            Built from scratch for the stance enthusiasts who demand spotless wheel fitment at the meet and smooth highway cruising on the way back home.
          </p>

          <div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-mono font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition shadow-lg"
            >
              <span>Read Full Brand Story & Mission</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
