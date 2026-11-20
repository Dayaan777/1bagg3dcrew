'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Product, Category } from '@/lib/db';
import { useCart } from '@/context/CartContext';
import { Search, ShoppingBag, Check, Eye, SlidersHorizontal } from 'lucide-react';

interface MerchClientProps {
  initialProducts: Product[];
  initialCategories?: Category[];
}

export default function MerchClient({ initialProducts, initialCategories = [] }: MerchClientProps) {
  const searchParams = useSearchParams();
  const searchParamQuery = searchParams.get('q') || '';
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(searchParamQuery);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [addedId, setAddedId] = useState<string | null>(null);

  // Dynamic categories with fallback
  const categories = useMemo(() => {
    const list = [{ id: 'all', label: 'All Merch' }];
    if (initialCategories && initialCategories.length > 0) {
      initialCategories.forEach(cat => {
        list.push({ id: cat.slug || cat.id, label: cat.name });
      });
    } else {
      list.push({ id: 'merch', label: 'Apparel & Tops' });
    }
    return list;
  }, [initialCategories]);

  // Filter items for Merch catalog (strictly respecting featureInMerch toggle)
  const filteredProducts = useMemo(() => {
    let list = initialProducts.filter(p => !p.isComingSoon && p.featureInMerch === true);

    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard';
    addItem(product, defaultSize, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-8 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="py-10 border-b border-zinc-900">
          <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-3">
            <span>OFFICIAL APPAREL DIVISION</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            Merchandise
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl mt-3 leading-relaxed">
            High-density milled fabrics, French terry weights, and custom automotive prints. All pieces are printed and packaged with meticulous attention to detail.
          </p>
        </div>

        {/* Filter and Controls Toolbar */}
        <div className="py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-medium tracking-wider uppercase transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-white text-black shadow-lg shadow-white/5 font-bold'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-850 border border-zinc-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition"
              />
            </div>

            {/* Sort Select */}
            <div className="relative w-full sm:w-44">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-zinc-900/90 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-zinc-600 font-mono"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="py-4 flex justify-between items-center text-xs font-mono text-zinc-500">
          <span>Showing {filteredProducts.length} items</span>
          <span>Free shipping over $100</span>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center text-zinc-500 space-y-3">
            <p className="text-lg font-semibold text-zinc-300">No products found</p>
            <p className="text-xs text-zinc-500">Try adjusting your search terms or filter selection.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-300 hover:text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product) => {
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

                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wider bg-black/80 text-zinc-300 border border-zinc-800 backdrop-blur-sm uppercase">
                        {product.category}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4 z-20">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedProduct(product);
                          setSelectedSize(product.sizes?.[0] || 'M');
                        }}
                        className="px-3 py-2 bg-zinc-900/90 hover:bg-zinc-800 text-white rounded-lg text-xs font-mono border border-zinc-700 flex items-center gap-1.5 backdrop-blur-sm transition"
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
                        className="px-3 py-2 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 shadow-lg transition"
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
        )}

      </div>

      {/* Product Detail Modal */}
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
    </div>
  );
}
