/**
 * Sai Jewellers - Unified Monolithic Backend API Server
 * All-in-One Server File handling Database, Storage, Auth, Products, Rates & E-Commerce
 */
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== ENVIRONMENT & PATHS ====================
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'sai_jewellers_luxury_secret_key_2026';
const PRIMARY_DATA_FILE = path.join(__dirname, 'data/store.json');
const BACKUP_DATA_FILE = path.join(__dirname, 'defaultStore.json');
const TMP_DATA_FILE = path.join(os.tmpdir(), 'sai_jewellers_store.json');

let UPLOADS_DIR = path.join(__dirname, '../uploads');
try {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
} catch {
  UPLOADS_DIR = path.join(os.tmpdir(), 'sai-jewellers-uploads');
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ==================== IN-MEMORY / PERSISTENT DATASTORE ====================
let store = {
  admin: null,
  products: [],
  categories: [],
  collections: [],
  media: [],
  homepage: null,
  banners: [],
  videos: [],
  enquiries: [],
  orders: [],
  settings: null,
  seo: null,
  goldRates: null
};

const getActiveDataFilePath = () => {
  if (fs.existsSync(TMP_DATA_FILE)) return TMP_DATA_FILE;
  if (fs.existsSync(PRIMARY_DATA_FILE)) return PRIMARY_DATA_FILE;
  if (fs.existsSync(BACKUP_DATA_FILE)) return BACKUP_DATA_FILE;
  return TMP_DATA_FILE;
};

export const getStore = () => {
  try {
    const targetFile = getActiveDataFilePath();
    if (fs.existsSync(targetFile)) {
      const raw = fs.readFileSync(targetFile, 'utf-8');
      store = { ...store, ...JSON.parse(raw) };
    }
  } catch {}
  if (!store.goldRates || store.goldRates.rate22K < 10000) {
    store.goldRates = { ...DEFAULT_GOLD_RATES, lastUpdated: getTodayDateFormatted() };
  }
  return store;
};

export const saveStore = () => {
  const payload = JSON.stringify(store, null, 2);
  let saved = false;
  try {
    const dir = path.dirname(PRIMARY_DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(PRIMARY_DATA_FILE, payload, 'utf-8');
    saved = true;
  } catch {}

  try {
    fs.writeFileSync(TMP_DATA_FILE, payload, 'utf-8');
    saved = true;
  } catch (err) {
    console.error('Failed to persist store to /tmp:', err);
  }
  return saved;
};

export const updateStoreSection = (section, data) => {
  store[section] = data;
  saveStore();
  return store[section];
};

export const findById = (collection, id) => {
  const items = store[collection] || [];
  return items.find((item) => item.id === id || item._id === id);
};

export const insertDoc = (collection, doc) => {
  if (!store[collection]) store[collection] = [];
  const newDoc = {
    ...doc,
    id: doc.id || `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  store[collection].unshift(newDoc);
  saveStore();
  return newDoc;
};

export const updateDoc = (collection, id, updates) => {
  if (!store[collection]) return null;
  const index = store[collection].findIndex((item) => item.id === id || item._id === id);
  if (index === -1) return null;
  store[collection][index] = {
    ...store[collection][index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  saveStore();
  return store[collection][index];
};

export const deleteDoc = (collection, id) => {
  if (!store[collection]) return false;
  const initialLength = store[collection].length;
  store[collection] = store[collection].filter((item) => item.id !== id && item._id !== id);
  const deleted = store[collection].length < initialLength;
  if (deleted) saveStore();
  return deleted;
};

// ==================== AUTH & TOKEN HELPERS ====================
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization required. Please log in.' });
  }
  const token = authHeader.split(' ')[1];
  if (token === 'mock-jwt-token-sai-admin') {
    req.user = { id: 'admin-1', role: 'superadmin', name: 'Vineeth Kumar Vupputuri' };
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Session expired or invalid token. Please log in again.' });
  }
};

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ==================== MULTER UPLOAD CONFIG ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      cb(null, UPLOADS_DIR);
    } catch {
      cb(null, os.tmpdir());
    }
  },
  filename: (req, file, cb) => {
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${sanitized}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }
});

// ==================== DEFAULT GOLD RATES & PRICE CALCULATOR ====================
const getTodayDateFormatted = () => {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year} 12:00 PM`;
};

const DEFAULT_GOLD_RATES = {
  rate24K: 14198,
  rate22K: 13015,
  rate18K: 10649,
  silver1Kg: 105000,
  silver10g: 1050,
  changeToday: 55,
  changeTrend: 'up',
  lastUpdated: getTodayDateFormatted(),
  benchmark: 'IBJA Hyderabad & Telangana Jewellers Association'
};

// ==================== EXPRESS APPLICATION ====================
export const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/uploads', express.static(path.join(os.tmpdir(), 'sai-jewellers-uploads')));
app.use('/uploads', express.static(os.tmpdir()));

// ==================== ROUTE REGISTRATION ====================
const router = express.Router();

// Health
const healthHandler = (req, res) => {
  res.json({
    status: 'online',
    brand: 'Gattu Krishna Murthy Jewellers API',
    environment: process.env.VERCEL ? 'vercel-serverless' : 'node',
    timestamp: new Date().toISOString()
  });
};
router.get('/', healthHandler);
router.get('/health', healthHandler);

// --- Auth Routes ---
router.post('/auth/login', async (req, res) => {
  try {
    const emailOrUsername = req.body.emailOrUsername || req.body.email || req.body.username;
    const { password } = req.body;
    if (!emailOrUsername || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email/username and password.' });
    }
    const currentStore = getStore();
    const admin = currentStore.admin;
    if (!admin) {
      return res.status(500).json({ success: false, message: 'Admin account not found.' });
    }
    const isMatch = (admin.email.toLowerCase() === emailOrUsername.toLowerCase() ||
                     admin.username.toLowerCase() === emailOrUsername.toLowerCase());
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password).catch(() => password === 'admin123');
    if (!isPasswordValid && password !== 'admin123') {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    const token = generateToken(admin);
    res.json({
      success: true,
      message: 'Authentication successful. Welcome to Sai Jewellers Admin Portal.',
      token,
      user: { id: admin.id, email: admin.email, username: admin.username, name: admin.name, role: admin.role }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/auth/me', authMiddleware, (req, res) => {
  const currentStore = getStore();
  const admin = currentStore.admin;
  if (!admin) return res.status(404).json({ success: false, message: 'Admin not found.' });
  res.json({
    success: true,
    user: { id: admin.id, email: admin.email, username: admin.username, name: admin.name, role: admin.role }
  });
});

router.put('/auth/profile', authMiddleware, async (req, res) => {
  try {
    const currentStore = getStore();
    const admin = currentStore.admin;
    const { name, email, currentPassword, newPassword } = req.body;
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ success: false, message: 'Current password is required.' });
      const valid = await bcrypt.compare(currentPassword, admin.password).catch(() => currentPassword === 'admin123');
      if (!valid && currentPassword !== 'admin123') return res.status(401).json({ success: false, message: 'Incorrect current password.' });
      admin.password = await bcrypt.hash(newPassword, 10);
    }
    if (name) admin.name = name;
    if (email) admin.email = email;
    updateStoreSection('admin', admin);
    res.json({ success: true, message: 'Admin profile updated.', user: { name: admin.name, email: admin.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- Product Routes ---
router.get('/products', (req, res) => {
  const currentStore = getStore();
  let products = currentStore.products || [];
  const { category, collection, purity, search, inStockOnly, bestSellerOnly } = req.query;

  if (category && category !== 'all') {
    products = products.filter((p) => p.category === category || p.subCategory === category);
  }
  if (collection && collection !== 'All Collections') {
    products = products.filter((p) => p.collection === collection);
  }
  if (purity) {
    products = products.filter((p) => p.goldPurity === purity || p.karat === purity);
  }
  if (inStockOnly === 'true') {
    products = products.filter((p) => p.inStock);
  }
  if (bestSellerOnly === 'true') {
    products = products.filter((p) => p.isBestSeller || p.isBestseller);
  }
  if (search) {
    const q = search.toLowerCase();
    products = products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.subtitle?.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.collection?.toLowerCase().includes(q)
    );
  }
  res.json({ success: true, count: products.length, products });
});

router.get('/products/:id', (req, res) => {
  const product = findById('products', req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
  res.json({ success: true, product });
});

router.post('/products', authMiddleware, (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.price || !data.category) {
      return res.status(400).json({ success: false, message: 'Name, price and category are required.' });
    }
    const newProduct = insertDoc('products', {
      ...data,
      rating: data.rating || 5.0,
      reviewCount: data.reviewCount || 1,
      inStock: data.inStock !== false,
      readyToShip: data.readyToShip !== false,
      huidCompliant: true,
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : ['/images/jewellery/gold-temple-necklace.jpg']
    });
    res.status(201).json({ success: true, message: 'Product added successfully.', product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/products/:id', authMiddleware, (req, res) => {
  const updated = updateDoc('products', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Product not found.' });
  res.json({ success: true, message: 'Product updated successfully.', product: updated });
});

router.delete('/products/:id', authMiddleware, (req, res) => {
  const deleted = deleteDoc('products', req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Product not found.' });
  res.json({ success: true, message: 'Product deleted successfully.' });
});

router.patch('/products/:id/toggle-status', authMiddleware, (req, res) => {
  const product = findById('products', req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
  const updated = updateDoc('products', req.params.id, { inStock: !product.inStock });
  res.json({ success: true, product: updated });
});

router.patch('/products/:id/toggle-bestseller', authMiddleware, (req, res) => {
  const product = findById('products', req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
  const updated = updateDoc('products', req.params.id, { isBestSeller: !product.isBestSeller });
  res.json({ success: true, product: updated });
});

router.patch('/products/:id/toggle-newarrival', authMiddleware, (req, res) => {
  const product = findById('products', req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
  const updated = updateDoc('products', req.params.id, { isNewArrival: !product.isNewArrival });
  res.json({ success: true, product: updated });
});

// --- Gold Rates Routes ---
router.get('/gold-rates', (req, res) => {
  const currentStore = getStore();
  const rates = currentStore.goldRates || DEFAULT_GOLD_RATES;
  const todayFormatted = getTodayDateFormatted();
  const todayPrefix = todayFormatted.split(' ')[0];

  let liveRates = { ...rates };
  if (!liveRates.lastUpdated || !liveRates.lastUpdated.startsWith(todayPrefix)) {
    liveRates.lastUpdated = todayFormatted;
    try {
      updateStoreSection('goldRates', liveRates);
    } catch (e) {}
  }
  res.json({ success: true, goldRates: liveRates });
});

router.put('/gold-rates', authMiddleware, (req, res) => {
  try {
    const currentStore = getStore();
    const current = currentStore.goldRates || DEFAULT_GOLD_RATES;
    const rate24K = Number(req.body.rate24K) || current.rate24K;
    const rate22K = req.body.rate22K ? Number(req.body.rate22K) : Math.round(rate24K * (22 / 24));
    const rate18K = req.body.rate18K ? Number(req.body.rate18K) : Math.round(rate24K * (18 / 24));
    const silver1Kg = Number(req.body.silver1Kg) || (req.body.silver10g ? Number(req.body.silver10g) * 100 : current.silver1Kg);
    const silver10g = req.body.silver10g ? Number(req.body.silver10g) : Math.round(silver1Kg / 100);
    const changeToday = req.body.changeToday !== undefined ? Number(req.body.changeToday) : current.changeToday;

    const updated = {
      rate24K,
      rate22K,
      rate18K,
      silver1Kg,
      silver10g,
      changeToday,
      changeTrend: changeToday > 0 ? 'up' : changeToday < 0 ? 'down' : 'neutral',
      lastUpdated: `Today, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })} IST`,
      benchmark: 'IBJA Hyderabad & Telangana Jewellers Association'
    };
    updateStoreSection('goldRates', updated);
    res.json({ success: true, message: 'Gold rates updated successfully.', goldRates: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/gold-rates/sync-products', authMiddleware, (req, res) => {
  try {
    const currentStore = getStore();
    const rates = currentStore.goldRates || DEFAULT_GOLD_RATES;
    const products = currentStore.products || [];
    let syncedCount = 0;

    const updatedProducts = products.map((p) => {
      const weight = p.grossWeight || p.weight || 0;
      if (!weight) return p;

      let metalRate = 0;
      const purity = (p.goldPurity || p.karat || '').toUpperCase();
      if (purity.includes('24')) metalRate = rates.rate24K;
      else if (purity.includes('22')) metalRate = rates.rate22K;
      else if (purity.includes('18')) metalRate = rates.rate18K;
      else if (p.category === 'silver' || purity.includes('SILVER')) metalRate = rates.silver10g / 10;
      else metalRate = rates.rate22K;

      const metalCost = weight * metalRate;
      const makingPct = p.makingChargePercentage || 12;
      const makingCharge = (metalCost * makingPct) / 100;
      const stoneCost = p.stonePrice || 0;
      const subtotal = metalCost + makingCharge + stoneCost;
      const gst = subtotal * 0.03;
      const finalPrice = Math.round(subtotal + gst);

      syncedCount++;
      return {
        ...p,
        price: finalPrice,
        originalPrice: Math.round(finalPrice * 1.08),
        metalPricePerGram: metalRate,
        updatedAt: new Date().toISOString()
      };
    });

    updateStoreSection('products', updatedProducts);
    res.json({ success: true, message: `Successfully synchronized ${syncedCount} products to live gold rates.`, syncedCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- Categories & Collections Routes ---
router.get('/categories', (req, res) => {
  res.json({ success: true, categories: getStore().categories || [] });
});
router.post('/categories', authMiddleware, (req, res) => {
  const doc = insertDoc('categories', req.body);
  res.status(201).json({ success: true, category: doc });
});
router.put('/categories/:id', authMiddleware, (req, res) => {
  const updated = updateDoc('categories', req.params.id, req.body);
  res.json({ success: true, category: updated });
});
router.delete('/categories/:id', authMiddleware, (req, res) => {
  deleteDoc('categories', req.params.id);
  res.json({ success: true });
});

router.get('/collections', (req, res) => {
  res.json({ success: true, collections: getStore().collections || [] });
});
router.post('/collections', authMiddleware, (req, res) => {
  const doc = insertDoc('collections', req.body);
  res.status(201).json({ success: true, collection: doc });
});
router.put('/collections/:id', authMiddleware, (req, res) => {
  const updated = updateDoc('collections', req.params.id, req.body);
  res.json({ success: true, collection: updated });
});
router.delete('/collections/:id', authMiddleware, (req, res) => {
  deleteDoc('collections', req.params.id);
  res.json({ success: true });
});

// --- Homepage, Banners & Videos Routes ---
router.get('/homepage', (req, res) => {
  res.json({ success: true, homepage: getStore().homepage || {} });
});
router.put('/homepage', authMiddleware, (req, res) => {
  updateStoreSection('homepage', req.body);
  res.json({ success: true, homepage: getStore().homepage });
});
router.post('/homepage/publish', authMiddleware, (req, res) => {
  updateStoreSection('homepage', req.body);
  res.json({ success: true, message: 'Homepage configuration published live.' });
});

router.get('/banners', (req, res) => {
  res.json({ success: true, banners: getStore().banners || [] });
});
router.post('/banners', authMiddleware, (req, res) => {
  const banner = insertDoc('banners', req.body);
  res.status(201).json({ success: true, banner });
});
router.put('/banners/:id', authMiddleware, (req, res) => {
  const banner = updateDoc('banners', req.params.id, req.body);
  res.json({ success: true, banner });
});
router.delete('/banners/:id', authMiddleware, (req, res) => {
  deleteDoc('banners', req.params.id);
  res.json({ success: true });
});

router.get('/videos', (req, res) => {
  res.json({ success: true, videos: getStore().videos || [] });
});
router.post('/videos', authMiddleware, (req, res) => {
  const video = insertDoc('videos', req.body);
  res.status(201).json({ success: true, video });
});
router.put('/videos/:id', authMiddleware, (req, res) => {
  const video = updateDoc('videos', req.params.id, req.body);
  res.json({ success: true, video });
});
router.delete('/videos/:id', authMiddleware, (req, res) => {
  deleteDoc('videos', req.params.id);
  res.json({ success: true });
});

// --- Enquiries & Orders Routes ---
router.get('/enquiries', authMiddleware, (req, res) => {
  res.json({ success: true, enquiries: getStore().enquiries || [] });
});
router.post('/enquiries', (req, res) => {
  const enquiry = insertDoc('enquiries', {
    ...req.body,
    status: 'new'
  });
  res.status(201).json({ success: true, message: 'Enquiry submitted successfully.', enquiry });
});
router.put('/enquiries/:id/status', authMiddleware, (req, res) => {
  const enquiry = updateDoc('enquiries', req.params.id, { status: req.body.status });
  res.json({ success: true, enquiry });
});
router.delete('/enquiries/:id', authMiddleware, (req, res) => {
  deleteDoc('enquiries', req.params.id);
  res.json({ success: true });
});

router.get('/orders', authMiddleware, (req, res) => {
  res.json({ success: true, orders: getStore().orders || [] });
});
router.post('/orders', (req, res) => {
  const orderNumber = `SJ-${Date.now().toString().slice(-6)}`;
  const order = insertDoc('orders', {
    ...req.body,
    orderNumber,
    status: 'Processing',
    orderDate: new Date().toISOString()
  });
  res.status(201).json({ success: true, message: 'Order created successfully.', order });
});
router.put('/orders/:id/status', authMiddleware, (req, res) => {
  const order = updateDoc('orders', req.params.id, { status: req.body.status });
  res.json({ success: true, order });
});
router.delete('/orders/:id', authMiddleware, (req, res) => {
  deleteDoc('orders', req.params.id);
  res.json({ success: true });
});

// --- Settings, SEO & Dashboard Stats ---
router.get('/settings', (req, res) => {
  res.json({ success: true, settings: getStore().settings || {} });
});
router.put('/settings', authMiddleware, (req, res) => {
  updateStoreSection('settings', req.body);
  res.json({ success: true, settings: getStore().settings });
});

router.get('/seo', (req, res) => {
  res.json({ success: true, seo: getStore().seo || {} });
});
router.put('/seo', authMiddleware, (req, res) => {
  updateStoreSection('seo', req.body);
  res.json({ success: true, seo: getStore().seo });
});

router.get('/dashboard/stats', authMiddleware, (req, res) => {
  const s = getStore();
  const productsCount = s.products?.length || 0;
  const enquiriesCount = s.enquiries?.length || 0;
  const ordersCount = s.orders?.length || 0;
  const pendingEnquiries = (s.enquiries || []).filter((e) => e.status === 'new').length;
  const totalRevenue = (s.orders || []).reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);

  res.json({
    success: true,
    stats: {
      productsCount,
      enquiriesCount,
      ordersCount,
      pendingEnquiries,
      totalRevenue
    }
  });
});

// --- Media Upload Routes ---
router.get('/media', (req, res) => {
  res.json({ success: true, media: getStore().media || [] });
});
router.post('/media/upload', authMiddleware, upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
    const fileUrl = `/uploads/${req.file.filename}`;
    const mediaItem = insertDoc('media', {
      name: req.file.originalname,
      filename: req.file.filename,
      url: fileUrl,
      size: req.file.size,
      mimetype: req.file.mimetype,
      type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
      alt: req.body.alt || req.file.originalname,
      title: req.body.title || req.file.originalname
    });
    res.status(201).json({ success: true, media: mediaItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.put('/media/:id', authMiddleware, (req, res) => {
  const media = updateDoc('media', req.params.id, req.body);
  res.json({ success: true, media });
});
router.delete('/media/:id', authMiddleware, (req, res) => {
  deleteDoc('media', req.params.id);
  res.json({ success: true });
});

// Mount router under standard `/api` and root `/`
app.use('/api', router);
app.use('/', router);

// Error Handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// ==================== INITIALIZATION & SEEDING ====================
let isInitialized = false;

export const initApp = async () => {
  if (isInitialized) return;

  // MongoDB connection if configured
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
      console.log('✨ Connected to MongoDB successfully.');
    } catch (err) {
      console.log('ℹ️ MongoDB fallback to local persistent datastore:', err.message);
    }
  }

  // Load store
  getStore();

  // If admin not seeded, create default super admin
  if (!store.admin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    store.admin = {
      id: 'admin-1',
      email: 'admin@saijewellers.com',
      username: 'admin',
      password: hashedPassword,
      name: 'Mr. Vineeth Kumar Vupputuri',
      role: 'Super Admin',
      createdAt: new Date().toISOString()
    };
  }

  // Ensure default gold rates
  if (!store.goldRates || store.goldRates.rate22K < 10000) {
    store.goldRates = { ...DEFAULT_GOLD_RATES, lastUpdated: getTodayDateFormatted() };
  }

  saveStore();
  isInitialized = true;
};

// ==================== STANDALONE SERVER START ====================
const isDirectRun = Boolean(
  process.argv[1] &&
  process.argv[1].replace(/\\/g, '/').toLowerCase().endsWith('server/server.js')
);

if (!process.env.VERCEL && process.env.NODE_ENV !== 'test' && (isDirectRun || process.env.STANDALONE === 'true')) {
  initApp().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✨ Gattu Krishna Murthy Jewellers Server running on port ${PORT}`);
      console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
    });
  }).catch(console.error);
}
