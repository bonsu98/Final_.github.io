import React, { useEffect, useState } from 'react';

export default function RefundPolicy() {
  const [content, setContent] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('peps_refund_content');
    if (saved) {
      setContent(saved);
    }
  }, []);

  // Default refund policy description if not customized
  const defaultPolicyText = `At Buy Peptides Australia, we stand behind the outstanding quality and analytical precision of our research peptide formulations. We are committed to ensuring a secure and reliable acquisition experience for all laboratories and clinical biochemistry professionals.

1. Refund & Returns Guarantee
We offer a 100% Money Back & Reshipped Guarantee on all packages containing chemical formulation reagents under the following conditions:
- The package is lost in transit by the courier service.
- The delivered products do not match the order details.
- The biochemical reagents do not meet our certified HPLC purity index (with analytical lab test documentation).

2. Delivery and Dispatch Conditions
Standard courier deliveries usually resolve within 2 - 5 business days across major cities (Sydney, Melbourne, Brisbane). If a shipment fail to reach its destination or is held/damaged, please reach out to our customer center immediately. We will initiate a complete refund or issue a priority express reshipment at no additional charge.

3. Restocking & Returns Procedure
Due to safety, security, and the strict temperature control standards required to preserve raw chemical compounds, we cannot accept physical returns of opened or unsealed products.
If you require an exchange or refund under our guarantee:
- Do not utilize the reagent seals.
- Contact our Support Desk on WhatsApp or Email at mail@buypeptidesaustralia.com within 14 days of receipt.
- Provide your order number, a summary of your inquiry, and photos or lab test results if applicable.

4. Quick & Seamless Processing
Once reviewed, approved refunds will be credited back via PAYID or the original payment method within 2-3 business days. Your satisfaction and scientific confidence in your reagents constitutes our absolute highest operational priority.`;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 py-16 text-left font-sans">
        
        {/* Top small header */}
        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-2">
          CLIENT WARRANTY & TERMS
        </span>

        {/* Big title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0B1E33] tracking-tight font-montserrat mb-4 uppercase">
          REFUND & RETURNS POLICY
        </h1>

        {/* Small italicized line */}
        <p className="text-gray-500 text-sm italic mb-10">
          See our Refund & Returns Policy
        </p>

        {/* Content body */}
        <div className="text-[#4A5568] text-[13.5px] leading-relaxed whitespace-pre-wrap font-sans space-y-4">
          {content ? (
            <div>
              {content}
            </div>
          ) : (
            <div className="space-y-6">
              {defaultPolicyText.split('\n\n').map((para, idx) => {
                if (para.match(/^\d+\./)) {
                  // If it starts with a number e.g. "1. Refund & Returns Guarantee"
                  const lines = para.split('\n');
                  return (
                    <div key={idx} className="space-y-2 mt-4">
                      <h2 className="text-xl font-bold text-[#0B1E33] font-montserrat tracking-tight">
                        {lines[0]}
                      </h2>
                      {lines.slice(1).map((line, lIdx) => (
                        <p key={lIdx}>{line}</p>
                      ))}
                    </div>
                  );
                }
                return <p key={idx}>{para}</p>;
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
