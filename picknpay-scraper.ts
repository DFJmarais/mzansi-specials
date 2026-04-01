import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScrapedProduct {
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  url: string;
  imageUrl?: string;
}

/**
 * Scrapes Pick n Pay website for product prices
 */
export async function scrapePicknPayProducts(
  searchQuery: string,
  maxResults: number = 50
): Promise<ScrapedProduct[]> {
  try {
    const products: ScrapedProduct[] = [];
    
    const apiUrl = `https://www.pnp.co.za/api/search/products`;
    
    const response = await axios.get(apiUrl, {
      params: {
        q: searchQuery,
        limit: maxResults,
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      timeout: 10000,
    });

    if (response.data && response.data.products) {
      for (const item of response.data.products) {
        try {
          const price = Math.round(parseFloat(item.price) * 100);
          const originalPrice = item.regularPrice 
            ? Math.round(parseFloat(item.regularPrice) * 100)
            : undefined;
          const discount = originalPrice && originalPrice > price
            ? Math.round(((originalPrice - price) / originalPrice) * 100)
            : undefined;

          products.push({
            name: item.name,
            price,
            originalPrice,
            discount,
            url: item.url || `https://www.pnp.co.za/p/${item.sku}`,
            imageUrl: item.image,
          });
        } catch (error) {
          console.error(`Error parsing Pick n Pay product: ${item.name}`, error);
        }
      }
    }

    return products;
  } catch (error) {
    console.error('[Pick n Pay Scraper] Error:', error);
    throw error;
  }
}

/**
 * Scrapes Pick n Pay specials/promotions
 */
export async function scrapePicknPaySpecials(): Promise<ScrapedProduct[]> {
  try {
    const response = await axios.get('https://www.pnp.co.za/promotions', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const products: ScrapedProduct[] = [];

    $('.product-item').each((_, element) => {
      try {
        const name = $(element).find('.product-name').text().trim();
        const priceText = $(element).find('.product-price').text().trim();
        const price = extractPrice(priceText);
        const url = $(element).find('a').attr('href') || '';
        const imageUrl = $(element).find('img').attr('src');

        if (name && price) {
          products.push({
            name,
            price,
            url: `https://www.pnp.co.za${url}`,
            imageUrl,
          });
        }
      } catch (error) {
        console.error('[Pick n Pay Scraper] Error parsing product', error);
      }
    });

    return products;
  } catch (error) {
    console.error('[Pick n Pay Scraper] Error scraping specials:', error);
    return [];
  }
}

function extractPrice(text: string): number | null {
  const match = text.match(/R\s*(\d+(?:[.,]\d{2})?)/);
  if (match) {
    const price = parseFloat(match[1].replace(',', '.'));
    return Math.round(price * 100);
  }
  return null;
}
