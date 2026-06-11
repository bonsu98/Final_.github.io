import React, { useState, useMemo, useEffect } from 'react';
import { Product, Order, COABatch } from '../types';
import { generateHPLCTrace } from '../mockData';
import { 
  Plus, Edit, Trash2, Check, RefreshCw, Layers, ShieldCheck, 
  Tag, Image as ImageIcon, FileText, ChevronRight, DollarSign, 
  Beaker, CheckCircle2, ShoppingBag, X, Search, FileCheck, HelpCircle,
  Users, Mail, Phone, MapPin, User, Settings, Lock, Eye, CheckCircle, Flame, AlertCircle,
  MessageSquare
} from 'lucide-react';

interface AdminPortalProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  coas: COABatch[];
  setCoas: React.Dispatch<React.SetStateAction<COABatch[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  onBackToCatalog: () => void;
  onLogout?: () => void;
}

const PRELOADED_SWISS_IMAGES = [
  { path: "/src/assets/images/retatrutide_best_1780030958269.png", label: "Retatrutide Premium Formulation" },
  { path: "/src/assets/images/mots_c_best_1780030979501.png", label: "MOTS-C Peptide Specimen" },
  { path: "/src/assets/images/hgh_191_best_1780030996215.png", label: "HGH 191 AA 97% Purity Vial" },
  { path: "/src/assets/images/ghk_cu_best_1780031016475.png", label: "GHK-CU Copper Elite" },
  { path: "/src/assets/images/tirzepatide_best_1780031041817.png", label: "Tirzepatide Dual Incretin Vial" },
  { path: "/src/assets/images/bpc157_tb500_best_1780031064715.png", label: "BPC157 + TB500 Recovery Blend" },
  { path: "/src/assets/images/nad_10ml_best_1780031082396.png", label: "NAD+ 10ml Cellular Vial" },
  { path: "/src/assets/images/igf1_lr3_best_1780031102244.png", label: "IGF-1 LR3 Growth Elite" },
  { path: "/src/assets/images/melanotan2_best_1780031120375.png", label: "Melanotan 2 Skin Peptide" },
  { path: "/src/assets/images/epithalon_best_1780031139756.png", label: "Epithalon Longevity Formulation" },
  { path: "/src/assets/images/peptide_vials_hero_1780001932117.png", label: "Peptide Vials Laboratory Stack" },
  { path: "/src/assets/images/peptides_info_vials_1780003530034.png", label: "Swiss Info Vials Background" },
  { path: "/src/assets/images/wegovy_pens_background_1780029483639.png", label: "Wegovy Weight Management Pen Background" },
];

export default function AdminPortal({
  products,
  setProducts,
  coas,
  setCoas,
  orders,
  setOrders,
  onBackToCatalog,
  onLogout
}: AdminPortalProps) {
  // Navigation tabs following the hierarchical priority requested by user
  const [activeTab, setActiveTab] = useState<'products' | 'channels' | 'operations'>('products');
  const [searchQuery, setSearchQuery] = useState('');

  // Active product ledger pagination states
  const [prodPage, setProdPage] = useState(1);
  const prodItemsPerPage = 6;

  // Reset pagination on search
  useEffect(() => {
    setProdPage(1);
  }, [searchQuery]);

  // 1. PRODUCT MANAGEMENT STATES
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form parameters
  const [prodName, setProdName] = useState('');
  const [prodChemicalName, setProdChemicalName] = useState('');
  const [prodFormula, setProdFormula] = useState('');
  const [prodWeight, setProdWeight] = useState('');
  const [prodDosage, setProdDosage] = useState('');
  const [prodPrice, setProdPrice] = useState(120);
  const [prodMinPrice, setProdMinPrice] = useState(110);
  const [prodMaxPrice, setProdMaxPrice] = useState(240);
  const [prodQuantity, setProdQuantity] = useState(150);
  const [prodOriginalPrice, setProdOriginalPrice] = useState<number | undefined>(undefined);
  const [prodDiscountPercentage, setProdDiscountPercentage] = useState<number | undefined>(undefined);
  
  // Custom Thumbnail List
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [tempImageUrl, setTempImageUrl] = useState('');

  const [prodThumbnailVial, setProdThumbnailVial] = useState('');
  const [prodThumbnailCert, setProdThumbnailCert] = useState('');
  const [prodThumbnailChrom, setProdThumbnailChrom] = useState('');
  const [prodThumbnailMass, setProdThumbnailMass] = useState('');
  
  const [prodCategory, setProdCategory] = useState<'growth' | 'injury' | 'longevity' | 'cognitive' | 'metabolism'>('metabolism');
  const [prodPurity, setProdPurity] = useState('99.50%');
  const [prodPurityNum, setProdPurityNum] = useState(99.50);
  const [prodImageUrl, setProdImageUrl] = useState('vial_blue');
  const [prodDescription, setProdDescription] = useState('');
  const [prodDetailedDescription, setProdDetailedDescription] = useState('');
  const [prodBenefits, setProdBenefits] = useState('');
  const [prodStorage, setProdStorage] = useState('');
  const [prodDiluent, setProdDiluent] = useState('Bacteriostatic Water');
  const [prodVolume, setProdVolume] = useState(2.0);
  const [prodDefaultWater, setProdDefaultWater] = useState(2.0);

  // 2. CHANNELS STATES (REVIEWS + CUSTOM RECEIVER EMAIL + CONTACT US CUSTOMIZATION)
  const [orderEmail, setOrderEmail] = useState(() => {
    return localStorage.getItem('peps_order_email') || 'orders@buyswisspeptides.shop';
  });
  const [contactTitle, setContactTitle] = useState(() => {
    return localStorage.getItem('peps_contact_title') || 'Contact Us';
  });
  const [contactDescription, setContactDescription] = useState(() => {
    return localStorage.getItem('peps_contact_description') || 'For any questions, product inquiries, or support regarding peptides, feel free to contact us for prompt assistance.';
  });
  const [contactAddress, setContactAddress] = useState(() => {
    return localStorage.getItem('peps_contact_address') || '17 South Terrace, Cowell, SA 5602';
  });
  const [contactPhone, setContactPhone] = useState(() => {
    return localStorage.getItem('peps_contact_phone') || '+61 488 856 783';
  });
  const [payidInstructions, setPayidInstructions] = useState(() => {
    return localStorage.getItem('peps_payid_instructions') || 'Contact Us On WhatsApp : +61 488 856 783 Email : mail@buyswisspeptides.shop For Payments and Quick Processing of your Order';
  });

  const [smtpHost, setSmtpHost] = useState(() => {
    return localStorage.getItem('peps_smtp_host') || '';
  });
  const [smtpPort, setSmtpPort] = useState(() => {
    return localStorage.getItem('peps_smtp_port') || '587';
  });
  const [smtpUser, setSmtpUser] = useState(() => {
    return localStorage.getItem('peps_smtp_user') || '';
  });
  const [smtpPassword, setSmtpPassword] = useState(() => {
    return localStorage.getItem('peps_smtp_password') || '';
  });
  const [smtpSecure, setSmtpSecure] = useState(() => {
    return localStorage.getItem('peps_smtp_secure') === 'true';
  });
  const [smtpFromName, setSmtpFromName] = useState(() => {
    return localStorage.getItem('peps_smtp_from_name') || 'Swiss Peptides Shop';
  });
  const [smtpTestEmail, setSmtpTestEmail] = useState('');
  const [smtpTestResult, setSmtpTestResult] = useState<{ success?: boolean; error?: string; message?: string } | null>(null);
  const [smtpTesting, setSmtpTesting] = useState(false);

  const [privacyEditorValue, setPrivacyEditorValue] = useState(() => {
    return localStorage.getItem('peps_privacy_content') || `Who we are
Our website address is: https://buyswisspeptides.shop

Comments
When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor's IP address and browser user agent string to help spam detection.
An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: https://automattic.com/privacy/. After approval of your comment, your profile picture is visible to the public in the context of your comment.

Media
If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.

Cookies
If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.
If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.
When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select "Remember Me", your login will persist for two weeks. If you log out of your account, the login cookies will be removed.
If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.

Embedded content from other websites
Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.
These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.

Who we share your data with
If you request a password reset, your IP address will be included in the reset email.

How long we retain your data
If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.
For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.

What rights you have over your data
If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.

Where your data is sent
Visitor comments may be checked through an automated spam detection service.`;
  });

  const [refundEditorValue, setRefundEditorValue] = useState(() => {
    return localStorage.getItem('peps_refund_content') || `At Buy Peptides Australia, we stand behind the outstanding quality and analytical precision of our research peptide formulations. We are committed to ensuring a secure and reliable acquisition experience for all laboratories and clinical biochemistry professionals.

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
- Contact our Support Desk on WhatsApp or Email at mail@buyswisspeptides.shop within 14 days of receipt.
- Provide your order number, a summary of your inquiry, and photos or lab test results if applicable.

4. Quick & Seamless Processing
Once reviewed, approved refunds will be credited back via PAYID or the original payment method within 2-3 business days. Your satisfaction and scientific confidence in your reagents constitutes our absolute highest operational priority.`;
  });

  // Adding Custom Review Subform States
  const [reviewProdId, setReviewProdId] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewDate, setReviewDate] = useState(() => new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }));

  const [channelSuccessMsg, setChannelSuccessMsg] = useState('');
  const [reviewsTrigger, setReviewsTrigger] = useState(0);

  // WhatsApp & Telegram Chat Widget config states
  const [whatsappNumber, setWhatsappNumber] = useState(() => {
    return localStorage.getItem('peps_whatsapp_number') || '+61 488 856 783';
  });
  const [telegramUsername, setTelegramUsername] = useState(() => {
    return localStorage.getItem('peps_telegram_username') || 'BuySwissPeptide';
  });

  // 3. USER ACCOUNTS STATES
  const [users, setUsers] = useState<any[]>([]);

  // 4. OPERATIONS MANAGEMENT STATES
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrderStatus, setEditingOrderStatus] = useState<'pending' | 'processing' | 'shipped' | 'delivered'>('pending');
  const [editingOrderTracking, setEditingOrderTracking] = useState('');

  const [selectedCOA, setSelectedCOA] = useState<COABatch | null>(null);
  const [coaStatus, setCoaStatus] = useState<'Certified' | 'Pending' | 'Rejected'>('Certified');
  const [coaPurity, setCoaPurity] = useState('99.50%');
  const [coaLaboratory, setCoaLaboratory] = useState('');
  const [coaAnalyst, setCoaAnalyst] = useState('');

  // Load registered users on initiation
  useEffect(() => {
    const saved = localStorage.getItem('peps_registered_users_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUsers(parsed);
          return;
        }
      } catch (e) {}
    }
    // Seed default administrative & researcher records if empty
    const defaults = [
      {
        uid: "swiss-re-1304",
        email: "peptides_research@melbourne-lab.au",
        name: "Dr. Catherine Mitchell",
        organization: "Mitchell Cellular Therapeutics",
        labLicense: "AU-MED-99120",
        role: "researcher",
        joinedAt: "2026-03-12"
      },
      {
        uid: "swiss-re-5502",
        email: "allan.vance@quantumbio.ch",
        name: "Prof. Allan Vance",
        organization: "Biotech Department of Zürich University",
        labLicense: "CH-LIC-44813",
        role: "researcher",
        joinedAt: "2026-04-25"
      },
      {
        uid: "swiss-re-0013",
        email: "support@swisspeptides.com",
        name: "Enterprise Admin Manager",
        organization: "Swiss Peptides Australia Core",
        labLicense: "CH-ADMIN-6009",
        role: "administrator",
        joinedAt: "2026-01-01"
      }
    ];
    localStorage.setItem('peps_registered_users_list', JSON.stringify(defaults));
    setUsers(defaults);
  }, []);

  // Sync users list to localStorage on modifications
  const syncUsers = (updatedList: any[]) => {
    setUsers(updatedList);
    localStorage.setItem('peps_registered_users_list', JSON.stringify(updatedList));
  };

  // Helper: Seed test researcher accounts
  const handleSeedMockUser = () => {
    const freshMockUsers = [
      ...users,
      {
        uid: `swiss-re-${Math.floor(1000 + Math.random() * 8999)}`,
        email: `tester.${Math.floor(100 + Math.random() * 899)}@anu.edu.au`,
        name: `Researcher ${Math.floor(10 + Math.random() * 89)} (Mock)`,
        organization: `Australian National Biotech Labs`,
        labLicense: `AU-LIC-${Math.floor(100000 + Math.random() * 899999)}`,
        role: "researcher",
        joinedAt: new Date().toISOString().substring(0, 10)
      }
    ];
    syncUsers(freshMockUsers);
    setChannelSuccessMsg("Test customer profile seeded successfully!");
    setTimeout(() => setChannelSuccessMsg(""), 3000);
  };

  // Helper: Toggle roles
  const handleToggleUserRole = (uid: string) => {
    const updated = users.map(u => {
      if (u.uid === uid) {
        return {
          ...u,
          role: u.role === 'administrator' ? 'researcher' : 'administrator'
        };
      }
      return u;
    });
    syncUsers(updated);
  };

  // Helper: Delete User
  const handleDeleteUser = (uid: string) => {
    if (confirm("Are you sure you want to delete this user profile? The user will no longer be able to sign in.")) {
      const updated = users.filter(u => u.uid !== uid);
      syncUsers(updated);
    }
  };

  // 1. PRODUCT MULTIPLE IMAGES MANAGEMENT
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProdImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = ''; // Reset input selection
  };

  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempImageUrl.trim()) {
      setProdImages(prev => [...prev, tempImageUrl.trim()]);
      setTempImageUrl('');
    }
  };

  const handleDeleteImage = (indexToDelete: number) => {
    setProdImages(prev => prev.filter((_, idx) => idx !== indexToDelete));
  };

  // Edit action product loader
  const handleEditProductClick = (p: Product) => {
    setEditingProduct(p);
    setShowAddForm(false);
    
    // Load Product Details to State
    setProdName(p.name);
    setProdChemicalName(p.chemicalName || '');
    setProdFormula(p.formula || '');
    setProdWeight(p.molecularWeight || '');
    setProdDosage(p.dosage);
    setProdPrice(p.price);

    // Dynamic priceRange parser
    if (p.priceRange) {
      const match = p.priceRange.match(/\$?([\d,.]+)\s*–\s*\$?([\d,.]+)/);
      if (match) {
        setProdMinPrice(parseFloat(match[1].replace(/,/g, '')));
        setProdMaxPrice(parseFloat(match[2].replace(/,/g, '')));
      } else {
        setProdMinPrice(p.price);
        setProdMaxPrice(p.price);
      }
    } else {
      setProdMinPrice(p.price);
      setProdMaxPrice(p.price);
    }

    setProdQuantity(p.quantity ?? 125);
    setProdOriginalPrice(p.originalPrice);
    setProdDiscountPercentage(p.discountPercentage);
    setProdThumbnailVial(p.thumbnailVial || '');
    setProdThumbnailCert(p.thumbnailCert || '');
    setProdThumbnailChrom(p.thumbnailChrom || '');
    setProdThumbnailMass(p.thumbnailMass || '');
    setProdCategory(p.category);
    setProdPurity(p.purity);
    setProdPurityNum(p.purityNumber);
    setProdImageUrl(p.imageUrl);
    setProdDescription(p.description);
    setProdDetailedDescription(p.detailedDescription || '');
    setProdBenefits(p.benefits.join(', '));
    setProdStorage(p.storage);
    setProdDiluent(p.reconstitute.recommendedDiluent);
    setProdVolume(p.reconstitute.vialVolumeMl);
    setProdDefaultWater(p.reconstitute.defaultBacteriostaticWaterMl);

    // Uploaded thumbnail collections setup
    setProdImages(p.images || []);
  };

  const handleCreateProductClick = () => {
    setEditingProduct(null);
    setShowAddForm(true);

    // Reset Form Fields to defaults
    setProdName('');
    setProdChemicalName('');
    setProdFormula('');
    setProdWeight('');
    setProdDosage('10mg');
    setProdPrice(110.00);
    setProdMinPrice(110.00);
    setProdMaxPrice(290.00);
    setProdQuantity(200);
    setProdOriginalPrice(undefined);
    setProdDiscountPercentage(undefined);
    setProdThumbnailVial('');
    setProdThumbnailCert('');
    setProdThumbnailChrom('');
    setProdThumbnailMass('');
    setProdImages([]);
    setProdCategory('metabolism');
    setProdPurity('99.50%');
    setProdPurityNum(99.50);
    setProdImageUrl('vial_blue');
    setProdDescription('');
    setProdDetailedDescription('');
    setProdBenefits('Stimulates mitochondrial efficiency, Triggers fat oxidation');
    setProdStorage('Store vacuum-sealed under -18°C. Refrigerate post-reconstitution.');
    setProdDiluent('Bacteriostatic Water');
    setProdVolume(2.0);
    setProdDefaultWater(2.0);
  };

  // Submit Blueprint Form
  const saveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!prodName.trim()) {
      alert("Please specify a valid compound formulation name.");
      return;
    }

    const benefitArray = prodBenefits
      .split(',')
      .map(b => b.trim())
      .filter(b => b.length > 0);

    const priceRangeFormatted = `$${Number(prodMinPrice).toFixed(2)} – $${Number(prodMaxPrice).toFixed(2)}`;

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : `pep-${prodName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: prodName,
      chemicalName: prodChemicalName,
      formula: prodFormula,
      molecularWeight: prodWeight,
      dosage: prodDosage,
      price: Number(prodPrice || prodMinPrice),
      priceRange: priceRangeFormatted,
      originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : undefined,
      discountPercentage: prodDiscountPercentage ? Number(prodDiscountPercentage) : undefined,
      thumbnailVial: prodThumbnailVial.trim() || undefined,
      thumbnailCert: prodThumbnailCert.trim() || undefined,
      thumbnailChrom: prodThumbnailChrom.trim() || undefined,
      thumbnailMass: prodThumbnailMass.trim() || undefined,
      category: prodCategory,
      purity: prodPurity,
      purityNumber: Number(prodPurityNum),
      imageUrl: prodImageUrl,
      description: prodDescription,
      detailedDescription: prodDetailedDescription,
      benefits: benefitArray,
      storage: prodStorage,
      quantity: Number(prodQuantity),
      images: prodImages,
      reconstitute: {
        recommendedDiluent: prodDiluent,
        vialVolumeMl: Number(prodVolume),
        defaultBacteriostaticWaterMl: Number(prodDefaultWater)
      }
    };

    let updatedList: Product[];
    if (editingProduct) {
      updatedList = products.map(p => p.id === editingProduct.id ? productPayload : p);
    } else {
      updatedList = [productPayload, ...products];

      // Auto-generate a corresponding certified lab COA
      const coaPayload: COABatch = {
        id: `SP-B${Math.floor(100000 + Math.random() * 900000)}`,
        productId: productPayload.id,
        productName: productPayload.name,
        batchNumber: `PEPS-CH-${productPayload.name.substring(0,3).toUpperCase()}-2026`,
        purity: productPayload.purity,
        testDate: new Date().toISOString().substring(0, 10),
        laboratory: "Swiss Med-QA Independent Accredited Analytical Facility (Zürich)",
        analyst: "Dr. Matthew Evans, Lead Chemist",
        status: "Certified",
        hplcPeakData: generateHPLCTrace(productPayload.purityNumber)
      };
      const updatedCoas = [coaPayload, ...coas];
      setCoas(updatedCoas);
      localStorage.setItem('peps_coas', JSON.stringify(updatedCoas));
    }

    setProducts(updatedList);
    localStorage.setItem('peps_products', JSON.stringify(updatedList));

    // Reset View State parameters
    setEditingProduct(null);
    setShowAddForm(false);
    alert(`Chemical formulation "${productPayload.name}" successfully committed.`);
  };

  const deleteProduct = (id: string) => {
    if (confirm("Verify action: Complete elimination of this formulation reagent?")) {
      const updatedList = products.filter(p => p.id !== id);
      setProducts(updatedList);
      localStorage.setItem('peps_products', JSON.stringify(updatedList));
      alert("Product eliminated successfully.");
    }
  };

  // 2. REVIEWS STORAGE LOADER
  const reviewItems = useMemo(() => {
    const list: Array<{
      productId: string;
      productName: string;
      author: string;
      email: string;
      rating: number;
      text: string;
      date: string;
      originalIndex: number;
    }> = [];

    const defaultReviewsList = [
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

    products.forEach(p => {
      const storageKey = `peps_reviews_${p.id}`;
      const saved = localStorage.getItem(storageKey);
      let parsed = [];
      if (saved) {
        try {
          parsed = JSON.parse(saved);
        } catch (e) {}
      } else {
        parsed = defaultReviewsList;
        try {
          localStorage.setItem(storageKey, JSON.stringify(defaultReviewsList));
        } catch (e) {}
      }

      if (Array.isArray(parsed)) {
        parsed.forEach((r, idx) => {
          list.push({
            productId: p.id,
            productName: p.name,
            author: r.user || r.name || 'Anonymous Researcher',
            email: r.email || 'researcher@clinical-trials.gov.au',
            rating: r.rating || 5,
            text: r.text || '',
            date: r.date || 'Today',
            originalIndex: idx
          });
        });
      }
    });
    return list;
  }, [products, reviewsTrigger]);

  // Submit review on behalf of visitor via admin control panel
  const handleAddNewReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewProdId || !reviewAuthor.trim() || !reviewEmail.trim() || !reviewText.trim()) {
      alert("Please complete reviewer name, email, feedback text and select a target product!");
      return;
    }

    const newFeedback = {
      user: reviewAuthor.trim(),
      email: reviewEmail.trim(),
      rating: Number(reviewRating),
      date: reviewDate,
      text: reviewText.trim()
    };

    const storageKey = `peps_reviews_${reviewProdId}`;
    const saved = localStorage.getItem(storageKey);
    let currentReviewsList = [];
    if (saved) {
      try {
        currentReviewsList = JSON.parse(saved);
      } catch (e) {}
    } else {
      const defaultReviewsList = [
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
      currentReviewsList = defaultReviewsList;
    }
    
    const updated = [newFeedback, ...currentReviewsList];
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // Force trigger App re-renders
    setReviewsTrigger(prev => prev + 1);
    setProducts([...products]);
    window.dispatchEvent(new Event('storage'));

    // Reset states
    setReviewAuthor('');
    setReviewEmail('');
    setReviewText('');
    setChannelSuccessMsg("Feedback published successfully!");
    setTimeout(() => setChannelSuccessMsg(""), 3000);
  };

  const handleRemoveReview = (prodId: string, idx: number) => {
    if (confirm("Are you sure you want to delete this peer-review feedback?")) {
      const storageKey = `peps_reviews_${prodId}`;
      const saved = localStorage.getItem(storageKey);
      let listToEdit = [];
      if (saved) {
        try {
          listToEdit = JSON.parse(saved);
        } catch (e) {}
      } else {
        const defaultReviewsList = [
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
        listToEdit = defaultReviewsList;
      }

      if (Array.isArray(listToEdit)) {
        listToEdit.splice(idx, 1);
        localStorage.setItem(storageKey, JSON.stringify(listToEdit));
        setReviewsTrigger(prev => prev + 1);
        setProducts([...products]); // force render
        window.dispatchEvent(new Event('storage'));
        alert("Review item removed from customer database.");
      }
    }
  };

  // 3. CONTACT US CUSTOMIZATION ACTIONS
  const handlePublishContactInfo = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('peps_order_email', orderEmail.trim());
    localStorage.setItem('peps_contact_title', contactTitle.trim());
    localStorage.setItem('peps_contact_description', contactDescription.trim());
    localStorage.setItem('peps_contact_address', contactAddress.trim());
    localStorage.setItem('peps_contact_phone', contactPhone.trim());

    setChannelSuccessMsg("Contact information has been published to the dynamic Contact Us page in real-time!");
    setTimeout(() => setChannelSuccessMsg(""), 4000);
  };

  const handleSaveSmtpSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('peps_smtp_host', smtpHost.trim());
    localStorage.setItem('peps_smtp_port', smtpPort.trim());
    localStorage.setItem('peps_smtp_user', smtpUser.trim());
    localStorage.setItem('peps_smtp_password', smtpPassword.trim());
    localStorage.setItem('peps_smtp_secure', String(smtpSecure));
    localStorage.setItem('peps_smtp_from_name', smtpFromName.trim());

    const smtpSettingsObj = {
      host: smtpHost.trim(),
      port: smtpPort.trim(),
      user: smtpUser.trim(),
      pass: smtpPassword.trim(),
      secure: smtpSecure,
      fromName: smtpFromName.trim()
    };
    localStorage.setItem('peps_smtp_settings', JSON.stringify(smtpSettingsObj));

    setChannelSuccessMsg("SMTP Mail credentials successfully stored! You can run a connection test below.");
    setTimeout(() => setChannelSuccessMsg(""), 4000);
  };

  const handleSendTestEmail = async () => {
    if (!smtpTestEmail) {
      setSmtpTestResult({ success: false, error: 'Please enter a valid receiver email address for testing.' });
      return;
    }
    setSmtpTesting(true);
    setSmtpTestResult(null);

    const smtpSettingsObj = {
      host: smtpHost.trim(),
      port: smtpPort.trim(),
      user: smtpUser.trim(),
      pass: smtpPassword.trim(),
      secure: smtpSecure,
      fromName: smtpFromName.trim()
    };

    try {
      const response = await fetch('/api/send-test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverEmail: smtpTestEmail.trim(),
          smtpConfig: smtpSettingsObj
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSmtpTestResult({
          success: true,
          message: data.message || 'Test email dispatched successfully! Check your inbox/spam directory.'
        });
      } else {
        setSmtpTestResult({
          success: false,
          error: data.error || 'Server rejected SMTP connection or rejected authentication.'
        });
      }
    } catch (err: any) {
      setSmtpTestResult({
        success: false,
        error: err.toString() || 'Connection failed to reach /api/send-test-email endpoint.'
      });
    } finally {
      setSmtpTesting(false);
    }
  };

  // 4. RESTORED OP ACTIONS
  const saveOrderUpdates = () => {
    if (!selectedOrder) return;
    const updated = orders.map(o => {
      if (o.id === selectedOrder.id) {
        return {
          ...o,
          status: editingOrderStatus,
          trackingNumber: editingOrderTracking
        };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('peps_au_orders', JSON.stringify(updated));
    setSelectedOrder(null);
    alert("Order status update executed.");
  };

  const saveCOAUpdates = () => {
    if (!selectedCOA) return;
    const updated = coas.map(c => {
      if (c.id === selectedCOA.id) {
        return {
          ...c,
          status: coaStatus,
          purity: coaPurity,
          laboratory: coaLaboratory,
          analyst: coaAnalyst,
          hplcPeakData: generateHPLCTrace(parseFloat(coaPurity) || 99.5)
        };
      }
      return c;
    });
    setCoas(updated);
    localStorage.setItem('peps_coas', JSON.stringify(updated));
    setSelectedCOA(null);
    alert("HPLC COA certificate updated.");
  };

  // -------------------------------------------------------------
  // SEGMENT INTERACTION FILTERS
  // -------------------------------------------------------------
  const filteredProductsList = products.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    return p.name.toLowerCase().includes(q) || (p.chemicalName && p.chemicalName.toLowerCase().includes(q));
  });

  const totalProdPages = Math.ceil(filteredProductsList.length / prodItemsPerPage);

  const filteredReviews = reviewItems.filter(r => 
    r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCOAsList = coas.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    return c.id.toLowerCase().includes(q) || c.productName.toLowerCase().includes(q) || c.batchNumber.toLowerCase().includes(q);
  });

  const filteredOrdersList = orders.filter(o => {
    const q = searchQuery.toLowerCase().trim();
    return o.id.toLowerCase().includes(q) || o.userName.toLowerCase().includes(q) || o.userEmail.toLowerCase().includes(q);
  });

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 border-b border-gray-100 flex flex-col font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Admin Corporate Block Header */}
        <div className="bg-[#0C1B2D] border border-slate-800 rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md text-white">
          <div className="text-left">
            <span className="bg-[#DE5246] text-white text-[9px] font-mono font-bold uppercase tracking-widest py-1 px-3 rounded-full inline-flex items-center gap-1.5 shadow-sm">
              <Layers className="w-3.5 h-3.5 text-white animate-pulse" />
              SWISS SECURE ADMIN PORTAL: admin.swisspeptides.com
            </span>
            <h2 className="text-2xl font-sans font-extrabold tracking-tight mt-2 text-white">
              Enterprise Control Dashboard
            </h2>
            <p className="text-xs text-slate-350 font-mono mt-1 uppercase">
              Authenticated Instance Core • Real-time synchronization
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onBackToCatalog}
              className="px-4 py-2 border border-slate-700 hover:border-white bg-slate-900 text-white rounded-xl text-xs font-mono font-bold transition-all cursor-pointer uppercase"
            >
              Exit Portal
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-mono font-bold transition-all cursor-pointer uppercase border border-transparent shadow-xs"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Navigation Tabs organized by requested priority hierarchy */}
        <div className="flex border-b border-gray-200 mb-6 gap-2 overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => { setActiveTab('products'); setSearchQuery(''); }}
            className={`pb-3 px-4 text-xs tracking-wider uppercase font-mono font-bold transition-all relative ${
              activeTab === 'products' ? 'text-gray-950 font-black border-b-2 border-gray-950' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            📋 PRIMARY: Formulation Registry ({products.length})
          </button>
          
          <button
            onClick={() => { setActiveTab('channels'); setSearchQuery(''); }}
            className={`pb-3 px-4 text-xs tracking-wider uppercase font-mono font-bold transition-all relative ${
              activeTab === 'channels' ? 'text-gray-950 font-black border-b-2 border-gray-950' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            🔊 SECONDARY: Reviews, Contact & PAYID Settings
          </button>

          <button
            onClick={() => { setActiveTab('operations'); setSearchQuery(''); }}
            className={`pb-3 px-4 text-xs tracking-wider uppercase font-mono font-bold transition-all relative ${
              activeTab === 'operations' ? 'text-gray-950 font-black border-b-2 border-gray-950' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            📦 OPERATIONS: Placed Orders
          </button>
        </div>

        {/* Global Tab Search Control */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${activeTab}...`}
              className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-gray-900 font-mono text-gray-800"
            />
          </div>

          {activeTab === 'products' && !showAddForm && !editingProduct && (
            <button
              onClick={handleCreateProductClick}
              className="px-4 py-2 bg-[#DE5246] hover:bg-black text-white rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm uppercase tracking-wider scale-95 md:scale-100"
            >
              <Plus className="w-4 h-4" />
              Add compound formulation
            </button>
          )}

        </div>

        {/* Success notifications drawer */}
        {channelSuccessMsg && (
          <div className="p-4 mb-6 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2.5 shadow-3xs animate-fade-in text-left">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{channelSuccessMsg}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: FORMULATION REGISTRY (PRODUCT MANAGEMENT) */}
        {/* ========================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Products catalog ledger panel - Now rendered in a exquisite 3x2 Grid */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-3xs p-6 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-sans tracking-tight">Active Swiss Formulation Catalog</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Displaying compounds page-by-page. Configure prices, discounts, dosages, or stock levels instantly.
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 bg-slate-50 border border-slate-100 rounded-full px-3 py-1 text-[10px] font-mono font-bold text-slate-600">
                  Total listed: {filteredProductsList.length} chemical reagents
                </div>
              </div>
              
              {filteredProductsList.length === 0 ? (
                <div className="p-12 text-center text-gray-400 font-mono text-xs">
                  No active chemical products match selected registry filter.
                </div>
              ) : (
                <>
                  {/* Grid Layout: Exactly 3 Columns with 2 Rows of Luxurious Responsive Cards (itemsPerPage = 6) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProductsList
                      .slice((prodPage - 1) * prodItemsPerPage, prodPage * prodItemsPerPage)
                      .map((p) => {
                        const stock = p.quantity ?? 150;
                        const stockColor = stock > 20 ? 'text-emerald-700 bg-emerald-50 border-emerald-100/50' : 'text-rose-700 bg-rose-50 border-rose-100/50';
                        
                        const purityNum = p.purityNumber || 99.50;
                        const purityClass = purityNum >= 99.00 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100';

                        // Match visual category themes
                        const categoryTheme = p.imageUrl === 'vial_blue' ? 'bg-[#e0f2fe] text-blue-700 border-blue-200' :
                          p.imageUrl === 'vial_gold' ? 'bg-[#fef3c7] text-amber-700 border-amber-200' :
                          p.imageUrl === 'vial_emerald' ? 'bg-[#d1fae5] text-emerald-700 border-emerald-200' :
                          p.imageUrl === 'vial_purple' ? 'bg-[#f3e8ff] text-purple-700 border-purple-200' :
                          p.imageUrl === 'vial_red' ? 'bg-[#fee2e2] text-rose-700 border-rose-200' :
                          p.imageUrl === 'vial_teal' ? 'bg-[#ccfbf1] text-teal-700 border-teal-200' : 'bg-[#f1f5f9] text-slate-700 border-slate-200';

                        // Find the representative display image
                        const displayImg = p.images && p.images.length > 0 ? p.images[0] : (p.imageUrl.startsWith('/') ? p.imageUrl : '/src/assets/images/peptide_vials_hero_1780001932117.png');

                        return (
                          <div 
                            key={p.id} 
                            className="bg-white border border-gray-150 rounded-2xl p-5 hover:border-gray-300 hover:shadow-xs transition-all text-left flex flex-col justify-between h-full group relative"
                          >
                            {/* Tags layer */}
                            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                              <span className="bg-slate-900/90 text-white font-mono uppercase text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-xs tracking-wider">
                                {p.category}
                              </span>
                              {p.discountPercentage && (
                                <span className="bg-red-650 text-white font-mono uppercase text-[9px] font-black px-2.5 py-0.5 rounded-full shadow-xs tracking-wider">
                                  Sale: -{p.discountPercentage}%
                                </span>
                              )}
                            </div>

                            <div>
                              {/* Product Image Stage */}
                              <div className="aspect-[4/3] w-full bg-[#fcfcfa] border border-gray-100 rounded-xl overflow-hidden mb-4 relative flex items-center justify-center">
                                <img 
                                  src={displayImg} 
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102" 
                                  alt={p.name} 
                                  referrerPolicy="no-referrer" 
                                />
                                {p.images && p.images.length > 1 && (
                                  <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white font-mono text-[9px] px-2 py-0.5 rounded-md font-bold">
                                    +{p.images.length} photos
                                  </span>
                                )}
                              </div>

                              {/* Titles and Formulation details */}
                              <div className="space-y-1">
                                <span className="text-[9px] tracking-wider text-slate-400 font-mono block font-black uppercase">
                                  swiss formulation.
                                </span>
                                <div className="flex items-start justify-between gap-1">
                                  <h4 className="text-[15px] font-extrabold text-slate-900 tracking-tight line-clamp-1">{p.name}</h4>
                                  <span className="text-[9px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold uppercase shrink-0 mt-0.5">
                                    {p.dosage}
                                  </span>
                                </div>
                                <p className="text-[11px] text-gray-400 font-mono truncate">{p.chemicalName}</p>

                                <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                                  <span className={`text-[9px] border px-2 py-0.5 rounded-md font-mono font-bold uppercase ${purityClass}`}>
                                    {p.purity} Pure
                                  </span>
                                  <span className={`text-[9px] border px-2 py-0.5 rounded-md font-mono font-bold ${categoryTheme}`}>
                                    vial scheme: {p.imageUrl.replace('vial_', '')}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Dynamic Price & Actions area */}
                            <div className="mt-4 pt-3 border-t border-gray-100">
                              <div className="flex items-baseline justify-between mb-3.5">
                                <div className="text-left">
                                  <span className="text-[9px] text-gray-400 font-mono block uppercase">Dynamic range</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-extrabold text-[#DE5246] font-mono font-black">
                                      {p.priceRange || `$${p.price.toFixed(2)}`}
                                    </span>
                                    {p.originalPrice && (
                                      <span className="text-[10px] text-gray-400 line-through font-mono">
                                        ${p.originalPrice.toFixed(2)}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <span className={`text-[9px] border font-mono px-2 py-0.5 rounded-md font-bold uppercase ${stockColor}`}>
                                  STOCK: {stock} units
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleEditProductClick(p)}
                                  className="w-full py-1.5 bg-slate-900 hover:bg-black text-white text-[10px] font-mono font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                                  title="Configure dynamic parameters"
                                >
                                  <Edit className="w-3 h-3" />
                                  <span>Configure</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteProduct(p.id)}
                                  className="w-full py-1.5 bg-white border border-rose-150 hover:border-rose-500 hover:bg-rose-50 text-rose-500 hover:text-rose-700 text-[10px] font-mono font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                                  title="De-register Compound"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>De-register</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Exquisite Numerical Pagination UI of 3x2 products */}
                  {totalProdPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100 font-sans">
                      <div className="text-xs text-gray-400 font-mono text-left">
                        Showing <span className="font-bold text-gray-800">{(prodPage - 1) * prodItemsPerPage + 1}</span>–
                        <span className="font-bold text-gray-800">{Math.min(prodPage * prodItemsPerPage, filteredProductsList.length)}</span> of <span className="font-bold text-gray-800">{filteredProductsList.length}</span> listed active products
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={prodPage === 1}
                          onClick={() => setProdPage(prev => Math.max(prev - 1, 1))}
                          className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-xs font-bold text-gray-500 bg-white hover:border-slate-900 hover:text-slate-900 disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-colors cursor-pointer"
                        >
                          ←
                        </button>
                        {Array.from({ length: totalProdPages }, (_, idx) => idx + 1).map((pg) => (
                          <button
                            key={pg}
                            type="button"
                            onClick={() => setProdPage(pg)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              prodPage === pg
                                ? 'bg-slate-900 border border-slate-900 text-white'
                                : 'bg-white text-gray-500 border border-gray-200 hover:border-slate-900 hover:text-slate-900'
                            }`}
                          >
                            {pg}
                          </button>
                        ))}
                        <button
                          type="button"
                          disabled={prodPage === totalProdPages}
                          onClick={() => setProdPage(prev => Math.min(prev + 1, totalProdPages))}
                          className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-xs font-bold text-gray-500 bg-white hover:border-slate-900 hover:text-slate-900 disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-colors cursor-pointer"
                        >
                          →
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Overarching Blueprint modal panel - Opens when creating or editing to handle complex inputs screen-wide */}
            {(showAddForm || editingProduct) && (
              <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in text-left">
                <div className="bg-white border border-gray-150 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative flex flex-col justify-between">
                  
                  {/* Header */}
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-red-105 flex items-center justify-center text-[#DE5246]">
                        <Beaker className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 font-sans tracking-tight">
                          {editingProduct ? `Edit Active Formulation: ${prodName}` : 'Add Compound Formulation to Shop'}
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-0.5 font-normal">
                          Configure chemical specs, dynamic wholesale parameters, original list pricing, and imagery.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setEditingProduct(null); setShowAddForm(false); }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-850 transition-colors font-bold text-xl cursor-pointer"
                      title="Discard changes"
                    >
                      ×
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={saveProduct} className="space-y-6">
                    
                    {/* Grid partition: Two Columns for high visual density and spacious input tracking */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-800">
                      
                      {/* Left Column: Identifiers, Category & Abstract Parameters */}
                      <div className="space-y-4">
                        
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3.5 border-l-2 border-slate-800">
                          <span className="text-slate-900 text-[10px] uppercase font-black tracking-wider block">
                            🧪 1. Chemical Formula & Identity
                          </span>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-gray-500 text-[10px] uppercase font-bold tracking-wider block">Compound Name</label>
                              <input
                                type="text"
                                required
                                value={prodName}
                                onChange={(e) => setProdName(e.target.value)}
                                className="w-full bg-white border border-gray-200 p-2 text-xs focus:outline-none focus:border-red-400 rounded-lg font-bold text-gray-900"
                                placeholder="e.g. Retatrutide"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-gray-500 text-[10px] uppercase font-bold tracking-wider block">Reagent Category</label>
                              <select
                                value={prodCategory}
                                onChange={(e) => setProdCategory(e.target.value as any)}
                                className="w-full bg-white border border-gray-200 p-2 text-xs focus:outline-none focus:border-red-400 rounded-lg font-bold"
                              >
                                <option value="metabolism">⚡ Metabolism / Weight</option>
                                <option value="injury">🩹 Connective Repair</option>
                                <option value="longevity">⏳ Cell Longevity</option>
                                <option value="cognitive">🧠 Cognitive / Neuro</option>
                                <option value="growth">🧬 Secretagogue Growth</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-1">
                            <div className="space-y-1">
                              <label className="text-gray-500 text-[10px] uppercase font-bold tracking-wider block">Chemical Designation</label>
                              <input
                                type="text"
                                value={prodChemicalName}
                                onChange={(e) => setProdChemicalName(e.target.value)}
                                className="w-full bg-white border border-gray-200 p-2 focus:outline-none focus:border-red-400 rounded-lg text-xs"
                                placeholder="e.g. GIP/GLP-1/glucagon receptor agonist"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-gray-500 text-[10px] uppercase font-bold block">Chemical Formula</label>
                              <input
                                type="text"
                                value={prodFormula}
                                onChange={(e) => setProdFormula(e.target.value)}
                                className="w-full bg-white border border-gray-200 p-2 focus:outline-none focus:border-red-400 rounded-lg text-xs font-mono"
                                placeholder="C223H350N56O68S2"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-1">
                            <div className="space-y-1">
                              <label className="text-gray-500 text-[10px] uppercase font-bold block">Molecular Weight</label>
                              <input
                                type="text"
                                value={prodWeight}
                                onChange={(e) => setProdWeight(e.target.value)}
                                className="w-full bg-white border border-gray-200 p-2 focus:outline-none focus:border-red-400 rounded-lg text-xs font-mono"
                                placeholder="e.g. 4842.15 g/mol"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-gray-500 text-[10px] uppercase font-bold block">Purity percentage</label>
                              <div className="flex gap-1.5">
                                <input
                                  type="text"
                                  required
                                  value={prodPurity}
                                  onChange={(e) => setProdPurity(e.target.value)}
                                  className="w-1/2 bg-white border border-gray-200 p-2 focus:outline-none focus:border-red-400 rounded-lg text-xs"
                                  placeholder="e.g. 99.50%"
                                />
                                <input
                                  type="number"
                                  required
                                  step="0.01"
                                  value={prodPurityNum}
                                  onChange={(e) => setProdPurityNum(parseFloat(e.target.value) || 99.5)}
                                  className="w-1/2 bg-white border border-gray-200 p-2 focus:outline-none focus:border-red-400 rounded-lg text-xs font-mono"
                                  placeholder="99.5"
                                  title="Numeric percentage value"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3.5 border-l-2 border-red-600">
                          <span className="text-slate-900 text-[10px] uppercase font-black tracking-wider block">
                            🔬 2. Dosage & Delivery Methods
                          </span>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-gray-500 text-[10px] uppercase font-bold tracking-wider block">Available Dosages</label>
                              <input
                                type="text"
                                required
                                value={prodDosage}
                                onChange={(e) => setProdDosage(e.target.value)}
                                className="w-full bg-white border border-gray-200 p-2 focus:outline-none focus:border-red-400 rounded-lg text-xs"
                                placeholder="e.g. 5mg, 10mg"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-gray-500 text-[10px] uppercase font-bold tracking-wider block">Stock Quantity (Units)</label>
                              <input
                                type="number"
                                required
                                value={prodQuantity}
                                onChange={(e) => setProdQuantity(parseInt(e.target.value) || 0)}
                                className="w-full bg-white border border-gray-200 p-2 focus:outline-none focus:border-red-400 rounded-lg text-xs font-bold"
                              />
                            </div>
                          </div>

                          <div className="space-y-1 pt-1">
                            <label className="text-gray-500 text-[10px] uppercase font-bold block">Diluent Parameters (Liquid, capacity, default water ratio)</label>
                            <div className="grid grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={prodDiluent}
                                onChange={(e) => setProdDiluent(e.target.value)}
                                className="bg-white border border-gray-200 p-2 text-xs rounded-lg focus:outline-none focus:border-red-400"
                                placeholder="Diluent type"
                                title="Recommended liquid"
                              />
                              <input
                                type="number"
                                step="0.1"
                                value={prodVolume}
                                onChange={(e) => setProdVolume(parseFloat(e.target.value) || 2.0)}
                                className="bg-white border border-gray-200 p-2 text-xs font-mono rounded-lg focus:outline-none focus:border-red-400"
                                placeholder="Vol (mL)"
                                title="Vial volume capacity"
                              />
                              <input
                                type="number"
                                step="0.1"
                                value={prodDefaultWater}
                                onChange={(e) => setProdDefaultWater(parseFloat(e.target.value) || 2.0)}
                                className="bg-white border border-gray-200 p-2 text-xs font-mono rounded-lg focus:outline-none focus:border-red-400"
                                placeholder="Water ratio"
                                title="Default water ratio mL"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-gray-550 text-[10px] uppercase font-bold block">Molecular Abstract Description</label>
                          <textarea
                            required
                            rows={3}
                            value={prodDescription}
                            onChange={(e) => setProdDescription(e.target.value)}
                            className="w-full bg-slate-50 border border-gray-200 p-2.5 text-xs focus:outline-none focus:border-red-400 rounded-xl"
                            placeholder="Enter short abstract specifications for the main listing card..."
                          />
                        </div>
                      </div>

                      {/* Right Column: Pricing, Sale Customization, Preloaded Image Select & Previews */}
                      <div className="space-y-4">
                        
                        {/* Dynamic pricing section & Sale discount configurations */}
                        <div className="p-4 bg-orange-50/20 border border-orange-100 rounded-xl space-y-3 border-l-2 border-[#DE5246]">
                          <div className="flex items-center justify-between">
                            <span className="text-amber-800 text-[10px] uppercase font-black tracking-widest block flex items-center gap-1">
                              <Tag className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                              💵 3. Pricing & Discount Section
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-3.5">
                            <div className="space-y-1">
                              <label className="text-gray-500 text-[9px] uppercase font-bold block">Base Price (USD)</label>
                              <input
                                type="number"
                                required
                                step="0.01"
                                value={prodPrice}
                                onChange={(e) => setProdPrice(parseFloat(e.target.value) || 0)}
                                className="w-full bg-white border border-gray-200 p-2 rounded-lg text-xs focus:outline-none focus:border-red-400 font-extrabold text-[#DE5246]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-gray-500 text-[9px] uppercase font-bold block">Min Price (USD)</label>
                              <input
                                type="number"
                                required
                                step="0.01"
                                value={prodMinPrice}
                                onChange={(e) => setProdMinPrice(parseFloat(e.target.value) || 0)}
                                className="w-full bg-white border border-gray-200 p-2 rounded-lg text-xs focus:outline-none focus:border-red-400 font-bold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-gray-500 text-[9px] uppercase font-bold block">Max Price (USD)</label>
                              <input
                                type="number"
                                required
                                step="0.01"
                                value={prodMaxPrice}
                                onChange={(e) => setProdMaxPrice(parseFloat(e.target.value) || 0)}
                                className="w-full bg-white border border-gray-200 p-2 rounded-lg text-xs focus:outline-none focus:border-red-400 font-bold"
                              />
                            </div>
                          </div>

                          {/* Dynamic discount configurations */}
                          <div className="border-t border-orange-100/50 pt-3 mt-1.5 grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-slate-700 text-[9px] uppercase font-bold block">Original Price (Pre-sale)</label>
                              <input
                                type="number"
                                step="0.01"
                                value={prodOriginalPrice || ''}
                                onChange={(e) => setProdOriginalPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                                className="w-full bg-white border border-gray-200 p-2 rounded-lg text-xs focus:outline-none focus:border-red-400 font-medium"
                                placeholder="Original $ (e.g. 140.00)"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-700 text-[9px] uppercase font-bold block">Discount Percentage (%)</label>
                              <input
                                type="number"
                                step="1"
                                max="99"
                                min="0"
                                value={prodDiscountPercentage || ''}
                                onChange={(e) => setProdDiscountPercentage(e.target.value ? parseInt(e.target.value) : undefined)}
                                className="w-full bg-white border border-gray-200 p-2 rounded-lg text-xs focus:outline-none focus:border-red-400 font-bold"
                                placeholder="e.g. 15"
                              />
                            </div>
                          </div>

                          {/* Instant live saving preview layout */}
                          {(prodOriginalPrice || prodDiscountPercentage) && (
                            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-[10px] font-mono text-amber-950 leading-tight">
                              🤝 <span className="font-bold">Active Sale Badge Preview:</span> Pre-sale Price is{' '}
                              <span className="font-bold">${prodOriginalPrice ? Number(prodOriginalPrice).toFixed(2) : Number(prodPrice * 1.25).toFixed(2)}</span>
                              .{' '}
                              {prodDiscountPercentage ? (
                                <>
                                  Discount is active as <span className="font-black text-red-650">-{prodDiscountPercentage}% OFF</span>. Display price in catalog is <span className="font-bold text-slate-900">${prodPrice.toFixed(2)}</span>
                                </>
                              ) : (
                                'No percent sign displayed'
                              )}
                            </div>
                          )}
                        </div>

                        {/* Interactive thumbnail and image files dispatcher setup */}
                        <div className="p-4 bg-[#FAF9F5] border border-gray-200 rounded-xl space-y-3 text-slate-800 border-l-2 border-indigo-500">
                          <span className="font-black text-[10px] uppercase font-sans tracking-wide block flex items-center gap-1">
                            <ImageIcon className="w-4 h-4 text-indigo-600" />
                            🖼️ 4. Image Thumbnails & Stock Library
                          </span>

                          {/* DROP-DOWN SELECT OF SYSTEM FILES */}
                          <div className="space-y-1 text-left">
                            <label className="text-gray-500 text-[10px] uppercase font-bold block">
                              Select Preloaded High-Res Product stock photo
                            </label>
                            <select
                              className="w-full bg-white border border-gray-200 p-2 rounded-lg text-xs font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              onChange={(e) => {
                                if (e.target.value) {
                                  // Set main image class and also push to gallery collection for complete compatibility
                                  setProdImageUrl(e.target.value);
                                  if (!prodImages.includes(e.target.value)) {
                                    setProdImages(prev => [e.target.value, ...prev]);
                                  }
                                  e.target.value = ''; // reset dropdown
                                }
                              }}
                            >
                              <option value="">-- Choose preloaded stock image --</option>
                              {PRELOADED_SWISS_IMAGES.map((img) => (
                                <option key={img.path} value={img.path}>{img.label}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
                            <label className="text-gray-500 text-[9px] uppercase font-bold block">Or append web support URL link</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={tempImageUrl}
                                onChange={(e) => setTempImageUrl(e.target.value)}
                                className="flex-grow bg-white border border-gray-200 p-1.5 text-xs rounded-lg focus:outline-none focus:border-red-400"
                                placeholder="https://example.com/photo.jpg"
                              />
                              <button
                                type="button"
                                onClick={handleAddImageUrl}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-[10px] font-mono font-bold uppercase rounded-lg cursor-pointer transition-colors"
                              >
                                Append
                              </button>
                            </div>
                          </div>

                          {/* LOCAL FILES DROP DRAG AND DROP CAPABILITIES REPRESENTATION */}
                          <div className="border border-dashed border-gray-300 p-2 rounded-lg bg-white text-center">
                            <label className="text-[10px] text-red-650 hover:text-black font-extrabold uppercase cursor-pointer select-none">
                              Browse computer images locally...
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleLocalImageUpload}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {/* Thumbnails grid in form */}
                          {prodImages.length > 0 && (
                            <div className="space-y-1 pt-1 border-t border-slate-100">
                              <label className="text-gray-500 text-[9px] uppercase font-bold block">Gallery support thumbnails ({prodImages.length})</label>
                              <div className="grid grid-cols-5 gap-2 max-h-[100px] overflow-y-auto pr-1">
                                {prodImages.map((img, idx) => (
                                  <div key={idx} className="aspect-square relative rounded-lg border border-gray-200 overflow-hidden bg-white">
                                    <img src={img} className="w-full h-full object-cover" alt="Thumb" referrerPolicy="no-referrer" />
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteImage(idx)}
                                      className="absolute top-0.5 right-0.5 bg-red-650 hover:bg-red-800 text-white rounded-full p-0.5 shadow-sm text-[8px] cursor-pointer"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-gray-550 text-[10px] uppercase font-bold block">Storage & Preservation Protocol Specifications</label>
                      <input
                        type="text"
                        value={prodStorage}
                        onChange={(e) => setProdStorage(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-200 p-2.5 text-xs rounded-xl focus:outline-none focus:border-red-400"
                        placeholder="e.g. Store vacuum-sealed inside sub-zero temperature. Avoid direct exposure to daylight radiation."
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-gray-550 text-[10px] uppercase font-bold block">Scientific Detailed Description / Molecular Benefits (Separate benefits by comma)</label>
                      <textarea
                        rows={2}
                        value={prodBenefits}
                        onChange={(e) => setProdBenefits(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-200 p-2.5 text-xs focus:outline-none focus:border-red-400 rounded-xl"
                        placeholder="Stimulates fat oxidation, Triggers GH secretagogue, Highly bioavailable research agent"
                      />
                    </div>

                    {/* Footer buttons row */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => { setEditingProduct(null); setShowAddForm(false); }}
                        className="px-5 py-2.5 border border-gray-200 hover:border-slate-900 text-gray-500 hover:text-slate-900 bg-white rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer"
                      >
                        Cancel / Close
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#DE5246] hover:bg-black text-white text-xs font-mono font-bold uppercase rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        Commit & Publish to storefront
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}
            
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: CLIENT CHANNELS & COMMUNICATION (REVIEWS + CUSTOM EMAIL + CONTACT OVERRIDE) */}
        {/* ========================================================= */}
        {activeTab === 'channels' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left font-sans">
            
            {/* Split Left (Cols 7): Receiver mailbox settings and Organizer directory */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Card A: Order Confirmation & Contact form Receiver Email Address */}
              <div className="bg-white rounded-xl border border-gray-150 p-6 space-y-4 shadow-3xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#DE5246]/10 flex items-center justify-center text-[#DE5246]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Orders & Inquiries Dispatcher Setup</h3>
                    <p className="text-[10px] text-gray-400">Configure central administrative destination email address.</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-500 text-[10px] uppercase font-bold block">Admin Receiver Email Address Address</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      value={orderEmail}
                      onChange={(e) => setOrderEmail(e.target.value)}
                      className="flex-grow bg-[#FAF9F5] border border-gray-150 p-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#DE5246] font-mono"
                      placeholder="receiver-admin@Buyswisspeptides.shop"
                    />
                    <button
                      onClick={handlePublishContactInfo}
                      className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-mono font-bold uppercase transition-all"
                    >
                      Set Receiver
                    </button>
                  </div>
                  <p className="text-[9px] text-gray-400 leading-normal pt-1">
                    🎯 Fully Integrated: This email will serve as the actual notification destination for order receipts and visitor query dispatches across the platform in real time.
                  </p>
                </div>
              </div>

              {/* Card A2: Behind-The-Scenes Mail Server Dispatcher Verification */}
              <div className="bg-white rounded-xl border border-gray-150 p-6 space-y-4 shadow-3xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#DE5246]/10 flex items-center justify-center text-[#DE5246]">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">📧 Automated Dispatcher Verification</h3>
                    <p className="text-[10px] text-gray-400">Your mail server credentials are set up securely behind-the-scenes as environment variables.</p>
                  </div>
                </div>

                <div className="bg-amber-50/50 border border-amber-150 rounded-xl p-4 text-xs text-amber-900 space-y-2 font-sans">
                  <p className="font-semibold flex items-center gap-1">🔒 Behind-the-Scenes Setup Active</p>
                  <p className="leading-relaxed text-[11px] text-gray-650">
                    To prevent dashboard clutter, your SMTP server credentials (host, port, user, pass) are safely stored as secrets in the system environment variables and are automatically applied.
                  </p>
                </div>

                {/* Connection Test SubSection */}
                <div className="pt-2 space-y-3">
                  <span className="text-[#DE5246] text-[10px] uppercase font-black tracking-wider block">🧪 Send Mail Dispatcher Test</span>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    Enter any email address below to test the automated order dispatcher. This checks if the behind-the-scenes credentials establish a clean, authenticated connection.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={smtpTestEmail}
                      onChange={(e) => setSmtpTestEmail(e.target.value)}
                      placeholder="Send dynamic test email to e.g. yours@gmail.com..."
                      className="flex-grow bg-[#FAF9F5] border border-gray-150 p-2.5 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#DE5246]"
                    />
                    <button
                      type="button"
                      disabled={smtpTesting}
                      onClick={handleSendTestEmail}
                      className="px-4 py-2 bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer"
                    >
                      {smtpTesting ? 'Testing...' : 'Test Delivery'}
                    </button>
                  </div>

                  {smtpTestResult && (
                    <div className={`p-3 rounded-lg border text-xs leading-relaxed font-sans flex items-start gap-2 ${
                      smtpTestResult.success 
                        ? 'bg-emerald-50 border-emerald-150 text-emerald-800' 
                        : 'bg-rose-50 border-rose-150 text-rose-800'
                    }`}>
                      <div className="mt-0.5 font-bold">
                        {smtpTestResult.success ? '✓' : '⚠'}
                      </div>
                      <div>
                        <strong>{smtpTestResult.success ? 'Success:' : 'Test Failed:'}</strong>{' '}
                        {smtpTestResult.success ? smtpTestResult.message : smtpTestResult.error}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card B: Public Policies Custom Editor Section */}
              <div className="bg-white rounded-xl border border-gray-150 p-6 space-y-6 shadow-3xs">
                <div className="flex items-center gap-2 border-b pb-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#DE5246]/10 flex items-center justify-center text-[#DE5246]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">📜 Custom Policy Document Managers</h3>
                    <p className="text-[10px] text-gray-400">Modify live contents published on the Privacy and Refund Policy pages.</p>
                  </div>
                </div>

                {/* Sub-Editor 1: Privacy Policy Content */}
                <div className="space-y-2 border-b border-gray-100 pb-5">
                  <div className="flex justify-between items-center">
                    <label className="text-gray-700 text-[10px] uppercase font-bold block">Privacy Policy Page Body Content</label>
                    <span className="text-[9px] text-gray-400 font-mono">Format: Plan Text & Linebreaks</span>
                  </div>
                  <textarea
                    rows={8}
                    value={privacyEditorValue}
                    onChange={(e) => setPrivacyEditorValue(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-gray-150 p-3 rounded-xl text-xs leading-relaxed font-sans focus:outline-none focus:ring-1 focus:ring-[#DE5246]"
                    placeholder="Enter the full text for the Privacy Policy page..."
                  />
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Reset Privacy Policy back to standard defaults? This will overwrite your current draft.")) {
                          localStorage.removeItem('peps_privacy_content');
                          setPrivacyEditorValue(`Who we are
Our website address is: https://buyswisspeptides.shop

Comments
When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor's IP address and browser user agent string to help spam detection.
An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: https://automattic.com/privacy/. After approval of your comment, your profile picture is visible to the public in the context of your comment.

Media
If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.

Cookies
If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.
If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.
When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select "Remember Me", your login will persist for two weeks. If you log out of your account, the login cookies will be removed.
If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.

Embedded content from other websites
Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.
These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.

Who we share your data with
If you request a password reset, your IP address will be included in the reset email.

How long we retain your data
If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.
For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.

What rights you have over your data
If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.

Where your data is sent
Visitor comments may be checked through an automated spam detection service.`);
                          localStorage.setItem('peps_privacy_content', '');
                          alert("Privacy policy dynamic copy reset to clean defaults.");
                        }
                      }}
                      className="text-[10px] text-gray-400 hover:text-red-500 font-mono transition-all lowercase"
                    >
                      [Reset Default Privacy Text]
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.setItem('peps_privacy_content', privacyEditorValue.trim());
                        setChannelSuccessMsg("Privacy Policy changes published successfully!");
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setTimeout(() => setChannelSuccessMsg(""), 4000);
                      }}
                      className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-mono font-bold uppercase transition-all"
                    >
                      Commit Privacy Policy
                    </button>
                  </div>
                </div>

                {/* Sub-Editor 2: Refund & Returns Content */}
                <div className="space-y-2 pb-2">
                  <div className="flex justify-between items-center">
                    <label className="text-gray-700 text-[10px] uppercase font-bold block">Refund & Returns Page Body Content</label>
                    <span className="text-[9px] text-gray-400 font-mono">Format: Plain Text & Linebreaks</span>
                  </div>
                  <textarea
                    rows={8}
                    value={refundEditorValue}
                    onChange={(e) => setRefundEditorValue(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-gray-150 p-3 rounded-xl text-xs leading-relaxed font-sans focus:outline-none focus:ring-1 focus:ring-[#DE5246]"
                    placeholder="Enter the full text for the Refund & Returns Policy page..."
                  />
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Reset Refund Policy back to standard defaults? This will overwrite your current draft.")) {
                          localStorage.removeItem('peps_refund_content');
                          setRefundEditorValue(`At Buy Peptides Australia, we stand behind the outstanding quality and analytical precision of our research peptide formulations. We are committed to ensuring a secure and reliable acquisition experience for all laboratories and clinical biochemistry professionals.

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
- Contact our Support Desk on WhatsApp or Email at mail@buyswisspeptides.shop within 14 days of receipt.
- Provide your order number, a summary of your inquiry, and photos or lab test results if applicable.

4. Quick & Seamless Processing
Once reviewed, approved refunds will be credited back via PAYID or the original payment method within 2-3 business days. Your satisfaction and scientific confidence in your reagents constitutes our absolute highest operational priority.`);
                          localStorage.setItem('peps_refund_content', '');
                          alert("Refund policy dynamic copy reset to clean defaults.");
                        }
                      }}
                      className="text-[10px] text-gray-400 hover:text-red-500 font-mono transition-all lowercase"
                    >
                      [Reset Default Refund Text]
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.setItem('peps_refund_content', refundEditorValue.trim());
                        setChannelSuccessMsg("Refund Policy changes published successfully!");
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setTimeout(() => setChannelSuccessMsg(""), 4000);
                      }}
                      className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-mono font-bold uppercase transition-all"
                    >
                      Commit Refund Policy
                    </button>
                  </div>
                </div>
              </div>

              {/* Card C: Subform block to Add / Write & Publish Peer-Reviews */}
              <div className="bg-white rounded-xl border border-gray-150 p-6 space-y-4 shadow-3xs text-slate-800 text-xs">
                <div className="flex items-center gap-2 border-b pb-3.5">
                  <Plus className="w-4 h-4 text-[#DE5246]" />
                  <h3 className="text-sm font-black text-slate-900 uppercase">Publish Customized Peer-Review</h3>
                </div>

                <form onSubmit={handleAddNewReview} className="space-y-3 font-sans">
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1 text-left">
                      <label className="text-gray-500 text-[9px] uppercase font-bold block">Reagent Product Target</label>
                      <select
                        required
                        value={reviewProdId}
                        onChange={(e) => setReviewProdId(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-gray-150 p-2 rounded-lg text-xs"
                      >
                        <option value="">-- Choose peptide target --</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-gray-500 text-[9px] uppercase font-bold block">Star Rating Index</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(parseInt(e.target.value) || 5)}
                        className="w-full bg-[#FAF9F5] border border-gray-150 p-2 rounded-lg text-xs"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                        <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                        <option value="3">⭐⭐⭐ (3 Stars)</option>
                        <option value="2">⭐⭐ (2 Stars)</option>
                        <option value="1">⭐ (1 Star)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-gray-500 text-[9px] uppercase font-bold block">Reviewer Researcher Full Name</label>
                      <input
                        type="text"
                        required
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-gray-150 p-2 rounded-lg text-xs"
                        placeholder="e.g. Dr. Arthur Pendelton"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-gray-500 text-[9px] uppercase font-bold block">Reviewer Researcher Mailbox</label>
                      <input
                        type="email"
                        required
                        value={reviewEmail}
                        onChange={(e) => setReviewEmail(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-gray-150 p-2 rounded-lg text-xs font-mono"
                        placeholder="e.g. a.pendelton@melbourne-university.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-gray-500 text-[9px] uppercase font-bold block">Feedback Publication Date</label>
                      <input
                        type="text"
                        value={reviewDate}
                        onChange={(e) => setReviewDate(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-gray-150 p-2 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-500 text-[9px] uppercase font-bold block">Review Summary Message (Assay Results/Feedback)</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-gray-150 p-2 rounded-lg text-xs"
                      placeholder="e.g. High assay quality verified on chromatography test..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-mono font-bold uppercase transition-all shadow"
                  >
                    Publish Verification Feedback Record
                  </button>
                </form>
              </div>

            </div>

            {/* Split Right (Cols 5): Contact Us details customization & realtime mockup viewer */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white rounded-xl border border-gray-150 p-6 space-y-4 shadow-3xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#DE5246]/10 flex items-center justify-center text-[#DE5246]">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight font-sans">Contact Page Customizer</h3>
                    <p className="text-[10px] text-gray-400">Update messaging, coordinates, and physical coordinates in real time.</p>
                  </div>
                </div>

                <form onSubmit={handlePublishContactInfo} className="space-y-3 font-sans text-xs">
                  
                  <div className="space-y-1">
                    <label className="text-gray-500 text-[9px] uppercase font-bold block">Banner Title Head</label>
                    <input
                      type="text"
                      required
                      value={contactTitle}
                      onChange={(e) => setContactTitle(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-gray-150 p-2 rounded-lg text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-500 text-[9px] uppercase font-bold block">Introductory Paragraph Description</label>
                    <textarea
                      required
                      rows={3}
                      value={contactDescription}
                      onChange={(e) => setContactDescription(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-gray-150 p-2 rounded-lg text-xs leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-500 text-[9px] uppercase font-bold block">Physical Street Address Coordinates</label>
                    <input
                      type="text"
                      required
                      value={contactAddress}
                      onChange={(e) => setContactAddress(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-gray-150 p-2 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-500 text-[9px] uppercase font-bold block">Support Telephone/WhatsApp Dispatcher</label>
                    <input
                      type="text"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-gray-150 p-2 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#DE5246] hover:bg-black text-white rounded-xl text-xs font-mono font-bold uppercase transition-all shadow cursor-pointer text-center"
                  >
                    Save & Publish Contact Details
                  </button>
                </form>
              </div>

              {/* PAYID PAYMENT OPTION CUSTOMIZER CARD */}
              <div id="admin-payid-customizer" className="bg-white rounded-xl border border-gray-150 p-6 space-y-4 shadow-3xs text-left">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#DE5246]/10 flex items-center justify-center text-[#DE5246]">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight font-sans">PAYID Payment Option Info</h3>
                    <p className="text-[10px] text-gray-400">Configure instructions shown to clients who select PAYID at checkout.</p>
                  </div>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  localStorage.setItem('peps_payid_instructions', payidInstructions.trim());
                  setChannelSuccessMsg("PAYID Payment instructions successfully updated!");
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setTimeout(() => setChannelSuccessMsg(""), 4000);
                }} className="space-y-4 font-sans text-xs">
                  <div className="space-y-1">
                    <label className="text-gray-500 text-[9px] uppercase font-bold block">PAYID Instructions & Contact Info</label>
                    <textarea
                      required
                      rows={4}
                      value={payidInstructions}
                      onChange={(e) => setPayidInstructions(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-gray-150 p-2 rounded-lg text-xs leading-relaxed font-sans"
                      placeholder="Enter PAYID instructions here (WhatsApp or bank transfer detail instructions)..."
                    />
                  </div>

                  {/* Live Visual Preview of PAYID Selection */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-gray-500 text-[9px] uppercase font-bold block mb-1.5">Live Checkout Option Preview:</span>
                    <div className="p-3 bg-white border border-gray-200 rounded-lg text-left select-none shadow-3xs">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border border-[#DE5246] flex items-center justify-center p-0.5">
                          <div className="w-2 h-2 rounded-full bg-[#DE5246]" />
                        </div>
                        <span className="text-xs font-black text-gray-700 tracking-widest font-mono">PAYID</span>
                      </div>
                      <div className="mt-2 ml-7 text-slate-800 text-[11px] font-medium leading-relaxed whitespace-pre-wrap font-sans bg-[#FAF9F5] p-2.5 rounded border border-gray-100">
                        {payidInstructions || 'Contact Us On WhatsApp : +61 488 856 783 Email : mail@buyswisspeptides.shop For Payments and Quick Processing of your Order'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#DE5246] hover:bg-black text-white rounded-xl text-xs font-mono font-bold uppercase transition-all shadow cursor-pointer text-center"
                  >
                    Save & Update PAYID Details
                  </button>
                </form>
              </div>

              {/* CHAT WIDGET DIRECT LINKS CUSTOMIZER CARD */}
              <div id="admin-chat-customizer" className="bg-white rounded-xl border border-gray-150 p-6 space-y-4 shadow-3xs text-left">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#DE5246]/10 flex items-center justify-center text-[#DE5246]">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight font-sans">Live Chat Widget Setup</h3>
                    <p className="text-[10px] text-gray-400">Configure floating chat links of WhatsApp & Telegram accounts.</p>
                  </div>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  localStorage.setItem('peps_whatsapp_number', whatsappNumber.trim());
                  localStorage.setItem('peps_telegram_username', telegramUsername.trim());
                  setChannelSuccessMsg("WhatsApp & Telegram Floating chat channels updated successfully!");
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setTimeout(() => setChannelSuccessMsg(""), 4000);
                }} className="space-y-4 font-sans text-xs">
                  <div className="space-y-1">
                    <label className="text-gray-500 text-[9px] uppercase font-bold block">WhatsApp Dynamic Number or URL Link</label>
                    <input
                      type="text"
                      required
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-gray-150 p-2.5 rounded-xl text-xs font-mono"
                      placeholder="e.g. +61 488 856 783"
                    />
                    <p className="text-[9px] text-gray-400">
                      Enter full international phone format (e.g. <code>+61 488 856 783</code>) or a direct wa.me link.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-500 text-[9px] uppercase font-bold block">Telegram Username or URL Link</label>
                    <input
                      type="text"
                      required
                      value={telegramUsername}
                      onChange={(e) => setTelegramUsername(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-gray-150 p-2.5 rounded-xl text-xs font-mono"
                      placeholder="e.g. BuySwissPeptide"
                    />
                    <p className="text-[9px] text-gray-400">
                      Enter username (e.g. <code>BuySwissPeptide</code>) or full t.me invitation link.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-mono font-bold uppercase transition-all shadow cursor-pointer text-center"
                  >
                    Save & Publish Floating Support Channels
                  </button>
                </form>
              </div>

              {/* REALTIME VISITOR SCREEN INTERACTIVE PREVIEW */}
              <div className="bg-[#0C1B2D]/5 rounded-xl border border-dashed border-gray-300 p-5 space-y-3">
                <span className="text-gray-650 text-[10px] uppercase font-black font-mono block">Real-Time Visitor Page Preview Simulation</span>
                
                {/* Simulated contact us screen box */}
                <div className="bg-[#FAF9F5] rounded-xl border border-gray-200 overflow-hidden shadow-sm p-4 text-slate-800 scale-95 transition-all text-left">
                  <span className="bg-[#0C1B2D] text-white text-[7px] font-mono uppercase px-1.5 py-0.5 rounded-full inline-block mb-3 leading-none font-bold">Client View Preview</span>
                  
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <h4 className="text-sm font-black text-[#0C1B2D]">{contactTitle}</h4>
                      <p className="text-[10px] text-gray-500 leading-relaxed mt-1">{contactDescription}</p>
                    </div>

                    <div className="space-y-2 text-[10px] font-mono text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{contactAddress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{orderEmail}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{contactPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}



        {/* ========================================================= */}
        {/* TAB 4: OPERATION TASKS (ONLY PLACED ORDERS & DATES LISTED) */}
        {/* ========================================================= */}
        {activeTab === 'operations' && (
          <div className="space-y-6 font-sans text-xs">
            <div className="bg-white rounded-2xl border border-gray-150 shadow-3xs overflow-hidden text-left">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center text-xs font-mono font-bold text-gray-500">
                <span className="uppercase tracking-wider">📦 Placed Orders Directory</span>
                <span className="text-xs bg-[#DE5246]/10 text-[#DE5246] px-2.5 py-0.5 rounded-full font-sans font-bold">
                  {filteredOrdersList.length} total orders
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredOrdersList.length === 0 ? (
                  <div className="p-12 text-center text-gray-400 font-mono">
                    No placed orders found in the registry.
                  </div>
                ) : (
                  filteredOrdersList.map(o => (
                    <div key={o.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#FAF9F5]/40 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap text-sm">
                          <span className="font-mono font-black text-[#DE5246] tracking-tight">{o.id}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs font-medium text-gray-600 font-sans">Placed on: {o.orderDate}</span>
                        </div>
                        
                        {/* Ordered Items List representing what this order is */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Items Purchased:</span>
                          <div className="flex flex-wrap gap-2">
                            {o.items.map((it, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-850 text-[11px] font-sans px-2.5 py-1 rounded-lg border border-gray-150">
                                {it.name} <span className="font-bold text-[#DE5246]">x{it.quantity}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Customer & Total Details */}
                        <div className="text-[11px] text-gray-500 flex items-center gap-4 pt-1 font-mono">
                          <span>Client: <strong className="text-gray-900 font-sans">{o.userName}</strong></span>
                          <span>Total Amount: <strong className="text-[#DE5246] font-sans">${o.total.toFixed(2)} USD</strong></span>
                        </div>
                      </div>
                      
                      {/* Status Checkmark indicator */}
                      <span className="text-[10px] bg-green-50 text-green-700 border border-green-150 px-3 py-1 rounded-full font-mono font-bold uppercase tracking-wider self-start md:self-center">
                        ✓ Registered
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
