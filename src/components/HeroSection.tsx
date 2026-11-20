'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Gauge } from 'lucide-react';
import { SiteSettings } from '@/lib/db';

interface HeroSectionProps {
  settings?: SiteSettings;
}

export default function HeroSection({ settings }: HeroSectionProps) {
  const tagline = settings?.heroTagline || 'LIVE YOUR LIFE ON AIR';
  const subtitle = settings?.heroSubtitle || 'Streetwear curated for the underground car scene & premium air suspension engineering. Built by car enthusiasts, for car enthusiasts.';
  const airStatus = settings?.airSuspensionStatus || 'COMING SOON';

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden bg-black px-4 pt-8 pb-16">
      {/* Background Ambient Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep central spotlight glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-zinc-800/25 via-zinc-700/10 to-transparent rounded-full blur-[120px]" />
        
        {/* Subtle grid pattern for precision mechanical vibe */}
        <div 
          className="absolute inset-0 opacity-[0.07]" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Top and Bottom soft vignette overlays */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        
        {/* Hero Logo Presentation - Beautiful, attractive, central presentation as requested */}
        <div className="relative group cursor-pointer mb-8">
          {/* Outer glowing pulsing halo */}
          <div className="absolute -inset-4 bg-gradient-to-r from-zinc-600/30 via-white/20 to-zinc-600/30 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition duration-700 animate-pulse" />

          {/* Chrome/Metallic Border Ring with bevel */}
          <div className="relative p-1 sm:p-1.5 rounded-full bg-gradient-to-b from-zinc-300 via-zinc-800 to-zinc-950 shadow-2xl shadow-black">
            <div className="p-0.5 sm:p-1 rounded-full bg-black">
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full overflow-hidden border border-zinc-800/80 sm:border-2 shadow-[inset_0_0_30px_rgba(255,255,255,0.1)] transition-transform duration-500 group-hover:scale-[1.03]">
                {/* 1Bagg3dCrew Logo with smooth spinning animation like a vinyl / spinning wheel */}
                <Image
                  src="/logo.png"
                  alt="1Bagg3dCrew - Live Your Life On Air"
                  fill
                  priority
                  className="object-cover scale-[1.03] sm:scale-100 animate-spin-slow will-change-transform"
                />
                
                {/* Subtle glass reflection shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Headline / Slogan */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase mt-4 mb-4">
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 drop-shadow-sm">
            {tagline}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-zinc-400 text-sm sm:text-base font-normal leading-relaxed mb-10 px-4">
          {subtitle}
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4">
          <Link
            href="/merch"
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs tracking-[0.2em] uppercase rounded-lg shadow-xl shadow-white/5 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
          >
            <span>Shop Merch Drop</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/air-suspension"
            className="w-full sm:w-auto px-8 py-4 bg-zinc-950 hover:bg-zinc-900 text-zinc-100 border border-zinc-800 hover:border-zinc-600 font-bold text-xs tracking-[0.2em] uppercase rounded-lg transition-all flex items-center justify-center gap-2.5 shadow-lg group"
          >
            <Gauge className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 transition-colors" />
            <span>Air Suspension</span>
            <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono rounded">
              {airStatus}
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}
