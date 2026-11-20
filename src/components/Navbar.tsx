'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface NavbarProps {
  announcement?: string;
}

export default function Navbar({ announcement }: NavbarProps) {
  const pathname = usePathname();
  const { totalCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide the global website navbar and marquee banner completely when viewing the admin dashboard
  // Notice: this is evaluated AFTER all React hooks are called to strictly adhere to React Rules of Hooks
  const isAdmin = pathname.startsWith('/admin');
  if (isAdmin) {
    return null;
  }

  const navLinks: { name: string; href: string; badge?: string }[] = [
    { name: 'MERCH', href: '/merch' },
    { 
      name: 'AIR SUSPENSION', 
      href: '/air-suspension',
    },
    { name: 'ABOUT US', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-black">
      {/* Top Announcement Bar (hidden if empty) */}
      {announcement && (
        <div className="bg-black text-zinc-400 text-[11px] tracking-widest font-mono py-1.5 px-4 text-center flex items-center justify-center">
          <span className="truncate">
            {announcement}
          </span>
        </div>
      )}

      {/* Main Navbar - Seamlessly blended with black background, no border lines */}
      <nav
        className={`w-full transition-all duration-300 ${
          scrolled
            ? 'bg-black/95 backdrop-blur-md py-3.5'
            : 'bg-black py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex items-center justify-between min-h-[44px]">
          
          {/* Left: Mobile Menu Toggle & Primary Navigation Links */}
          <div className="flex items-center">
            {/* Mobile Menu Toggle (on left for mobile) */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-xs font-semibold tracking-widest uppercase transition-colors relative py-1 flex items-center gap-2 group ${
                      isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-amber-300 tracking-normal">
                        {link.badge}
                      </span>
                    )}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-white transition-transform duration-200 origin-left ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Center: Brand Monogram / Home link - EXACTLY DEAD-CENTERED */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center pointer-events-auto">
            <Link
              href="/"
              className="text-sm font-black tracking-[0.25em] uppercase text-zinc-100 hover:text-white transition group flex items-center gap-1.5 whitespace-nowrap"
            >
              <span className="text-zinc-500 font-mono text-xs">[</span>
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent group-hover:tracking-[0.3em] transition-all">
                1BAGG3DCREW
              </span>
              <span className="text-zinc-500 font-mono text-xs">]</span>
            </Link>
          </div>

          {/* Right: Actions (Search, Cart) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Input Popover or Toggle */}
            <div className="relative">
              {searchOpen ? (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      window.location.href = `/merch?q=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                  className="flex items-center bg-zinc-900 border border-zinc-700 rounded-full px-3 py-1 text-xs"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search merch..."
                    className="bg-transparent text-white outline-none w-28 sm:w-40 placeholder-zinc-500 text-xs"
                    autoFocus
                  />
                  <button 
                    type="button" 
                    onClick={() => setSearchOpen(false)}
                    className="text-zinc-500 hover:text-white ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full transition"
                  title="Search products"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Shopping Bag Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-full transition flex items-center justify-center"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono shadow-md">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black px-6 py-6 space-y-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold tracking-wider text-zinc-300 hover:text-white flex items-center justify-between py-2"
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-300 border border-zinc-700">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
