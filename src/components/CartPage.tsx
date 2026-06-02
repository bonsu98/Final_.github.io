import React, { useState } from 'react';
import { CartItem } from '../types';
import { Trash2, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

interface CartPageProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckoutClick: () => void;
  onBackToCatalog: () => void;
}

export default function CartPage({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutClick,
  onBackToCatalog
}: CartPageProps) {
  // Coupon state
  const [couponExpanded, setCouponExpanded] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0); // decimal percentage, e.g. 0.1 for 10%
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discountAmount = subtotal * discountPercent;
  const estimatedTotal = subtotal - discountAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'SWISS10' || code === 'DISCOUNT10') {
      setDiscountPercent(0.1);
      setCouponSuccess('✓ 10% discount applied successfully');
      setCouponError('');
    } else if (code === 'CHPHARMA15') {
      setDiscountPercent(0.15);
      setCouponSuccess('✓ 15% discount applied successfully');
      setCouponError('');
    } else if (code) {
      setCouponError('Invalid coupon code');
      setCouponSuccess('');
      setDiscountPercent(0);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="w-full bg-white min-h-[85vh] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans select-none">
          <div className="text-left mb-10 border-b border-gray-100 pb-5">
            <h1 className="text-4xl font-light tracking-wide text-gray-950 uppercase">CART</h1>
          </div>

        <div className="text-center py-16 space-y-4">
          <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-950 tracking-wider uppercase">Your cart is currently empty!</p>
          <div className="pt-4">
            <button
              onClick={onBackToCatalog}
              className="px-6 py-2.5 bg-[#DE5246] hover:bg-black text-white text-[10.5px] font-black tracking-widest uppercase rounded cursor-pointer transition-colors"
            >
              Back to Shop
            </button>
          </div>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans select-none">
      {/* Title block matching exact screenshot spacing */}
      <div className="border-b border-transparent pb-3 mb-6">
        <h1 className="text-4xl text-[#0C1B2D] font-light tracking-wide uppercase">CART</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-6">
        
        {/* Left Column - Product listing (Colspan 8) */}
        <div className="lg:col-span-8">
          
          {/* Table headers */}
          <div className="flex justify-between text-gray-400 text-[10px] font-bold tracking-widest uppercase border-b border-gray-200 pb-3 mb-4">
            <span>PRODUCT</span>
            <span>TOTAL</span>
          </div>

          {/* Product Rows list */}
          <div className="divide-y divide-gray-200">
            {cart.map((item) => (
              <div key={item.product.id} className="py-6 flex items-start gap-4 justify-between">
                
                {/* Product Detail content block */}
                <div className="flex gap-4 items-start flex-1">
                  
                  {/* Aspect-square thumbnail of molecular kit (same size and grey frame matching the screenshot) */}
                  <div className="w-20 h-20 bg-gray-50 border border-gray-150 rounded flex items-center justify-center shrink-0 overflow-hidden select-none">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name} 
                      className="max-h-full max-w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Text details containing Custom title, base compound price, dosage info, quantity adjuster & remove trashing */}
                  <div className="space-y-1 text-left">
                    <h3 className="text-[14px] font-bold text-[#0C1B2D] leading-tight">
                      {item.product.name}
                    </h3>
                    <div className="text-xs text-gray-500 font-medium">
                      ${item.product.price.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-gray-400 font-medium">
                      Dosage: {item.product.dosage} / Quantity: {item.quantity} {item.quantity === 1 ? 'kit' : 'kits'}
                    </div>

                    {/* Inline Quantity adjustment block + trash trigger aligning precisely below dosage details */}
                    <div className="flex items-center gap-4 pt-3">
                      
                      {/* [ - | 1 | + ] container */}
                      <div className="flex items-center border border-gray-300 rounded overflow-hidden h-8 bg-white shadow-3xs">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity > 1) {
                              onUpdateQuantity(item.product.id, item.quantity - 1);
                            } else {
                              onRemoveItem(item.product.id);
                            }
                          }}
                          className="px-2.5 h-full hover:bg-gray-50 text-gray-400 hover:text-black transition-colors flex items-center justify-center font-bold text-xs cursor-pointer select-none"
                        >
                          –
                        </button>
                        
                        <div className="w-10 text-center text-xs font-semibold text-gray-700 select-none border-x border-gray-200 h-full flex items-center justify-center">
                          {item.quantity}
                        </div>

                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-3 h-full hover:bg-gray-50 text-gray-400 hover:text-black transition-colors flex items-center justify-center font-bold text-xs cursor-pointer select-none"
                        >
                          +
                        </button>
                      </div>

                      {/* Trash action button */}
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-1.5 rounded hover:bg-gray-50"
                        title="Remove from Cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </div>

                </div>

                {/* Right aligned total price calculated */}
                <div className="text-sm font-semibold text-gray-600 font-mono text-right pt-1 shrink-0 select-none">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>

              </div>
            ))}
          </div>

          {/* Simple bottom boundary line matching WooCommerce style */}
          <div className="border-t border-gray-200 mt-6 pt-4 flex">
            <button
              onClick={onBackToCatalog}
              className="inline-flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-[#DE5246] uppercase font-black tracking-wider cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3" />
              Continue Shopping
            </button>
          </div>

        </div>

        {/* Right Column - CART TOTALS (Colspan 4) */}
        <div className="lg:col-span-4 bg-white font-montserrat text-[13px]">
          
          <h2 className="text-[13px] font-medium text-gray-400 uppercase tracking-wider text-left pb-1.5 select-none">
            CART TOTALS
          </h2>
          
          <div className="border-t border-gray-200 pt-3 space-y-4 font-montserrat text-[13px]">
            
            {/* Subtotal row (always shown for absolute clarity before coupons) */}
            <div className="flex justify-between items-center text-gray-500 py-0.5">
              <span className="font-medium text-gray-500">Subtotal</span>
              <span className="font-medium text-gray-700">${subtotal.toFixed(2)}</span>
            </div>

            {/* Responsive Coupon Accordion drop menu style */}
            <div className="border-y border-gray-150 py-2.5">
              <button
                type="button"
                onClick={() => setCouponExpanded(!couponExpanded)}
                className="w-full flex items-center justify-between text-[13px] font-medium text-gray-500 hover:text-[#DE5246] cursor-pointer select-none"
              >
                <span className="font-medium">Add coupons</span>
                {couponExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>

              {couponExpanded && (
                <form onSubmit={handleApplyCoupon} className="mt-3 flex gap-2 animate-fade-in">
                  <input
                    type="text"
                    required
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponError('');
                      setCouponSuccess('');
                    }}
                    className="flex-1 bg-white border border-gray-300 rounded px-3 py-1.5 text-[13px] font-medium uppercase tracking-wider focus:outline-none focus:border-gray-500 uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#0C1B2D] text-white rounded text-[13px] font-medium uppercase tracking-wider hover:bg-[#DE5246] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[13px] font-medium text-red-500 mt-1 text-left">{couponError}</p>
              )}
              {couponSuccess && (
                <p className="text-[13px] font-medium text-emerald-600 mt-1 text-left">{couponSuccess}</p>
              )}
            </div>

            {/* Discount row if coupon is applied successfully */}
            {discountPercent > 0 && (
              <div className="flex justify-between items-center text-emerald-600 py-0.5 animate-fade-in font-medium">
                <span>Discount ({(discountPercent * 100).toFixed(0)}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            {/* Estimated total layout rows aligned perfectly */}
            <div className="flex justify-between items-baseline pt-1">
              <span className="text-[13px] font-medium text-[#0C1B2D]">Estimated total</span>
              <span className="text-[13px] font-medium text-[#0C1B20] tracking-tight shrink-0 select-none">
                ${estimatedTotal.toFixed(2)}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-2"></div>

            {/* Proceed to checkout button with matching custom style */}
            <button
              onClick={onCheckoutClick}
              className="w-full py-3.5 bg-[#DE5246] hover:bg-[#E55B4C] text-white text-[13px] font-medium uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] text-center"
            >
              PROCEED TO CHECKOUT
            </button>

          </div>

        </div>

      </div>
    </div>
    </div>
  );
}
