import axios from 'axios';

/**
 * Live Retailer API Integration
 * Fetches real-time pricing from South African retailers
 */

export interface LiveProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl?: string;
  url: string;
  retailer: string;
  inStock: boolean;
  lastUpdated: Date;
}

/**
 * Checkers Live API
 * Endpoint: https://www.checkers.co.za/api/v1/search
 */
export async function fetchCheckersLive(query: string): Promise<LiveProduct[]> {
  try {
    const response = await axios.get('https://www.checkers.co.za/api/v1/search', {
      params: {
        q: query,
        limit: 50,
        offset: 0,
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      timeout: 10000,
    });

    return (response.data.results || []).map((item: any) => ({
      id: item.id || item.sku,
      name: item.name || item.title,
      brand: item.brand || 'Checkers',
      category: item.category || 'Groceries',
      price: Math.round(parseFloat(item.price || 0) * 100),
      originalPrice: item.originalPrice ? Math.round(parseFloat(item.originalPrice) * 100) : undefined,
      discount: item.discount || 0,
      imageUrl: item.image || item.imageUrl,
      url: item.url || `https://www.checkers.co.za/p/${item.id}`,
      retailer: 'Checkers',
      inStock: item.inStock !== false,
      lastUpdated: new Date(),
    }));
  } catch (error) {
    console.error('[Checkers Live] Error fetching products:', error);
    return [];
  }
}

/**
 * Pick n Pay Live API
 * Endpoint: https://www.picknpay.co.za/api/v1/search
 */
export async function fetchPicknPayLive(query: string): Promise<LiveProduct[]> {
  try {
    const response = await axios.get('https://www.picknpay.co.za/api/v1/search', {
      params: {
        q: query,
        limit: 50,
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      timeout: 10000,
    });

    return (response.data.products || []).map((item: any) => ({
      id: item.id || item.sku,
      name: item.name || item.title,
      brand: item.brand || 'Pick n Pay',
      category: item.category || 'Groceries',
      price: Math.round(parseFloat(item.price || 0) * 100),
      originalPrice: item.originalPrice ? Math.round(parseFloat(item.originalPrice) * 100) : undefined,
      discount: item.discount || 0,
      imageUrl: item.image || item.imageUrl,
      url: item.url || `https://www.picknpay.co.za/p/${item.id}`,
      retailer: 'Pick n Pay',
      inStock: item.inStock !== false,
      lastUpdated: new Date(),
    }));
  } catch (error) {
    console.error('[Pick n Pay Live] Error fetching products:', error);
    return [];
  }
}

/**
 * SPAR Live API
 * Endpoint: https://www.spar.co.za/api/v1/search
 */
export async function fetchSparLive(query: string): Promise<LiveProduct[]> {
  try {
    const response = await axios.get('https://www.spar.co.za/api/v1/search', {
      params: {
        q: query,
        limit: 50,
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      timeout: 10000,
    });

    return (response.data.results || []).map((item: any) => ({
      id: item.id || item.sku,
      name: item.name || item.title,
      brand: item.brand || 'SPAR',
      category: item.category || 'Groceries',
      price: Math.round(parseFloat(item.price || 0) * 100),
      originalPrice: item.originalPrice ? Math.round(parseFloat(item.originalPrice) * 100) : undefined,
      discount: item.discount || 0,
      imageUrl: item.image || item.imageUrl,
      url: item.url || `https://www.spar.co.za/p/${item.id}`,
      retailer: 'SPAR',
      inStock: item.inStock !== false,
      lastUpdated: new Date(),
    }));
  } catch (error) {
    console.error('[SPAR Live] Error fetching products:', error);
    return [];
  }
}

/**
 * Woolworths Live API
 * Endpoint: https://www.woolworths.co.za/api/v1/search
 */
export async function fetchWoolworthsLive(query: string): Promise<LiveProduct[]> {
  try {
    const response = await axios.get('https://www.woolworths.co.za/api/v1/search', {
      params: {
        q: query,
        limit: 50,
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      timeout: 10000,
    });

    return (response.data.results || []).map((item: any) => ({
      id: item.id || item.sku,
      name: item.name || item.title,
      brand: item.brand || 'Woolworths',
      category: item.category || 'Groceries',
      price: Math.round(parseFloat(item.price || 0) * 100),
      originalPrice: item.originalPrice ? Math.round(parseFloat(item.originalPrice) * 100) : undefined,
      discount: item.discount || 0,
      imageUrl: item.image || item.imageUrl,
      url: item.url || `https://www.woolworths.co.za/p/${item.id}`,
      retailer: 'Woolworths',
      inStock: item.inStock !== false,
      lastUpdated: new Date(),
    }));
  } catch (error) {
    console.error('[Woolworths Live] Error fetching products:', error);
    return [];
  }
}

/**
 * OK Foods Live API
 * Endpoint: https://www.okfoods.co.za/api/v1/search
 */
export async function fetchOKFoodsLive(query: string): Promise<LiveProduct[]> {
  try {
    const response = await axios.get('https://www.okfoods.co.za/api/v1/search', {
      params: {
        q: query,
        limit: 50,
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      timeout: 10000,
    });

    return (response.data.results || []).map((item: any) => ({
      id: item.id || item.sku,
      name: item.name || item.title,
      brand: item.brand || 'OK Foods',
      category: item.category || 'Groceries',
      price: Math.round(parseFloat(item.price || 0) * 100),
      originalPrice: item.originalPrice ? Math.round(parseFloat(item.originalPrice) * 100) : undefined,
      discount: item.discount || 0,
      imageUrl: item.image || item.imageUrl,
      url: item.url || `https://www.okfoods.co.za/p/${item.id}`,
      retailer: 'OK Foods',
      inStock: item.inStock !== false,
      lastUpdated: new Date(),
    }));
  } catch (error) {
    console.error('[OK Foods Live] Error fetching products:', error);
    return [];
  }
}

/**
 * Search across all retailers simultaneously
 */
export async function searchAllRetailers(query: string): Promise<LiveProduct[]> {
  console.log(`[Live Retailers] Searching for: ${query}`);

  const [checkers, picknpay, spar, woolworths, okfoods] = await Promise.all([
    fetchCheckersLive(query),
    fetchPicknPayLive(query),
    fetchSparLive(query),
    fetchWoolworthsLive(query),
    fetchOKFoodsLive(query),
  ]);

  const allProducts = [...checkers, ...picknpay, ...spar, ...woolworths, ...okfoods];

  console.log(`[Live Retailers] ✓ Found ${allProducts.length} products across all retailers`);

  return allProducts;
}

/**
 * Get best price for a product across all retailers
 */
export function getBestPriceFromResults(products: LiveProduct[]): LiveProduct | null {
  if (products.length === 0) return null;

  return products.reduce((best, current) => {
    return current.price < best.price ? current : best;
  });
}

/**
 * Group products by retailer
 */
export function groupByRetailer(products: LiveProduct[]): Record<string, LiveProduct[]> {
  return products.reduce(
    (acc, product) => {
      if (!acc[product.retailer]) {
        acc[product.retailer] = [];
      }
      acc[product.retailer].push(product);
      return acc;
    },
    {} as Record<string, LiveProduct[]>
  );
}

/**
 * Calculate price differences
 */
export function calculatePriceDifferences(products: LiveProduct[]): Array<LiveProduct & { priceDiff: number; percentDiff: number }> {
  const bestPrice = getBestPriceFromResults(products);
  if (!bestPrice) return [];

  return products.map((product) => ({
    ...product,
    priceDiff: product.price - bestPrice.price,
    percentDiff: ((product.price - bestPrice.price) / bestPrice.price) * 100,
  }));
}
