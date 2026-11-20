'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalCount } = useCart();
  const freeShippingThreshold = 100;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 text-zinc-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-zinc-400" />
              <h2 className="text-lg font-bold tracking-wider uppercase text-zinc-100">
                Your Bag ({totalCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-6 py-3 bg-zinc-900/60 border-b border-zinc-800/60">
            <div className="text-xs text-zinc-300 font-medium mb-1.5 flex justify-between">
              <span>
                {remainingForFreeShipping === 0 ? (
                  <span className="text-emerald-400 font-semibold">🎉 You unlocked FREE standard shipping!</span>
                ) : (
                  <span>Add <strong className="text-white">${remainingForFreeShipping.toFixed(2)}</strong> for FREE shipping</span>
                )}
              </span>
              <span className="text-zinc-500">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-zinc-200 to-white h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-zinc-300">Your bag is empty</p>
                  <p className="text-sm text-zinc-500 mt-1">Explore our exclusive streetwear & air ride collection.</p>
                </div>
                <Link
                  href="/merch"
                  onClick={closeCart}
                  className="mt-4 px-6 py-2.5 bg-zinc-100 hover:bg-white text-black font-semibold text-xs tracking-wider uppercase rounded transition"
                >
                  Shop Merch
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="flex gap-4 p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/80 hover:border-zinc-700 transition"
                >
                  <div className="w-20 h-20 bg-zinc-900 rounded-lg overflow-hidden shrink-0 border border-zinc-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-zinc-200 line-clamp-1">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => removeItem(item.product.id, item.size)}
                          className="text-zinc-500 hover:text-rose-400 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Size: <span className="text-zinc-200 font-mono font-medium">{item.size}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-zinc-700/80 rounded bg-zinc-950">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, -1)}
                          className="px-2 py-1 text-zinc-400 hover:text-white"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono text-zinc-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, 1)}
                          className="px-2 py-1 text-zinc-400 hover:text-white"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono text-sm font-semibold text-white">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-zinc-800/80 bg-zinc-950 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-zinc-200">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Shipping</span>
                  <span className="text-zinc-300 font-mono">
                    {subtotal >= 100 ? 'FREE' : '$9.95'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-zinc-800">
                  <span>Estimated Total</span>
                  <span className="font-mono text-emerald-400">
                    ${(subtotal + (subtotal >= 100 ? 0 : 9.95)).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  alert(`Thank you for shopping with 1Bagg3dCrew!\nCheckout Order Total: $${(subtotal + (subtotal >= 100 ? 0 : 9.95)).toFixed(2)}\nOur direct payment gateway and order dispatch will process your order.`);
                }}
                className="w-full py-3.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs tracking-widest uppercase rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-white/10"
              >
                <span>Proceed To Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-zinc-500">
                Guaranteed secure checkout • 1Bagg3dCrew Worldwide
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
