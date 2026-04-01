import { publicProcedure } from '../_core/trpc';
import { z } from 'zod';
import { getDb } from '../db';
import { products, prices } from '../../drizzle/schema';
import { sql, eq, like, or, and } from 'drizzle-orm';

/**
 * Levenshtein distance for fuzzy matching
 * Calculates the minimum number of edits needed to transform one string to another
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[len2][len1];
}

/**
 * Calculate similarity score (0-1, where 1 is exact match)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return 1 - distance / maxLen;
}

/**
 * Category mapping for category-based search
 */
const categoryKeywords: Record<string, string[]> = {
  'Produce': ['fruit', 'vegetable', 'apple', 'banana', 'orange', 'tomato', 'lettuce', 'carrot', 'potato'],
  'Dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'dairy'],
  'Meat': ['beef', 'chicken', 'pork', 'lamb', 'steak', 'chop', 'meat'],
  'Bakery': ['bread', 'cake', 'pastry', 'bun', 'loaf', 'bagel', 'croissant'],
  'Beverages': ['juice', 'coffee', 'tea', 'soda', 'cola', 'water', 'drink'],
  'Pantry': ['rice', 'pasta', 'flour', 'sugar', 'oil', 'salt', 'spice'],
  'Household': ['toilet', 'paper', 'cleaning', 'soap', 'detergent', 'bleach'],
  'Personal Care': ['shampoo', 'toothpaste', 'deodorant', 'soap', 'lotion'],
  'Baby': ['baby', 'diaper', 'formula', 'wipe'],
  'Pet': ['pet', 'dog', 'cat', 'food'],
};

export const searchRouter = {
  /**
   * Advanced search with keyword, category, and fuzzy matching
   */
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1).max(100),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ input }) => {
      const { query, limit } = input;
      const searchTerm = query.toLowerCase().trim();

      try {
        const db = await getDb();
        if (!db) {
          return {
            results: [],
            total: 0,
            query: searchTerm,
            error: 'Database unavailable',
          };
        }
        
        // Get all products with their prices
        const allProducts = await (db as any).query.products.findMany({
            with: {
              prices: {
                orderBy: (prices: any, { asc }: any) => [asc(prices.price)],
                limit: 5,
              },
            },
        });

        // Score and filter products
        const scoredProducts = allProducts
          .map((product: any) => {
            let score = 0;
            const productName = product.name.toLowerCase();
            const productCategory = product.category.toLowerCase();
            const productDescription = (product.description || '').toLowerCase();

            // Exact name match (highest priority)
            if (productName === searchTerm) {
              score += 100;
            }
            // Name contains search term
            else if (productName.includes(searchTerm)) {
              score += 80;
            }
            // Fuzzy match on name
            else {
              const nameSimilarity = calculateSimilarity(productName, searchTerm);
              if (nameSimilarity > 0.7) {
                score += 60 * nameSimilarity;
              }
            }

            // Category exact match
            if (productCategory === searchTerm) {
              score += 50;
            }
            // Category contains search term
            else if (productCategory.includes(searchTerm)) {
              score += 30;
            }

            // Check category keywords
            for (const [category, keywords] of Object.entries(categoryKeywords)) {
              if (keywords.some(kw => kw === searchTerm || productName.includes(kw))) {
                if (productCategory === category) {
                  score += 40;
                }
              }
            }

            // Description match
            if (productDescription.includes(searchTerm)) {
              score += 20;
            }

            // Fuzzy match on description
            const descSimilarity = calculateSimilarity(productDescription, searchTerm);
            if (descSimilarity > 0.8) {
              score += 10 * descSimilarity;
            }

            return {
              ...product,
              score,
              bestPrice: product.prices[0]?.price || null,
              bestStore: product.prices[0]?.storeName || null,
            };
          })
          .filter((p: any) => p.score > 0)
          .sort((a: any, b: any) => b.score - a.score)
          .slice(0, limit);

        return {
          results: scoredProducts,
          total: scoredProducts.length,
          query: searchTerm,
        };
      } catch (error) {
        console.error('[Search Error]', error);
        return {
          results: [],
          total: 0,
          query: searchTerm,
          error: 'Search failed',
        };
      }
    }),

  /**
   * Get auto-suggestions while typing
   */
  suggestions: publicProcedure
    .input(z.object({
      query: z.string().min(1).max(50),
      limit: z.number().min(1).max(12).default(8),
    }))
    .query(async ({ input }) => {
      const { query, limit } = input;
      const searchTerm = query.toLowerCase().trim();

      try {
        const db = await getDb();
        if (!db) return [];
        
        const allProducts = await (db as any).query.products.findMany();

        // Score products for suggestions
        const suggestions = allProducts
          .map((product: any) => {
            const productName = product.name.toLowerCase();
            const similarity = calculateSimilarity(productName, searchTerm);
            const startsWithMatch = productName.startsWith(searchTerm) ? 1 : 0;
            const containsMatch = productName.includes(searchTerm) ? 0.5 : 0;

            const score = similarity * 0.7 + startsWithMatch * 0.2 + containsMatch * 0.1;

            return {
              id: product.id,
              name: product.name,
              category: product.category,
              score,
            };
          })
          .filter((s: any) => s.score > 0.3)
          .sort((a: any, b: any) => b.score - a.score)
          .slice(0, limit);

        return suggestions;
      } catch (error) {
        console.error('[Suggestions Error]', error);
        return [];
      }
    }),

  /**
   * Get products by category
   */
  byCategory: publicProcedure
    .input(z.object({
      category: z.string().min(1).max(50),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ input }) => {
      const { category, limit } = input;

      try {
        const db = await getDb();
        if (!db) return [];
        
        const categoryProducts = await (db as any).query.products.findMany({
          where: eq(products.category, category),
          with: {
            prices: {
              orderBy: (prices: any, { asc }: any) => [asc(prices.price)],
              limit: 5,
            },
          },
          limit,
        });

        return categoryProducts;
      } catch (error) {
        console.error('[Category Search Error]', error);
        return [];
      }
    }),

  /**
   * Get trending/popular products
   */
  trending: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10),
    }))
    .query(async ({ input }) => {
      const { limit } = input;

      try {
        const db = await getDb();
        if (!db) return [];
        
        // Get products with most prices (most tracked = most popular)
        const trendingProducts = await (db as any).query.products.findMany({
          with: {
            prices: {
              orderBy: (prices: any, { asc }: any) => [asc(prices.price)],
              limit: 5,
            },
          },
          limit,
        });

        return trendingProducts;
      } catch (error) {
        console.error('[Trending Error]', error);
        return [];
      }
    }),
};
