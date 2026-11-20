import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck, Clock, Globe, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { getSettings } from '@/lib/db';

export const metadata = {
  title: 'Shipping & Delivery Information | 1BAGG3DCREW',
  description: 'Worldwide tracked shipping guidelines, processing timelines, express courier partners, and return conditions.',
};

export default async function ShippingPage() {
  const settings = await getSettings();

  const threshold = settings.shippingThreshold ?? 100;
  const domesticTime = settings.shippingEstimatedDomestic || '3-5 Business Days';
  const intlTime = settings.shippingEstimatedInternational || '7-14 Business Days';
  const domesticRate = settings.shippingDomesticRate ?? 8;
  const intlRate = settings.shippingInternationalRate ?? 20;

  const policyText = settings.shippingPolicyText || 
    'All apparel and hardware orders are processed and packed in protective, heavyweight packaging within 24-48 business hours. Orders over $100 automatically qualify for Free Standard Tracked Shipping worldwide. Once shipped, full tracking links from DHL Express and FedEx will be dispatched to your email.';

  const returnsPolicy = settings.shippingReturnsPolicy || 
    'We accept returns and exchanges on unworn, unwashed garments with original tags attached within 14 days of delivery. For air suspension hardware, components must remain in factory sealed original packaging due to precision tolerance checks.';

  return (
    <div className="min-h-screen bg-black text-white pt-10 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
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
            <Truck className="w-3.5 h-3.5" />
            <span>GLOBAL DISPATCH POLICIES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Shipping & Delivery
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-2xl font-mono">
            Every garment and air component is inspected, hand-packed, and shipped via tracked global courier networks.
          </p>
        </div>

        {/* Shipping Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
              Free Shipping Tier
            </span>
            <div className="text-2xl font-black font-mono text-white">
              Over ${threshold}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Standard tracked worldwide shipping is automatically free on all apparel orders reaching ${threshold} USD.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
              Domestic Delivery
            </span>
            <div className="text-2xl font-black font-mono text-white">
              {domesticTime}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Standard domestic rate is ${domesticRate.toFixed(2)} USD (or free over ${threshold}). Dispatched with 24-48hr tracking.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
              Worldwide International
            </span>
            <div className="text-2xl font-black font-mono text-white">
              {intlTime}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Flat-rate international air freight is ${intlRate.toFixed(2)} USD with end-to-end customs tracking.
            </p>
          </div>
        </div>

        {/* Detailed Shipping Info */}
        <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold uppercase tracking-wide text-white">
              Order Fulfillment & Courier Partners
            </h2>
            <div className="h-0.5 w-12 bg-white" />
          </div>

          <div className="text-sm text-zinc-300 leading-relaxed space-y-4 font-mono">
            <p>{policyText}</p>
          </div>

          <div className="pt-6 border-t border-zinc-900 space-y-3">
            <h3 className="text-sm font-bold uppercase text-white font-mono flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-400" />
              <span>Returns & Exchanges Policy</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-mono">
              {returnsPolicy}
            </p>
          </div>
        </div>

        {/* Contact Assistance */}
        <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase text-white">
              Questions Regarding an Active Shipment?
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Reach our logistics desk directly at <span className="text-white">{settings.contactEmail || 'info@1bagg3dcrew.com'}</span>
            </p>
          </div>
          <Link
            href="/about"
            className="px-4 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-mono font-bold uppercase rounded-lg transition"
          >
            Contact Crew
          </Link>
        </div>

      </div>
    </div>
  );
}
