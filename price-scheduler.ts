import { CronJob } from "cron";
import { getDb } from "./db";
import { products, prices } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { runLivePriceScraping } from "./scrapers/live-price-scraper";

// Get all products from database for scraping
async function getAllProductsToScrape() {
  try {
    const db = await getDb();
    if (!db) return POPULAR_PRODUCTS;
    const allProducts = await db.select({ name: products.name }).from(products);
    const productNames = allProducts.map(p => p.name);
    console.log(`[Price Scheduler] Found ${productNames.length} products to scrape`);
    return productNames.length > 0 ? productNames : POPULAR_PRODUCTS;
  } catch (error) {
    console.error("[Price Scheduler] Error loading products, using popular products:", error);
    return POPULAR_PRODUCTS;
  }
}

const POPULAR_PRODUCTS = [
  "Milk",
  "Bread",
  "Eggs",
  "Chicken",
  "Beef",
  "Rice",
  "Tomatoes",
  "Apples",
  "Pork Chops",
  "Peanut Butter",
]

let priceScheduler: CronJob | null = null;

/**
 * Start the price scraping scheduler (runs every 6 hours)
 */
export async function startPriceScheduler() {
  if (priceScheduler) {
    console.log("[Price Scheduler] Already running");
    return;
  }

  console.log("[Price Scheduler] Starting price scraper (every 6 hours)");

  // Run immediately on start
  await scrapePrices();

  // Then run every 6 hours (0 0 */6 * * *)
  priceScheduler = new CronJob("0 0 */6 * * *", async () => {
    console.log("[Price Scheduler] Running scheduled price scrape");
    await scrapePrices();
  });

  priceScheduler.start();
  console.log("[Price Scheduler] Scheduler started successfully");
}

/**
 * Stop the price scraping scheduler
 */
export function stopPriceScheduler() {
  if (priceScheduler) {
    priceScheduler.stop();
    priceScheduler = null;
    console.log("[Price Scheduler] Scheduler stopped");
  }
}



/**
 * Main scraping function that runs on schedule
 * Uses live HTTP-based scraper with no Puppeteer dependency
 */
async function scrapePrices() {
  console.log(`[Price Scheduler] Starting live price scrape at ${new Date().toISOString()}`);
  
  try {
    const result = await runLivePriceScraping();
    
    if (result.success) {
      console.log(
        `[Price Scheduler] ✅ Scrape complete: ${result.scraped} items scraped, ${result.saved} prices saved`
      );
    } else {
      console.error(
        `[Price Scheduler] ❌ Scrape failed: scraped=${result.scraped}, saved=${result.saved}`
      );
    }
  } catch (error) {
    console.error(`[Price Scheduler] ❌ Fatal scraping error:`, error);
  }
}

/**
 * Get latest prices for a product
 */
export async function getLatestPrices(productId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select().from(prices).where(eq(prices.productId, productId));

  return result.map((p: any) => ({
    ...p,
    price: p.price / 100, // Convert from cents back to Rand
  }));
}

/**
 * Get price history for a product
 */
export async function getPriceHistory(productId: number, days: number = 30) {
  const db = await getDb();
  if (!db) return [];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const result = await db.select().from(prices).where(eq(prices.productId, productId));

  return result
    .filter((p: any) => new Date(p.lastUpdated) >= cutoffDate)
    .map((p: any) => ({
      ...p,
      price: p.price / 100, // Convert from cents back to Rand
    }));
}

/**
 * Get best prices across all stores for a product
 */
export async function getBestPrices(productId: number) {
  const prices_list = await getLatestPrices(productId);
  if (prices_list.length === 0) return [];

  // Sort by price and return top 3
  return prices_list.sort((a: any, b: any) => a.price - b.price).slice(0, 3);
}

/**
 * Get price comparison for multiple products
 */
export async function getPriceComparison(productIds: number[]) {
  const comparison: any = {};

  for (const productId of productIds) {
    const priceList = await getLatestPrices(productId);
    if (priceList.length > 0) {
      comparison[productId] = {
        best: Math.min(...priceList.map((p: any) => p.price)),
        average: priceList.reduce((sum: number, p: any) => sum + p.price, 0) / priceList.length,
        stores: priceList,
      };
    }
  }

  return comparison;
}
