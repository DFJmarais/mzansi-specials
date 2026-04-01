import axios from 'axios';
import * as cheerio from 'cheerio';
import { storagePut } from './storage';

/**
 * Product Image Scraper
 * Fetches real product images from retailer websites and stores them in S3
 */

interface ScrapedImage {
  url: string;
  retailer: string;
  productName: string;
  storedUrl?: string;
  success: boolean;
}

const SELECTORS = {
  Checkers: {
    image: 'img.product-image, img[alt*="product"], img.product-photo',
    container: '.product-item, .product-card, [data-product]',
  },
  'Pick n Pay': {
    image: 'img.product-image, img[alt*="product"], img.product-photo',
    container: '.product-item, .product-card, [data-product]',
  },
  SPAR: {
    image: 'img.product-image, img[alt*="product"], img.product-photo',
    container: '.product-item, .product-card, [data-product]',
  },
  Woolworths: {
    image: 'img.product-image, img[alt*="product"], img.product-photo',
    container: '.product-item, .product-card, [data-product]',
  },
  'OK Foods': {
    image: 'img.product-image, img[alt*="product"], img.product-photo',
    container: '.product-item, .product-card, [data-product]',
  },
};

/**
 * Scrape product image from retailer website
 */
export async function scrapeProductImage(
  retailer: string,
  productName: string,
  searchUrl: string
): Promise<ScrapedImage> {
  try {
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': searchUrl,
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const selectors = SELECTORS[retailer as keyof typeof SELECTORS];

    if (!selectors) {
      return {
        url: '',
        retailer,
        productName,
        success: false,
      };
    }

    // Try to find image
    let imageUrl = '';

    // First try: data-src (lazy loaded images)
    imageUrl = $(selectors.image).first().attr('data-src') || '';

    // Second try: src attribute
    if (!imageUrl) {
      imageUrl = $(selectors.image).first().attr('src') || '';
    }

    // Third try: look for picture element
    if (!imageUrl) {
      imageUrl = $('picture img').first().attr('src') || '';
    }

    // Fourth try: background-image style
    if (!imageUrl) {
      const bgImage = $(selectors.container).first().css('background-image');
      if (bgImage) {
        const match = bgImage.match(/url\(['"]?([^'")]+)['"]?\)/);
        if (match) {
          imageUrl = match[1];
        }
      }
    }

    if (!imageUrl) {
      return {
        url: '',
        retailer,
        productName,
        success: false,
      };
    }

    // Normalize URL (handle relative URLs)
    if (imageUrl.startsWith('/')) {
      const baseUrl = new URL(searchUrl);
      imageUrl = `${baseUrl.protocol}//${baseUrl.host}${imageUrl}`;
    } else if (!imageUrl.startsWith('http')) {
      const baseUrl = new URL(searchUrl);
      imageUrl = `${baseUrl.protocol}//${baseUrl.host}/${imageUrl}`;
    }

    return {
      url: imageUrl,
      retailer,
      productName,
      success: true,
    };
  } catch (error) {
    console.error(`[Image Scraper] Error scraping ${retailer} for ${productName}:`, error);
    return {
      url: '',
      retailer,
      productName,
      success: false,
    };
  }
}

/**
 * Download and store image in S3
 */
export async function downloadAndStoreImage(
  imageUrl: string,
  retailer: string,
  productName: string
): Promise<string | null> {
  try {
    // Download image
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const imageBuffer = Buffer.from(response.data);

    // Determine mime type
    let mimeType = 'image/jpeg';
    if (imageUrl.includes('.png')) {
      mimeType = 'image/png';
    } else if (imageUrl.includes('.webp')) {
      mimeType = 'image/webp';
    } else if (imageUrl.includes('.gif')) {
      mimeType = 'image/gif';
    }

    // Generate unique filename
    const sanitizedName = productName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);

    const timestamp = Date.now();
    const filename = `products/${retailer.toLowerCase().replace(/\s+/g, '-')}/${sanitizedName}-${timestamp}.jpg`;

    // Store in S3
    const { url } = await storagePut(filename, imageBuffer, mimeType);

    return url;
  } catch (error) {
    console.error(`[Image Storage] Error storing image for ${productName}:`, error);
    return null;
  }
}

/**
 * Batch scrape and store images for multiple products
 */
export async function batchScrapeImages(
  products: Array<{
    name: string;
    retailer: string;
    searchUrl: string;
  }>
): Promise<Array<{ productName: string; retailer: string; imageUrl: string | null }>> {
  const results = await Promise.all(
    products.map(async (product) => {
      try {
        // Scrape image URL
        const scraped = await scrapeProductImage(product.retailer, product.name, product.searchUrl);

        if (!scraped.success || !scraped.url) {
          return {
            productName: product.name,
            retailer: product.retailer,
            imageUrl: null,
          };
        }

        // Download and store in S3
        const storedUrl = await downloadAndStoreImage(scraped.url, product.retailer, product.name);

        return {
          productName: product.name,
          retailer: product.retailer,
          imageUrl: storedUrl,
        };
      } catch (error) {
        console.error(`[Batch Scraper] Error processing ${product.name}:`, error);
        return {
          productName: product.name,
          retailer: product.retailer,
          imageUrl: null,
        };
      }
    })
  );

  return results;
}

/**
 * Get fallback image URL for products without images
 */
export function getFallbackImageUrl(category: string): string {
  const fallbacks: Record<string, string> = {
    Groceries: 'https://via.placeholder.com/300x300?text=Groceries',
    Dairy: 'https://via.placeholder.com/300x300?text=Dairy',
    Meat: 'https://via.placeholder.com/300x300?text=Meat',
    Produce: 'https://via.placeholder.com/300x300?text=Produce',
    Bakery: 'https://via.placeholder.com/300x300?text=Bakery',
    Pantry: 'https://via.placeholder.com/300x300?text=Pantry',
    Beverages: 'https://via.placeholder.com/300x300?text=Beverages',
    Snacks: 'https://via.placeholder.com/300x300?text=Snacks',
    Household: 'https://via.placeholder.com/300x300?text=Household',
  };

  return fallbacks[category] || fallbacks.Groceries;
}
