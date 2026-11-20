'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/db';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, ShoppingBag, Check, Ruler, Share2 } from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'sizing' | 'shipping'>('details');
  const [added, setAdded] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Multi-angle thumbnail simulator for realistic apparel display
  const [selectedImage, setSelectedImage] = useState<string>(product.image);

  const handleAddToCart = () => {
    addItem(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-6 pb-24">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <Link 
              href="/merch" 
              className="text-zinc-400 hover:text-white flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Merch</span>
            </Link>
            <span>/</span>
            <span className="uppercase text-zinc-600">{product.category}</span>
            <span>/</span>
            <span className="text-zinc-300 truncate max-w-[200px] sm:max-w-xs">{product.title}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-zinc-500 hover:text-white transition"
            title="Copy link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Image Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Large Image Frame */}
            <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-900 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-cover transition duration-700 hover:scale-105"
              />

              {/* Tag / Category Badge */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="px-3 py-1 rounded bg-black/80 backdrop-blur-md border border-zinc-800 text-[10px] font-mono tracking-widest text-zinc-300 uppercase">
                  {product.category}
                </span>
                {product.isComingSoon && (
                  <span className="px-3 py-1 rounded bg-amber-500/10 backdrop-blur-md border border-amber-500/30 text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                    COMING SOON
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Strip (Main image + Secondary gallery images) */}
            {(() => {
              const allImages = Array.from(new Set([product.image, ...(product.images || [])])).filter(Boolean);
              if (allImages.length <= 1) return null;
              return (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {allImages.map((imgSrc, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(imgSrc)}
                      className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border bg-zinc-950 transition ${
                        selectedImage === imgSrc
                          ? 'border-white ring-1 ring-white'
                          : 'border-zinc-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgSrc} alt={`${product.title} angle ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Right Column: Product Info & Purchase Controls (5 cols, sticky) */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
            {/* Header info */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase block">
                1BAGG3D.CREW • APPAREL DIVISION
              </span>
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                {product.title}
              </h1>
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-zinc-500 uppercase">
                  USD • Taxes Included
                </span>
              </div>
            </div>

            {/* Clean Description */}
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono uppercase tracking-wider text-zinc-400">
                    Select Size: <strong className="text-white">{selectedSize}</strong>
                  </span>
                  <button
                    onClick={() => setShowSizeModal(true)}
                    className="text-zinc-500 hover:text-white underline underline-offset-4 flex items-center gap-1 font-mono text-[11px]"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[54px] px-4 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                        selectedSize === size
                          ? 'bg-white text-black shadow-lg shadow-white/10 scale-[1.02]'
                          : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Purchase Button */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 text-zinc-400 hover:text-white flex items-center justify-center font-mono text-base rounded"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono text-xs font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 text-zinc-400 hover:text-white flex items-center justify-center font-mono text-base rounded"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {product.isComingSoon ? (
                  <Link
                    href="/air-suspension#waitlist"
                    className="flex-1 py-3.5 px-6 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs font-mono tracking-widest uppercase transition-all shadow-xl shadow-amber-500/10 text-center"
                  >
                    Join VIP Waitlist
                  </Link>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 px-6 rounded-lg bg-white hover:bg-zinc-200 text-black font-extrabold text-xs font-mono tracking-widest uppercase transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2 group"
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Added To Bag ✓</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add To Bag • ${(product.price * quantity).toFixed(2)}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* In-Stock Dispatch Notice */}
              <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span>
                  {product.isComingSoon 
                    ? 'Engineering development phase • Register for priority batch allocation' 
                    : 'In stock — Dispatches within 24-48 hours with full tracking'}
                </span>
              </div>
            </div>

            {/* Accordion Tabs for Authentic Streetwear Specifications */}
            <div className="border-t border-zinc-900 pt-6 space-y-4">
              <div className="flex items-center gap-4 border-b border-zinc-900 pb-3 text-xs font-mono">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-1 uppercase tracking-wider transition ${
                    activeTab === 'details' ? 'text-white border-b-2 border-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Fabric & Spec
                </button>
                <button
                  onClick={() => setActiveTab('sizing')}
                  className={`pb-1 uppercase tracking-wider transition ${
                    activeTab === 'sizing' ? 'text-white border-b-2 border-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Fit Advice
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-1 uppercase tracking-wider transition ${
                    activeTab === 'shipping' ? 'text-white border-b-2 border-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Shipping & Returns
                </button>
              </div>

              {/* Tab 1: Fabric & Spec */}
              {activeTab === 'details' && (
                <div className="text-xs text-zinc-400 space-y-2 leading-relaxed">
                  <p>• Ultra-dense combed organic cotton French terry milled specifically for 1Bagg3dCrew.</p>
                  <p>• High-density technical embroidery on front chest and woven hem label insignia.</p>
                  <p>• Mineral stone enzyme wash for a soft vintage broken-in hand feel.</p>
                  <p>• Double-needle topstitch reinforced collar, cuffs, and hem.</p>
                </div>
              )}

              {/* Tab 2: Fit Advice */}
              {activeTab === 'sizing' && (
                <div className="text-xs text-zinc-400 space-y-2 leading-relaxed">
                  <p>• <strong>Silhouette:</strong> Modern relaxed boxy cut with dropped shoulders.</p>
                  <p>• <strong>Recommendation:</strong> Order your true size for a relaxed streetwear silhouette, or size down for a standard tailored fit.</p>
                  <p>• Pre-shrunk fabric to minimize shrinkage after washing.</p>
                </div>
              )}

              {/* Tab 3: Shipping */}
              {activeTab === 'shipping' && (
                <div className="text-xs text-zinc-400 space-y-2 leading-relaxed">
                  <p>• <strong>Free Shipping:</strong> On all domestic merch orders over $100.</p>
                  <p>• <strong>Processing:</strong> Orders placed before 2 PM EST ship the next business day.</p>
                  <p>• <strong>Returns:</strong> 30-day unworn exchange policy in original packaging.</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-28 border-t border-zinc-900 pt-16">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white mb-8">
              Complete The Stance
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/merch/${p.slug}`}
                  className="group flex flex-col justify-between bg-zinc-950 rounded-xl overflow-hidden border border-zinc-900 hover:border-zinc-700 transition"
                >
                  <div className="relative aspect-square w-full bg-zinc-900 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-4 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">{p.category}</span>
                    <h3 className="text-xs font-bold text-zinc-200 group-hover:text-white line-clamp-1 transition">
                      {p.title}
                    </h3>
                    <p className="text-xs font-mono font-bold text-white pt-1">
                      ${p.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sizing Chart Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 text-zinc-100 shadow-2xl relative">
            <button
              onClick={() => setShowSizeModal(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition"
            >
              ✕
            </button>

            <h3 className="text-lg font-black uppercase text-white mb-2">
              Garment Measurement Table
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Measurements taken with garment laid flat. Boxy drop-shoulder streetwear fit.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-900 text-zinc-400 uppercase border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Size</th>
                    <th className="p-3">Chest (in)</th>
                    <th className="p-3">Length (in)</th>
                    <th className="p-3">Sleeve (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  <tr>
                    <td className="p-3 font-bold text-white">S</td>
                    <td className="p-3">22.0&quot;</td>
                    <td className="p-3">27.5&quot;</td>
                    <td className="p-3">23.5&quot;</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">M</td>
                    <td className="p-3">23.5&quot;</td>
                    <td className="p-3">28.5&quot;</td>
                    <td className="p-3">24.0&quot;</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">L</td>
                    <td className="p-3">25.0&quot;</td>
                    <td className="p-3">29.5&quot;</td>
                    <td className="p-3">24.5&quot;</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">XL</td>
                    <td className="p-3">26.5&quot;</td>
                    <td className="p-3">30.5&quot;</td>
                    <td className="p-3">25.0&quot;</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">2XL</td>
                    <td className="p-3">28.0&quot;</td>
                    <td className="p-3">31.5&quot;</td>
                    <td className="p-3">25.5&quot;</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-900 text-center">
              <button
                onClick={() => setShowSizeModal(false)}
                className="px-6 py-2 bg-white text-black font-bold text-xs font-mono uppercase rounded-lg"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
