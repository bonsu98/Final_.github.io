import React, { useState } from 'react';
import { UserProfile, Order } from '../types';
import { User, ClipboardList, Shield, Award, MapPin, Search, Printer, Download, Beaker } from 'lucide-react';

interface AccountPortalProps {
  currentUser: UserProfile | null;
  orders: Order[];
  onBackToCatalog: () => void;
  setActivePage: (p: any) => void;
  onLogout?: () => void;
  onLoginClick?: () => void;
}

export default function AccountPortal({
  currentUser,
  orders,
  onBackToCatalog,
  setActivePage,
  onLogout,
  onLoginClick
 }: AccountPortalProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<Order | null>(null);
 
  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <User className="w-14 h-14 text-gray-300 mx-auto" />
        <div className="space-y-2">
          <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide">Sign In Required</h3>
        </div>
        {onLoginClick && (
          <button
            onClick={onLoginClick}
            className="px-6 py-3 bg-[#DE5246] hover:bg-black text-white font-extrabold uppercase font-sans tracking-wide text-xs rounded-xl cursor-pointer transition-colors shadow-xs"
          >
            Sign In or Create Account
          </button>
        )}
      </div>
    );
  }

  const userOrders = orders.filter(
    order => order.userEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const handlePrintReceipt = (order: Order) => {
    setSelectedReceipt(order);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Receipts Model Popup details */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-3xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border text-gray-800 rounded-xl max-w-2xl w-full p-8 space-y-6 shadow-2xl relative font-mono text-xs">
            
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 font-sans text-lg font-black"
            >
              ×
            </button>

            {/* Swiss receipt header */}
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h4 className="text-sm font-black text-gray-900">BUY PEPTIDES AUSTRALIA</h4>
                <p className="text-[10px] text-gray-400">Swanston Street 18, 3053 Melbourne</p>
                <p className="text-[10px] text-gray-400">ABN: 45 921 820 109</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-1 rounded border border-emerald-200 font-bold uppercase">
                  OFFICIAL SALES INVOICE
                </span>
                <p className="text-[10px] text-gray-400 mt-2">Date: {selectedReceipt.orderDate}</p>
              </div>
            </div>

            {/* Client detail */}
            <div className="grid grid-cols-2 gap-4 text-[11px] bg-gray-50 p-3 rounded border">
              <div>
                <span className="block text-gray-400 text-[9px] uppercase font-bold">RESEARCH RECIPIENT</span>
                <strong className="text-gray-800">{selectedReceipt.userName}</strong>
                <p className="text-gray-500">{currentUser.organization || 'University Bio-lab'}</p>
              </div>
              <div>
                <span className="block text-gray-400 text-[9px] uppercase font-bold">DISPATCH SHIP TO</span>
                <p className="text-gray-600 leading-tight">
                  {selectedReceipt.shippingAddress.street}, {selectedReceipt.shippingAddress.city}<br />
                  {selectedReceipt.shippingAddress.postalCode}, {selectedReceipt.shippingAddress.country}
                </p>
              </div>
            </div>

            {/* Receipt Items grid */}
            <div className="space-y-2 pt-2">
              <span className="block text-gray-400 text-[9px] uppercase font-bold pb-1 border-b">CARGO COMPOSITION DETAILS</span>
              {selectedReceipt.items.map(item => (
                <div key={item.productId} className="flex justify-between py-1 border-b border-gray-150 text-[11px]">
                  <span>{item.name} vial x {item.quantity}</span>
                  <span className="font-bold">${(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Tally summaries */}
            <div className="space-y-1.5 text-right font-bold text-[11px] pt-1">
              <div>
                <span className="text-gray-400 font-medium">Subtotal: </span>
                <span>${selectedReceipt.total.toFixed(2)}</span>
              </div>
              <div className="text-emerald-600">
                <span className="font-medium">Direct Delivery (Australia Post): </span>
                <span>FREE</span>
              </div>
              <div className="text-emerald-700 text-xs border-t pt-2 mt-2 font-black">
                <span>Total Charge: </span>
                <span>${selectedReceipt.total.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Bottom tracking codes and info */}
            <div className="pt-4 border-t border-dashed space-y-2 text-[10.5px]">
              <div className="flex justify-between">
                <span className="text-gray-400">PAYMENT GATEWAY STATUS</span>
                <span className="text-emerald-600 font-bold">VERIFIED ({selectedReceipt.paymentDetails})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">AUSTRALIA POST EXPRESS CODE</span>
                <span className="font-bold text-gray-900">{selectedReceipt.trackingNumber || 'PEPS-AUPOST-99827'}</span>
              </div>
              <p className="text-[10px] text-gray-400 text-center leading-relaxed pt-3">
                Disclaimer: The purchaser binds Swiss Peptides from direct liabilities regarding off-label research uses. All analysis records strictly logged to database context.
              </p>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border rounded hover:bg-gray-50 text-[11px] font-sans font-bold flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Trigger Print
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-[11px] font-sans font-bold rounded cursor-pointer"
              >
                Dismiss
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Main dashboard grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column (Colspan 4): Profile Card */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-12 h-12 bg-emerald-100/50 rounded-full flex items-center justify-center text-emerald-700">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-mono tracking-wider text-emerald-700 font-bold uppercase">APPROVED RESEARCHER</p>
                <h3 className="text-sm font-extrabold text-gray-900 leading-none mt-1">{currentUser.name}</h3>
                <span className="text-xs text-gray-500 font-mono mt-1 block">{currentUser.email}</span>
              </div>
            </div>

            {/* Authorization credentials */}
            <div className="space-y-3.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-gray-400">INSTITUTION:</span>
                <span className="font-bold text-gray-800">{currentUser.organization || 'Australian Bio Research Hub'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">AUTHORIZATION LIC:</span>
                <span className="font-bold text-gray-800 text-right">{currentUser.labLicense || 'AU-LICENSE-P998'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">REGISTRATION DATE:</span>
                <span className="font-bold text-gray-800">{currentUser.joinedAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">RESEARCH CREDITS:</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 rounded">$1,250.00 USD</span>
              </div>
            </div>

            {onLogout && (
              <div className="pt-3 border-t border-gray-100">
                <button
                  onClick={onLogout}
                  className="w-full py-2.5 px-4 bg-[#DE5246]/5 hover:bg-[#DE5246]/10 text-[#DE5246] hover:text-[#B2251B] font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Quality badge certifications */}
            <div className="bg-gray-50 border p-4 rounded-lg flex items-start gap-2 text-[10.5px] text-gray-500 leading-normal">
              <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-800">Verified NATA Lab Registry</strong>
                <p className="mt-0.5">Authorised to acquire HPLC-sealed biochemical matrices for analytical observation studies.</p>
              </div>
            </div>

          </div>
        </section>

        {/* Right column (Colspan 8): Dispatch orders log */}
        <main className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Cargo Orders & Dispatches History</h3>
                <p className="text-xs text-gray-500 mt-0.5">Manage and track your thermo-delivery containers</p>
              </div>
              <span className="text-xs font-mono text-gray-400">{userOrders.length} registered orders</span>
            </div>

            {userOrders.length === 0 ? (
              <div className="py-12 text-center space-y-4">
                <ClipboardList className="w-10 h-10 text-gray-300 mx-auto" />
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-900 block">No Dispatches Registered</span>
                  <p className="text-[11px] text-gray-500">Initiate a compound request in our catalog to log order databases.</p>
                </div>
                <button
                  onClick={onBackToCatalog}
                  className="px-4 py-2 border rounded-md text-xs font-semibold hover:bg-emerald-50 cursor-pointer"
                >
                  Browse Chemical Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map(order => (
                  <div
                    key={order.id}
                    className="border border-gray-100 rounded-lg p-5 hover:border-gray-200 transition-colors bg-gray-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-mono"
                  >
                    
                    {/* ID & Date */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm text-gray-900 block">{order.id}</strong>
                        
                        {/* Status tag */}
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          order.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="text-gray-400 text-[10.5px]">
                        <span>Formulated: {order.orderDate}</span>
                        <span className="mx-2">•</span>
                        <span>{order.items.reduce((sum, i) => sum + i.quantity, 0)} vials</span>
                      </div>

                      {/* Snippet of items */}
                      <p className="text-gray-500 font-sans tracking-tight leading-normal text-[11px]">
                        Items: {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                      </p>
                    </div>

                    {/* Cost, receipt action, tracking downloads */}
                    <div className="flex flex-col md:items-end gap-2.5 shrink-0 w-full md:w-auto mt-2 md:mt-0">
                      <span className="text-base font-black text-gray-900">${order.total.toFixed(2)} USD</span>
                      
                      <div className="flex gap-2 w-full md:w-auto">
                        <button
                          onClick={() => handlePrintReceipt(order)}
                          className="w-full md:w-auto px-3 py-1.5 border border-gray-200 hover:border-emerald-700 hover:text-emerald-805 bg-white rounded-md text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Invoice
                        </button>
                        <button
                          onClick={() => setActivePage('coas')}
                          className="w-full md:w-auto px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <Beaker className="w-3.5 h-3.5" />
                          COA Batch
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Compliance security warning footer */}
            <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-xl flex items-start gap-2 text-[10.5px] text-amber-800 leading-relaxed font-sans mt-8">
              <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-950">Academic Integrity Clause</strong>
                <p className="mt-0.5">
                  Analytical samples are mapped strictly to designated researcher registration licenses. If any redirection, redistribution, or unauthorized clinical trial is observed, lab privileges will be instantly terminated, and registered logs will be submitted to Australian regulatory databases.
                </p>
              </div>
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}
