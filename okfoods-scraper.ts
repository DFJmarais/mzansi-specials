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
 * Scrapes OK Foods website for product prices
 */
export async function scrapeOKFoodsProducts(
  searchQuery: string,
  maxResults: number = 50
): Promise<ScrapedProduct[]> {
  try {
    const products: ScrapedProduct[] = [];
    
    const apiUrl = `https://www.okfoods.co.za/api/products/search`;
    
    const response = await axios.get(apiUrl, {
      params: {
        search: searchQuery,
        limit: maxResults,
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      timeout: 10000,
    });

    if (response.data && response.data.data) {
      for (const item of response.data.data) {
        try {
          const price = Math.round(parseFloat(item.price) * 100);
          const originalPrice = item.normalPrice 
            ? Math.round(parseFloat(item.normalPrice) * 100)
            : undefined;
          const discount = originalPrice && originalPrice > price
            ? Math.round(((originalPrice - price) / originalPrice) * 100)
            : undefined;

          products.push({
            name: item.title,
            price,
            originalPrice,
            discount,
            url: item.url || `https://www.okfoods.co.za/product/${item.id}`,
            imageUrl: item.imageUrl,
          });
        } catch (error) {
          console.error(`Error parsing OK Foods product: ${item.title}`, error);
        }
      }
    }

    return products;
  } catch (error) {
    console.error('[OK Foods Scraper] Error:', error);
    throw error;
  }
}

/**
 * Scrapes OK Foods specials/promotions
 */
export async function scrapeOKFoodsSpecials(): Promise<ScrapedProduct[]> {
  try {
    const response = await axios.get('https://www.okfoods.co.za/specials', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const products: ScrapedProduct[] = [];

    $('.product-listing').each((_, element) => {
      try {
        const name = $(element).find('.product-title').text().trim();
        const priceText = $(element).find('.price-tag').text().trim();
        const price = extractPrice(priceText);
        const url = $(element).find('a').attr('href') || '';
        const imageUrl = $(element).find('img').attr('src');

        if (name && price) {
          products.push({
            name,
            price,
            url: `https://www.okfoods.co.za${url}`,
            imageUrl,
          });
        }
      } catch (error) {
        console.error('[OK Foods Scraper] Error parsing product', error);
      }
    });

    return products;
  } catch (error) {
    console.error('[OK Foods Scraper] Error scraping specials:', error);
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
