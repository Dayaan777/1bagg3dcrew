'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Hide global website footer when in admin dashboard
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-black border-t border-zinc-900 text-zinc-400 text-xs">
      {/* Main Footer Grid with Proper Spacing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Column 1: Brand Info & Crest (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900 shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="1Bagg3dCrew Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-base font-black text-white tracking-[0.2em] uppercase block">
                  1BAGG3DCREW
                </span>
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                  LIVE YOUR LIFE ON AIR • EST. 2026
                </span>
              </div>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              Bridging the underground stance scene with luxury heavyweight streetwear and performance chassis air suspension systems. Built for enthusiasts who refuse to ride static.
            </p>

            {/* Instagram Social Link */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://www.instagram.com/1bagg3d.crew/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @1bagg3d.crew"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white transition group"
              >
                <svg className="w-4 h-4 fill-current text-zinc-400 group-hover:text-white transition" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-xs font-mono font-medium">@1bagg3d.crew</span>
              </a>
            </div>
          </div>

          {/* Column 2: Merch Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-5">
              Collections
            </h4>
            <ul className="space-y-3 text-zinc-400 text-xs font-medium">
              <li>
                <Link href="/merch" className="hover:text-white transition flex items-center justify-between group">
                  <span>Heavyweight Hoodies</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/merch" className="hover:text-white transition flex items-center justify-between group">
                  <span>Graphic Tees</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/merch" className="hover:text-white transition flex items-center justify-between group">
                  <span>Outerwear & Crews</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/merch" className="hover:text-white transition flex items-center justify-between group">
                  <span>Jet Tags & Caps</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/merch" className="hover:text-white transition flex items-center justify-between group">
                  <span>Slap Sticker Packs</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Air Systems & Story (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-5">
              Air Division
            </h4>
            <ul className="space-y-3 text-zinc-400 text-xs font-medium">
              <li>
                <Link href="/air-suspension" className="hover:text-white transition flex items-center gap-1.5 group">
                  <span>Complete Air Kit</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    SOON
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/air-suspension#waitlist" className="hover:text-white transition">
                  VIP Waitlist Access
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About 1Bagg3dCrew
                </Link>
              </li>
              <li>
                <Link href="/about#contact" className="hover:text-white transition">
                  Crew Inquiries & Collabs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Drop Notifications Box (4 cols) */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
                  NEWSLETTER // VIP LIST
                </span>
                <h4 className="text-base font-bold text-white uppercase tracking-wider">
                  Secret Drops & Releases
                </h4>
                <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                  Get password access to limited merchandise drops and priority air suspension pre-order notifications.
                </p>
              </div>

              {subscribed ? (
                <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>You are on the VIP drop list. Welcome to the crew!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex items-center bg-black border border-zinc-800 rounded-lg p-1.5 focus-within:border-white transition">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email..."
                      className="bg-transparent text-xs text-white px-3 py-1.5 outline-none flex-1 placeholder-zinc-600"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-extrabold text-[11px] tracking-wider uppercase rounded-md transition shadow-md flex items-center gap-1 shrink-0"
                    >
                      <span>Join</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-600 font-mono">
                    Zero spam. Only authentic drops and engineering updates.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar with Clean Spacing & Payment Badges */}
      <div className="border-t border-zinc-900 bg-black py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-500 text-[11px] font-mono">
          
          {/* Copyright & Slogan */}
          <div className="text-center md:text-left space-y-1">
            <p className="text-zinc-400">
              &copy; 2026 1Bagg3dCrew. All rights reserved.
            </p>
            <p className="text-zinc-600 text-[10px]">
              Engineered with precision • Stance & Air Suspension Lifestyle
            </p>
          </div>

          {/* Payment Method Badges (Clean Monochrome) */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-zinc-400">
            <span className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800">VISA</span>
            <span className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800">MASTERCARD</span>
            <span className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800">AMEX</span>
            <span className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800">APPLE PAY</span>
            <span className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800">PAYPAL</span>
          </div>

          {/* Policies */}
          <div className="flex items-center space-x-6 text-zinc-400">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/shipping" className="hover:text-white transition">Shipping Info</Link>
          </div>

        </div>
      </div>
    </footer>
  );
}
