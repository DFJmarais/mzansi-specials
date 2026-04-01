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
 * Scrapes Woolworths website for product prices
 */
export async function scrapeWoolworthsProducts(
  searchQuery: string,
  maxResults: number = 50
): Promise<ScrapedProduct[]> {
  try {
    const products: ScrapedProduct[] = [];
    
    const apiUrl = `https://www.woolworths.co.za/api/search/products`;
    
    const response = await axios.get(apiUrl, {
      params: {
        query: searchQuery,
        limit: maxResults,
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
          const price = Math.round(parseFloat(item.price) * 100);
          const originalPrice = item.wasPrice 
            ? Math.round(parseFloat(item.wasPrice) * 100)
            : undefined;
          const discount = originalPrice && originalPrice > price
            ? Math.round(((originalPrice - price) / originalPrice) * 100)
            : undefined;

          products.push({
            name: item.name,
            price,
            originalPrice,
            discount,
            url: item.url || `https://www.woolworths.co.za/p/${item.sku}`,
            imageUrl: item.imageUrl,
          });
        } catch (error) {
          console.error(`Error parsing Woolworths product: ${item.name}`, error);
        }
      }
    }

    return products;
  } catch (error) {
    console.error('[Woolworths Scraper] Error:', error);
    throw error;
  }
}

/**
 * Scrapes Woolworths specials
 */
export async function scrapeWoolworthsSpecials(): Promise<ScrapedProduct[]> {
  try {
    const response = await axios.get('https://www.woolworths.co.za/specials', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const products: ScrapedProduct[] = [];

    $('.product-card').each((_, element) => {
      try {
        const name = $(element).find('.product-name').text().trim();
        const priceText = $(element).find('.product-price').text().trim();
        const price = extractPrice(priceText);
        const url = $(element).find('a.product-link').attr('href') || '';
        const imageUrl = $(element).find('img.product-image').attr('src');

        if (name && price) {
          products.push({
            name,
            price,
            url: `https://www.woolworths.co.za${url}`,
            imageUrl,
          });
        }
      } catch (error) {
        console.error('[Woolworths Scraper] Error parsing product', error);
      }
    });

    return products;
  } catch (error) {
    console.error('[Woolworths Scraper] Error scraping specials:', error);
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
