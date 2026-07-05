import React, { useState, useEffect, Suspense, lazy } from 'react';
import { PageView, CartItem, Product, Order, UserProfile, COABatch, Article } from './types';
import { trackAddToCart, trackBeginCheckout } from './utils/analytics';
import Header from './components/Header';
import Hero from './components/Hero';
const ShopCatalog = lazy(() => import('./components/ShopCatalog'));
const ProductDetail = lazy(() => import('./components/ProductDetail'));
import CartDrawer from './components/CartDrawer';
const CheckoutForm = lazy(() => import('./components/CheckoutForm'));
const AccountPortal = lazy(() => import('./components/AccountPortal'));
const LabTests = lazy(() => import('./components/LabTests'));
const DocsPortal = lazy(() => import('./components/DocsPortal'));
const AboutInfo = lazy(() => import('./components/AboutInfo'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const AdminPortal = lazy(() => import('./components/AdminPortal'));
const CartPage = lazy(() => import('./components/CartPage'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const RefundPolicy = lazy(() => import('./components/RefundPolicy'));
const ArticleList = lazy(() => import('./components/ArticleList'));
const ArticleDetail = lazy(() => import('./components/ArticleDetail'));
import ChatWidget from './components/ChatWidget';
import { PRODUCTS, MOCK_COAS, ARTICLES } from './mockData';
import { CheckCircle, Check } from 'lucide-react';

const BEST_SELLERS = [
  {
    id: "pep-retatrutide",
    name: "Retatrutide",
    priceRange: "$95.00 â€“ $42,000.00",
    image: "./src/assets/images/retatrutide_best_1780030958269.png"
  },
  {
    id: "pep-mots-c",
    name: "MOTS-C",
    priceRange: "$99.00 â€“ $21,400.00",
    image: "./src/assets/images/mots_c_best_1780030979501.png"
  },
  {
    id: "pep-hgh-191aa",
    name: "HGH 191 AA 97%",
    priceRange: "$113.00 â€“ $10,300.00",
    image: "./src/assets/images/hgh_191_best_1780030996215.png"
  },
  {
    id: "pep-ghk-cu",
    name: "GHK-CU",
    priceRange: "$103.00 â€“ $8,000.00",
    image: "./src/assets/images/ghk_cu_best_1780031016475.png"
  },
  {
    id: "pep-tirzepatide",
    name: "Tirzepatide",
    priceRange: "$57.00 â€“ $25,700.00",
    image: "./src/assets/images/tirzepatide_best_1780031041817.png"
  },
  {
    id: "pep-bpc157-tb500",
    name: "BPC157 + TB500 Blend",
    priceRange: "$141.00 â€“ $18,200.00",
    image: "./src/assets/images/bpc157_tb500_best_1780031064715.png"
  },
  {
    id: "pep-nad-10ml",
    name: "NAD+ (10ML)",
    priceRange: "$182.00 â€“ $12,400.00",
    image: "./src/assets/images/nad_10ml_best_1780031082396.png"
  },
  {
    id: "pep-igf1-lr3",
    name: "IGF-1 LR3",
    priceRange: "$100.00 â€“ $16,700.00",
    image: "./src/assets/images/igf1_lr3_best_1780031102244.png"
  },
  {
    id: "pep-melanotan2",
    name: "melanotan 2",
    priceRange: "$155.00 â€“ $6,000.00",
    image: "./src/assets/images/melanotan2_best_1780031120375.png"
  },
  {
    id: "pep-epitalon",
    name: "Epithalon",
    priceRange: "$95.00 â€“ $12,900.00",
    image: "./src/assets/images/epithalon_best_1780031139756.png"
  }
];

export default function App() {
  // Page states
  const [activePage, setActivePage] = useState<PageView>('home');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [cartNotification, setCartNotification] = useState<{ productName: string } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Core administrative states (Stateful Database)
  const [products, setProducts] = useState<Product[]>([]);
  const [coas, setCoas] = useState<COABatch[]>([]);

  // Authentication State with Researcher Account Profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('peps_saved_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading saved user:", e);
      }
    }
    return null;
  });

  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginOrg, setLoginOrg] = useState('');
  const [loginLicense, setLoginLicense] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  // Cart and Order Persistence States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [checkoutSuccessOrder, setCheckoutSuccessOrder] = useState<Order | null>(null);

  // Load Stateful databases at bootstrap
  useEffect(() => {
    // 1. Products Load (With support for persistent edits in Admin)
    const savedProducts = localStorage.getItem('peps_products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error("Error loading products:", e);
        setProducts(PRODUCTS);
        localStorage.setItem('peps_products', JSON.stringify(PRODUCTS));
      }
    } else {
      setProducts(PRODUCTS);
      localStorage.setItem('peps_products', JSON.stringify(PRODUCTS));
    }

    // 2. COA Lab tests load
    const savedCoas = localStorage.getItem('peps_coas');
    if (savedCoas) {
      try {
        setCoas(JSON.parse(savedCoas));
      } catch (e) {
        console.error("Error loading coas:", e);
        setCoas(MOCK_COAS);
      }
    } else {
      setCoas(MOCK_COAS);
      localStorage.setItem('peps_coas', JSON.stringify(MOCK_COAS));
    }

    // 3. Cart & Orders Load
    const savedCart = localStorage.getItem('peps_au_cart');
    const savedOrders = localStorage.getItem('peps_au_orders');
    
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
    }
    
    if (savedOrders) {
      try { 
        setOrders(JSON.parse(savedOrders)); 
      } catch (e) { 
        console.error(e); 
      }
    } else {
      const seedOrder: Order = {
        id: "PEPS-CH-1128",
        userEmail: "m.evans@swisspep.ch",
        userName: "Dr. Matthew Evans",
        shippingAddress: {
          street: "Geneva Scientifique Avenue 14",
          city: "ZÃ¼rich",
          state: "ZH",
          postalCode: "8001",
          country: "Switzerland"
        },
        items: [
          { productId: "pep-retatrutide", name: "Retatrutide", quantity: 1, priceAtPurchase: 189.00 }
        ],
        paymentMethod: "bank_transfer",
        paymentDetails: "Direct SWIFT/IBAN Transfer Completed",
        total: 189.00,
        orderDate: "2026-05-18",
        status: "shipped",
        trackingNumber: "SP-DISPATCH-99120"
      };
      setOrders([seedOrder]);
      localStorage.setItem('peps_au_orders', JSON.stringify([seedOrder]));
    }

    // Synchronize latest order registry from Server
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
          localStorage.setItem('peps_au_orders', JSON.stringify(data.orders));
        }
      })
      .catch(err => {
        console.error("Failed to load orders from server:", err);
      });
  }, []);

  // Dismiss cart notification on page transitions
  useEffect(() => {
    setCartNotification(null);
  }, [activePage]);

  // Listen for /admin in URL pathname, hash, or search params to access the admin portal
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      if (
        path === '/admin' ||
        path.endsWith('/admin') ||
        path.endsWith('/admin/') ||
        hash === '#/admin' ||
        hash === '#admin' ||
        search.includes('admin')
      ) {
        setActivePage('admin');

        // Automatically authorize current session as administrator to allow free navigation
        if (!currentUser) {
          const adminSession: UserProfile = {
            uid: 'admin-auto-bypass',
            email: 'admin@swisspeptides.com',
            name: 'Administrator',
            organization: 'Elite Swiss Laboratories',
            labLicense: 'CH-8829-ADMIN',
            role: 'administrator',
            joinedAt: 'May 2026'
          };
          setCurrentUser(adminSession);
          localStorage.setItem('peps_saved_user', JSON.stringify(adminSession));
        }
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('popstate', checkAdminRoute);

    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
    };
  }, [currentUser]);

  // Save Cart updates to state
  useEffect(() => {
    if (cart.length > 0 || localStorage.getItem('peps_au_cart')) {
      localStorage.setItem('peps_au_cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Cart Operations
  const handleAddToCart = (product: Product, quantity: number = 1, customPrice?: number) => {
    setCart(prev => {
      const targetProduct = customPrice ? { ...product, price: customPrice } : product;
      // Match on both ID and Price to support multiple pricing versions of the same product (custom options) or standard
      const matchIndex = prev.findIndex(item => item.product.id === product.id && item.product.price === targetProduct.price);
      if (matchIndex >= 0) {
        const copy = [...prev];
        copy[matchIndex].quantity += quantity;
        return copy;
      } else {
        return [...prev, { product: targetProduct, quantity }];
      }
    });
    
    // Fire GA4 Add to Cart event
    trackAddToCart(product, quantity, customPrice);
    
    setCartNotification({ productName: product.name });
    // Scroll smoothly to top so the notification is visible right away
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      const matchIndex = prev.findIndex(item => item.product.id === productId);
      if (matchIndex >= 0) {
        const copy = [...prev];
        const updatedQty = copy[matchIndex].quantity + delta;
        if (updatedQty <= 0) {
          copy.splice(matchIndex, 1);
        } else {
          copy[matchIndex].quantity = updatedQty;
        }
        return copy;
      }
      return prev;
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleCheckoutClick = () => {
    setCartOpen(false);
    trackBeginCheckout(cart);
    setActivePage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderCompleted = (completedOrder: Order) => {
    const updatedOrders = [completedOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('peps_au_orders', JSON.stringify(updatedOrders));

    // Save to server-side orders database
    fetch('/api/orders', {
      method: "POST",
      headers: { "Content-Type" : "application/json" },
      body: JSON.stringify(completedOrder)
    })
    .then(res => res.json())
    .then(data => {
      console.log("Order saved to server database:", data);
    })
    .catch(err => {
      console.error("Critical error saving order to server database:", err);
    });
    
    // Dispatch automated confirmation email via Web3Forms
    const itemsSummary = completedOrder.items.map(it => 
      `- ${it.name} (Qty: ${it.quantity}) [$${it.priceAtPurchase}]`
    ).join('\n');
    const address = completedOrder.shippingAddress;
    const shippingString = `${address.street}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`;
    
    const orderMessage = `
New Order Received!

Order ID: ${completedOrder.id}
Customer Name: ${completedOrder.userName}
Email: ${completedOrder.userEmail}
Total: $${completedOrder.total.toFixed(2)}
Payment Method: ${completedOrder.paymentMethod}

Items Ordered:
${itemsSummary}

Shipping Address:
${shippingString}
    `.trim();

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: "65a272b7-f7b7-40e5-819b-7fa733cdc5ac",
        subject: `New Order: ${completedOrder.id}`,
        from_name: "Swiss Peptides System",
        message: orderMessage
      })
    })
    .then(async (response) => {
      const json = await response.json();
      if (response.status === 200) {
        console.log('Web3Forms order notification success:', json.message);
      } else {
        console.error('Web3Forms order notification error:', json.message);
      }
    })
    .catch(err => {
      console.error('Failed to dispatch order notification to Web3Forms:', err);
    });

    setCart([]);
    localStorage.removeItem('peps_au_cart');
    setCheckoutSuccessOrder(completedOrder);
  };

  // Researcher Login submit handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginName || !loginPassword) {
      alert('Please fill out all fields: username, email and password.');
      return;
    }

    const savedUsersStr = localStorage.getItem('peps_registered_users_list');
    let registeredUsers: any[] = [];
    if (savedUsersStr) {
      try {
        registeredUsers = JSON.parse(savedUsersStr);
      } catch (err) {
        console.error("Error parsing registered users:", err);
      }
    }

    // Seed the saved user from active session if this list is empty or doesn't have it
    const savedUserStr = localStorage.getItem('peps_saved_user');
    if (savedUserStr) {
      try {
        const parsedSaved = JSON.parse(savedUserStr);
        const alreadyExists = registeredUsers.some((u: any) => u.email.toLowerCase() === parsedSaved.email.toLowerCase());
        if (!alreadyExists) {
          registeredUsers.push({
            ...parsedSaved,
            password: 'password' // give a default password
          });
          localStorage.setItem('peps_registered_users_list', JSON.stringify(registeredUsers));
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (isSignUp) {
      // Check if email or name is already in use
      const exists = registeredUsers.some((u: any) => 
        u.email.toLowerCase() === loginEmail.trim().toLowerCase() ||
        u.name.toLowerCase() === loginName.trim().toLowerCase()
      );
      if (exists) {
        setResetMessage('Username or Email is already registered. Please Login.');
        return;
      }

      const newUserRecord = {
        uid: `swiss-re-${Math.floor(1000 + Math.random() * 9000)}`,
        email: loginEmail.trim(),
        name: loginName.trim(),
        password: loginPassword,
        organization: loginOrg || 'Swiss Molecular Analytics Lab',
        labLicense: loginLicense || 'CH-BIO-992180',
        role: 'researcher',
        joinedAt: new Date().toISOString().substring(0, 10)
      };

      registeredUsers.push(newUserRecord);
      localStorage.setItem('peps_registered_users_list', JSON.stringify(registeredUsers));

      const newProfile: UserProfile = {
        uid: newUserRecord.uid,
        email: newUserRecord.email,
        name: newUserRecord.name,
        organization: newUserRecord.organization,
        labLicense: newUserRecord.labLicense,
        role: 'researcher',
        joinedAt: newUserRecord.joinedAt
      };

      setCurrentUser(newProfile);
      setResetMessage('Account registered and logged in successfully!');
      if (rememberMe) {
        localStorage.setItem('peps_saved_user', JSON.stringify(newProfile));
      }
      setTimeout(() => {
        setLoginModalOpen(false);
        setResetMessage('');
      }, 1500);
    } else {
      // Find matching user by email OR username (case-insensitive)
      const matchedUser = registeredUsers.find((u: any) => 
        u.email.toLowerCase() === loginEmail.trim().toLowerCase() ||
        u.name.toLowerCase() === loginName.trim().toLowerCase()
      );

      if (!matchedUser) {
        setResetMessage('Account not found with this username/email. Please Sign Up.');
        return;
      }

      if (matchedUser.password !== loginPassword) {
        setResetMessage('Incorrect password. Please try again.');
        return;
      }

      const foundProfile: UserProfile = {
        uid: matchedUser.uid,
        email: matchedUser.email,
        name: matchedUser.name,
        organization: matchedUser.organization,
        labLicense: matchedUser.labLicense,
        role: (matchedUser.role === 'administrator' ? 'administrator' : 'researcher') as UserProfile['role'],
        joinedAt: matchedUser.joinedAt
      };

      setCurrentUser(foundProfile);
      setResetMessage('Logged in successfully!');
      if (rememberMe) {
        localStorage.setItem('peps_saved_user', JSON.stringify(foundProfile));
      }
      setTimeout(() => {
        setLoginModalOpen(false);
        setResetMessage('');
      }, 1200);
    }
  };

  const handleLogout = () => {
    // Clear admin-related hashes, pathnames, or search queries from browser history
    try {
      if (
        window.location.pathname.toLowerCase().includes('admin') ||
        window.location.hash.toLowerCase().includes('admin') ||
        window.location.search.toLowerCase().includes('admin')
      ) {
        window.history.pushState(null, '', '/');
      }
    } catch (e) {
      console.error('Failed to reset URL parameters on logout', e);
    }

    setCurrentUser(null);
    localStorage.removeItem('peps_saved_user');
    setActivePage('home');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-gray-800 flex flex-col font-sans transition-all selection:bg-[#DE5246] selection:text-white">
      
      {/* Dynamic Header */}
      <Header
        activePage={activePage}
        setActivePage={(p) => {
          setActivePage(p);
          setCheckoutSuccessOrder(null);
        }}
        cart={cart}
        setCartOpen={setCartOpen}
        currentUser={currentUser}
        onLoginClick={() => setLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Researcher Authorization Access Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-950/70 backdrop-blur-3xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleLoginSubmit}
            className="bg-white border text-gray-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative border-gray-100"
          >
            <button
              type="button"
              onClick={() => {
                setLoginModalOpen(false);
                setResetMessage('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-950 font-sans text-base font-bold cursor-pointer"
            >
              Ã—
            </button>
            
            <div className="text-center font-sans pb-1">
              <h3 className="text-base font-bold text-gray-950 uppercase tracking-wide">
                {isSignUp ? 'Create Researcher Account' : 'Sign In'}
              </h3>
            </div>

            {resetMessage && (
              <div className="p-2.5 bg-[#DE5246]/10 border border-[#DE5246]/20 text-[#DE5246] rounded-xl text-center font-sans text-[11px] font-medium">
                {resetMessage}
              </div>
            )}

            <div className="space-y-1">
              <span className="text-gray-400 block scale-90 -ml-1 uppercase text-[9px] font-bold font-sans">Username *</span>
              <input
                type="text"
                required
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 p-2.5 font-sans focus:outline-none focus:border-[#DE5246] rounded-xl text-xs font-semibold"
                placeholder="e.g. adrian_keller"
              />
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 block scale-90 -ml-1 uppercase text-[9px] font-bold font-sans">Email *</span>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 p-2.5 font-sans focus:outline-none focus:border-[#DE5246] rounded-xl text-xs"
                placeholder="e.g. adrian.keller@biotech.ch"
              />
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 block scale-90 -ml-1 uppercase text-[9px] font-bold font-sans">Password *</span>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 p-2.5 font-sans focus:outline-none focus:border-[#DE5246] rounded-xl text-xs"
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              />
            </div>

            {/* Remember Me and Forgot Password row */}
            <div className="flex items-center justify-between font-sans text-[11px] select-none py-1">
              <label className="flex items-center gap-1.5 cursor-pointer text-gray-650 hover:text-gray-900 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-[#DE5246] focus:ring-[#DE5246] w-3.5 h-3.5 cursor-pointer"
                />
                Remember me
              </label>
              
              <button
                type="button"
                onClick={() => {
                  if (!loginEmail) {
                    setResetMessage('Please fill in your email address first so we can send a reset link.');
                  } else {
                    setResetMessage(`A reset link has been dispatched to ${loginEmail}`);
                  }
                  setTimeout(() => setResetMessage(''), 5000);
                }}
                className="text-[#DE5246] hover:underline hover:text-[#B2251B] font-bold cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#DE5246] hover:bg-black text-white font-extrabold uppercase font-sans tracking-wide text-xs rounded-xl cursor-pointer transition-colors"
            >
              {isSignUp ? 'Sign Up' : 'Login'}
            </button>

            {/* Alternating mode link */}
            <div className="text-center font-sans text-[11px] text-gray-500 pt-3 border-t border-gray-100">
              {isSignUp ? "Already have an account?" : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setResetMessage('');
                }}
                className="text-[#DE5246] hover:underline font-bold cursor-pointer"
              >
                {isSignUp ? 'Login here' : 'Sign Up here'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cart Drawer Overlay */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckoutClick={handleCheckoutClick}
        currentUser={currentUser}
        onLoginClick={() => setLoginModalOpen(true)}
      />

      {/* Main Views Layout Switch */}
      <main className="flex-1">
        <Suspense fallback={<div className="flex min-h-[70vh] items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DE5246]"></div></div>}>
        {/* Cart added notification banner - exact replica of the user mockup */}
        {cartNotification && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 select-none animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 bg-[#F8F9FA] border-[1.5px] border-black rounded-sm shadow-sm transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-[#3A5D7C] text-white rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <p className="text-[13.5px] text-[#4F5B66] font-medium leading-none">
                  &ldquo;{cartNotification.productName}&rdquo; has been added to your cart.
                </p>
              </div>
              <button
                onClick={() => {
                  setActivePage('cart');
                  setCartNotification(null);
                }}
                className="w-full sm:w-auto px-6 py-2 bg-[#DE5246] hover:bg-[#E55B4C] text-white text-[11px] font-bold tracking-widest uppercase rounded-full transition-all cursor-pointer font-sans shrink-0 hover:scale-[1.02] active:scale-[0.98] text-center"
              >
                VIEW CART
              </button>
            </div>
          </div>
        )}

        {checkoutSuccessOrder ? (
          /* Checkout formulation receipt success screen */
          <div className="w-full bg-white min-h-[85vh] py-12">
            <div className="max-w-4xl mx-auto px-4 md:px-8 font-sans text-left">
              {/* Checkout Title */}
              <h1 className="text-[26px] font-semibold text-[#000000] tracking-[0.03em] uppercase font-sans mb-5">
                CHECKOUT
              </h1>
              
              {/* Received Status Message */}
              <p className="text-[14.5px] text-[#222222] font-normal mb-8 leading-normal font-sans">
                Thank you. Your order has been received.
              </p>

              {/* Order Meta Data Row */}
              <div className="flex flex-wrap items-stretch border-t border-b border-[#E1E4EA] py-6 my-8 text-left gap-y-4 font-sans">
                {/* Order Number */}
                <div className="flex flex-col min-w-[120px] pr-6 md:pr-10 border-r border-[#E1E4EA] max-sm:border-r-0 max-sm:pr-0">
                  <span className="text-[10px] uppercase font-bold text-[#717680] tracking-wider mb-2 select-none">
                    ORDER NUMBER:
                  </span>
                  <span className="text-[14px] font-extrabold text-[#090C11]">
                    {checkoutSuccessOrder.id.replace('PEPS-AU-', '')}
                  </span>
                </div>

                {/* Date */}
                <div className="flex flex-col min-w-[150px] px-6 md:px-10 border-r border-[#E1E4EA] max-md:border-r-0 max-sm:px-0">
                  <span className="text-[10px] uppercase font-bold text-[#717680] tracking-wider mb-2 select-none">
                    DATE:
                  </span>
                  <span className="text-[14px] font-extrabold text-[#090C11]">
                    {new Date(checkoutSuccessOrder.orderDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {/* Total */}
                <div className="flex flex-col min-w-[120px] px-6 md:px-10 border-r border-[#E1E4EA] max-md:border-r-0 max-sm:px-0">
                  <span className="text-[10px] uppercase font-bold text-[#717680] tracking-wider mb-2 select-none">
                    TOTAL:
                  </span>
                  <span className="text-[14px] font-extrabold text-[#090C11]">
                    ${checkoutSuccessOrder.total.toFixed(2)}
                  </span>
                </div>

                {/* Payment Method */}
                <div className="flex flex-col min-w-[130px] pl-6 md:pl-10 max-md:pl-0">
                  <span className="text-[10px] uppercase font-bold text-[#717680] tracking-wider mb-2 select-none">
                    PAYMENT METHOD:
                  </span>
                  <span className="text-[14px] font-extrabold text-[#090C11] uppercase">
                    {checkoutSuccessOrder.paymentMethod === 'bank_transfer' ? 'PAYID' : 'CRYPTO'}
                  </span>
                </div>
              </div>

              {/* Contact information details matching screenshot */}
              <div className="text-[14px] text-[#222222] font-normal leading-[1.6] space-y-4 my-8 font-sans">
                <p>
                  Contact Us On WhatsApp: <span className="font-normal text-gray-950">+61 488 856 783</span>
                </p>
                <p>
                  Email : <span className="font-normal text-gray-950">mail@buyswisspeptides.shop</span>
                </p>
                <p className="text-[#888888] font-normal">
                  For Payments and Quick Processing of your Order
                </p>
              </div>

              {/* Box 1: Order Details Table */}
              <div className="border border-[#CCCCCC] rounded-xs overflow-hidden mb-8 bg-white font-sans">
                {/* Panel Header */}
                <div className="bg-white px-5 py-4 border-b border-[#CCCCCC]">
                  <h3 className="text-[16px] font-bold text-[#111111] tracking-normal">
                    Order details
                  </h3>
                </div>
                
                {/* Table Headers */}
                <div className="grid grid-cols-12 px-5 py-3 border-b border-[#CCCCCC] text-[13px] font-bold text-[#333333] select-none">
                  <span className="col-span-8 text-left">Product</span>
                  <span className="col-span-4 text-right">Total</span>
                </div>

                {/* Checkout items rows */}
                <div className="divide-y divide-[#E5E7EB] text-[13px] text-[#333333]">
                  {checkoutSuccessOrder.items.map((item, index) => (
                    <div key={item.productId || index} className="grid grid-cols-12 px-5 py-3.5 leading-relaxed">
                      <span className="col-span-8 text-left font-normal">
                        {item.name} <span className="text-gray-900 font-bold mx-0.5">Ã—</span> <span className="font-bold text-gray-950">{item.quantity}</span>
                      </span>
                      <span className="col-span-4 text-right font-normal">
                        ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  {/* Subtotal row */}
                  <div className="grid grid-cols-12 px-5 py-3.5 border-t border-[#CCCCCC]">
                    <span className="col-span-8 text-left font-normal text-[#111111]">Subtotal:</span>
                    <span className="col-span-4 text-right font-normal text-[#111111]">
                      ${checkoutSuccessOrder.total.toFixed(2)}
                    </span>
                  </div>

                  {/* Total row */}
                  <div className="grid grid-cols-12 px-5 py-3.5 border-t border-[#CCCCCC]">
                    <span className="col-span-8 text-left font-bold text-[#111111]">Total:</span>
                    <span className="col-span-4 text-right font-bold text-[#111111]">
                      ${checkoutSuccessOrder.total.toFixed(2)}
                    </span>
                  </div>

                  {/* Payment Method Option */}
                  <div className="grid grid-cols-12 px-5 py-3.5 border-t border-[#CCCCCC]">
                    <span className="col-span-8 text-left font-normal text-[#111111]">Payment method:</span>
                    <span className="col-span-4 text-right uppercase text-[#111111] font-normal">
                      {checkoutSuccessOrder.paymentMethod === 'bank_transfer' ? 'PAYID' : 'Crypto'}
                    </span>
                  </div>

                  {/* Order Note */}
                  <div className="grid grid-cols-12 px-5 py-3.5 border-t border-[#CCCCCC]">
                    <span className="col-span-3 sm:col-span-2 text-left font-normal text-[#111111]">Note:</span>
                    <span className="col-span-9 sm:col-span-10 text-right text-gray-500 font-normal break-words">
                      {checkoutSuccessOrder.note || 'None'}
                    </span>
                  </div>
                </div>
              </div>


              {/* Box 2: Billing address Block */}
              <div className="border border-[#CCCCCC] rounded-xs overflow-hidden mb-12 bg-white font-sans">
                {/* Panel Header */}
                <div className="bg-white px-5 py-4 border-b border-[#CCCCCC]">
                  <h3 className="text-[16px] font-bold text-[#111111] tracking-normal">
                    Billing address
                  </h3>
                </div>

                {/* Suburb / state address info block */}
                <div className="px-5 py-5 text-[14px] text-[#4F5B66] space-y-1.5 text-left leading-[1.5] font-sans">
                  <p className="text-[#111111] font-normal">{checkoutSuccessOrder.userName}</p>
                  <p className="text-[#333333] font-normal">{checkoutSuccessOrder.shippingAddress.street}</p>
                  <p className="text-[#333333] font-normal capitalize">{checkoutSuccessOrder.shippingAddress.city}</p>
                  <p className="text-[#333333] font-normal font-mono">{checkoutSuccessOrder.shippingAddress.postalCode}</p>
                  <p className="text-[#333333] font-normal capitalize">{checkoutSuccessOrder.shippingAddress.country}</p>
                  
                  {checkoutSuccessOrder.phone && (
                    <p className="flex items-center gap-2 text-gray-650 pt-1 font-mono">
                      <span>ðŸ“ž</span>
                      <span>{checkoutSuccessOrder.phone}</span>
                    </p>
                  )}
                  {checkoutSuccessOrder.userEmail && (
                    <p className="flex items-center gap-2 text-gray-650 pt-0.5 font-sans">
                      <span>âœ‰</span>
                      <span>{checkoutSuccessOrder.userEmail}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons with cleaner look */}
              <div className="flex flex-col sm:flex-row gap-4 justify-start pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setCheckoutSuccessOrder(null);
                    setActivePage('shop');
                  }}
                  className="px-6 py-3 bg-[#DE5246] hover:bg-black text-white text-[11px] font-bold tracking-widest uppercase rounded-sm transition-all cursor-pointer"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => {
                    setCheckoutSuccessOrder(null);
                    setActivePage('account');
                  }}
                  className="px-6 py-3 border border-gray-200 hover:border-black text-[#555555] hover:text-black text-[11px] font-bold tracking-widest uppercase rounded-sm transition-all cursor-pointer bg-white"
                >
                  View My Account
                </button>
              </div>

            </div>
          </div>
        ) : (
          /* Active Routes Switching */
          <>
            {activePage === 'home' && (
              <>
                <Hero
                  onExploreClick={() => setActivePage('shop')}
                  onVerifyClick={() => setActivePage('coas')}
                  setActiveCategory={setActiveCategory}
                />
                
                {/* 2. WHY CHOOSE US & BEST SELLING PRODUCTS (Matching uploaded Image structure, typography and content precisely) */}
                <section className="bg-white py-14 border-b border-gray-100">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Top thin indicator box in the image */}
                    <div className="border border-gray-200 w-full h-8 mb-12 bg-gray-50/50 rounded-sm"></div>

                    {/* Highly Polished Centered Core Content matching image layout */}
                    <div className="text-center max-w-5xl mx-auto space-y-8 select-none">
                      
                      {/* Main bold title */}
                      <h1 style={{ fontSize: '36px' }} className="font-montserrat font-bold tracking-tight text-[#071F3F] uppercase">
                        Why Choose Us To Buy Peptides In Switzerland
                      </h1>

                      {/* Descriptive Intro Statement */}
                      <p style={{ fontSize: '14px' }} className="text-gray-500 font-sans leading-relaxed max-w-4xl mx-auto font-medium">
                        When searching for premium quality peptides in Switzerland, quality and purity are non-negotiables. At Swiss Peptides, we bridge the gap between scientific excellence and accessibility. All our products are in stock and ready for immediate dispatch from our local warehouse.
                      </p>

                      {/* Segmented core pillars with clean negative space */}
                      <div className="space-y-12 pt-8">
                        
                        {/* 1. Purity */}
                        <div className="space-y-2">
                          <h2 style={{ fontSize: '23px' }} className="font-montserrat font-bold tracking-tight text-[#071F3F] uppercase">
                            99% + PURITY GUARANTEED
                          </h2>
                          <p style={{ fontSize: '14px' }} className="text-gray-500 font-sans leading-relaxed max-w-2xl mx-auto font-medium">
                            Every batch undergoes rigorous HPLC testing to ensure you receive the highest grade research peptides available in the peptide market.
                          </p>
                        </div>

                        {/* 2. Express Swiss Post */}
                        <div className="space-y-2">
                          <h2 style={{ fontSize: '23px' }} className="font-montserrat font-bold tracking-tight text-[#071F3F] uppercase">
                            EXPRESS SWISS POST
                          </h2>
                          <p style={{ fontSize: '14px' }} className="text-gray-500 font-sans leading-relaxed max-w-2xl mx-auto font-medium">
                            We understand the urgency. That is why we offer express shipping across all cantons, including Geneva, Zurich, Basel and Bern.
                          </p>
                        </div>

                        {/* 3. 3rd-Party Lab Verified */}
                        <div className="space-y-2">
                          <h2 style={{ fontSize: '23px' }} className="font-montserrat font-bold tracking-tight text-[#071F3F] uppercase">
                            3RD-PARTY LAB VERIFIED
                          </h2>
                          <p style={{ fontSize: '14px' }} className="text-gray-500 font-sans leading-relaxed max-w-2xl mx-auto font-medium">
                            All products are tested by independent labs, and the COA confirms purity, potency, and safety, giving you confidence in every batch.
                          </p>
                        </div>

                        {/* 4. Secure Payments */}
                        <div className="space-y-2">
                          <h2 style={{ fontSize: '23px' }} className="font-montserrat font-bold tracking-tight text-[#071F3F] uppercase">
                            SECURE PAYMENTS
                          </h2>
                          <p style={{ fontSize: '14px' }} className="text-gray-500 font-sans leading-relaxed max-w-2xl mx-auto font-medium">
                            Shop with confidence using our encrypted checkout system designed for Swiss researchers and peptide enthusiasts.
                          </p>
                        </div>

                      </div>

                      {/* Best Selling Products trigger heading */}
                      <div className="pt-16 text-center">
                        <h1 style={{ fontSize: '24px' }} className="font-montserrat font-bold text-[#071F3F] tracking-tight uppercase">
                          Best selling products
                        </h1>
                      </div>

                    </div>

                    {/* Functional Showcase of Real-Time Best Sellers matching layout exactly */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-12 mt-12 max-w-6xl mx-auto">
                      {BEST_SELLERS.map(item => {
                        const linkedProduct = products.find(p => p.id === item.id);
                        return (
                          <div 
                            key={item.id}
                            className="flex flex-col items-center text-center group"
                          >
                            {/* Product Image Square Container matching reference */}
                            <div 
                              onClick={() => {
                                if (linkedProduct) {
                                  setSelectedProduct(linkedProduct);
                                  setActivePage('product-detail');
                                }
                              }}
                              className="w-full aspect-square bg-[#F5F5F7] overflow-hidden cursor-pointer shadow-xs border border-gray-100 hover:border-gray-300 transition-all rounded-xs"
                            >
                              <img loading="lazy" 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            {/* Label */}
                            <h2 
                              onClick={() => {
                                if (linkedProduct) {
                                  setSelectedProduct(linkedProduct);
                                  setActivePage('product-detail');
                                }
                              }}
                              style={{ fontSize: '22px' }}
                              className="font-montserrat font-bold text-slate-900 mt-4 cursor-pointer hover:text-[#DE5246] transition-colors leading-tight"
                            >
                              {item.name}
                            </h2>

                            {/* Price range */}
                            <p className="text-[10px] sm:text-[11px] text-gray-500 font-semibold tracking-wide mt-1 mb-4 font-sans">
                              {item.priceRange}
                            </p>

                            {/* SELECT OPTIONS pill button */}
                            <button
                              onClick={() => {
                                if (linkedProduct) {
                                  setSelectedProduct(linkedProduct);
                                  setActivePage('product-detail');
                                }
                              }}
                              className="px-5 py-2 bg-[#E55B4C] hover:bg-[#DE5246] text-white text-[10px] tracking-wider font-extrabold uppercase rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center justify-center"
                            >
                              SELECT OPTIONS
                            </button>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </section>

                {/* 3. WHAT ARE PEPTIDES & DETAILED KNOWLEDGE PORTAL (Matching requested Image content/styling precisely) */}
                <section className="bg-[#FAF9F5] py-16 border-b border-gray-100">
                  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    
                    {/* "What Are Peptides?" Block */}
                    <div className="space-y-4 max-w-4xl">
                      <h1 style={{ fontSize: '34px' }} className="font-montserrat font-bold tracking-tight text-[#071F3F] uppercase">
                        What Are Peptides?
                      </h1>
                      <p style={{ fontSize: '14px' }} className="text-gray-500 font-sans leading-relaxed font-medium">
                        Peptides are short chains of amino acids, which are the building blocks of proteins. They play a vital role in various biological functions in the body, including regulating hormones, promoting muscle growth, and aiding in tissue repair. Peptides are used in a variety of applications, from enhancing athletic performance to supporting skin health. Because of their specific and targeted effects, peptides are often used in supplements and skincare products to address various health and beauty concerns.
                      </p>
                    </div>

                    {/* Image and Callout Layout Split Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4">
                      
                      {/* Left: Beautiful clinical photo generated based on mockup */}
                      <div className="md:col-span-5 w-full overflow-hidden">
                        <img loading="lazy" 
                          src="./src/assets/images/peptides_info_vials_1780003530034.png" 
                          alt="Premium research peptide vials with sterile syringes" 
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                          className="w-full h-[380px] md:h-[420px] object-cover"
                        />
                      </div>

                      {/* Right: "Shop the Best Peptides in Switzerland for Maximum Results" Block */}
                      <div className="md:col-span-7 space-y-5">
                        <h2 style={{ fontSize: '23px' }} className="font-montserrat font-bold text-[#071F3F] leading-tight uppercase">
                          Shop the Best Peptides in Switzerland for Maximum Results
                        </h2>
                        <p style={{ fontSize: '14px' }} className="text-gray-500 font-sans leading-relaxed font-medium">
                          Looking to buy peptides in Switzerland? Discover where to buy peptides online and get the best peptides for your needs. Whether you're looking for weight loss peptides in Switzerland or supplements to enhance muscle growth and recovery, we've got you covered. Shop now for premium peptides and experience maximum results with fast shipping across Switzerland!
                        </p>
                        
                        <div className="pt-2">
                          <button
                            onClick={() => setActivePage('shop')}
                            className="px-8 py-4 bg-[#E55B4C] hover:bg-[#DE5246] hover:scale-103 text-white font-extrabold text-xs md:text-sm tracking-widest uppercase rounded-full shadow-lg hover:shadow-2xl transition-all font-sans cursor-pointer h-14 min-w-[200px] hover:bg-black border border-white/10 text-center inline-flex items-center justify-center"
                          >
                            Explore Online shop
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                </section>

                {/* 4. 3 COMPELLING REASONS TO ORDER FROM US & ABOUT US (Precise Image Replica with Swisspf context) */}
                <section className="bg-white py-16 border-b border-gray-100">
                  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
                    
                    {/* Top Row: 3 Compelling Reasons */}
                    <div className="space-y-12">
                      <h1 style={{ fontSize: '22px' }} className="font-montserrat font-bold text-[#071F3F] text-center uppercase">
                        3 Compelling Reasons To Order From Us
                      </h1>

                      {/* 3 Columns Grid of Reasons */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                        
                        {/* Column 1: Refund */}
                        <div className="flex items-start gap-4">
                          {/* Icon Container with fixed width */}
                          <div className="shrink-0">
                            <svg className="w-20 h-20 text-gray-900" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              {/* Return Arrow looping */}
                              <path d="M70 35 C65 20, 40 20, 28 32" strokeWidth="1.75" />
                              <path d="M34 22 L24 32 L36 38" strokeWidth="1.75" />
                              {/* Banknote Stack Offset */}
                              <rect x="30" y="50" width="46" height="26" rx="4" className="stroke-gray-300" strokeWidth="1.2" />
                              <rect x="24" y="44" width="46" height="26" rx="4" fill="white" strokeWidth="1.75" />
                              <circle cx="47" cy="57" r="6" strokeWidth="1.75" />
                              {/* $ symbol */}
                              <path d="M47 54 v6" strokeWidth="1.2" />
                              <path d="M44 56.5 h6" strokeWidth="1.2" />
                            </svg>
                          </div>
                          {/* Text block */}
                          <div className="space-y-1">
                            <span className="text-[11px] font-sans font-bold tracking-widest text-[#071F3F] block uppercase pt-1">
                              01. Refund
                            </span>
                            <p style={{ fontSize: '14px' }} className="text-gray-500 font-sans leading-relaxed font-medium">
                              100% Money Back Guarantee. Even After Purchase
                            </p>
                          </div>
                        </div>

                        {/* Column 2: Free Delivery */}
                        <div className="flex items-start gap-4">
                          {/* Icon Container */}
                          <div className="shrink-0">
                            <svg className="w-20 h-20 text-gray-900" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              {/* Truck */}
                              <path d="M15 42 h42 v24 h-42 z" strokeWidth="1.75" />
                              <path d="M57 48 h14 l8 9 v9 h-22 z" strokeWidth="1.75" />
                              <circle cx="28" cy="66" r="6.5" strokeWidth="1.75" />
                              <circle cx="63" cy="66" r="6.5" strokeWidth="1.75" />
                              {/* Motion Wind Lines */}
                              <path d="M4 47 h6" strokeWidth="1.2" />
                              <path d="M7 53 h4" strokeWidth="1.2" />
                              <path d="M4 59 h8" strokeWidth="1.2" />
                              {/* FREE SHIPPING TEXT INSIDE/BELOW */}
                              <text x="36" y="55" fontSize="5.5" fontWeight="black" fill="currentColor" fontFamily="monospace" letterSpacing="0.2">FREE</text>
                              <text x="22" y="60" fontSize="5.5" fontWeight="black" fill="currentColor" fontFamily="monospace" letterSpacing="0.2">SHIPPING</text>
                            </svg>
                          </div>
                          {/* Text block */}
                          <div className="space-y-1">
                            <span className="text-[11px] font-sans font-bold tracking-widest text-[#071F3F] block uppercase pt-1">
                              02. Free Delivery
                            </span>
                            <p style={{ fontSize: '14px' }} className="text-gray-500 font-sans leading-relaxed font-medium">
                              Free Delivery On Order $200+ With Top-Notch Delivery Services
                            </p>
                          </div>
                        </div>

                        {/* Column 3: 24/7 Support */}
                        <div className="flex items-start gap-4">
                          {/* Icon Container */}
                          <div className="shrink-0">
                            <svg className="w-20 h-20 text-gray-900" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              {/* Headset Arc */}
                              <path d="M25 50 A24 24 0 0 1 75 50" strokeWidth="2" />
                              {/* Ear pads */}
                              <rect x="19" y="44" width="7" height="15" rx="3.5" fill="currentColor" />
                              <rect x="74" y="44" width="7" height="15" rx="3.5" fill="currentColor" />
                              {/* Mic */}
                              <path d="M74 54 c-4 11, -13 14, -20 14 h-4" strokeWidth="1.75" />
                              <circle cx="47" cy="68" r="2.5" fill="currentColor" />
                              {/* 24/7 Text badge in center bubble */}
                              <circle cx="49" cy="49" r="16" className="stroke-gray-150 fill-white" strokeWidth="1.5" />
                              <text x="49" y="53" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="currentColor" fontFamily="sans-serif">24/7</text>
                            </svg>
                          </div>
                          {/* Text block */}
                          <div className="space-y-1">
                            <span className="text-[11px] font-sans font-bold tracking-widest text-[#071F3F] block uppercase pt-1">
                              03. 24/7 Online Support
                            </span>
                            <p style={{ fontSize: '14px' }} className="text-gray-500 font-sans leading-relaxed font-medium">
                              Reach Out Anytime Via WhatsApp For Instant Assistance.
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Bottom Centered Row: About Us */}
                    <div className="text-center max-w-4xl mx-auto space-y-6 pt-12 border-t border-gray-100">
                      
                      <h1 style={{ fontSize: '22px' }} className="font-montserrat font-bold tracking-wide uppercase block text-[#071F3F]">
                        About Us
                      </h1>
                      
                      <h2 style={{ fontSize: '20px' }} className="font-montserrat font-bold tracking-tight text-[#071F3F] uppercase">
                        Buy Premium Peptides In Switzerland
                      </h2>

                      <p style={{ fontSize: '14px' }} className="text-gray-500 font-sans leading-relaxed font-medium max-w-3xl mx-auto">
                        At Swiss Peptides, we are dedicated to providing the highest quality peptides to help you achieve your health and fitness goals. Whether youâ€™re looking for muscle-building peptides, weight loss solutions, or performance enhancers, In addition, we offer a wide range of premium products sourced from trusted manufacturers. With fast shipping across Switzerland and a commitment to excellence, we make it easy to access the best peptides online. Trust us to support your journey toward better health and performance.
                      </p>

                      <div className="pt-6">
                        <button
                          onClick={() => setActivePage('shop')}
                          className="px-8 py-4 bg-[#E55B4C] hover:bg-[#DE5246] hover:scale-103 text-white font-extrabold text-xs md:text-sm tracking-widest uppercase rounded-full shadow-lg hover:shadow-2xl transition-all font-sans cursor-pointer h-14 min-w-[200px] hover:bg-black border border-white/10 text-center inline-flex items-center justify-center"
                        >
                          Shop Now
                        </button>
                      </div>

                    </div>

                  </div>
                </section>

                {/* 5. WEGOVY / SEMAGLUTIDE PRODUCTS BANNER SECTION (Precise Image Replica with Switzerland context) */}
                <section 
                  className="relative min-h-[600px] md:min-h-[750px] flex items-center bg-black overflow-hidden bg-cover bg-center bg-scroll md:bg-fixed py-20"
                  style={{
                    backgroundImage: "url('./src/assets/images/wegovy_pens_background_1780029483639.png')",
                    backgroundColor: "#18181b", /* fallback solid background for instant mobile load */
                  }}
                >
                  {/* Dark translucent overlay for high contrast and readability */}
                  <div className="absolute inset-0 bg-black/55 z-0 pointer-events-none"></div>

                  <div className="max-w-6xl mx-auto px-6 sm:px-12 relative z-10 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                      
                      {/* Left: Two stacked informational blocks overlay mimicking the picture */}
                      <div className="md:col-span-6 space-y-8 max-w-[340px] text-left">
                        
                        {/* Block 1: Weight Loss */}
                        <div className="space-y-3">
                          <h2 style={{ fontSize: '20px' }} className="font-montserrat font-bold text-white leading-tight uppercase tracking-wider">
                            weight loss<br />peptides<br />switzerland
                          </h2>
                          <p style={{ fontSize: '14px' }} className="text-white/85 font-sans leading-relaxed font-medium">
                            Looking for weight loss peptides in Switzerland? Peptides like Retatrutide, Tirzepatide, Wegovy, and Saxenda offer great support for your weight loss journey. Also, With competitive Retatrutide price and Tirzepatide Switzerland price, these peptides help with appetite control and metabolism. Wegovy Switzerland is known for long-term weight management, while Saxenda price offers an affordable option for reducing hunger. Shop now for the best weight loss peptides in Switzerland!
                          </p>
                        </div>

                        {/* Full-width white line separator exactly as requested to divide the text columns cleanly */}
                        <div className="border-t border-white/40 w-full my-6"></div>

                        {/* Block 2: Muscle Building */}
                        <div className="space-y-3">
                          <h2 style={{ fontSize: '20px' }} className="font-montserrat font-bold text-white leading-tight uppercase tracking-wider">
                            Muscle<br />Building<br />Peptides /<br />Anabolic<br />Peptides
                          </h2>
                          <p style={{ fontSize: '14px' }} className="text-white/85 font-sans leading-relaxed font-medium">
                            Enhance muscle growth and recovery with powerful peptides like CJC 1295, Ipamorelin Switzerland, GHRP 6 Switzerland, and GHK Cu. These peptides stimulate growth hormone release, promoting lean muscle mass, improved strength, and faster recovery. Whether you're aiming to build muscle or boost performance, these peptides help you achieve your fitness goals efficiently. Shop now and unlock your full potential!
                          </p>
                        </div>

                      </div>

                      {/* Middle/Right: Peptides for sale on the pen body exactly matching layout & alignment to line up with the buy now buttons of Section 3 above */}
                      <div className="md:col-span-6 md:pl-16 flex flex-col items-start justify-center text-left">
                        <div className="max-w-[280px] space-y-5">
                          <h2 style={{ fontSize: '20px' }} className="font-montserrat font-bold text-white leading-tight uppercase tracking-wider">
                            peptides for<br />sale<br />switzerland
                          </h2>
                          <div className="pt-2">
                            <button
                              onClick={() => setActivePage('shop')}
                              className="px-8 py-4 bg-[#E55B4C] hover:bg-[#DE5246] hover:scale-103 text-white font-extrabold text-xs md:text-sm tracking-widest uppercase rounded-full shadow-lg hover:shadow-2xl transition-all font-sans cursor-pointer h-14 min-w-[200px] hover:bg-black border border-white/10 text-center flex items-center justify-center"
                            >
                              BROWSE PRODUCTS
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </section>

                {/* 6. SOME OF THE PEPTIDES WE SERVE SECTION (Mockup Replica with Swiss context) */}
                <section className="bg-white py-16 border-b border-gray-100">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Section Centered Heading */}
                    <h2 style={{ fontSize: '35px' }} className="font-montserrat font-bold text-center tracking-tight text-[#071F3F] uppercase mb-10">
                      Some Of The Peptides We Serve!
                    </h2>

                    {/* Blue-grey Container block styled exactly as mockup */}
                    <div className="bg-[#b4c0cb] text-[#071F3F] p-8 md:p-12 rounded-xs shadow-xs">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        
                        {/* Item 1 - Tirzepatide Swiss Price */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-5">
                          <div className="w-40 h-40 bg-white shadow-xs overflow-hidden shrink-0">
                            <img loading="lazy" 
                              src="./src/assets/images/peptides_info_vials_1780003530034.png" 
                              alt="Tirzepatide Swiss Price"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="space-y-2 text-center sm:text-left">
                            <h3 style={{ fontSize: '20px' }} className="font-montserrat font-black leading-tight text-[#071F3F] uppercase">
                              Tirzepatide<br />Swiss<br />Price
                            </h3>
                            <p style={{ fontSize: '14px' }} className="text-[#071F3F]/85 font-sans leading-relaxed">
                              If you are searching for Tirzepatide Swiss price this is a trustworthy source.
                            </p>
                          </div>
                        </div>

                        {/* Item 2 - GHK - CU */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-5">
                          <div className="w-40 h-40 bg-white shadow-xs overflow-hidden shrink-0">
                            <img loading="lazy" 
                              src="./src/assets/images/ghk_cu_best_1780031016475.png" 
                              alt="GHK - CU"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="space-y-2 text-center sm:text-left">
                            <h3 style={{ fontSize: '20px' }} className="font-montserrat font-black leading-tight text-[#071F3F] uppercase tracking-wider">
                              GHK â€“ CU
                            </h3>
                            <p style={{ fontSize: '14px' }} className="text-[#071F3F]/85 font-sans leading-relaxed">
                              We offer Ghk Cu in different concentrations. our delivery is discreet and secure.
                            </p>
                          </div>
                        </div>

                        {/* Item 3 - Retatrutide Price */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-5">
                          <div className="w-40 h-40 bg-white shadow-xs overflow-hidden shrink-0">
                            <img loading="lazy" 
                              src="./src/assets/images/retatrutide_best_1780030958269.png" 
                              alt="Retatrutide Price"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="space-y-2 text-center sm:text-left">
                            <h3 style={{ fontSize: '20px' }} className="font-montserrat font-black leading-tight text-[#071F3F] uppercase">
                              Retatrutide<br />Price
                            </h3>
                            <p style={{ fontSize: '14px' }} className="text-[#071F3F]/85 font-sans leading-relaxed">
                              Our Retatrutide price vary based on dosage and availabillity. Order from a trusted source today!
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Bottom CTA row exactly matching mockup, pulled inward */}
                    <div className="max-w-5xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between mt-12 gap-6 bg-white py-2">
                      <div className="text-center sm:text-left">
                        <h3 style={{ fontSize: '24px' }} className="font-montserrat font-bold text-[#071F3F] uppercase tracking-tight">
                          Looking For peptides In Switzerland? Order Today !
                        </h3>
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            setActivePage('shop');
                            setActiveCategory('all');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          style={{ fontSize: '17px' }}
                          className="px-10 py-3.5 bg-[#DE5246] hover:bg-black text-white font-extrabold uppercase tracking-widest rounded-full shadow-md hover:shadow-xl transition-all cursor-pointer inline-flex items-center justify-center min-w-[150px]"
                        >
                          SHOP
                        </button>
                      </div>
                    </div>

                  </div>
                </section>
              </>
            )}

            {activePage === 'shop' && (
              <ShopCatalog
                products={products}
                onProductClick={(p) => {
                  setSelectedProduct(p);
                  setActivePage('product-detail');
                }}
                onAddToCart={handleAddToCart}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            )}

            {activePage === 'product-detail' && selectedProduct && (
              <ProductDetail
                product={selectedProduct}
                coas={coas}
                onBack={() => {
                  setSelectedProduct(null);
                  setActivePage('home');
                }}
                onAddToCart={(prod, qty, customPrice) => {
                  handleAddToCart(prod, qty, customPrice);
                }}
                products={products}
                onProductClick={(p) => {
                  setSelectedProduct(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activePage === 'coas' && (
              <LabTests coas={coas} />
            )}

            {activePage === 'about' && (
              <AboutInfo onShop={() => { setActivePage('shop'); window.scrollTo({ top: 0, behavior: 'instant' }); }} />
            )}

            {activePage === 'contact' && (
              <ContactPage />
            )}

            {activePage === 'account' && (
              <AccountPortal
                currentUser={currentUser}
                orders={orders}
                onBackToCatalog={() => setActivePage('shop')}
                setActivePage={setActivePage}
                onLogout={handleLogout}
                onLoginClick={() => setLoginModalOpen(true)}
              />
            )}

            {activePage === 'docs' && (
              <DocsPortal />
            )}

            {activePage === 'checkout' && (
              <CheckoutForm
                cart={cart}
                currentUser={currentUser}
                onOrderCompleted={handleOrderCompleted}
                onBackToCatalog={() => setActivePage('shop')}
                onLoginClick={() => setLoginModalOpen(true)}
              />
            )}

            {activePage === 'cart' && (
              <CartPage
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckoutClick={handleCheckoutClick}
                onBackToCatalog={() => setActivePage('shop')}
              />
            )}

            {activePage === 'articles' && (
              <ArticleList 
                articles={ARTICLES} 
                onArticleClick={(article) => {
                  setSelectedArticle(article);
                  setActivePage('article-detail');
                }} 
              />
            )}

            {activePage === 'article-detail' && selectedArticle && (
              <ArticleDetail 
                article={selectedArticle} 
                onBack={() => setActivePage('articles')} 
              />
            )}

            {/* Seamless Simulated Backend Subdomain View */}
            {activePage === 'privacy' && (
              <PrivacyPolicy />
            )}

            {activePage === 'refund' && (
              <RefundPolicy />
            )}

            {activePage === 'admin' && (
              <AdminPortal
                products={products}
                setProducts={setProducts}
                coas={coas}
                setCoas={setCoas}
                orders={orders}
                setOrders={setOrders}
                onBackToCatalog={() => setActivePage('home')}
                onLogout={handleLogout}
              />
            )}
          </>
        )}
        </Suspense>
      </main>

      {/* Custom styled Swiss Peptides Footer (Exact image replica layout) */}
      <footer className="bg-[#031525] text-gray-300 py-16 mt-auto border-t border-gray-850" style={{ fontFamily: '"Montserrat", sans-serif' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Branding Column with Grey Custom SP Logo Badge */}
            <div className="space-y-6">
              <div className="bg-[#b3b3b3] p-5 rounded-xs w-[190px] aspect-[14/10] flex flex-col items-center justify-center relative select-none">
                <div className="text-gray-900 text-6.5xl font-serif font-black tracking-wide leading-none select-none">SP</div>
                <div className="absolute top-[52%] left-0 right-0 py-1 bg-white border-y border-gray-100 text-[9px] font-sans font-black tracking-widest text-gray-900 uppercase select-none text-center">
                  Swiss Peptides
                </div>
                <div className="text-gray-700 font-mono text-[6px] tracking-[0.22em] uppercase mt-3.5 select-none font-bold text-center">
                  BEST PEPTIDES
                </div>
              </div>
              <p className="leading-relaxed text-gray-300 max-w-xs" style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }}>
                Swiss Peptides is committed to providing high quality, laboratory-tested peptides with a strong focus on purity, transparency, and customer support you can trust
              </p>
            </div>

            {/* Products Column */}
            <div>
              <h4 className="text-white mb-5 tracking-tight font-semibold" style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '21px' }}>Product</h4>
              <ul className="space-y-3.5 text-gray-300">
                <li><button onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }} className="hover:text-[#DE5246] transition-colors cursor-pointer block text-left">Home</button></li>
                <li><button onClick={() => { setActivePage('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }} className="hover:text-[#DE5246] transition-colors cursor-pointer block text-left lowercase">peptides</button></li>
                <li><button onClick={() => { setActivePage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }} className="hover:text-[#DE5246] transition-colors cursor-pointer block text-left">About</button></li>
                <li><button onClick={() => { setActivePage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }} className="hover:text-[#DE5246] transition-colors cursor-pointer block text-left">Contact</button></li>
                <li><button onClick={() => { setActivePage('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }} className="hover:text-[#DE5246] transition-colors cursor-pointer block text-left">Shop</button></li>
                <li><button onClick={() => { setActivePage('articles'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }} className="hover:text-[#DE5246] transition-colors cursor-pointer block text-left">Articles</button></li>
                <li><button onClick={() => { setActivePage('cart'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }} className="hover:text-[#DE5246] transition-colors cursor-pointer block text-left">Cart</button></li>
                <li><button onClick={handleCheckoutClick} style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }} className="hover:text-[#DE5246] transition-colors cursor-pointer block text-left">Checkout</button></li>
                <li><button onClick={() => { setActivePage('account'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }} className="hover:text-[#DE5246] transition-colors cursor-pointer block text-left">My account</button></li>
              </ul>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 className="text-white mb-5 tracking-tight font-semibold" style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '21px' }}>Quick Links</h4>
              <ul className="space-y-3.5 text-gray-300">
                <li><button onClick={() => { setActivePage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }} className="hover:text-[#DE5246] transition-colors cursor-pointer block text-left">About Us</button></li>
                <li><button onClick={() => { setActivePage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }} className="hover:text-[#DE5246] transition-colors cursor-pointer block text-left font-bold text-[#DE5246]">Contact Us</button></li>
                <li><button onClick={() => { setActivePage('refund'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }} className="hover:text-[#DE5246] transition-colors cursor-pointer block text-left">Refund And Returns Policy</button></li>
                <li><button onClick={() => { setActivePage('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }} className="hover:text-[#DE5246] transition-colors cursor-pointer block text-left">Privacy Policy</button></li>
              </ul>
            </div>

            {/* Company Column (Reproducing EXACT duplicates visual representation) */}
            <div>
              <h4 className="text-white mb-5 tracking-tight font-semibold" style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '21px' }}>Company</h4>
              <ul className="space-y-3.5 text-gray-300">
                <li><button onClick={() => { setActivePage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }} className="hover:text-[#DE5246] transition-colors cursor-pointer block text-left">About Us</button></li>
                <li><button onClick={() => { setActivePage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }} className="hover:text-[#DE5246] transition-colors cursor-pointer block text-left">About Us</button></li>
                <li><button onClick={() => { setActivePage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }} className="hover:text-[#DE5246] transition-colors cursor-pointer block text-left">Careers</button></li>
                <li><button onClick={() => { setActivePage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }} className="hover:text-[#DE5246] transition-colors cursor-pointer block text-left">Legal</button></li>
                <li><button onClick={() => { setActivePage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }} className="hover:text-[#DE5246] transition-colors cursor-pointer block text-left text-[#DE5246]">Contact Us</button></li>
                <li><button onClick={() => { setActivePage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }} className="hover:text-[#DE5246] transition-colors cursor-pointer block text-left text-[#DE5246]">Contact Us</button></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright and Powered strip */}
          <div className="border-t border-gray-800/80 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center text-gray-400 gap-4">
            <div style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }}>Copyright Â© 2026 Buy Swiss Peptides</div>
            <div style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '15px' }}>Powered by Buy Swiss Peptides</div>
          </div>
        </div>
      </footer>

      {/* Floating direct multichat live support desk widget */}
      <ChatWidget />
    </div>
  );
}

