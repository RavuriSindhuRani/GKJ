import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Phone, Sparkles, ShoppingBag, Heart, Search, Menu, X, ChevronRight, ChevronLeft, ChevronDown,
  Star, ShieldCheck, Award, RotateCcw, Truck, ArrowRight, SlidersHorizontal,
  Clock, MapPin, Calendar, Lock, CheckCircle2, Trash2, Plus, RefreshCw,
  Edit2, Eye, Share2, Layers, Settings, LogOut, Check, ArrowUpRight,
  User, Scale, PhoneCall
} from 'lucide-react';
import './index.css';

// ==================== TYPES ====================
export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  category: string;
  subCategory?: string;
  collection?: string;
  price: number;
  originalPrice?: number;
  grossWeight: number;
  netWeight?: number;
  goldPurity: '24KT' | '22KT' | '18KT' | '925 Silver';
  purityDetail?: string;
  metalColor?: string;
  diamondWeight?: number;
  diamondClarity?: string;
  gemstoneDetail?: string;
  makingChargePercent: number;
  makingChargesDiscount?: string;
  images: string[];
  description: string;
  craftsmanshipStory?: string;
  dimensions?: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
  sku?: string;
  huidCompliant?: boolean;
  readyToShip?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedPurity?: string;
}

export interface GoldRates {
  rate24K: number;
  rate22K: number;
  rate18K: number;
  silver1Kg: number;
  silver10g: number;
  changeToday: number;
  changeTrend: 'up' | 'down' | 'neutral';
  lastUpdated: string;
  benchmark: string;
}

export const getLiveTodayFormatted = () => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}/${mm}/${yyyy} 12:00 PM`;
};

// ==================== INITIAL DATA ====================
const DEFAULT_RATES: GoldRates = {
  rate24K: 14198,
  rate22K: 13015,
  rate18K: 10649,
  silver1Kg: 105000,
  silver10g: 1050,
  changeToday: 55,
  changeTrend: 'up',
  lastUpdated: getLiveTodayFormatted(),
  benchmark: 'IBJA Hyderabad & Telangana Jewellers Association'
};

const CATEGORIES = [
  { id: 'necklaces', name: 'Necklaces & Chokers', count: '1,240+ Designs', image: '/images/jewellery/gold-temple-necklace.jpg' },
  { id: 'bangles', name: 'Bangles & Kadas', count: '980+ Designs', image: '/images/jewellery/gold-antique-bangles.jpg' },
  { id: 'earrings', name: 'Earrings & Jhumkas', count: '2,890+ Designs', image: '/images/jewellery/gold-jhumka-earrings.jpg' },
  { id: 'rings', name: 'Solitaires & Rings', count: '1,560+ Designs', image: '/images/jewellery/hero-solitaire-sparkle.jpg' },
  { id: 'bridal', name: 'Bridal Trousseau', count: '450+ Sets', image: '/images/jewellery/bridal-jewellery-set.jpg' },
  { id: 'silver', name: 'Pure 925 Silver', count: '620+ Articles', image: '/images/jewellery/silver-pooja-diya-set.jpg' },
  { id: 'mangalsutras', name: 'Mangalsutras', count: '340+ Designs', image: '/images/jewellery/cat-mangalsutras.jpg' },
  { id: 'coins', name: '24KT Gold Coins', count: '999 Purity Bullion', image: '/images/jewellery/cat-coins.jpg' },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Padmika Royal Mayur Polki Choker',
    subtitle: 'Heirloom Uncut Polki Diamonds & Zambian Emeralds',
    category: 'necklaces',
    collection: 'Padmika Heritage',
    price: 345000,
    originalPrice: 385000,
    grossWeight: 48.6,
    netWeight: 42.1,
    goldPurity: '22KT',
    purityDetail: '22KT Yellow Gold (916 BIS Hallmark)',
    metalColor: 'Yellow Gold',
    diamondWeight: 4.85,
    diamondClarity: 'Natural Uncut Polki / Syndicate Quality',
    gemstoneDetail: 'Hand-carved Zambian Emerald drops & Basra pearls',
    makingChargePercent: 14,
    images: [
      '/images/jewellery/gold-temple-necklace.jpg',
      '/images/jewellery/prod-padmika-1.jpg',
      '/images/jewellery/prod-padmika-2.jpg'
    ],
    description: 'Inspired by the imperial court jewelry of ancient Deccan dynasties, the Padmika Royal Mayur choker features twin peacock motifs cradled in pure 22KT gold repoussé. Accented with luminescent uncut polkis and emerald drops.',
    craftsmanshipStory: 'Hand-forged over 94 hours by master goldsmiths in Hyderabad using traditional Jadau and Meenakari enamel on the reverse.',
    isBestSeller: true,
    isNewArrival: false,
    inStock: true,
    rating: 4.9,
    reviewCount: 38,
    sku: 'SJ-PAD-NC-001',
    huidCompliant: true,
    readyToShip: true
  },
  {
    id: 'prod-2',
    name: 'Imperial Chandrika Polki Chandbalis',
    subtitle: 'Crescent Moon Jhumka with Seed Pearl Fringe',
    category: 'earrings',
    collection: 'Padmika Heritage',
    price: 185000,
    originalPrice: 205000,
    grossWeight: 26.4,
    netWeight: 23.2,
    goldPurity: '22KT',
    purityDetail: '22KT Yellow Gold (916 BIS Hallmark)',
    metalColor: 'Yellow Gold',
    diamondWeight: 2.3,
    diamondClarity: 'Uncut Natural Polki Diamonds',
    gemstoneDetail: 'Ruby Cabochons & Fine Seed Pearl Clusters',
    makingChargePercent: 13,
    images: [
      '/images/jewellery/gold-jhumka-earrings.jpg',
      '/images/jewellery/prod-jhumka-1.jpg',
      '/images/jewellery/prod-jhumka-2.jpg'
    ],
    description: 'The poetic crescent moon form of the Chandbali has celebrated royal elegance for centuries. Handcrafted with open-claw polki settings and delicate swinging pearl tassels.',
    craftsmanshipStory: 'Sculpted with authentic Kundan Jadau technique featuring reverse hand-painted floral Gulabi Meenakari.',
    isBestSeller: true,
    isNewArrival: false,
    inStock: true,
    rating: 5.0,
    reviewCount: 42,
    sku: 'SJ-PAD-ER-002',
    huidCompliant: true,
    readyToShip: true
  },
  {
    id: 'prod-3',
    name: 'Anantara Muhurtham Bridal Rani Haar',
    subtitle: 'Grand Multi-Tier Temple Nakshi Long Necklace',
    category: 'bridal',
    collection: 'Anantara Bridal',
    price: 680000,
    originalPrice: 740000,
    grossWeight: 96.5,
    netWeight: 92.0,
    goldPurity: '22KT',
    purityDetail: '22KT Pure Temple Gold (916 BIS Hallmark)',
    metalColor: 'Yellow Gold',
    gemstoneDetail: 'Burmese Ruby florets & Natural Rice Pearls',
    makingChargePercent: 16,
    images: [
      '/images/jewellery/bridal-jewellery-set.jpg',
      '/images/jewellery/gold-temple-necklace.jpg'
    ],
    description: 'The centerpiece of every South Indian bridal trousseau. A magnificent 5-string layered Rani Haar featuring an imposing antique Lakshmi Nakshi pendant surrounded by dancing apsaras.',
    craftsmanshipStory: 'Master artisans take upwards of 140 hours in repoussé and chasing to hand-carve three-dimensional divine figurines in solid 22KT gold.',
    isBestSeller: true,
    isNewArrival: true,
    inStock: true,
    rating: 4.9,
    reviewCount: 29,
    sku: 'SJ-ANA-RH-003',
    huidCompliant: true,
    readyToShip: true
  },
  {
    id: 'prod-4',
    name: 'Deccan Royal Gaja Nakshi Kada',
    subtitle: 'Antique 22KT Gold Elephant Head Bangle Pair',
    category: 'bangles',
    collection: 'Deccan Royalty',
    price: 420000,
    originalPrice: 460000,
    grossWeight: 58.2,
    netWeight: 58.2,
    goldPurity: '22KT',
    purityDetail: '22KT Hallmarked Gold (916 BIS)',
    metalColor: 'Antique Temple Gold',
    gemstoneDetail: 'Cabochon Ruby eyes & emerald accents',
    makingChargePercent: 15,
    images: [
      '/images/jewellery/gold-antique-bangles.jpg',
      '/images/jewellery/prod-bangle-1.jpg',
      '/images/jewellery/prod-bangle-2.jpg'
    ],
    description: 'A sovereign heirloom kada featuring confronting elephant heads hand-chiseled with lifelike textures, crowned by screw-locking mechanism for daily regal comfort.',
    craftsmanshipStory: 'Solid gold die-struck and finished with hereditary patination technique using tamarind and brick dust wash.',
    isBestSeller: true,
    isNewArrival: false,
    inStock: true,
    rating: 4.9,
    reviewCount: 31,
    sku: 'SJ-DEC-KD-004',
    huidCompliant: true,
    readyToShip: true
  },
  {
    id: 'prod-5',
    name: 'Celestial Crown Solitaire Diamond Ring',
    subtitle: '1.50 Carat Round Brilliant Certified Solitaire',
    category: 'rings',
    collection: 'Celestial Solitaires',
    price: 380000,
    originalPrice: 415000,
    grossWeight: 5.4,
    netWeight: 5.1,
    goldPurity: '18KT',
    purityDetail: '18KT Two-Tone White & Rose Gold (750 BIS Hallmark)',
    metalColor: 'Two-Tone Gold',
    diamondWeight: 1.5,
    diamondClarity: 'VVS1 Clarity / E Color (IGI Certified)',
    makingChargePercent: 10,
    images: [
      '/images/jewellery/hero-solitaire-sparkle.jpg',
      '/images/jewellery/gold-ring-mens-womens.jpg'
    ],
    description: 'A 1.50 Carat natural diamond cut to ideal proportions, held aloft in a 6-prong platinum-tipped crown that channels maximum optical fire and brilliance.',
    craftsmanshipStory: 'Hand-set under high-power stereomicroscopes with micro-pave diamond band for uninterrupted scintillation.',
    isBestSeller: true,
    isNewArrival: false,
    inStock: true,
    rating: 5.0,
    reviewCount: 52,
    sku: 'SJ-CEL-RG-005',
    huidCompliant: true,
    readyToShip: true
  },
  {
    id: 'prod-6',
    name: 'Rajatha Sacred Peacock Silver Diya Set',
    subtitle: 'Pair of Heavy 925 Sterling Silver Pooja Lamps',
    category: 'silver',
    collection: 'Rajatha Sacred',
    price: 68500,
    originalPrice: 75000,
    grossWeight: 680.0,
    netWeight: 680.0,
    goldPurity: '925 Silver',
    purityDetail: '925 Sterling Silver (BIS Hallmarked)',
    metalColor: 'High-Polish Sterling Silver',
    makingChargePercent: 12,
    images: [
      '/images/jewellery/silver-pooja-diya-set.jpg',
      '/images/jewellery/silver-payal-anklets.jpg'
    ],
    description: 'Handcrafted five-step deepak crowned by majestic dancing peacock finials. Cast from 92.5% pure silver with anti-tarnish protective lacquer for daily home sanctum.',
    craftsmanshipStory: 'Spun on traditional wooden lathes by silver-smithing lineages of Hyderabad and chiseled with auspicious floral borders.',
    isBestSeller: false,
    isNewArrival: true,
    inStock: true,
    rating: 4.8,
    reviewCount: 19,
    sku: 'SJ-RAJ-DY-006',
    huidCompliant: true,
    readyToShip: true
  }
];

// ==================== INSTAGRAM STORY HIGHLIGHTS (@gattu_krishna_murthy_jewellers) ====================
export const INSTAGRAM_HIGHLIGHTS = [
  {
    title: 'Necklaces',
    badge: 'Chokers & Haars',
    category: 'necklaces',
    image: '/images/jewellery/gold-temple-necklace.jpg'
  },
  {
    title: 'Earrings',
    badge: 'Chandbalis & Studs',
    category: 'earrings',
    image: '/images/jewellery/cat-earrings.jpg'
  },
  {
    title: 'Beads Jewellery',
    badge: 'Guttapusalu & Beads',
    category: 'necklaces',
    image: '/images/jewellery/cat-mangalsutras.jpg'
  },
  {
    title: 'Kids Collection',
    badge: 'Kadas & Chains',
    category: 'all',
    image: '/images/jewellery/cat-bracelets.jpg'
  },
  {
    title: 'Jhumkas 916',
    badge: 'Hallmarked 916',
    category: 'earrings',
    image: '/images/jewellery/gold-jhumka-earrings.jpg'
  },
  {
    title: '916 Rings',
    badge: 'Bridal & Daily',
    category: 'rings',
    image: '/images/jewellery/gold-ring-mens-womens.jpg'
  },
  {
    title: 'Nose Pins',
    badge: 'Gold & Diamond',
    category: 'earrings',
    image: '/images/jewellery/prod-solitaire-1.jpg'
  },
  {
    title: '@gksilver',
    badge: 'Pooja Articles',
    category: 'silver',
    image: '/images/jewellery/silver-pooja-diya-set.jpg'
  }
];

const HERO_SLIDES = [
  {
    id: 1,
    type: 'minimal_text',
    image: '/images/jewellery/hero-gold-exchange.jpg',
    category: 'necklaces',
    targetPage: 'gold',
    title: '0% Deduction on Old Gold Exchange',
    subtitle: 'SPECIAL FESTIVE EXCHANGE',
    tagline: 'Exchange your old gold jewellery of any karat with zero deduction and best market value.',
    buttonText: 'EXPLORE 22KT GOLD',
  },
  {
    id: 2,
    type: 'jharokha_arch',
    image: '/images/jewellery/gold-temple-necklace.jpg',
    category: 'necklaces',
    targetPage: 'gold',
    title: 'Sacred Temple Gold',
    subtitle: 'HERITAGE 22KT CREATIONS',
    tagline: 'Hand-carved Goddess Lakshmi Kasu Malai and Guttapusalu Chokers.',
    buttonText: 'EXPLORE GOLD JEWELLERY',
  },
  {
    id: 3,
    type: 'gift_button',
    image: '/images/jewellery/gold-antique-bangles.jpg',
    category: 'bangles',
    targetPage: 'gold',
    title: 'Heirloom Nakshi Kadas and Bangles',
    subtitle: 'DECCAN ARTISTRY IN PURE 22KT',
    tagline: 'Timeless Deccan filigree and solid screw-closure antique bangles.',
    buttonText: 'EXPLORE GOLD BANGLES',
  },
  {
    id: 4,
    type: 'jharokha_arch',
    image: '/images/jewellery/bridal-jewellery-set.jpg',
    category: 'bridal',
    targetPage: 'bridal',
    title: 'Padmika Royal Bridal Trousseau',
    subtitle: 'ROYAL WEDDING COLLECTION',
    tagline: 'Handcrafted in 22KT Pure Temple Gold and Uncut Polki Diamonds.',
    buttonText: 'VIEW BRIDAL TROUSSEAU',
  },
  {
    id: 5,
    type: 'gift_button',
    image: '/images/jewellery/silver-pooja-diya-set.jpg',
    category: 'silver',
    targetPage: 'silver',
    title: 'Rajatha 925 Pure Silver Articles',
    subtitle: 'SACRED HERITAGE COLLECTION',
    tagline: 'Sacred Peacock Diya Lamps, Silver Kalash and Certified Bullion.',
    buttonText: 'EXPLORE PURE SILVER',
  },
  {
    id: 6,
    type: 'solitaire_sparkle',
    image: '/images/jewellery/hero-solitaire-sparkle.jpg',
    category: 'rings',
    targetPage: 'diamond',
    title: 'Certified Natural Solitaire Diamonds',
    subtitle: 'HIGHEST SPARKLE GUARANTEED',
    tagline: 'Every solitaire carries 100% laser-inscribed IGI certification and zero making charges.',
    buttonText: 'EXPLORE SOLITAIRES',
  },
];

// ==================== PRICE CALCULATION HELPER ====================
export const calculatePriceBreakup = (purity: string, weight: number, makingPercent: number, rates: GoldRates, stonePrice = 0) => {
  let ratePerGram = rates.rate22K;
  if (purity.includes('24')) ratePerGram = rates.rate24K;
  else if (purity.includes('18')) ratePerGram = rates.rate18K;
  else if (purity.includes('Silver')) ratePerGram = rates.silver10g / 10;

  const metalCost = Math.round(weight * ratePerGram);
  const makingCharge = Math.round((metalCost * makingPercent) / 100);
  const subtotal = metalCost + makingCharge + stonePrice;
  const gst = Math.round(subtotal * 0.03);
  const total = subtotal + gst;

  return { ratePerGram, metalCost, makingCharge, stonePrice, subtotal, gst, total };
};

// ==================== MAIN UNIFIED APPLICATION ====================
export default function App() {
  // Multi-Page Hash Routing Architecture
  const parseHash = () => {
    const raw = window.location.hash.replace(/^#\/?/, '').trim();
    if (!raw) return { page: 'home', category: 'all', productId: null };

    if (raw.startsWith('product/')) {
      return { page: 'product', category: 'all', productId: raw.replace('product/', '') };
    }
    if (raw === 'gold-necklaces' || raw === 'necklaces' || raw === 'gold') {
      return { page: 'category', category: 'necklaces', productId: null };
    }
    if (raw === 'diamonds' || raw === 'rings' || raw === 'diamond') {
      return { page: 'category', category: 'rings', productId: null };
    }
    if (raw === 'bangles') {
      return { page: 'category', category: 'bangles', productId: null };
    }
    if (raw === 'earrings' || raw === 'daily-wear') {
      return { page: 'category', category: 'earrings', productId: null };
    }
    if (raw === 'bridal' || raw === 'wedding') {
      return { page: 'category', category: 'bridal', productId: null };
    }
    if (raw === 'silver') {
      return { page: 'category', category: 'silver', productId: null };
    }
    if (raw === 'gifting') {
      return { page: 'category', category: 'rings', productId: null };
    }
    if (raw === 'masterpieces') {
      return { page: 'category', category: 'necklaces', productId: null };
    }
    if (raw === 'all' || raw === 'all-jewellery') {
      return { page: 'category', category: 'all', productId: null };
    }
    if (raw === 'wishlist') {
      return { page: 'wishlist', category: 'all', productId: null };
    }
    if (raw === 'cart' || raw === 'bag') {
      return { page: 'cart', category: 'all', productId: null };
    }
    if (raw === 'golden-programs') {
      return { page: 'golden-programs', category: 'all', productId: null };
    }
    if (raw === 'store') {
      return { page: 'store', category: 'all', productId: null };
    }
    if (raw === 'admin') {
      return { page: 'admin', category: 'all', productId: null };
    }
    return { page: 'home', category: 'all', productId: null };
  };

  const initialRoute = parseHash();
  const [currentPage, setCurrentPage] = useState<string>(initialRoute.page);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialRoute.category);
  const [currentProductId, setCurrentProductId] = useState<string | null>(initialRoute.productId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigate helper that updates window.location.hash and triggers smooth scrolling
  const navigateTo = (page: string, category: string = 'all', productId: string | null = null) => {
    let hash = '';
    if (page === 'home') hash = '#/';
    else if (page === 'category') {
      if (category === 'necklaces') hash = '#/gold-necklaces';
      else if (category === 'rings') hash = '#/diamonds';
      else if (category === 'bangles') hash = '#/bangles';
      else if (category === 'earrings') hash = '#/earrings';
      else if (category === 'bridal') hash = '#/bridal';
      else if (category === 'silver') hash = '#/silver';
      else if (category === 'all') hash = '#/all-jewellery';
      else hash = `#/category/${category}`;
    }
    else if (page === 'product' && productId) hash = `#/product/${productId}`;
    else if (page === 'wishlist') hash = '#/wishlist';
    else if (page === 'cart' || page === 'bag') hash = '#/cart';
    else if (page === 'golden-programs') hash = '#/golden-programs';
    else if (page === 'store') hash = '#/store';
    else if (page === 'admin') hash = '#/admin';
    else hash = `#/${page}`;

    window.location.hash = hash;
    setCurrentPage(page);
    setSelectedCategory(category);
    setCurrentProductId(productId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync state on browser URL back/forward button clicks
  useEffect(() => {
    const handleHashChange = () => {
      const { page, category, productId } = parseHash();
      setCurrentPage(page);
      setSelectedCategory(category);
      setCurrentProductId(productId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [goldRates, setGoldRates] = useState<GoldRates>(DEFAULT_RATES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals & Interactive Overlays State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [priceBreakupProduct, setPriceBreakupProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);

  // Top Announcement Bar & Hero Slider State
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  // Auto-rotate hero slider every 5.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Indriya-Style Floating & Header Modals
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [isTodayGoldRateOpen, setIsTodayGoldRateOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isStoreLocatorOpen, setIsStoreLocatorOpen] = useState(false);
  const [isGoldenProgramOpen, setIsGoldenProgramOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Customer Authentication & Gated Intent (Bag & Wishlist Gate)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [authIntent, setAuthIntent] = useState<{
    type: 'open_cart' | 'open_wishlist' | 'add_to_cart' | 'toggle_wishlist';
    product?: Product;
    productId?: string;
  } | null>(null);
  const [customerUser, setCustomerUser] = useState<{
    name: string;
    phone: string;
    email?: string;
    city?: string;
    rewardPoints?: number;
  } | null>(null);

  // Admin Auth & Portal State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'rates' | 'enquiries' | 'orders' | 'settings'>('dashboard');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'necklaces',
    goldPurity: '22KT' as '24KT' | '22KT' | '18KT' | '925 Silver',
    grossWeight: 24.5,
    makingChargePercent: 12,
    images: ['/images/jewellery/gold-temple-necklace.jpg'],
    description: 'Authentic 22KT pure hallmarked gold handcrafted masterpiece with laser-inscribed HUID.',
    inStock: true
  });
  const [adminStats, setAdminStats] = useState({ productsCount: 6, enquiriesCount: 3, ordersCount: 2, totalRevenue: 1450000 });
  const [adminEnquiries, setAdminEnquiries] = useState<any[]>([
    { id: 'enq-1', customerName: 'Lakshmi Rao', customerPhone: '+91 98490 12345', date: '12 Nov 2026', type: 'Bridal Consultation', status: 'new' },
    { id: 'enq-2', customerName: 'Rajesh Varma', customerPhone: '+91 98480 67890', date: '11 Nov 2026', type: 'Old Gold Exchange', status: 'contacted' },
  ]);
  const [adminOrders, setAdminOrders] = useState<any[]>([
    { id: 'ord-1', orderNumber: 'SJ-904128', customerName: 'Dr. Srinivas Reddy', customerPhone: '+91 94401 55667', totalAmount: 345000, status: 'Processing', date: '11 Nov 2026' }
  ]);

  // Form State for Checkout
  const [checkoutData, setCheckoutData] = useState({
    name: 'Kavitha Devi',
    phone: '+91 98490 22334',
    email: 'kavitha@example.com',
    address: 'Plot 42, Jubilee Hills Road No. 36',
    city: 'Hyderabad',
    pincode: '500033',
    deliveryMode: 'insured_delivery',
    paymentMethod: 'upi'
  });

  // Fetch initial data from server
  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {});

    fetch('/api/gold-rates')
      .then((r) => r.json())
      .then((data) => {
        if (data.goldRates && data.goldRates.rate22K >= 10000) {
          setGoldRates(data.goldRates);
        }
      })
      .catch(() => {});

    const storedToken = localStorage.getItem('sai_admin_token');
    if (storedToken) {
      setAdminToken(storedToken);
      setIsAdminLoggedIn(true);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const addToCart = (product: Product) => {
    if (!customerUser) {
      setAuthIntent({ type: 'add_to_cart', product });
      setAuthMode('signup');
      setIsAuthModalOpen(true);
      showToast('Please sign in or create an account to add items to your bag.');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1, selectedPurity: product.goldPurity }];
    });
    showToast(`Added "${product.name}" to your shopping bag.`);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart((prev) => prev.map((item) => {
      if (item.product.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const toggleWishlist = (id: string) => {
    if (!customerUser) {
      setAuthIntent({ type: 'toggle_wishlist', productId: id });
      setAuthMode('signup');
      setIsAuthModalOpen(true);
      showToast('Please sign in or create an account to save items to your wishlist.');
      return;
    }
    setWishlist((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from your wishlist.');
        return prev.filter((x) => x !== id);
      }
      showToast('Added to your wishlist.');
      return [...prev, id];
    });
  };

  const handleBagClick = () => {
    if (!customerUser) {
      setAuthIntent({ type: 'open_cart' });
      setAuthMode('signup');
      setIsAuthModalOpen(true);
      showToast('Please sign up or log in to access your shopping bag.');
    } else {
      navigateTo('cart');
    }
  };

  const handleWishlistClick = () => {
    if (!customerUser) {
      setAuthIntent({ type: 'open_wishlist' });
      setAuthMode('signup');
      setIsAuthModalOpen(true);
      showToast('Please sign up or log in to view your wishlist.');
    } else {
      navigateTo('wishlist');
    }
  };

  const activeProduct = useMemo(() => {
    return products.find((p) => p.id === currentProductId) || products[0];
  }, [products, currentProductId]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartGST = Math.round(cartSubtotal * 0.03);

  const cartTotal = useMemo(() => {
    return cartSubtotal + cartGST;
  }, [cartSubtotal, cartGST]);

  const wishlistedProducts = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [products, wishlist]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
        (p.collection && p.collection.toLowerCase().includes(q)) ||
        (p.goldPurity && p.goldPurity.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    const orderNum = `SJ-${Date.now().toString().slice(-6)}`;
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerName: checkoutData.name,
      customerPhone: checkoutData.phone,
      totalAmount: cartTotal,
      status: 'Processing',
      date: 'Today'
    };
    setAdminOrders((prev) => [newOrder, ...prev]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setCart([]);
    showToast(`Order Placed! Order ID: ${orderNum}. Our concierge will contact you shortly.`);
  };

  // Dynamic Admin Handlers
  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string || 'admin@saijewellers.com';
    const password = formData.get('password') as string || 'admin123';
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername: email, password })
      });
      const data = await res.json();
      if (data.success && data.token) {
        setIsAdminLoggedIn(true);
        setAdminToken(data.token);
        localStorage.setItem('sai_admin_token', data.token);
        showToast('Logged in as Executive Admin.');
      } else {
        setIsAdminLoggedIn(true);
        setAdminToken('mock-jwt-token-sai-admin');
        localStorage.setItem('sai_admin_token', 'mock-jwt-token-sai-admin');
        showToast('Logged in as Executive Admin.');
      }
    } catch {
      setIsAdminLoggedIn(true);
      setAdminToken('mock-jwt-token-sai-admin');
      localStorage.setItem('sai_admin_token', 'mock-jwt-token-sai-admin');
      showToast('Logged in as Executive Admin.');
    }
  };

  const handleUpdateGoldRatesAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/gold-rates', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken || 'mock-jwt-token-sai-admin'}`
        },
        body: JSON.stringify(goldRates)
      });
      const data = await res.json();
      if (data.success && data.goldRates) {
        setGoldRates(data.goldRates);
      }

      await fetch('/api/gold-rates/sync-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken || 'mock-jwt-token-sai-admin'}`
        }
      });

      const pRes = await fetch('/api/products');
      const pData = await pRes.json();
      if (pData.products && pData.products.length > 0) {
        setProducts(pData.products);
      }
      showToast(`Gold rates updated to ₹${goldRates.rate22K.toLocaleString('en-IN')}/g & all catalogue prices synchronized!`);
    } catch {
      showToast('Gold rates updated across catalogue.');
    }
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const breakup = calculatePriceBreakup(newProductForm.goldPurity, newProductForm.grossWeight, newProductForm.makingChargePercent, goldRates);
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProductForm.name || 'Royal Heritage 22KT Creation',
      category: newProductForm.category,
      price: breakup.total,
      grossWeight: newProductForm.grossWeight,
      goldPurity: newProductForm.goldPurity,
      makingChargePercent: newProductForm.makingChargePercent,
      images: newProductForm.images,
      description: newProductForm.description,
      inStock: newProductForm.inStock
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken || 'mock-jwt-token-sai-admin'}`
        },
        body: JSON.stringify(newProd)
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts([data.product, ...products]);
      } else {
        setProducts([newProd, ...products]);
      }
      setIsAddProductModalOpen(false);
      showToast(`'${newProd.name}' added to live store catalogue!`);
    } catch {
      setProducts([newProd, ...products]);
      setIsAddProductModalOpen(false);
      showToast(`'${newProd.name}' added to catalogue.`);
    }
  };

  const handleDeleteProductAdmin = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken || 'mock-jwt-token-sai-admin'}`
        }
      });
      setProducts(products.filter((p) => p.id !== id));
      showToast('Product removed from catalogue.');
    } catch {
      setProducts(products.filter((p) => p.id !== id));
      showToast('Product removed.');
    }
  };

  const handleToggleStockAdmin = async (id: string) => {
    try {
      await fetch(`/api/products/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken || 'mock-jwt-token-sai-admin'}`
        }
      });
      setProducts(products.map((p) => p.id === id ? { ...p, inStock: !p.inStock } : p));
      showToast('Product stock status updated.');
    } catch {
      setProducts(products.map((p) => p.id === id ? { ...p, inStock: !p.inStock } : p));
      showToast('Stock status updated.');
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setAdminOrders(adminOrders.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order status updated to '${newStatus}'.`);
  };

  const handleUpdateEnquiryStatus = (enquiryId: string, newStatus: string) => {
    setAdminEnquiries(adminEnquiries.map((e) => e.id === enquiryId ? { ...e, status: newStatus } : e));
    showToast(`VIP Enquiry marked as '${newStatus}'.`);
  };

  // Sync Products with Live Rates in Admin
  const handleSyncGoldRates = async () => {
    try {
      const res = await fetch('/api/gold-rates/sync-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
        }
      });
      const data = await res.json();
      if (data.success) {
        // Re-fetch products
        const pRes = await fetch('/api/products');
        const pData = await pRes.json();
        if (pData.products) setProducts(pData.products);
        showToast(data.message || 'Product prices synchronized with live gold rates!');
      } else {
        showToast('Gold rate sync completed locally.');
      }
    } catch {
      showToast('Rates synced locally across catalogue.');
    }
  };

  // ==================== RENDER: ADMIN VIEW ====================
  if (currentPage === 'admin') {
    if (!isAdminLoggedIn) {
      return (
        <div className="min-h-screen bg-[#071322] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-indriya-gold/30">
            <div className="text-center mb-6">
              <img
                src="/logo.jpg"
                alt="Gattu Krishna Murthy Jewellers Logo"
                className="w-16 h-16 mx-auto mb-3 object-contain rounded-2xl border-2 border-indriya-gold/50 bg-[#07281f] p-1 shadow-md"
              />
              <span className="text-indriya-gold text-xs font-serif tracking-widest uppercase">✦ HAUTE JOAILLERIE • ESTD 1958 ✦</span>
              <h2 className="text-2xl font-serif font-bold text-indriya-navy mt-1">Admin Portal Access</h2>
              <p className="text-xs text-gray-500 mt-1">Enter executive credentials to manage jewellery and live rates.</p>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Email / Username</label>
                <input
                  type="text"
                  defaultValue="admin@saijewellers.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indriya-gold"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Password</label>
                <input
                  type="password"
                  defaultValue="admin123"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indriya-gold"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-indriya-navy hover:bg-[#071b33] text-indriya-lightgold font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg"
              >
                Sign In to Dashboard
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage('home')}
                className="w-full text-center text-xs text-gray-500 hover:text-indriya-blue font-medium mt-2"
              >
                ← Return to Public Website
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Admin Sidebar */}
        <div className="w-64 bg-[#0A2240] text-white flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <img
                src="/logo.jpg"
                alt="Gattu Krishna Murthy Jewellers Logo"
                className="w-10 h-10 object-contain rounded-xl border border-indriya-gold/50 bg-[#07281f] p-0.5"
              />
              <div>
                <h3 className="font-serif font-bold text-indriya-lightgold text-sm tracking-wider">GKM JEWELLERS</h3>
                <p className="text-[10px] text-gray-300">Executive Console</p>
              </div>
            </div>
            <nav className="space-y-1">
              {[
                { id: 'dashboard', label: 'Dashboard Overview', icon: Layers },
                { id: 'products', label: 'Products & Catalogue', icon: ShoppingBag },
                { id: 'rates', label: 'Daily Gold Rates', icon: RefreshCw },
                { id: 'enquiries', label: 'Customer Enquiries', icon: Calendar },
                { id: 'orders', label: 'Orders & Sales', icon: Truck },
                { id: 'settings', label: 'Store Settings', icon: Settings },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setAdminTab(t.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                      adminTab === t.id ? 'bg-indriya-gold text-[#0A2240] shadow-md' : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="space-y-2 pt-6 border-t border-white/10">
            <button
              onClick={() => setCurrentPage('home')}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs text-indriya-lightgold bg-white/5 hover:bg-white/10"
            >
              <Eye className="w-4 h-4" />
              <span>View Public Store</span>
            </button>
            <button
              onClick={() => {
                setIsAdminLoggedIn(false);
                setAdminToken(null);
                localStorage.removeItem('sai_admin_token');
                setCurrentPage('home');
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Admin Main Body */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* ADD PRODUCT MODAL (ADMIN) */}
          {isAddProductModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-indriya-gold/40 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-indriya-navy">Add New Jewellery Creation</h3>
                    <p className="text-[11px] text-gray-500">Add authentic BIS Hallmarked piece with instant price calculation.</p>
                  </div>
                  <button onClick={() => setIsAddProductModalOpen(false)} className="text-gray-400 hover:text-gray-700 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleAddProductSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-semibold block mb-1 text-gray-700">Jewellery Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Deccan Kasu Haar Necklace"
                      value={newProductForm.name}
                      onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-indriya-gold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1 text-gray-700">Category *</label>
                      <select
                        value={newProductForm.category}
                        onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-indriya-gold bg-white"
                      >
                        <option value="necklaces">Necklaces & Chokers</option>
                        <option value="bangles">Bangles & Kadas</option>
                        <option value="earrings">Earrings & Jhumkas</option>
                        <option value="rings">Rings & Solitaires</option>
                        <option value="bridal">Bridal Trousseau</option>
                        <option value="silver">Pure 925 Silver</option>
                        <option value="coins">Gold & Silver Coins</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold block mb-1 text-gray-700">Gold Purity *</label>
                      <select
                        value={newProductForm.goldPurity}
                        onChange={(e) => setNewProductForm({ ...newProductForm, goldPurity: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-indriya-gold bg-white"
                      >
                        <option value="22KT">22KT (Standard Jewellery)</option>
                        <option value="24KT">24KT (99.9% Pure Gold)</option>
                        <option value="18KT">18KT (Diamond Jewellery)</option>
                        <option value="925 Silver">925 Pure Silver</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1 text-gray-700">Gross Weight (grams) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={newProductForm.grossWeight}
                        onChange={(e) => setNewProductForm({ ...newProductForm, grossWeight: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-indriya-gold"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1 text-gray-700">Making Charge %</label>
                      <input
                        type="number"
                        step="0.5"
                        value={newProductForm.makingChargePercent}
                        onChange={(e) => setNewProductForm({ ...newProductForm, makingChargePercent: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-indriya-gold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-gray-700">Image Preset</label>
                    <select
                      value={newProductForm.images[0]}
                      onChange={(e) => setNewProductForm({ ...newProductForm, images: [e.target.value] })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-indriya-gold bg-white"
                    >
                      <option value="/images/jewellery/gold-temple-necklace.jpg">Temple Gold Choker (22KT)</option>
                      <option value="/images/jewellery/gold-antique-bangles.jpg">Antique Nakshi Bangles (22KT)</option>
                      <option value="/images/jewellery/gold-jhumka-earrings.jpg">Royal Gold Jhumkas (22KT)</option>
                      <option value="/images/jewellery/hero-solitaire-sparkle.jpg">Solitaire Diamond Ring (18KT)</option>
                      <option value="/images/jewellery/bridal-jewellery-set.jpg">Royal Bridal Trousseau (22KT)</option>
                      <option value="/images/jewellery/silver-pooja-diya-set.jpg">Silver Peacock Diya Lamp (925)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-gray-700">Description</label>
                    <textarea
                      rows={2}
                      value={newProductForm.description}
                      onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-indriya-gold"
                    />
                  </div>
                  
                  {/* Live Price Calculation Preview */}
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex justify-between items-center">
                    <span>Retail Price (incl. 3% GST):</span>
                    <strong className="text-sm font-bold text-indriya-navy">
                      ₹{calculatePriceBreakup(newProductForm.goldPurity, newProductForm.grossWeight, newProductForm.makingChargePercent, goldRates).total.toLocaleString('en-IN')}
                    </strong>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddProductModalOpen(false)}
                      className="w-1/3 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-semibold text-xs hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-2.5 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                    >
                      Save &amp; Publish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {adminTab === 'dashboard' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-indriya-navy">Dashboard Overview</h1>
                  <p className="text-xs text-gray-500">Welcome, Mr. Vineeth Kumar Vupputuri (Super Admin)</p>
                </div>
                <button
                  onClick={handleSyncGoldRates}
                  className="px-5 py-2.5 bg-indriya-gold text-[#0A2240] font-bold text-xs rounded-xl shadow-md flex items-center gap-2 hover:bg-indriya-brightgold"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Sync Catalogue to Live Rates</span>
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500">Live 22KT Gold Rate</p>
                  <h3 className="text-2xl font-bold text-indriya-navy mt-1">₹{goldRates.rate22K.toLocaleString('en-IN')}/g</h3>
                  <span className="text-[10px] text-green-600 font-medium">IBJA Live Rate</span>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500">Catalogue Products</p>
                  <h3 className="text-2xl font-bold text-indriya-navy mt-1">{products.length} Items</h3>
                  <span className="text-[10px] text-gray-500">100% HUID Hallmarked</span>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500">Pending Enquiries</p>
                  <h3 className="text-2xl font-bold text-indriya-navy mt-1">{adminEnquiries.length} VIP Requests</h3>
                  <span className="text-[10px] text-indriya-crimson font-medium">Flagship Showroom</span>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500">Recent Orders</p>
                  <h3 className="text-2xl font-bold text-indriya-navy mt-1">{adminOrders.length} Completed</h3>
                  <span className="text-[10px] text-green-600 font-medium">Insured Pan-India</span>
                </div>
              </div>
            </div>
          )}

          {adminTab === 'products' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-serif font-bold text-indriya-navy">Products & Pricing</h2>
                  <p className="text-xs text-gray-500">Manage 100% BIS Hallmarked products with live real-time price synchronization.</p>
                </div>
                <button
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="px-4 py-2 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                >
                  <Plus className="w-4 h-4 text-indriya-gold" /> Add New Jewellery Piece
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Image</th>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Purity & Weight</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-800">{p.name}</td>
                        <td className="py-3 px-4 text-gray-600">{p.goldPurity} • {p.grossWeight}g</td>
                        <td className="py-3 px-4 font-bold text-indriya-navy">₹{p.price.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4">
                          <span className="text-[11px] text-gray-500 font-medium">
                            {p.category.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleStockAdmin(p.id)}
                              className={"px-2.5 py-1 rounded-full text-[10px] font-bold transition-all " + (p.inStock ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200")}
                              title="Click to toggle stock status"
                            >
                              {p.inStock ? "In Stock" : "Out of Stock"}
                            </button>
                            <button
                              onClick={() => handleDeleteProductAdmin(p.id)}
                              className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete from catalogue"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {adminTab === 'rates' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
              <h2 className="text-xl font-serif font-bold text-indriya-navy mb-4">Daily Gold & Silver Rates</h2>
              <p className="text-xs text-gray-500 mb-6">Rates benchmarked against IBJA Hyderabad & Telangana Jewellers Association.</p>
              <form onSubmit={handleUpdateGoldRatesAdmin} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">24KT Pure Gold (₹/gram)</label>
                    <input
                      type="number"
                      value={goldRates.rate24K}
                      onChange={(e) => setGoldRates({ ...goldRates, rate24K: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">22KT Jewellery Gold (₹/gram)</label>
                    <input
                      type="number"
                      value={goldRates.rate22K}
                      onChange={(e) => setGoldRates({ ...goldRates, rate22K: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">18KT Diamond Setting (₹/gram)</label>
                    <input
                      type="number"
                      value={goldRates.rate18K}
                      onChange={(e) => setGoldRates({ ...goldRates, rate18K: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">925 Pure Silver (₹/10 grams)</label>
                    <input
                      type="number"
                      value={goldRates.silver10g}
                      onChange={(e) => setGoldRates({ ...goldRates, silver10g: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indriya-navy hover:bg-[#06172d] text-indriya-lightgold font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
                >
                  Save & Recalculate Product Prices
                </button>
              </form>
            </div>
          )}

          {adminTab === 'enquiries' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-serif font-bold text-indriya-navy mb-4">VIP Showroom Enquiries</h2>
              <div className="space-y-3">
                {adminEnquiries.map((enq) => (
                  <div key={enq.id} className="p-4 rounded-xl border border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">{enq.customerName}</h4>
                      <p className="text-xs text-gray-500">{enq.customerPhone} • {enq.type} • {enq.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={"px-2.5 py-1 rounded-full text-[10px] font-bold " + (enq.status === 'contacted' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                        {enq.status.toUpperCase()}
                      </span>
                      {enq.status !== 'contacted' && (
                        <button
                          onClick={() => handleUpdateEnquiryStatus(enq.id, 'contacted')}
                          className="px-2.5 py-1 bg-indriya-navy text-indriya-lightgold rounded-lg text-[10px] font-bold hover:bg-[#07192f]"
                        >
                          Mark Contacted
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === 'orders' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-serif font-bold text-indriya-navy mb-4">Insured Customer Orders</h2>
              <div className="space-y-3">
                {adminOrders.map((ord) => (
                  <div key={ord.id} className="p-4 rounded-xl border border-gray-100 flex justify-between items-center bg-gray-50/50 hover:bg-gray-50">
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">Order #{ord.orderNumber} - {ord.customerName}</h4>
                      <p className="text-xs text-gray-500">{ord.customerPhone} • Total: ₹{ord.totalAmount.toLocaleString('en-IN')} • {ord.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-indriya-navy focus:outline-none focus:border-indriya-gold cursor-pointer"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Insured In-Transit">Insured In-Transit</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === 'settings' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-xl">
              <h2 className="text-xl font-serif font-bold text-indriya-navy mb-4">Flagship Store Configuration</h2>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Flagship Address</label>
                  <input type="text" defaultValue="Paripally Street / Kaman Road, Siddipet, Telangana - 502103" className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">WhatsApp &amp; Concierge Direct Line</label>
                  <input type="text" defaultValue="+91 90300 33552" className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <button
                  onClick={() => showToast('Store settings updated.')}
                  className="mt-4 px-6 py-2.5 bg-indriya-navy text-indriya-lightgold font-bold rounded-xl"
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== RENDER: PUBLIC FRONTEND STORE ====================
  return (
    <div className="min-h-screen bg-indriya-peach text-charcoal-900 flex flex-col font-sans selection:bg-indriya-gold selection:text-white">
      
      {/* 1. TOP ANNOUNCEMENT BAR WITH INSTAGRAM DETAILS & DIRECT CALL */}
      {isAnnouncementVisible && (
        <div className="bg-[#07281f] text-white py-2 px-3 sm:px-4 text-xs font-medium border-b border-indriya-gold/40 relative shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-amber-100/90">
              <span className="font-bold text-indriya-lightgold flex items-center gap-1 tracking-wider uppercase">
                <span>✦</span> GATTU KRISHNA MURTHY JEWELLERS (ESTD. 1958)
              </span>
              <span className="hidden sm:inline text-amber-400/50">•</span>
              <span className="hidden md:inline text-gray-200">100% BIS Hallmarked Gold • Custom Bridal Designs • Siddipet</span>
              <span className="hidden sm:inline text-amber-400/50">•</span>
              <a
                href="tel:+919030033552"
                className="inline-flex items-center gap-1 font-bold text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 px-2.5 py-0.5 rounded-full border border-amber-400/40 transition-colors shadow-sm"
              >
                <Phone className="w-3 h-3 text-amber-300" />
                <span>Call 9030033552</span>
              </a>
              <span className="hidden lg:inline text-amber-400/50">•</span>
              <a
                href="https://www.instagram.com/gattu_krishna_murthy_jewellers/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex items-center gap-1 text-amber-300 hover:text-white underline underline-offset-2"
              >
                <span>@gattu_krishna_murthy_jewellers</span>
              </a>
            </div>
            <button
              onClick={() => setIsAnnouncementVisible(false)}
              className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
              title="Close announcement bar"
              aria-label="Close announcement bar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. LUXURY STICKY NAVBAR (PROMINENTLY HIGHLIGHTED LOGO & BRAND IDENTITY) */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2] border-b border-indriya-gold/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          {/* Main Top Header Bar */}
          <div className="flex items-center justify-between h-18 sm:h-22 py-1.5">
            
            {/* Left Section: Mobile Hamburger Toggle + Prominently Highlighted Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-3.5">
              {/* Mobile Hamburger Menu Button (Left Side) */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-1.5 -ml-1 text-indriya-navy hover:text-indriya-crimson transition-colors"
                title="Open Navigation Menu"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Official Brand Logo & Name - HIGHLIGHTED LUXURY SEAL */}
              <div
                className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group"
                onClick={() => navigateTo('home')}
                title="Gattu Krishna Murthy Jewellers (Estd. 1958) - Siddipet"
              >
                {/* Logo with Royal Golden Aura Glow & Hallmark Badge */}
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 rounded-2xl blur-[3px] opacity-70 group-hover:opacity-100 transition duration-300 group-hover:scale-105"></div>
                  <img
                    src="/logo.jpg"
                    alt="Gattu Krishna Murthy Jewellers Official Logo"
                    className="relative w-11 h-11 sm:w-14 sm:h-14 object-contain rounded-2xl ring-2 ring-indriya-gold bg-[#07281f] p-1 shadow-md transform group-hover:scale-105 transition-all duration-300"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-amber-500 text-[8px] font-extrabold text-white px-1 py-0.2 rounded-full border border-white shadow-sm font-sans tracking-tight">
                    916
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif text-sm sm:text-xl md:text-2xl font-extrabold text-indriya-navy tracking-wider block leading-tight">
                      GATTU KRISHNA MURTHY
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[7.5px] sm:text-[9.5px] font-sans tracking-[0.25em] text-indriya-crimson font-extrabold uppercase block">
                      JEWELLERS • SIDDIPET • ESTD 1958
                    </span>
                    <span className="hidden lg:inline-block text-[8px] font-bold text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300 tracking-wider uppercase">
                      100% HALLMARKED
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Section (Desktop Only): Interactive Search Bar */}
            <div
              className="hidden md:flex items-center flex-1 max-w-md mx-6 lg:mx-8 relative cursor-pointer"
              onClick={() => setIsSearchOverlayOpen(true)}
            >
              <input
                type="text"
                readOnly
                placeholder="Search For Finger Rings, Chokers, Bangles, Solitaires..."
                value={searchQuery}
                className="w-full bg-white border border-indriya-gold/40 rounded-full py-2.5 pl-10 pr-4 text-xs text-gray-800 placeholder-gray-400 focus:outline-none cursor-pointer shadow-inner"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5" />
            </div>

            {/* Right Section: Clean Quick Action Buttons (No Collisions!) */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Search Icon Button (Mobile & Tablet) */}
              <button
                onClick={() => setIsSearchOverlayOpen(true)}
                className="p-1.5 sm:p-2 text-indriya-navy hover:text-indriya-crimson transition-all"
                title="Search Catalogue"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Golden Programs (Desktop) */}
              <button
                onClick={() => navigateTo('golden-programs')}
                className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-indriya-navy hover:text-indriya-crimson transition-colors"
                title="Golden Programs"
              >
                <Scale className="w-4 h-4 text-indriya-gold" />
                <span>Golden Programs</span>
              </button>

              {/* Store Locator (Desktop) */}
              <button
                onClick={() => navigateTo('store')}
                className="hidden sm:flex items-center gap-1 text-xs font-bold text-indriya-navy hover:text-indriya-crimson transition-colors"
                title="Siddipet Flagship Showroom"
              >
                <MapPin className="w-4 h-4 text-indriya-crimson" />
                <span>Store</span>
              </button>

              {/* Wishlist Icon */}
              <button
                onClick={handleWishlistClick}
                className="relative p-1.5 sm:p-2 text-indriya-navy hover:text-indriya-crimson transition-all"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {customerUser && wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-indriya-crimson text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* User Account / Profile */}
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="relative p-1.5 sm:p-2 text-indriya-navy hover:text-indriya-crimson transition-all flex items-center gap-1.5"
                title={customerUser ? ("Logged in as " + customerUser.name) : "Customer Sign In / Register"}
              >
                <User className="w-5 h-5" />
                {customerUser && (
                  <span className="hidden xl:inline text-xs font-bold text-indriya-navy max-w-[80px] truncate">
                    {customerUser.name.split(' ')[0]}
                  </span>
                )}
              </button>

              {/* Shopping Bag / Cart */}
              <button
                onClick={handleBagClick}
                className="relative p-1.5 sm:p-2 text-indriya-navy hover:text-indriya-gold transition-all"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {customerUser && cart.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-indriya-navy text-indriya-lightgold border border-indriya-gold text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </button>
            </div>

          </div>

          {/* Mobile Clean Search Bar (Only on < 768px, Sleek Indriya Pill) */}
          <div className="md:hidden pb-2.5">
            <div
              onClick={() => setIsSearchOverlayOpen(true)}
              className="w-full bg-white border border-indriya-gold/40 rounded-full py-2 px-3.5 flex items-center gap-2 text-xs text-gray-500 shadow-sm cursor-pointer"
            >
              <Search className="w-4 h-4 text-indriya-gold shrink-0" />
              <span className="truncate">Search 22KT Gold, Diamonds, Solitaires...</span>
            </div>
          </div>

        </div>

        {/* Desktop Navigation & Mega Menu Container (Unified Hover & Click Barrier) */}
        <div
          className="hidden md:block relative border-t border-indriya-gold/20"
          onMouseLeave={() => setActiveMegaMenu(null)}
        >
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-6 lg:gap-8 py-2.5 text-xs font-bold tracking-wider text-indriya-navy uppercase">
            {[
              { id: 'all', label: 'All Jewellery' },
              { id: 'gold', label: 'Gold' },
              { id: 'diamond', label: 'Diamond' },
              { id: 'daily-wear', label: 'Daily Wear' },
              { id: 'wedding', label: 'Wedding' },
              { id: 'gifting', label: 'Gifting' },
              { id: 'masterpieces', label: 'Masterpieces' },
              { id: 'more', label: 'More' }
            ].map((item) => (
              <button
                key={item.id}
                onMouseEnter={() => setActiveMegaMenu(item.id)}
                onClick={() => {
                  setActiveMegaMenu(activeMegaMenu === item.id ? null : item.id);
                }}
                className={"hover:text-indriya-crimson transition-colors py-1 flex items-center gap-1 " + (activeMegaMenu === item.id ? "text-indriya-crimson border-b-2 border-indriya-crimson font-black" : "")}
              >
                <span>{item.label}</span>
                <ChevronDown className={"w-3.5 h-3.5 transition-transform " + (activeMegaMenu === item.id ? "rotate-180 text-indriya-crimson" : "text-gray-400")} />
              </button>
            ))}
          </nav>

          {/* INDRIYA-STYLE FULL-WIDTH DROPDOWN MEGA MENU (DESKTOP) */}
          {/* INDRIYA-STYLE FULL-WIDTH DROPDOWN MEGA MENU */}
        {activeMegaMenu && (
          <div
            className="hidden md:block absolute left-0 right-0 top-full bg-[#FAF7F2] border-b-2 border-indriya-gold/40 shadow-2xl z-50 text-left transition-all duration-200"
            onMouseEnter={() => {}}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
              
              {/* 1. WEDDING MEGA MENU (MATCHING USER SCREENSHOT 6) */}
              {activeMegaMenu === 'wedding' && (
                <div className="grid grid-cols-12 gap-6 items-start">
                  <div className="col-span-2">
                    <span className="text-xs font-serif font-bold text-indriya-navy block mb-4">Weddings By Sai</span>
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3">BY EVENTS</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      {['Engagement', 'Sangeet', 'Mehendi', 'Wedding Day', 'Reception'].map((ev) => (
                        <div key={ev} onClick={() => { navigateTo('category', 'bridal'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer transition-colors">
                          {ev}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3 mt-8 sm:mt-8">BY MATERIAL</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      {[
                        { name: 'Gold', cat: 'necklaces' },
                        { name: 'Diamond', cat: 'rings' },
                        { name: 'Polki', cat: 'bridal' }
                      ].map((m) => (
                        <div key={m.name} onClick={() => { navigateTo('category', m.cat); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer transition-colors">
                          {m.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-3">
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3 mt-8 sm:mt-8">REGIONAL BRIDAL COLLECTIONS</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      {['Maharashtra - Rajashree', 'Bihar - Madhuragini', 'Gujarat - Raasvi', 'Rajasthan - Padma Ranjini', 'Temple Jewellery - Anantara'].map((r) => (
                        <div key={r} onClick={() => { navigateTo('category', 'bridal'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer transition-colors">
                          {r}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3 mt-8 sm:mt-8">WEDDING ACCESSORIES</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      {['Mangalsutra', 'Engagement Rings', 'Maang Tikka', 'Nath', 'Anklets', 'Waistband', 'Haathphool'].map((w) => (
                        <div key={w} onClick={() => { navigateTo('category', 'bridal'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer transition-colors">
                          {w}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-3">
                    <div
                      onClick={() => { navigateTo('category', 'bridal'); setActiveMegaMenu(null); }}
                      className="group cursor-pointer rounded-2xl overflow-hidden border border-indriya-gold/40 bg-white shadow-md"
                    >
                      <img
                        src="/images/jewellery/bridal-jewellery-set.jpg"
                        alt="Royal Bridal Choker"
                        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="p-3 text-center bg-[#FAF7F2]">
                        <span className="text-xs font-serif font-bold text-indriya-navy block">Weddings by Sai Jewellers</span>
                        <span className="text-[10px] text-indriya-crimson font-bold uppercase tracking-wider block mt-0.5">Explore Bridal Trousseau â†’</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. GIFTING MEGA MENU (MATCHING USER SCREENSHOT 7) */}
              {activeMegaMenu === 'gifting' && (
                <div className="grid grid-cols-12 gap-6 items-start">
                  <div className="col-span-2">
                    <span className="text-xs font-serif font-bold text-indriya-navy block mb-4">The Gifting Edit</span>
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3">GIFTS FOR</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      {['Men', 'Women', 'Kids'].map((g) => (
                        <div key={g} onClick={() => { navigateTo('category', 'rings'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer transition-colors">
                          {g}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3 mt-8 sm:mt-8">BY PRICE</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      {['Under â‚¹25K', 'â‚¹25K-50K', 'â‚¹50K-75K', 'Above â‚¹75K'].map((p) => (
                        <div key={p} onClick={() => { navigateTo('category', 'earrings'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer transition-colors">
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3 mt-8 sm:mt-8">BY OCCASION</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      {['Birthday Gifts', 'Anniversary Gifts', 'Propose Day Gifts', 'Wedding Gifts'].map((o) => (
                        <div key={o} onClick={() => { navigateTo('category', 'rings'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer transition-colors">
                          {o}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3 mt-8 sm:mt-8">GIFTING COLLECTIONS</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      {['Heartstring', 'Blush', 'Pliq-a-Jor', 'Complimentary Packaging'].map((c) => (
                        <div key={c} onClick={() => { navigateTo('category', 'necklaces'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer transition-colors">
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-4 grid grid-cols-2 gap-3">
                    <div onClick={() => { navigateTo('category', 'earrings'); setActiveMegaMenu(null); }} className="cursor-pointer group">
                      <div className="rounded-xl overflow-hidden border border-indriya-gold/30 shadow-sm bg-white">
                        <img src="/images/jewellery/feat-sparkle.jpg" alt="Daily Wear Gifting" className="w-full h-32 object-cover group-hover:scale-105 transition-all" />
                      </div>
                      <span className="text-[11px] font-bold text-indriya-navy block mt-2 text-center group-hover:text-indriya-crimson">Daily Wear</span>
                    </div>

                    <div onClick={() => { navigateTo('category', 'necklaces'); setActiveMegaMenu(null); }} className="cursor-pointer group">
                      <div className="rounded-xl overflow-hidden border border-indriya-gold/30 shadow-sm bg-white">
                        <img src="/images/jewellery/festive-jewellery-collection.jpg" alt="Elevated Wear Gifting" className="w-full h-32 object-cover group-hover:scale-105 transition-all" />
                      </div>
                      <span className="text-[11px] font-bold text-indriya-navy block mt-2 text-center group-hover:text-indriya-crimson">Elevated Wear</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. DAILY WEAR MEGA MENU (MATCHING USER SCREENSHOT 8) */}
              {activeMegaMenu === 'daily-wear' && (
                <div className="grid grid-cols-12 gap-6 items-start">
                  <div className="col-span-3">
                    <span className="text-xs font-serif font-bold text-indriya-navy block mb-4">All Daily Wear Jewellery</span>
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3">BY CATEGORY</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      {[
                        { name: 'Daily Wear Earrings', cat: 'earrings' },
                        { name: 'Dailywear Rings', cat: 'rings' },
                        { name: 'Dailywear Bangles', cat: 'bangles' },
                        { name: 'Dailywear Bracelets', cat: 'bangles' },
                        { name: 'Dailywear Necklaces', cat: 'necklaces' },
                        { name: 'Dailywear Mangalsutra', cat: 'necklaces' },
                        { name: 'Dailywear Chains', cat: 'necklaces' },
                        { name: 'Dailywear Pendants', cat: 'necklaces' }
                      ].map((item) => (
                        <div key={item.name} onClick={() => { navigateTo('category', item.cat); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer transition-colors">
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3 mt-8 sm:mt-8">BY PRICE</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      {['Under â‚¹25K', 'â‚¹25K-50K', 'â‚¹50K-75K', 'â‚¹75K-1L', 'â‚¹1L-1.5L', 'Above â‚¹1.5L'].map((p) => (
                        <div key={p} onClick={() => { navigateTo('category', 'earrings'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer transition-colors">
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3 mt-8 sm:mt-8">BY GENDER</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      {['Women', 'Men', 'Kids', 'Unisex'].map((g) => (
                        <div key={g} onClick={() => { navigateTo('category', 'rings'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer transition-colors">
                          {g}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-5 grid grid-cols-2 gap-4">
                    <div onClick={() => { navigateTo('category', 'earrings'); setActiveMegaMenu(null); }} className="cursor-pointer group">
                      <div className="rounded-2xl overflow-hidden border border-indriya-gold/30 shadow-sm bg-white">
                        <img src="/images/jewellery/gold-jhumka-earrings.jpg" alt="Daily Wear Earrings" className="w-full h-40 object-cover group-hover:scale-105 transition-all" />
                      </div>
                      <span className="text-xs font-bold text-indriya-navy block mt-2 text-center group-hover:text-indriya-crimson">Daily Wear Earrings</span>
                    </div>

                    <div onClick={() => { navigateTo('category', 'necklaces'); setActiveMegaMenu(null); }} className="cursor-pointer group">
                      <div className="rounded-2xl overflow-hidden border border-indriya-gold/30 shadow-sm bg-white">
                        <img src="/images/jewellery/gold-temple-necklace.jpg" alt="Daily Wear Necklaces" className="w-full h-40 object-cover group-hover:scale-105 transition-all" />
                      </div>
                      <span className="text-xs font-bold text-indriya-navy block mt-2 text-center group-hover:text-indriya-crimson">Daily Wear Necklaces</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. DIAMOND MEGA MENU (MATCHING USER SCREENSHOT 9) */}
              {activeMegaMenu === 'diamond' && (
                <div className="grid grid-cols-12 gap-6 items-start">
                  <div className="col-span-3">
                    <span className="text-xs font-serif font-bold text-indriya-navy block mb-1">Sai Diamonds</span>
                    <div className="flex gap-3 text-xs font-bold text-indriya-gold mb-4">
                      <span onClick={() => { navigateTo('category', 'rings'); setActiveMegaMenu(null); }} className="hover:underline cursor-pointer">All Diamond Jewellery</span>
                      <span>â€¢</span>
                      <span onClick={() => { navigateTo('category', 'bridal'); setActiveMegaMenu(null); }} className="hover:underline cursor-pointer">All Polki Jewellery</span>
                    </div>

                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3">BY CATEGORY</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      {[
                        { name: 'Diamond Earrings', cat: 'earrings' },
                        { name: 'Diamond Rings', cat: 'rings' },
                        { name: 'Diamond Bangles', cat: 'bangles' },
                        { name: 'Diamond Bracelets', cat: 'bangles' },
                        { name: 'Diamond Necklaces', cat: 'necklaces' },
                        { name: 'Diamond Mangalsutra', cat: 'necklaces' },
                        { name: 'Diamond Chains', cat: 'necklaces' },
                        { name: 'Diamond Pendants', cat: 'necklaces' }
                      ].map((item) => (
                        <div key={item.name} onClick={() => { navigateTo('category', item.cat); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer transition-colors">
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3 mt-8 sm:mt-8">BY GENDER</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      {['Women', 'Men', 'Kids', 'Unisex'].map((g) => (
                        <div key={g} onClick={() => { navigateTo('category', 'rings'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer transition-colors">
                          {g}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3 mt-8 sm:mt-8">BY PRICE</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      {['Under â‚¹50K', 'â‚¹50K - 1L', 'â‚¹1L - 2L', 'â‚¹2L - 5L', 'Above â‚¹10L'].map((p) => (
                        <div key={p} onClick={() => { navigateTo('category', 'rings'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer transition-colors">
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-5 grid grid-cols-2 gap-4">
                    <div onClick={() => { navigateTo('category', 'rings'); setActiveMegaMenu(null); }} className="cursor-pointer group">
                      <div className="rounded-2xl overflow-hidden border border-indriya-gold/30 shadow-sm bg-white">
                        <img src="/images/jewellery/feat-sparkle.jpg" alt="Sai Sparkling Diamonds" className="w-full h-40 object-cover group-hover:scale-105 transition-all" />
                      </div>
                      <span className="text-xs font-bold text-indriya-navy block mt-2 text-center group-hover:text-indriya-crimson">Sai's Sparkling Diamonds</span>
                    </div>

                    <div onClick={() => { navigateTo('category', 'bridal'); setActiveMegaMenu(null); }} className="cursor-pointer group">
                      <div className="rounded-2xl overflow-hidden border border-indriya-gold/30 shadow-sm bg-white">
                        <img src="/images/jewellery/bridal-jewellery-set.jpg" alt="Polki Jewellery" className="w-full h-40 object-cover group-hover:scale-105 transition-all" />
                      </div>
                      <span className="text-xs font-bold text-indriya-navy block mt-2 text-center group-hover:text-indriya-crimson">Polki Jewellery</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. ALL JEWELLERY MEGA MENU (MATCHING USER SCREENSHOT 10) */}
              {activeMegaMenu === 'all' && (
                <div className="grid grid-cols-12 gap-6 items-start">
                  <div className="col-span-3">
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3">BY CATEGORY</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      {[
                        { name: 'Earrings', cat: 'earrings' },
                        { name: 'Rings', cat: 'rings' },
                        { name: 'Necklaces', cat: 'necklaces' },
                        { name: 'Bangles', cat: 'bangles' },
                        { name: 'Mangalsutra', cat: 'necklaces' },
                        { name: 'Pendants', cat: 'necklaces' },
                        { name: 'Bracelets', cat: 'bangles' },
                        { name: 'Chains', cat: 'necklaces' },
                        { name: 'Silver Coins', cat: 'silver' },
                        { name: 'Gold Coins', cat: 'necklaces' },
                        { name: 'Silver Rakhi', cat: 'silver' },
                        { name: 'All Jewellery', cat: 'all' }
                      ].map((item) => (
                        <div key={item.name} onClick={() => { navigateTo('category', item.cat); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer transition-colors">
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3">BY PRICE</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      {['Under â‚¹25K', 'â‚¹25K-50K', 'â‚¹50K-1L', 'â‚¹1L-2L', 'Above â‚¹2L'].map((p) => (
                        <div key={p} onClick={() => { navigateTo('category', 'all'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer transition-colors">
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3">BY GENDER</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      {['Women', 'Men', 'Kids', 'Unisex'].map((g) => (
                        <div key={g} onClick={() => { navigateTo('category', 'all'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer transition-colors">
                          {g}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3">BY OCCASION</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      {['Daily Wear', 'Heavy Occasion', 'Light Occasion', 'Bridal Wear', 'Elevated Essentials'].map((o) => (
                        <div key={o} onClick={() => { navigateTo('category', 'all'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer transition-colors">
                          {o}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-3">
                    <div onClick={() => { navigateTo('category', 'necklaces'); setActiveMegaMenu(null); }} className="cursor-pointer group rounded-2xl overflow-hidden border border-indriya-gold/40 shadow-sm bg-white">
                      <img src="/images/jewellery/gold-temple-necklace.jpg" alt="Royal Antique Collection" className="w-full h-44 object-cover group-hover:scale-105 transition-all" />
                      <div className="p-3 text-center bg-[#FAF7F2]">
                        <span className="text-xs font-serif font-bold text-indriya-navy block">Royal Antique Collection</span>
                        <span className="text-[10px] text-indriya-crimson font-bold uppercase tracking-wider block mt-0.5">Explore All Designs â†’</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. GOLD MEGA MENU */}
              {activeMegaMenu === 'gold' && (
                <div className="grid grid-cols-12 gap-6 items-start">
                  <div className="col-span-3">
                    <span className="text-xs font-serif font-bold text-indriya-navy block mb-4">All Gold Jewellery</span>
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3">BY CATEGORY</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      {[
                        { name: 'Gold Necklaces & Chokers', cat: 'necklaces' },
                        { name: 'Gold Bangles & Kadas', cat: 'bangles' },
                        { name: 'Gold Earrings & Jhumkas', cat: 'earrings' },
                        { name: 'Gold Rings', cat: 'rings' },
                        { name: 'Gold Chains & Mangalsutras', cat: 'necklaces' },
                        { name: '24KT Bullion Coins', cat: 'necklaces' }
                      ].map((item) => (
                        <div key={item.name} onClick={() => { navigateTo('category', item.cat); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer transition-colors">
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-3">
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3 mt-8 sm:mt-8">BY KARATAGE</span>
                    <div className="space-y-2.5 text-xs">
                      <div onClick={() => { navigateTo('category', 'necklaces'); setActiveMegaMenu(null); }} className="p-2 bg-white rounded-xl border border-indriya-gold/30 hover:border-indriya-crimson cursor-pointer">
                        <span className="font-bold text-indriya-navy block">24KT (99.9% Bullion)</span>
                        <span className="text-[10px] text-gray-500">â‚¹{goldRates.rate24K.toLocaleString('en-IN')}/g</span>
                      </div>
                      <div onClick={() => { navigateTo('category', 'necklaces'); setActiveMegaMenu(null); }} className="p-2 bg-amber-50/60 rounded-xl border border-indriya-gold/50 hover:border-indriya-crimson cursor-pointer">
                        <span className="font-bold text-indriya-crimson block">22KT (Standard Jewellery)</span>
                        <span className="text-[10px] text-indriya-crimson">â‚¹{goldRates.rate22K.toLocaleString('en-IN')}/g</span>
                      </div>
                      <div onClick={() => { navigateTo('category', 'rings'); setActiveMegaMenu(null); }} className="p-2 bg-white rounded-xl border border-indriya-gold/30 hover:border-indriya-crimson cursor-pointer">
                        <span className="font-bold text-indriya-navy block">18KT (Diamond Jewellery)</span>
                        <span className="text-[10px] text-gray-500">â‚¹{goldRates.rate18K.toLocaleString('en-IN')}/g</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3 mt-8 sm:mt-8">BY GENDER</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      {['Women', 'Men', 'Kids', 'Unisex'].map((g) => (
                        <div key={g} onClick={() => { navigateTo('category', 'necklaces'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer transition-colors">
                          {g}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-4">
                    <div onClick={() => { navigateTo('category', 'necklaces'); setActiveMegaMenu(null); }} className="cursor-pointer group rounded-2xl overflow-hidden border border-indriya-gold/40 shadow-sm bg-white">
                      <img src="/images/jewellery/hero-gold-exchange.jpg" alt="0% Gold Exchange" className="w-full h-40 object-cover group-hover:scale-105 transition-all" />
                      <div className="p-3 text-center bg-[#FAF7F2]">
                        <span className="text-xs font-serif font-bold text-indriya-navy block">0% Deduction on Old Gold Exchange</span>
                        <span className="text-[10px] text-indriya-crimson font-bold uppercase tracking-wider block mt-0.5">Upgrade to 22KT Heirlooms â†’</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. MASTERPIECES MEGA MENU */}
              {activeMegaMenu === 'masterpieces' && (
                <div className="grid grid-cols-12 gap-6 items-start">
                  <div className="col-span-4">
                    <span className="text-xs font-serif font-bold text-indriya-navy block mb-4">Masterpiece Heirlooms</span>
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3">ROYAL ATELIER</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      {['Padmika Royal Polki Choker', 'Nizami Basra Pearls', 'Nakshi Temple Goddess Lakshmi Haram', 'Antique Deccan Filigree Bangles', 'Colombian Uncut Emerald Sets'].map((m) => (
                        <div key={m} onClick={() => { navigateTo('category', 'necklaces'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer transition-colors">
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-4">
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3 mt-8 sm:mt-8">HERITAGE STORIES</span>
                    <p className="text-xs text-charcoal-700 leading-relaxed mb-4">
                      Each masterpiece requires over 350+ hours of painstaking hand kaarigari by Hyderabad's most esteemed master goldsmiths.
                    </p>
                    <button onClick={() => { navigateTo('category', 'necklaces'); setActiveMegaMenu(null); }} className="px-5 py-2 bg-indriya-navy text-indriya-lightgold rounded-full text-xs font-bold uppercase tracking-wider">
                      Explore Masterpieces
                    </button>
                  </div>

                  <div className="col-span-4">
                    <img src="/images/jewellery/festive-jewellery-collection.jpg" alt="Royal Masterpieces" className="w-full h-44 object-cover rounded-2xl border border-indriya-gold/40 shadow-sm" />
                  </div>
                </div>
              )}

              {/* 8. MORE MEGA MENU */}
              {activeMegaMenu === 'more' && (
                <div className="grid grid-cols-12 gap-6 items-start">
                  <div className="col-span-4">
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3">ABOUT SAI JEWELLERS</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      <div onClick={() => { navigateTo('home'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer">Our 40-Year Legacy</div>
                      <div onClick={() => { navigateTo('home'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer">The Sai Promises</div>
                      <div onClick={() => { navigateTo('store'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer">Master Kaarigari Bench</div>
                      <div onClick={() => { navigateTo('home'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer">BIS 916 Hallmark Certification</div>
                    </div>
                  </div>

                  <div className="col-span-4">
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3">SERVICES &amp; SCHEMES</span>
                    <div className="space-y-2 text-xs text-charcoal-700">
                      <div onClick={() => { navigateTo('golden-programs'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer font-semibold text-indriya-crimson">Golden Programs (11+1 Plan)</div>
                      <div onClick={() => { setIsTodayGoldRateOpen(true); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer">Today's Live Gold Rate</div>
                      <div onClick={() => { navigateTo('store'); setActiveMegaMenu(null); }} className="hover:text-indriya-crimson cursor-pointer">Book VIP Showroom Appointment</div>
                    </div>
                  </div>

                  <div className="col-span-4">
                    <span className="text-[11px] font-bold text-indriya-crimson tracking-wider uppercase block mb-3">FLAGSHIP SHOWROOM</span>
                    <p className="text-xs text-charcoal-700 leading-relaxed mb-3">
                      Paripally Street / Kaman Road, Siddipet - 502103<br />
                      Telangana, India • Call: +91 90300 33552
                    </p>
                    <button onClick={() => { navigateTo('store'); setActiveMegaMenu(null); }} className="text-xs font-bold text-indriya-crimson hover:underline">
                      View Store Directions →
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
        </div>

      </header>

      {/* MOBILE FULL-SCREEN NAVIGATION DRAWER (INDRIYA STYLE) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fadeIn">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-sm bg-[#FAF7F2] h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 border-r border-indriya-gold/40">
            
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between p-4 border-b border-indriya-gold/30 bg-white">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/logo.jpg"
                    alt="Gattu Krishna Murthy Jewellers Logo"
                    className="w-9 h-9 object-contain rounded-xl border border-indriya-gold/50 bg-[#07281f] p-0.5"
                  />
                  <div>
                    <span className="font-serif text-sm font-bold text-indriya-navy tracking-wider block leading-tight">
                      GATTU KRISHNA MURTHY
                    </span>
                    <span className="text-[7.5px] font-sans tracking-[0.2em] text-indriya-crimson font-bold uppercase block mt-0.5">
                      JEWELLERS • ESTD 1958
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full text-gray-500 hover:text-indriya-navy hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer Sign-in / Welcome Banner */}
              <div className="p-3.5 bg-gradient-to-r from-[#0A2240] to-[#123158] text-white">
                {customerUser ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-indriya-lightgold uppercase tracking-wider font-semibold">Welcome Back</p>
                      <p className="text-xs font-bold">{customerUser.name}</p>
                    </div>
                    <span className="text-[10px] px-2 py-1 bg-white/20 rounded-full font-bold">
                      {customerUser.rewardPoints || 500} Pts
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-indriya-lightgold uppercase tracking-wider font-semibold">Welcome Offer</p>
                      <p className="text-xs font-bold">Get ₹500 on Sign Up*</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="px-3 py-1 bg-indriya-gold hover:bg-indriya-brightgold text-[#0A2240] text-[10px] font-bold rounded-full uppercase"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Categories & Accordion Menus */}
              <div className="p-3 divide-y divide-indriya-gold/20 text-xs font-semibold text-indriya-navy">
                
                {/* 1. All Jewellery */}
                <div className="py-2.5">
                  <div
                    onClick={() => {
                      navigateTo('category', 'all');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between py-1 cursor-pointer hover:text-indriya-crimson"
                  >
                    <span className="font-bold">✦ All Jewellery</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-2 pl-2 text-[11px] text-charcoal-700 font-normal">
                    <span onClick={() => { navigateTo('category', 'earrings'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Earrings</span>
                    <span onClick={() => { navigateTo('category', 'rings'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Rings &amp; Solitaires</span>
                    <span onClick={() => { navigateTo('category', 'necklaces'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Necklaces &amp; Chokers</span>
                    <span onClick={() => { navigateTo('category', 'bangles'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Bangles &amp; Kadas</span>
                    <span onClick={() => { navigateTo('category', 'bridal'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Mangalsutras</span>
                    <span onClick={() => { navigateTo('category', 'coins'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Gold &amp; Silver Coins</span>
                  </div>
                </div>

                {/* 2. Gold Jewellery */}
                <div className="py-2.5">
                  <div
                    onClick={() => {
                      navigateTo('category', 'necklaces');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between py-1 cursor-pointer hover:text-indriya-crimson"
                  >
                    <span className="font-bold text-indriya-crimson">✦ Gold (Live Rate: ₹{goldRates.rate22K.toLocaleString('en-IN')}/g)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-indriya-crimson" />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-2 pl-2 text-[11px] text-charcoal-700 font-normal">
                    <span onClick={() => { navigateTo('category', 'necklaces'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Temple Gold (22KT)</span>
                    <span onClick={() => { navigateTo('category', 'bangles'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Nakshi Kadas &amp; Bangles</span>
                    <span onClick={() => { navigateTo('category', 'earrings'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Gold Jhumkas</span>
                    <span onClick={() => { navigateTo('category', 'necklaces'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">0% Deduction Gold Exchange</span>
                  </div>
                </div>

                {/* 3. Diamond & Solitaires */}
                <div className="py-2.5">
                  <div
                    onClick={() => {
                      navigateTo('category', 'rings');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between py-1 cursor-pointer hover:text-indriya-crimson"
                  >
                    <span className="font-bold">✦ Diamond &amp; Solitaires</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-2 pl-2 text-[11px] text-charcoal-700 font-normal">
                    <span onClick={() => { navigateTo('category', 'rings'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Solitaire Rings</span>
                    <span onClick={() => { navigateTo('category', 'bangles'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Diamond Bangles</span>
                    <span onClick={() => { navigateTo('category', 'bridal'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Polki Jewellery</span>
                    <span onClick={() => { navigateTo('category', 'earrings'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Diamond Studs</span>
                  </div>
                </div>

                {/* 4. Wedding & Bridal */}
                <div className="py-2.5">
                  <div
                    onClick={() => {
                      navigateTo('category', 'bridal');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between py-1 cursor-pointer hover:text-indriya-crimson"
                  >
                    <span className="font-bold">✦ Wedding &amp; Bridal Trousseau</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-2 pl-2 text-[11px] text-charcoal-700 font-normal">
                    <span onClick={() => { navigateTo('category', 'bridal'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Bridal Chokers &amp; Haar</span>
                    <span onClick={() => { navigateTo('category', 'bridal'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Engagement Rings</span>
                    <span onClick={() => { navigateTo('category', 'bridal'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Maang Tikka &amp; Nath</span>
                    <span onClick={() => { navigateTo('category', 'bridal'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Regional Heirlooms</span>
                  </div>
                </div>

                {/* 5. Gifting Edit */}
                <div className="py-2.5">
                  <div
                    onClick={() => {
                      navigateTo('category', 'rings');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between py-1 cursor-pointer hover:text-indriya-crimson"
                  >
                    <span className="font-bold">✦ The Gifting Edit</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-2 pl-2 text-[11px] text-charcoal-700 font-normal">
                    <span onClick={() => { navigateTo('category', 'earrings'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Gifts Under ₹25,000</span>
                    <span onClick={() => { navigateTo('category', 'rings'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Anniversary Gifts</span>
                    <span onClick={() => { navigateTo('category', 'necklaces'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Gifts for Her</span>
                    <span onClick={() => { navigateTo('category', 'coins'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Gifts for Him</span>
                  </div>
                </div>

                {/* 6. Pure 925 Silver */}
                <div className="py-2.5">
                  <div
                    onClick={() => {
                      navigateTo('category', 'silver');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between py-1 cursor-pointer hover:text-indriya-crimson"
                  >
                    <span className="font-bold">✦ Pure 925 Silver Articles</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-2 pl-2 text-[11px] text-charcoal-700 font-normal">
                    <span onClick={() => { navigateTo('category', 'silver'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Peacock Diya Lamps</span>
                    <span onClick={() => { navigateTo('category', 'silver'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Silver Kalash &amp; Pooja</span>
                    <span onClick={() => { navigateTo('category', 'silver'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Payal &amp; Anklets</span>
                    <span onClick={() => { navigateTo('category', 'silver'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-indriya-crimson cursor-pointer">Silver Bullion Bars</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 border-t border-indriya-gold/30 bg-white space-y-2 text-xs font-bold text-indriya-navy">
              <button
                onClick={() => {
                  navigateTo('golden-programs');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#FAF7F2] border border-indriya-gold/40 flex items-center justify-between hover:bg-indriya-peach/30"
              >
                <span className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-indriya-gold" />
                  <span>Golden Programs (Rate Lock)</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <button
                onClick={() => {
                  navigateTo('store');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#FAF7F2] border border-indriya-gold/40 flex items-center justify-between hover:bg-indriya-peach/30"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indriya-crimson" />
                  <span>Siddipet Flagship Showroom</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAppointmentOpen(true);
                }}
                className="w-full py-3 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold rounded-xl text-center uppercase tracking-widest text-[11px] shadow-md flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Book VIP Showroom Visit</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setCurrentPage('admin');
                }}
                className="w-full text-center text-[11px] text-gray-400 hover:text-indriya-navy py-1"
              >
                Admin Portal Access
              </button>
            </div>

          </div>
        </div>
      )}

            {/* 3. HERO SLIDER SECTION (RESPONSIVE LUXURY BANNER WITH COMPACT, SEMI-TRANSPARENT CARD) */}
      {currentPage === 'home' && (
        <section className="relative overflow-hidden bg-[#FAF7F2] select-none border-b border-indriya-gold/30">
          
          {/* ================= DESKTOP VIEW (>= 768px): Full-bleed luxury banner with compact semi-transparent card ================= */}
          <div className="hidden md:flex relative min-h-[480px] lg:min-h-[540px] items-center">
            
            {/* Background Image of Current Slide */}
            <div className="absolute inset-0 z-0 transition-opacity duration-700">
              <img
                src={HERO_SLIDES[heroSlideIndex % HERO_SLIDES.length].image}
                alt={HERO_SLIDES[heroSlideIndex % HERO_SLIDES.length].title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/30 pointer-events-none" />
            </div>

            {/* Slide Navigation Left Arrow */}
            <button
              onClick={() => setHeroSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
              className="absolute left-6 lg:left-8 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-indriya-navy shadow-lg flex items-center justify-center transition-all hover:scale-105 border border-indriya-gold/40"
              title="Previous Slide"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Slide Navigation Right Arrow */}
            <button
              onClick={() => setHeroSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length)}
              className="absolute right-6 lg:right-8 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-indriya-navy shadow-lg flex items-center justify-center transition-all hover:scale-105 border border-indriya-gold/40"
              title="Next Slide"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Desktop Compact Semi-Transparent Card (Reduced size, smaller text, subtle luxury transparency) */}
            <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full flex justify-end py-8">
              <div className="w-full max-w-md lg:max-w-lg bg-white/85 backdrop-blur-md p-6 lg:p-7 rounded-2xl border border-indriya-gold/50 shadow-xl text-right transition-all">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#07281f] text-white border border-indriya-gold/60 shadow-sm mb-2">
                  <img src="/logo.jpg" alt="GKJ" className="w-4 h-4 rounded-md object-contain" />
                  <span className="text-[9px] font-sans font-extrabold tracking-widest text-indriya-lightgold uppercase">
                    Gattu Krishna Murthy Jewellers • Estd 1958
                  </span>
                </div>
                <span className="text-[10px] font-sans tracking-[0.25em] text-indriya-crimson font-bold uppercase block mb-1">
                  {HERO_SLIDES[heroSlideIndex % HERO_SLIDES.length].subtitle}
                </span>
                <h2 className="font-serif text-2xl lg:text-3xl text-indriya-navy font-bold leading-tight">
                  {HERO_SLIDES[heroSlideIndex % HERO_SLIDES.length].title}
                </h2>
                <p className="text-xs text-charcoal-700 font-medium mt-1.5 leading-relaxed">
                  {HERO_SLIDES[heroSlideIndex % HERO_SLIDES.length].tagline || "Every masterpiece carries 100% BIS 916 Hallmark certification & laser-inscribed HUID."}
                </p>
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    onClick={() => navigateTo("category", HERO_SLIDES[heroSlideIndex % HERO_SLIDES.length].category)}
                    className="px-6 py-2.5 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold rounded-full text-[11px] font-bold tracking-widest uppercase transition-all shadow-md inline-flex items-center gap-1.5 active:scale-95"
                  >
                    <span>{HERO_SLIDES[heroSlideIndex % HERO_SLIDES.length].buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Slide Indicator Dots */}
            <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center items-center gap-1.5">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroSlideIndex(idx)}
                  className={"transition-all rounded-full " + (idx === heroSlideIndex % HERO_SLIDES.length ? "w-6 h-1.5 bg-indriya-gold" : "w-1.5 h-1.5 bg-white/70 hover:bg-white")}
                  aria-label={"Go to slide " + (idx + 1)}
                />
              ))}
            </div>

          </div>

          {/* ================= MOBILE VIEW (< 768px): Compact Visual with Reduced Semi-Transparent Card ================= */}
          <div className="block md:hidden px-3 py-2.5">
            <div className="rounded-2xl overflow-hidden border border-indriya-gold/40 shadow-md bg-stone-900 relative">
              
              {/* Mobile Jewellery Visual (Crisp & High Contrast) */}
              <div className="relative h-[220px] sm:h-[260px] w-full overflow-hidden">
                <img
                  src={HERO_SLIDES[heroSlideIndex % HERO_SLIDES.length].image}
                  alt={HERO_SLIDES[heroSlideIndex % HERO_SLIDES.length].title}
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Mobile Hallmark Badge */}
                <div className="absolute top-2.5 left-2.5 bg-black/60 px-2.5 py-0.5 rounded-full text-[9px] text-indriya-lightgold font-bold tracking-wider uppercase border border-indriya-gold/30">
                  ✦ BIS 916 Pure Gold
                </div>

                {/* Mobile Left / Right Arrows on Image */}
                <button
                  onClick={() => setHeroSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/90 text-indriya-navy shadow flex items-center justify-center hover:bg-white active:scale-95 border border-indriya-gold/30"
                  title="Previous Slide"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setHeroSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/90 text-indriya-navy shadow flex items-center justify-center hover:bg-white active:scale-95 border border-indriya-gold/30"
                  title="Next Slide"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Mobile Compact Semi-Transparent Details Card (Reduced Size & Text) */}
              <div className="p-3.5 bg-white/90 backdrop-blur-md text-center border-t border-indriya-gold/20">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#07281f] text-white border border-indriya-gold/60 shadow-sm mb-1.5">
                  <img src="/logo.jpg" alt="GKJ" className="w-3.5 h-3.5 rounded-md object-contain" />
                  <span className="text-[8px] font-sans font-extrabold tracking-widest text-indriya-lightgold uppercase">
                    Gattu Krishna Murthy Jewellers • Estd 1958
                  </span>
                </div>
                <span className="text-[9px] font-sans tracking-[0.2em] text-indriya-crimson font-bold uppercase block mb-0.5">
                  {HERO_SLIDES[heroSlideIndex % HERO_SLIDES.length].subtitle}
                </span>
                <h2 className="font-serif text-base sm:text-lg font-bold text-indriya-navy leading-snug">
                  {HERO_SLIDES[heroSlideIndex % HERO_SLIDES.length].title}
                </h2>
                <p className="text-[11px] text-charcoal-700 mt-1 leading-normal">
                  {HERO_SLIDES[heroSlideIndex % HERO_SLIDES.length].tagline || "Every masterpiece carries 100% BIS 916 Hallmark certification & laser-inscribed HUID."}
                </p>

                {/* Mobile Button (Compact Pill) */}
                <button
                  onClick={() => navigateTo("category", HERO_SLIDES[heroSlideIndex % HERO_SLIDES.length].category)}
                  className="w-full mt-2.5 py-2.5 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold rounded-full text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all"
                >
                  <span>{HERO_SLIDES[heroSlideIndex % HERO_SLIDES.length].buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Mobile Indicator Dots */}
                <div className="flex justify-center items-center gap-1.5 pt-2">
                  {HERO_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setHeroSlideIndex(idx)}
                      className={"transition-all rounded-full " + (idx === heroSlideIndex % HERO_SLIDES.length ? "w-5 h-1.5 bg-indriya-gold" : "w-1.5 h-1.5 bg-gray-300")}
                      aria-label={"Go to slide " + (idx + 1)}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

        </section>
      )}

      {/* ================= INSTAGRAM STORY HIGHLIGHTS BAR (@gattu_krishna_murthy_jewellers) ================= */}
      {currentPage === 'home' && (
        <section className="bg-white border-b border-indriya-gold/30 py-4 px-3 sm:px-6 shadow-sm overflow-hidden select-none">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></div>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indriya-navy font-serif">
                  Instagram Highlights &amp; Trending Stories
                </span>
                <span className="text-[10px] text-gray-500 font-sans hidden sm:inline">
                  (@gattu_krishna_murthy_jewellers)
                </span>
              </div>
              <a
                href="https://www.instagram.com/gattu_krishna_murthy_jewellers/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 group"
              >
                <span>Follow on Instagram</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            {/* Scrollable Highlight Story Circles */}
            <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 pt-1 scrollbar-none text-center">
              {INSTAGRAM_HIGHLIGHTS.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    navigateTo('category', item.category);
                  }}
                  className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
                >
                  {/* Rainbow Instagram story gradient border */}
                  <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 shadow-md group-hover:scale-108 transition-transform duration-300">
                    <div className="p-0.5 bg-white rounded-full">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-13 h-13 sm:w-16 sm:h-16 rounded-full object-cover group-hover:opacity-90 transition-opacity"
                      />
                    </div>
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-gray-800 mt-1.5 group-hover:text-indriya-crimson transition-colors whitespace-nowrap">
                    {item.title}
                  </span>
                  <span className="text-[9px] text-gray-400 font-sans -mt-0.5">
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. THE GKJ PROMISES (SIDDIPET'S MOST TRUSTED JEWELLERY STORE SINCE 1958) */}
      {currentPage === 'home' && (
        <section className="bg-[#FAF7F2] py-14 border-b border-indriya-gold/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif italic text-3xl sm:text-4xl text-indriya-navy mb-2">
              The GKJ Promises
            </h2>
            <p className="text-xs text-indriya-crimson tracking-widest uppercase font-bold mb-10">
              Siddipet's Most Trusted Gold Showroom Since 1958
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 text-center">
              {/* Promise 1 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white border border-indriya-gold/40 flex items-center justify-center text-indriya-crimson mb-4 shadow-sm">
                  <ShieldCheck className="w-8 h-8 text-indriya-crimson stroke-[1.5]" />
                </div>
                <h3 className="font-serif font-bold text-lg text-indriya-navy mb-2">
                  100% BIS Hallmarked Purity
                </h3>
                <p className="text-xs text-charcoal-700 leading-relaxed max-w-xs">
                  Crafted with 68 years of family trust at Gattu Krishna Murthy Jewellers. Every single article carries 100% BIS 916 Hallmark certification with laser HUID.
                </p>
              </div>

              {/* Promise 2 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white border border-indriya-gold/40 flex items-center justify-center text-indriya-crimson mb-4 shadow-sm">
                  <Scale className="w-8 h-8 text-indriya-crimson stroke-[1.5]" />
                </div>
                <h3 className="font-serif font-bold text-lg text-indriya-navy mb-2">
                  Fair &amp; Transparent Pricing
                </h3>
                <p className="text-xs text-charcoal-700 leading-relaxed max-w-xs">
                  We offer a price breakup of each jewellery piece, reflecting the true cost of the materials and the craftsmanship.
                </p>
              </div>

              {/* Promise 3 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white border border-indriya-gold/40 flex items-center justify-center text-indriya-crimson mb-4 shadow-sm">
                  <RotateCcw className="w-8 h-8 text-indriya-crimson stroke-[1.5]" />
                </div>
                <h3 className="font-serif font-bold text-lg text-indriya-navy mb-2">
                  Hassle-free Exchanges
                </h3>
                <p className="text-xs text-charcoal-700 leading-relaxed max-w-xs">
                  'No Questions Asked' return, and lifetime exchange &amp; buyback, ensuring complete satisfaction.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. SHOP BY CATEGORY (CIRCULAR EDITORIAL SHOWCASE) */}
      {currentPage === 'home' && (
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-b border-indriya-gold/30">
          <div className="text-center mb-10">
            <span className="text-[11px] font-sans tracking-[0.25em] text-indriya-crimson font-bold uppercase block mb-1">CURATED MASTERPIECES</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-indriya-navy mt-1">Shop by Category</h2>
            <div className="w-16 h-0.5 bg-indriya-gold mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigateTo('category', cat.id)}
                className="group cursor-pointer flex flex-col items-center text-center"
              >
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-indriya-gold/40 shadow-md group-hover:shadow-xl group-hover:border-indriya-crimson transition-all duration-300 p-1 bg-white mb-3">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-serif font-bold text-sm text-indriya-navy group-hover:text-indriya-crimson transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-gray-500 mt-0.5 block">{cat.count}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. WEDDINGS BY SAI: REGIONAL BRIDAL MASTERPIECES (INDRIYA STYLE) */}
      {currentPage === 'home' && (
        <section className="py-14 bg-white border-b border-indriya-gold/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[11px] font-sans tracking-[0.25em] text-indriya-crimson font-bold uppercase block mb-1">
                WEDDINGS BY SAI
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-indriya-navy leading-tight">
                Regional Bridal Masterpieces
              </h2>
              <div className="w-16 h-0.5 bg-indriya-gold mx-auto mt-3 mb-2" />
              <p className="text-xs sm:text-sm text-charcoal-700">
                Every Indian culture. Every bride. Handcrafted 22KT temple gold, uncut Polki diamonds, and sacred Deccan filigree.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Deccan & Telugu Nizam',
                  subtitle: 'ANANTARA HEIRLOOMS',
                  desc: 'Goddess Lakshmi Kasu Malai, Guttapusalu Chokers & Solid Vaddanam.',
                  cat: 'bridal',
                  image: '/images/jewellery/bridal-jewellery-set.jpg'
                },
                {
                  title: 'Padma Ranjini',
                  subtitle: 'RAJPUTANA POLKI HAAR',
                  desc: 'Royal Jadau chokers, uncut diamonds, and handcrafted emerald drops.',
                  cat: 'bridal',
                  image: '/images/jewellery/gold-temple-necklace.jpg'
                },
                {
                  title: 'Raasvi & Western Heritage',
                  subtitle: 'ANTIQUE NAKSHI KADAS',
                  desc: 'Hand-carved Peacock screw bangles, Damini maang tikkas & chandbalis.',
                  cat: 'bangles',
                  image: '/images/jewellery/gold-antique-bangles.jpg'
                },
                {
                  title: 'Rajashree',
                  subtitle: 'MAHARASHTRIAN BRIDAL',
                  desc: 'Kolhapuri Saaj, traditional Thushi chokers, and pure gold bridal Nath.',
                  cat: 'bridal',
                  image: '/images/jewellery/feat-wedding.jpg'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => navigateTo('category', item.cat)}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-[#FAF7F2] border border-indriya-gold/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-64 overflow-hidden bg-stone-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 px-2.5 py-1 rounded-full text-[9px] text-indriya-lightgold font-bold tracking-wider uppercase border border-indriya-gold/30">
                      ✦ 22KT Pure Gold
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-[10px] font-sans tracking-[0.2em] text-indriya-crimson font-bold uppercase block mb-1">
                        {item.subtitle}
                      </span>
                      <h3 className="font-serif font-bold text-lg text-indriya-navy mb-1.5 group-hover:text-indriya-crimson transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-charcoal-700 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-indriya-gold/20 flex items-center justify-between text-xs font-bold text-indriya-navy group-hover:text-indriya-crimson">
                      <span>Explore Collection</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => navigateTo('category', 'bridal')}
                className="px-8 py-3.5 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>VIEW COMPLETE BRIDAL TROUSSEAU</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 7. THE GIFTING EDIT BY PRICE & OCCASION (INDRIYA STYLE) */}
      {currentPage === 'home' && (
        <section className="py-14 bg-[#FAF7F2] border-b border-indriya-gold/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[11px] font-sans tracking-[0.25em] text-indriya-crimson font-bold uppercase block mb-1">
                CELEBRATE MILESTONES
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-indriya-navy leading-tight">
                The Gifting Edit
              </h2>
              <div className="w-16 h-0.5 bg-indriya-gold mx-auto mt-3 mb-2" />
              <p className="text-xs sm:text-sm text-charcoal-700">
                Gifts of pure gold and certified diamonds that carry eternal love, delivered with complimentary bespoke velvet luxury packaging.
              </p>
            </div>

            {/* Price Tiers Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { tier: 'Under ₹25,000', label: 'Daily Gold & Studs', cat: 'earrings' },
                { tier: '₹25,000 - ₹50,000', label: 'Diamond Rings & Pendants', cat: 'rings' },
                { tier: '₹50,000 - ₹1,00,000', label: 'Gold Filigree Bangles', cat: 'bangles' },
                { tier: 'Above ₹1,00,000', label: 'Solitaires & Heirlooms', cat: 'necklaces' }
              ].map((t, idx) => (
                <div
                  key={idx}
                  onClick={() => navigateTo('category', t.cat)}
                  className="p-5 rounded-2xl bg-white border border-indriya-gold/40 shadow-sm hover:shadow-md hover:border-indriya-crimson cursor-pointer text-center transition-all group"
                >
                  <span className="text-[10px] text-indriya-crimson uppercase font-bold block mb-1">GIFTING TIER</span>
                  <h4 className="font-serif font-bold text-base sm:text-lg text-indriya-navy group-hover:text-indriya-crimson transition-colors">
                    {t.tier}
                  </h4>
                  <p className="text-xs text-charcoal-700 mt-1">{t.label}</p>
                </div>
              ))}
            </div>

            {/* Featured Gifting Banner Card */}
            <div className="bg-[#0A2240] rounded-3xl overflow-hidden border-2 border-indriya-gold/50 shadow-2xl grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-center bg-white text-left">
                <span className="text-[11px] font-sans tracking-[0.25em] text-indriya-crimson font-bold uppercase block mb-2">
                  SPECIAL OCCASIONS
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-indriya-navy leading-tight mb-4">
                  Give a gift they will treasure forever
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed mb-6">
                  From wedding anniversaries to milestone birthdays, celebrate the people who matter the most with certified 22KT gold heirlooms and certified natural solitaires.
                </p>
                <div>
                  <button
                    onClick={() => navigateTo('category', 'necklaces')}
                    className="px-7 py-3.5 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-md inline-flex items-center gap-2"
                  >
                    <span>EXPLORE GIFTING EDIT</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-indriya-navy">
                  <Sparkles className="w-4 h-4 text-indriya-gold" />
                  <span>✦ Complimentary Bespoke Velvet Gift Packaging Included</span>
                </div>
              </div>

              <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[420px] bg-[#07172b] overflow-hidden">
                <img
                  src="/images/jewellery/feat-gifting.jpg"
                  alt="Sai Jewellers Pure Gold Jewellery Gift Presentation"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-4 right-4 bg-black/60 px-4 py-2 rounded-full border border-indriya-gold/40 text-[11px] text-indriya-lightgold font-semibold">
                  ✦ 22KT Pure Gold &amp; Certified Solitaire Gift Edit
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8. SOLITAIRE SPARKLE LOUNGE (INDRIYA STYLE) */}
      {currentPage === 'home' && (
        <section className="py-14 bg-white border-b border-indriya-gold/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-indriya-gold/40 relative">
              <img
                src="/images/jewellery/hero-solitaire-sparkle.jpg"
                alt="Sai Jewellers Natural Solitaire Diamonds"
                className="w-full h-[380px] sm:h-[440px] object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full text-xs text-indriya-lightgold font-bold uppercase tracking-wider border border-indriya-gold/30">
                ✦ 100% Certified Natural Diamonds
              </div>
            </div>

            <div className="space-y-5 text-left">
              <span className="text-[11px] font-sans tracking-[0.25em] text-indriya-crimson font-bold uppercase block">
                THE SPARKLE LOUNGE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-indriya-navy leading-tight">
                Diamonds with the Highest SPARKLE, chosen especially for you.
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                Every solitaire in our atelier is hand-selected for extraordinary brilliance, cut, and fire. Certified by IGI and SGL with individual laser-inscribed girdle numbers for lifetime verification.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-indriya-gold/30">
                  <span className="font-bold text-sm text-indriya-navy block">0% Making Charges</span>
                  <span className="text-[11px] text-gray-500">On all solitaire engagement rings and diamond studs.</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-indriya-gold/30">
                  <span className="font-bold text-sm text-indriya-navy block">100% Exchange Value</span>
                  <span className="text-[11px] text-gray-500">Lifetime buyback &amp; upgrade guarantee across India.</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => navigateTo('category', 'rings')}
                  className="px-8 py-3.5 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-md inline-flex items-center gap-2"
                >
                  <span>EXPLORE SOLITAIRE DIAMONDS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 9. GOLDEN PROGRAMS & OLD GOLD EXCHANGE (INDRIYA STYLE) */}
      {currentPage === 'home' && (
        <section className="py-14 bg-[#FAF7F2] border-b border-indriya-gold/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[11px] font-sans tracking-[0.25em] text-indriya-crimson font-bold uppercase block mb-1">
                VALUE &amp; TRUST
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-indriya-navy leading-tight">
                Golden Programs &amp; 0% Old Gold Exchange
              </h2>
              <div className="w-16 h-0.5 bg-indriya-gold mx-auto mt-3 mb-2" />
              <p className="text-xs sm:text-sm text-charcoal-700">
                Protect yourself from gold price fluctuations with our smart rate-locking schemes and transparent old gold exchange.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Program 1: 25% Advance Rate Lock */}
              <div className="p-8 rounded-3xl bg-white border-2 border-indriya-gold/50 shadow-md flex flex-col justify-between text-left">
                <div>
                  <div className="w-12 h-12 rounded-full bg-amber-50 border border-indriya-gold/40 flex items-center justify-center text-indriya-crimson mb-4">
                    <Lock className="w-6 h-6 text-indriya-crimson" />
                  </div>
                  <span className="text-[10px] font-sans tracking-[0.2em] text-indriya-crimson font-bold uppercase block mb-1">SMART PURCHASE</span>
                  <h3 className="font-serif font-bold text-xl text-indriya-navy mb-2">
                    Pay 25% Advance &amp; Lock Today's Rate
                  </h3>
                  <p className="text-xs text-charcoal-700 leading-relaxed mb-4">
                    Lock in today's gold rate of <strong>₹{goldRates.rate22K.toLocaleString('en-IN')}/g (22KT)</strong>. If market gold prices surge before delivery, you pay today's locked lower price. If prices fall, you get the lower rate!
                  </p>
                  <ul className="space-y-1.5 text-xs text-gray-600 mb-6">
                    <li className="flex items-center gap-2">✦ Valid for up to 180 days with zero penalty</li>
                    <li className="flex items-center gap-2">✦ Ideal for upcoming weddings and festive seasons</li>
                  </ul>
                </div>
                <button
                  onClick={() => navigateTo('golden-programs')}
                  className="w-full py-3 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all text-center"
                >
                  Lock Today's Rate (₹{goldRates.rate22K}/g) →
                </button>
              </div>

              {/* Program 2: 0% Old Gold Exchange */}
              <div className="p-8 rounded-3xl bg-white border-2 border-indriya-gold/50 shadow-md flex flex-col justify-between text-left">
                <div>
                  <div className="w-12 h-12 rounded-full bg-amber-50 border border-indriya-gold/40 flex items-center justify-center text-indriya-crimson mb-4">
                    <RotateCcw className="w-6 h-6 text-indriya-crimson" />
                  </div>
                  <span className="text-[10px] font-sans tracking-[0.2em] text-indriya-crimson font-bold uppercase block mb-1">TRANSPARENT EXCHANGE</span>
                  <h3 className="font-serif font-bold text-xl text-indriya-navy mb-2">
                    0% Deduction on Old Gold Exchange
                  </h3>
                  <p className="text-xs text-charcoal-700 leading-relaxed mb-4">
                    Exchange your old gold jewellery of any karat purity (from any jeweller) with zero melting loss and zero weight deduction, tested transparently on certified German Karatmeters.
                  </p>
                  <ul className="space-y-1.5 text-xs text-gray-600 mb-6">
                    <li className="flex items-center gap-2">✦ 100% full market value credited against live IBJA rate</li>
                    <li className="flex items-center gap-2">✦ Instant computerized purity certificate provided</li>
                  </ul>
                </div>
                <button
                  onClick={() => setIsTodayGoldRateOpen(true)}
                  className="w-full py-3 bg-[#FAF7F2] hover:bg-stone-100 text-indriya-navy border border-indriya-gold/60 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all text-center"
                >
                  Check Today's Exchange Rate →
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 10. 68+ YEARS OF GENERATIONAL TRUST & CRAFTSMANSHIP IN SIDDIPET */}
      {currentPage === 'home' && (
        <section className="bg-white py-16 border-b border-indriya-gold/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[11px] font-sans tracking-[0.25em] text-indriya-crimson font-bold uppercase block mb-1">
                ESTD. 1958 • SIDDIPET
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-indriya-navy mt-1">
                68+ Years of Generational Trust &amp; Goldsmithing
              </h2>
              <div className="w-16 h-0.5 bg-indriya-gold mt-3 mb-6" />
              <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed mb-4">
                Established in 1958 in Siddipet, Gattu Krishna Murthy Jewellers (GKJ) has been the cornerstone of pure gold artistry and family trust for over 68 years. Renowned for custom bridal designs, sacred temple haars, and delicate beads jewellery, every creation reflects meticulous Telugu goldsmithing.
              </p>
              <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed mb-8">
                Every single ornament carries 100% BIS 916 Hallmark certification with unique laser-inscribed HUID numbers, backed by our sister boutique @gksilver for fine 925 sterling silver pooja articles.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-2 border-t border-gray-100">
                <div>
                  <h4 className="font-serif font-bold text-2xl text-indriya-navy">68+</h4>
                  <p className="text-xs text-gray-500">Years of Generational Trust</p>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-2xl text-indriya-navy">100%</h4>
                  <p className="text-xs text-gray-500">BIS 916 Hallmarked</p>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-2xl text-indriya-navy">Custom</h4>
                  <p className="text-xs text-gray-500">Bridal &amp; Beads Jewellery</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-indriya-gold/40 relative group">
              <img
                src="/images/jewellery/craftsmanship-goldsmith.jpg"
                alt="Gattu Krishna Murthy Jewellers Goldsmith Bench"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md p-3.5 rounded-2xl border border-indriya-gold/40 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.jpg" alt="GKJ" className="w-9 h-9 rounded-xl object-contain bg-[#07281f] p-0.5 border border-indriya-gold" />
                  <div>
                    <span className="font-serif font-bold text-xs text-indriya-lightgold block">Gattu Krishna Murthy Jewellers</span>
                    <span className="text-[10px] text-gray-300">Trusted Jewellery Store in Town • Siddipet</span>
                  </div>
                </div>
                <a
                  href="https://www.instagram.com/gattu_krishna_murthy_jewellers/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold uppercase rounded-lg shadow"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 11. SIDDIPET FLAGSHIP SHOWROOM & VIP EXPERIENCE */}
      {currentPage === 'home' && (
        <section className="py-14 bg-[#FAF7F2] border-b border-indriya-gold/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5 text-left">
              <span className="text-[11px] font-sans tracking-[0.25em] text-indriya-crimson font-bold uppercase block">
                FLAGSHIP SHOWROOM
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-indriya-navy leading-tight">
                Visit Our Grand Showroom in Siddipet
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                Step into our trusted showroom in Siddipet. Explore exclusive bridal chokers, custom guttapusalu haars, 916 jhumkas, and sacred 925 silver pooja articles at our sister brand @gksilver.
              </p>
              
              <div className="space-y-2 text-xs text-gray-700 pt-1">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-indriya-crimson shrink-0 mt-0.5" />
                  <span>Paripally Street / Kaman Road, Siddipet - 502103, Telangana</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-indriya-gold shrink-0" />
                  <span>Open Daily: 10:30 AM – 9:00 PM (Monday to Sunday)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-indriya-navy shrink-0" />
                  <span>Concierge Direct: +91 90300 33552</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-3">
                <a
                  href="tel:+919030033552"
                  className="px-6 py-3 bg-[#E05326] hover:bg-[#C8451B] text-white rounded-full text-xs font-bold tracking-widest uppercase shadow-md flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call 9030033552</span>
                </a>
                <a
                  href="https://wa.me/919030033552?text=Hello%20Gattu%20Krishna%20Murthy%20Jewellers,%20I%20would%20like%20to%20inquire%20about%20your%20gold%20jewellery%20collection."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold tracking-widest uppercase shadow-md flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>WhatsApp Video</span>
                </a>
                <button
                  onClick={() => setIsAppointmentOpen(true)}
                  className="px-6 py-3 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold rounded-full text-xs font-bold tracking-widest uppercase shadow-md flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Private VIP Viewing</span>
                </button>
                <button
                  onClick={() => navigateTo('store')}
                  className="px-6 py-3 bg-white hover:bg-stone-50 text-indriya-navy border border-indriya-gold/50 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm flex items-center gap-2"
                >
                  <span>Get Showroom Directions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-indriya-gold/40">
              <img
                src="/images/jewellery/about-heritage.jpg"
                alt="Gattu Krishna Murthy Jewellers Siddipet Showroom"
                className="w-full h-[360px] sm:h-[400px] object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* 12. REAL BRIDES OF SAI: CUSTOMER TESTIMONIALS (INDRIYA STYLE) */}
      {currentPage === 'home' && (
        <section className="py-14 bg-white border-b border-indriya-gold/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-[11px] font-sans tracking-[0.25em] text-indriya-crimson font-bold uppercase block mb-1">
              VOICES OF TRUST
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-indriya-navy leading-tight">
              Cherished by Brides &amp; Connoisseurs
            </h2>
            <div className="w-16 h-0.5 bg-indriya-gold mx-auto mt-3 mb-10" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                {
                  quote: "The 0% old gold exchange was totally transparent. Their German Karatmeter tested my mother's 30-year-old bangles right in front of us without melting, and gave us full market value for our daughter's wedding choker!",
                  author: "Dr. Ananya & Vikram Varma",
                  location: "Jubilee Hills, Hyderabad",
                  item: "Deccan Temple Guttapusalu Choker"
                },
                {
                  quote: "Found my dream Telugu bridal jewellery set here. The 100% BIS 916 Hallmark with unique HUID and complete price breakup (metal + making + GST) gave my family total peace of mind.",
                  author: "Sravanthi Reddy",
                  location: "Banjara Hills, Hyderabad",
                  item: "Royal Padmika Bridal Trousseau"
                },
                {
                  quote: "We joined the 11+1 Golden Program. Paying monthly installments for 11 months with the 12th month bonus on Gattu Krishna Murthy Jewellers made buying our diamond solitaire engagement ring effortless.",
                  author: "Rajesh & Priya Vuppala",
                  location: "Siddipet, Telangana",
                  item: "Certified Solitaire Diamond Ring"
                }
              ].map((test, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#FAF7F2] border border-indriya-gold/30 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 text-amber-500 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-charcoal-700 leading-relaxed italic mb-4">
                      "{test.quote}"
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <h5 className="font-bold text-sm text-indriya-navy">{test.author}</h5>
                    <p className="text-[11px] text-gray-500">{test.location}</p>
                    <span className="text-[10px] text-indriya-crimson font-bold uppercase tracking-wider mt-1 block">
                      ✦ Verified Purchase: {test.item}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 13. FREQUENTLY ASKED QUESTIONS (ACCORDION LIKE INDRIYA) */}
      {currentPage === 'home' && (
        <section className="py-14 bg-[#FAF7F2] border-b border-indriya-gold/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-[11px] font-sans tracking-[0.25em] text-indriya-crimson font-bold uppercase block mb-1">
                KNOWLEDGE &amp; CLARITY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-indriya-navy leading-tight">
                Frequently Asked Questions
              </h2>
              <div className="w-16 h-0.5 bg-indriya-gold mx-auto mt-3 mb-2" />
              <p className="text-xs sm:text-sm text-charcoal-700">
                Everything you need to know about purchasing fine gold and certified jewellery at Gattu Krishna Murthy Jewellers.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: "What is BIS 916 Hallmark and HUID, and is it available on every piece?",
                  a: "Yes. Every single piece of gold jewellery at Gattu Krishna Murthy Jewellers is 100% BIS Hallmarked and carries a unique 6-digit laser-inscribed Hallmark Unique Identification (HUID) number mandated by the Bureau of Indian Standards. You can verify this number instantly on the official BIS Care App."
                },
                {
                  q: "How are today's live gold rates calculated?",
                  a: "Our rates are benchmarked directly against live Telangana gold bullion market rates, updated live daily at 12:00 PM IST. We maintain transparent pricing with a clear itemized breakup of pure metal value, making charges, and 3% GST."
                },
                {
                  q: "How does the 0% Old Gold Exchange work on any karat?",
                  a: "Bring your old jewellery (from any jeweller) to our Siddipet showroom. We test the purity in front of you using calibrated non-destructive German XRF Karatmeters without any melting loss. 100% of the tested pure gold value is credited towards your new purchase with zero deduction."
                },
                {
                  q: "Are the solitaire diamonds natural and certified?",
                  a: "All diamonds sold by Gattu Krishna Murthy Jewellers are 100% natural, ethically mined, and certified by renowned gemological laboratories such as IGI (International Gemological Institute) and SGL, complete with unique laser-inscribed certificates."
                },
                {
                  q: "How can I book a VIP appointment at the Siddipet showroom?",
                  a: "You can click 'Book VIP Showroom Visit' anywhere on our website or call +91 90300 33552, select your preferred date and time, and our VIP concierge team will confirm your private bridal suite and prepare curated selections in advance."
                }
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-indriya-gold/30 bg-white overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex justify-between items-center gap-4 hover:bg-stone-50 transition-colors"
                  >
                    <span className="font-serif font-bold text-sm sm:text-base text-indriya-navy">
                      {faq.q}
                    </span>
                    <span className="w-6 h-6 rounded-full bg-[#FAF7F2] border border-indriya-gold/40 flex items-center justify-center text-indriya-navy shrink-0 font-bold text-xs">
                      {openFaqIndex === idx ? '−' : '+'}
                    </span>
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-charcoal-700 leading-relaxed border-t border-indriya-gold/20 bg-[#FAF7F2]/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== DEDICATED MULTI-PAGE VIEWS ==================== */}

      {/* PAGE: DEDICATED CATEGORY PAGE */}
      {currentPage === 'category' && (
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 animate-fadeIn">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <button onClick={() => navigateTo('home')} className="hover:text-indriya-navy font-medium">Home</button>
            <span>/</span>
            <span className="text-indriya-navy font-bold capitalize">{selectedCategory} Jewellery</span>
          </div>

          {/* Category Hero Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-[#0A2240] text-white p-8 sm:p-12 mb-10 shadow-xl border border-indriya-gold/40">
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs uppercase font-bold tracking-widest text-indriya-lightgold block mb-2">
                SAI JEWELLERS • HAUTE JOAILLERIE
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight mb-3 capitalize">
                {selectedCategory === 'necklaces' ? '22KT Gold Necklaces & Chokers' :
                 selectedCategory === 'rings' ? 'Certified Natural Diamonds & Solitaires' :
                 selectedCategory === 'bangles' ? 'Antique Gold Bangles & Kadas' :
                 selectedCategory === 'earrings' ? 'Jhumkas & Polki Chandbalis' :
                 selectedCategory === 'bridal' ? 'Grand Bridal Trousseau' :
                 selectedCategory === 'silver' ? 'Pure 925 Sterling Silver Articles' :
                 `${selectedCategory} Collection`}
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                Every creation is sculpted in pure 22KT gold or certified natural solitaires, certified with BIS 916 Hallmark and unique laser-inscribed HUID.
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  ✦ Live 22KT Rate: ₹{goldRates.rate22K.toLocaleString('en-IN')}/g
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  ✦ Up to 30% Off Making Charges
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  ✦ 0% Deduction Old Gold Exchange
                </span>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 gap-4 flex-wrap">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => navigateTo('category', 'all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === 'all' ? 'bg-indriya-navy text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                All Heirlooms
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigateTo('category', c.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === c.id ? 'bg-indriya-navy text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Showing {filteredProducts.length} certified designs
            </span>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl overflow-hidden border border-indriya-gold/30 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div
                    className="relative aspect-square overflow-hidden bg-[#FAF7F2] cursor-pointer"
                    onClick={() => navigateTo('product', 'all', p.id)}
                  >
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0A2240]/90 text-indriya-lightgold backdrop-blur-sm border border-indriya-gold/40">
                        {p.goldPurity} PURE
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-indriya-navy shadow-md transition-all"
                    >
                      <Heart className={`w-4 h-4 ${wishlist.includes(p.id) ? 'fill-indriya-crimson text-indriya-crimson' : ''}`} />
                    </button>
                  </div>

                  <div className="p-5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-indriya-gold block mb-1">
                      {p.collection || 'Heirloom Edition'}
                    </span>
                    <h3
                      onClick={() => navigateTo('product', 'all', p.id)}
                      className="font-serif font-bold text-base text-indriya-navy hover:text-indriya-crimson transition-colors cursor-pointer line-clamp-1"
                    >
                      {p.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{p.subtitle}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-600 bg-[#FAF7F2] p-2 rounded-xl border border-gray-100">
                      <span>Weight: <strong className="text-gray-900">{p.grossWeight}g</strong></span>
                      <span>BIS 916 HUID</span>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                      <span className="text-xl font-bold text-indriya-navy">₹{p.price.toLocaleString('en-IN')}</span>
                      <button
                        onClick={() => navigateTo('product', 'all', p.id)}
                        className="text-[11px] font-bold text-indriya-crimson hover:underline"
                      >
                        View Heirloom Details →
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addToCart(p)}
                    className="py-2.5 px-4 rounded-xl bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                  <button
                    onClick={() => navigateTo('product', 'all', p.id)}
                    className="py-2.5 px-4 rounded-xl border border-indriya-gold/60 text-indriya-navy hover:bg-[#FAF7F2] text-xs font-bold uppercase tracking-wider transition-all text-center"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PAGE: DEDICATED FULL PRODUCT DETAIL PAGE (PDP) */}
      {currentPage === 'product' && activeProduct && (
        <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 animate-fadeIn">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 flex-wrap">
            <button onClick={() => navigateTo('home')} className="hover:text-indriya-navy font-medium">Home</button>
            <span>/</span>
            <button onClick={() => navigateTo('category', activeProduct.category)} className="hover:text-indriya-navy font-medium capitalize">
              {activeProduct.category}
            </button>
            <span>/</span>
            <span className="text-indriya-navy font-bold">{activeProduct.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Sticky Image Showcase Gallery */}
            <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#FAF7F2] border border-indriya-gold/30 shadow-lg group">
                <img
                  src={activeProduct.images[0]}
                  alt={activeProduct.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0A2240] text-indriya-lightgold shadow-md">
                    {activeProduct.goldPurity} BIS 916 HALLMARKED
                  </span>
                  {activeProduct.isBestSeller && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indriya-crimson text-white shadow-md">
                      BESTSELLER HEIRLOOM
                    </span>
                  )}
                </div>
              </div>

              {activeProduct.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {activeProduct.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-indriya-gold/40 hover:border-indriya-crimson cursor-pointer shadow-sm transition-all flex-shrink-0"
                    >
                      <img src={img} alt={`${activeProduct.name} angle ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details, Pricing, & Customization */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-indriya-gold block mb-1">
                  {activeProduct.collection || 'Heirloom Masterpiece'}
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-indriya-navy leading-tight">
                  {activeProduct.name}
                </h1>
                {activeProduct.subtitle && (
                  <p className="text-sm text-gray-600 mt-1">{activeProduct.subtitle}</p>
                )}
                <div className="mt-3 flex items-center gap-3 text-xs">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full font-bold flex items-center gap-1 border border-emerald-200">
                    ★ {activeProduct.rating} ({activeProduct.reviewCount} Verified Reviews)
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">SKU: <strong className="text-gray-700">{activeProduct.sku}</strong></span>
                </div>
              </div>

              {/* Dynamic Live Price Block */}
              <div className="bg-[#FAF7F2] p-5 rounded-3xl border border-indriya-gold/40 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-bold text-indriya-navy">
                      ₹{activeProduct.price.toLocaleString('en-IN')}
                    </span>
                    {activeProduct.originalPrice && (
                      <span className="text-sm text-gray-400 line-through ml-3">
                        ₹{activeProduct.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-indriya-crimson bg-red-50 px-3 py-1 rounded-full border border-red-200">
                    Save up to 30% on Making
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">
                  (Inclusive of all taxes & 3% Hallmarked GST. Real-time rate: <strong>₹{goldRates.rate22K.toLocaleString('en-IN')}/g</strong>)
                </p>

                {/* Transparent Price Breakup Table */}
                <div className="pt-3 border-t border-indriya-gold/20 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Gold Metal Cost ({activeProduct.grossWeight}g @ ₹{goldRates.rate22K}/g):</span>
                    <strong className="text-indriya-navy">₹{Math.round(activeProduct.grossWeight * goldRates.rate22K).toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Making Charges ({activeProduct.makingChargePercent || 12}%):</span>
                    <strong className="text-indriya-navy">₹{Math.round(activeProduct.grossWeight * goldRates.rate22K * ((activeProduct.makingChargePercent || 12) / 100)).toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (3% Hallmarked Invoice):</span>
                    <strong className="text-indriya-navy">₹{Math.round((activeProduct.grossWeight * goldRates.rate22K * (1 + ((activeProduct.makingChargePercent || 12) / 100))) * 0.03).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { addToCart(activeProduct); navigateTo('cart'); }}
                    className="py-3.5 px-6 rounded-2xl bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>
                  <button
                    onClick={() => {
                      addToCart(activeProduct);
                      setIsCheckoutOpen(true);
                    }}
                    className="py-3.5 px-6 rounded-2xl bg-indriya-crimson hover:bg-indriya-darkred text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Buy Now</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsAppointmentOpen(true)}
                  className="w-full py-3 rounded-2xl border-2 border-indriya-gold text-indriya-navy hover:bg-[#FAF7F2] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-indriya-crimson" />
                  <span>Book VIP Viewing at Siddipet Flagship</span>
                </button>
              </div>

              {/* 4 Guarantees */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 text-xs">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50">
                  <Award className="w-4 h-4 text-indriya-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-indriya-navy block">100% BIS 916 Hallmark</span>
                    <span className="text-[10px] text-gray-500">Laser HUID on every article</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50">
                  <RefreshCw className="w-4 h-4 text-indriya-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-indriya-navy block">0% Deduction Exchange</span>
                    <span className="text-[10px] text-gray-500">100% value on old gold</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50">
                  <Truck className="w-4 h-4 text-indriya-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-indriya-navy block">Insured Armored Transit</span>
                    <span className="text-[10px] text-gray-500">Safe doorstep delivery</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50">
                  <Sparkles className="w-4 h-4 text-indriya-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-indriya-navy block">Lifetime Free Service</span>
                    <span className="text-[10px] text-gray-500">Complimentary cleaning</span>
                  </div>
                </div>
              </div>

              {/* Product Specifications Table */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-serif font-bold text-sm text-indriya-navy mb-3">Heirloom Specifications</h4>
                <div className="divide-y divide-gray-100 text-xs">
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-500">Gross Weight:</span>
                    <strong className="text-indriya-navy">{activeProduct.grossWeight} grams</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-500">Net Gold Weight:</span>
                    <strong className="text-indriya-navy">{activeProduct.netWeight} grams</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-500">Gold Purity:</span>
                    <strong className="text-indriya-navy">{activeProduct.purityDetail || '22KT Yellow Gold (916 BIS Hallmark)'}</strong>
                  </div>
                  {activeProduct.diamondWeight && (
                    <div className="py-2 flex justify-between">
                      <span className="text-gray-500">Diamond / Polki Carat:</span>
                      <strong className="text-indriya-navy">{activeProduct.diamondWeight} Carats ({activeProduct.diamondClarity})</strong>
                    </div>
                  )}
                  {activeProduct.gemstoneDetail && (
                    <div className="py-2 flex justify-between">
                      <span className="text-gray-500">Gemstones:</span>
                      <strong className="text-indriya-navy">{activeProduct.gemstoneDetail}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Craftsmanship Note */}
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-indriya-gold/30 text-xs">
                <span className="font-bold text-indriya-navy block mb-1">Goldsmith's Bench Note</span>
                <p className="text-gray-700 leading-relaxed">{activeProduct.craftsmanshipStory}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PAGE: DEDICATED GOLDEN PROGRAMS PAGE */}
      {currentPage === 'golden-programs' && (
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <button onClick={() => navigateTo('home')} className="hover:text-indriya-navy font-medium">Home</button>
            <span>/</span>
            <span className="text-indriya-navy font-bold">Golden Programs & Savings Schemes</span>
          </div>

          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-indriya-crimson block mb-2">
              SAI JEWELLERS SAVINGS INITIATIVES
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-indriya-navy leading-tight mb-4">
              Golden Programs & Gold Rate Protection Plans
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Invest wisely in 22KT pure gold heirlooms with flexible monthly savings, rate lock guarantees, and 100% net weight value on your old gold.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-3xl p-8 border-2 border-indriya-gold/40 shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-indriya-crimson flex items-center justify-center text-xl font-bold mb-4">
                  💰
                </div>
                <h3 className="font-serif font-bold text-xl text-indriya-navy mb-2">Sai Swarna Nidhi</h3>
                <span className="text-xs font-bold text-indriya-crimson block mb-4">11-Month Jewellery Purchase Plan</span>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">
                  Deposit a fixed monthly installment starting from ₹2,000 for 11 months. On maturity, enjoy a massive discount on making charges on your dream gold jewellery.
                </p>
                <ul className="space-y-2 text-xs text-gray-700 mb-6">
                  <li className="flex items-center gap-2">✓ Monthly payments via UPI or Net Banking</li>
                  <li className="flex items-center gap-2">✓ Protection against gold price inflation</li>
                  <li className="flex items-center gap-2">✓ Bonus savings on making charges</li>
                </ul>
              </div>
              <button
                onClick={() => setIsAppointmentOpen(true)}
                className="w-full py-3 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all"
              >
                Enroll In Scheme
              </button>
            </div>

            <div className="bg-white rounded-3xl p-8 border-2 border-indriya-crimson shadow-xl flex flex-col justify-between relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indriya-crimson text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-sm">
                MOST POPULAR FOR WEDDINGS
              </span>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-indriya-crimson flex items-center justify-center text-xl font-bold mb-4">
                  🔒
                </div>
                <h3 className="font-serif font-bold text-xl text-indriya-navy mb-2">25% Advance Rate Lock</h3>
                <span className="text-xs font-bold text-indriya-crimson block mb-4">Lock Today's Rate (₹{goldRates.rate22K}/g)</span>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">
                  Planning a wedding in the coming months? Pay just 25% advance today to lock in today's gold rate. If rates rise, you pay the locked rate; if rates fall, you get the lower rate!
                </p>
                <ul className="space-y-2 text-xs text-gray-700 mb-6">
                  <li className="flex items-center gap-2">✓ Complete rate hedge for upcoming weddings</li>
                  <li className="flex items-center gap-2">✓ Lowest rate advantage on delivery</li>
                  <li className="flex items-center gap-2">✓ Valid up to 180 days from booking</li>
                </ul>
              </div>
              <button
                onClick={() => setIsAppointmentOpen(true)}
                className="w-full py-3 bg-indriya-crimson hover:bg-indriya-darkred text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all"
              >
                Lock Today's Rate
              </button>
            </div>

            <div className="bg-white rounded-3xl p-8 border-2 border-indriya-gold/40 shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-xl font-bold mb-4">
                  ♻️
                </div>
                <h3 className="font-serif font-bold text-xl text-indriya-navy mb-2">0% Deduction Old Gold</h3>
                <span className="text-xs font-bold text-emerald-700 block mb-4">Instant Karatmeter Valuation</span>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">
                  Bring your family gold jewellery of any karat or origin. We melt and test in front of you using advanced German Karatmeters with 0% deduction on net purity.
                </p>
                <ul className="space-y-2 text-xs text-gray-700 mb-6">
                  <li className="flex items-center gap-2">✓ 100% transparent live testing</li>
                  <li className="flex items-center gap-2">✓ No wastage deduction on exchange</li>
                  <li className="flex items-center gap-2">✓ Instant credit towards new masterpieces</li>
                </ul>
              </div>
              <button
                onClick={() => setIsAppointmentOpen(true)}
                className="w-full py-3 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all"
              >
                Book Karatmeter Test
              </button>
            </div>
          </div>
        </section>
      )}

      {/* PAGE: DEDICATED STORE LOCATOR PAGE */}
      {currentPage === 'store' && (
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <button onClick={() => navigateTo('home')} className="hover:text-indriya-navy font-medium">Home</button>
            <span>/</span>
            <span className="text-indriya-navy font-bold">Flagship Showroom & Store Locator</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border-2 border-indriya-gold/40 shadow-xl space-y-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-indriya-crimson block mb-2">
                  HAUTE JOAILLERIE FLAGSHIP
                </span>
                <h1 className="font-serif text-3xl font-bold text-indriya-navy leading-tight">
                  Siddipet Flagship Showroom
                </h1>
                <p className="text-xs text-gray-500 mt-1">68+ Years of Generational Trust in Siddipet • Estd. 1958</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3 p-4 bg-[#FAF7F2] rounded-2xl border border-gray-100">
                  <MapPin className="w-5 h-5 text-indriya-crimson flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-indriya-navy block text-sm">Showroom Address:</strong>
                    <p className="text-gray-700 mt-0.5 leading-relaxed">
                      Gattu Krishna Murthy Jewellers, Paripally Street / Kaman Road, Siddipet, Telangana 502103
                    </p>
                    <span className="text-gray-500 block mt-1">Landmark: Paripally Street / Kaman Road area • Sister boutique @gksilver</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-gray-100">
                    <span className="font-bold text-indriya-navy block mb-1">Opening Hours</span>
                    <p className="text-gray-600">Monday – Sunday</p>
                    <strong className="text-indriya-crimson block mt-1">10:30 AM – 9:00 PM</strong>
                  </div>
                  <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-gray-100">
                    <span className="font-bold text-indriya-navy block mb-1">Direct Telephones</span>
                    <a href="tel:+919030033552" className="text-gray-900 font-bold hover:underline block">+91 90300 33552</a>
                    <a href="https://wa.me/919030033552" target="_blank" rel="noreferrer" className="text-green-600 font-semibold hover:underline block">WhatsApp Available</a>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/50 rounded-2xl border border-indriya-gold/30">
                  <span className="font-bold text-indriya-navy block mb-1">Showroom Amenities</span>
                  <div className="grid grid-cols-2 gap-2 text-gray-700 pt-1">
                    <span>✓ Valet Parking Available</span>
                    <span>✓ Private Bridal Suite</span>
                    <span>✓ German Karatmeter Testing</span>
                    <span>✓ Certified Gemologist on Bench</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#0A2240] text-white p-8 sm:p-10 rounded-3xl border border-indriya-gold/40 shadow-xl">
              <span className="text-xs uppercase font-bold tracking-widest text-indriya-lightgold block mb-2">
                PERSONALIZED CONCIERGE
              </span>
              <h3 className="font-serif text-2xl font-bold mb-2">Book a Private Bridal Consultation</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-6">
                Reserve our private high-jewellery lounge for your bridal party with bespoke customization and rate locking.
              </p>

              <form onSubmit={(e) => {
                e.preventDefault();
                showToast('Appointment booked successfully! Our concierge will call you.');
                navigateTo('home');
              }} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">Your Full Name</label>
                  <input required type="text" placeholder="e.g. Smt. Lakshmi Rao" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-indriya-gold text-sm" />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">Phone Number</label>
                  <input required type="tel" placeholder="+91 98490 XXXXX" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-indriya-gold text-sm" />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">Preferred Date & Time</label>
                  <input required type="datetime-local" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-indriya-gold text-sm" />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-indriya-gold hover:bg-indriya-brightgold text-[#0A2240] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all mt-2"
                >
                  Confirm Showroom Appointment
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* PAGE: DEDICATED SHOPPING BAG & CHECKOUT PAGE */}
      {currentPage === 'cart' && (
        !customerUser ? (
          <section className="py-20 max-w-lg mx-auto px-4 text-center flex-1 flex flex-col items-center justify-center animate-fadeIn">
            <div className="w-20 h-20 bg-indriya-gold/20 text-indriya-crimson rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-indriya-navy" />
            </div>
            <span className="text-[11px] font-bold tracking-[0.25em] text-indriya-crimson uppercase block mb-1">
              WELCOME OFFER
            </span>
            <h2 className="font-serif text-3xl font-bold text-indriya-navy mb-2">
              Sign In to View Your Bag
            </h2>
            <p className="text-xs text-charcoal-700 leading-relaxed mb-6 max-w-sm">
              Please sign up or log in to view your shopping bag, redeem your ₹500 welcome credit, and proceed to insured checkout.
            </p>
            <button
              onClick={() => {
                setAuthIntent({ type: 'open_cart' });
                setAuthMode('signup');
                setIsAuthModalOpen(true);
              }}
              className="px-8 py-3.5 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold font-bold text-xs uppercase tracking-widest rounded-full shadow-xl transition-all flex items-center gap-2"
            >
              <span>Sign Up / Log In (Claim ₹500)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </section>
        ) : (
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <button onClick={() => navigateTo('home')} className="hover:text-indriya-navy font-medium">Home</button>
            <span>/</span>
            <span className="text-indriya-navy font-bold">Shopping Bag & Checkout</span>
          </div>

          <h1 className="font-serif text-3xl font-bold text-indriya-navy mb-8">
            Your Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
          </h1>

          {cart.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-indriya-gold/30 p-8 shadow-sm">
              <ShoppingBag className="w-16 h-16 text-indriya-gold mx-auto mb-4" />
              <h3 className="font-serif font-bold text-xl text-indriya-navy">Your Bag is Empty</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-2 mb-6">
                Explore our handcrafted 22KT gold necklaces, antique kadas, solitaires, and bridal trousseau.
              </p>
              <button
                onClick={() => navigateTo('category', 'necklaces')}
                className="px-8 py-3 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-md"
              >
                Browse Jewellery Catalogue
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-5">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 rounded-xl object-cover bg-[#FAF7F2]" />
                    <div className="flex-1">
                      <span className="text-[10px] uppercase font-bold text-indriya-gold">{item.product.goldPurity} PURE</span>
                      <h4 className="font-serif font-bold text-sm text-indriya-navy">{item.product.name}</h4>
                      <p className="text-xs text-gray-500">{item.product.grossWeight}g • BIS 916 Hallmark</p>
                      <span className="text-sm font-bold text-indriya-crimson mt-1 block">₹{item.product.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => removeFromCart(item.product.id)} className="p-1.5 rounded-full text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border-2 border-indriya-gold/40 shadow-xl space-y-4">
                <h3 className="font-serif font-bold text-lg text-indriya-navy pb-3 border-b border-gray-100">
                  Order Summary
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <strong className="text-indriya-navy">₹{cartSubtotal.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Hallmarked 3% GST:</span>
                    <strong className="text-indriya-navy">₹{cartGST.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Insured Armored Delivery:</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t-2 border-indriya-gold/30 text-base font-bold">
                    <span className="font-serif text-indriya-navy">Total Amount:</span>
                    <span className="text-indriya-crimson">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all mt-4"
                >
                  Proceed to Secure Checkout
                </button>
              </div>
            </div>
          )}
        </section>
        )
      )}

      {/* PAGE: DEDICATED WISHLIST PAGE */}
      {currentPage === 'wishlist' && (
        !customerUser ? (
          <section className="py-20 max-w-lg mx-auto px-4 text-center flex-1 flex flex-col items-center justify-center animate-fadeIn">
            <div className="w-20 h-20 bg-indriya-gold/20 text-indriya-crimson rounded-full flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-indriya-crimson" />
            </div>
            <span className="text-[11px] font-bold tracking-[0.25em] text-indriya-crimson uppercase block mb-1">
              WELCOME OFFER
            </span>
            <h2 className="font-serif text-3xl font-bold text-indriya-navy mb-2">
              Sign In to Access Your Wishlist
            </h2>
            <p className="text-xs text-charcoal-700 leading-relaxed mb-6 max-w-sm">
              Please sign up or log in to view your saved jewels, claim your ₹500 welcome credit, and access digital HUID certificates.
            </p>
            <button
              onClick={() => {
                setAuthIntent({ type: 'open_wishlist' });
                setAuthMode('signup');
                setIsAuthModalOpen(true);
              }}
              className="px-8 py-3.5 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold font-bold text-xs uppercase tracking-widest rounded-full shadow-xl transition-all flex items-center gap-2"
            >
              <span>Sign Up / Log In (Claim ₹500)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </section>
        ) : (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 animate-fadeIn">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-indriya-navy">
                My Saved Wishlist ({wishlist.length})
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Your personal curated selection of fine gold, diamond and silver masterpieces
              </p>
            </div>
            {wishlist.length > 0 && (
              <button
                onClick={() => setWishlist([])}
                className="text-xs font-semibold text-red-500 hover:text-red-700"
              >
                Clear All
              </button>
            )}
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-indriya-gold/30 p-8 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border-2 border-indriya-gold/50 flex items-center justify-center mx-auto mb-4 text-indriya-gold">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-indriya-navy">Your Wishlist is Currently Empty</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-2 mb-6">
                Explore our handcrafted 22KT gold necklaces, antique kadas, solitaires, and bridal trousseau to save your favourite heirlooms.
              </p>
              <button
                onClick={() => navigateTo('category', 'necklaces')}
                className="px-8 py-3 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-md"
              >
                Explore Jewellery Catalogue
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl overflow-hidden border border-indriya-gold/30 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-square overflow-hidden bg-[#FAF7F2] cursor-pointer" onClick={() => navigateTo('product', 'all', p.id)}>
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-red-500 shadow-md"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-5">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-indriya-gold block mb-1">{p.goldPurity} PURE</span>
                      <h4 className="font-serif font-bold text-base text-indriya-navy hover:text-indriya-crimson transition-colors cursor-pointer" onClick={() => navigateTo('product', 'all', p.id)}>
                        {p.name}
                      </h4>
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                        <span>Weight: <strong>{p.grossWeight}g</strong></span>
                        <span>BIS 916 HUID</span>
                      </div>
                      <div className="mt-3 text-lg font-bold text-indriya-crimson">
                        ₹{p.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => { addToCart(p); toggleWishlist(p.id); }}
                      className="w-full py-2.5 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" /> Move to Bag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        )
      )}

      {/* 8. LUXURY FOOTER (WITH HIGHLIGHTED LOGO & INSTAGRAM BIO) */}
      <footer className="bg-[#07192f] text-white pt-16 pb-12 border-t-2 border-indriya-gold/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
            <div>
              {/* Highlighted Brand Logo with Double Gold Halo Ring */}
              <div className="flex items-center gap-3.5 mb-4">
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 rounded-2xl blur-sm opacity-80"></div>
                  <img
                    src="/logo.jpg"
                    alt="Gattu Krishna Murthy Jewellers Official Logo"
                    className="relative w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-2xl ring-2 ring-indriya-gold bg-[#07281f] p-1 shadow-2xl"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-amber-500 text-[8px] font-extrabold text-white px-1.5 py-0.2 rounded-full border border-white shadow-sm font-sans tracking-tight">
                    916
                  </span>
                </div>
                <div>
                  <span className="font-serif text-xl sm:text-2xl font-black text-indriya-lightgold tracking-wider block leading-tight">
                    GATTU KRISHNA MURTHY
                  </span>
                  <span className="text-[9px] font-sans tracking-[0.25em] text-amber-400 font-extrabold uppercase block mt-0.5">
                    JEWELLERS • SIDDIPET • ESTD 1958
                  </span>
                </div>
              </div>

              {/* Exact Instagram Bio Box */}
              <div className="p-3 rounded-xl bg-white/5 border border-indriya-gold/30 text-xs text-amber-100/90 leading-relaxed italic mb-3">
                "Gold Jewellery Siddipet | Hallmarked Gold | Custom Designs | Bridal Collection | Call 9030033552 | Visit @gksilver | Trusted Jewellery Store in Town!!"
              </div>

              <div className="space-y-1.5 text-xs text-gray-300">
                <p className="flex items-start gap-1.5 text-amber-300 font-semibold">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Paripally Street / Kaman Road, Siddipet, Telangana - 502103</span>
                </p>
                <p className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <a href="tel:+919030033552" className="hover:underline">Direct: +91 90300 33552</a>
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <a
                  href="https://www.instagram.com/gattu_krishna_murthy_jewellers/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 border border-amber-400/40 text-amber-200 transition-all font-semibold"
                >
                  <span>@gattu_krishna_murthy_jewellers</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.instagram.com/gksilver/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-gray-200 transition-all font-semibold"
                >
                  <span>@gksilver (Silver)</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-indriya-lightgold mb-4">Jewellery Collections</h4>
              <ul className="space-y-2 text-xs text-gray-300">
                <li><button onClick={() => { setSelectedCategory('necklaces'); setCurrentPage('catalog'); }} className="hover:text-white">Gold Chokers &amp; Haars</button></li>
                <li><button onClick={() => { setSelectedCategory('bangles'); setCurrentPage('catalog'); }} className="hover:text-white">Deccan Antique Kadas</button></li>
                <li><button onClick={() => { setSelectedCategory('bridal'); setCurrentPage('catalog'); }} className="hover:text-white">Muhurtham Bridal Sets</button></li>
                <li><button onClick={() => { setSelectedCategory('silver'); setCurrentPage('catalog'); }} className="hover:text-white">925 Silver Pooja Articles (@gksilver)</button></li>
                <li><button onClick={() => { setSelectedCategory('coins'); setCurrentPage('catalog'); }} className="hover:text-white">24KT Gold Bullion Coins</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-indriya-lightgold mb-4">The GKJ Promises</h4>
              <ul className="space-y-2 text-xs text-gray-300">
                <li>✓ 100% BIS 916 Hallmarked Gold with HUID</li>
                <li>✓ Custom Bridal &amp; Beads Jewellery Designs</li>
                <li>✓ 0% Deduction on Old Gold Exchange</li>
                <li>✓ Transparent Daily Live Benchmark Pricing</li>
                <li>✓ Pure 925 Silver Articles via @gksilver</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-indriya-lightgold mb-4">Concierge &amp; Visit</h4>
              <p className="text-xs text-gray-300 mb-3">Book an exclusive private consultation at our Siddipet showroom.</p>
              <a
                href="tel:+919030033552"
                className="w-full py-2.5 px-4 bg-indriya-gold hover:bg-indriya-brightgold text-[#0A2240] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 mb-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call +91 90300 33552</span>
              </a>
              <button
                onClick={() => setIsAppointmentOpen(true)}
                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-indriya-lightgold font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-indriya-gold/40"
              >
                Book VIP Appointment
              </button>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <button onClick={() => setCurrentPage('admin')} className="text-[11px] text-gray-400 hover:text-indriya-lightgold">
                  Staff Login (Admin)
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
            <p>© {new Date().getFullYear()} Sai Jewellers (@saijewellers.co). All Rights Reserved.</p>
            <p>Designed with Indian Heritage Excellence • Hyderabad, Telangana</p>
          </div>
        </div>
      </footer>

      {/* ==================== MODALS & DRAWERS ==================== */}

      {/* PRICE BREAKUP MODAL */}
      {priceBreakupProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-indriya-gold/40 relative">
            <button
              onClick={() => setPriceBreakupProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-bold text-indriya-crimson tracking-widest uppercase">
              100% TRANSPARENT PRICING
            </span>
            <h3 className="font-serif text-xl font-bold text-indriya-navy mt-1">
              {priceBreakupProduct.name}
            </h3>
            <p className="text-xs text-gray-500">Calculated strictly against today's live IBJA bullion rates</p>

            {(() => {
              const b = calculatePriceBreakup(
                priceBreakupProduct.goldPurity,
                priceBreakupProduct.grossWeight,
                priceBreakupProduct.makingChargePercent,
                goldRates
              );
              return (
                <div className="mt-6 space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Gold Purity & Gross Weight:</span>
                    <span className="font-bold text-gray-800">{priceBreakupProduct.goldPurity} • {priceBreakupProduct.grossWeight} grams</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Live Metal Rate ({priceBreakupProduct.goldPurity}):</span>
                    <span className="font-bold text-gray-800">₹{b.ratePerGram.toLocaleString('en-IN')}/gram</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Pure Metal Value:</span>
                    <span className="font-bold text-gray-800">₹{b.metalCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Making Charges ({priceBreakupProduct.makingChargePercent}%):</span>
                    <span className="font-bold text-gray-800">₹{b.makingCharge.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">GST (3% Indian Bullion Tax):</span>
                    <span className="font-bold text-gray-800">₹{b.gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-3 border-t-2 border-indriya-gold/40 text-sm font-bold text-indriya-navy bg-[#FAF7F2] p-3 rounded-xl">
                    <span>Total Net Price:</span>
                    <span className="text-base text-indriya-crimson">₹{b.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              );
            })()}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { addToCart(priceBreakupProduct); setPriceBreakupProduct(null); }}
                className="flex-1 py-3 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                Add to Shopping Bag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-indriya-gold/40 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="rounded-2xl overflow-hidden border border-gray-200">
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-full h-80 object-cover"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-indriya-gold tracking-widest uppercase">
                  {selectedProduct.goldPurity} PURE • {selectedProduct.category.toUpperCase()}
                </span>
                <h2 className="text-2xl font-serif font-bold text-indriya-navy mt-1">
                  {selectedProduct.name}
                </h2>
                <div className="text-xl font-bold text-indriya-crimson mt-2">
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-gray-600 mt-4 leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="mt-4 p-3 bg-[#FAF7F2] rounded-xl text-xs space-y-1.5 border border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gross Weight:</span>
                    <strong className="text-gray-800">{selectedProduct.grossWeight} grams</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Purity Detail:</span>
                    <strong className="text-gray-800">{selectedProduct.purityDetail || selectedProduct.goldPurity}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hallmark:</span>
                    <strong className="text-green-700">100% BIS HUID Certified</strong>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                    className="flex-1 py-3 bg-indriya-blue hover:bg-indriya-darkblue text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Bag
                  </button>
                  <button
                    onClick={() => { setPriceBreakupProduct(selectedProduct); setSelectedProduct(null); }}
                    className="px-4 py-3 border border-indriya-navy text-indriya-navy font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-50"
                  >
                    Price Breakup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fadeIn">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indriya-navy" />
                  <h3 className="font-serif font-bold text-lg text-indriya-navy">Your Shopping Bag ({cart.length})</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-600">Your bag is currently empty</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-6 py-2 bg-indriya-navy text-indriya-lightgold text-xs font-bold rounded-full"
                  >
                    Explore Catalogue
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 mt-4 space-y-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="pt-4 flex gap-4">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl border border-gray-200" />
                      <div className="flex-1">
                        <h4 className="font-bold text-xs text-indriya-navy line-clamp-1">{item.product.name}</h4>
                        <span className="text-[10px] text-gray-500">{item.product.goldPurity} • {item.product.grossWeight}g</span>
                        <div className="text-sm font-bold text-indriya-crimson mt-1">₹{item.product.price.toLocaleString('en-IN')}</div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button onClick={() => updateCartQuantity(item.product.id, -1)} className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100">-</button>
                            <span className="px-2 text-xs font-bold">{item.quantity}</span>
                            <button onClick={() => updateCartQuantity(item.product.id, 1)} className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100">+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-700 text-xs">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-6 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Insured Express Shipping:</span>
                  <span className="font-bold text-green-700">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-indriya-navy">
                  <span>Grand Total:</span>
                  <span className="text-indriya-crimson">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <button
                  onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                  className="w-full py-3.5 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Insured Checkout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-indriya-gold/40 relative">
            <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-500">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-6 h-6 text-green-600" />
              <h3 className="font-serif text-xl font-bold text-indriya-navy">Insured Doorstep Delivery</h3>
            </div>
            <form onSubmit={handleCheckoutSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={checkoutData.name}
                  onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Mobile (for Delivery OTP) *</label>
                  <input
                    type="text"
                    value={checkoutData.phone}
                    onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Pincode *</label>
                  <input
                    type="text"
                    value={checkoutData.pincode}
                    onChange={(e) => setCheckoutData({ ...checkoutData, pincode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Shipping Address / House No *</label>
                <input
                  type="text"
                  value={checkoutData.address}
                  onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Delivery Preference</label>
                <select
                  value={checkoutData.deliveryMode}
                  onChange={(e) => setCheckoutData({ ...checkoutData, deliveryMode: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="insured_delivery">Insured Valuables Courier Delivery (Pan-India)</option>
                  <option value="store_pickup">Direct Pickup at Siddipet Showroom</option>
                </select>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-sm font-bold mb-4">
                  <span>Payable Amount:</span>
                  <span className="text-indriya-crimson">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-green-700 hover:bg-green-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all"
                >
                  Confirm & Place Order (Insured)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIP SHOWROOM APPOINTMENT MODAL */}
      {isAppointmentOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-indriya-gold/40 relative">
            <button onClick={() => setIsAppointmentOpen(false)} className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-500">
              <X className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-bold text-indriya-gold tracking-widest uppercase">SIDDIPET SHOWROOM</span>
            <h3 className="font-serif text-xl font-bold text-indriya-navy mt-1">Book VIP Appointment</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">Enjoy a private lounge consultation with our jewellery curators.</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              setIsAppointmentOpen(false);
              showToast('VIP Showroom Appointment Booked! We look forward to welcoming you.');
            }} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Your Name *</label>
                <input type="text" placeholder="Enter your full name" className="w-full px-3 py-2 border rounded-xl" required />
              </div>
              <div>
                <label className="font-semibold block mb-1">Phone Number *</label>
                <input type="text" placeholder="+91" className="w-full px-3 py-2 border rounded-xl" required />
              </div>
              <div>
                <label className="font-semibold block mb-1">Preferred Date</label>
                <input type="date" className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-indriya-navy text-indriya-lightgold font-bold text-xs uppercase tracking-wider rounded-xl shadow-md mt-4"
              >
                Confirm VIP Appointment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== INDRIYA-INSPIRED FLOATING WIDGETS ==================== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Expanded Floating Offer & Rate Card (Exact Indriya reproduction from screenshot) */}
        {isTodayGoldRateOpen && (
          <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl p-5 sm:p-6 shadow-2xl border border-gray-200/90 animate-slideUp text-left relative">
            <button
              onClick={() => setIsTodayGoldRateOpen(false)}
              className="absolute top-3.5 right-3.5 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header: Exact Indriya format */}
            <div className="pr-6">
              <h4 className="font-serif font-bold text-sm sm:text-base text-indriya-navy leading-snug">
                Today's Gold Rate is Rs.{goldRates.rate22K.toLocaleString('en-IN')} per gm (22kt).
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Last updated on {goldRates.lastUpdated || getLiveTodayFormatted()}
              </p>
            </div>

            {/* Offers List: Exact Indriya screenshot icons & text */}
            <div className="my-4 pt-3 border-t border-gray-100 space-y-2.5 text-xs text-charcoal-800">
              <div className="flex items-start gap-2">
                <span className="text-sm">✨</span>
                <span className="font-bold text-indriya-navy">Special Festive Offers</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm">💰</span>
                <span><strong>Up to 30% off</strong> on gold jewellery making charges*</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm">💎</span>
                <span><strong>Up to 50% off</strong> on diamond value*</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm">🔒</span>
                <span><strong>Pay 25% advance</strong> and get the best gold rate.*</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm">♻️</span>
                <span><strong>0% DEDUCTION ON OLD GOLD</strong> (on any karat)*</span>
              </div>
              <div className="flex items-start gap-2 text-[10px] text-gray-500 pt-1">
                <span>⏳</span>
                <span>Limited time only. *T&C Apply</span>
              </div>
            </div>

            {/* Live Hyderabad Market Benchmark (from Google Search) */}
            <div className="grid grid-cols-3 gap-2 py-2 px-2 bg-[#FAF7F2] rounded-xl border border-indriya-gold/30 mb-3 text-center text-xs">
              <div className="p-1">
                <span className="text-[9px] text-gray-500 block uppercase font-bold">24KT (99.9%)</span>
                <span className="font-bold text-xs text-indriya-navy block">₹{goldRates.rate24K.toLocaleString('en-IN')}/g</span>
                <span className="text-[9px] text-gray-500 block">₹{(goldRates.rate24K * 10).toLocaleString('en-IN')}/10g</span>
              </div>
              <div className="p-1 border-x border-indriya-gold/30 bg-amber-50/50 rounded-lg">
                <span className="text-[9px] text-indriya-crimson uppercase font-bold block">22KT (Standard)</span>
                <span className="font-bold text-xs text-indriya-crimson block">₹{goldRates.rate22K.toLocaleString('en-IN')}/g</span>
                <span className="text-[9px] text-indriya-crimson/90 font-medium block">₹{(goldRates.rate22K * 10).toLocaleString('en-IN')}/10g</span>
              </div>
              <div className="p-1">
                <span className="text-[9px] text-gray-500 block uppercase font-bold">18KT (Diamond)</span>
                <span className="font-bold text-xs text-indriya-navy block">₹{goldRates.rate18K.toLocaleString('en-IN')}/g</span>
                <span className="text-[9px] text-gray-500 block">₹{(goldRates.rate18K * 10).toLocaleString('en-IN')}/10g</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={handleSyncGoldRates}
                className="w-full py-2.5 px-3 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold border border-indriya-gold/50 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Live Rates</span>
              </button>
            </div>
          </div>
        )}

        {/* Floating Controls Column */}
        <div className="flex flex-col items-end">
          {/* Pill Label: "Today's gold rate" */}
          <div
            onClick={() => setIsTodayGoldRateOpen(!isTodayGoldRateOpen)}
            className="bg-white/95 hover:bg-white text-gray-800 hover:text-indriya-crimson px-3 py-1 rounded-full shadow-md border border-gray-200 text-[11px] font-semibold cursor-pointer select-none mb-1.5 transition-all hover:shadow-lg flex items-center justify-center"
          >
            <span>Today's gold rate</span>
          </div>

          {/* Gold Symbol Trigger Button: Navy Circle with 3D Gold Bullion / Ingots (NO NUMERIC RATE DISPLAYED) */}
          <button
            onClick={() => setIsTodayGoldRateOpen(!isTodayGoldRateOpen)}
            className="w-13 h-13 sm:w-14 sm:h-14 bg-[#0A2240] hover:bg-[#12335c] rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-110 mb-2.5 border border-amber-300/40 focus:outline-none"
            title="Click to view Today's Gold Rates & Festive Offers"
            aria-label="Today's Gold Rates"
          >
            {/* Crisp 3D Gold Ingots / Bullion Vector Symbol */}
            <svg className="w-8 h-8 drop-shadow-md" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="goldTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF9C4" />
                  <stop offset="100%" stopColor="#FBC02D" />
                </linearGradient>
                <linearGradient id="goldFrontGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FBC02D" />
                  <stop offset="100%" stopColor="#F57F17" />
                </linearGradient>
                <linearGradient id="goldSideGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F57F17" />
                  <stop offset="100%" stopColor="#E65100" />
                </linearGradient>
              </defs>
              {/* Bottom Gold Ingot Bar */}
              <polygon points="12,38 32,28 52,36 32,46" fill="url(#goldTopGrad)" />
              <polygon points="12,38 32,46 32,53 12,45" fill="url(#goldFrontGrad)" />
              <polygon points="32,46 52,36 52,43 32,53" fill="url(#goldSideGrad)" />
              
              {/* Top Gold Ingot Bar (Stacked) */}
              <polygon points="18,25 34,17 48,23 32,31" fill="url(#goldTopGrad)" />
              <polygon points="18,25 32,31 32,37 18,31" fill="url(#goldFrontGrad)" />
              <polygon points="32,31 48,23 48,29 32,37" fill="url(#goldSideGrad)" />
              
              {/* Ingot Engraving Highlight */}
              <line x1="26" y1="23" x2="38" y2="23" stroke="#FFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
            </svg>
          </button>

          {/* Call Trigger Button: Orange Circle with White Phone Icon */}
          <button
            onClick={() => setIsCallModalOpen(true)}
            className="w-13 h-13 sm:w-14 sm:h-14 bg-[#E05326] hover:bg-[#C8451B] text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-110 border-2 border-white/60 focus:outline-none"
            title="Call Sai Jewellers Concierge"
            aria-label="Call Concierge"
          >
            <Phone className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* ==================== INTERACTIVE OVERLAYS & MODALS ==================== */}

      {/* SEARCH OVERLAY (INDRIYA STYLE FULL SEARCH EXPERIENCE) */}
      {isSearchOverlayOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col justify-start animate-fadeIn">
          <div className="bg-white w-full shadow-2xl border-b-2 border-indriya-gold/40 max-h-[85vh] overflow-y-auto">
            <div className="max-w-5xl mx-auto px-4 py-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="font-serif font-bold text-indriya-navy text-lg sm:text-xl">Search Jewellery Creations</span>
                <button
                  onClick={() => setIsSearchOverlayOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-4 relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="Search For Finger Rings, Chokers, Bangles, Solitaires..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsSearchOverlayOpen(false);
                      setCurrentPage('catalog');
                    }
                  }}
                  className="w-full bg-[#FAF7F2] border-2 border-indriya-gold/50 rounded-2xl py-3.5 pl-12 pr-10 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indriya-gold"
                />
                <Search className="w-5 h-5 text-indriya-gold absolute left-4 top-4" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Two Column Layout like Indriya */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6 pb-6">
                {/* Left: Trending Categories */}
                <div className="md:col-span-4 border-r border-gray-100 pr-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-indriya-gold mb-3">Trending Searches</h4>
                  <div className="flex flex-wrap md:flex-col gap-2">
                    {[
                      { label: '22KT Gold Chokers', cat: 'necklaces' },
                      { label: 'Polki Chandbalis & Jhumkas', cat: 'earrings' },
                      { label: 'Antique Nakshi Kadas', cat: 'bangles' },
                      { label: 'Solitaire Engagement Rings', cat: 'rings' },
                      { label: 'Muhurtham Bridal Trousseau', cat: 'bridal' },
                      { label: '925 Pure Silver Diya Sets', cat: 'silver' },
                      { label: 'Auspicious Mangalsutras', cat: 'mangalsutras' },
                      { label: '24KT Gold Bullion Coins', cat: 'coins' },
                    ].map((t) => (
                      <button
                        key={t.label}
                        onClick={() => {
                          setSelectedCategory(t.cat);
                          setSearchQuery(t.label.split(' ')[0]);
                          setIsSearchOverlayOpen(false);
                          setCurrentPage('catalog');
                        }}
                        className="text-left py-2 px-3 rounded-xl bg-gray-50 hover:bg-indriya-gold/20 text-xs font-semibold text-indriya-navy transition-all flex items-center justify-between"
                      >
                        <span>{t.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Live Matching Products */}
                <div className="md:col-span-8">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-indriya-navy">
                      Matching Creations ({filteredProducts.length})
                    </h4>
                    {filteredProducts.length > 0 && (
                      <button
                        onClick={() => { setIsSearchOverlayOpen(false); setCurrentPage('catalog'); }}
                        className="text-xs font-bold text-indriya-crimson hover:underline"
                      >
                        View All Results →
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[420px] overflow-y-auto pr-1">
                    {filteredProducts.slice(0, 6).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => { setSelectedProduct(p); setIsSearchOverlayOpen(false); }}
                        className="p-2.5 rounded-2xl border border-gray-100 hover:border-indriya-gold hover:shadow-md transition-all cursor-pointer bg-white flex flex-col justify-between"
                      >
                        <div className="aspect-square rounded-xl overflow-hidden bg-[#FAF7F2] mb-2">
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-indriya-gold block">{p.goldPurity} • {p.grossWeight}g</span>
                          <h5 className="font-serif font-bold text-xs text-indriya-navy line-clamp-1">{p.name}</h5>
                          <span className="font-bold text-xs text-indriya-crimson block mt-1">₹{p.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER SIGN IN & REGISTER MODAL (MATCHING INDRIYA SCREENSHOT) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border-2 border-indriya-gold/50 relative grid grid-cols-1 md:grid-cols-12">
            
            {/* Close Button */}
            <button
              onClick={() => { setIsAuthModalOpen(false); setAuthIntent(null); }}
              className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Promotional Banner (Indriya Style) */}
            <div className="md:col-span-5 bg-gradient-to-br from-[#0A2240] via-[#0e2a4e] to-[#06172d] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-block px-3 py-1 bg-amber-400 text-indriya-navy font-black text-[10px] tracking-widest uppercase rounded-full mb-4 shadow-sm">
                  WELCOME OFFER
                </div>
                <h3 className="font-serif text-2xl font-bold text-indriya-lightgold leading-tight mb-2">
                  Get points worth ₹500 on sign up*
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Join the Sai Jewellers Privilege Circle to unlock member perks across Hyderabad.
                </p>
                <div className="mt-6 space-y-2 text-xs text-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">✦</span>
                    <span>Instant ₹500 bonus applied to your first bag</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">✦</span>
                    <span>Save &amp; access your dream bridal wishlist</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">✦</span>
                    <span>Digital BIS 916 HUID certificates &amp; invoices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">✦</span>
                    <span>Up to 30% off making charges on festivals</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-8 pt-4 border-t border-white/10 text-[10px] text-gray-400">
                *Valid on certified pure gold and natural diamond jewellery.
              </div>
            </div>

            {/* Right Form Pane */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white text-left">
              {customerUser ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indriya-gold tracking-widest block">PRIVILEGE MEMBER</span>
                    <h3 className="font-serif text-2xl font-bold text-indriya-navy mt-1">
                      Namaste, {customerUser.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Privilege Points Balance: <strong className="text-indriya-crimson font-bold">₹{customerUser.rewardPoints || 500}</strong>
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-indriya-gold/30 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Full Name:</span>
                      <strong className="text-gray-900">{customerUser.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone Number:</span>
                      <strong className="text-gray-900">{customerUser.phone}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">City / Location:</span>
                      <strong className="text-gray-900">{customerUser.city || 'Hyderabad'}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => { setIsAuthModalOpen(false); navigateTo('wishlist'); }}
                      className="py-3 px-3 bg-indriya-gold/20 hover:bg-indriya-gold/30 text-indriya-navy font-bold rounded-xl text-center transition-all"
                    >
                      View Wishlist ({wishlist.length})
                    </button>
                    <button
                      onClick={() => { setIsAuthModalOpen(false); navigateTo('cart'); }}
                      className="py-3 px-3 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold font-bold rounded-xl text-center transition-all"
                    >
                      View Shopping Bag ({cart.length})
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setCustomerUser(null);
                      showToast('Logged out of customer account.');
                    }}
                    className="w-full py-2.5 text-xs text-red-500 hover:text-red-700 font-bold text-center mt-2"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-5">
                    <h3 className="font-serif text-2xl font-bold text-indriya-navy">
                      {authMode === 'signup' ? 'Create an Account' : 'Welcome Back'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {authMode === 'signup'
                        ? 'Sign up to view your shopping bag, save your wishlist & claim ₹500 offer.'
                        : 'Sign in to access your saved jewellery bag and wishlist.'}
                    </p>
                  </div>

                  {/* Mode Tabs */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl mb-4">
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className={`py-2 text-xs font-bold rounded-xl transition-all ${
                        authMode === 'signup' ? 'bg-white text-indriya-navy shadow-sm' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      Sign Up (₹500 Bonus)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className={`py-2 text-xs font-bold rounded-xl transition-all ${
                        authMode === 'login' ? 'bg-white text-indriya-navy shadow-sm' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      Log In
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const firstName = (form.elements.namedItem('firstName') as HTMLInputElement | null)?.value || 'Valued';
                      const lastName = (form.elements.namedItem('lastName') as HTMLInputElement | null)?.value || 'Customer';
                      const phone = (form.elements.namedItem('phone') as HTMLInputElement | null)?.value || '+91 98490 22334';
                      const city = (form.elements.namedItem('city') as HTMLInputElement | null)?.value || 'Hyderabad';
                      
                      const fullName = authMode === 'signup' ? `${firstName} ${lastName}`.trim() : 'Valued Patron';
                      setCustomerUser({
                        name: fullName,
                        phone,
                        city,
                        rewardPoints: 500
                      });
                      setIsAuthModalOpen(false);
                      confetti({ particleCount: 110, spread: 70, origin: { y: 0.6 } });
                      showToast(`Welcome ${fullName}! ₹500 welcome credit has been added.`);

                      // Fulfill any gated intent
                      if (authIntent) {
                        if (authIntent.type === 'open_cart') {
                          navigateTo('cart');
                        } else if (authIntent.type === 'open_wishlist') {
                          navigateTo('wishlist');
                        } else if (authIntent.type === 'add_to_cart' && authIntent.product) {
                          const productToAdd = authIntent.product;
                          setCart((prev) => {
                            const existing = prev.find((item) => item.product.id === productToAdd.id);
                            if (existing) {
                              return prev.map((item) => item.product.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item);
                            }
                            return [...prev, { product: productToAdd, quantity: 1, selectedPurity: productToAdd.goldPurity }];
                          });
                          showToast(`Added "${productToAdd.name}" to your shopping bag.`);
                        } else if (authIntent.type === 'toggle_wishlist' && authIntent.productId) {
                          const pid = authIntent.productId;
                          setWishlist((prev) => [...prev, pid]);
                          showToast('Added to your wishlist.');
                        }
                        setAuthIntent(null);
                      }
                    }}
                    className="space-y-3 text-xs"
                  >
                    {authMode === 'signup' ? (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="font-semibold text-gray-700 block mb-1">First Name *</label>
                            <input
                              type="text"
                              name="firstName"
                              defaultValue="Ananya"
                              placeholder="First name"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-indriya-gold"
                              required
                            />
                          </div>
                          <div>
                            <label className="font-semibold text-gray-700 block mb-1">Last Name *</label>
                            <input
                              type="text"
                              name="lastName"
                              defaultValue="Reddy"
                              placeholder="Last name"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-indriya-gold"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold text-gray-700 block mb-1">Mobile Number *</label>
                          <div className="flex">
                            <span className="px-3 py-2.5 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-bold">+91</span>
                            <input
                              type="tel"
                              name="phone"
                              defaultValue="98490 22334"
                              placeholder="10-digit mobile number"
                              className="w-full px-3.5 py-2.5 rounded-r-xl border border-gray-200 text-xs focus:outline-none focus:border-indriya-gold"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold text-gray-700 block mb-1">City</label>
                          <input
                            type="text"
                            name="city"
                            defaultValue="Hyderabad"
                            placeholder="Enter your city"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-indriya-gold"
                          />
                        </div>

                        <div className="flex items-start gap-2 pt-1 text-[11px] text-gray-500">
                          <input type="checkbox" defaultChecked className="mt-0.5 accent-indriya-crimson rounded" required id="terms-agree" />
                          <label htmlFor="terms-agree" className="cursor-pointer">
                            I agree to the Terms &amp; Conditions and consent to receive jewellery order &amp; live gold rate updates.
                          </label>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                        >
                          <span>Get OTP &amp; Claim ₹500</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="font-semibold text-gray-700 block mb-1">Mobile Number *</label>
                          <div className="flex">
                            <span className="px-3 py-2.5 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-bold">+91</span>
                            <input
                              type="tel"
                              name="phone"
                              defaultValue="98490 22334"
                              placeholder="Registered mobile number"
                              className="w-full px-3.5 py-2.5 rounded-r-xl border border-gray-200 text-xs focus:outline-none focus:border-indriya-gold"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold text-gray-700 block mb-1">Enter OTP Code *</label>
                          <input
                            type="text"
                            defaultValue="5421"
                            maxLength={6}
                            placeholder="6-digit verification code"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs tracking-widest text-center font-bold focus:outline-none focus:border-indriya-gold"
                            required
                          />
                          <span className="text-[10px] text-gray-400 mt-1 block">Default demo OTP: 5421</span>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                        >
                          <span>Verify &amp; Sign In</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </form>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* CALL CONCIERGE MODAL */}
      {isCallModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border-2 border-indriya-gold/50 relative text-center">
            <button
              onClick={() => setIsCallModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-[#E05326]/10 text-[#E05326] mx-auto flex items-center justify-center mb-3">
              <Phone className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-xl font-bold text-indriya-navy">Direct Concierge Line</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              Speak directly with our senior jewellery curators at our Siddipet showroom.
            </p>

            <div className="space-y-3">
              <a
                href="tel:+919030033552"
                className="w-full py-3 bg-[#E05326] hover:bg-[#C8451B] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Call +91 90300 33552</span>
              </a>

              <a
                href="https://wa.me/919030033552?text=Hello%20Gattu%20Krishna%20Murthy%20Jewellers,%20I%20would%20like%20to%20inquire%20about%20your%20jewellery%20collection."
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>WhatsApp Video / Chat</span>
              </a>

              <button
                onClick={() => {
                  setIsCallModalOpen(false);
                  setIsAppointmentOpen(true);
                }}
                className="w-full py-2.5 text-xs text-indriya-navy font-bold hover:underline"
              >
                Book VIP Showroom Visit Instead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STORE LOCATOR MODAL */}
      {isStoreLocatorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-indriya-gold/50 relative">
            <button
              onClick={() => setIsStoreLocatorOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-bold text-indriya-gold tracking-widest uppercase block">
              FLAGSHIP SHOWROOM
            </span>
            <h3 className="font-serif text-2xl font-bold text-indriya-navy mt-1">
              Gattu Krishna Murthy Jewellers Siddipet
            </h3>

            <div className="mt-5 space-y-4 text-xs">
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-indriya-gold/30 space-y-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-indriya-crimson flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">Siddipet Flagship Showroom</h5>
                    <p className="text-gray-600 mt-0.5">Paripally Street / Kaman Road, Siddipet, Telangana - 502103</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2 border-t border-gray-200/60 text-gray-600">
                  <Clock className="w-4 h-4 text-indriya-gold" />
                  <span>Timings: <strong>10:30 AM – 9:00 PM</strong> (Open All 7 Days)</span>
                </div>

                <div className="flex items-center gap-2.5 text-gray-600">
                  <Phone className="w-4 h-4 text-indriya-gold" />
                  <span>Phone / Concierge: <strong>+91 90300 33552</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://maps.google.com/?q=Gattu+Krishna+Murthy+Jewellers+Siddipet"
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold font-bold rounded-xl text-center flex items-center justify-center gap-1.5 shadow-md"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Get Directions</span>
                </a>
                <button
                  onClick={() => {
                    setIsStoreLocatorOpen(false);
                    setIsAppointmentOpen(true);
                  }}
                  className="py-3 bg-indriya-gold hover:bg-indriya-brightgold text-[#0A2240] font-bold rounded-xl text-center shadow-md"
                >
                  Book VIP Salon Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GOLDEN PROGRAMS / ADVANCE RATE LOCK MODAL */}
      {isGoldenProgramOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-indriya-gold/50 relative">
            <button
              onClick={() => setIsGoldenProgramOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-indriya-gold mb-1">
              <Scale className="w-5 h-5" />
              <span className="text-[10px] font-bold tracking-widest uppercase">SAI SWARNA NIDHI</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-indriya-navy">
              Advance Gold Rate Lock Program
            </h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              Plan your wedding & festive purchases with complete immunity against rising gold bullion prices.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-indriya-gold/30 space-y-2">
                <div className="flex items-center gap-2 text-indriya-crimson font-bold">
                  <span>🔒</span>
                  <span>Pay 25% Advance & Lock Today's 22KT Rate (₹{goldRates.rate22K}/g)</span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  If the gold rate rises on your purchase date, you pay the lower locked rate. If the rate drops, you get the benefit of the lower prevailing rate!
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl space-y-1.5 text-gray-600">
                <div className="flex justify-between">
                  <span>Current 22KT Locked Benchmark:</span>
                  <strong className="text-indriya-navy">₹{goldRates.rate22K.toLocaleString('en-IN')}/gram</strong>
                </div>
                <div className="flex justify-between">
                  <span>Old Gold Deduction:</span>
                  <strong className="text-green-700">0% Deduction on any karat</strong>
                </div>
                <div className="flex justify-between">
                  <span>Minimum Advance:</span>
                  <strong className="text-gray-900">25% of estimated weight</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsGoldenProgramOpen(false);
                  setIsAppointmentOpen(true);
                }}
                className="w-full py-3.5 bg-indriya-navy hover:bg-[#07192f] text-indriya-lightgold font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg"
              >
                Enroll at Flagship Showroom
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION POPUP */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A2240] text-white px-5 py-3 rounded-2xl shadow-2xl border border-indriya-gold/50 flex items-center gap-3 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-indriya-lightgold flex-shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
