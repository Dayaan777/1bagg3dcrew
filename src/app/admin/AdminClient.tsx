'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Product, SiteSettings, WaitlistLead, Category } from '@/lib/db';
import { 
  Shield, Lock, LogOut, Plus, Trash2, Edit3, Check, RefreshCw, 
  ShoppingBag, Users, ExternalLink, Save, X, Image as ImageIcon,
  Upload, FileText, ChevronRight, Sliders, Eye, LayoutGrid, List,
  ArrowLeft, Tag, Layers, Truck
} from 'lucide-react';
import Link from 'next/link';

interface AdminClientProps {
  initialProducts: Product[];
  initialSettings: SiteSettings;
  initialWaitlist: WaitlistLead[];
  initialCategories?: Category[];
}

export default function AdminClient({ initialProducts, initialSettings, initialWaitlist, initialCategories = [] }: AdminClientProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Dashboard Data State
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [waitlist, setWaitlist] = useState<WaitlistLead[]>(initialWaitlist);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'shipping' | 'settings'>('products');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Categories CRUD State
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);

  // Modal State for Add / Edit Product
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingSecondary, setUploadingSecondary] = useState(false);
  const [secondaryInputUrl, setSecondaryInputUrl] = useState('');

  // File input refs
  const coverInputRef = useRef<HTMLInputElement>(null);
  const secondaryInputRef = useRef<HTMLInputElement>(null);

  // Settings Save State
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/check');
      const data = await res.json();
      setIsAuthenticated(data.authenticated === true);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        refreshData();
      } else {
        setLoginError(data.error || 'Invalid admin password');
      }
    } catch {
      setLoginError('Login failed. Please check network connection.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const refreshData = async () => {
    try {
      const [prodRes, settRes, waitRes, catRes] = await Promise.all([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/waitlist').then(r => r.json()),
        fetch('/api/categories').then(r => r.json()),
      ]);

      if (prodRes.products) setProducts(prodRes.products);
      if (settRes.settings) setSettings(settRes.settings);
      if (waitRes.leads) setWaitlist(waitRes.leads);
      if (catRes.categories) setCategories(catRes.categories);
    } catch (e) {
      console.error('Failed to refresh admin data:', e);
    }
  };

  // Categories Handlers
  const openNewCategoryModal = () => {
    setEditingCategory({
      name: '',
      slug: '',
      description: ''
    });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    setEditingCategory({ ...cat });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name?.trim()) return;

    setSavingCategory(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory)
      });
      const data = await res.json();
      if (data.success && data.category) {
        setCategories(prev => {
          const exists = prev.some(c => c.id === data.category.id);
          if (exists) {
            return prev.map(c => c.id === data.category.id ? data.category : c);
          }
          return [...prev, data.category];
        });
        setIsCategoryModalOpen(false);
        setEditingCategory(null);
      } else {
        alert(data.error || 'Failed to save category');
      }
    } catch (err) {
      alert('Network error while saving category');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCategories(prev => prev.filter(c => c.id !== id));
      } else {
        alert(data.error || 'Failed to delete category');
      }
    } catch {
      alert('Network error while deleting category');
    }
  };

  // Image Upload helper
  const handleUploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        return data.url;
      } else {
        alert(data.error || 'Image upload failed');
        return null;
      }
    } catch (err) {
      alert('Network error while uploading image');
      return null;
    }
  };

  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;
    setUploadingCover(true);
    const url = await handleUploadFile(file);
    if (url) {
      setEditingProduct(prev => prev ? ({ ...prev, image: url }) : null);
    }
    setUploadingCover(false);
  };

  const handleSecondaryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;
    setUploadingSecondary(true);
    const url = await handleUploadFile(file);
    if (url) {
      setEditingProduct(prev => {
        if (!prev) return null;
        const currentImages = prev.images || [];
        return { ...prev, images: [...currentImages, url] };
      });
    }
    setUploadingSecondary(false);
  };

  const addSecondaryImageUrl = () => {
    if (!secondaryInputUrl.trim() || !editingProduct) return;
    const currentImages = editingProduct.images || [];
    setEditingProduct({
      ...editingProduct,
      images: [...currentImages, secondaryInputUrl.trim()]
    });
    setSecondaryInputUrl('');
  };

  const removeSecondaryImage = (idxToRemove: number) => {
    if (!editingProduct) return;
    const currentImages = editingProduct.images || [];
    setEditingProduct({
      ...editingProduct,
      images: currentImages.filter((_, i) => i !== idxToRemove)
    });
  };

  // Product CRUD
  const openNewProductModal = () => {
    setEditingProduct({
      id: '',
      title: '',
      slug: '',
      price: 45,
      category: 'merch',
      description: '',
      image: '',
      images: [],
      featured: true,
      featureInMerch: true,
      featureInAirSuspension: false,
      isComingSoon: false,
      stock: 50,
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
    });
    setSecondaryInputUrl('');
    setIsModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct({
      ...product,
      images: product.images || [],
      featureInMerch: product.featureInMerch !== undefined ? product.featureInMerch : (product.category !== 'air-suspension'),
      featureInAirSuspension: product.featureInAirSuspension !== undefined ? product.featureInAirSuspension : (product.category === 'air-suspension')
    });
    setSecondaryInputUrl('');
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title || editingProduct?.price === undefined) return;

    setSavingProduct(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });
      const data = await res.json();
      if (data.success && data.product) {
        // Optimistically update products state immediately for instant responsive UI
        setProducts(prev => {
          const exists = prev.some(p => p.id === data.product.id);
          if (exists) {
            return prev.map(p => p.id === data.product.id ? data.product : p);
          }
          return [data.product, ...prev];
        });
        setIsModalOpen(false);
        setEditingProduct(null);
      } else {
        alert(data.error || 'Failed to save product');
      }
    } catch {
      alert('Error saving product');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}"?`)) return;

    // Immediately remove from UI state for instant responsive feedback
    setProducts(prev => prev.filter(p => p.id !== id));

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Failed to delete');
        await refreshData();
      }
    } catch {
      alert('Network error while deleting product');
      await refreshData();
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSavedMessage(true);
        setTimeout(() => setSettingsSavedMessage(false), 3000);
      }
    } catch {
      alert('Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // Render Login Screen if not authenticated
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-zinc-500 font-mono text-xs">
          <RefreshCw className="w-4 h-4 animate-spin text-zinc-400" />
          <span>Verifying security credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-950 border border-zinc-900 p-8 rounded-2xl shadow-2xl relative">
          <div className="text-center space-y-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-white">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black uppercase tracking-wider text-white">
              Executive Dashboard
            </h1>
            <p className="text-xs text-zinc-500 font-mono">
              Authorized access only. Enter master key.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Master Security Key
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-white transition font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs tracking-widest uppercase rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Access Management Console</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Executive Dashboard
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Top Admin Bar */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold tracking-wider uppercase">
              LIVE CONSOLE
            </span>
            <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
              1BAGG3DCREW Management Suite
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-mono flex items-center gap-2 border border-zinc-800 hover:border-zinc-700 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Go Back to Website</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-300 text-xs font-mono flex items-center gap-1.5 border border-zinc-800 hover:border-rose-900/50 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-4">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase transition flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-white text-black font-bold shadow-md'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Products & Merch ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase transition flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'bg-white text-black font-bold shadow-md'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase transition flex items-center gap-2 ${
              activeTab === 'shipping'
                ? 'bg-white text-black font-bold shadow-md'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Shipping Info</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase transition flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-white text-black font-bold shadow-md'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Site Content & Banners</span>
          </button>
        </div>

        {/* TAB 1: PRODUCTS MANAGER */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Header controls with View Mode Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold uppercase text-white">
                  Inventory & Products Catalog
                </h2>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Full control over main cover images, secondary angles, pricing, stock, and placement across MERCH and AIR SUSPENSION pages.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* View switcher */}
                <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono flex items-center gap-1.5 transition ${
                      viewMode === 'grid'
                        ? 'bg-white text-black font-bold shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                    title="Grid Card View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Cards</span>
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono flex items-center gap-1.5 transition ${
                      viewMode === 'table'
                        ? 'bg-white text-black font-bold shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                    title="Table List View"
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Table</span>
                  </button>
                </div>

                <button
                  onClick={openNewProductModal}
                  className="px-4 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono uppercase tracking-wider rounded-lg transition flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* CARD GRID VIEW */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-zinc-950 border border-zinc-800 hover:border-zinc-600 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-xl"
                  >
                    <div>
                      {/* Image Preview */}
                      <div className="relative aspect-square w-full bg-zinc-900 overflow-hidden border-b border-zinc-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Top Category and Status Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                          <span className="px-2.5 py-1 rounded bg-black/90 text-[10px] font-mono font-bold tracking-wider text-zinc-200 border border-zinc-700 uppercase">
                            {p.category}
                          </span>

                          {p.isComingSoon ? (
                            <span className="px-2.5 py-1 rounded bg-black/90 text-amber-400 border border-amber-500/50 text-[10px] font-mono font-bold tracking-wider uppercase">
                              COMING SOON
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded bg-black/90 text-emerald-400 border border-emerald-500/50 text-[10px] font-mono font-bold tracking-wider uppercase">
                              ACTIVE
                            </span>
                          )}
                        </div>

                        {/* Secondary Angles Count */}
                        {p.images && p.images.length > 0 && (
                          <div className="absolute bottom-3 right-3">
                            <span className="px-2 py-1 rounded bg-black/90 text-[10px] font-mono text-zinc-300 border border-zinc-800 flex items-center gap-1">
                              <ImageIcon className="w-3 h-3 text-zinc-400" />
                              <span>+{p.images.length} angles</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Info */}
                      <div className="p-5 space-y-3">
                        {/* Product Title */}
                        <div>
                          <h3 
                            className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug cursor-pointer"
                            onClick={() => openEditProductModal(p)}
                            title={p.title}
                          >
                            {p.title}
                          </h3>
                        </div>

                        {/* Price & Stock */}
                        <div className="flex items-center justify-between pt-1 border-t border-zinc-900">
                          <span className="text-xl font-black font-mono text-white tracking-tight">
                            ${p.price.toFixed(2)}
                          </span>
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                            {p.stock} units
                          </span>
                        </div>

                        {/* Product Description */}
                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {p.description || 'No description entered.'}
                        </p>

                        {/* Active Placement Badges */}
                        <div className="pt-2 flex flex-wrap gap-1.5 border-t border-zinc-900">
                          {p.featureInMerch !== false && (
                            <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/40 text-[10px] font-mono font-semibold uppercase">
                              MERCH PAGE
                            </span>
                          )}
                          {p.featureInAirSuspension && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-semibold uppercase">
                              AIR DIVISION
                            </span>
                          )}
                          {p.featured && (
                            <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-semibold uppercase">
                              HOME REEL
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-4 border-t border-zinc-900 bg-zinc-950 flex items-center justify-between gap-2">
                      <Link
                        href={`/merch/${p.slug}`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono border border-zinc-800 flex items-center gap-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-zinc-400" />
                        <span>View</span>
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditProductModal(p)}
                          className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-mono font-bold flex items-center gap-1.5 transition shadow"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(p.id, p.title)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-900/50 transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TABLE LIST VIEW */}
            {viewMode === 'table' && (
              <div className="bg-zinc-950 border border-zinc-850 rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-900/90 text-zinc-400 font-mono uppercase tracking-wider border-b border-zinc-800">
                      <tr>
                        <th className="p-4">Cover & Title</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Placements</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-zinc-900/40 transition">
                          <td className="p-4 flex items-center gap-3">
                            <div className="w-14 h-14 rounded-lg bg-zinc-900 overflow-hidden shrink-0 border border-zinc-800 relative group">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                              {p.images && p.images.length > 0 && (
                                <span className="absolute bottom-0 right-0 bg-black/80 text-[9px] font-mono text-zinc-300 px-1 rounded-tl">
                                  +{p.images.length}
                                </span>
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-white block text-sm">{p.title}</span>
                              <span className="text-[11px] text-zinc-500 font-mono">{p.slug}</span>
                            </div>
                          </td>

                          <td className="p-4 font-mono">
                            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 uppercase text-[10px]">
                              {p.category}
                            </span>
                          </td>

                          <td className="p-4 font-mono font-bold text-white text-sm">
                            ${p.price.toFixed(2)}
                          </td>

                          <td className="p-4 font-mono text-zinc-300">
                            {p.stock} units
                          </td>

                          <td className="p-4">
                            <div className="flex flex-col gap-1">
                              {p.featureInMerch !== false && (
                                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-mono inline-block w-fit">
                                  MERCH PAGE
                                </span>
                              )}
                              {p.featureInAirSuspension && (
                                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono inline-block w-fit">
                                  AIR SUSPENSION
                                </span>
                              )}
                              {p.featured && (
                                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-mono inline-block w-fit">
                                  HOME FEATURED
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-4">
                            {p.isComingSoon ? (
                              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono">
                                COMING SOON
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                                ACTIVE
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/merch/${p.slug}`}
                                target="_blank"
                                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition"
                                title="View on Store"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>

                              <button
                                onClick={() => openEditProductModal(p)}
                                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition"
                                title="Edit Product"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteProduct(p.id, p.title)}
                                className="p-2 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CATEGORIES MANAGER */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold uppercase text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-white" />
                  <span>Category Architecture</span>
                </h2>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Manage product categories for catalog filters and product classification across the entire store.
                </p>
              </div>

              <button
                onClick={openNewCategoryModal}
                className="px-4 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono uppercase tracking-wider rounded-lg transition flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            {/* Categories List Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const assignedCount = products.filter(p => p.category === cat.slug || p.category === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                          {assignedCount} {assignedCount === 1 ? 'product' : 'products'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white tracking-wide">
                        {cat.name}
                      </h3>

                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {cat.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-900 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditCategoryModal(cat)}
                        className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 rounded-lg text-xs font-mono flex items-center gap-1.5 transition border border-zinc-800"
                        title="Edit Category"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-2 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: SHIPPING INFO & POLICIES */}
        {activeTab === 'shipping' && (
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold uppercase text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-white" />
                  <span>Shipping Info & Store Policies</span>
                </h2>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Update shipping rates, delivery estimates, return policies, terms of service, and privacy guidelines.
                </p>
              </div>

              {settingsSavedMessage && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  <Check className="w-4 h-4" />
                  <span>Shipping Info Saved Live!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6 bg-zinc-950 border border-zinc-850 p-6 sm:p-8 rounded-2xl shadow-xl">
              {/* Threshold & Rates */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-2">
                  1. Shipping Rates & Free Shipping Threshold
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-300 font-semibold mb-1">
                      Free Shipping Threshold ($ USD)
                    </label>
                    <input
                      type="number"
                      value={settings.shippingThreshold ?? 100}
                      onChange={(e) => setSettings({ ...settings, shippingThreshold: Number(e.target.value) || 0 })}
                      className="w-full bg-black border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-300 font-semibold mb-1">
                      Domestic Flat Rate ($ USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.shippingDomesticRate ?? 8}
                      onChange={(e) => setSettings({ ...settings, shippingDomesticRate: Number(e.target.value) || 0 })}
                      className="w-full bg-black border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-300 font-semibold mb-1">
                      International Rate ($ USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.shippingInternationalRate ?? 20}
                      onChange={(e) => setSettings({ ...settings, shippingInternationalRate: Number(e.target.value) || 0 })}
                      className="w-full bg-black border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-300 font-semibold mb-1">
                      Estimated Domestic Delivery Time
                    </label>
                    <input
                      type="text"
                      value={settings.shippingEstimatedDomestic || '3-5 Business Days'}
                      onChange={(e) => setSettings({ ...settings, shippingEstimatedDomestic: e.target.value })}
                      placeholder="e.g. 3-5 Business Days"
                      className="w-full bg-black border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-300 font-semibold mb-1">
                      Estimated International Delivery Time
                    </label>
                    <input
                      type="text"
                      value={settings.shippingEstimatedInternational || '7-14 Business Days'}
                      onChange={(e) => setSettings({ ...settings, shippingEstimatedInternational: e.target.value })}
                      placeholder="e.g. 7-14 Business Days"
                      className="w-full bg-black border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping & Return Details */}
              <div className="space-y-4 pt-4 border-t border-zinc-900">
                <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-2">
                  2. Detailed Shipping & Returns Information
                </h3>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-300 font-semibold mb-1">
                    Shipping Policy Text
                  </label>
                  <textarea
                    rows={4}
                    value={settings.shippingPolicyText || ''}
                    onChange={(e) => setSettings({ ...settings, shippingPolicyText: e.target.value })}
                    placeholder="Enter your detailed shipping guidelines, couriers used, packaging standards..."
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white leading-relaxed font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-300 font-semibold mb-1">
                    Returns & Exchanges Policy Text
                  </label>
                  <textarea
                    rows={3}
                    value={settings.shippingReturnsPolicy || ''}
                    onChange={(e) => setSettings({ ...settings, shippingReturnsPolicy: e.target.value })}
                    placeholder="Enter policy regarding returns, sizing exchanges, inspection periods..."
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white leading-relaxed font-mono"
                  />
                </div>
              </div>

              {/* Terms and Privacy policy editor */}
              <div className="space-y-4 pt-4 border-t border-zinc-900">
                <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-2">
                  3. Terms of Service & Privacy Policy Content
                </h3>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-300 font-semibold mb-1">
                    Terms of Service Summary / Content
                  </label>
                  <textarea
                    rows={3}
                    value={settings.termsContent || ''}
                    onChange={(e) => setSettings({ ...settings, termsContent: e.target.value })}
                    placeholder="Terms and conditions summary..."
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white leading-relaxed font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-300 font-semibold mb-1">
                    Privacy Policy Statement
                  </label>
                  <textarea
                    rows={3}
                    value={settings.privacyContent || ''}
                    onChange={(e) => setSettings({ ...settings, privacyContent: e.target.value })}
                    placeholder="Privacy policy and data protection declaration..."
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white leading-relaxed font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900 flex justify-end">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-8 py-3 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs font-mono uppercase tracking-wider rounded-lg transition shadow-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSettings ? 'Saving...' : 'Save Shipping Info & Policies'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: SITE CONTENT & BANNERS */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-xl font-bold uppercase text-white">
                Live Store Content & Toggles
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Update announcement banners, hero taglines, release status, and contact emails.
              </p>
            </div>

            {settingsSavedMessage && (
              <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Live changes saved successfully! Refresh store to see immediate updates.</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="bg-zinc-950 border border-zinc-850 rounded-xl p-6 sm:p-8 space-y-5 shadow-2xl">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Top Announcement Bar
                </label>
                <input
                  type="text"
                  value={settings.announcement}
                  onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Hero Headline / Tagline
                </label>
                <input
                  type="text"
                  value={settings.heroTagline}
                  onChange={(e) => setSettings({ ...settings, heroTagline: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Hero Subtitle Description
                </label>
                <textarea
                  rows={3}
                  value={settings.heroSubtitle}
                  onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Air Suspension Badge Status
                  </label>
                  <input
                    type="text"
                    value={settings.airSuspensionStatus}
                    onChange={(e) => setSettings({ ...settings, airSuspensionStatus: e.target.value })}
                    placeholder="e.g. COMING SOON or PRE-ORDER"
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Release Target Date
                  </label>
                  <input
                    type="text"
                    value={settings.releaseDate}
                    onChange={(e) => setSettings({ ...settings, releaseDate: e.target.value })}
                    placeholder="e.g. SPRING 2026"
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Contact Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={settings.instagramHandle}
                    onChange={(e) => setSettings({ ...settings, instagramHandle: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900 flex justify-end">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-8 py-3 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs font-mono uppercase tracking-wider rounded-lg transition shadow-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSettings ? 'Saving...' : 'Save & Publish Live Content'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Product Add / Edit Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-hidden">
          {/* Modal Container */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col text-zinc-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Sticky Header with Live Title Display */}
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950 shrink-0">
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white shrink-0">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold uppercase tracking-tight text-white truncate">
                    {editingProduct.id ? (editingProduct.title || 'Edit Product') : 'Add New Product'}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition shrink-0"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              
              {/* Title & Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-300 font-semibold mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.title || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    placeholder="e.g. 1Bagg3d Heavyweight Tee"
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white font-medium"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono uppercase text-zinc-300 font-semibold">
                      Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setActiveTab('categories');
                      }}
                      className="text-[10px] font-mono text-zinc-400 hover:text-white underline"
                    >
                      Manage Categories
                    </button>
                  </div>
                  <select
                    value={editingProduct.category || (categories[0]?.slug || 'merch')}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
                  >
                    {categories && categories.length > 0 ? (
                      categories.map(cat => (
                        <option key={cat.id} value={cat.slug || cat.id}>
                          {cat.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="merch">Apparel & Tops</option>
                        <option value="air-suspension">Air Suspension</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Price, Stock, Slug Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-300 font-semibold mb-1.5">
                    Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price ?? 45}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-300 font-semibold mb-1.5">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={editingProduct.stock ?? 25}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-300 font-semibold mb-1.5">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingProduct.slug || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                    placeholder="auto-generated from title"
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
                  />
                </div>
              </div>

              {/* COVER MAIN IMAGE SECTION */}
              <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-xs font-mono uppercase text-white font-bold flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Main Cover Image *</span>
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500">
                    Primary photo for catalog cards & product page hero
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0 shadow flex items-center justify-center">
                    {editingProduct.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={editingProduct.image}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-zinc-600 p-2 text-center">
                        <ImageIcon className="w-6 h-6 stroke-1 mb-1" />
                        <span className="text-[9px] font-mono">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div>
                      <input
                        type="file"
                        ref={coverInputRef}
                        accept="image/*"
                        onChange={handleCoverFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        disabled={uploadingCover}
                        className="px-4 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-mono font-bold rounded-lg flex items-center gap-2 transition"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingCover ? 'Uploading file...' : 'Upload Cover From Computer'}</span>
                      </button>
                    </div>

                    <details className="text-[11px] font-mono text-zinc-500">
                      <summary className="cursor-pointer hover:text-zinc-300 transition">
                        or enter direct image URL
                      </summary>
                      <input
                        type="text"
                        value={editingProduct.image || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                        placeholder="Paste image URL (https://... or /uploads/...)"
                        className="mt-2 w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white font-mono"
                      />
                    </details>
                  </div>
                </div>
              </div>

              {/* SECONDARY GALLERY IMAGES SECTION */}
              <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-xs font-mono uppercase text-white font-bold flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Secondary Angles & Gallery ({editingProduct.images?.length || 0})</span>
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500">
                    Additional multi-angle photos for product page
                  </span>
                </div>

                {/* Thumbnails of secondary images */}
                {editingProduct.images && editingProduct.images.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {editingProduct.images.map((imgUrl, idx) => (
                      <div key={idx} className="relative group w-14 h-14 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imgUrl} alt={`Secondary ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeSecondaryImage(idx)}
                          className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 hover:text-rose-300 transition"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      ref={secondaryInputRef}
                      accept="image/*"
                      onChange={handleSecondaryFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => secondaryInputRef.current?.click()}
                      disabled={uploadingSecondary}
                      className="px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition whitespace-nowrap"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingSecondary ? 'Uploading...' : 'Upload Angle Photo'}</span>
                    </button>
                  </div>

                  <details className="text-[11px] font-mono text-zinc-500">
                    <summary className="cursor-pointer hover:text-zinc-300 transition">
                      or add angle by direct image URL
                    </summary>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={secondaryInputUrl}
                        onChange={(e) => setSecondaryInputUrl(e.target.value)}
                        placeholder="Paste image URL and click Add"
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={addSecondaryImageUrl}
                        className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-mono border border-zinc-700 whitespace-nowrap"
                      >
                        Add URL
                      </button>
                    </div>
                  </details>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-300 font-semibold mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Product specs, fabric GSM, fit style..."
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white leading-relaxed"
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-300 font-semibold mb-1.5">
                  Available Sizes (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingProduct.sizes?.join(', ') || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  placeholder="S, M, L, XL, 2XL"
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
                />
              </div>

              {/* Placement & Feature Toggles */}
              <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold block">
                  Page Placements & Feature Settings
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition">
                    <input
                      type="checkbox"
                      checked={editingProduct.featureInMerch !== false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, featureInMerch: e.target.checked })}
                      className="rounded bg-black border-zinc-700 text-white focus:ring-0 w-4 h-4"
                    />
                    <span className="text-zinc-200">Feature on MERCH Page</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition">
                    <input
                      type="checkbox"
                      checked={editingProduct.featureInAirSuspension || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, featureInAirSuspension: e.target.checked })}
                      className="rounded bg-black border-zinc-700 text-white focus:ring-0 w-4 h-4"
                    />
                    <span className="text-zinc-200">Feature on AIR SUSPENSION Page</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition">
                    <input
                      type="checkbox"
                      checked={editingProduct.featured || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                      className="rounded bg-black border-zinc-700 text-white focus:ring-0 w-4 h-4"
                    />
                    <span className="text-zinc-200">Feature on HOME Page</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition">
                    <input
                      type="checkbox"
                      checked={editingProduct.isComingSoon || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isComingSoon: e.target.checked })}
                      className="rounded bg-black border-zinc-700 text-white focus:ring-0 w-4 h-4"
                    />
                    <span className="text-zinc-200">Mark as Coming Soon</span>
                  </label>
                </div>
              </div>

              {/* Modal Sticky/Anchored Footer with Action Buttons */}
              <div className="pt-4 flex items-center justify-between gap-3 sticky bottom-0 bg-zinc-950 py-2">
                <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
                  Click Save to apply changes immediately
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 sm:flex-initial px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono uppercase rounded-lg border border-zinc-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProduct}
                    className="flex-1 sm:flex-initial px-7 py-2.5 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs font-mono uppercase rounded-lg transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingProduct ? 'Saving...' : 'Save Product'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY ADD / EDIT MODAL */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-zinc-900 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold uppercase text-white">
                  {editingCategory.id ? 'Edit Category' : 'Create New Category'}
                </h3>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">
                  Set display name and URL routing slug
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-300 font-semibold mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autoSlug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
                    setEditingCategory({
                      ...editingCategory,
                      name,
                      slug: autoSlug
                    });
                  }}
                  placeholder="e.g. Hoodies & Tops"
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-300 font-semibold mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="Optional brief description of this product line"
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono rounded-lg transition border border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCategory}
                  className="px-6 py-2 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs font-mono uppercase rounded-lg transition shadow-lg flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingCategory ? 'Saving...' : 'Save Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
