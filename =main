import React, { useState } from 'react';
import { PageView, CartItem, UserProfile } from '../types';
import { ShoppingBag, Menu, X, Mail, Phone, MapPin, Send } from 'lucide-react';

interface HeaderProps {
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  cart: CartItem[];
  setCartOpen: (open: boolean) => void;
  currentUser: UserProfile | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function Header({
  activePage,
  setActivePage,
  cart,
  setCartOpen,
  currentUser,
  onLoginClick,
  onLogout
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((sums, item) => sums + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const navLinkStyle = {
    fontFamily: '"Montserrat", sans-serif',
    fontSize: '15.5px',
    fontWeight: 400
  };

  return (
    <>
      {/* Main Header Container matching Image style */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            
            {/* Left aligned grey Logo matching Image precisely */}
            <div 
              onClick={() => setActivePage('home')}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              {/* Elegant grey rectangular block layout with clean serif text */}
              <div className="w-16 h-12 bg-[#D9D9DB] rounded-sm flex flex-col items-center justify-center border border-[#C5C5C7] shadow-2xs hover:scale-103 transition-all relative">
                <span className="text-gray-900 font-serif font-black text-xl italic tracking-tighter leading-none -mb-0.5">SP</span>
                <span className="text-[6.5px] text-gray-700 tracking-wider font-sans font-bold uppercase leading-none border-t border-gray-400 pt-0.5 mt-0.5">SWISS LABS</span>
              </div>
              
              <div className="hidden lg:flex flex-col">
                <span className="text-sm font-black font-sans tracking-tight text-gray-950 uppercase group-hover:text-amber-700 transition-colors">
                  Swiss Peptides
                </span>
              </div>
            </div>

            {/* Center aligned horizontal links matching second image */}
            <nav className="hidden md:flex items-center space-x-5 lg:space-x-7 text-gray-800">
              <button
                onClick={() => setActivePage('home')}
                style={navLinkStyle}
                className={`transition-colors cursor-pointer hover:text-[#DE5246] ${
                  activePage === 'home' ? 'text-[#DE5246]' : 'text-gray-700'
                }`}
              >
                Home
              </button>
              
              <button
                onClick={() => { setActivePage('shop'); }}
                style={navLinkStyle}
                className={`transition-colors cursor-pointer hover:text-[#DE5246] lowercase ${
                  activePage === 'shop' ? 'text-[#DE5246]' : 'text-gray-700'
                }`}
              >
                peptides
              </button>

              <button
                onClick={() => setActivePage('about')}
                style={navLinkStyle}
                className={`transition-colors cursor-pointer hover:text-[#DE5246] ${
                  activePage === 'about' ? 'text-[#DE5246]' : 'text-gray-700'
                }`}
              >
                About
              </button>

              <button
                onClick={() => setActivePage('contact')}
                style={navLinkStyle}
                className={`transition-colors cursor-pointer hover:text-[#DE5246] ${
                  activePage === 'contact' ? 'text-[#DE5246]' : 'text-gray-700'
                }`}
              >
                Contact
              </button>

              <button
                onClick={() => { setActivePage('shop'); }}
                style={navLinkStyle}
                className={`transition-colors cursor-pointer hover:text-[#DE5246] ${
                  activePage === 'shop' ? 'text-[#DE5246]' : 'text-gray-700'
                }`}
              >
                Shop
              </button>

              <button
                onClick={() => setActivePage('cart')}
                style={navLinkStyle}
                className={`transition-colors cursor-pointer hover:text-[#DE5246] ${
                  activePage === 'cart' ? 'text-[#DE5246]' : 'text-gray-700'
                }`}
              >
                Cart
              </button>

              <button
                onClick={() => setActivePage('checkout')}
                style={navLinkStyle}
                className={`transition-colors cursor-pointer hover:text-[#DE5246] ${
                  activePage === 'checkout' ? 'text-[#DE5246]' : 'text-gray-700'
                }`}
              >
                Checkout
              </button>

              <button
                onClick={() => setActivePage('account')}
                style={navLinkStyle}
                className={`transition-colors cursor-pointer hover:text-[#DE5246] ${
                  activePage === 'account' ? 'text-[#DE5246]' : 'text-gray-700'
                }`}
              >
                My account
              </button>
            </nav>

            {/* Right-aligned Premium Action Card matching Image */}
            <div className="flex items-center gap-4">
              
              {/* Responsive indicator/trigger for cart: RED OUTLINE BOX with Cart label and bag */}
              <button
                onClick={() => setActivePage('cart')}
                className="group border-2 border-[#DE5246] text-[#DE5246] hover:bg-[#DE5246]/5 hover:scale-102 hover:shadow-2xs active:scale-98 transition-all px-3 py-2 rounded-sm flex items-center gap-3 font-sans font-bold text-xs cursor-pointer h-12"
              >
                <span className="tracking-wide">
                  Cart/${cartTotal.toFixed(2)}
                </span>
                
                <div className="relative flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-[#DE5246]" />
                  {/* Item qty absolute red badge */}
                  <span className="absolute -top-1.5 -right-1.5 bg-[#DE5246] border border-white text-white rounded-full text-[8px] w-4.5 h-4.5 flex items-center justify-center font-black">
                    {cartCount}
                  </span>
                </div>
              </button>

              {/* Login Button inside absolute corner or mobile */}
              <div className="flex items-center gap-1.5">
                {currentUser ? (
                  <div className="flex items-center gap-1 sm:gap-1.5 bg-gray-50 border border-gray-100 px-1.5 sm:px-2 py-1 rounded-md">
                    <button
                      onClick={() => setActivePage('account')}
                      className="text-[9px] font-mono uppercase tracking-wider text-gray-500 hover:text-[#DE5246] cursor-pointer max-w-[80px] sm:max-w-[120px] truncate"
                      title="View My Account"
                    >
                      ðŸ‘¤ {currentUser.name.length > 10 ? `${currentUser.name.substring(0, 8)}..` : currentUser.name}
                    </button>
                    <span className="text-gray-300 text-[10px]">|</span>
                    <button
                      onClick={onLogout}
                      className="text-[9px] font-mono uppercase font-bold text-red-500 hover:text-red-700 cursor-pointer"
                      title="Logout Session"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onLoginClick}
                    className="text-[10px] uppercase font-bold text-[#DE5246] hover:text-gray-900 border border-[#DE5246]/25 bg-gray-50/50 hover:bg-gray-50 px-2.5 py-1.5 rounded-md cursor-pointer transition-colors"
                  >
                    Login
                  </button>
                )}
              </div>

              {/* Mobile Sandwich menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-[#DE5246] cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-6 space-y-3 text-gray-800 divide-y divide-gray-50">
            <div className="space-y-3 pb-3">
              <button 
                onClick={() => { setActivePage('home'); setMobileMenuOpen(false); }}
                style={navLinkStyle}
                className={`block w-full text-left ${activePage === 'home' ? 'text-[#DE5246]' : 'text-gray-700'}`}
              >
                Home
              </button>
              <button 
                onClick={() => { setActivePage('shop'); setMobileMenuOpen(false); }}
                style={navLinkStyle}
                className={`block w-full text-left lowercase ${activePage === 'shop' ? 'text-[#DE5246]' : 'text-gray-700'}`}
              >
                peptides
              </button>
              <button 
                onClick={() => { setActivePage('about'); setMobileMenuOpen(false); }}
                style={navLinkStyle}
                className={`block w-full text-left ${activePage === 'about' ? 'text-[#DE5246]' : 'text-gray-700'}`}
              >
                About
              </button>
              <button 
                onClick={() => { setActivePage('contact'); setMobileMenuOpen(false); }}
                style={navLinkStyle}
                className={`block w-full text-left ${
                  activePage === 'contact' ? 'text-[#DE5246]' : 'text-gray-700'
                }`}
              >
                Contact
              </button>
              <button 
                onClick={() => { setActivePage('shop'); setMobileMenuOpen(false); }}
                style={navLinkStyle}
                className={`block w-full text-left ${activePage === 'shop' ? 'text-[#DE5246]' : 'text-gray-700'}`}
              >
                Shop
              </button>
              <button 
                onClick={() => { setActivePage('cart'); setMobileMenuOpen(false); }}
                style={navLinkStyle}
                className={`block w-full text-left ${activePage === 'cart' ? 'text-[#DE5246]' : 'text-gray-700'}`}
              >
                Cart
              </button>
              <button 
                onClick={() => { setActivePage('checkout'); setMobileMenuOpen(false); }}
                style={navLinkStyle}
                className={`block w-full text-left ${activePage === 'checkout' ? 'text-[#DE5246]' : 'text-gray-700'}`}
              >
                Checkout
              </button>
              <button 
                onClick={() => { setActivePage('account'); setMobileMenuOpen(false); }}
                style={navLinkStyle}
                className={`block w-full text-left ${activePage === 'account' ? 'text-[#DE5246]' : 'text-gray-700'}`}
              >
                My account
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
