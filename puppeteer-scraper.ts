import puppeteer, { Browser, Page } from 'puppeteer';

interface ScrapedPrice {
  productName: string;
  storeName: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  url?: string;
  lastUpdated: Date;
}

let browser: Browser | null = null;

/**
 * Initialize Puppeteer browser
 */
async function initBrowser(): Promise<Browser> {
  if (browser) return browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
      ],
    });
    console.log('[Puppeteer] Browser initialized');
    return browser;
  } catch (error) {
    console.error('[Puppeteer] Failed to initialize browser:', error);
    throw error;
  }
}

/**
 * Close Puppeteer browser
 */
export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
    console.log('[Puppeteer] Browser closed');
  }
}

/**
 * Scrape Spar using Puppeteer
 */
export async function scrapeSparWithPuppeteer(query: string): Promise<ScrapedPrice[]> {
  const results: ScrapedPrice[] = [];

  try {
    const browser = await initBrowser();
    const page = await browser.newPage();

    // Set viewport and user agent
    await page.setViewport({ width: 1280, height: 720 });
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    const searchUrl = `https://www.spar.co.za/search?q=${encodeURIComponent(query)}`;
    console.log(`[Puppeteer] Fetching Spar: ${searchUrl}`);

    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for products to load
    await page.waitForSelector('[class*="product"], [data-testid="product"]', { timeout: 5000 }).catch(() => {});

    // Extract product data
    const products = await page.evaluate(() => {
      const items: any[] = [];
      const productElements = document.querySelectorAll('[class*="product"], [data-testid="product"]');

      productElements.forEach((el) => {
        const nameEl = el.querySelector('h2, h3, [class*="name"]');
        const priceEl = el.querySelector('[class*="price"], [data-testid="price"]');

        if (nameEl && priceEl) {
          const name = nameEl.textContent?.trim() || '';
          const priceText = priceEl.textContent?.trim() || '';
          const priceMatch = priceText.match(/[\d,\.]+/);
          const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : NaN;

          if (name && !isNaN(price) && price > 0) {
            items.push({ name, price });
          }
        }
      });

      return items;
    });

    results.push(
      ...products.map((p: any) => ({
        productName: p.name,
        storeName: 'Spar',
        price: p.price,
        lastUpdated: new Date(),
      }))
    );

    await page.close();
    console.log(`[Puppeteer] ✓ Scraped ${results.length} prices from Spar`);
  } catch (error) {
    console.error('[Puppeteer] ✗ Error scraping Spar:', error instanceof Error ? error.message : error);
  }

  return results;
}

/**
 * Scrape Pick n Pay using Puppeteer
 */
export async function scrapePicknPayWithPuppeteer(query: string): Promise<ScrapedPrice[]> {
  const results: ScrapedPrice[] = [];

  try {
    const browser = await initBrowser();
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 720 });
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    const searchUrl = `https://www.pnp.co.za/search?q=${encodeURIComponent(query)}`;
    console.log(`[Puppeteer] Fetching Pick n Pay: ${searchUrl}`);

    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('[class*="product"], [data-testid="product"]', { timeout: 5000 }).catch(() => {});

    const products = await page.evaluate(() => {
      const items: any[] = [];
      const productElements = document.querySelectorAll('[class*="product"], [data-testid="product"]');

      productElements.forEach((el) => {
        const nameEl = el.querySelector('h2, h3, [class*="name"]');
        const priceEl = el.querySelector('[class*="price"], [data-testid="price"]');

        if (nameEl && priceEl) {
          const name = nameEl.textContent?.trim() || '';
          const priceText = priceEl.textContent?.trim() || '';
          const priceMatch = priceText.match(/[\d,\.]+/);
          const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : NaN;

          if (name && !isNaN(price) && price > 0) {
            items.push({ name, price });
          }
        }
      });

      return items;
    });

    results.push(
      ...products.map((p: any) => ({
        productName: p.name,
        storeName: 'Pick n Pay',
        price: p.price,
        lastUpdated: new Date(),
      }))
    );

    await page.close();
    console.log(`[Puppeteer] ✓ Scraped ${results.length} prices from Pick n Pay`);
  } catch (error) {
    console.error('[Puppeteer] ✗ Error scraping Pick n Pay:', error instanceof Error ? error.message : error);
  }

  return results;
}

/**
 * Scrape Checkers using Puppeteer
 */
export async function scrapCheckersWithPuppeteer(query: string): Promise<ScrapedPrice[]> {
  const results: ScrapedPrice[] = [];

  try {
    const browser = await initBrowser();
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 720 });
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    const searchUrl = `https://www.checkers.co.za/search?q=${encodeURIComponent(query)}`;
    console.log(`[Puppeteer] Fetching Checkers: ${searchUrl}`);

    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('[class*="product"], [data-testid="product"]', { timeout: 5000 }).catch(() => {});

    const products = await page.evaluate(() => {
      const items: any[] = [];
      const productElements = document.querySelectorAll('[class*="product"], [data-testid="product"]');

      productElements.forEach((el) => {
        const nameEl = el.querySelector('h2, h3, [class*="name"]');
        const priceEl = el.querySelector('[class*="price"], [data-testid="price"]');

        if (nameEl && priceEl) {
          const name = nameEl.textContent?.trim() || '';
          const priceText = priceEl.textContent?.trim() || '';
          const priceMatch = priceText.match(/[\d,\.]+/);
          const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : NaN;

          if (name && !isNaN(price) && price > 0) {
            items.push({ name, price });
          }
        }
      });

      return items;
    });

    results.push(
      ...products.map((p: any) => ({
        productName: p.name,
        storeName: 'Checkers',
        price: p.price,
        lastUpdated: new Date(),
      }))
    );

    await page.close();
    console.log(`[Puppeteer] ✓ Scraped ${results.length} prices from Checkers`);
  } catch (error) {
    console.error('[Puppeteer] ✗ Error scraping Checkers:', error instanceof Error ? error.message : error);
  }

  return results;
}

/**
 * Scrape Woolworths using Puppeteer
 */
export async function scrapeWoolworthsWithPuppeteer(query: string): Promise<ScrapedPrice[]> {
  const results: ScrapedPrice[] = [];

  try {
    const browser = await initBrowser();
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 720 });
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    const searchUrl = `https://www.woolworths.co.za/search?q=${encodeURIComponent(query)}`;
    console.log(`[Puppeteer] Fetching Woolworths: ${searchUrl}`);

    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('[class*="product"], [data-testid="product"]', { timeout: 5000 }).catch(() => {});

    const products = await page.evaluate(() => {
      const items: any[] = [];
      const productElements = document.querySelectorAll('[class*="product"], [data-testid="product"]');

      productElements.forEach((el) => {
        const nameEl = el.querySelector('h2, h3, [class*="name"]');
        const priceEl = el.querySelector('[class*="price"], [data-testid="price"]');

        if (nameEl && priceEl) {
          const name = nameEl.textContent?.trim() || '';
          const priceText = priceEl.textContent?.trim() || '';
          const priceMatch = priceText.match(/[\d,\.]+/);
          const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : NaN;

          if (name && !isNaN(price) && price > 0) {
            items.push({ name, price });
          }
        }
      });

      return items;
    });

    results.push(
      ...products.map((p: any) => ({
        productName: p.name,
        storeName: 'Woolworths',
        price: p.price,
        lastUpdated: new Date(),
      }))
    );

    await page.close();
    console.log(`[Puppeteer] ✓ Scraped ${results.length} prices from Woolworths`);
  } catch (error) {
    console.error('[Puppeteer] ✗ Error scraping Woolworths:', error instanceof Error ? error.message : error);
  }

  return results;
}

/**
 * Scrape all retailers using Puppeteer
 */
export async function scrapeAllWithPuppeteer(query: string): Promise<ScrapedPrice[]> {
  const allPrices: ScrapedPrice[] = [];

  const scrapers = [
    scrapeSparWithPuppeteer,
    scrapePicknPayWithPuppeteer,
    scrapCheckersWithPuppeteer,
    scrapeWoolworthsWithPuppeteer,
  ];

  for (const scraper of scrapers) {
    try {
      const prices = await scraper(query);
      allPrices.push(...prices);
      // Add delay between retailers
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('[Puppeteer] Error in scraper:', error);
    }
  }

  return allPrices;
}

export default {
  scrapeSparWithPuppeteer,
  scrapePicknPayWithPuppeteer,
  scrapCheckersWithPuppeteer,
  scrapeWoolworthsWithPuppeteer,
  scrapeAllWithPuppeteer,
  closeBrowser,
};
