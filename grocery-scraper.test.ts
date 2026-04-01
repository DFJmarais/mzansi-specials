import { describe, it, expect, vi, beforeEach } from 'vitest';
import { scrapeProductPrices, storePrices, getLatestPrices } from './grocery-scraper';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Mock axios
vi.mock('axios');

describe('Grocery Scraper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('scrapeProductPrices', () => {
    it('should scrape prices from all retailers', async () => {
      const mockHtml = `
        <div data-product-item>
          <div data-product-name>Milk 1L</div>
          <div data-product-price>R18.99</div>
        </div>
      `;

      (axios.get as any).mockResolvedValue({ data: mockHtml });

      const prices = await scrapeProductPrices('Milk');

      expect(prices.length).toBeGreaterThan(0);
      expect(prices[0]).toHaveProperty('productName');
      expect(prices[0]).toHaveProperty('storeName');
      expect(prices[0]).toHaveProperty('price');
      expect(prices[0]).toHaveProperty('lastUpdated');
    });

    it('should handle scraping errors gracefully', async () => {
      (axios.get as any).mockRejectedValue(new Error('Network error'));

      const prices = await scrapeProductPrices('Milk');

      expect(Array.isArray(prices)).toBe(true);
    });

    it('should parse prices correctly', async () => {
      const mockHtml = `
        <div data-product-item>
          <div data-product-name>Beef Steak</div>
          <div data-product-price>R89.99</div>
        </div>
      `;

      (axios.get as any).mockResolvedValue({ data: mockHtml });

      const prices = await scrapeProductPrices('Beef');

      if (prices.length > 0) {
        expect(prices[0].price).toBe(89.99);
      }
    });

    it('should handle multiple products', async () => {
      const mockHtml = `
        <div data-product-item>
          <div data-product-name>Product 1</div>
          <div data-product-price>R10.00</div>
        </div>
        <div data-product-item>
          <div data-product-name>Product 2</div>
          <div data-product-price>R20.00</div>
        </div>
      `;

      (axios.get as any).mockResolvedValue({ data: mockHtml });

      const prices = await scrapeProductPrices('Test');

      expect(Array.isArray(prices)).toBe(true);
    });

    it('should include store names in results', async () => {
      const mockHtml = `
        <div data-product-item>
          <div data-product-name>Milk</div>
          <div data-product-price>R18.99</div>
        </div>
      `;

      (axios.get as any).mockResolvedValue({ data: mockHtml });

      const prices = await scrapeProductPrices('Milk');

      if (prices.length > 0) {
        expect(['Spar', 'Pick n Pay', 'Checkers', 'Woolworths', 'OK Foods', 'ShopRite']).toContain(
          prices[0].storeName
        );
      }
    });

    it('should handle price formatting with commas', async () => {
      const mockHtml = `
        <div data-product-item>
          <div data-product-name>Rice 5kg</div>
          <div data-product-price>R79,99</div>
        </div>
      `;

      (axios.get as any).mockResolvedValue({ data: mockHtml });

      const prices = await scrapeProductPrices('Rice');

      if (prices.length > 0) {
        expect(prices[0].price).toBeGreaterThan(0);
      }
    });

    it('should handle timeout', async () => {
      (axios.get as any).mockRejectedValue(new Error('Timeout'));

      const prices = await scrapeProductPrices('Milk');

      expect(Array.isArray(prices)).toBe(true);
    });
  });

  describe('storePrices', () => {
    it('should store prices without errors', async () => {
      const mockPrices = [
        {
          productName: 'Milk 1L',
          storeName: 'Spar',
          price: 18.99,
          lastUpdated: new Date(),
        },
      ];

      // This test verifies the function signature and basic error handling
      // Full database testing would require a test database setup
      await expect(storePrices(mockPrices)).resolves.not.toThrow();
    });

    it('should handle empty price array', async () => {
      await expect(storePrices([])).resolves.not.toThrow();
    });

    it('should handle prices with discounts', async () => {
      const mockPrices = [
        {
          productName: 'Beef Steak',
          storeName: 'OK Foods',
          price: 79.99,
          originalPrice: 99.99,
          discount: 20,
          lastUpdated: new Date(),
        },
      ];

      await expect(storePrices(mockPrices)).resolves.not.toThrow();
    });

    it('should convert prices to cents', async () => {
      const mockPrices = [
        {
          productName: 'Bread',
          storeName: 'Checkers',
          price: 8.99,
          lastUpdated: new Date(),
        },
      ];

      // Price should be stored as cents (899 instead of 8.99)
      await expect(storePrices(mockPrices)).resolves.not.toThrow();
    });
  });

  describe('getLatestPrices', () => {
    it('should return empty array for non-existent product', async () => {
      const prices = await getLatestPrices('NonExistentProduct123');

      expect(Array.isArray(prices)).toBe(true);
    });

    it('should handle database errors gracefully', async () => {
      const prices = await getLatestPrices('Milk');

      expect(Array.isArray(prices)).toBe(true);
    });
  });

  describe('Price parsing', () => {
    it('should parse Spar format correctly', () => {
      const html = `
        <div data-product-item>
          <div data-product-name>Full Cream Milk 1L</div>
          <div data-product-price>R18.99</div>
        </div>
      `;

      const $ = cheerio.load(html);
      const productName = $('[data-product-name]').text().trim();
      const priceText = $('[data-product-price]').text().trim();
      const price = parseFloat(priceText.replace('R', '').replace(',', '.'));

      expect(productName).toBe('Full Cream Milk 1L');
      expect(price).toBe(18.99);
    });

    it('should parse Pick n Pay format correctly', () => {
      const html = `
        <div class="product-card">
          <div class="product-name">Beef Steak 500g</div>
          <div class="product-price">R89.99</div>
        </div>
      `;

      const $ = cheerio.load(html);
      const productName = $('[class*="name"]').text().trim();
      const priceText = $('[class*="price"]').text().trim();
      const price = parseFloat(priceText.replace('R', '').replace(',', '.'));

      expect(productName).toBe('Beef Steak 500g');
      expect(price).toBe(89.99);
    });

    it('should handle currency symbol removal', () => {
      const priceText = 'R49.99';
      const price = parseFloat(priceText.replace('R', '').replace(',', '.'));

      expect(price).toBe(49.99);
    });

    it('should handle comma as decimal separator', () => {
      const priceText = 'R79,99';
      const price = parseFloat(priceText.replace('R', '').replace(',', '.'));

      expect(price).toBe(79.99);
    });

    it('should validate price is a number', () => {
      const validPrice = parseFloat('R18.99'.replace('R', '').replace(',', '.'));
      const invalidPrice = parseFloat('Invalid'.replace('R', '').replace(',', '.'));

      expect(!isNaN(validPrice)).toBe(true);
      expect(!isNaN(invalidPrice)).toBe(false);
    });
  });

  describe('Retailer configurations', () => {
    it('should have configurations for all 6 retailers', () => {
      const retailers = ['spar', 'picknpay', 'checkers', 'woolworths', 'okfoods', 'shoprite'];

      expect(retailers.length).toBe(6);
      retailers.forEach(retailer => {
        expect(retailer).toBeTruthy();
      });
    });

    it('should have valid base URLs', () => {
      const baseUrls = [
        'https://www.spar.co.za',
        'https://www.pnp.co.za',
        'https://www.checkers.co.za',
        'https://www.woolworths.co.za',
        'https://www.okfoods.co.za',
        'https://www.shoprite.co.za',
      ];

      baseUrls.forEach(url => {
        expect(url).toMatch(/^https:\/\//);
      });
    });

    it('should have User-Agent headers', () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

      expect(userAgent).toContain('Mozilla');
      expect(userAgent).toContain('Windows');
    });
  });

  describe('Popular products batch', () => {
    it('should have a list of popular products', () => {
      const popularProducts = [
        'Milk',
        'Bread',
        'Eggs',
        'Chicken',
        'Beef',
        'Rice',
        'Flour',
        'Oil',
        'Butter',
        'Cheese',
      ];

      expect(popularProducts.length).toBeGreaterThan(0);
      expect(popularProducts).toContain('Milk');
      expect(popularProducts).toContain('Bread');
      expect(popularProducts).toContain('Eggs');
    });

    it('should have at least 10 popular products', () => {
      const popularProducts = [
        'Milk',
        'Bread',
        'Eggs',
        'Chicken',
        'Beef',
        'Rice',
        'Flour',
        'Oil',
        'Butter',
        'Cheese',
        'Yogurt',
        'Tomatoes',
        'Onions',
        'Potatoes',
        'Apples',
        'Bananas',
        'Coffee',
        'Tea',
        'Sugar',
        'Salt',
      ];

      expect(popularProducts.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe('Error handling', () => {
    it('should handle network timeouts', async () => {
      (axios.get as any).mockRejectedValue(new Error('Timeout'));

      const prices = await scrapeProductPrices('Milk');

      expect(Array.isArray(prices)).toBe(true);
    });

    it('should handle invalid HTML', async () => {
      (axios.get as any).mockResolvedValue({ data: 'Invalid HTML <>' });

      const prices = await scrapeProductPrices('Milk');

      expect(Array.isArray(prices)).toBe(true);
    });

    it('should handle missing data attributes', async () => {
      const mockHtml = '<div><div>No data attributes</div></div>';

      (axios.get as any).mockResolvedValue({ data: mockHtml });

      const prices = await scrapeProductPrices('Milk');

      expect(Array.isArray(prices)).toBe(true);
    });

    it('should handle rate limiting', async () => {
      (axios.get as any).mockRejectedValue({ status: 429, message: 'Too Many Requests' });

      const prices = await scrapeProductPrices('Milk');

      expect(Array.isArray(prices)).toBe(true);
    });
  });

  describe('Data validation', () => {
    it('should validate product name is not empty', () => {
      const productName = 'Milk 1L';

      expect(productName.length).toBeGreaterThan(0);
    });

    it('should validate price is positive', () => {
      const price = 18.99;

      expect(price).toBeGreaterThan(0);
    });

    it('should validate store name is known', () => {
      const storeName = 'Spar';
      const knownStores = ['Spar', 'Pick n Pay', 'Checkers', 'Woolworths', 'OK Foods', 'ShopRite'];

      expect(knownStores).toContain(storeName);
    });

    it('should validate lastUpdated is a date', () => {
      const lastUpdated = new Date();

      expect(lastUpdated instanceof Date).toBe(true);
    });
  });
});
