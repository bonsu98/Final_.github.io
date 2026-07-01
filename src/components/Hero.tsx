import React from 'react';

interface HeroProps {
  onExploreClick: () => void;
  onVerifyClick: () => void;
  setActiveCategory: (category: string) => void;
}

export default function Hero({ onExploreClick, onVerifyClick, setActiveCategory }: HeroProps) {
  return (
    <div className="flex flex-col">
      {/* 1. PHOTOGRAPHIC HERO SECTION (Matching second Image exactly) */}
      <div 
        className="relative min-h-[500px] md:min-h-[620px] flex items-center justify-center text-center px-4 py-20 bg-black overflow-hidden bg-cover bg-center bg-scroll md:bg-fixed"
        style={{
          backgroundImage: "url('./src/assets/images/peptide_vials_hero_1780001932117.png')",
        }}
      >
        {/* Dark translucent overlay for maximum readability and dramatic high contrast */}
        <div className="absolute inset-0 bg-black/65 backdrop-blur-3xs z-0 pointer-events-none"></div>

        {/* Hero content centered overlay */}
        <div className="max-w-4xl mx-auto relative z-10 space-y-6 md:space-y-8">
          
          <h1 style={{ fontSize: '36px' }} className="font-montserrat font-bold tracking-tight text-white uppercase drop-shadow-md leading-none">
            Swiss Peptides
          </h1>

          <h2 style={{ fontSize: '14px' }} className="text-white font-sans tracking-wide max-w-2xl mx-auto leading-relaxed drop-shadow-sm opacity-90 font-medium">
            Looking To Buy Peptides? We Offer Top-Quality Peptides With Fast, Secure Shipping Across The Country. Shop Now For The Best In Health, Fitness, And Wellness!
          </h2>

          <div className="pt-2">
            <button
              onClick={onExploreClick}
              className="px-8 py-4 bg-[#E55B4C] hover:bg-[#DE5246] hover:scale-103 text-white font-extrabold text-xs md:text-sm tracking-wider uppercase rounded-full shadow-lg hover:shadow-2xl transition-all font-sans cursor-pointer h-14 min-w-[180px] hover:bg-black border border-white/10"
            >
              Shop Now
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
