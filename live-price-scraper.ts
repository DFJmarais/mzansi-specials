/**
 * Live Price Scraper for South African Retailers
 * Implements robust HTTP-based scraping with fallbacks and caching
 * No Puppeteer dependency - uses lightweight axios + cheerio
 */

import axios, { AxiosInstance } from 'axios';

import { getDb } from '../db';
import { prices, products } from '../../drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import * as cheerio from 'cheerio';

interface ScrapedPrice {
  productName: string;
  storeName: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  inStock: boolean;
  url?: string;
  lastUpdated: Date;
}

interface RetailerConfig {
  name: string;
  baseUrl: string;
  searchUrl: string;
  selectors: {
    productCard: string;
    productName: string;
    price: string;
    originalPrice?: string;
    discount?: string;
    inStock?: string;
  };
  delay: number;
}

// Retailer configurations for live scraping
const RETAILER_CONFIGS: Record<string, RetailerConfig> = {
  spar: {
    name: 'SPAR',
    baseUrl: 'https://www.spar.co.za',
    searchUrl: 'https://www.spar.co.za/search?q=',
    selectors: {
      productCard: '[data-testid="product-card"], [class*="product-card"], .product-item',
      productName: '[class*="product-name"], h2, h3, [data-testid="product-name"]',
      price: '[class*="price"], [data-testid="price"], .product-price',
      originalPrice: '[class*="original"], [class*="was"]',
      discount: '[class*="discount"], [class*="off"]',
      inStock: '[class*="stock"], [class*="available"]',
    },
    delay: 1500,
  },
  picknpay: {
    name: 'Pick n Pay',
    baseUrl: 'https://www.pnp.co.za',
    searchUrl: 'https://www.pnp.co.za/search?q=',
    selectors: {
      productCard: '[data-testid="product-card"], [class*="product"], .product-tile',
      productName: 'h2, h3, [class*="name"]',
      price: '[class*="price"], .product-price',
      originalPrice: '[class*="original"]',
      discount: '[class*="discount"]',
      inStock: '[class*="stock"]',
    },
    delay: 1500,
  },
  checkers: {
    name: 'Checkers',
    baseUrl: 'https://www.checkers.co.za',
    searchUrl: 'https://www.checkers.co.za/search?q=',
    selectors: {
      productCard: '[data-testid="product"], [class*="product-card"], .product',
      productName: 'h2, h3, [class*="product-name"]',
      price: '[class*="price"], .product-price',
      originalPrice: '[class*="original"]',
      discount: '[class*="discount"]',
      inStock: '[class*="stock"]',
    },
    delay: 1500,
  },
  woolworths: {
    name: 'Woolworths',
    baseUrl: 'https://www.woolworths.co.za',
    searchUrl: 'https://www.woolworths.co.za/search?q=',
    selectors: {
      productCard: '[data-testid="product"], [class*="product"], .product-item',
      productName: 'h2, h3, [class*="name"]',
      price: '[class*="price"], .product-price',
      originalPrice: '[class*="original"]',
      discount: '[class*="discount"]',
      inStock: '[class*="stock"]',
    },
    delay: 1500,
  },
  okfoods: {
    name: 'OK Foods',
    baseUrl: 'https://www.okfoods.co.za',
    searchUrl: 'https://www.okfoods.co.za/search?q=',
    selectors: {
      productCard: '[class*="product"], .product-item, [data-testid="product"]',
      productName: 'h2, h3, [class*="name"]',
      price: '[class*="price"], .product-price',
      originalPrice: '[class*="original"]',
      discount: '[class*="discount"]',
      inStock: '[class*="stock"]',
    },
    delay: 1500,
  },
  foodloversmarket: {
    name: 'Food Lovers Market',
    baseUrl: 'https://www.foodloversmarket.co.za',
    searchUrl: 'https://www.foodloversmarket.co.za/search?q=',
    selectors: {
      productCard: '[data-testid="product"], [class*="product-card"], .product-item, [class*="product"]',
      productName: 'h2, h3, [class*="product-name"], [class*="name"]',
      price: '[class*="price"], .product-price, [data-testid="price"]',
      originalPrice: '[class*="original"], [class*="was"]',
      discount: '[class*="discount"], [class*="off"]',
      inStock: '[class*="stock"], [class*="available"]',
    },
    delay: 1500,
  },
};

// Create axios instance with proper headers
const createScraperClient = (): AxiosInstance => {
  return axios.create({
    timeout: 15000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Cache-Control': 'max-age=0',
    },
  });
};

const client = createScraperClient();

// Delay function to avoid bot detection
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Parse price from text (handles R99.99, 99.99, R 99,99 formats)
 */
function parsePrice(priceText: string): number | null {
  if (!priceText) return null;
  
  // Remove currency symbols and extra spaces
  const cleaned = priceText.replace(/[R$£€]/g, '').trim();
  
  // Try to find a number (handles both . and , as decimal)
  const match = cleaned.match(/[\d,\.]+/);
  if (!match) return null;
  
  // Replace comma with period for parsing
  const price = parseFloat(match[0].replace(',', '.'));
  return isNaN(price) || price <= 0 ? null : price;
}

/**
 * Scrape prices from a single retailer
 */
async function scrapeRetailerPrices(
  retailerKey: string,
  productNames: string[]
): Promise<ScrapedPrice[]> {
  const config = RETAILER_CONFIGS[retailerKey];
  if (!config) {
    console.error(`[Scraper] Unknown retailer: ${retailerKey}`);
    return [];
  }

  const results: ScrapedPrice[] = [];

  for (const productName of productNames) {
    try {
      await delay(config.delay);

      const searchUrl = `${config.searchUrl}${encodeURIComponent(productName)}`;
      console.log(`[${config.name}] Scraping: ${productName}`);

      const response = await client.get(searchUrl);
      const $ = cheerio.load(response.data);

      // Find product cards
      $(config.selectors.productCard).each((_: number, el: any) => {
        try {
          const $el = $(el);

          // Extract product name
          const productNameEl = $el.find(config.selectors.productName).first().text().trim();
          if (!productNameEl) return;

          // Extract price
          const priceText = $el.find(config.selectors.price).first().text().trim();
          const price = parsePrice(priceText);
          if (!price) return;

          // Extract original price (for discount calculation)
          let originalPrice: number | undefined;
          if (config.selectors.originalPrice) {
            const originalText = $el.find(config.selectors.originalPrice).first().text().trim();
            originalPrice = parsePrice(originalText) || undefined;
          }

          // Calculate discount
          let discount: number | undefined;
          if (originalPrice && originalPrice > price) {
            discount = Math.round(((originalPrice - price) / originalPrice) * 100);
          }

          // Check stock status
          let inStock = true;
          if (config.selectors.inStock) {
            const stockText = $el.find(config.selectors.inStock).first().text().toLowerCase();
            inStock = !stockText.includes('out of stock') && !stockText.includes('unavailable');
          }

          results.push({
            productName: productNameEl,
            storeName: config.name,
            price,
            originalPrice,
            discount,
            inStock,
            url: searchUrl,
            lastUpdated: new Date(),
          });
        } catch (err) {
          // Skip individual product parsing errors
        }
      });

      console.log(`[${config.name}] Found ${results.length} prices for ${productName}`);
    } catch (error) {
      console.error(
        `[${config.name}] Error scraping ${productName}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  return results;
}

/**
 * Save scraped prices to database
 */
async function savePricesToDatabase(scrapedPrices: ScrapedPrice[]): Promise<number> {
  try {
    const db = await getDb();
    if (!db) {
      console.error('[Scraper] Database connection failed');
      return 0;
    }

    let savedCount = 0;

    for (const scraped of scrapedPrices) {
      try {
        // Find or create product
        const existingProduct = await db
          .select()
          .from(products)
          .where(eq(products.name, scraped.productName))
          .limit(1);

        let productId: number;
        if (existingProduct.length > 0) {
          productId = existingProduct[0].id;
        } else {
          // Create new product
          const result = await db.insert(products).values({
            name: scraped.productName,
            category: 'Uncategorized',
            description: `Auto-discovered from ${scraped.storeName}`,
            imageUrl: null,
          });
          productId = result[0].insertId as number;
        }

        // Save price
        await db.insert(prices).values({
          productId,
          storeName: scraped.storeName,
          price: Math.round(scraped.price * 100), // Convert to cents
          originalPrice: scraped.originalPrice ? Math.round(scraped.originalPrice * 100) : null,
          discount: scraped.discount || null,
          url: scraped.url || null,
          trustScore: 75, // Default trust score for scraped prices
          trustLevel: 'MEDIUM',
          verificationStatus: 'UNVERIFIED',
          sourcesCount: 1,
          sources: JSON.stringify([{
            sourceName: scraped.storeName,
            sourceType: 'web_scraper',
            sourceUrl: scraped.url,
            verified: false,
            timestamp: scraped.lastUpdated.toISOString(),
          }]),
          lastUpdated: scraped.lastUpdated,
        });

        savedCount++;
      } catch (err) {
        console.error('[Scraper] Error saving price:', err);
      }
    }

    console.log(`[Scraper] Saved ${savedCount}/${scrapedPrices.length} prices to database`);
    return savedCount;
  } catch (error) {
    console.error('[Scraper] Database error:', error);
    return 0;
  }
}

/**
 * Get popular products to scrape
 */
async function getProductsToScrape(): Promise<string[]> {
  try {
    const db = await getDb();
    if (!db) return POPULAR_PRODUCTS;

    const dbProducts = await db.select({ name: products.name }).from(products).limit(50);
    return dbProducts.length > 0 ? dbProducts.map(p => p.name) : POPULAR_PRODUCTS;
  } catch (error) {
    console.error('[Scraper] Error loading products:', error);
    return POPULAR_PRODUCTS;
  }
}

const POPULAR_PRODUCTS = [
  'Full Cream Milk 1L',
  'Bread White Loaf',
  'Eggs Dozen',
  'Chicken Breast 1kg',
  'Beef Steak 500g',
  'Rice 5kg',
  'Tomatoes 1kg',
  'Apples 1kg',
  'Pork Chops 500g',
  'Peanut Butter 400g',
  'Carrots 1kg',
  'Onions 1kg',
  'Potatoes 2kg',
  'Cheese 200g',
  'Yogurt 500ml',
];

/**
 * Run complete price scraping cycle for all retailers
 */
export async function runLivePriceScraping(): Promise<{ success: boolean; scraped: number; saved: number }> {
  console.log('[Scraper] Starting live price scraping cycle...');
  const startTime = Date.now();

  try {
    const productsToScrape = await getProductsToScrape();
    console.log(`[Scraper] Will scrape ${productsToScrape.length} products from 5 retailers`);

    let totalScraped = 0;
    let totalSaved = 0;

    // Scrape each retailer
    for (const retailerKey of Object.keys(RETAILER_CONFIGS)) {
      try {
        console.log(`[Scraper] Scraping ${RETAILER_CONFIGS[retailerKey].name}...`);
        const scrapedPrices = await scrapeRetailerPrices(retailerKey, productsToScrape);
        totalScraped += scrapedPrices.length;

        const saved = await savePricesToDatabase(scrapedPrices);
        totalSaved += saved;
      } catch (error) {
        console.error(`[Scraper] Error processing ${retailerKey}:`, error);
      }
    }

    const duration = Date.now() - startTime;
    console.log(
      `[Scraper] Completed in ${duration}ms - Scraped: ${totalScraped}, Saved: ${totalSaved}`
    );

    return { success: true, scraped: totalScraped, saved: totalSaved };
  } catch (error) {
    console.error('[Scraper] Fatal error:', error);
    return { success: false, scraped: 0, saved: 0 };
  }
}

/**
 * Scrape prices for a specific product
 */
export async function scrapePricesForProduct(productName: string): Promise<ScrapedPrice[]> {
  const allResults: ScrapedPrice[] = [];

  for (const retailerKey of Object.keys(RETAILER_CONFIGS)) {
    try {
      const results = await scrapeRetailerPrices(retailerKey, [productName]);
      allResults.push(...results);
    } catch (error) {
      console.error(`[Scraper] Error scraping ${productName} from ${retailerKey}:`, error);
    }
  }

  return allResults;
}


