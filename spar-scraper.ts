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
 * Scrapes SPAR website for product prices
 */
export async function sparScrapeProducts(
  searchQuery: string,
  maxResults: number = 50
): Promise<ScrapedProduct[]> {
  try {
    const products: ScrapedProduct[] = [];
    
    const apiUrl = `https://www.spar.co.za/api/search`;
    
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

    if (response.data && response.data.items) {
      for (const item of response.data.items) {
        try {
          const price = Math.round(parseFloat(item.price) * 100);
          const originalPrice = item.originalPrice 
            ? Math.round(parseFloat(item.originalPrice) * 100)
            : undefined;
          const discount = originalPrice && originalPrice > price
            ? Math.round(((originalPrice - price) / originalPrice) * 100)
            : undefined;

          products.push({
            name: item.name,
            price,
            originalPrice,
            discount,
            url: item.url || `https://www.spar.co.za/p/${item.id}`,
            imageUrl: item.image,
          });
        } catch (error) {
          console.error(`Error parsing SPAR product: ${item.name}`, error);
        }
      }
    }

    return products;
  } catch (error) {
    console.error('[SPAR Scraper] Error:', error);
    throw error;
  }
}

/**
 * Scrapes SPAR specials/deals
 */
export async function sparScrapeSpecials(): Promise<ScrapedProduct[]> {
  try {
    const response = await axios.get('https://www.spar.co.za/specials', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const products: ScrapedProduct[] = [];

    $('.product-tile').each((_, element) => {
      try {
        const name = $(element).find('.product-title').text().trim();
        const priceText = $(element).find('.price').text().trim();
        const price = extractPrice(priceText);
        const url = $(element).find('a').attr('href') || '';
        const imageUrl = $(element).find('img').attr('src');

        if (name && price) {
          products.push({
            name,
            price,
            url: `https://www.spar.co.za${url}`,
            imageUrl,
          });
        }
      } catch (error) {
        console.error('[SPAR Scraper] Error parsing product', error);
      }
    });

    return products;
  } catch (error) {
    console.error('[SPAR Scraper] Error scraping specials:', error);
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
