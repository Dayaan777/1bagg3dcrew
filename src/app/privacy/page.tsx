import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, CheckCircle2 } from 'lucide-react';
import { getSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Privacy Policy | 1BAGG3DCREW',
  description: 'How 1Bagg3dCrew collects, protects, and handles customer data and checkout information.',
};

export default async function PrivacyPage() {
  const settings = await getSettings();

  const privacyText = settings.privacyContent || 
    'Your privacy is critical to 1Bagg3dCrew. We collect information necessary to process your transactions, coordinate global logistics, and dispatch order tracking alerts. We do not sell, rent, or trade your personal data to third-party marketing entities under any circumstances.';

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-emerald-400 uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5" />
            <span>DATA INTEGRITY & ENCRYPTION</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-2xl font-mono">
            Last updated: 2026. This policy describes how 1Bagg3dCrew handles your personal information when you interact with our platform.
          </p>
        </div>

        {/* Content Section */}
        <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-zinc-300 font-mono">
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-4">
            <h2 className="text-base font-bold uppercase text-white font-sans tracking-wide">
              1. Information We Collect
            </h2>
            <p>{privacyText}</p>
            <p>
              When you place an order or contact us, we collect details such as your name, delivery address, email, telephone number, and payment processing tokens securely authorized through Stripe/Apple Pay/PayPal. We never store raw payment card credentials on our servers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-4">
            <h2 className="text-base font-bold uppercase text-white font-sans tracking-wide">
              2. How We Use Your Data
            </h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-400">
              <li>Processing, billing, and packaging your merchandise and hardware orders.</li>
              <li>Generating international courier shipping labels and real-time delivery notifications.</li>
              <li>Preventing fraudulent transactions and verifying order integrity.</li>
              <li>Direct customer service support regarding sizing, fitment, or tracking requests.</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-4">
            <h2 className="text-base font-bold uppercase text-white font-sans tracking-wide">
              3. Cookies and Analytics
            </h2>
            <p>
              Our platform uses essential session storage and functional cookies solely to maintain your active shopping cart drawer and provide responsive layout performance. We do not deploy intrusive third-party cross-site trackers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-4">
            <h2 className="text-base font-bold uppercase text-white font-sans tracking-wide">
              4. Data Protection & Inquiries
            </h2>
            <p>
              To request a copy of your stored records, update your shipping details, or request permanent deletion of your customer profile, contact our administration desk at <strong className="text-white">{settings.contactEmail || 'info@1bagg3dcrew.com'}</strong>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
