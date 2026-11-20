import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { getSettings } from '@/lib/db';

export const metadata = {
  title: 'Terms of Service | 1BAGG3DCREW',
  description: 'Official terms of service, automotive performance equipment disclaimer, and merchandise sales agreements.',
};

export default async function TermsPage() {
  const settings = await getSettings();

  const termsText = settings.termsContent || 
    'By visiting our site and purchasing from 1Bagg3dCrew, you engage in our service and agree to be bound by our terms and conditions. All automotive performance parts, air suspension components, and streetwear merchandise are sold under strict compliance standards. Automotive suspension modifications must be installed by certified professionals.';

  return (
    <div className="min-h-screen bg-black text-white pt-10 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-4 border-b border-zinc-900 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-amber-400 uppercase tracking-widest">
            <FileText className="w-3.5 h-3.5" />
            <span>USER AGREEMENT & PURCHASE CONDITIONS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-2xl font-mono">
            Effective Date: 2026. Please read these terms carefully prior to completing any order on 1Bagg3dCrew.
          </p>
        </div>

        {/* Content Section */}
        <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-zinc-300 font-mono">
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-4">
            <h2 className="text-base font-bold uppercase text-white font-sans tracking-wide">
              1. Overview & Acceptance
            </h2>
            <p>{termsText}</p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-4">
            <h2 className="text-base font-bold uppercase text-white font-sans tracking-wide">
              2. Automotive Air Suspension & Performance Disclaimer
            </h2>
            <p className="text-zinc-400">
              Air suspension kits, struts, compressors, and management manifolds sold by 1Bagg3dCrew are engineered for high-performance automotive use. Due to the critical nature of suspension mechanics, installation must be carried out by professional automotive technicians with proper alignment equipment.
            </p>
            <p className="text-zinc-400">
              The buyer assumes all liability for ensuring vehicle fitment, operating pressures, and compliance with local chassis modification regulations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-4">
            <h2 className="text-base font-bold uppercase text-white font-sans tracking-wide">
              3. Merchandise & Limited Drops
            </h2>
            <p>
              Streetwear drops (hoodies, heavy tees, jet tags, racing caps) are produced in limited quantities. We reserve the right to limit order quantities per customer to prevent unauthorized automated scalping. All orders are subject to stock verification.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-4">
            <h2 className="text-base font-bold uppercase text-white font-sans tracking-wide">
              4. Pricing & Currency
            </h2>
            <p>
              All listed prices are displayed in USD ($). We reserve the right to correct typographical errors or currency conversion discrepancies without prior notice.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-4">
            <h2 className="text-base font-bold uppercase text-white font-sans tracking-wide">
              5. Governing Law
            </h2>
            <p>
              These Terms of Service and any separate agreements whereby we provide you goods or services shall be governed by and construed in accordance with standard commercial trade laws. Direct disputes or inquiries to <strong className="text-white">{settings.contactEmail || 'info@1bagg3dcrew.com'}</strong>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
