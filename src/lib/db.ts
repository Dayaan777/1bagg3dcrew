import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  category: string;
  description: string;
  image: string;
  images?: string[];
  featured: boolean;
  featureInMerch?: boolean;
  featureInAirSuspension?: boolean;
  isComingSoon: boolean;
  stock: number;
  sizes: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount?: number;
}

export interface SiteSettings {
  announcement: string;
  heroTagline: string;
  heroSubtitle: string;
  airSuspensionStatus: string;
  releaseDate: string;
  contactEmail: string;
  instagramHandle: string;
  // Dynamic About Us Page Settings
  aboutBadge?: string;
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutStoryHeading?: string;
  aboutStoryP1?: string;
  aboutStoryP2?: string;
  aboutStoryP3?: string;
  aboutPillar1Title?: string;
  aboutPillar1Desc?: string;
  aboutPillar2Title?: string;
  aboutPillar2Desc?: string;
  aboutPillar3Title?: string;
  aboutPillar3Desc?: string;
  aboutContactHeading?: string;
  aboutContactSub?: string;
  // Shipping & Policy Settings
  shippingThreshold?: number;
  shippingEstimatedDomestic?: string;
  shippingEstimatedInternational?: string;
  shippingDomesticRate?: number;
  shippingInternationalRate?: number;
  shippingPolicyText?: string;
  shippingReturnsPolicy?: string;
  termsContent?: string;
  privacyContent?: string;
}

export interface WaitlistLead {
  id: string;
  email: string;
  vehicleModel: string;
  createdAt: string;
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: "1Bagg3d 'Live On Air' Signature Heavyweight Hoodie",
    slug: 'signature-live-on-air-hoodie',
    price: 85,
    category: 'merch',
    description: 'Ultra-heavyweight 480GSM organic cotton hoodie. High-density embroidered globe logo on chest, double-layered hood, relaxed boxy drop-shoulder fit.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    featured: true,
    isComingSoon: false,
    stock: 45,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'prod-2',
    title: 'Air Strut Blueprint Graphic Tee - Washed Black',
    slug: 'air-strut-blueprint-tee',
    price: 45,
    category: 'merch',
    description: 'Vintage mineral-washed 260GSM combed cotton tee featuring technical dual-air-strut schematic back print with distressed vintage look.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    featured: true,
    isComingSoon: false,
    stock: 60,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    createdAt: '2026-01-02T00:00:00.000Z'
  },
  {
    id: 'prod-3',
    title: 'Stance Division 450GSM French Terry Crewneck',
    slug: 'stance-division-crewneck',
    price: 78,
    category: 'merch',
    description: 'Custom milled French terry crewneck in charcoal slate. Minimalist 1bagg3d.crew silicone patch on cuff with tonal back neck typography.',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    featured: true,
    isComingSoon: false,
    stock: 35,
    sizes: ['S', 'M', 'L', 'XL'],
    createdAt: '2026-01-03T00:00:00.000Z'
  },
  {
    id: 'prod-4',
    title: "1Bagg3d 'Low & Slow' Heavyweight Street Tee",
    slug: 'low-slow-street-tee',
    price: 42,
    category: 'merch',
    description: 'Thick ribbed collar streetwear tee. Screen-printed globe & chrome strut graphic on front chest with Est. 2026 insignia.',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    featured: true,
    isComingSoon: false,
    stock: 50,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    createdAt: '2026-01-04T00:00:00.000Z'
  },
  {
    id: 'prod-5',
    title: 'Chrome Monogram Low-Profile Racing Cap',
    slug: 'chrome-racing-cap',
    price: 35,
    category: 'accessories',
    description: 'Structured 6-panel unstructured dad hat with gunmetal chrome 3D embroidered badge and embossed metal buckle closure.',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    featured: false,
    isComingSoon: false,
    stock: 75,
    sizes: ['ONE SIZE'],
    createdAt: '2026-01-05T00:00:00.000Z'
  },
  {
    id: 'prod-6',
    title: 'Bagg3d Heavy Duty Key Jet Tag & Lanyard',
    slug: 'bagg3d-jet-tag',
    price: 18,
    category: 'accessories',
    description: 'Double-sided woven flight tag with heavy-duty black electroplated steel grommet and quick-release carabiner.',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    featured: false,
    isComingSoon: false,
    stock: 120,
    sizes: ['ONE SIZE'],
    createdAt: '2026-01-06T00:00:00.000Z'
  },
  {
    id: 'prod-7',
    title: 'Holographic Globe & Strut 5-Pack Slap Stickers',
    slug: 'slap-sticker-pack',
    price: 15,
    category: 'stickers',
    description: 'Weatherproof UV-rated holographic vinyl decals suitable for car windshields, quarter windows, laptops, and hardcases.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    featured: false,
    isComingSoon: false,
    stock: 200,
    sizes: ['PACK OF 5'],
    createdAt: '2026-01-07T00:00:00.000Z'
  },
  {
    id: 'prod-8',
    title: '1Bagg3d Pro Stance Complete Air Suspension System',
    slug: 'pro-stance-air-suspension-system',
    price: 2499,
    category: 'air-suspension',
    description: 'Complete high-performance air suspension package. 32-way damping adjustable monotube threaded body struts, double-bellow high pressure air bags, digital 4-corner management system with wireless Bluetooth app & handheld controller, dual 480C chrome air compressors, and 5-gallon seamless aluminum tank.',
    image: '/logo.jpg',
    featured: true,
    isComingSoon: true,
    stock: 0,
    sizes: ['UNIVERSAL FITMENT', 'PLATFORM SPECIFIC'],
    createdAt: '2026-01-08T00:00:00.000Z'
  }
];

const DEFAULT_SETTINGS: SiteSettings = {
  announcement: '',
  heroTagline: 'LIVE YOUR LIFE ON AIR',
  heroSubtitle: 'Streetwear curated for the underground car scene & premium air suspension engineering. Built by car enthusiasts, for car enthusiasts.',
  airSuspensionStatus: '',
  releaseDate: 'EST. 2026',
  contactEmail: 'info@1bagg3dcrew.com',
  instagramHandle: '@1bagg3d.crew',
  aboutBadge: 'EST. 2026 • GLOBAL CAR COLLECTIVE',
  aboutTitle: 'THE 1BAGG3D STORY',
  aboutSubtitle: 'Born at late-night garage sessions, underground parking garage meets, and circuit tracks where perfection is measured in millimeters of fender clearance.',
  aboutStoryHeading: 'Live Your Life On Air',
  aboutStoryP1: '1Bagg3dCrew was created to bridge two worlds that belong together: high-performance automotive chassis engineering and raw underground streetwear.',
  aboutStoryP2: 'For years, the stance community had to compromise between generic merchandise that shrunk after one wash and static suspension setups that scraped away subframes on simple highway dips.',
  aboutStoryP3: 'We set out to create bespoke garments with ultra-heavyweight 480GSM cotton, custom boxy silhouettes, and graphics inspired by real suspension schematics and car culture.',
  aboutPillar1Title: 'Heavyweight Craftsmanship',
  aboutPillar1Desc: 'Milled French terry and preshrunk cotton. Designed to withstand grease, track dust, and daily wear.',
  aboutPillar2Title: 'Precision Air Engineering',
  aboutPillar2Desc: '32-way damping valving, billet brackets, and wireless mobile management for the lowest, cleanest stance.',
  aboutPillar3Title: 'Global Car Community',
  aboutPillar3Desc: 'From Tokyo parking garages to European autobahns and American highways, united by the stance lifestyle.',
  aboutContactHeading: 'Connect With The Crew',
  aboutContactSub: 'Got questions about fitment, sponsorship proposals, or wholesale inquiries? Reach out directly.',
  // Default Shipping & Policy details
  shippingThreshold: 100,
  shippingEstimatedDomestic: '3-5 Business Days',
  shippingEstimatedInternational: '7-14 Business Days',
  shippingDomesticRate: 8,
  shippingInternationalRate: 20,
  shippingPolicyText: 'All apparel and hardware orders are processed and packed in protective, heavyweight packaging within 24-48 business hours. Orders over $100 automatically qualify for Free Standard Tracked Shipping worldwide. Once shipped, full tracking links from DHL Express and FedEx will be dispatched to your email.',
  shippingReturnsPolicy: 'We accept returns and exchanges on unworn, unwashed garments with original tags attached within 14 days of delivery. For air suspension hardware, components must remain in factory sealed original packaging due to precision tolerance checks.',
  termsContent: 'By visiting our site and purchasing from 1Bagg3dCrew, you engage in our service and agree to be bound by our terms and conditions. All automotive performance parts, air suspension components, and streetwear merchandise are sold under strict compliance standards. Automotive suspension modifications must be installed by certified professionals.',
  privacyContent: 'Your privacy is critical to 1Bagg3dCrew. We collect information necessary to process your transactions, coordinate global logistics, and dispatch order tracking alerts. We do not sell, rent, or trade your personal data to third-party marketing entities under any circumstances.'
};

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

interface StoreSchema {
  products: Product[];
  settings: SiteSettings;
  categories?: Category[];
  waitlist: WaitlistLead[];
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Apparel & Tops', slug: 'merch', description: 'Heavyweight hoodies, drop-shoulder tees & streetwear' },
  { id: 'cat-2', name: 'Air Suspension', slug: 'air-suspension', description: 'Complete air strut kits, tanks, valves & digital management' },
];

function ensureLocalStore(): StoreSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(STORE_FILE)) {
    const initialData: StoreSchema = {
      products: DEFAULT_PRODUCTS,
      settings: DEFAULT_SETTINGS,
      waitlist: []
    };
    fs.writeFileSync(STORE_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse local store, reinitializing:', err);
    const initialData: StoreSchema = {
      products: DEFAULT_PRODUCTS,
      settings: DEFAULT_SETTINGS,
      waitlist: []
    };
    fs.writeFileSync(STORE_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

function saveLocalStore(data: StoreSchema) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function cleanDbUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  // Strip any wrapping quotes, escaped quotes, or brackets
  url = url.replace(/^["'`\\]+|["'`\\]+$/g, '').trim();
  return url;
}

// Check if Neon DB is configured
function hasNeonDb(): boolean {
  const url = cleanDbUrl(process.env.DATABASE_URL);
  return url.length > 0;
}

function getNeonSql(): any {
  const url = cleanDbUrl(process.env.DATABASE_URL);
  return neon(url) as any;
}

// Initialize tables if using Neon
async function initNeonTables(sql: any) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL,
        price NUMERIC NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        images JSONB DEFAULT '[]'::jsonb,
        featured BOOLEAN DEFAULT false,
        feature_in_merch BOOLEAN DEFAULT true,
        feature_in_air_suspension BOOLEAN DEFAULT false,
        is_coming_soon BOOLEAN DEFAULT false,
        stock INTEGER DEFAULT 0,
        sizes JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Ensure columns exist if table was previously created
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;`;
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS feature_in_merch BOOLEAN DEFAULT true;`;
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS feature_in_air_suspension BOOLEAN DEFAULT false;`;

    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS waitlist_leads (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        vehicle_model TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        description TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS uploaded_images (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Create an initialized marker table to ensure seeding only happens once on first setup
    await sql`
      CREATE TABLE IF NOT EXISTS app_state (
        key TEXT PRIMARY KEY,
        initialized BOOLEAN DEFAULT true
      );
    `;

    // Only seed starter data once when app_state has no 'seeded' record
    const hasInitialized = (await sql`SELECT initialized FROM app_state WHERE key = 'seeded';`) as any[];
    if (!hasInitialized || hasInitialized.length === 0) {
      const localStore = ensureLocalStore();
      const productsToSeed = localStore.products && localStore.products.length > 0 ? localStore.products : DEFAULT_PRODUCTS;
      for (const p of productsToSeed) {
        await sql`
          INSERT INTO products (id, title, slug, price, category, description, image, images, featured, feature_in_merch, feature_in_air_suspension, is_coming_soon, stock, sizes, created_at)
          VALUES (
            ${p.id}, 
            ${p.title}, 
            ${p.slug}, 
            ${p.price}, 
            ${p.category}, 
            ${p.description}, 
            ${p.image}, 
            ${JSON.stringify(p.images || [])},
            ${Boolean(p.featured)}, 
            ${p.featureInMerch !== undefined ? Boolean(p.featureInMerch) : true},
            ${Boolean(p.featureInAirSuspension)},
            ${Boolean(p.isComingSoon)}, 
            ${Number(p.stock || 0)}, 
            ${JSON.stringify(p.sizes || [])}, 
            ${p.createdAt}
          )
          ON CONFLICT (id) DO NOTHING;
        `;
      }
      const settingsToSeed = localStore.settings || DEFAULT_SETTINGS;
      await sql`
        INSERT INTO site_settings (key, value)
        VALUES ('main', ${JSON.stringify(settingsToSeed)})
        ON CONFLICT (key) DO NOTHING;
      `;

      for (const cat of DEFAULT_CATEGORIES) {
        await sql`
          INSERT INTO categories (id, name, slug, description)
          VALUES (${cat.id}, ${cat.name}, ${cat.slug}, ${cat.description || ''})
          ON CONFLICT (id) DO NOTHING;
        `;
      }

      await sql`
        INSERT INTO app_state (key, initialized)
        VALUES ('seeded', true)
        ON CONFLICT (key) DO NOTHING;
      `;
    }
  } catch (e) {
    console.warn('Neon table init warning:', e);
  }
}

// Database helper functions
export async function getProducts(): Promise<Product[]> {
  if (hasNeonDb()) {
    try {
      const sql = getNeonSql();
      await initNeonTables(sql);
      const rows = (await sql`SELECT * FROM products ORDER BY created_at DESC;`) as any[];
      return rows.map((r: any) => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        price: Number(r.price),
        category: r.category,
        description: r.description,
        image: r.image,
        images: typeof r.images === 'string' ? JSON.parse(r.images) : (r.images || []),
        featured: Boolean(r.featured),
        featureInMerch: r.feature_in_merch !== undefined ? Boolean(r.feature_in_merch) : true,
        featureInAirSuspension: Boolean(r.feature_in_air_suspension),
        isComingSoon: Boolean(r.is_coming_soon),
        stock: Number(r.stock),
        sizes: typeof r.sizes === 'string' ? JSON.parse(r.sizes) : (r.sizes || []),
        createdAt: r.created_at
      }));
    } catch (e) {
      console.warn('Neon getProducts fallback to local store:', e);
    }
  }

  const store = ensureLocalStore();
  return store.products.map(p => ({
    ...p,
    images: p.images || [],
    featureInMerch: p.featureInMerch !== undefined ? p.featureInMerch : (p.category === 'merch' || p.category === 'accessories' || p.category === 'stickers'),
    featureInAirSuspension: p.featureInAirSuspension !== undefined ? p.featureInAirSuspension : (p.category === 'air-suspension')
  }));
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.id === id) || null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.slug === slug || p.id === slug) || null;
}

export async function saveProduct(product: Partial<Product> & { title: string; price: number; category: Product['category'] }): Promise<Product> {
  const store = ensureLocalStore();
  const id = product.id || 'prod-' + Date.now();
  const slug = product.slug || product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const fullProduct: Product = {
    id,
    title: product.title,
    slug,
    price: Number(product.price),
    category: product.category,
    description: product.description || '',
    image: product.image || '/logo.jpg',
    images: Array.isArray(product.images) ? product.images : [],
    featured: Boolean(product.featured),
    featureInMerch: product.featureInMerch !== undefined ? Boolean(product.featureInMerch) : true,
    featureInAirSuspension: Boolean(product.featureInAirSuspension),
    isComingSoon: Boolean(product.isComingSoon),
    stock: Number(product.stock ?? 10),
    sizes: product.sizes || ['S', 'M', 'L', 'XL'],
    createdAt: product.createdAt || new Date().toISOString()
  };

  if (hasNeonDb()) {
    try {
      const sql = getNeonSql();
      await initNeonTables(sql);
      await sql`
        INSERT INTO products (id, title, slug, price, category, description, image, images, featured, feature_in_merch, feature_in_air_suspension, is_coming_soon, stock, sizes, created_at)
        VALUES (
          ${fullProduct.id}, 
          ${fullProduct.title}, 
          ${fullProduct.slug}, 
          ${fullProduct.price}, 
          ${fullProduct.category}, 
          ${fullProduct.description}, 
          ${fullProduct.image}, 
          ${JSON.stringify(fullProduct.images || [])},
          ${fullProduct.featured}, 
          ${fullProduct.featureInMerch !== undefined ? Boolean(fullProduct.featureInMerch) : true},
          ${Boolean(fullProduct.featureInAirSuspension)},
          ${fullProduct.isComingSoon}, 
          ${fullProduct.stock}, 
          ${JSON.stringify(fullProduct.sizes)}, 
          ${fullProduct.createdAt}
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          slug = EXCLUDED.slug,
          price = EXCLUDED.price,
          category = EXCLUDED.category,
          description = EXCLUDED.description,
          image = EXCLUDED.image,
          images = EXCLUDED.images,
          featured = EXCLUDED.featured,
          feature_in_merch = EXCLUDED.feature_in_merch,
          feature_in_air_suspension = EXCLUDED.feature_in_air_suspension,
          is_coming_soon = EXCLUDED.is_coming_soon,
          stock = EXCLUDED.stock,
          sizes = EXCLUDED.sizes;
      `;
    } catch (e) {
      console.warn('Neon saveProduct fallback to local store:', e);
    }
  }

  // Always update local store as well
  const idx = store.products.findIndex(p => p.id === fullProduct.id);
  if (idx >= 0) {
    store.products[idx] = fullProduct;
  } else {
    store.products.unshift(fullProduct);
  }
  saveLocalStore(store);

  return fullProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (hasNeonDb()) {
    try {
      const sql = getNeonSql();
      await sql`DELETE FROM products WHERE id = ${id};`;
    } catch (e) {
      console.warn('Neon deleteProduct error:', e);
    }
  }

  const store = ensureLocalStore();
  store.products = store.products.filter(p => p.id !== id);
  saveLocalStore(store);
  return true;
}

export async function getSettings(): Promise<SiteSettings> {
  if (hasNeonDb()) {
    try {
      const sql = getNeonSql();
      await initNeonTables(sql);
      const res = (await sql`SELECT value FROM site_settings WHERE key = 'main';`) as any[];
      if (res && res[0]?.value) {
        return typeof res[0].value === 'string' ? JSON.parse(res[0].value) : res[0].value;
      }
    } catch (e) {
      console.warn('Neon getSettings fallback to local store:', e);
    }
  }

  const store = ensureLocalStore();
  return store.settings || DEFAULT_SETTINGS;
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const store = ensureLocalStore();
  const updated: SiteSettings = {
    ...store.settings,
    ...settings
  };

  if (hasNeonDb()) {
    try {
      const sql = getNeonSql();
      await initNeonTables(sql);
      await sql`
        INSERT INTO site_settings (key, value)
        VALUES ('main', ${JSON.stringify(updated)})
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
      `;
    } catch (e) {
      console.warn('Neon updateSettings fallback to local store:', e);
    }
  }

  store.settings = updated;
  saveLocalStore(store);
  return updated;
}

export async function addWaitlistLead(email: string, vehicleModel: string): Promise<WaitlistLead> {
  const lead: WaitlistLead = {
    id: 'lead-' + Date.now(),
    email,
    vehicleModel: vehicleModel || 'Not specified',
    createdAt: new Date().toISOString()
  };

  if (hasNeonDb()) {
    try {
      const sql = getNeonSql();
      await initNeonTables(sql);
      await sql`
        INSERT INTO waitlist_leads (id, email, vehicle_model, created_at)
        VALUES (${lead.id}, ${lead.email}, ${lead.vehicleModel}, ${lead.createdAt});
      `;
    } catch (e) {
      console.warn('Neon addWaitlistLead fallback to local store:', e);
    }
  }

  const store = ensureLocalStore();
  store.waitlist.unshift(lead);
  saveLocalStore(store);

  return lead;
}

export async function getWaitlistLeads(): Promise<WaitlistLead[]> {
  if (hasNeonDb()) {
    try {
      const sql = getNeonSql();
      await initNeonTables(sql);
      const rows = (await sql`SELECT * FROM waitlist_leads ORDER BY created_at DESC;`) as any[];
      return rows.map((r: any) => ({
        id: r.id,
        email: r.email,
        vehicleModel: r.vehicle_model,
        createdAt: r.created_at
      }));
    } catch (e) {
      console.warn('Neon getWaitlistLeads fallback:', e);
    }
  }

  const store = ensureLocalStore();
  return store.waitlist || [];
}

// -------------------------------------------------------------
// CATEGORIES CRUD
// -------------------------------------------------------------
export async function getCategories(): Promise<Category[]> {
  if (hasNeonDb()) {
    try {
      const sql = getNeonSql();
      await initNeonTables(sql);
      const rows = (await sql`SELECT * FROM categories ORDER BY created_at ASC;`) as any[];
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        description: r.description || ''
      }));
    } catch (e) {
      console.warn('Neon getCategories fallback to local store:', e);
    }
  }

  const store = ensureLocalStore();
  return store.categories || [];
}

export async function saveCategory(categoryData: Partial<Category>): Promise<Category> {
  const store = ensureLocalStore();
  if (!store.categories) {
    store.categories = [...DEFAULT_CATEGORIES];
  }

  let finalCategory: Category;

  if (categoryData.id && store.categories.some(c => c.id === categoryData.id)) {
    // Update existing
    finalCategory = {
      id: categoryData.id,
      name: categoryData.name?.trim() || 'Untitled Category',
      slug: (categoryData.slug || categoryData.name || 'category').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
      description: categoryData.description?.trim() || ''
    };
    store.categories = store.categories.map(c => c.id === finalCategory.id ? finalCategory : c);
  } else {
    // Create new
    finalCategory = {
      id: categoryData.id || 'cat-' + Date.now(),
      name: categoryData.name?.trim() || 'New Category',
      slug: (categoryData.slug || categoryData.name || 'category').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
      description: categoryData.description?.trim() || ''
    };
    store.categories.push(finalCategory);
  }

  if (hasNeonDb()) {
    try {
      const sql = getNeonSql();
      await initNeonTables(sql);
      await sql`
        INSERT INTO categories (id, name, slug, description)
        VALUES (${finalCategory.id}, ${finalCategory.name}, ${finalCategory.slug}, ${finalCategory.description})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          description = EXCLUDED.description;
      `;
    } catch (e) {
      console.warn('Neon saveCategory fallback:', e);
    }
  }

  saveLocalStore(store);
  return finalCategory;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const store = ensureLocalStore();
  if (store.categories) {
    store.categories = store.categories.filter(c => c.id !== id);
    saveLocalStore(store);
  }

  if (hasNeonDb()) {
    try {
      const sql = getNeonSql();
      await initNeonTables(sql);
      await sql`DELETE FROM categories WHERE id = ${id};`;
    } catch (e) {
      console.warn('Neon deleteCategory fallback:', e);
    }
  }

  return true;
}

// -------------------------------------------------------------
// UPLOADED IMAGES CLOUD STORAGE
// -------------------------------------------------------------
export async function saveUploadedImage(id: string, filename: string, mimeType: string, base64Data: string): Promise<string> {
  if (hasNeonDb()) {
    try {
      const sql = getNeonSql();
      await initNeonTables(sql);
      await sql`
        INSERT INTO uploaded_images (id, filename, mime_type, data)
        VALUES (${id}, ${filename}, ${mimeType}, ${base64Data})
        ON CONFLICT (id) DO UPDATE SET
          filename = EXCLUDED.filename,
          mime_type = EXCLUDED.mime_type,
          data = EXCLUDED.data;
      `;
      return `/api/images/${id}`;
    } catch (e: any) {
      console.error('Neon saveUploadedImage failure:', e);
      throw new Error('Database failed to save image: ' + (e?.message || 'DB Error'));
    }
  }

  throw new Error('Database is not configured. Please ensure DATABASE_URL is set in environment variables.');
}

export async function getUploadedImage(id: string): Promise<{ filename: string; mimeType: string; buffer: Buffer } | null> {
  if (hasNeonDb()) {
    try {
      const sql = getNeonSql();
      await initNeonTables(sql);
      const rows = (await sql`SELECT * FROM uploaded_images WHERE id = ${id} LIMIT 1;`) as any[];
      if (rows && rows.length > 0) {
        const row = rows[0];
        const buffer = Buffer.from(row.data, 'base64');
        return {
          filename: row.filename,
          mimeType: row.mime_type,
          buffer
        };
      }
    } catch (e) {
      console.warn('Neon getUploadedImage fallback:', e);
    }
  }

  return null;
}
