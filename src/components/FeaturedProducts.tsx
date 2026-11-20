'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/db';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Check, Eye } from 'lucide-react';

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [addedId, setAddedId] = useState<string | null>(null);

  const featuredList = products.filter(p => p.featured && !p.isComingSoon).slice(0, 8);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard';
    addItem(product, defaultSize, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <section className="bg-black py-20 px-4 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wider uppercase">
            Featured Products
          </h2>
        </div>

        {/* Product Grid (Inspired by the 2nd reference image) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {featuredList.map((product) => {
            const isJustAdded = addedId === product.id;
            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between bg-zinc-950 rounded-xl overflow-hidden border border-zinc-900 hover:border-zinc-700/80 transition-all duration-300"
              >
                {/* Product Image Box */}
                <Link
                  href={`/merch/${product.slug}`}
                  className="block relative aspect-square w-full bg-zinc-900 overflow-hidden cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Category Pill */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wider bg-black/80 text-zinc-300 border border-zinc-800 backdrop-blur-sm uppercase">
                      {product.category}
                    </span>
                  </div>

                  {/* Hover Quick Action */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4 z-20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedProduct(product);
                        setSelectedSize(product.sizes?.[0] || 'M');
                      }}
                      className="px-3 py-2 bg-zinc-900/90 hover:bg-zinc-800 text-white rounded-lg text-xs font-mono border border-zinc-700 flex items-center gap-1.5 backdrop-blur-sm"
                      title="Quick View"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleQuickAdd(product, e);
                      }}
                      className="px-3 py-2 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 shadow-lg"
                      title="Add to Bag"
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </Link>

                {/* Details */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <Link href={`/merch/${product.slug}`}>
                      <h3 className="text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white line-clamp-2 transition-colors">
                        {product.title}
                      </h3>
                    </Link>
                  </div>

                  <div className="mt-3 pt-3 border-t border-zinc-900/80 flex items-center justify-between">
                    <span className="text-sm font-bold text-white font-mono">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(product, e)}
                      className="text-[11px] font-mono tracking-wider text-zinc-400 hover:text-white uppercase transition-colors"
                    >
                      {isJustAdded ? 'Added ✓' : '+ Quick Add'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Merch CTA */}
        <div className="text-center mt-12">
          <Link
            href="/merch"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs font-bold tracking-widest uppercase transition-all"
          >
            <span>View Full Merchandise Catalog</span>
            <span className="text-zinc-500 font-mono">({products.filter(p => !p.isComingSoon).length} items)</span>
          </Link>
        </div>

      </div>

      {/* Quick View / Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative text-zinc-100 shadow-2xl">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="aspect-square bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  {selectedProduct.category}
                </span>

                <h3 className="text-xl font-bold text-white">
                  {selectedProduct.title}
                </h3>

                <p className="text-2xl font-black text-white font-mono">
                  ${selectedProduct.price.toFixed(2)}
                </p>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Size Selector */}
                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div>
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                      Select Size:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-3 py-1.5 text-xs font-mono font-medium rounded border transition ${
                            selectedSize === sz
                              ? 'bg-white text-black border-white'
                              : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    addItem(selectedProduct, selectedSize, 1);
                    setSelectedProduct(null);
                  }}
                  className="w-full py-3.5 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs tracking-widest uppercase rounded-lg transition shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Bag • ${(selectedProduct.price).toFixed(2)}</span>
                </button>

                <div className="text-center pt-2">
                  <Link
                    href={`/merch/${selectedProduct.slug}`}
                    className="text-xs font-mono text-zinc-400 hover:text-white underline underline-offset-4 transition"
                  >
                    View Full Product Details & Sizing Guide →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
