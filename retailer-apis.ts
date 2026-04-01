import axios from 'axios';

interface ScrapedPrice {
  productName: string;
  storeName: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  url?: string;
  lastUpdated: Date;
}

/**
 * Spar API Integration
 * Spar has a public API for product search
 */
export async function scrapeSparAPI(query: string): Promise<ScrapedPrice[]> {
  try {
    console.log('[Spar API] Searching for:', query);

    // Spar API endpoint (if available)
    const response = await axios.get(`https://www.spar.co.za/api/search`, {
      params: { q: query },
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const results: ScrapedPrice[] = [];

    if (response.data && response.data.products) {
      response.data.products.forEach((product: any) => {
        results.push({
          productName: product.name || product.title,
          storeName: 'Spar',
          price: parseFloat(product.price) || 0,
          originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
          discount: product.discount,
          url: product.url,
          lastUpdated: new Date(),
        });
      });
    }

    console.log(`[Spar API] ✓ Found ${results.length} products`);
    return results;
  } catch (error) {
    console.error('[Spar API] ✗ Error:', error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Pick n Pay API Integration
 * Pick n Pay has a public API for product search
 */
export async function scrapePicknPayAPI(query: string): Promise<ScrapedPrice[]> {
  try {
    console.log('[Pick n Pay API] Searching for:', query);

    // Pick n Pay API endpoint
    const response = await axios.get(`https://www.pnp.co.za/api/search`, {
      params: { q: query },
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const results: ScrapedPrice[] = [];

    if (response.data && response.data.products) {
      response.data.products.forEach((product: any) => {
        results.push({
          productName: product.name || product.title,
          storeName: 'Pick n Pay',
          price: parseFloat(product.price) || 0,
          originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
          discount: product.discount,
          url: product.url,
          lastUpdated: new Date(),
        });
      });
    }

    console.log(`[Pick n Pay API] ✓ Found ${results.length} products`);
    return results;
  } catch (error) {
    console.error('[Pick n Pay API] ✗ Error:', error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Checkers API Integration
 * Checkers has a public API for product search
 */
export async function scrapCheckersAPI(query: string): Promise<ScrapedPrice[]> {
  try {
    console.log('[Checkers API] Searching for:', query);

    // Checkers API endpoint
    const response = await axios.get(`https://www.checkers.co.za/api/search`, {
      params: { q: query },
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const results: ScrapedPrice[] = [];

    if (response.data && response.data.products) {
      response.data.products.forEach((product: any) => {
        results.push({
          productName: product.name || product.title,
          storeName: 'Checkers',
          price: parseFloat(product.price) || 0,
          originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
          discount: product.discount,
          url: product.url,
          lastUpdated: new Date(),
        });
      });
    }

    console.log(`[Checkers API] ✓ Found ${results.length} products`);
    return results;
  } catch (error) {
    console.error('[Checkers API] ✗ Error:', error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Woolworths API Integration
 */
export async function scrapeWoolworthsAPI(query: string): Promise<ScrapedPrice[]> {
  try {
    console.log('[Woolworths API] Searching for:', query);

    const response = await axios.get(`https://www.woolworths.co.za/api/search`, {
      params: { q: query },
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const results: ScrapedPrice[] = [];

    if (response.data && response.data.products) {
      response.data.products.forEach((product: any) => {
        results.push({
          productName: product.name || product.title,
          storeName: 'Woolworths',
          price: parseFloat(product.price) || 0,
          originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
          discount: product.discount,
          url: product.url,
          lastUpdated: new Date(),
        });
      });
    }

    console.log(`[Woolworths API] ✓ Found ${results.length} products`);
    return results;
  } catch (error) {
    console.error('[Woolworths API] ✗ Error:', error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * OK Foods API Integration
 */
export async function scrapeOKFoodsAPI(query: string): Promise<ScrapedPrice[]> {
  try {
    console.log('[OK Foods API] Searching for:', query);

    const response = await axios.get(`https://www.okfoods.co.za/api/search`, {
      params: { q: query },
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const results: ScrapedPrice[] = [];

    if (response.data && response.data.products) {
      response.data.products.forEach((product: any) => {
        results.push({
          productName: product.name || product.title,
          storeName: 'OK Foods',
          price: parseFloat(product.price) || 0,
          originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
          discount: product.discount,
          url: product.url,
          lastUpdated: new Date(),
        });
      });
    }

    console.log(`[OK Foods API] ✓ Found ${results.length} products`);
    return results;
  } catch (error) {
    console.error('[OK Foods API] ✗ Error:', error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * ShopRite API Integration
 */
export async function scrapeShopRiteAPI(query: string): Promise<ScrapedPrice[]> {
  try {
    console.log('[ShopRite API] Searching for:', query);

    const response = await axios.get(`https://www.shoprite.co.za/api/search`, {
      params: { q: query },
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const results: ScrapedPrice[] = [];

    if (response.data && response.data.products) {
      response.data.products.forEach((product: any) => {
        results.push({
          productName: product.name || product.title,
          storeName: 'ShopRite',
          price: parseFloat(product.price) || 0,
          originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
          discount: product.discount,
          url: product.url,
          lastUpdated: new Date(),
        });
      });
    }

    console.log(`[ShopRite API] ✓ Found ${results.length} products`);
    return results;
  } catch (error) {
    console.error('[ShopRite API] ✗ Error:', error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Try all APIs for a product
 */
export async function scrapeAllAPIs(query: string): Promise<ScrapedPrice[]> {
  const allPrices: ScrapedPrice[] = [];

  const apis = [
    scrapeSparAPI,
    scrapePicknPayAPI,
    scrapCheckersAPI,
    scrapeWoolworthsAPI,
    scrapeOKFoodsAPI,
    scrapeShopRiteAPI,
  ];

  for (const api of apis) {
    try {
      const prices = await api(query);
      allPrices.push(...prices);
    } catch (error) {
      console.error('[Retailer APIs] Error in API:', error);
    }
  }

  return allPrices;
}

export default {
  scrapeSparAPI,
  scrapePicknPayAPI,
  scrapCheckersAPI,
  scrapeWoolworthsAPI,
  scrapeOKFoodsAPI,
  scrapeShopRiteAPI,
  scrapeAllAPIs,
};
