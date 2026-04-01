import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { getLatestPrices, getPriceHistory, getBestPrices, getPriceComparison } from "../price-scheduler";

export const pricesRouter = router({
  /**
   * Get latest prices for a specific product
   */
  getLatest: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      return await getLatestPrices(input.productId);
    }),

  /**
   * Get price history for a product
   */
  getHistory: publicProcedure
    .input(
      z.object({
        productId: z.number(),
        days: z.number().default(30),
      })
    )
    .query(async ({ input }) => {
      return await getPriceHistory(input.productId, input.days);
    }),

  /**
   * Get best prices across all stores for a product
   */
  getBest: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      return await getBestPrices(input.productId);
    }),

  /**
   * Get price comparison for multiple products
   */
  getComparison: publicProcedure
    .input(z.object({ productIds: z.array(z.number()) }))
    .query(async ({ input }) => {
      return await getPriceComparison(input.productIds);
    }),

  /**
   * Get all prices for a product across all stores
   */
  getAllStores: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      const prices = await getLatestPrices(input.productId);
      return prices.sort((a: any, b: any) => a.price - b.price);
    }),

  /**
   * Find cheapest store for a product
   */
  getCheapestStore: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      const prices = await getLatestPrices(input.productId);
      if (prices.length === 0) return null;
      return prices.reduce((min: any, p: any) => (p.price < min.price ? p : min));
    }),

  /**
   * Get price trends for a product
   */
  getTrends: publicProcedure
    .input(
      z.object({
        productId: z.number(),
        days: z.number().default(30),
      })
    )
    .query(async ({ input }) => {
      const history = await getPriceHistory(input.productId, input.days);
      if (history.length === 0) return null;

      const prices = history.map((h: any) => h.price);
      const average = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const trend = prices[prices.length - 1] < prices[0] ? "down" : "up";

      return {
        average,
        min,
        max,
        trend,
        priceChange: prices[prices.length - 1] - prices[0],
        percentChange: ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100,
      };
    }),
});
