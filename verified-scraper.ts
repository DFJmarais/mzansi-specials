import puppeteer, { Browser } from "puppeteer";

export interface VerifiedPrice {
  storeName: string;
  price: number; // in cents
  url: string;
  verified: boolean;
  verifiedAt: Date;
  confidence: number; // 0-100
  source: "shoprite" | "spar" | "pnp" | "checkers" | "woolworths";
}

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
  return browser;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

/**
 * Extract price from text using regex
 */
function extractPrice(text: string): number | null {
  const match = text.match(/R\s*(\d+(?:[.,]\d{2})?)/i);
  if (!match) return null;
  const priceStr = match[1].replace(",", ".");
  return Math.round(parseFloat(priceStr) * 100);
}

/**
 * Search and scrape price from ShopRite
 */
export async function searchAndScrapeShopritePrice(
  productName: string
): Promise<VerifiedPrice | null> {
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setDefaultTimeout(15000);

    const searchUrl = `https://www.shoprite.co.za/search?q=${encodeURIComponent(productName)}`;
    console.log(`[ShopRite] Searching: ${searchUrl}`);

    await page.goto(searchUrl, { waitUntil: "networkidle2" });

    const priceText = await page.evaluate(() => {
      const priceElements = document.querySelectorAll("span, div, p");
      for (let i = 0; i < priceElements.length; i++) {
        const el = priceElements[i];
        const text = el.textContent || "";
        if (text.match(/R\s*\d+/)) {
          return text;
        }
      }
      return null;
    });

    if (!priceText) {
      console.log(`[ShopRite] No price found for "${productName}"`);
      await page.close();
      return null;
    }

    const price = extractPrice(priceText);
    if (!price) {
      await page.close();
      return null;
    }

    const url = page.url();
    await page.close();

    console.log(`[ShopRite] Found price: R${(price / 100).toFixed(2)}`);

    return {
      storeName: "ShopRite",
      price,
      url,
      verified: true,
      verifiedAt: new Date(),
      confidence: 95,
      source: "shoprite",
    };
  } catch (error) {
    console.error("[ShopRite] Error:", error);
    return null;
  }
}

/**
 * Search and scrape price from Spar
 */
export async function searchAndScrapeSparPrice(
  productName: string
): Promise<VerifiedPrice | null> {
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setDefaultTimeout(15000);

    const searchUrl = `https://www.spar.co.za/search?q=${encodeURIComponent(productName)}`;
    console.log(`[Spar] Searching: ${searchUrl}`);

    await page.goto(searchUrl, { waitUntil: "networkidle2" });

    const priceText = await page.evaluate(() => {
      const priceElements = document.querySelectorAll("span, div, p");
      for (let i = 0; i < priceElements.length; i++) {
        const el = priceElements[i];
        const text = el.textContent || "";
        if (text.match(/R\s*\d+/)) {
          return text;
        }
      }
      return null;
    });

    if (!priceText) {
      console.log(`[Spar] No price found for "${productName}"`);
      await page.close();
      return null;
    }

    const price = extractPrice(priceText);
    if (!price) {
      await page.close();
      return null;
    }

    const url = page.url();
    await page.close();

    console.log(`[Spar] Found price: R${(price / 100).toFixed(2)}`);

    return {
      storeName: "Spar",
      price,
      url,
      verified: true,
      verifiedAt: new Date(),
      confidence: 90,
      source: "spar",
    };
  } catch (error) {
    console.error("[Spar] Error:", error);
    return null;
  }
}

/**
 * Search and scrape price from Pick n Pay
 */
export async function searchAndScrapePnPPrice(
  productName: string
): Promise<VerifiedPrice | null> {
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setDefaultTimeout(15000);

    const searchUrl = `https://www.pnp.co.za/search?q=${encodeURIComponent(productName)}`;
    console.log(`[Pick n Pay] Searching: ${searchUrl}`);

    await page.goto(searchUrl, { waitUntil: "networkidle2" });

    const priceText = await page.evaluate(() => {
      const priceElements = document.querySelectorAll("span, div, p");
      for (let i = 0; i < priceElements.length; i++) {
        const el = priceElements[i];
        const text = el.textContent || "";
        if (text.match(/R\s*\d+/)) {
          return text;
        }
      }
      return null;
    });

    if (!priceText) {
      console.log(`[Pick n Pay] No price found for "${productName}"`);
      await page.close();
      return null;
    }

    const price = extractPrice(priceText);
    if (!price) {
      await page.close();
      return null;
    }

    const url = page.url();
    await page.close();

    console.log(`[Pick n Pay] Found price: R${(price / 100).toFixed(2)}`);

    return {
      storeName: "Pick n Pay",
      price,
      url,
      verified: true,
      verifiedAt: new Date(),
      confidence: 90,
      source: "pnp",
    };
  } catch (error) {
    console.error("[Pick n Pay] Error:", error);
    return null;
  }
}

/**
 * Search and scrape price from Checkers
 */
export async function searchAndScrapeCheckersPrice(
  productName: string
): Promise<VerifiedPrice | null> {
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setDefaultTimeout(15000);

    const searchUrl = `https://www.checkers.co.za/search?q=${encodeURIComponent(productName)}`;
    console.log(`[Checkers] Searching: ${searchUrl}`);

    await page.goto(searchUrl, { waitUntil: "networkidle2" });

    const priceText = await page.evaluate(() => {
      const priceElements = document.querySelectorAll("span, div, p");
      for (let i = 0; i < priceElements.length; i++) {
        const el = priceElements[i];
        const text = el.textContent || "";
        if (text.match(/R\s*\d+/)) {
          return text;
        }
      }
      return null;
    });

    if (!priceText) {
      console.log(`[Checkers] No price found for "${productName}"`);
      await page.close();
      return null;
    }

    const price = extractPrice(priceText);
    if (!price) {
      await page.close();
      return null;
    }

    const url = page.url();
    await page.close();

    console.log(`[Checkers] Found price: R${(price / 100).toFixed(2)}`);

    return {
      storeName: "Checkers",
      price,
      url,
      verified: true,
      verifiedAt: new Date(),
      confidence: 90,
      source: "checkers",
    };
  } catch (error) {
    console.error("[Checkers] Error:", error);
    return null;
  }
}

/**
 * Search and scrape price from Woolworths
 */
export async function searchAndScrapeWoolworthsPrice(
  productName: string
): Promise<VerifiedPrice | null> {
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setDefaultTimeout(15000);

    const searchUrl = `https://www.woolworths.co.za/search?q=${encodeURIComponent(productName)}`;
    console.log(`[Woolworths] Searching: ${searchUrl}`);

    await page.goto(searchUrl, { waitUntil: "networkidle2" });

    const priceText = await page.evaluate(() => {
      const priceElements = document.querySelectorAll("span, div, p");
      for (let i = 0; i < priceElements.length; i++) {
        const el = priceElements[i];
        const text = el.textContent || "";
        if (text.match(/R\s*\d+/)) {
          return text;
        }
      }
      return null;
    });

    if (!priceText) {
      console.log(`[Woolworths] No price found for "${productName}"`);
      await page.close();
      return null;
    }

    const price = extractPrice(priceText);
    if (!price) {
      await page.close();
      return null;
    }

    const url = page.url();
    await page.close();

    console.log(`[Woolworths] Found price: R${(price / 100).toFixed(2)}`);

    return {
      storeName: "Woolworths",
      price,
      url,
      verified: true,
      verifiedAt: new Date(),
      confidence: 90,
      source: "woolworths",
    };
  } catch (error) {
    console.error("[Woolworths] Error:", error);
    return null;
  }
}

/**
 * Validate price is within realistic range for product category
 */
export function validatePrice(
  productName: string,
  price: number
): { valid: boolean; reason?: string } {
  // Price in cents - convert to Rands for checking
  const priceInRands = price / 100;

  // Realistic price ranges for SA groceries
  const MIN_PRICE = 0.5; // 50 cents minimum
  const MAX_PRICE = 500; // R500 maximum for most grocery items

  if (priceInRands < MIN_PRICE) {
    return { valid: false, reason: `Price too low: R${priceInRands}` };
  }

  if (priceInRands > MAX_PRICE) {
    return { valid: false, reason: `Price too high: R${priceInRands}` };
  }

  return { valid: true };
}

/**
 * Scrape prices from all retailers for a product
 */
export async function scrapeAllRetailersForProduct(
  productName: string
): Promise<VerifiedPrice[]> {
  console.log(`[Verified Scraper] Scraping all retailers for "${productName}"`);

  const results: VerifiedPrice[] = [];

  // Scrape all retailers in parallel
  const [shoprite, spar, pnp, checkers, woolworths] = await Promise.all([
    searchAndScrapeShopritePrice(productName),
    searchAndScrapeSparPrice(productName),
    searchAndScrapePnPPrice(productName),
    searchAndScrapeCheckersPrice(productName),
    searchAndScrapeWoolworthsPrice(productName),
  ]);

  // Add valid prices to results
  if (shoprite && validatePrice(productName, shoprite.price).valid) {
    results.push(shoprite);
  }
  if (spar && validatePrice(productName, spar.price).valid) {
    results.push(spar);
  }
  if (pnp && validatePrice(productName, pnp.price).valid) {
    results.push(pnp);
  }
  if (checkers && validatePrice(productName, checkers.price).valid) {
    results.push(checkers);
  }
  if (woolworths && validatePrice(productName, woolworths.price).valid) {
    results.push(woolworths);
  }

  console.log(
    `[Verified Scraper] Found ${results.length} verified prices for "${productName}"`
  );
  return results;
}
