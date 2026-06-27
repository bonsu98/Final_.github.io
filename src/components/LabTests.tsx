import React, { useState, useEffect } from 'react';
import { COABatch } from '../types';
import { Search, Beaker, ShieldCheck, Download, AlertCircle, Printer } from 'lucide-react';

interface LabTestsProps {
  coas: COABatch[];
}

export default function LabTests({ coas }: LabTestsProps) {
  const [searchBatchId, setSearchBatchId] = useState('');
  const [selectedCOA, setSelectedCOA] = useState<COABatch | null>(null);
  const [lookupError, setLookupError] = useState('');

  // Automatically select the first available COA once loaded from props
  useEffect(() => {
    if (coas && coas.length > 0 && !selectedCOA) {
      setSelectedCOA(coas[0]);
    }
  }, [coas, selectedCOA]);

  const handleBatchSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    const term = searchBatchId.trim().toUpperCase();

    const match = coas.find(
      c => c.id.toUpperCase() === term || c.batchNumber.toUpperCase().includes(term) || c.productName.toUpperCase() === term
    );

    if (match) {
      setSelectedCOA(match);
    } else {
      setLookupError('Specified Batch ID or Certificate registration was not located.');
    }
  };

  // Custom SVG render helper for the batch HPLC graph
  const renderLabHPLCSVG = (coa: COABatch) => {
    const points = coa.hplcPeakData;
    const width = 600;
    const height = 250;
    const padding = 35;

    const maxX = 20;
    const minX = 0;
    const maxY = 100;
    const minY = 0;

    const mapX = (val: number) => padding + ((val - minX) / (maxX - minX)) * (width - 2 * padding);
    const mapY = (val: number) => height - padding - ((val - minY) / (maxY - minY)) * (height - 2 * padding);

    let pathD = '';
    points.forEach((p, idx) => {
      const x = mapX(p.time);
      const y = mapY(p.intensity);
      if (idx === 0) {
        pathD += `M ${x} ${y}`;
      } else {
        pathD += ` L ${x} ${y}`;
      }
    });

    return (
      <svg className="w-full h-full text-[#DE5246]" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Grid helper lines */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#E5E7EB" strokeWidth="1.5" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#E5E7EB" strokeWidth="1.5" />
        
        {/* X axis ticks */}
        {[0, 5, 10, 15, 20].map((tVal, idx) => {
          const x = mapX(tVal);
          return (
            <g key={idx}>
              <line x1={x} y1={height - padding} x2={x} y2={height - padding + 5} stroke="#D1D5DB" />
              <text x={x} y={height - padding + 15} textAnchor="middle" fontSize="10" fill="#9CA3AF" fontFamily="monospace">
                {tVal}m
              </text>
            </g>
          );
        })}

        {/* Y-axis purity grids */}
        {[0, 25, 50, 75, 100].map((yVal, idx) => {
          const y = mapY(yVal);
          return (
            <g key={idx}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#F3F4F6" strokeDasharray="3,3" />
              <text x={padding - 8} y={y + 3} textAnchor="end" fontSize="9" fill="#9CA3AF" fontFamily="monospace">
                {yVal}%
              </text>
            </g>
          );
        })}

        {/* The HPLC sequence trace area */}
        <path d={pathD} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />

        {/* Analytical Peak Marker */}
        {points.length > 50 && (
          <g>
            <circle cx={mapX(10.0)} cy={mapY(points[50].intensity)} r="5" fill="#10B981" />
            <line x1={mapX(10.0)} y1={mapY(points[50].intensity)} x2={mapX(10.0)} y2={mapY(points[50].intensity) - 30} stroke="#10B981" strokeWidth="1" strokeDasharray="2,2" />
            <rect x={mapX(10.0) - 45} y={mapY(points[50].intensity) - 48} width="90" height="15" rx="3" fill="#10B981" />
            <text x={mapX(10.0)} y={mapY(points[50].intensity) - 38} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="monospace">
              Main peak: {coa.purity}
            </text>
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="bg-[#FAF9F5] py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="border-b pb-6">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#DE5246] uppercase">
            Double-Blind Accredited Assays
          </span>
          <h1 className="text-3.5xl font-sans font-black text-gray-950 tracking-tight mt-1.5 uppercase">
            Laboratory HPLC Quality Portal
          </h1>
          <p className="text-gray-400 text-xs font-mono mt-1 uppercase">
            Verification desk • Blind cross-linked chromatography records database
          </p>
        </div>

        {/* Layout splits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* List panel (left column) */}
          <aside className="lg:col-span-4 bg-white border border-[#EAEAEC] rounded-2xl p-5 shadow-3xs space-y-5">
            <div>
              <h3 className="text-xs font-black uppercase text-gray-950 tracking-wide font-mono">
                Verify Registry Certificate
              </h3>
              <p className="text-[11px] text-gray-400 leading-normal mt-0.5">
                Input your printed batch reference (e.g., SP-B###### or Retatrutide) to verify live liquid-chromatogram separation data.
              </p>
            </div>

            {/* Input form */}
            <form onSubmit={handleBatchSearch} className="space-y-3 font-mono text-xs">
              <div className="relative">
                <input
                  type="text"
                  required
                  value={searchBatchId}
                  onChange={(e) => setSearchBatchId(e.target.value)}
                  placeholder="e.g. SP-B17281, Retatrutide"
                  className="w-full bg-gray-50 border p-2.5 pl-3 pr-4 rounded-xl text-xs uppercase focus:outline-none focus:border-[#DE5246]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gray-950 hover:bg-black text-white text-[11px] font-bold rounded-xl transition-all cursor-pointer uppercase"
              >
                Lookup Batch Record
              </button>

              {lookupError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-[10px]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{lookupError}</span>
                </div>
              )}
            </form>

            <div className="border-t pt-4 space-y-3">
              <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest font-mono">
                Available COA Batches
              </h4>
              <div className="space-y-2 h-72 overflow-y-auto pr-1">
                {coas.map(coa => (
                  <button
                    key={coa.id}
                    onClick={() => {
                      setSelectedCOA(coa);
                      setSearchBatchId(coa.id);
                      setLookupError('');
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                      selectedCOA?.id === coa.id
                        ? 'bg-gray-900 border-gray-900 text-white shadow-xs font-bold'
                        : 'border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-mono text-[10.5px] tracking-tight">{coa.productName}</span>
                      <span className={`text-[9px] px-1.5 rounded font-mono ${
                        selectedCOA?.id === coa.id ? 'bg-white/25 text-white' : 'bg-[#E55B4C]/10 text-[#DE5246] font-bold'
                      }`}>
                        {coa.purity}
                      </span>
                    </div>
                    <span className="text-[9px] text-gray-400 font-mono mt-1 block">Batch: {coa.batchNumber}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Graphical Certificate details (right column) */}
          <main className="lg:col-span-8">
            {selectedCOA ? (
              <div className="bg-white border border-[#EAEAEC] rounded-2xl p-6 sm:p-8 shadow-3xs space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5 text-xs font-mono">
                  <div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold uppercase ${
                      selectedCOA.status === 'Certified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'
                    }`}>
                      LAB COMPLIANT STATUS: {selectedCOA.status}
                    </span>
                    <h3 className="text-xl font-sans font-black text-gray-950 uppercase tracking-tight mt-3">
                      Chemical Certificate of Analysis (COA)
                    </h3>
                    <p className="text-gray-400 mt-1">Ref tracking coordinate: #COA-{selectedCOA.id}</p>
                  </div>
                  
                  <div className="sm:text-right font-bold text-xs">
                    <span className="block text-gray-400 text-[10px] uppercase">CHROMATOGRAPHIC PURITY</span>
                    <span className="text-3xl font-black text-[#DE5246] leading-none">{selectedCOA.purity}</span>
                  </div>
                </div>

                {/* HPLC curve */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono block">HPLC-Diode separation trace curve</span>
                  <div className="h-72 bg-[#FAFBFD] p-1.5 rounded-xl flex items-center justify-center border border-gray-100">
                    {renderLabHPLCSVG(selectedCOA)}
                  </div>
                </div>

                {/* Chemical metadata info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono pt-4 border-t border-gray-100">
                  <div className="space-y-1.5 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">ANALYSIS BATCH CODES</span>
                    <div className="space-y-1 pt-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Batch Code:</span>
                        <span className="font-bold text-gray-800">{selectedCOA.batchNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Compound Target:</span>
                        <span className="font-bold text-gray-800">{selectedCOA.productName} HPLC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Diagnostic Date:</span>
                        <span className="font-bold text-gray-800">{selectedCOA.testDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">ENDORSEMENT LABORATORY</span>
                    <div className="space-y-1 pt-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Institution:</span>
                        <span className="font-bold text-gray-850 text-right">{selectedCOA.laboratory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Officer Lead:</span>
                        <span className="font-bold text-gray-850 text-right">{selectedCOA.analyst}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification features footer */}
                <div className="flex justify-between items-center text-xs font-mono border-t pt-4">
                  <p className="text-gray-400 leading-tight pr-6">
                    Verify sequence coordinates by requesting full Mass Spectrometry (MS) details on clinical letterheads.
                  </p>
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => window.print()}
                      className="p-2 border rounded-md hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                      title="Print analytical report"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        alert(`Downloading PDF Certificate #COA-${selectedCOA.id}...`);
                      }}
                      className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white border border-[#EAEAEC] rounded-2xl p-16 text-center space-y-4 shadow-3xs">
                <Beaker className="w-12 h-12 text-gray-300 mx-auto animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 font-sans">Select Batch to View Certificate</h3>
                  <p className="text-xs text-gray-400">Pick any batch from the sidebar list or search above.</p>
                </div>
              </div>
            )}
          </main>

        </div>

      </div>
    </div>
  );
}
