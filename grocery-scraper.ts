import * as cheerio from 'cheerio';
import axios, { AxiosInstance } from 'axios';
import { getDb } from '../db';
import { prices, products } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

interface ScrapedPrice {
  productName: string;
  storeName: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  url?: string;
  lastUpdated: Date;
}

// Create axios instance with proper headers and timeouts
const createScraperClient = (): AxiosInstance => {
  return axios.create({
    timeout: 10000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Referer': 'https://www.google.com/',
    },
  });
};

const client = createScraperClient();

// Delay function to avoid bot detection
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Scrape Spar prices
 */
export async function scrapeSparPrices(query: string): Promise<ScrapedPrice[]> {
  try {
    await delay(1000); // 1 second delay
    const searchUrl = `https://www.spar.co.za/search?q=${encodeURIComponent(query)}`;
    const response = await client.get(searchUrl);
    const $ = cheerio.load(response.data);
    const results: ScrapedPrice[] = [];

    // Look for product containers
    $('[data-testid="product-card"], [class*="product-card"], [class*="productCard"]').each((_: number, el: any) => {
      const $el = $(el);
      
      // Try multiple selectors for product name
      let productName = $el.find('[class*="product-name"], [data-testid="product-name"], h2, h3').first().text().trim();
      
      // Try multiple selectors for price
      let priceText = $el.find('[class*="price"], [data-testid="price"], [class*="Price"]').first().text().trim();
      
      // Parse price (handle formats like "R99.99", "99.99", "R 99,99")
      const priceMatch = priceText.match(/[\d,\.]+/);
      const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : NaN;

      if (productName && !isNaN(price) && price > 0) {
        results.push({
          productName,
          storeName: 'Spar',
          price,
          lastUpdated: new Date(),
        });
      }
    });

    console.log(`✓ Scraped ${results.length} prices from Spar`);
    return results;
  } catch (error) {
    console.error('✗ Error scraping Spar:', error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Scrape Pick n Pay prices
 */
export async function scrapePicknPayPrices(query: string): Promise<ScrapedPrice[]> {
  try {
    await delay(1000);
    const searchUrl = `https://www.pnp.co.za/search?q=${encodeURIComponent(query)}`;
    const response = await client.get(searchUrl);
    const $ = cheerio.load(response.data);
    const results: ScrapedPrice[] = [];

    $('[data-testid="product"], [class*="product"], [class*="Product"]').each((_: number, el: any) => {
      const $el = $(el);
      let productName = $el.find('h2, h3, [class*="name"]').first().text().trim();
      let priceText = $el.find('[class*="price"], [data-testid="price"]').first().text().trim();
      
      const priceMatch = priceText.match(/[\d,\.]+/);
      const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : NaN;

      if (productName && !isNaN(price) && price > 0) {
        results.push({
          productName,
          storeName: 'Pick n Pay',
          price,
          lastUpdated: new Date(),
        });
      }
    });

    console.log(`✓ Scraped ${results.length} prices from Pick n Pay`);
    return results;
  } catch (error) {
    console.error('✗ Error scraping Pick n Pay:', error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Scrape Checkers prices
 */
export async function scrapeCheckersPrices(query: string): Promise<ScrapedPrice[]> {
  try {
    await delay(1000);
    const searchUrl = `https://www.checkers.co.za/search?q=${encodeURIComponent(query)}`;
    const response = await client.get(searchUrl);
    const $ = cheerio.load(response.data);
    const results: ScrapedPrice[] = [];

    $('[data-testid="product-card"], [class*="product-item"]').each((_: number, el: any) => {
      const $el = $(el);
      let productName = $el.find('h2, h3, [class*="name"]').first().text().trim();
      let priceText = $el.find('[class*="price"], [data-testid="price"]').first().text().trim();
      
      const priceMatch = priceText.match(/[\d,\.]+/);
      const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : NaN;

      if (productName && !isNaN(price) && price > 0) {
        results.push({
          productName,
          storeName: 'Checkers',
          price,
          lastUpdated: new Date(),
        });
      }
    });

    console.log(`✓ Scraped ${results.length} prices from Checkers`);
    return results;
  } catch (error) {
    console.error('✗ Error scraping Checkers:', error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Scrape Woolworths prices
 */
export async function scrapeWoolworthsPrices(query: string): Promise<ScrapedPrice[]> {
  try {
    await delay(1000);
    const searchUrl = `https://www.woolworths.co.za/search?q=${encodeURIComponent(query)}`;
    const response = await client.get(searchUrl);
    const $ = cheerio.load(response.data);
    const results: ScrapedPrice[] = [];

    $('[class*="product"], [data-testid="product"]').each((_: number, el: any) => {
      const $el = $(el);
      let productName = $el.find('h2, h3, [class*="name"]').first().text().trim();
      let priceText = $el.find('[class*="price"], [data-testid="price"]').first().text().trim();
      
      const priceMatch = priceText.match(/[\d,\.]+/);
      const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : NaN;

      if (productName && !isNaN(price) && price > 0) {
        results.push({
          productName,
          storeName: 'Woolworths',
          price,
          lastUpdated: new Date(),
        });
      }
    });

    console.log(`✓ Scraped ${results.length} prices from Woolworths`);
    return results;
  } catch (error) {
    console.error('✗ Error scraping Woolworths:', error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Scrape OK Foods prices
 */
export async function scrapeOKFoodsPrices(query: string): Promise<ScrapedPrice[]> {
  try {
    await delay(1000);
    const searchUrl = `https://www.okfoods.co.za/search?q=${encodeURIComponent(query)}`;
    const response = await client.get(searchUrl);
    const $ = cheerio.load(response.data);
    const results: ScrapedPrice[] = [];

    $('[class*="product"], [data-testid="product"]').each((_: number, el: any) => {
      const $el = $(el);
      let productName = $el.find('h2, h3, [class*="name"]').first().text().trim();
      let priceText = $el.find('[class*="price"], [data-testid="price"]').first().text().trim();
      
      const priceMatch = priceText.match(/[\d,\.]+/);
      const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : NaN;

      if (productName && !isNaN(price) && price > 0) {
        results.push({
          productName,
          storeName: 'OK Foods',
          price,
          lastUpdated: new Date(),
        });
      }
    });

    console.log(`✓ Scraped ${results.length} prices from OK Foods`);
    return results;
  } catch (error) {
    console.error('✗ Error scraping OK Foods:', error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Scrape ShopRite prices
 */
export async function scrapeShopRitePrices(query: string): Promise<ScrapedPrice[]> {
  try {
    await delay(1000);
    const searchUrl = `https://www.shoprite.co.za/search?q=${encodeURIComponent(query)}`;
    const response = await client.get(searchUrl);
    const $ = cheerio.load(response.data);
    const results: ScrapedPrice[] = [];

    $('[class*="product"], [data-testid="product"]').each((_: number, el: any) => {
      const $el = $(el);
      let productName = $el.find('h2, h3, [class*="name"]').first().text().trim();
      let priceText = $el.find('[class*="price"], [data-testid="price"]').first().text().trim();
      
      const priceMatch = priceText.match(/[\d,\.]+/);
      const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : NaN;

      if (productName && !isNaN(price) && price > 0) {
        results.push({
          productName,
          storeName: 'ShopRite',
          price,
          lastUpdated: new Date(),
        });
      }
    });

    console.log(`✓ Scraped ${results.length} prices from ShopRite`);
    return results;
  } catch (error) {
    console.error('✗ Error scraping ShopRite:', error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Scrape prices for a product across all retailers
 */
export async function scrapeProductPrices(productName: string): Promise<ScrapedPrice[]> {
  const allPrices: ScrapedPrice[] = [];

  const scrapers = [
    scrapeSparPrices,
    scrapePicknPayPrices,
    scrapeCheckersPrices,
    scrapeWoolworthsPrices,
    scrapeOKFoodsPrices,
    scrapeShopRitePrices,
  ];

  for (const scraper of scrapers) {
    try {
      const prices = await scraper(productName);
      allPrices.push(...prices);
    } catch (error) {
      console.error(`Error in scraper:`, error);
    }
  }

  return allPrices;
}

/**
 * Store scraped prices in database
 */
export async function storePrices(scrapedPrices: ScrapedPrice[]): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    return;
  }

  for (const item of scrapedPrices) {
    try {
      // Find or create product
      const existingProducts = await db
        .select()
        .from(products)
        .where(eq(products.name, item.productName));

      let productId: number;

      if (existingProducts.length > 0) {
        productId = existingProducts[0].id;
      } else {
        const result = await db.insert(products).values({
          name: item.productName,
          category: 'Other',
          description: `${item.storeName} product`,
        });
        productId = (result as any).insertId || 1;
      }

      // Store price
      await db.insert(prices).values({
        productId,
        storeName: item.storeName,
        price: Math.round(item.price * 100), // Store as cents
        url: item.url || null,
      });
    } catch (error) {
      console.error(`Error storing price for ${item.productName}:`, error);
    }
  }
}

/**
 * Batch scrape popular products
 */
export async function batchScrapePopularProducts(): Promise<void> {
  const popularProducts = [
    'Milk',
    'Bread',
    'Eggs',
    'Chicken',
    'Beef',
    'Rice',
    'Tomatoes',
    'Apples',
    'Pork Chops',
    'Peanut Butter',
  ];

  for (const product of popularProducts) {
    try {
      const prices = await scrapeProductPrices(product);
      await storePrices(prices);
      await delay(2000); // 2 second delay between products
    } catch (error) {
      console.error(`Error scraping ${product}:`, error);
    }
  }
}

/**
 * Get latest prices for a product
 */
export async function getLatestPrices(productName: string) {
  const db = await getDb();
  if (!db) return [];

  const productList = await db.select().from(products).where(eq(products.name, productName));
  if (productList.length === 0) return [];

  const priceList = await db.select().from(prices).where(eq(prices.productId, productList[0].id));
  return priceList.map((p: any) => ({
    ...p,
    price: p.price / 100, // Convert from cents
  }));
}

export default {
  scrapeSparPrices,
  scrapePicknPayPrices,
  scrapeCheckersPrices,
  scrapeWoolworthsPrices,
  scrapeOKFoodsPrices,
  scrapeShopRitePrices,
  scrapeProductPrices,
  storePrices,
  batchScrapePopularProducts,
  getLatestPrices,
};
