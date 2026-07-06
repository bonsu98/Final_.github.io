export interface Product {
  id: string;
  name: string;
  chemicalName?: string;
  formula?: string;
  molecularWeight?: string;
  dosage: string; // e.g., "5mg"
  vialCount?: string; // Selected pack size, e.g. "10 Vials"
  price: number;
  priceRange?: string; // e.g., "$110.05 - $21,000.00"
  originalPrice?: number; // Pre-discount price
  discountPercentage?: number; // Custom discount percentage
  thumbnailVial?: string;
  thumbnailCert?: string;
  thumbnailChrom?: string;
  thumbnailMass?: string;
  description: string;
  detailedDescription?: string;
  category: 'growth' | 'injury' | 'longevity' | 'cognitive' | 'metabolism';
  purity: string; // e.g. "99.2%"
  purityNumber: number; // e.g. 99.2
  imageUrl: string;
  benefits: string[];
  storage: string;
  quantity?: number; // Stock quantity
  images?: string[]; // Multiple thumbnails collection
  reconstitute: {
    recommendedDiluent: string;
    vialVolumeMl: number;
    defaultBacteriostaticWaterMl: number;
  };
  popularity?: number;
  rating?: number;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  phone?: string;
  userEmail: string;
  userName: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: {
    productId: string;
    name: string;
    quantity: number;
    priceAtPurchase: number;
  }[];
  paymentMethod: 'bank_transfer' | 'credit_card' | 'crypto';
  paymentDetails: string;
  note?: string;
  total: number;
  orderDate: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  trackingNumber?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  organization?: string;
  labLicense?: string;
  role: 'researcher' | 'administrator';
  joinedAt: string;
}

export interface COABatch {
  id: string; // Batch ref
  productId: string;
  productName: string;
  batchNumber: string;
  purity: string;
  testDate: string;
  laboratory: string;
  analyst: string;
  status: 'Certified' | 'Pending' | 'Rejected';
  hplcPeakData: { time: number; intensity: number }[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown or HTML
  author: string;
  publishDate: string;
  imageUrl: string;
  tags: string[];
}

export type PageView = 'home' | 'shop' | 'coas' | 'account' | 'docs' | 'about' | 'checkout' | 'admin' | 'contact' | 'product-detail' | 'cart' | 'privacy' | 'articles' | 'article-detail' | 'seo-landing';
