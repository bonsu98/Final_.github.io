import React from 'react';

interface AboutInfoProps {
  onShop?: () => void;
}

export default function AboutInfo({ onShop }: AboutInfoProps) {
  return (
    <div className="w-full bg-white text-gray-800">
      {/* Hero Banner matching the requested image design with parallax scrolling */}
      <div 
        className="relative h-[240px] md:h-[350px] w-full bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center"
        style={{ backgroundImage: 'url("/src/assets/images/about_banner_1780347239092.png")' }}
      >
        {/* Darkening overlays for elite contrast as shown in user's image */}
        <div className="absolute inset-0 bg-slate-900/40" />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Centered Caption */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide text-white drop-shadow-md select-none font-sans">
            About Us
          </h1>
        </div>
      </div>

      {/* Increased top spacing between background image section and content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        
        {/* Precision Section matching the screenshot layout and styles exactly */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-left leading-relaxed text-[#0F1E2E]/90 select-text"
          style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px', fontWeight: 400 }}
        >
          {/* Left Column Blocks */}
          <div className="space-y-6">
            <div className="border-l-[1.5px] border-slate-900 pl-3">
              <p>
                About us – Welcome to <strong className="font-bold text-slate-950">Swiss Peptides</strong>, a dedicated supplier of premium research peptides committed to quality, transparency, and reliability. We understand that precision matters, which is why we focus on sourcing high-purity peptides manufactured under strict quality standards and carefully handled to maintain integrity from production to delivery.
              </p>
            </div>
            
            <p>
              At <strong className="font-bold text-slate-950">Swiss Peptides</strong>, we believe that access to quality research materials should be straightforward and supported by responsive customer service. Whether you are conducting academic research, laboratory studies, or exploratory projects, we aim to be a reliable partner in your scientific journey.
            </p>

            <p>
              Our mission at <strong className="font-bold text-slate-950">Swiss Peptides</strong> is to provide high-quality research peptides while upholding the highest standards of integrity, compliance, and customer care. We are committed to continuous improvement, staying informed about scientific advancements, and ensuring our products meet rigorous quality expectations.
            </p>
          </div>

          {/* Right Column Blocks */}
          <div className="space-y-6">
            <p className="mt-0 pt-0">
              Our team is passionate about supporting the research community with dependable products and clear, honest communication. Every batch is selected with attention to consistency and quality control, ensuring researchers receive materials they can trust. We prioritize streamlined ordering, secure packaging, and prompt dispatch, making the entire process smooth and professional.
            </p>

            <div className="space-y-2 pt-1.5">
              <h2 className="font-bold text-slate-950" style={{ fontSize: '15px' }}>
                Our Mission
              </h2>
              <p>
                We strive to build long-term relationships based on trust, transparency, and consistency — delivering not just products, but confidence in every order.
              </p>
            </div>
          </div>
        </div>

        {/* Increased Spacing Outer gap divider (as requested) */}
        <div className="h-28 md:h-40" />

        {/* Some Cool Facts Section */}
        <div className="border-b border-gray-250/60 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            {/* Title Column */}
            <div className="lg:col-span-5">
              <h2 
                style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '34px', fontWeight: 700, lineHeight: '1.25' }}
                className="text-[#071F3F] select-text tracking-tight"
              >
                Some Cool Facts<br />
                Numbers Speak For<br />
                Themselves
              </h2>
            </div>

            {/* Stats Column */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 items-start">
              <div className="flex flex-col items-center text-center">
                <span 
                  style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '68px', fontWeight: 600, lineHeight: '1.1' }}
                  className="text-[#071F3F] select-text"
                >
                  150
                </span>
                <span 
                  style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '19px', fontWeight: 400, color: '#747D88' }}
                  className="mt-2 select-text"
                >
                  Products
                </span>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <span 
                  style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '68px', fontWeight: 600, lineHeight: '1.1' }}
                  className="text-[#071F3F] select-text"
                >
                  15
                </span>
                <span 
                  style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '19px', fontWeight: 400, color: '#747D88' }}
                  className="mt-2 select-text"
                >
                  Years of Experience
                </span>
              </div>

              <div className="flex flex-col items-center text-center">
                <span 
                  style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '68px', fontWeight: 600, lineHeight: '1.1' }}
                  className="text-[#071F3F] select-text"
                >
                  25
                </span>
                <span 
                  style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '19px', fontWeight: 400, color: '#747D88' }}
                  className="mt-2 select-text font-normal"
                >
                  Completed Projects
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Increased Spacing gap to section 3 (as requested) */}
        <div className="h-28 md:h-40" />

        {/* Brand Core Strengths & Vendors Column Section */}
        <div className="space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
            {/* Column 1: Trusted Quality */}
            <div className="lg:col-span-4 space-y-4">
              <h3 
                style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '16px', fontWeight: 700 }}
                className="text-[#071F3F] select-text"
              >
                Trusted Quality
              </h3>
              <p 
                style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px', fontWeight: 400, lineHeight: '1.7' }}
                className="text-[#0F1E2E]/85 select-text"
              >
                Peptides sourced from <a href="https://buypeptidesaustralia.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#DE5246] transition-colors underline decoration-[#DE5246]/30">https://buypeptidesaustralia.com</a> are positioned around a foundation of trusted quality, transparency, and consistency. A reliable peptide supplier understands that purity, accurate sequencing, and proper laboratory handling are essential for dependable research outcomes, which is why quality control, batch testing, and clear documentation such as Certificates of Analysis are so important about us. From careful synthesis processes to secure packaging and controlled storage conditions, every step contributes to maintaining peptide integrity and stability. When choosing a supplier, trust comes from knowing the products are handled professionally, tested for purity, and supported with clear information — giving researchers confidence in the materials they receive.
              </p>
            </div>

            {/* Column 2: Customer Focused – Support */}
            <div className="lg:col-span-4 space-y-4">
              <h3 
                style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '16px', fontWeight: 700 }}
                className="text-[#071F3F] select-text"
              >
                Customer Focused – Support
              </h3>
              <p 
                style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px', fontWeight: 400, lineHeight: '1.7' }}
                className="text-[#0F1E2E]/85 select-text"
              >
                <strong className="font-bold">Swiss Peptides</strong> (<a href="https://buypeptidesaustralia.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#DE5246] transition-colors underline decoration-[#DE5246]/30">https://buypeptidesaustralia.com</a>) is truly <strong className="font-bold">customer-focused</strong>, offering support that goes beyond simply providing products. Understanding that purchasing and using peptides can raise questions, their team is dedicated to guiding customers with clear information, prompt responses, and professional advice. From helping navigate product options to ensuring smooth ordering and delivery, every interaction is designed to make the experience seamless and reassuring. By prioritizing customer needs, addressing concerns quickly, and providing reliable guidance, they build trust and confidence, showing that excellent support is as important as the quality of the peptides themselves.
              </p>
            </div>

            {/* Column 3: Main Callout Head */}
            <div className="lg:col-span-4 flex items-start">
              <h1 
                style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '23px', fontWeight: 700, lineHeight: '1.35' }}
                className="text-[#071F3F] select-text tracking-tight uppercase"
              >
                We Are The Vendors You Can Trust On For A Perfect Solution To All Your Needs.
              </h1>
            </div>
          </div>

          {/* Row B: Bottom Shop Callout action opposite bottom Shop button */}
          <div className="max-w-5xl mx-auto pt-16 flex flex-col sm:flex-row justify-start items-center gap-y-6 sm:gap-x-32">
            <h2 
              style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '23px', fontWeight: 700 }}
              className="text-[#071F3F] select-text text-center sm:text-left tracking-tight font-bold"
            >
              By Premium Swiss Peptide
            </h2>
            <button
              onClick={onShop}
              className="bg-[#DE5246] hover:bg-[#DE5246]/90 text-white font-bold tracking-wider px-8 py-3 rounded-full text-sm uppercase transition-all shadow-sm cursor-pointer shrink-0"
              style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 700 }}
            >
              SHOP
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
