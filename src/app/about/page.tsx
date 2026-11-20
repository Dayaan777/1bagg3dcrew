import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getSettings } from '@/lib/db';
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default async function AboutPage() {
  const settings = await getSettings();

  const badge = settings.aboutBadge || 'EST. 2026 • GLOBAL CAR COLLECTIVE';
  const title = settings.aboutTitle || 'THE 1BAGG3D STORY';
  const subtitle = settings.aboutSubtitle || 'Born at late-night garage sessions, underground parking garage meets, and circuit tracks where perfection is measured in millimeters of fender clearance.';
  const storyHeading = settings.aboutStoryHeading || 'Live Your Life On Air';
  const storyP1 = settings.aboutStoryP1 || '1Bagg3dCrew was created to bridge two worlds that belong together: high-performance automotive chassis engineering and raw underground streetwear.';
  const storyP2 = settings.aboutStoryP2 || 'For years, the stance community had to compromise between generic merchandise that shrunk after one wash and static suspension setups that scraped away subframes on simple highway dips.';
  const storyP3 = settings.aboutStoryP3 || 'We set out to create bespoke garments with ultra-heavyweight 480GSM cotton, custom boxy silhouettes, and graphics inspired by real suspension schematics and car culture.';
  const pillar1Title = settings.aboutPillar1Title || 'Heavyweight Craftsmanship';
  const pillar1Desc = settings.aboutPillar1Desc || 'Milled French terry and preshrunk cotton. Designed to withstand grease, track dust, and daily wear.';
  const pillar2Title = settings.aboutPillar2Title || 'Precision Air Engineering';
  const pillar2Desc = settings.aboutPillar2Desc || '32-way damping valving, billet brackets, and wireless mobile management for the lowest, cleanest stance.';
  const pillar3Title = settings.aboutPillar3Title || 'Global Car Community';
  const pillar3Desc = settings.aboutPillar3Desc || 'From Tokyo parking garages to European autobahns and American highways, united by the stance lifestyle.';
  const contactHeading = settings.aboutContactHeading || 'Connect With The Crew';
  const contactSub = settings.aboutContactSub || 'Got questions about fitment, sponsorship proposals, or wholesale inquiries? Reach out directly.';

  return (
    <div className="min-h-screen bg-black text-white pt-10 pb-24">
      {/* Header */}
      <section className="px-4 max-w-4xl mx-auto text-center space-y-6 pb-16 border-b border-zinc-900">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-xs uppercase tracking-widest">
          <span>{badge}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
          {title}
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>

        {/* Central Brand Logo Badge */}
        <div className="pt-6 flex justify-center">
          <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full overflow-hidden border-2 border-zinc-800 shadow-2xl p-1 bg-zinc-900">
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src="/logo.jpg"
                alt="1Bagg3dCrew Crest"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-sm text-zinc-400 leading-relaxed">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block">
              ORIGINS & INSPIRATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              {storyHeading}
            </h2>
            <p>{storyP1}</p>
            <p>{storyP2}</p>
            <p>{storyP3}</p>
          </div>

          <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-zinc-400" />
              <span>The Core Pillars</span>
            </h3>

            <div className="space-y-4">
              <div className="border-l-2 border-zinc-700 pl-4 space-y-1">
                <h4 className="text-sm font-bold text-zinc-200">{pillar1Title}</h4>
                <p className="text-xs text-zinc-500">{pillar1Desc}</p>
              </div>

              <div className="border-l-2 border-amber-400 pl-4 space-y-1">
                <h4 className="text-sm font-bold text-amber-300">{pillar2Title}</h4>
                <p className="text-xs text-zinc-500">{pillar2Desc}</p>
              </div>

              <div className="border-l-2 border-zinc-700 pl-4 space-y-1">
                <h4 className="text-sm font-bold text-zinc-200">{pillar3Title}</h4>
                <p className="text-xs text-zinc-500">{pillar3Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Connect Section */}
      <section className="py-16 px-4 bg-zinc-950 border-t border-zinc-900" id="contact">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
            CREW HEADQUARTERS & INQUIRIES
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase">
            {contactHeading}
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto">
            {contactSub}
          </p>

          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left">
            <div className="p-4 rounded-xl bg-black border border-zinc-800 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Direct Email</span>
                <span className="text-xs font-mono font-medium text-white">{settings.contactEmail}</span>
              </div>
            </div>

            <a
              href="https://www.instagram.com/1bagg3d.crew/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-black border border-zinc-800 hover:border-zinc-600 flex items-center gap-3 transition group"
            >
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-white transition">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Instagram Handle</span>
                <span className="text-xs font-mono font-medium text-white">{settings.instagramHandle}</span>
              </div>
            </a>
          </div>

          <div className="pt-8">
            <Link
              href="/merch"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs tracking-widest uppercase rounded-lg transition"
            >
              <span>Explore The Store</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
