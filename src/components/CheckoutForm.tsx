import React, { useState } from 'react';
import { CartItem, Order, UserProfile } from '../types';
import { ArrowLeft, User } from 'lucide-react';

const countriesList = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
  "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
  "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
  "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia",
  "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
  "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
  "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

interface CheckoutFormProps {
  cart: CartItem[];
  currentUser: UserProfile | null;
  onOrderCompleted: (order: Order) => void;
  onBackToCatalog: () => void;
  onLoginClick?: () => void;
}

export default function CheckoutForm({
  cart,
  currentUser,
  onOrderCompleted,
  onBackToCatalog,
  onLoginClick
}: CheckoutFormProps) {
  // Address States
  const [shippingEmail, setShippingEmail] = useState(currentUser?.email || '');
  const [firstName, setFirstName] = useState(currentUser?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(currentUser?.name?.split(' ').slice(1).join(' ') || '');
  const [country, setCountry] = useState('Australia');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [showApartment, setShowApartment] = useState(false);
  const [city, setCity] = useState('');
  const [state, setState] = useState('South Australia');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  
  // Note to order
  const [addNote, setAddNote] = useState(false);
  const [orderNote, setOrderNote] = useState('');

  // Payment State (defaults to 'crypto' matching screenshot)
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'bank_transfer'>('crypto');

  // Coupon States
  const [couponExpanded, setCouponExpanded] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // decimal discount (e.g. 0.1 for 10%)
  const [couponError, setCouponError] = useState('');

  // Calculations
  const subtotal = cart.reduce((temp, item) => temp + (item.product.price * item.quantity), 0);
  const discountAmount = subtotal * appliedDiscount;
  const subtotalPrice = subtotal - discountAmount;
  const shippingThreshold = 200;
  const shippingCost = subtotalPrice >= shippingThreshold || subtotalPrice === 0 ? 0 : 15.00;
  const totalPrice = subtotalPrice + shippingCost;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'SWISS10' || code === 'DISCOUNT10') {
      setAppliedDiscount(0.1);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code.');
      setAppliedDiscount(0);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingEmail || !firstName || !lastName || !street || !city || !postalCode) {
      alert('Please fill out all mandatory shipping fields.');
      return;
    }

    const shippingName = `${firstName} ${lastName}`.trim();

    // Capture payment details summary in string
    let paymentDetails = '';
    if (paymentMethod === 'crypto') {
      paymentDetails = 'USDT, BTC, ETH, Binance Pay via ABC Crypto Checkout';
    } else {
      paymentDetails = 'PAYID Direct bank transfer';
    }

    // Generate Order receipt
    const newOrder: Order = {
      id: `PEPS-AU-${Math.floor(100000 + Math.random() * 900000)}`,
      phone: phone || undefined,
      userEmail: shippingEmail,
      userName: shippingName,
      shippingAddress: {
        street: apartment ? `${street}, ${apartment}` : street,
        city,
        state,
        postalCode,
        country
      },
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        priceAtPurchase: item.product.price
      })),
      paymentMethod,
      paymentDetails,
      note: addNote && orderNote.trim() ? orderNote.trim() : undefined,
      total: totalPrice,
      orderDate: new Date().toISOString().substring(0, 10),
      status: 'pending',
      trackingNumber: `PEPS-AUPOST-${Math.floor(4000000 + Math.random() * 5999999)}`
    };

    onOrderCompleted(newOrder);
  };

  if (cart.length === 0) {
    return (
      <div className="w-full bg-white min-h-[85vh] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
          {/* Title block */}
          <div className="text-left mb-10 border-b border-gray-100 pb-5">
            <h1 className="text-3xl font-light tracking-wide text-gray-950 font-sans uppercase">CART</h1>
          </div>

        {/* Empty state visual */}
        <div className="text-center py-4 space-y-2.5">
          <svg viewBox="0 0 100 100" className="w-[48px] h-[48px] mx-auto text-[#0E1B2C] fill-current">
            <circle cx="50" cy="50" r="45" fill="#0c1b2d" />
            <circle cx="34" cy="42" r="5" fill="white" />
            <circle cx="66" cy="42" r="5" fill="white" />
            <path 
              d="M 32 72 Q 50 56 68 72" 
              stroke="white" 
              strokeWidth="4" 
              strokeLinecap="round" 
              fill="none" 
            />
            <path 
              d="M 34 52 C 31 52, 30 55, 32 58 Q 34 61, 36 58 C 36 55, 35 52, 34 52 Z" 
              fill="#818CF8" 
            />
          </svg>
          <p className="text-xs font-bold text-gray-950 font-sans tracking-wide uppercase">Your cart is currently empty!</p>
        </div>

        <div className="text-center mt-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0E1B2C] font-sans tracking-tight">New in store</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto pb-10">
          {/* Card 1 - Retratrutide Pen */}
          <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden group">
            <div className="aspect-square w-full bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative">
              <img 
                src="/src/assets/images/retatrutide_best_1780030958269.png" 
                alt="Retratrutide Pen"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="py-4 flex flex-col justify-between flex-grow space-y-3.5 text-left">
              <div className="space-y-1">
                <h3 className="text-sm text-gray-800 font-sans font-medium tracking-tight">Retratrutide Pen</h3>
              </div>
              <button 
                onClick={onBackToCatalog}
                className="w-full py-2.5 bg-[#DE5246] hover:bg-black text-white font-extrabold uppercase font-sans tracking-wide text-[11px] rounded-lg cursor-pointer transition-colors"
              >
                Read More
              </button>
            </div>
          </div>

          {/* Card 2 - Mounjaro */}
          <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden group">
            <div className="aspect-square w-full bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative">
              <img 
                src="/src/assets/images/tirzepatide_best_1780031041817.png" 
                alt="Mounjaro"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="py-4 flex flex-col justify-between flex-grow space-y-3.5 text-left">
              <div className="space-y-1">
                <h3 className="text-sm text-gray-800 font-sans font-medium tracking-tight">Mounjaro</h3>
                <p className="text-xs font-bold text-gray-500 font-mono pt-0.5">$180.00 – $320.00</p>
              </div>
              <button 
                onClick={onBackToCatalog}
                className="w-full py-2.5 bg-[#DE5246] hover:bg-black text-white font-extrabold uppercase font-sans tracking-wide text-[11px] rounded-lg cursor-pointer transition-colors"
              >
                Select Options
              </button>
            </div>
          </div>

          {/* Card 3 - Wegovy */}
          <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden group">
            <div className="aspect-square w-full bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative">
              <img 
                src="/src/assets/images/wegovy_pens_background_1780029483639.png" 
                alt="Wegovy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="py-4 flex flex-col justify-between flex-grow space-y-3.5 text-left">
              <div className="space-y-1">
                <h3 className="text-sm text-gray-800 font-sans font-medium tracking-tight">Wegovy</h3>
                <p className="text-xs font-bold text-gray-500 font-mono pt-0.5">$205.00 – $410.00</p>
              </div>
              <button 
                onClick={onBackToCatalog}
                className="w-full py-2.5 bg-[#DE5246] hover:bg-black text-white font-extrabold uppercase font-sans tracking-wide text-[11px] rounded-lg cursor-pointer transition-colors"
              >
                Select Options
              </button>
            </div>
          </div>

          {/* Card 4 - Cagrilintide + Semaglutide */}
          <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden group">
            <div className="aspect-square w-full bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative">
              <img 
                src="/src/assets/images/ghk_cu_best_1780031016475.png" 
                alt="Cagrilintide + Semaglutide"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="py-4 flex flex-col justify-between flex-grow space-y-3.5 text-left">
              <div className="space-y-1">
                <h3 className="text-sm text-gray-800 font-sans font-medium tracking-tight">Cagrilintide + Semaglutide</h3>
                <p className="text-xs font-bold text-gray-500 font-mono pt-0.5">$204.00 – $13,900.00</p>
                <div className="flex items-center gap-0.5 pt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-amber-500 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <button 
                onClick={onBackToCatalog}
                className="w-full py-2.5 bg-[#DE5246] hover:bg-black text-white font-extrabold uppercase font-sans tracking-wide text-[11px] rounded-lg cursor-pointer transition-colors"
              >
                Select Options
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans select-none">
        {/* Title alignment */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <h1 className="text-3xl font-black text-[#0C1B2D] uppercase tracking-tight">Checkout</h1>
        <button
          onClick={onBackToCatalog}
          className="flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-[#DE5246] uppercase font-black tracking-widest cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Shop
        </button>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left column (Colspan 7): Contact Information, Billing Address, Payment options, note, CTA */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Contact Information */}
          <div>
            <h2 className="text-base font-bold text-[#0C1B2D] mb-3">Contact information</h2>
            <div className="space-y-2">
              <input
                type="email"
                required
                placeholder="Email address"
                value={shippingEmail}
                onChange={(e) => setShippingEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-gray-500 font-sans shadow-2xs"
              />
              <p className="text-xs text-gray-500 font-normal">You are currently checking out as a guest.</p>
            </div>
          </div>

          {/* Billing Address */}
          <div>
            <h2 className="text-base font-bold text-[#0C1B2D] mb-3">Billing address</h2>
            
            <div className="space-y-4">
              {/* Country Selection Dropdown */}
              <div className="relative border border-gray-300 rounded px-4 py-1.5 text-left bg-white shadow-2xs">
                <label className="block text-[10px] text-gray-400 font-sans uppercase font-bold">Country/Region</label>
                <select 
                  value={country} 
                  onChange={(e) => {
                    const nextCountry = e.target.value;
                    setCountry(nextCountry);
                    setCity(''); // reset suburb/district/city input
                    if (nextCountry === 'Australia') {
                      setState('South Australia');
                    } else if (nextCountry === 'Switzerland') {
                      setState('Aargau');
                    } else {
                      setState('');
                    }
                  }}
                  className="w-full bg-transparent text-sm text-[#0C1B2D] focus:outline-none font-bold mt-0.5 outline-none border-none py-0.5 cursor-pointer"
                >
                  {countriesList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-gray-500 font-sans shadow-2xs"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-gray-500 font-sans shadow-2xs"
                />
              </div>

              {/* Street Address */}
              <input
                type="text"
                placeholder="Address"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-gray-500 font-sans shadow-2xs"
              />

              {/* Add Apartment optional trigger */}
              <div className="pt-0.5">
                {!showApartment ? (
                  <button
                    type="button"
                    onClick={() => setShowApartment(true)}
                    className="text-xs text-slate-500 hover:text-black cursor-pointer font-medium"
                  >
                    + Add apartment, suite, etc.
                  </button>
                ) : (
                  <input
                    type="text"
                    placeholder="Apartment, suite, unit, etc. (optional)"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-gray-500 font-sans shadow-2xs animate-fade-in"
                  />
                )}
              </div>

              {/* Suburb & State (Conditional based on Country selection) */}
              {country === 'Australia' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                  <input
                    type="text"
                    placeholder="Suburb"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-gray-500 font-sans shadow-2xs"
                  />
                  <div className="relative border border-gray-300 rounded px-4 py-1.5 text-left bg-white shadow-2xs">
                    <label className="block text-[10px] text-gray-400 font-sans uppercase font-bold">State</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-transparent text-sm text-[#0C1B2D] focus:outline-none font-bold mt-0.5 outline-none border-none py-0.5 cursor-pointer"
                    >
                      <option value="South Australia">South Australia</option>
                      <option value="New South Wales">New South Wales</option>
                      <option value="Victoria">Victoria</option>
                      <option value="Queensland">Queensland</option>
                      <option value="Western Australia">Western Australia</option>
                      <option value="Tasmania">Tasmania</option>
                      <option value="Northern Territory">Northern Territory</option>
                      <option value="Australian Capital Territory">Australian Capital Territory</option>
                    </select>
                  </div>
                </div>
              )}

              {country === 'Switzerland' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                  <input
                    type="text"
                    placeholder="District"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-gray-500 font-sans shadow-2xs"
                  />
                  <div className="relative border border-gray-300 rounded px-4 py-1.5 text-left bg-white shadow-2xs">
                    <label className="block text-[10px] text-gray-400 font-sans uppercase font-bold">Canton</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-transparent text-sm text-[#0C1B2D] focus:outline-none font-bold mt-0.5 outline-none border-none py-0.5 cursor-pointer"
                    >
                      <option value="Aargau">Aargau</option>
                      <option value="Appenzell Ausserrhoden">Appenzell Ausserrhoden</option>
                      <option value="Appenzell Innerrhoden">Appenzell Innerrhoden</option>
                      <option value="Basel-Landschaft">Basel-Landschaft</option>
                      <option value="Basel-Stadt">Basel-Stadt</option>
                      <option value="Bern">Bern</option>
                      <option value="Fribourg">Fribourg</option>
                      <option value="Geneva">Geneva</option>
                      <option value="Glarus">Glarus</option>
                      <option value="Graubünden">Graubünden</option>
                      <option value="Jura">Jura</option>
                      <option value="Lucerne">Lucerne</option>
                      <option value="Neuchâtel">Neuchâtel</option>
                      <option value="Nidwalden">Nidwalden</option>
                      <option value="Obwalden">Obwalden</option>
                      <option value="Schaffhausen">Schaffhausen</option>
                      <option value="Schwyz">Schwyz</option>
                      <option value="Solothurn">Solothurn</option>
                      <option value="St. Gallen">St. Gallen</option>
                      <option value="Thurgau">Thurgau</option>
                      <option value="Ticino">Ticino</option>
                      <option value="Uri">Uri</option>
                      <option value="Valais">Valais</option>
                      <option value="Vaud">Vaud</option>
                      <option value="Zug">Zug</option>
                      <option value="Zürich">Zürich</option>
                    </select>
                  </div>
                </div>
              )}

              {country !== 'Australia' && country !== 'Switzerland' && (
                <div className="animate-fade-in">
                  <input
                    type="text"
                    placeholder="City"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-gray-500 font-sans shadow-2xs"
                  />
                </div>
              )}

              {/* Postcode & Phone (optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Postcode"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-gray-500 font-sans shadow-2xs"
                />
                <input
                  type="text"
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-gray-500 font-sans shadow-2xs"
                />
              </div>

            </div>
          </div>

          {/* Payment options */}
          <div>
            <h2 className="text-base font-bold text-[#0C1B2D] mb-3">Payment options</h2>
            <div className="border border-gray-300 rounded overflow-hidden shadow-2xs bg-white">
              
              {/* Crypto payment option */}
              <div 
                className={`p-4 cursor-pointer transition-colors ${paymentMethod === 'crypto' ? 'bg-gray-50/50' : 'bg-white'}`}
                onClick={() => setPaymentMethod('crypto')}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'crypto'}
                    onChange={() => setPaymentMethod('crypto')}
                    className="mt-1 accent-[#DE5246] h-4 w-4 cursor-pointer"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded px-1.5 py-0.5 text-[9px] font-bold font-mono tracking-wider select-none shadow-3xs uppercase">
                        <span className="text-emerald-500 font-extrabold font-sans">₮</span>
                        <span>USDT</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded px-1.5 py-0.5 text-[9px] font-bold font-mono tracking-wider select-none shadow-3xs uppercase">
                        <span className="text-amber-500 font-extrabold">₿</span>
                        <span>BTC</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded px-1.5 py-0.5 text-[9px] font-bold font-mono tracking-wider select-none shadow-3xs uppercase">
                        <span className="text-indigo-500 font-extrabold">Ξ</span>
                        <span>ETH</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded px-1.5 py-0.5 text-[9px] font-bold font-mono tracking-wider select-none shadow-3xs uppercase">
                        <span className="text-yellow-600 font-sans font-extrabold">▶</span>
                        <span>Binance Pay</span>
                      </div>
                      <span className="text-xs text-gray-500 font-semibold font-mono pl-1">USDT,BTC,ETH,Binance Pay</span>
                    </div>
                    <div className="text-[11px] text-gray-500 font-semibold">
                      Crypto payment by ABC Crypto Checkout (Payerurl)
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Divider */}
              <div className="border-t border-gray-200"></div>

              {/* PAYID direct transfer */}
              <div 
                className={`p-4 cursor-pointer transition-all ${paymentMethod === 'bank_transfer' ? 'bg-[#FAF9F5] border-l-4 border-[#DE5246]' : 'bg-white'}`}
                onClick={() => setPaymentMethod('bank_transfer')}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="accent-[#DE5246] h-4 w-4 cursor-pointer"
                  />
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-xs font-black text-gray-700 tracking-widest font-mono">PAYID</span>
                  </div>
                </div>

                {paymentMethod === 'bank_transfer' && (
                  <div className="mt-2 ml-7 text-slate-800 text-[12px] font-medium leading-relaxed text-left animate-fade-in whitespace-pre-wrap">
                    {localStorage.getItem('peps_payid_instructions') || 'Contact Us On WhatsApp : +61 488 856 783 Email : mail@buyswisspeptides.shop For Payments and Quick Processing of your Order'}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Add a note to order option */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={addNote}
                onChange={(e) => setAddNote(e.target.checked)}
                className="accent-black rounded border-gray-300 text-black focus:ring-0 w-4 h-4"
              />
              <span className="text-xs text-slate-600 font-semibold">Add a note to your order</span>
            </label>
            {addNote && (
              <div className="mt-3 animate-fade-in">
                <textarea
                  placeholder="Special instructions or research lab delivery notes..."
                  rows={3}
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-gray-500 font-sans shadow-2xs"
                ></textarea>
              </div>
            )}
          </div>

          {/* Agreements CTA warning & Place order submission button */}
          <div className="pt-4">
            <p className="text-[11px] text-gray-400 leading-normal font-sans">
              By proceeding with your purchase you agree to our <span className="underline hover:text-black cursor-pointer font-bold">Terms and Conditions</span> and <span className="underline hover:text-black cursor-pointer font-bold">Privacy Policy</span>
            </p>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-4 bg-[#DE5246] hover:bg-[#E55B4C] text-white text-xs font-bold uppercase tracking-widest rounded transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 select-none"
              >
                PLACE ORDER
              </button>
            </div>
          </div>

        </div>

        {/* Right column (Colspan 5): Order Summary container */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base font-bold text-[#0C1B2D]">Order summary</h2>
          
          <div className="border border-gray-300 rounded bg-white p-5 space-y-4 shadow-2xs">
            {/* Cart products summary listing */}
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={item.product.id} className="flex gap-4 items-center">
                  
                  {/* Square full bleed image box with minimal off-white background */}
                  <div className="relative w-16 h-16 bg-[#FAF9F5] border border-gray-150 rounded overflow-hidden flex items-center justify-center shrink-0 shadow-3xs select-none">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name} 
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                    {/* Badge */}
                    <div className="absolute -top-1.5 -right-1.5 bg-[#4F5B66] text-white text-[9px] font-sans font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                      {item.quantity}
                    </div>
                  </div>

                  {/* Description detail */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-extrabold text-[#0C1B2D] leading-snug line-clamp-2">
                      {item.product.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                      Dosage: {item.product.dosage} / Quantity: {item.quantity} kit
                    </p>
                    <span className="text-[10px] font-extrabold text-[#DE5246] block mt-0.5">${item.product.price.toFixed(2)} each</span>
                  </div>

                  {/* Subtotal price aligned right */}
                  <div className="text-xs font-bold text-gray-500 font-mono tracking-tight shrink-0">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>

                </div>
              ))}
            </div>

            {/* Coupons section accordion style */}
            <div className="border-t border-gray-200 pt-3">
              <button
                type="button"
                onClick={() => setCouponExpanded(!couponExpanded)}
                className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 hover:text-black cursor-pointer py-1"
              >
                <span>Add coupons</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 transform transition-transform ${couponExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {couponExpanded && (
                <div className="mt-2.5 flex gap-2 animate-fade-in">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponError('');
                    }}
                    className="flex-1 bg-white border border-gray-300 rounded px-3 py-1.5 text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-gray-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-1.5 bg-[#0C1B2D] text-white rounded text-[10px] font-black uppercase tracking-wider hover:bg-[#DE5246] transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-[10px] text-red-500 font-mono mt-1">{couponError}</p>
              )}
              {appliedDiscount > 0 && (
                <p className="text-[10px] text-emerald-600 font-mono font-bold mt-1">✓ SWISS10 applied (10% discount on chemical compounds)</p>
              )}
            </div>

            {/* Subtotal row */}
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-xs text-gray-500 font-medium">
              <span>Subtotal</span>
              <span className="font-bold text-gray-500 font-mono">${subtotalPrice.toFixed(2)}</span>
            </div>

            {/* Final Total row */}
            <div className="border-t border-gray-200 pt-4 flex justify-between items-center font-bold">
              <span className="text-sm font-extrabold text-[#0C1B2D]">Total</span>
              <span className="text-lg font-black text-[#0C1B20] font-mono tracking-tight">${totalPrice.toFixed(2)}</span>
            </div>

          </div>
        </div>

      </form>
    </div>
    </div>
  );
}
