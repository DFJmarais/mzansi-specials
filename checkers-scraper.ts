import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScrapedProduct {
  name: string;
  price: number; // in cents
  originalPrice?: number;
  discount?: number;
  url: string;
  imageUrl?: string;
}

/**
 * Scrapes Checkers website for product prices
 * Uses Checkers search API and website scraping
 */
export async function scrapeCheckersProducts(
  searchQuery: string,
  maxResults: number = 50
): Promise<ScrapedProduct[]> {
  try {
    const products: ScrapedProduct[] = [];
    
    // Checkers API endpoint for product search
    const apiUrl = `https://www.checkers.co.za/api/search/products`;
    
    const response = await axios.get(apiUrl, {
      params: {
        q: searchQuery,
        limit: maxResults,
        offset: 0,
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      timeout: 10000,
    });

    if (response.data && response.data.results) {
      for (const item of response.data.results) {
        try {
          const price = Math.round(parseFloat(item.price) * 100); // Convert to cents
          const originalPrice = item.originalPrice 
            ? Math.round(parseFloat(item.originalPrice) * 100)
            : undefined;
          const discount = originalPrice && originalPrice > price
            ? Math.round(((originalPrice - price) / originalPrice) * 100)
            : undefined;

          products.push({
            name: item.name || item.title,
            price,
            originalPrice,
            discount,
            url: item.url || `https://www.checkers.co.za/p/${item.sku}`,
            imageUrl: item.image || item.imageUrl,
          });
        } catch (error) {
          console.error(`Error parsing Checkers product: ${item.name}`, error);
        }
      }
    }

    return products;
  } catch (error) {
    console.error('[Checkers Scraper] Error:', error);
    throw error;
  }
}

/**
 * Scrapes a specific product page on Checkers for detailed pricing
 */
export async function scrapeCheckersProductPage(productUrl: string): Promise<ScrapedProduct | null> {
  try {
    const response = await axios.get(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    
    // Extract product information from page
    const name = $('h1.product-title').text().trim() || 
                 $('[data-testid="product-name"]').text().trim();
    
    const priceText = $('[data-testid="product-price"]').text().trim() ||
                      $('.product-price').text().trim();
    
    const price = extractPrice(priceText);
    
    if (!name || !price) {
      return null;
    }

    const originalPriceText = $('[data-testid="original-price"]').text().trim() ||
                              $('.original-price').text().trim();
    const originalPrice = originalPriceText ? (extractPrice(originalPriceText) || undefined) : undefined;
    
    const discount = (originalPrice && originalPrice > price)
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined;

    const imageUrl = $('img[data-testid="product-image"]').attr('src') ||
                     $('.product-image img').attr('src');

    return {
      name,
      price,
      originalPrice,
      discount,
      url: productUrl,
      imageUrl,
    };
  } catch (error) {
    console.error(`[Checkers Scraper] Error scraping product page: ${productUrl}`, error);
    return null;
  }
}

/**
 * Helper function to extract price from text
 */
function extractPrice(text: string): number | null {
  const match = text.match(/R\s*(\d+(?:[.,]\d{2})?)/);
  if (match) {
    const price = parseFloat(match[1].replace(',', '.'));
    return Math.round(price * 100); // Convert to cents
  }
  return null;
}

/**
 * Scrapes Checkers specials/deals section
 */
export async function scrapeCheckersSpecials(): Promise<ScrapedProduct[]> {
  try {
    const response = await axios.get('https://www.checkers.co.za/specials', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const products: ScrapedProduct[] = [];

    $('[data-testid="product-card"]').each((_, element) => {
      try {
        const name = $(element).find('[data-testid="product-name"]').text().trim();
        const priceText = $(element).find('[data-testid="product-price"]').text().trim();
        const price = extractPrice(priceText);
        const url = $(element).find('a').attr('href') || '';
        const imageUrl = $(element).find('img').attr('src');

        if (name && price) {
          products.push({
            name,
            price,
            url: `https://www.checkers.co.za${url}`,
            imageUrl,
          });
        }
      } catch (error) {
        console.error('[Checkers Scraper] Error parsing product card', error);
      }
    });

    return products;
  } catch (error) {
    console.error('[Checkers Scraper] Error scraping specials:', error);
    return [];
  }
}
