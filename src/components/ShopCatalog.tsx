import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Product } from '../types';

interface ShopCatalogProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function ShopCatalog({
  products,
  onProductClick,
  onAddToCart,
  activeCategory,
  setActiveCategory
 }: ShopCatalogProps) {
  const [sortOrder, setSortOrder] = useState<'default' | 'popularity' | 'rating' | 'latest' | 'price_asc' | 'price_desc'>('default');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 12;

  // Handle advanced sorting locally
  const sortedProducts = useMemo(() => {
    const list = [...products].map((p, index) => {
      // Ensure stable generated properties if they don't exist
      const productRating = p.rating ?? (4.5 + (((p.name.charCodeAt(1) || 7) % 5) / 10)); // between 4.5 and 4.9
      const productPopularity = p.popularity ?? (100 - index * 5 + (p.name.charCodeAt(0) % 10)); // higher is more popular
      
      // Let's create stable timestamp (older index = older, newer index = more recent)
      const daysOffset = index * 2;
      const dateObj = new Date("2026-06-01T00:00:00Z");
      dateObj.setDate(dateObj.getDate() - daysOffset);
      const productCreatedAt = p.createdAt ? new Date(p.createdAt).getTime() : dateObj.getTime();

      return {
        ...p,
        rating: productRating,
        popularity: productPopularity,
        _createdAtTimestamp: productCreatedAt,
      };
    });

    if (sortOrder === 'price_asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortOrder === 'price_desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    if (sortOrder === 'popularity') {
      return [...list].sort((a, b) => b.popularity - a.popularity);
    }
    if (sortOrder === 'rating') {
      return [...list].sort((a, b) => b.rating - a.rating);
    }
    if (sortOrder === 'latest') {
      return [...list].sort((a, b) => b._createdAtTimestamp - a._createdAtTimestamp);
    }
    return list; // default sorting represents provided order
  }, [products, sortOrder]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const displayedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedProducts, currentPage, itemsPerPage]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const sortOptions = [
    { value: 'default', label: 'Default sorting' },
    { value: 'popularity', label: 'Sort by popularity' },
    { value: 'rating', label: 'Sort by average rating' },
    { value: 'latest', label: 'Sort by latest' },
    { value: 'price_asc', label: 'Sort by price: low to high' },
    { value: 'price_desc', label: 'Sort by price: high to low' },
  ] as const;

  const currentOption = sortOptions.find(o => o.value === sortOrder) || sortOptions[0];

  const handleSelectOption = (value: typeof sortOrder) => {
    setSortOrder(value);
    setCurrentPage(1);
    setDropdownOpen(false);
  };

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    // Scroll smoothly to the top of the catalog
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  return (
    <div className="bg-white py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb matching image layout */}
        <nav className="text-[11px] text-gray-400 font-sans tracking-tight mb-2 uppercase select-none">
          <span className="hover:text-[#DE5246] cursor-pointer transition-colors" onClick={() => setActiveCategory('all')}>Home</span>
          <span className="mx-1 text-gray-300">/</span>
          <span className="text-gray-650 font-medium">Shop</span>
        </nav>
 
        {/* Clean large Title "SHOP" */}
        <h1 className="text-4xl sm:text-5xl font-sans font-light tracking-wide text-[#0C1B2D] uppercase mt-2 mb-8 border-b border-transparent pb-1">
          SHOP
        </h1>
 
        {/* Toolbar row with items count and default sorting selector */}
        <div className="flex flex-row justify-between items-center py-4 border-b border-gray-100 mb-8 text-[11px] text-gray-500 font-sans">
          <div className="select-none text-gray-400">
            Showing {sortedProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}â€“
            {Math.min(currentPage * itemsPerPage, sortedProducts.length)} of {sortedProducts.length} results
          </div>
          
          <div className="relative flex items-center" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-transparent pr-4 pl-2 py-1 text-right text-gray-500 font-sans font-semibold text-[13.5px] focus:outline-none cursor-pointer hover:text-[#DE5246] transition-colors flex items-center gap-1.5"
            >
              <span>{currentOption.label}</span>
              <span className="text-[7.5px] text-gray-400">â–¼</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-[220px] bg-white border border-[#CCCCCC] shadow-[0_4px_12px_rgba(0,0,0,0.08)] z-[100] rounded-none overflow-hidden py-0">
                <div className="flex flex-col text-left">
                  {sortOptions.map((opt) => {
                    const isSelected = opt.value === sortOrder;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelectOption(opt.value)}
                        className={`w-full text-left font-sans text-[13px] transition-colors cursor-pointer py-2.5 px-3.5 ${
                          isSelected 
                            ? 'bg-[#7F7F7F] text-white font-medium hover:bg-[#727272]' 
                            : 'bg-white text-[#2B313C] hover:bg-[#F3F4F6] hover:text-[#DE5246]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
 
        {/* Products Grid - Exact 4 column design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col justify-between h-full bg-white text-left"
            >
              <div>
                {/* Product Image Area */}
                <div
                  onClick={() => onProductClick(product)}
                  className="aspect-square bg-[#fbfbfa] relative border border-gray-100 rounded-lg overflow-hidden cursor-pointer flex items-center justify-center hover:opacity-95 transition-all shadow-3xs"
                >
                  <img loading="lazy"
                    src={product.imageUrl}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none transition-transform duration-300 group-hover:scale-102"
                  />
                </div>
 
                {/* Product metadata matching image */}
                <div className="mt-4 space-y-1">
                  <span className="text-[10px] tracking-widest text-[#9CA3AF] font-mono block font-black lowercase select-none">
                    peptides.
                  </span>
                  
                  <h2
                    onClick={() => onProductClick(product)}
                    className="text-[15px] font-extrabold text-[#0C1B2D] tracking-tight leading-snug cursor-pointer hover:text-[#DE5246] transition-colors"
                  >
                    {product.name}
                  </h2>
 
                  {/* Rating Stars - 5 customized golden stars */}
                  <div className="flex text-amber-500 text-[15.5px] gap-0.5 select-none pt-0.5">
                    <span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span>
                  </div>
 
                  {/* Custom Price Range or Single Price */}
                  <div className="text-[13px] font-extrabold text-[#DE5246] mt-2 tracking-tight">
                    {product.priceRange || `$${product.price.toFixed(2)}`}
                  </div>
                </div>
              </div>
 
              {/* Action trigger button */}
              <div className="mt-4 pt-1 text-left">
                <button
                  onClick={() => onProductClick(product)}
                  className="px-5 py-2 bg-[#E55B4C] hover:bg-[#DE5246] text-white text-[10px] tracking-wider font-extrabold uppercase rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center justify-center active:scale-98"
                >
                  SELECT OPTIONS
                </button>
              </div>
 
            </div>
          ))}
        </div>
 
        {/* Beautiful Bottom Left Pagination matching mockup with dynamic active state */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5 mt-20 font-sans select-none">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-8 h-8 flex items-center justify-center rounded-md font-bold text-[11px] transition-all cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-[#0C1B2D] text-white border border-[#0C1B2D]'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-[#0C1B2D] hover:text-[#0C1B2D]'
                }`}
              >
                {pageNum}
              </button>
            ))}
            
            {currentPage < totalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="w-8 h-8 flex items-center justify-center bg-white text-gray-500 border border-gray-200 rounded-md hover:border-[#0C1B2D] hover:text-[#0C1B2D] font-bold text-[11px] transition-colors cursor-pointer"
              >
                â†’
              </button>
            )}
          </div>
        )}
 
      </div>
    </div>
  );
}
