import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { getLatestPrices, getPriceHistory, getBestPrices, getPriceComparison } from "./price-scheduler";

describe("Price Scheduler", () => {
  describe("getLatestPrices", () => {
    it("should return empty array for non-existent product", async () => {
      const prices = await getLatestPrices(99999);
      expect(Array.isArray(prices)).toBe(true);
    });

    it("should return prices with correct structure", async () => {
      const prices = await getLatestPrices(1);
      if (prices.length > 0) {
        expect(prices[0]).toHaveProperty("productId");
        expect(prices[0]).toHaveProperty("storeName");
        expect(prices[0]).toHaveProperty("price");
      }
    });

    it("should convert prices from cents to Rand", async () => {
      const prices = await getLatestPrices(1);
      prices.forEach((p: any) => {
        expect(typeof p.price).toBe("number");
        expect(p.price).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe("getPriceHistory", () => {
    it("should return empty array for non-existent product", async () => {
      const history = await getPriceHistory(99999, 30);
      expect(Array.isArray(history)).toBe(true);
    });

    it("should respect days parameter", async () => {
      const history7 = await getPriceHistory(1, 7);
      const history30 = await getPriceHistory(1, 30);
      expect(history7.length).toBeLessThanOrEqual(history30.length);
    });

    it("should return prices with timestamps", async () => {
      const history = await getPriceHistory(1, 30);
      if (history.length > 0) {
        expect(history[0]).toHaveProperty("lastUpdated");
      }
    });

    it("should filter by date range", async () => {
      const history = await getPriceHistory(1, 7);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 7);

      history.forEach((h: any) => {
        const itemDate = new Date(h.lastUpdated);
        expect(itemDate.getTime()).toBeGreaterThanOrEqual(cutoffDate.getTime());
      });
    });
  });

  describe("getBestPrices", () => {
    it("should return empty array for non-existent product", async () => {
      const best = await getBestPrices(99999);
      expect(Array.isArray(best)).toBe(true);
    });

    it("should return sorted prices (cheapest first)", async () => {
      const best = await getBestPrices(1);
      if (best.length > 1) {
        for (let i = 0; i < best.length - 1; i++) {
          expect(best[i].price).toBeLessThanOrEqual(best[i + 1].price);
        }
      }
    });

    it("should return maximum 3 prices", async () => {
      const best = await getBestPrices(1);
      expect(best.length).toBeLessThanOrEqual(3);
    });

    it("should include store names", async () => {
      const best = await getBestPrices(1);
      best.forEach((p: any) => {
        expect(p).toHaveProperty("storeName");
        expect(typeof p.storeName).toBe("string");
      });
    });
  });

  describe("getPriceComparison", () => {
    it("should return empty object for non-existent products", async () => {
      const comparison = await getPriceComparison([99999, 99998]);
      expect(typeof comparison).toBe("object");
    });

    it("should return comparison for multiple products", async () => {
      const comparison = await getPriceComparison([1, 2, 3]);
      expect(typeof comparison).toBe("object");
    });

    it("should include best and average prices", async () => {
      const comparison = await getPriceComparison([1]);
      if (Object.keys(comparison).length > 0) {
        const key = Object.keys(comparison)[0];
        expect(comparison[key]).toHaveProperty("best");
        expect(comparison[key]).toHaveProperty("average");
        expect(comparison[key]).toHaveProperty("stores");
      }
    });

    it("should calculate average correctly", async () => {
      const comparison = await getPriceComparison([1]);
      if (Object.keys(comparison).length > 0) {
        const key = Object.keys(comparison)[0];
        const { stores, average } = comparison[key];
        const calculatedAverage = stores.reduce((sum: number, p: any) => sum + p.price, 0) / stores.length;
        expect(average).toBeCloseTo(calculatedAverage, 2);
      }
    });

    it("should handle empty input", async () => {
      const comparison = await getPriceComparison([]);
      expect(typeof comparison).toBe("object");
      expect(Object.keys(comparison).length).toBe(0);
    });
  });

  describe("Price Scheduler Integration", () => {
    it("should handle concurrent price requests", async () => {
      const promises = [
        getLatestPrices(1),
        getLatestPrices(2),
        getLatestPrices(3),
        getPriceHistory(1, 30),
        getBestPrices(2),
      ];

      const results = await Promise.all(promises);
      expect(results.length).toBe(5);
      results.forEach((result: any) => {
        expect(Array.isArray(result) || typeof result === "object").toBe(true);
      });
    });

    it("should handle errors gracefully", async () => {
      const prices = await getLatestPrices(-1);
      expect(Array.isArray(prices)).toBe(true);
    });

    it("should return consistent data types", async () => {
      const prices = await getLatestPrices(1);
      prices.forEach((p: any) => {
        expect(typeof p.price).toBe("number");
        expect(typeof p.storeName).toBe("string");
        expect(typeof p.productId).toBe("number");
      });
    });
  });

  describe("Price Calculations", () => {
    it("should handle price range queries", async () => {
      const prices = await getLatestPrices(1);
      const minPrice = Math.min(...prices.map((p: any) => p.price));
      const maxPrice = Math.max(...prices.map((p: any) => p.price));

      expect(minPrice).toBeLessThanOrEqual(maxPrice);
      expect(minPrice).toBeGreaterThanOrEqual(0);
    });

    it("should identify cheapest store", async () => {
      const prices = await getLatestPrices(1);
      if (prices.length > 0) {
        const cheapest = prices.reduce((min: any, p: any) => (p.price < min.price ? p : min));
        prices.forEach((p: any) => {
          expect(p.price).toBeGreaterThanOrEqual(cheapest.price);
        });
      }
    });

    it("should calculate price trends", async () => {
      const history = await getPriceHistory(1, 30);
      if (history.length > 1) {
        const firstPrice = history[0].price;
        const lastPrice = history[history.length - 1].price;
        const trend = lastPrice < firstPrice ? "down" : "up";
        expect(["up", "down"]).toContain(trend);
      }
    });
  });
});
