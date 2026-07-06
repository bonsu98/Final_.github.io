import React, { useEffect } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Product } from '../types';

interface SeoLandingPageProps {
  products: Product[];
  onBack: () => void;
  onProductClick: (product: Product) => void;
}

export default function SeoLandingPage({ products, onBack, onProductClick }: SeoLandingPageProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Set specific SEO meta tags for this landing page
    document.title = "Proteins Related to Peptides: The Ultimate Guide | Swiss Peptides";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Explore the key differences and similarities between peptides and proteins related to peptides. Learn how these essential amino acid chains drive modern research.");
    const metaKey = document.querySelector('meta[name="keywords"]');
    if (metaKey) metaKey.setAttribute("content", "protein related to peptides, peptides, research peptides, BPC-157, Retatrutide, amino acids, peptide synthesis");
  }, []);

  const bpc157 = products.find(p => p.id === 'pep-bpc157');
  const retatrutide = products.find(p => p.id === 'pep-retatrutide');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <button 
        onClick={onBack}
        className="group mb-8 inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#DE5246] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Home
      </button>

      <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-8 py-12 border-b border-gray-200 text-center">
          <span className="inline-block px-3 py-1 bg-[#DE5246]/10 text-[#DE5246] rounded-full text-xs font-bold tracking-wider uppercase mb-4">
            Educational Guide
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Proteins Related to Peptides
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Understanding the structural bridge between short-chain amino acids and complex biological macromolecules in modern research.
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12 prose prose-lg prose-[#DE5246] max-w-none">
          <h2>The Fundamental Connection</h2>
          <p>
            When researchers discuss <strong>proteins related to peptides</strong>, they are essentially exploring the continuum of amino acid chains. Both peptides and proteins share the exact same building blocks: amino acids linked by peptide bonds. The distinction primarily lies in their length and structural complexity.
          </p>
          <p>
            Generally, a chain of fewer than 50 amino acids is classified as a peptide, while anything longer is considered a protein. However, the exact cutoff is arbitrary, and the structural behavior of the molecule is what truly defines it. Proteins related to peptides often share similar functional domains or are derived from the cleavage of larger protein molecules.
          </p>

          <div className="my-10 bg-gray-50 rounded-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold mb-4 mt-0 text-gray-900">Key Differences in Research Applications</h3>
            <ul className="space-y-3 list-none pl-0">
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-[#DE5246] mr-3 shrink-0 mt-0.5" />
                <span><strong>Size & Complexity:</strong> Peptides are smaller and less complex, allowing them to penetrate tissues and cellular membranes more easily than large, bulky proteins.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-[#DE5246] mr-3 shrink-0 mt-0.5" />
                <span><strong>Stability:</strong> Peptides can be synthesized with specific modifications to increase their stability in vitro and in vivo, making them highly desirable for targeted research.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-[#DE5246] mr-3 shrink-0 mt-0.5" />
                <span><strong>Synthesis:</strong> Short peptides can be chemically synthesized with high purity, whereas large proteins usually require recombinant biological expression systems.</span>
              </li>
            </ul>
          </div>

          <h2>Spotlight: BPC-157</h2>
          <p>
            A prime example of a peptide that interacts heavily with protein synthesis pathways is <strong>BPC-157</strong>. This pentadecapeptide (15 amino acids) is derived from a protective protein naturally found in the stomach. Research indicates that BPC-157 may influence the upregulation of various growth factors and proteins related to tissue regeneration.
          </p>

          {bpc157 && (
            <div className="my-8 p-6 bg-white border-2 border-gray-100 hover:border-[#DE5246]/30 transition-colors rounded-xl flex flex-col sm:flex-row items-center gap-6 shadow-sm">
              <div className="w-32 h-32 shrink-0 bg-gray-50 rounded-lg p-2 border border-gray-100">
                <img src={bpc157.imageUrl} alt={bpc157.name} className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-xl font-bold text-gray-900 m-0">{bpc157.name}</h4>
                <p className="text-gray-500 text-sm mt-1 mb-4">{bpc157.priceRange}</p>
                <button 
                  onClick={() => onProductClick(bpc157)}
                  className="inline-flex items-center px-6 py-2 bg-[#DE5246] text-white font-bold rounded-md hover:bg-[#c9453b] transition-colors cursor-pointer"
                >
                  View Product Details
                </button>
              </div>
            </div>
          )}

          <h2>Advancements in Metabolic Research</h2>
          <p>
            Another fascinating area of study involves metabolic peptides like <strong>Retatrutide</strong>. These molecules mimic naturally occurring incretin proteins (such as GLP-1, GIP, and Glucagon) to study metabolic regulation, glucose homeostasis, and energy expenditure. By synthesizing short peptide analogs of these large protein hormones, scientists can achieve highly specific receptor activation.
          </p>

          {retatrutide && (
            <div className="my-8 p-6 bg-white border-2 border-gray-100 hover:border-[#DE5246]/30 transition-colors rounded-xl flex flex-col sm:flex-row items-center gap-6 shadow-sm">
              <div className="w-32 h-32 shrink-0 bg-gray-50 rounded-lg p-2 border border-gray-100">
                <img src={retatrutide.imageUrl} alt={retatrutide.name} className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-xl font-bold text-gray-900 m-0">{retatrutide.name}</h4>
                <p className="text-gray-500 text-sm mt-1 mb-4">{retatrutide.priceRange}</p>
                <button 
                  onClick={() => onProductClick(retatrutide)}
                  className="inline-flex items-center px-6 py-2 bg-[#DE5246] text-white font-bold rounded-md hover:bg-[#c9453b] transition-colors cursor-pointer"
                >
                  View Product Details
                </button>
              </div>
            </div>
          )}

          <h2>Conclusion</h2>
          <p>
            Whether you are investigating tissue repair mechanisms, metabolic pathways, or neurological functions, understanding the intricate relationship between peptides and larger protein structures is essential. High-purity synthesized peptides provide a reliable, targeted tool for unlocking the secrets of complex protein biology.
          </p>
        </div>
      </article>
    </div>
  );
}
