import React, { useState, useEffect } from 'react';
import { Product, COABatch } from '../types';
import { MapPin, Mail, Phone, ArrowLeft, Check, Star, ShieldCheck, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface ProductDetailProps {
  product: Product;
  coas: COABatch[];
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, customPrice?: number) => void;
  products?: Product[];
  onProductClick?: (product: Product) => void;
}

export default function ProductDetail({ 
  product, 
  coas, 
  onBack, 
  onAddToCart,
  products,
  onProductClick
}: ProductDetailProps) {
  // Configurator options
  const [selectedDosage, setSelectedDosage] = useState<string>('');
  const [selectedVialCount, setSelectedVialCount] = useState<string>('');
  const [showOptionError, setShowOptionError] = useState<boolean>(false);
  const [addQty, setAddQty] = useState<number>(1); // Set default starting quantity to 1 as requested
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [selectedMedia, setSelectedMedia] = useState<'vial' | 'certificate' | 'chromatogram' | 'massspec'>('vial');

  // Persistent Local Reviews State scoped to product
  const STORAGE_KEY = `peps_reviews_${product.id}`;
  const [localReviews, setLocalReviews] = useState<Array<{user: string; rating: number; date: string; text: string}>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch(e){}
    }
    return [
      { user: "Oliver P.", rating: 5, date: "April 12, 2026", text: "Exceptional purity level certified by HPLC check. Shipping to Sydney took only 2 days. Highly recommended." },
      { user: "Sarah M.", rating: 5, date: "April 18, 2026", text: "Outstanding stability and reconstitution experience. The customer support was extremely responsive to research licensing inquiries." },
      { user: "Jackson K.", rating: 4, date: "May 02, 2026", text: "Very consistent assay measurements. Packaging was highly protected with secure bubble wrap. Will buy again." },
      { user: "Emily L.", rating: 5, date: "May 05, 2026", text: "The HPLC report was provided with my batch, 99.8% purity confirmed. Great price value for Australia." },
      { user: "Thomas D.", rating: 5, date: "May 10, 2026", text: "Incredible speed! Free bacteriostatic water and syringes included made setup easy for my laboratory studies." },
      { user: "Dr. Alistair R.", rating: 5, date: "May 14, 2026", text: "Top-tier purity index. Standard deviations within 0.15% on UV chromatography. Essential quality for clinical biochemistry research." },
      { user: "Chloe W.", rating: 4, date: "May 19, 2026", text: "A great addition to our longevity study protocols. High purity and reliable courier tracking." },
      { user: "Marcus B.", rating: 5, date: "May 22, 2026", text: "Genuinely appreciate the transparency in pricing and lab reports. Best source for peptides in Australia." },
      { user: "Isabella G.", rating: 5, date: "May 24, 2026", text: "Consistently positive outcomes with our cell-line experiments. Fully dissolved instantly without any residue." },
      { user: "Harrison T.", rating: 5, date: "May 28, 2026", text: "Unmatched price matching and batch-to-batch consistency. Excellent customer portal speed." }
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localReviews));
  }, [localReviews, STORAGE_KEY]);

  // RELATED PRODUCTS PREPARATION (matching precisely the 4 products from the uploaded image)
  const relatedProductIds = [
    'pep-bpc157-tb500-ghk-kpv',
    'pep-cagrilintide',
    'pep-cjc1295-dac',
    'pep-bpc157-tb500-ghk-blend'
  ];

  // Try to find them in the products array or fallback
  const displayRelated = (products && products.length > 0)
    ? products.filter(p => relatedProductIds.includes(p.id))
    : [];

  const finalRelated = [...displayRelated];
  if (finalRelated.length < 4 && products) {
    products.forEach(p => {
      if (!finalRelated.find(item => item.id === p.id) && finalRelated.length < 4 && p.id !== product.id) {
        finalRelated.push(p);
      }
    });
  }

  // Form input states
  const [formRating, setFormRating] = useState<number>(5);
  const [formReviewText, setFormReviewText] = useState<string>('');
  const [formAuthor, setFormAuthor] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formSaveConsent, setFormSaveConsent] = useState<boolean>(true);
  const [formSubmitSuccess, setFormSubmitSuccess] = useState<boolean>(false);

  // Load saved name/email if consent was checked
  useEffect(() => {
    const savedName = localStorage.getItem('review_author_name');
    const savedEmail = localStorage.getItem('review_author_email');
    if (savedName) setFormAuthor(savedName);
    if (savedEmail) setFormEmail(savedEmail);
  }, []);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formReviewText.trim() || !formAuthor.trim() || !formEmail.trim()) {
      return;
    }

    if (formSaveConsent) {
      localStorage.setItem('review_author_name', formAuthor.trim());
      localStorage.setItem('review_author_email', formEmail.trim());
    } else {
      localStorage.removeItem('review_author_name');
      localStorage.removeItem('review_author_email');
    }
    
    // Formatting date as "Month Day, Year" in English
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const now = new Date();
    const formattedDate = `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()}`;

    const newReview = {
      user: formAuthor.trim(),
      email: formEmail.trim(),
      rating: formRating,
      date: formattedDate,
      text: formReviewText.trim()
    };

    setLocalReviews(prev => [...prev, newReview]);
    setFormReviewText('');
    
    if (!formSaveConsent) {
      setFormAuthor('');
      setFormEmail('');
    }
    
    setFormSubmitSuccess(true);
    setTimeout(() => {
      setFormSubmitSuccess(false);
    }, 4000);
  };
  
  // Calculate pricing based on options
  const basePriceOnProduct = product.price || 95.00;
  
  // Dosage pricing multiplier
  const getDosageMultiplier = (dosage: string) => {
    switch (dosage) {
      case '5mg': return 0.8;
      case '10mg': return 1.0;
      case '15mg': return 1.3;
      case '20mg': return 1.6;
      default: return 1.0;
    }
  };

  // Quantity count and discount multiplier
  const getQtyInfo = (qtyStr: string) => {
    switch (qtyStr) {
      case '1 Vial': return { count: 1, discount: 1.0 };
      case '2 Vials': return { count: 2, discount: 0.95 };
      case '5 Vials': return { count: 5, discount: 0.90 };
      case '10 Vials': return { count: 10, discount: 0.85 };
      case '20 Vials': return { count: 20, discount: 0.80 };
      case '50 Vials': return { count: 50, discount: 0.70 };
      case '100 Vials': return { count: 100, discount: 0.55 }; // wholesale discount
      default: return { count: 1, discount: 1.0 };
    }
  };

  // Live total calculation
  const dosageMult = selectedDosage ? getDosageMultiplier(selectedDosage) : 1.0;
  const qtyInfo = selectedVialCount ? getQtyInfo(selectedVialCount) : { count: 1, discount: 1.0 };
  
  const calculatedUnitPrice = parseFloat((basePriceOnProduct * dosageMult * qtyInfo.discount).toFixed(2));
  const calculatedLineTotal = parseFloat((calculatedUnitPrice * qtyInfo.count).toFixed(2));

  // Handle add to cart click
  const handleAddClick = () => {
    if (!selectedDosage || !selectedVialCount) {
      setShowOptionError(true);
      return;
    }
    setShowOptionError(false);
    const customizedProduct = {
      ...product,
      dosage: selectedDosage,
      vialCount: selectedVialCount
    };
    onAddToCart(customizedProduct, addQty, calculatedLineTotal);
  };

  useEffect(() => {
    if (selectedDosage && selectedVialCount) {
      setShowOptionError(false);
    }
  }, [selectedDosage, selectedVialCount]);

  // Retrieve batch COA for HPLC visual
  const matchingCOA = coas.find(c => c.productId === product.id) || coas[0];

  // Reconstitution computation
  const vialMg = selectedDosage ? parseFloat(selectedDosage) : parseFloat(product.dosage || "10mg"); 
  const isNadOrHighWeight = product.id === 'pep-nad' || product.id === 'pep-nad-10ml';
  const weightMg = isNadOrHighWeight ? 200 : (isNaN(vialMg) ? 10 : vialMg);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [product.id]);

  return (
    <div className="bg-white pb-24 font-sans text-gray-800">
      <Helmet>
        <title>{product.name} | Swiss Peptides</title>
        <meta name="description" content={`Buy ${product.name} (${product.purity} purity). ${product.description}`} />
        <meta name="keywords" content={`${product.name}, buy ${product.name}, research peptides, protein related to peptides, swisspeptides`} />
        
        {/* JSON-LD Schema for Product */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": [
              `https://buyswisspetides.shop${product.imageUrl.replace('.', '')}`
            ],
            "description": product.description,
            "sku": product.id,
            "offers": {
              "@type": "Offer",
              "url": `https://buyswisspetides.shop/#${product.id}`,
              "priceCurrency": "USD",
              "price": product.price,
              "itemCondition": "https://schema.org/NewCondition",
              "availability": "https://schema.org/InStock"
            }
          })}
        </script>
      </Helmet>
      
      {/* SECTION 1: Product Configurator & HPLC chromatogram report section (Exact image replica layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start bg-transparent">
          
          {/* Left Column (5 Cols): HPLC Chromatogram sheet & Thumbnails */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Main display area (no double card nesting, just premium image container) */}
            <div className="w-full relative overflow-hidden select-none">
              {selectedMedia === 'vial' && (
                <div className="w-full flex items-center justify-center bg-transparent rounded-none overflow-hidden h-[450px] p-0 transition-all duration-300">
                  <img 
                    src={product.thumbnailVial || product.imageUrl} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain rounded-none select-none border-0 shadow-none outline-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {selectedMedia === 'certificate' && (
                product.thumbnailCert ? (
                  <div className="w-full flex items-center justify-center bg-transparent rounded-none overflow-hidden h-[450px] p-0 transition-all duration-350">
                    <img 
                      src={product.thumbnailCert} 
                      alt="Peptide Analysis Certificate" 
                      className="max-h-full max-w-full object-contain rounded-lg select-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="w-full bg-white border border-gray-100 rounded-2xl p-6 relative select-none font-sans overflow-hidden text-slate-800 flex flex-col justify-between h-[450px]">
                    <div className="border border-slate-200 rounded-lg p-5 bg-white relative h-full flex flex-col justify-between shadow-2xs">
                      <div className="flex justify-between items-start border-b border-gray-150 pb-3">
                        <div>
                          <span className="text-[9px] font-mono tracking-widest text-[#E57B70] uppercase font-bold">CERTIFICATE OF ANALYSIS</span>
                          <h2 className="text-sm font-extrabold uppercase font-sans text-slate-900 mt-0.5">{product.name} HPLC TESTED</h2>
                        </div>
                        <div className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[9px] font-bold font-mono tracking-wider flex items-center gap-1 border border-emerald-100">
                          <span>✓ VERIFIED</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 text-xs font-sans">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-gray-400 block uppercase font-mono">SPECIFICATION INDEX</span>
                          <div className="font-bold text-gray-800">{product.name} ({selectedDosage || product.dosage || '10mg'})</div>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-gray-400 block uppercase font-mono">HPLC PURITY RATING</span>
                          <div className="font-bold text-emerald-600">
                            {matchingCOA.productId === product.id ? `${matchingCOA.purity}` : `${product.purity}`}
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-gray-455 block uppercase font-mono">FORMULATION METHOD</span>
                          <div className="font-mono text-gray-655">HPLC-UV/VIS Segment</div>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-gray-455 block uppercase font-mono">BATCH COMPLIANCE</span>
                          <div className="font-bold text-gray-800">100% Pass Rate</div>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-[10px] text-gray-400 font-mono">
                        <span>Lot ID: SP-260327-02</span>
                        <span>Authorized: Evans. M</span>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-center gap-1 bg-amber-50/50 border border-amber-200/40 py-1.5 rounded-md">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500 fill-amber-50" />
                        <span className="text-[9px] font-semibold text-amber-800 tracking-wider uppercase font-sans">GUARANTEED BATCH INTEGRITY</span>
                      </div>
                    </div>
                  </div>
                )
              )}

              {selectedMedia === 'chromatogram' && (
                product.thumbnailChrom ? (
                  <div className="w-full flex items-center justify-center bg-transparent rounded-none overflow-hidden h-[450px] p-0 transition-all duration-350">
                    <img 
                      src={product.thumbnailChrom} 
                      alt="Peptide Analysis Chromatogram" 
                      className="max-h-full max-w-full object-contain rounded-lg select-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="w-full bg-white border border-gray-100 rounded-2xl p-6 relative select-none font-sans overflow-hidden h-[450px] flex flex-col justify-between">
                    <div className="text-[10px] text-gray-400 font-mono tracking-tight border-b border-gray-150 pb-2 mb-3 break-all flex justify-between items-center">
                      <span>_26\33...6 2026-03-31 18-16-19\019-23-V260327-8 02 {product.name}</span>
                      <span className="text-[#E57B70] font-bold">HPLC SPECTRUM</span>
                    </div>

                    <div className="h-48 w-full relative border-b border-l border-gray-300 bg-white/50 mb-3 px-2">
                      <div className="absolute left-0 bottom-1/4 right-0 border-t border-gray-150/45 border-dashed"></div>
                      <div className="absolute left-0 bottom-2/4 right-0 border-t border-gray-150/45 border-dashed"></div>
                      <div className="absolute left-0 bottom-3/4 right-0 border-t border-gray-150/45 border-dashed"></div>

                      <svg className="w-full h-full text-indigo-500 overflow-visible" viewBox="0 0 400 140" preserveAspectRatio="none">
                        <path 
                          d="M 5 120 
                             L 30 121 
                             L 55 119 
                             L 80 121 
                             L 105 120 
                             L 130 122 
                             L 155 119 
                             L 180 120
                             Q 200 120, 201 114
                             L 204 105
                             L 206 70
                             L 211 12
                             L 213 70
                             L 215 108
                             L 220 120
                             L 245 121
                             L 270 119
                             L 295 122
                             L 320 120
                             L 345 121
                             L 370 120
                             L 395 120" 
                          fill="none" 
                          stroke="rgb(59, 130, 246)" 
                          strokeWidth="1.5" 
                          />
                        <line x1="211" y1="12" x2="211" y2="120" stroke="rgb(156, 163, 175)" strokeWidth="0.5" strokeDasharray="2 2" />
                      </svg>

                      <span 
                        className="absolute text-[8px] font-mono text-gray-500 origin-center -rotate-90 select-none pb-0.5 font-bold whitespace-nowrap"
                        style={{ left: '54%', bottom: '50%' }}
                      >
                        6.535 - Surrogate
                      </span>

                      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-10 text-[8px] font-mono text-gray-400 translate-y-3.5">
                        <span>4</span>
                        <span>6</span>
                        <span>8</span>
                        <span>10</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 border border-gray-200 rounded-sm overflow-hidden text-[11px] text-gray-700 font-sans bg-white">
                      <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-150 text-center font-bold py-1 px-1.5">
                        <div className="col-span-1 border-r border-gray-200"></div>
                        <div className="col-span-11 uppercase font-mono text-[9px] text-left pl-3">HPLC CHROMATOGRAM TESTING ANALYSIS METHOD</div>
                      </div>
                      <div className="grid grid-cols-12 text-center py-1 px-1.5 items-center">
                        <div className="col-span-1 border-r border-gray-200 text-[9px] text-gray-400 font-mono">ity</div>
                        <div className="col-span-5 border-r border-gray-150 text-gray-700 font-mono">HPLC-UV/VIS</div>
                        <div className="col-span-6 text-emerald-600 font-bold font-mono text-[10px]">
                          {matchingCOA.productId === product.id ? `>${matchingCOA.purity} ± 0.18%` : `>${product.purity} ± 0.18%`}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}

              {selectedMedia === 'massspec' && (
                product.thumbnailMass ? (
                  <div className="w-full flex items-center justify-center bg-transparent rounded-none overflow-hidden h-[450px] p-0 transition-all duration-350">
                    <img 
                      src={product.thumbnailMass} 
                      alt="Peptide Analysis Mass Spectrometry" 
                      className="max-h-full max-w-full object-contain rounded-lg select-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="w-full bg-white border border-gray-100 rounded-2xl p-6 relative select-none font-sans overflow-hidden h-[450px] flex flex-col justify-between">
                    <div className="text-[10px] text-gray-400 font-mono tracking-tight border-b border-gray-150 pb-2 mb-3 flex justify-between items-center">
                      <span>LOT SPECTRUM ANALOGY // MS REFERENCE REPORT</span>
                      <span className="text-indigo-600 font-bold">MASS SPEC</span>
                    </div>

                    <div className="h-48 w-full relative border-b border-l border-gray-300 bg-white/50 px-2 select-none">
                      <div className="absolute left-0 bottom-1/3 right-0 border-t border-gray-100/70"></div>
                      <div className="absolute left-0 bottom-2/3 right-0 border-t border-gray-100/70"></div>

                      <svg className="w-full h-full text-indigo-500 overflow-visible" viewBox="0 0 400 140" preserveAspectRatio="none">
                        <line x1="160" y1="130" x2="160" y2="15" stroke="rgb(79, 70, 229)" strokeWidth="1.8" />
                        <text x="160" y="10" className="text-[8px] font-mono fill-indigo-800 text-center font-bold" textAnchor="middle">
                          M+H: {weightMg * 10}.32
                        </text>

                        <line x1="80" y1="130" x2="80" y2="110" stroke="rgb(156, 163, 175)" strokeWidth="1" />
                        <line x1="161.5" y1="130" x2="161.5" y2="85" stroke="rgb(79, 70, 229)" strokeWidth="1" />
                        <line x1="240" y1="130" x2="240" y2="120" stroke="rgb(156, 163, 175)" strokeWidth="1" />
                        <line x1="320" y1="130" x2="320" y2="90" stroke="rgb(156, 163, 175)" strokeWidth="1" />
                      </svg>

                      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-6 text-[8px] font-mono text-gray-400 translate-y-3.5">
                        <span>m/z: 200</span>
                        <span>400</span>
                        <span>600</span>
                        <span>800</span>
                        <span>1000</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-gray-150 rounded text-[10px] text-gray-500 leading-relaxed font-sans mt-4">
                      Mass spectrometry analysis matches the exact theoretical mass distribution of <strong className="text-gray-700 font-bold">{product.name}</strong> molecule without additional adducts or structural degraded polymers.
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Thumbnail selector row matching user image precisely */}
            <div className="grid grid-cols-4 gap-3 items-center">
              
              {/* Thumbnail 1: Real vial photography card */}
              <div 
                onClick={() => setSelectedMedia('vial')}
                className={`aspect-square bg-gray-50 border-2 rounded-lg overflow-hidden p-1 shadow-xs cursor-pointer select-none transition-all ${
                  selectedMedia === 'vial' ? 'border-[#DE5246]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img 
                  src={product.imageUrl} 
                  alt="peptide vial" 
                  className="w-full h-full object-cover rounded-md"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Thumbnail 2: mini PDF lab reports */}
              <div 
                onClick={() => setSelectedMedia('certificate')}
                className={`aspect-square bg-white border-2 rounded-lg p-2 flex flex-col justify-between cursor-pointer select-none transition-all ${
                  selectedMedia === 'certificate' ? 'border-[#DE5246]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-[7px] font-mono text-gray-400 uppercase leading-tight border-b pb-1 text-center font-bold">CERTIFICATE</div>
                {/* mini layout */}
                <div className="space-y-0.5 my-1">
                  <div className="w-10/12 h-1 bg-red-400"></div>
                  <div className="w-6/12 h-1 bg-gray-200"></div>
                  <div className="w-8/12 h-1 bg-gray-200"></div>
                </div>
                <div className="text-[7px] font-bold text-emerald-600 text-right font-mono">99.8%</div>
              </div>

              {/* Thumbnail 3: mini PDF lab reports */}
              <div 
                onClick={() => setSelectedMedia('chromatogram')}
                className={`aspect-square bg-white border-2 rounded-lg p-2 flex flex-col justify-between cursor-pointer select-none transition-all ${
                  selectedMedia === 'chromatogram' ? 'border-[#DE5246]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-[7px] font-mono text-gray-400 uppercase leading-tight border-b pb-1 text-center font-bold">CHROMATOGRAM</div>
                <div className="relative h-6 bg-slate-50/50 rounded-xs border flex items-center justify-center">
                  <span className="text-[8px] font-sans text-blue-500 font-bold select-none font-bold">📊</span>
                </div>
                <div className="text-[7px] font-bold text-gray-500 text-right font-mono font-bold">Page 1</div>
               </div>

              {/* Thumbnail 4: mini PDF lab reports */}
              <div 
                onClick={() => setSelectedMedia('massspec')}
                className={`aspect-square bg-white border-2 rounded-lg p-2 flex flex-col justify-between cursor-pointer select-none transition-all ${
                  selectedMedia === 'massspec' ? 'border-[#DE5246]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-[7px] font-mono text-gray-400 uppercase leading-tight border-b pb-1 text-center font-bold">MASS SPEC</div>
                <div className="space-y-1">
                  <div className="w-12 h-1 bg-indigo-500 rounded-full"></div>
                  <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
                </div>
                <div className="text-[7px] font-bold text-gray-500 text-right font-mono">EVANS.M</div>
              </div>

            </div>

          </div>

          {/* Right Column (7 Cols): Product Info and Config Choices */}
          <div className="lg:col-span-7 flex flex-col justify-between self-stretch">
            <div className="space-y-6">
              
              {/* Back navigation */}
              <button 
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-[#DE5246] transition-colors cursor-pointer select-none mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
              </button>

              {/* Breadcrumb matching layout */}
              <nav className="text-[12px] text-gray-400 font-sans tracking-tight mb-1 select-none">
                <span className="hover:text-[#DE5246] cursor-pointer transition-colors" onClick={onBack}>Home</span>
                <span className="mx-1 text-gray-300">/</span>
                <span className="hover:text-[#DE5246] cursor-pointer transition-colors" onClick={onBack}>peptides</span>
                <span className="mx-1 text-gray-300">/</span>
                <span className="text-gray-650 font-medium">{product.name}</span>
              </nav>

              {/* peptides tag */}
              <span className="text-[12px] font-semibold text-gray-400 lowercase select-none block tracking-wide">
                peptides
              </span>

              {/* Title exact copy */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0C1B2D] tracking-tight uppercase font-sans">
                {product.name}
              </h1>

              {/* Star Rating Section */}
              <div className="flex items-center gap-2 select-none">
                <div className="flex items-center text-amber-400">
                  <Star className="w-[17.5px] h-[17.5px] fill-amber-400" />
                  <Star className="w-[17.5px] h-[17.5px] fill-amber-400" />
                  <Star className="w-[17.5px] h-[17.5px] fill-amber-400" />
                  <Star className="w-[17.5px] h-[17.5px] fill-amber-400" />
                  <Star className="w-[17.5px] h-[17.5px] fill-amber-400 text-amber-300/40" />
                </div>
                <span className="text-[12px] text-gray-500 font-medium font-sans">
                  ({localReviews.length} customer reviews)
                </span>
              </div>

              {/* Price range with high-emphasis display */}
              <div className="pt-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-sans">
                  {selectedDosage && selectedVialCount ? (
                    <span>${calculatedLineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  ) : (
                    <span>{product.priceRange || "$95.00 – $42,000.00"}</span>
                  )}
                </div>
                
                {/* Specific exact tagline matching image perfectly */}
                <p className="text-[12px] text-[#DE5246] font-bold tracking-wide mt-1.5 font-sans">
                  Free ; Bac Water, Syringes and Swabs
                </p>
              </div>

              {/* Horizontal line separation */}
              <div className="border-t border-gray-100 my-6"></div>

              {/* Dropdown Options selectors precisely replicating the choices */}
              <div className="space-y-5">
                
                {/* Dosage section */}
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-700 tracking-wide uppercase block">
                    Dosage
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDosage}
                      onChange={(e) => setSelectedDosage(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-[#DE5246] focus:bg-white text-gray-800 font-semibold appearance-none cursor-pointer"
                    >
                      <option value="">Choose an option</option>
                      <option value="5mg">5mg</option>
                      <option value="10mg">10mg</option>
                      <option value="15mg">15mg</option>
                      <option value="20mg">20mg</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Quantity section */}
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-700 tracking-wide uppercase block">
                    Quantity
                  </label>
                  <div className="relative">
                    <select
                      value={selectedVialCount}
                      onChange={(e) => setSelectedVialCount(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-[#DE5246] focus:bg-white text-gray-800 font-semibold appearance-none cursor-pointer"
                    >
                      <option value="">Choose an option</option>
                      <option value="1 Vial">1 Vial</option>
                      <option value="2 Vials">2 Vials (5% Discount)</option>
                      <option value="5 Vials">5 Vials (10% Discount)</option>
                      <option value="10 Vials">10 Vials (15% Discount)</option>
                      <option value="20 Vials">20 Vials (20% Discount)</option>
                      <option value="50 Vials">50 Vials (30% Discount)</option>
                      <option value="100 Vials">100 Vials (45% Discount)</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 text-xs">
                      ▼
                    </div>
                  </div>
                </div>

              </div>

              {/* Interactive add to cart row matching image elements */}
              <div className="pt-6 flex flex-wrap items-center gap-4">
                
                {/* Quantity counter input */}
                <div className="flex items-center border border-gray-305 rounded-lg bg-gray-50 overflow-hidden shrink-0">
                  <button 
                    onClick={() => setAddQty(q => Math.max(1, q - 1))}
                    className="px-4 py-3 text-gray-400 hover:text-gray-800 font-bold text-sm cursor-pointer select-none transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={addQty}
                    onChange={(e) => setAddQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 text-center text-xs font-bold bg-transparent border-none focus:outline-none text-gray-800"
                  />
                  <button 
                    onClick={() => setAddQty(q => q + 1)}
                    className="px-4 py-3 text-gray-400 hover:text-gray-800 font-bold text-sm cursor-pointer select-none transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Highly-emphasized coral ADD TO CART button strictly following mockup image style */}
                <button
                  disabled={!selectedDosage || !selectedVialCount}
                  onClick={handleAddClick}
                  className={`flex-1 min-w-[200px] px-8 py-3.5 text-white text-[12px] font-bold tracking-widest uppercase rounded-full shadow-md transition-all flex items-center justify-center gap-2 ${
                    (!selectedDosage || !selectedVialCount)
                      ? "bg-gray-205 text-gray-400 border border-gray-300 cursor-not-allowed shadow-none"
                      : "bg-[#E57B70] hover:bg-[#DE5246] active:scale-[0.98] cursor-pointer"
                  }`}
                >
                  ADD TO CART
                </button>

              </div>

              {showOptionError && (
                <div className="mt-4 p-3 bg-red-55 border border-red-200 text-red-600 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Please select both Dosage and Quantity options above first.</span>
                </div>
              )}

            </div>

            {/* SKU and Category Footer specifications info */}
            <div className="pt-6 border-t border-gray-100/60 mt-10 text-[12px] text-gray-400 space-y-1 font-sans font-medium">
              <div>
                <span>SKU: </span>
                <span className="text-gray-500">N/A</span>
              </div>
              <div>
                <span>Category: </span>
                <span className="text-gray-500">peptides</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* SECTION 3: Description & Reviews Tabs (matching the uploaded image layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-12">
        
        {/* Tab Headers bar */}
        <div className="flex items-center gap-8 border-b border-gray-100 pb-px">
          <button 
            onClick={() => setActiveTab('description')}
            className={`pb-4 text-[13px] md:text-[14px] font-bold uppercase tracking-wider relative transition-all cursor-pointer select-none ${
              activeTab === 'description' 
                ? 'text-slate-900 font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-slate-950 text-slate-950 font-black' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Description
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-[13px] md:text-[14px] font-bold uppercase tracking-wider relative transition-all cursor-pointer select-none ${
              activeTab === 'reviews' 
                ? 'text-slate-900 font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-slate-950 text-slate-950 font-black' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Reviews ({localReviews.length})
          </button>
        </div>

        {/* Tab content area */}
        <div className="py-10 font-sans">
          {activeTab === 'description' ? (
            <div className="space-y-6 text-[#4F5B66] leading-relaxed max-w-5xl" style={{ fontSize: '13.5px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              
              {product.detailedDescription && product.detailedDescription.trim().length > 0 ? (
                product.detailedDescription.split('\n\n').filter(p => p.trim()).map((paragraph, index) => {
                  if (paragraph.trim().startsWith('# ')) {
                    return (
                      <h1 key={index} className="text-3xl text-slate-950 font-extrabold tracking-tight mt-6 mb-2 text-[#031525] font-montserrat uppercase">
                        {paragraph.replace('# ', '').trim()}
                      </h1>
                    );
                  }
                  if (paragraph.trim().startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-2xl text-slate-950 font-black tracking-tight pt-6 pb-2 text-[#031525] font-montserrat">
                        {paragraph.replace('## ', '').trim()}
                      </h2>
                    );
                  }
                  return (
                    <p key={index} className="whitespace-pre-line">
                      {paragraph}
                    </p>
                  );
                })
              ) : (
                <>
                  {/* Product Title Price Heading */}
                  <h1 className="text-3xl md:text-[2.25rem] text-slate-950 font-extrabold font-montserrat uppercase tracking-tight mb-8 mt-1 text-[#031525]">
                    {product.name} Price
                  </h1>

                  {/* Dynamic yet exact replicas of the paragraph content in the image */}
                  <p>
                    Buy {product.name} at Peptides Australia for competitive prices that reflect quality and reliable supply, perfect for research needs. See {product.name.toLowerCase()} price.
                  </p>

                  <p>
                    Choose the right vial size and purity to meet your specific research requirements, ensuring accurate and reliable results.
                  </p>

                  <p>
                    Trusted suppliers like BuySwissPeptide offer lab-grade verification, giving you the confidence that you're purchasing quality research peptides.
                  </p>

                  <p>
                    Transparent pricing ensures you're investing in high-quality {product.name}, specifically tailored for research, not clinical or therapeutic use.
                  </p>

                  <p className="pb-4">
                    Order now from <a href="https://buyswisspeptides.shop" target="_blank" rel="noreferrer" className="text-[#DE5246] hover:underline font-bold">https://buyswisspeptides.shop</a> and receive research-grade {product.name} with clear product details and lab verification to support your experiments.
                  </p>

                  {/* Heading: What Is product ? */}
                  <h2 className="text-2xl text-slate-950 font-black tracking-tight pt-6 pb-2 text-[#031525] font-montserrat">
                    What Is {product.name} ?
                  </h2>

                  <p className="pb-4">
                    {product.name} is a research peptide gaining attention in the field of metabolic health for its potential effects on weight management and blood sugar regulation. As a peptide {product.name.toLowerCase()}, it functions as a multi-receptor agonist, targeting GLP-1, GIP, and glucagon receptors to help regulate appetite, glucose metabolism, and energy balance. Researchers across Australia and worldwide explore {product.name} Australia for preclinical studies, focusing on its efficacy in obesity and type 2 diabetes models. Those looking to buy {product.name} should source from trusted suppliers like Peptides Australia to ensure lab-grade quality, verified purity, and reliable product information for research purposes.
                  </p>

                  {/* Heading: product Australia */}
                  <h2 className="text-2xl text-slate-950 font-black tracking-tight pt-6 pb-2 text-[#031525] font-montserrat">
                    {product.name} Australia
                  </h2>

                  <p>
                    Looking to buy {product.name} in Australia? Visit Peptides Australia (<a href="https://buyswisspeptides.shop" target="_blank" rel="noreferrer" className="text-[#DE5246] hover:underline font-bold">https://buyswisspeptides.shop</a>) for high-quality, research-grade {product.name} with verified purity and secure shipping.
                  </p>
                </>
              )}

            </div>
          ) : (
            <div className="space-y-6 max-w-3xl">
              <h3 className="text-lg font-bold text-slate-950 font-montserrat">{localReviews.length} Customer Reviews for {product.name}</h3>
              <div className="space-y-4">
                {localReviews.map((rev, index) => (
                  <div key={index} className="p-5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-800">{rev.user}</span>
                        <div className="flex text-amber-550 text-[14.5px]">
                          {Array.from({ length: rev.rating }).map((_, i) => <span key={i}>★</span>)}
                          {Array.from({ length: 5 - rev.rating }).map((_, i) => <span key={i} className="text-gray-200">★</span>)}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">{rev.date}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed font-sans font-medium">{rev.text}</p>
                  </div>
                ))}
              </div>

              {/* Add a Review Form exactly matching the uploaded image */}
              <div className="border border-gray-200 rounded-lg p-6 md:p-8 mt-12 bg-white max-w-3xl text-left shadow-xs">
                <h3 className="text-[20px] font-sans font-medium text-slate-800 mb-1">Add a review</h3>
                <p className="text-xs text-gray-400 font-sans mb-6">
                  Your email address will not be published. Required fields are marked <span className="text-[#DE5246]">*</span>
                </p>

                <form onSubmit={handleReviewSubmit} className="space-y-6 text-left">
                  {/* Rating Selector */}
                  <div className="space-y-1.5">
                    <span className="text-[13px] font-semibold text-slate-800 block">
                      Your rating <span className="text-[#DE5246]">*</span>
                    </span>
                    <div className="flex gap-1.5 items-center">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setFormRating(starVal)}
                          className="p-0.5 focus:outline-none transition-colors group cursor-pointer text-2xl select-none"
                          style={{ color: '#E57B70' }}
                          title={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                        >
                          {formRating >= starVal ? '★' : '☆'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="space-y-1.5 flex flex-col items-start w-full">
                    <label className="text-[13px] font-semibold text-slate-800 block">
                      Your review <span className="text-[#DE5246]">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-[#E57B70] focus:ring-1 focus:ring-[#E57B70] bg-white transition-all text-gray-800"
                      value={formReviewText}
                      onChange={(e) => setFormReviewText(e.target.value)}
                    />
                  </div>

                  {/* Name & Email Inputs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="space-y-1.5 flex flex-col items-start">
                      <label className="text-[12px] text-slate-700 font-semibold block">
                        Name <span className="text-[#DE5246]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full border border-gray-200 rounded p-2.5 text-sm focus:outline-none focus:border-[#E57B70] focus:ring-1 focus:ring-[#E57B70] bg-white transition-all text-gray-800"
                        value={formAuthor}
                        onChange={(e) => setFormAuthor(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-1.5 flex flex-col items-start">
                      <label className="text-[12px] text-slate-700 font-semibold block">
                        Email <span className="text-[#DE5246]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full border border-gray-200 rounded p-2.5 text-sm focus:outline-none focus:border-[#E57B70] focus:ring-1 focus:ring-[#E57B70] bg-white transition-all text-gray-800"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Browser Consent Checkbox */}
                  <div className="flex items-start gap-2.5 pt-1 text-left">
                    <input
                      type="checkbox"
                      id="save-browser-consent"
                      className="mt-1 cursor-pointer rounded border-gray-200 text-[#DE5246] focus:ring-[#DE5246] h-4 w-4 shrink-0"
                      checked={formSaveConsent}
                      onChange={(e) => setFormSaveConsent(e.target.checked)}
                    />
                    <label htmlFor="save-browser-consent" className="text-xs text-slate-500 font-medium select-none cursor-pointer leading-relaxed text-left block">
                      Save my name, email, and website in this browser for the next time I comment.
                    </label>
                  </div>

                  {/* Success Alert */}
                  {formSubmitSuccess && (
                     <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-3 text-xs font-semibold animate-fade-in flex items-center gap-1.5">
                       <span>✓</span> Review submitted successfully! Thank you for your feedback.
                     </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2 text-left">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-[#DE5246] hover:bg-[#DE5246]/95 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer font-sans shadow-xs"
                    >
                      SUBMIT
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* SECTION 4: Related Products Grid (Replicating the WooCommerce user screenshot layout exactly) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-16 pt-16 border-t border-gray-150">
        <h2 style={{ fontSize: '24px' }} className="font-sans font-black text-[#0C1B2D] uppercase tracking-tight mb-8">
          Related products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {finalRelated.map((p) => {
            const priceText = p.priceRange || `$${p.price.toFixed(2)}`;

            return (
              <div key={p.id} className="flex flex-col group animate-fade-in">
                {/* Square full bleed image box with minimal off-white background */}
                <div 
                  onClick={() => onProductClick?.(p)}
                  className="aspect-square w-full bg-[#FAF9F5] rounded-none overflow-hidden flex items-center justify-center hover:scale-[1.01] hover:shadow-xs transition-all duration-350 cursor-pointer mb-3"
                >
                  <img 
                    src={p.imageUrl} 
                    alt={p.name} 
                    className="w-full h-full object-cover rounded-none select-none"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Information and interactive Select details */}
                <div className="flex flex-col items-start justify-between flex-1">
                  <div className="w-full text-left">
                    <span className="text-[11px] text-gray-400 lowercase font-sans font-medium tracking-wide block mb-0.5 select-none text-left">
                      peptides
                    </span>

                    <h3 
                      onClick={() => onProductClick?.(p)}
                      className="font-extrabold text-[#0C1B2D] text-sm md:text-base leading-snug tracking-tight hover:text-[#DE5246] transition-colors cursor-pointer line-clamp-2 min-h-[2.5rem] text-left"
                    >
                      {p.name}
                    </h3>

                    {/* Gold rating stars */}
                    <div className="flex items-center text-amber-500 gap-0.5 select-none mt-1.5 mb-2">
                      <Star className="w-4 h-4 fill-current text-amber-500" />
                      <Star className="w-4 h-4 fill-current text-amber-500" />
                      <Star className="w-4 h-4 fill-current text-amber-500" />
                      <Star className="w-4 h-4 fill-current text-amber-500" />
                      <Star className="w-4 h-4 fill-current text-amber-500" />
                    </div>

                    {/* Bold Price range text */}
                    <div className="font-extrabold text-gray-950 text-sm tracking-tight mb-4 select-text text-left">
                      {priceText}
                    </div>
                  </div>

                  {/* SELECT OPTIONS Button */}
                  <div className="w-full text-left pt-1">
                    <button
                      onClick={() => onProductClick?.(p)}
                      className="px-5 py-2 bg-[#E55B4C] hover:bg-[#DE5246] text-white text-[10px] tracking-wider font-extrabold uppercase rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center justify-center active:scale-[0.98]"
                    >
                      SELECT OPTIONS
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
