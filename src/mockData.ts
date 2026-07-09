import { Product, COABatch } from './types';

const imageMap = import.meta.glob('./assets/images/*.png', { eager: true, import: 'default' }) as Record<string, string>;


export const PRODUCTS: Product[] = [
  {
    id: "pep-adipotide",
    name: "Adipotide",
    chemicalName: "FTPP (Proapoptotic Peptide)",
    formula: "C111H190N36O28S",
    molecularWeight: "2500.00 g/mol",
    dosage: "10mg",
    price: 110.00,
    priceRange: "$110.00 â€“ $21,000.00",
    category: "metabolism",
    purity: "99.20%",
    purityNumber: 99.2,
    imageUrl: imageMap['./assets/images/hgh_191_best_1780030996215.png'],
    description: "An experimental proapoptotic peptide designed to target fat cells and regulate caloric metabolic rates.",
    benefits: ["Targeted adipose tissue research", "Promotes cellular thermogenesis mechanisms"],
    storage: "Store lyophilized dry powder at under -15Â°C.",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 2.0, defaultBacteriostaticWaterMl: 2.0 }
  },
  {
    id: "pep-aicar",
    name: "AICAR",
    chemicalName: "5-Aminoimidazole-4-carboxamide ribonucleotide",
    formula: "C9H15N4O8P",
    molecularWeight: "338.21 g/mol",
    dosage: "50mg",
    price: 115.00,
    priceRange: "$115.00 â€“ $5,100.00",
    category: "metabolism",
    purity: "99.50%",
    purityNumber: 99.5,
    imageUrl: imageMap['./assets/images/peptide_vials_hero_1780001932117.png'],
    description: "An analog of adenosine monophosphate (AMP) which stimulates AMPK activity and cellular glucose uptake.",
    benefits: ["AMPK activation study", "Enhanced metabolic energy research"],
    storage: "Store lyophilized dry powder at under -15Â°C.",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 2.0, defaultBacteriostaticWaterMl: 2.0 }
  },
  {
    id: "pep-aod9604",
    name: "AOD 9604",
    chemicalName: "Anti-Obesity Drug 9604",
    formula: "C78H123N23O23S2",
    molecularWeight: "1815.08 g/mol",
    dosage: "5mg",
    price: 103.00,
    priceRange: "$103.00 â€“ $16,100.00",
    category: "injury",
    purity: "99.10%",
    purityNumber: 99.1,
    imageUrl: imageMap['./assets/images/nad_10ml_best_1780031082396.png'],
    description: "A modified fragment of growth hormone designed to stimulate lipid metabolism and cartilage repair.",
    benefits: ["Lipolytic pathway research", "Cartilage and joint recovery study"],
    storage: "Store lyophilized dry powder at under -15Â°C.",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 2.0, defaultBacteriostaticWaterMl: 2.0 }
  },
  {
    id: "pep-ara290",
    name: "Ara-290",
    chemicalName: "Ara-290 Peptide",
    formula: "C51H84N16O15",
    molecularWeight: "1257.40 g/mol",
    dosage: "10mg",
    price: 108.00,
    priceRange: "$108.00 â€“ $8,000.00",
    category: "cognitive",
    purity: "99.40%",
    purityNumber: 99.4,
    imageUrl: imageMap['./assets/images/retatrutide_best_1780030958269.png'],
    description: "A non-erythropoietic peptide designed to selectively activate the innate repair receptor and protect nerve tissues.",
    benefits: ["Neuroprotective pathway activation", "Nerve tissue repair and inflammatory control"],
    storage: "Store lyophilized dry powder at under -15Â°C.",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 2.0, defaultBacteriostaticWaterMl: 2.0 }
  },
  {
    id: "pep-bpc157-tb500-ghk-kpv",
    name: "BPC 157 + TB500 + GHK-CU + KPV",
    chemicalName: "Synergistic Multi-Component Blend",
    formula: "Hybrid Pentadecapeptide / Thymosin Beta-4 / Copper Complex / KPV Tripeptide",
    molecularWeight: "Blend Sequence",
    dosage: "20mg",
    price: 314.00,
    priceRange: "$314.00 â€“ $21,400.00",
    category: "injury",
    purity: "99.60%",
    purityNumber: 99.6,
    imageUrl: imageMap['./assets/images/ghk_cu_best_1780031016475.png'],
    description: "Ultimate healing master-blend combining BPC-157, TB-500, copper peptide GHK-Cu, and anti-inflammatory KPV.",
    benefits: ["Unmatched tissue and joint regeneration", "Powerful cell-level recovery and protection"],
    storage: "Store lyophilized dry powder at under -15Â°C.",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 2.0, defaultBacteriostaticWaterMl: 2.0 }
  },
  {
    id: "pep-bpc157",
    name: "BPC-157",
    chemicalName: "Body Protection Compound 157",
    formula: "C62H98N16O22",
    molecularWeight: "1419.53 g/mol",
    dosage: "5mg",
    price: 103.00,
    priceRange: "$103.00 â€“ $8,300.00",
    category: "injury",
    purity: "99.80%",
    purityNumber: 99.8,
    imageUrl: imageMap['./assets/images/tirzepatide_best_1780031041817.png'],
    description: "An administrative gastric pentadecapeptide showcasing powerful tissue, tendon, and organ protective profiles.",
    benefits: ["Speeds muscle, tendon, ligament recovery", "Organ and gut protection pathways"],
    storage: "Store lyophilized dry powder at under -15Â°C.",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 2.0, defaultBacteriostaticWaterMl: 2.0 }
  },
  {
    id: "pep-bpc157-tb500-ghk-blend",
    name: "BPC157 + TB500 + GHK-CU Blend",
    chemicalName: "Synergistic Recovery Blend with Copper Peptide",
    formula: "BPC-157 / Thymosin Beta-4 / GHK-Cu Triple Complex",
    molecularWeight: "Blend Sequence",
    dosage: "15mg",
    price: 281.00,
    priceRange: "$281.00 â€“ $19,300.00",
    category: "injury",
    purity: "99.30%",
    purityNumber: 99.3,
    imageUrl: imageMap['./assets/images/bpc157_tb500_best_1780031064715.png'],
    description: "Excellent multi-pathway recovery compound pairing GHK-Cu with the elite muscular remodeling duo of BPC-157 and TB-500.",
    benefits: ["Cellular connective tissue regeneration", "Vessel neoangiogenesis in model studies"],
    storage: "Store lyophilized dry powder at under -15Â°C.",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 2.0, defaultBacteriostaticWaterMl: 2.0 }
  },
  {
    id: "pep-bpc157-tb500-blend",
    name: "BPC157 + TB500 Blend",
    chemicalName: "BPC-157 & Thymosin Beta-4 Core Blend",
    formula: "BPC-157 & TB-500 Combined",
    molecularWeight: "Blend Sequence",
    dosage: "10mg",
    price: 141.00,
    priceRange: "$141.00 â€“ $18,200.00",
    category: "injury",
    purity: "99.50%",
    purityNumber: 99.5,
    imageUrl: imageMap['./assets/images/melanotan2_best_1780031120375.png'],
    description: "Our signature synergistic blend pairing the wound-healing catalyst BPC-157 with the tissue anti-inflammatory agent TB-500.",
    benefits: ["Connective tissue repair and recovery", "Joint extracellular matrix remodeling support"],
    storage: "Store lyophilized dry powder at under -15Â°C.",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 2.0, defaultBacteriostaticWaterMl: 2.0 }
  },
  {
    id: "pep-cagrilintide",
    name: "Cagrilintide",
    chemicalName: "Amylin Analog Peptide",
    formula: "C179H279N53O56S",
    molecularWeight: "4089.50 g/mol",
    dosage: "5mg",
    price: 151.00,
    priceRange: "$151.05 â€“ $30,400.00",
    category: "metabolism",
    purity: "99.20%",
    purityNumber: 99.2,
    imageUrl: imageMap['./assets/images/igf1_lr3_best_1780031102244.png'],
    description: "An investigational long-acting acylated amylin analog studied for metabolic regulation and body weight studies.",
    benefits: ["Satiety and caloric uptake regulation", "Co-administration study with GLP-1 agonists"],
    storage: "Store lyophilized dry powder at under -15Â°C.",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 2.0, defaultBacteriostaticWaterMl: 2.0 }
  },
  {
    id: "pep-cagrilintide-semaglutide",
    name: "Cagrilintide + Semaglutide",
    chemicalName: "Amylin Analog and GLP-1 Agonist Combo",
    formula: "Cagrilintide & Semaglutide Dual",
    molecularWeight: "Blend Sequence",
    dosage: "10mg",
    price: 204.00,
    priceRange: "$204.00 â€“ $33,900.00",
    category: "metabolism",
    purity: "99.70%",
    purityNumber: 99.7,
    imageUrl: imageMap['./assets/images/wegovy_pens_background_1780029483639.png'],
    description: "High-synergism molecular reagent combo targeting dual weight-loss pathways and biological endocrine receptors.",
    benefits: ["Insulin pathway and glucose modeling", "Endocrine receptor research optimization"],
    storage: "Store lyophilized dry powder at under -15Â°C.",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 2.0, defaultBacteriostaticWaterMl: 2.0 }
  },
  {
    id: "pep-cjc1295-dac",
    name: "CJC 1295 DAC",
    chemicalName: "CJC-1295 with Drug Affinity Complex",
    formula: "C165H271N47O46",
    molecularWeight: "3649.16 g/mol",
    dosage: "5mg",
    price: 110.00,
    priceRange: "$110.00 â€“ $13,900.00",
    category: "growth",
    purity: "99.00%",
    purityNumber: 99.0,
    imageUrl: imageMap['./assets/images/mots_c_best_1780030979501.png'],
    description: "A synthetic GHRH analog with added Drug Affinity Complex, ensuring exceptional biological half-life enhancement.",
    benefits: ["Promotes growth hormone secretion", "Prolonged active half-life in peptide models"],
    storage: "Store lyophilized dry powder at under -15Â°C.",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 2.0, defaultBacteriostaticWaterMl: 2.0 }
  },
  {
    id: "pep-cjc1295-no-dac",
    name: "CJC 1295 NO DAC",
    chemicalName: "CJC-1295 without Drug Affinity Complex (Modified GRF 1-29)",
    formula: "C152H252N44O42",
    molecularWeight: "3367.97 g/mol",
    dosage: "5mg",
    price: 105.00,
    priceRange: "$105.00 â€“ $12,900.00",
    category: "growth",
    purity: "99.40%",
    purityNumber: 99.4,
    imageUrl: imageMap['./assets/images/epithalon_best_1780031139756.png'],
    description: "A synthetic, selective GHRH analog lacking DAC, researched for localized, targeted pulse amplification study.",
    benefits: ["Selective pulse growth hormone secretion", "No long-term biological accumulation in vitro"],
    storage: "Store lyophilized dry powder at under -15Â°C.",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 2.0, defaultBacteriostaticWaterMl: 2.0 }
  },
  {
    id: "pep-retatrutide",
    name: "Retatrutide",
    chemicalName: "LY3437943 (GCGR/GIPR/GLP-1R Tri-agonist)",
    formula: "C221H342N54O69",
    molecularWeight: "4841.40 g/mol",
    dosage: "10mg",
    price: 95.00,
    priceRange: "$95.00 â€“ $42,000.00",
    category: "metabolism",
    purity: "99.80%",
    purityNumber: 99.8,
    imageUrl: imageMap['./assets/images/retatrutide_best_1780030958269.png'],
    description: "An experimental tri-agonist peptide targeting GLP-1, GIP, and glucagon receptors to optimize weight and metabolic research.",
    benefits: ["GLP-1, GIP, GCGR triple agonism study", "Intensified adipose tissue lipolysis modeling"],
    storage: "Store lyophilized dry powder at under -15Â°C.",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 2.0, defaultBacteriostaticWaterMl: 2.0 }
  },
  {
    id: "pep-mots-c",
    name: "MOTS-C",
    chemicalName: "Mitochondrial Open Reading Frame of the 12S rRNA-c",
    formula: "C101H152N28O22S2",
    molecularWeight: "2174.62 g/mol",
    dosage: "10mg",
    price: 99.00,
    priceRange: "$99.00 â€“ $21,400.00",
    category: "metabolism",
    purity: "99.50%",
    purityNumber: 99.5,
    imageUrl: imageMap['./assets/images/mots_c_best_1780030979501.png'],
    description: "A mitochondrial-derived peptide regulating metabolic homeostasis, glucose utilization, and cellular physical resilience.",
    benefits: ["AMPK activation and energy homeostasis", "Aids glucose metabolism and cell-level recovery"],
    storage: "Store lyophilized dry powder at under -15Â°C.",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 2.0, defaultBacteriostaticWaterMl: 2.0 }
  },
  {
    id: "pep-hgh-191aa",
    name: "HGH 191 AA 97%",
    chemicalName: "Human Growth Hormone (191 Amino Acids)",
    formula: "C990H1528N262O300S7",
    molecularWeight: "22124.00 g/mol",
    dosage: "10iu",
    price: 113.00,
    priceRange: "$113.00 â€“ $10,300.00",
    category: "growth",
    purity: "97.00%",
    purityNumber: 97.0,
    imageUrl: imageMap['./assets/images/hgh_191_best_1780030996215.png'],
    description: "High-grade recombinant human growth hormone peptide sequence, verified at standard anabolic and repair parameters.",
    benefits: ["Cell growth and muscular synthesis", "Cartilage and epidermal layer cellular renewal"],
    storage: "Store lyophilized dry powder under refrigeration at 2Â°C - 8Â°C (keep dark).",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 2.5, defaultBacteriostaticWaterMl: 2.5 }
  },
  {
    id: "pep-ghk-cu",
    name: "GHK-CU",
    chemicalName: "Glycyl-L-histidil-L-lysine Copper Complex",
    formula: "C14H22CuN6O4",
    molecularWeight: "401.91 g/mol",
    dosage: "50mg",
    price: 103.00,
    priceRange: "$103.00 â€“ $8,000.00",
    category: "injury",
    purity: "99.40%",
    purityNumber: 99.4,
    imageUrl: imageMap['./assets/images/ghk_cu_best_1780031016475.png'],
    description: "Copper-binding tripeptide known for robust cutaneous remodeling, tissue regeneration, and wound healing support traits.",
    benefits: ["Stimulates collagen and elastin synthesis", "Anti-inflammatory and biological skin defense modeling"],
    storage: "Store lyophilized dry powder at under -15Â°C.",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 5.0, defaultBacteriostaticWaterMl: 5.0 }
  },
  {
    id: "pep-tirzepatide",
    name: "Tirzepatide",
    chemicalName: "LY3298176 (GIP/GLP-1 Receptor Agonist)",
    formula: "C225H348N48O68",
    molecularWeight: "4813.52 g/mol",
    dosage: "10mg",
    price: 115.00,
    priceRange: "$115.00 â€“ $42,000.00",
    category: "metabolism",
    purity: "99.10%",
    purityNumber: 99.1,
    imageUrl: imageMap['./assets/images/tirzepatide_best_1780031041817.png'],
    description: "Highly requested synthetic dual GIP and GLP-1 receptor agonist designed for cellular weight-loss and endocrine research.",
    benefits: ["Dual receptor agonist pathway activation", "Optimizes insulin secretion dynamics under research model"],
    storage: "Store lyophilized dry powder at under -15Â°C.",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 2.0, defaultBacteriostaticWaterMl: 2.0 }
  },
  {
    id: "pep-bpc157-tb500",
    name: "BPC157 + TB500 Blend",
    chemicalName: "BPC-157 & Thymosin Beta-4 Core Blend",
    formula: "BPC-157 & TB-500 Combined",
    molecularWeight: "Blend Sequence",
    dosage: "10mg",
    price: 141.00,
    priceRange: "$141.00 â€“ $18,200.00",
    category: "injury",
    purity: "99.50%",
    purityNumber: 99.5,
    imageUrl: imageMap['./assets/images/bpc157_tb500_best_1780031064715.png'],
    description: "Our signature synergistic blend pairing the wound-healing catalyst BPC-157 with the tissue anti-inflammatory agent TB-500.",
    benefits: ["Connective tissue repair and recovery", "Joint extracellular matrix remodeling support"],
    storage: "Store lyophilized dry powder at under -15Â°C.",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 2.0, defaultBacteriostaticWaterMl: 2.0 }
  },
  {
    id: "pep-nad-10ml",
    name: "NAD+ (10ML)",
    chemicalName: "Nicotinamide Adenine Dinucleotide",
    formula: "C21H27N7O14P2",
    molecularWeight: "663.43 g/mol",
    dosage: "10ml",
    price: 182.00,
    priceRange: "$182.00 â€“ $12,400.00",
    category: "longevity",
    purity: "99.10%",
    purityNumber: 99.1,
    imageUrl: imageMap['./assets/images/nad_10ml_best_1780031082396.png'],
    description: "Nicotinamide Adenine Dinucleotide (NAD+) is a coenzyme crucial for mitochondrial function, energy production, and cellular regulation.",
    benefits: ["Sirtuin pathway activation", "Mitochondrial biosynthesis support", "Cellular energy currency generation"],
    storage: "Store sealed vial at under -15Â°C in anhydrous conditions.",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 10.0, defaultBacteriostaticWaterMl: 10.0 }
  },
  {
    id: "pep-igf1-lr3",
    name: "IGF-1 LR3",
    chemicalName: "Long Arg3 Insulin-like Growth Factor-1",
    formula: "C400H625N111O115S8",
    molecularWeight: "9111.00 g/mol",
    dosage: "1mg",
    price: 100.00,
    priceRange: "$100.00 â€“ $16,700.00",
    category: "growth",
    purity: "98.90%",
    purityNumber: 98.9,
    imageUrl: imageMap['./assets/images/igf1_lr3_best_1780031102244.png'],
    description: "Long R3 IGF-1 is an 83 amino acid analog of IGF-1, highly potent in stimulating hyperplasia and muscular synthesis.",
    benefits: ["Enhances cellular protein synthesis", "Promotes muscle cell hyperplasia", "Aids systemic skeletal recovery"],
    storage: "Store lyophilized dry powder at under -15Â°C.",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 2.0, defaultBacteriostaticWaterMl: 2.0 }
  },
  {
    id: "pep-melanotan2",
    name: "melanotan 2",
    chemicalName: "Melanotan II Acetate",
    formula: "C50H69N15O9",
    molecularWeight: "1024.18 g/mol",
    dosage: "10mg",
    price: 155.00,
    priceRange: "$155.00 â€“ $6,000.00",
    category: "longevity",
    purity: "99.50%",
    purityNumber: 99.5,
    imageUrl: imageMap['./assets/images/melanotan2_best_1780031120375.png'],
    description: "A synthetic analog of the peptide hormone alpha-melanocyte stimulating hormone (alpha-MSH) used in melanogenesis studies.",
    benefits: ["Stimulates skin pigmentation pathways", "Maintains cellular defensive barriers"],
    storage: "Store lyophilized dry powder under refrigeration at 2Â°C - 8Â°C.",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 2.0, defaultBacteriostaticWaterMl: 2.0 }
  },
  {
    id: "pep-epitalon",
    name: "Epithalon",
    chemicalName: "Epithalon (Ala-Glu-Asp-Gly)",
    formula: "C14H22N4O9",
    molecularWeight: "390.35 g/mol",
    dosage: "10mg",
    price: 95.00,
    priceRange: "$95.00 â€“ $12,900.00",
    category: "longevity",
    purity: "99.40%",
    purityNumber: 99.4,
    imageUrl: imageMap['./assets/images/epithalon_best_1780031139756.png'],
    description: "A synthetic tetrapeptide studied for telomerase activation, pineal gland regulation, and biological lifespan elongation.",
    benefits: ["Telomerase enzymatic upregulation", "Pineal melatonin secretion trigger", "Anti-aging cellular research"],
    storage: "Store lyophilized dry powder at under -15Â°C.",
    reconstitute: { recommendedDiluent: "Bacteriostatic Water", vialVolumeMl: 2.0, defaultBacteriostaticWaterMl: 2.0 }
  }
];

export const generateHPLCTrace = (targetPurity: number): { time: number; intensity: number }[] => {
  const data: { time: number; intensity: number }[] = [];
  for (let t = 0; t <= 100; t++) {
    const time = parseFloat((t * 0.2).toFixed(2));
    let intensity = 0;

    intensity += Math.random() * 0.4 + 0.1;

    if (time >= 2.8 && time <= 3.6) {
      intensity += 1.2 * Math.exp(-Math.pow((time - 3.2) / 0.15, 2));
    }

    if (time >= 5.1 && time <= 5.9) {
      intensity += 0.6 * Math.exp(-Math.pow((time - 5.5) / 0.18, 2));
    }

    if (time >= 8.5 && time <= 11.5) {
      const scale = (targetPurity / 100) * 85;
      intensity += scale * Math.exp(-Math.pow((time - 10.0) / 0.45, 2));
    }

    if (time >= 15.0 && time <= 15.8) {
      intensity += 0.4 * Math.exp(-Math.pow((time - 15.4) / 0.2, 2));
    }

    data.push({ time, intensity: parseFloat(intensity.toFixed(2)) });
  }
  return data;
};

export const MOCK_COAS: COABatch[] = PRODUCTS.map(p => ({
  id: `AU-B${Math.floor(100000 + Math.random() * 900000)}`,
  productId: p.id,
  productName: p.name,
  batchNumber: `PEPS-AU-${p.name.substring(0,3).toUpperCase()}-2026`,
  purity: p.purity,
  testDate: "2026-05-14",
  laboratory: "Independent 3rd-Party Analytical Lab (Victoria, Australia)",
  analyst: "Dr. Matthew Evans, Lead Analytical Chemist",
  status: "Certified",
  hplcPeakData: generateHPLCTrace(p.purityNumber)
}));

export const MEMORANDUM_FAQS = [
  {
    q: "Are these peptides legal for purchase and research in Switzerland?",
    a: "Yes. Swiss Peptides provides high-purity lyophilized research reagents strictly for laboratory analytical testing and in vitro evaluation studies. These items are legally acquired for academic and scientific investigation purposes."
  },
  {
    q: "How does Express Swiss Post dispatch operate?",
    a: "We ship all orders via Swiss Post Express with tracking. Orders are wrapped in discrete, secure cold-barrier packaging to ensure complete molecular stability. Packages typically reach primary post boxes in Zurich, Geneva, Basel, Bern, and Lausanne in 1-2 business days."
  },
  {
    q: "How do you guarantee up to 99%+ peptide purity?",
    a: "Every batch of peptide goes through exhaustive verification using High-Performance Liquid Chromatography (HPLC) and Mass Spectrometry (MS) to document exact chemical composition. Complete laboratory chromatograms can be verified inside our Lab Quality portal using your unique batch number."
  },
  {
    q: "Are the vials shipped cold?",
    a: "Our peptide reagents are lyophilized (freeze-dried) and extremely stable at standard ambient temperatures when kept sealed in anhydrous conditions. For added security, we ship in heat-buffered envelopes with insulated bubble shielding to prevent extreme thermal exposure during delivery."
  }
];

import { Article } from './types';

const imageMap = import.meta.glob('./assets/images/*.png', { eager: true, import: 'default' }) as Record<string, string>;


export const ARTICLES: Article[] = [
  {
    id: "art-1",
    title: "Understanding Research Peptides: A Comprehensive Guide",
    slug: "understanding-research-peptides",
    excerpt: "Discover the fundamentals of research peptides, how they work, and why they are revolutionizing the scientific and health communities.",
    content: `
# Understanding Research Peptides: A Comprehensive Guide

Peptides have become a cornerstone in modern biological research. But what exactly are they? In simple terms, peptides are short chains of amino acids, the building blocks of proteins. 

## What Are Proteins Related to Peptides?
When people ask about "proteins related to peptides," they are usually referring to the fact that both are made of the same materials: amino acids. The primary difference is size. Peptides typically contain between 2 and 50 amino acids, whereas proteins are much larger and more complex. 

Because of their smaller size, peptides are easier for the body to absorb and utilize. They can penetrate the skin and intestines more readily, making them highly effective for targeted research applications.

## Common Types of Research Peptides
- **Pentadecapeptide (BPC-157):** Known for its remarkable healing properties in research models.
- **GHK-Cu:** Often researched for its anti-aging and tissue remodeling effects.
- **Tirzepatide & Retatrutide:** Currently at the forefront of metabolic and weight loss research.

If you are looking to buy peptides online, it is crucial to source them from reputable providers who offer strict third-party HPLC testing, ensuring you receive 99%+ purity for your experiments.
    `,
    author: "Dr. Matthew Evans",
    publishDate: "2026-06-15",
    imageUrl: imageMap['./assets/images/peptide_vials_hero_1780001932117.png'],
    tags: ["Research Peptides", "Protein", "Guide"]
  },
  {
    id: "art-2",
    title: "What is a Pentadecapeptide? The Science Behind BPC-157",
    slug: "what-is-pentadecapeptide-bpc-157",
    excerpt: "Explore the fascinating science behind pentadecapeptides like BPC-157 and their potential applications in cellular healing and repair.",
    content: `
# What is a Pentadecapeptide?

A **pentadecapeptide** is a peptide composed of exactly 15 amino acids. The most famous pentadecapeptide in scientific literature today is BPC-157 (Body Protection Compound 157). 

## The Mechanism of Action
Derived from a protective protein naturally found in the human stomach, this pentadecapeptide has demonstrated incredible regenerative capabilities in animal models. Researchers studying proteins related to peptides often look at BPC-157 to understand how short amino acid chains can influence systemic healing pathways, including:
- Tendon and ligament repair
- Gastrointestinal healing
- Angiogenesis (the formation of new blood vessels)

## Why Purity Matters
When researching pentadecapeptides, molecular stability is key. Impure peptide sequences can lead to skewed experimental data. At Swiss Peptides, we ensure our BPC-157 is synthesized to exacting standards, routinely achieving over 99% purity.
    `,
    author: "Swiss Peptides Research Team",
    publishDate: "2026-06-20",
    imageUrl: imageMap['./assets/images/peptides_info_vials_1780003530034.png'],
    tags: ["Pentadecapeptide", "BPC-157", "Healing"]
  }
];
