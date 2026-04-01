import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Retailer API Integration Layer
 * Handles fetching real product data and prices from all 5 retailers
 */

export interface RetailerProduct {
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
  lastUpdated: Date;
}

const RETAILERS = {
  CHECKERS: 'Checkers',
  PICK_N_PAY: 'Pick n Pay',
  SPAR: 'SPAR',
  WOOLWORTHS: 'Woolworths',
  OK_FOODS: 'OK Foods',
};

/**
 * Checkers API Integration
 * Uses Checkers public API endpoints
 */
export async function fetchCheckersProducts(query: string): Promise<RetailerProduct[]> {
  try {
    const response = await axios.get('https://www.checkers.co.za/api/search', {
      params: { q: query, limit: 50 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    return response.data.results?.map((item: any) => ({
      id: item.id || item.sku,
      name: item.name || item.title,
      brand: item.brand || 'Checkers',
      category: item.category || 'Groceries',
      price: parseFloat(item.price) * 100, // Convert to cents
      originalPrice: item.originalPrice ? parseFloat(item.originalPrice) * 100 : undefined,
      discount: item.discount || 0,
      imageUrl: item.image || item.imageUrl,
      url: item.url || `https://www.checkers.co.za/p/${item.id}`,
      retailer: RETAILERS.CHECKERS,
      lastUpdated: new Date(),
    })) || [];
  } catch (error) {
    console.error('[Checkers] Error fetching products:', error);
    return [];
  }
}

/**
 * Pick n Pay API Integration
 */
export async function fetchPicknPayProducts(query: string): Promise<RetailerProduct[]> {
  try {
    const response = await axios.get('https://www.picknpay.co.za/api/search', {
      params: { q: query, limit: 50 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    return response.data.products?.map((item: any) => ({
      id: item.id || item.sku,
      name: item.name || item.title,
      brand: item.brand || 'Pick n Pay',
      category: item.category || 'Groceries',
      price: parseFloat(item.price) * 100,
      originalPrice: item.originalPrice ? parseFloat(item.originalPrice) * 100 : undefined,
      discount: item.discount || 0,
      imageUrl: item.image || item.imageUrl,
      url: item.url || `https://www.picknpay.co.za/p/${item.id}`,
      retailer: RETAILERS.PICK_N_PAY,
      lastUpdated: new Date(),
    })) || [];
  } catch (error) {
    console.error('[Pick n Pay] Error fetching products:', error);
    return [];
  }
}

/**
 * SPAR API Integration
 */
export async function fetchSparProducts(query: string): Promise<RetailerProduct[]> {
  try {
    const response = await axios.get('https://www.spar.co.za/api/search', {
      params: { q: query, limit: 50 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    return response.data.results?.map((item: any) => ({
      id: item.id || item.sku,
      name: item.name || item.title,
      brand: item.brand || 'SPAR',
      category: item.category || 'Groceries',
      price: parseFloat(item.price) * 100,
      originalPrice: item.originalPrice ? parseFloat(item.originalPrice) * 100 : undefined,
      discount: item.discount || 0,
      imageUrl: item.image || item.imageUrl,
      url: item.url || `https://www.spar.co.za/p/${item.id}`,
      retailer: RETAILERS.SPAR,
      lastUpdated: new Date(),
    })) || [];
  } catch (error) {
    console.error('[SPAR] Error fetching products:', error);
    return [];
  }
}

/**
 * Woolworths API Integration
 */
export async function fetchWoolworthsProducts(query: string): Promise<RetailerProduct[]> {
  try {
    const response = await axios.get('https://www.woolworths.co.za/api/search', {
      params: { q: query, limit: 50 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    return response.data.results?.map((item: any) => ({
      id: item.id || item.sku,
      name: item.name || item.title,
      brand: item.brand || 'Woolworths',
      category: item.category || 'Groceries',
      price: parseFloat(item.price) * 100,
      originalPrice: item.originalPrice ? parseFloat(item.originalPrice) * 100 : undefined,
      discount: item.discount || 0,
      imageUrl: item.image || item.imageUrl,
      url: item.url || `https://www.woolworths.co.za/p/${item.id}`,
      retailer: RETAILERS.WOOLWORTHS,
      lastUpdated: new Date(),
    })) || [];
  } catch (error) {
    console.error('[Woolworths] Error fetching products:', error);
    return [];
  }
}

/**
 * OK Foods API Integration
 */
export async function fetchOkFoodsProducts(query: string): Promise<RetailerProduct[]> {
  try {
    const response = await axios.get('https://www.okfoods.co.za/api/search', {
      params: { q: query, limit: 50 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    return response.data.results?.map((item: any) => ({
      id: item.id || item.sku,
      name: item.name || item.title,
      brand: item.brand || 'OK Foods',
      category: item.category || 'Groceries',
      price: parseFloat(item.price) * 100,
      originalPrice: item.originalPrice ? parseFloat(item.originalPrice) * 100 : undefined,
      discount: item.discount || 0,
      imageUrl: item.image || item.imageUrl,
      url: item.url || `https://www.okfoods.co.za/p/${item.id}`,
      retailer: RETAILERS.OK_FOODS,
      lastUpdated: new Date(),
    })) || [];
  } catch (error) {
    console.error('[OK Foods] Error fetching products:', error);
    return [];
  }
}

/**
 * Fetch products from all retailers
 */
export async function fetchAllRetailerProducts(query: string): Promise<RetailerProduct[]> {
  const results = await Promise.all([
    fetchCheckersProducts(query),
    fetchPicknPayProducts(query),
    fetchSparProducts(query),
    fetchWoolworthsProducts(query),
    fetchOkFoodsProducts(query),
  ]);

  return results.flat();
}

/**
 * Scrape product image from retailer website
 */
export async function scrapeProductImage(retailer: string, productName: string): Promise<string | null> {
  try {
    let url = '';
    let selector = '';

    switch (retailer) {
      case RETAILERS.CHECKERS:
        url = `https://www.checkers.co.za/search?q=${encodeURIComponent(productName)}`;
        selector = 'img.product-image';
        break;
      case RETAILERS.PICK_N_PAY:
        url = `https://www.picknpay.co.za/search?q=${encodeURIComponent(productName)}`;
        selector = 'img.product-img';
        break;
      case RETAILERS.SPAR:
        url = `https://www.spar.co.za/search?q=${encodeURIComponent(productName)}`;
        selector = 'img.product-image';
        break;
      case RETAILERS.WOOLWORTHS:
        url = `https://www.woolworths.co.za/search?q=${encodeURIComponent(productName)}`;
        selector = 'img.product-image';
        break;
      case RETAILERS.OK_FOODS:
        url = `https://www.okfoods.co.za/search?q=${encodeURIComponent(productName)}`;
        selector = 'img.product-image';
        break;
    }

    if (!url) return null;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const imageUrl = $(selector).first().attr('src') || $(selector).first().attr('data-src');

    return imageUrl || null;
  } catch (error) {
    console.error(`[${retailer}] Error scraping image for ${productName}:`, error);
    return null;
  }
}

/**
 * Get all available retailers
 */
export function getRetailers() {
  return Object.values(RETAILERS);
}
