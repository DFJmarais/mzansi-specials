import axios from 'axios';
import * as cheerio from 'cheerio';
import { storagePut } from './storage';

/**
 * Enhanced Product Image Scraper
 * Fetches real product images from retailer websites with improved selectors
 */

interface ScrapedImage {
  url: string;
  retailer: string;
  productName: string;
  storedUrl?: string;
  success: boolean;
  quality?: 'high' | 'medium' | 'low';
}

const RETAILER_SELECTORS = {
  Checkers: {
    images: [
      'img.product-image',
      'img[data-testid="product-image"]',
      'img.product-photo',
      'picture img',
      'img[alt*="product"]',
    ],
    container: '.product-item, .product-card, [data-product]',
    imageQuality: ['high', 'medium', 'low'],
  },
  'Pick n Pay': {
    images: [
      'img.product-image',
      'img[data-testid="product-image"]',
      'img.product-photo',
      'picture img',
      'img[alt*="product"]',
    ],
    container: '.product-item, .product-card, [data-product]',
    imageQuality: ['high', 'medium', 'low'],
  },
  SPAR: {
    images: [
      'img.product-image',
      'img[data-testid="product-image"]',
      'img.product-photo',
      'picture img',
      'img[alt*="product"]',
    ],
    container: '.product-item, .product-card, [data-product]',
    imageQuality: ['high', 'medium', 'low'],
  },
  Woolworths: {
    images: [
      'img.product-image',
      'img[data-testid="product-image"]',
      'img.product-photo',
      'picture img',
      'img[alt*="product"]',
    ],
    container: '.product-item, .product-card, [data-product]',
    imageQuality: ['high', 'medium', 'low'],
  },
  'OK Foods': {
    images: [
      'img.product-image',
      'img[data-testid="product-image"]',
      'img.product-photo',
      'picture img',
      'img[alt*="product"]',
    ],
    container: '.product-item, .product-card, [data-product]',
    imageQuality: ['high', 'medium', 'low'],
  },
};

/**
 * Validate image quality and size
 */
function validateImageQuality(imageUrl: string): 'high' | 'medium' | 'low' {
  // High quality: large images (likely product photos)
  if (imageUrl.includes('1000') || imageUrl.includes('800') || imageUrl.includes('600')) {
    return 'high';
  }
  // Medium quality: medium images
  if (imageUrl.includes('400') || imageUrl.includes('500')) {
    return 'medium';
  }
  // Low quality: small images
  return 'low';
}

/**
 * Scrape product image from retailer website
 */
export async function scrapeProductImageEnhanced(
  retailer: string,
  productName: string,
  searchUrl: string
): Promise<ScrapedImage> {
  try {
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const selectors = RETAILER_SELECTORS[retailer as keyof typeof RETAILER_SELECTORS];

    if (!selectors) {
      return {
        url: '',
        retailer,
        productName,
        success: false,
      };
    }

    let imageUrl = '';
    let quality: 'high' | 'medium' | 'low' = 'low';

    // Try each selector in order
    for (const selector of selectors.images) {
      const img = $(selector).first();
      
      // Try data-src (lazy loaded)
      imageUrl = img.attr('data-src') || '';
      
      // Try src attribute
      if (!imageUrl) {
        imageUrl = img.attr('src') || '';
      }
      
      // Try srcset (responsive images)
      if (!imageUrl) {
        const srcset = img.attr('srcset');
        if (srcset) {
          const urls = srcset.split(',').map((s) => s.trim().split(' ')[0]);
          imageUrl = urls[urls.length - 1]; // Get highest resolution
        }
      }

      if (imageUrl) {
        quality = validateImageQuality(imageUrl);
        break;
      }
    }

    // Try picture element
    if (!imageUrl) {
      const picture = $('picture img').first();
      imageUrl = picture.attr('data-src') || picture.attr('src') || '';
    }

    // Try background-image style
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

    // Normalize URL
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
      quality,
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
 * Download and store image in S3 with quality validation
 */
export async function downloadAndStoreImageEnhanced(
  imageUrl: string,
  retailer: string,
  productName: string,
  quality: 'high' | 'medium' | 'low' = 'medium'
): Promise<string | null> {
  try {
    // Skip low-quality images
    if (quality === 'low') {
      console.warn(`[Image Storage] Skipping low-quality image for ${productName}`);
      return null;
    }

    // Download image with timeout
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.google.com/',
      },
    });

    const imageBuffer = Buffer.from(response.data);

    // Validate image size (skip if too small)
    if (imageBuffer.length < 5000) {
      console.warn(`[Image Storage] Image too small for ${productName} (${imageBuffer.length} bytes)`);
      return null;
    }

    // Determine mime type
    let mimeType = 'image/jpeg';
    const contentType = response.headers['content-type'];
    if (contentType?.includes('png')) {
      mimeType = 'image/png';
    } else if (contentType?.includes('webp')) {
      mimeType = 'image/webp';
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

    console.log(`[Image Storage] ✓ Stored image for ${productName} at ${url}`);
    return url;
  } catch (error) {
    console.error(`[Image Storage] Error storing image for ${productName}:`, error);
    return null;
  }
}

/**
 * Batch scrape and store images with quality filtering
 */
export async function batchScrapeImagesEnhanced(
  products: Array<{
    name: string;
    retailer: string;
    searchUrl: string;
  }>
): Promise<Array<{ productName: string; retailer: string; imageUrl: string | null; quality: string }>> {
  console.log(`[Batch Scraper] Starting batch scrape for ${products.length} products`);

  const results = await Promise.all(
    products.map(async (product) => {
      try {
        // Scrape image URL
        const scraped = await scrapeProductImageEnhanced(product.retailer, product.name, product.searchUrl);

        if (!scraped.success || !scraped.url) {
          return {
            productName: product.name,
            retailer: product.retailer,
            imageUrl: null,
            quality: 'none',
          };
        }

        // Download and store in S3
        const storedUrl = await downloadAndStoreImageEnhanced(
          scraped.url,
          product.retailer,
          product.name,
          scraped.quality
        );

        return {
          productName: product.name,
          retailer: product.retailer,
          imageUrl: storedUrl,
          quality: scraped.quality || 'unknown',
        };
      } catch (error) {
        console.error(`[Batch Scraper] Error processing ${product.name}:`, error);
        return {
          productName: product.name,
          retailer: product.retailer,
          imageUrl: null,
          quality: 'error',
        };
      }
    })
  );

  const successful = results.filter((r) => r.imageUrl).length;
  console.log(`[Batch Scraper] ✓ Successfully scraped ${successful}/${products.length} images`);

  return results;
}

/**
 * Get fallback image URL for products without images
 */
export function getFallbackImageUrlEnhanced(category: string, retailer: string): string {
  const categoryMap: Record<string, string> = {
    'Groceries': '📦',
    'Dairy': '🥛',
    'Meat': '🥩',
    'Produce': '🥬',
    'Bakery': '🍞',
    'Pantry': '🏠',
    'Beverages': '🥤',
    'Snacks': '🍿',
    'Household': '🧹',
    'Health': '💊',
    'Beauty': '💄',
  };

  return categoryMap[category] || '📦';
}
