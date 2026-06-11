import React, { useState } from 'react';
import { CartItem, Product, UserProfile } from '../types';
import { X, Trash2, Plus, Minus, Tag, ShieldAlert, ArrowRight, User } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckoutClick: () => void;
  currentUser: UserProfile | null;
  onLoginClick?: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutClick,
  currentUser,
  onLoginClick
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  // Calculators
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Promo code check
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'SWISS10') {
      const discountVal = subtotal * 0.10;
      setCouponApplied({ code: 'SWISS10 (10%)', discount: discountVal });
      setCouponCode('');
    } else if (code === 'CHPHARMA15') {
      setCouponApplied({ code: 'CHPHARMA15 (-$15USD)', discount: Math.min(15, subtotal) });
      setCouponCode('');
    } else if (code === '') {
      setCouponError('Please supply a discount code.');
    } else {
      setCouponError('Specified token ID is invalid.');
    }
  };

  // Shipping
  const shippingThreshold = 200; // orders above 200 get free DHL Express
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 15.00;
  
  const discountAmount = couponApplied ? couponApplied.discount : 0;
  const total = Math.max(0, subtotal + shippingCost - discountAmount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark overlay backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs"
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-md w-full pl-10 flex">
        <div className="w-full bg-white shadow-2xl flex flex-col h-full border-l border-gray-100">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wider shrink-0">Shopping Bag</h2>
              <span className="bg-gray-200 text-gray-800 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            
            <button 
              onClick={onClose}
              className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart item listing container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900 tracking-wider uppercase">Your Bag is Empty</h3>
                  <p className="text-xs text-gray-500 max-w-[200px] mx-auto mt-1 leading-normal">No lyophilized compounds added for research order formulation yet.</p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-white font-bold text-[10px] uppercase tracking-wider rounded transition-all cursor-pointer"
                >
                  Browse Chemical Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-gray-100">
                {cart.map((item, index) => (
                  <div key={item.product.id} className={`flex gap-4 pt-4 ${index === 0 ? 'pt-0 border-t-0' : ''}`}>
                    {/* Tiny icon box */}
                    <div className="w-12 h-16 bg-gray-50 border border-gray-200 rounded flex flex-col items-center justify-center font-mono text-[9px] font-bold text-gray-400 shrink-0">
                      <span className="text-[12px] mb-0.5">🧪</span>
                      <span>{item.product.dosage}</span>
                    </div>

                    {/* Meta */}
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <h4 className="text-xs font-bold text-gray-900 truncate max-w-[150px]">{item.product.name}</h4>
                        <span className="text-xs font-bold text-gray-900 font-mono">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-mono">{item.product.dosage} vial • {item.product.purity} pure</p>

                      {/* Quantity row */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center border border-gray-200 rounded bg-gray-50 overflow-hidden h-7">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                onUpdateQuantity(item.product.id, -1);
                              }
                            }}
                            disabled={item.quantity <= 1}
                            className={`p-1 px-2.5 transition-colors ${
                              item.quantity <= 1
                                ? 'text-gray-300 cursor-not-allowed bg-gray-100/50'
                                : 'text-gray-500 hover:text-gray-950 hover:bg-gray-100 cursor-pointer'
                            }`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-bold text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="p-1 px-2.5 hover:bg-gray-100 text-gray-500 hover:text-gray-950 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-gray-400 hover:text-red-655 p-1 rounded transition-colors cursor-pointer"
                          title="Remove compound"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing totals block */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 space-y-4">
              
              {/* Promo code entry */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="COUPON (SWISS10 / CHPHARMA15)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-white border border-gray-250 rounded pl-9 pr-3 py-2 text-[10px] font-mono focus:outline-none focus:border-red-500 uppercase font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#1A1A1A] hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider px-4 rounded transition-all cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {couponError && <p className="text-[10px] font-mono text-red-600 mt-1 font-bold">{couponError}</p>}
              
              {couponApplied && (
                <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 rounded p-2 text-[10px] font-mono text-emerald-800 font-bold">
                  <span className="flex items-center gap-1">
                    ✔ Promo: {couponApplied.code}
                  </span>
                  <button 
                    onClick={() => setCouponApplied(null)}
                    className="text-emerald-900 hover:text-red-600 hover:scale-110 cursor-pointer font-bold"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Tally list */}
              <div className="space-y-2 text-xs font-mono text-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Subtotal:</span>
                  <span className="font-bold text-gray-900 font-mono">${subtotal.toFixed(2)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between items-center text-emerald-600 font-bold">
                    <span className="text-[10px] uppercase tracking-wider">Discount:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Secure Shipping:</span>
                  <span>{shippingCost === 0 ? <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-wider">FREE (DHL Express)</span> : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                {subtotal < shippingThreshold && (
                  <p className="text-[9px] text-gray-400 leading-none">
                     Spend <span className="text-gray-900 font-bold">${(shippingThreshold - subtotal).toFixed(2)}</span> more to unlock Free DHL Cryo Express.
                  </p>
                )}
                
                <div className="h-px bg-gray-200 my-2"></div>
                
                <div className="flex justify-between items-center text-gray-900 font-bold">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Total Order Value:</span>
                  <span className="text-red-600 text-base font-black">${total.toFixed(2)} <span className="text-[10px] font-mono text-gray-400">USD</span></span>
                </div>
              </div>

              {/* Policy caution */}
              <div className="flex items-start gap-2 text-[10px] text-gray-440 leading-tight">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p>Order request initiates a secure invoice and academic researcher licensing verification request.</p>
              </div>

              {/* CTA Order Action */}
              <button
                id="cart-checkout-btn"
                onClick={() => {
                  onClose();
                  onCheckoutClick();
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-black text-white text-[10px] font-bold uppercase tracking-widest p-4 rounded-md transition-all cursor-pointer group"
              >
                Initiate Secure Check-Out
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
