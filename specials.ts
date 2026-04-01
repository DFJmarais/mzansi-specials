import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import * as retailers from "../retailers";
import * as imageScraper from "../image-scraper";

/**
 * Specials Router
 * Handles searching and filtering grocery specials from all retailers
 */

export const specialsRouter = router({
  /**
   * Search for products across all retailers
   */
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(100),
        retailer: z.enum(["Checkers", "Pick n Pay", "SPAR", "Woolworths", "OK Foods"]).optional(),
        limit: z.number().max(100).default(50),
      })
    )
    .query(async ({ input }) => {
      try {
        let results = await retailers.fetchAllRetailerProducts(input.query);

        // Filter by retailer if specified
        if (input.retailer) {
          results = results.filter((p) => p.retailer === input.retailer);
        }

        // Limit results
        results = results.slice(0, input.limit);

        // Fetch images for each product
        const productsWithImages = await Promise.all(
          results.map(async (product) => {
            const imageUrl = await retailers.scrapeProductImage(product.retailer, product.name);
            return {
              ...product,
              imageUrl: imageUrl || product.imageUrl,
            };
          })
        );

        return {
          success: true,
          count: productsWithImages.length,
          products: productsWithImages,
        };
      } catch (error) {
        console.error("Search error:", error);
        return {
          success: false,
          count: 0,
          products: [],
          error: "Failed to search products",
        };
      }
    }),

  /**
   * Get products by category
   */
  byCategory: publicProcedure
    .input(
      z.object({
        category: z.string(),
        retailer: z.enum(["Checkers", "Pick n Pay", "SPAR", "Woolworths", "OK Foods"]).optional(),
        limit: z.number().max(100).default(50),
      })
    )
    .query(async ({ input }) => {
      try {
        // Search for category keywords
        const results = await retailers.fetchAllRetailerProducts(input.category);

        let filtered = results.filter((p) => 
          p.category.toLowerCase().includes(input.category.toLowerCase())
        );

        if (input.retailer) {
          filtered = filtered.filter((p) => p.retailer === input.retailer);
        }

        filtered = filtered.slice(0, input.limit);

        return {
          success: true,
          count: filtered.length,
          products: filtered,
        };
      } catch (error) {
        console.error("Category search error:", error);
        return {
          success: false,
          count: 0,
          products: [],
          error: "Failed to fetch category products",
        };
      }
    }),

  /**
   * Get products by retailer
   */
  byRetailer: publicProcedure
    .input(
      z.object({
        retailer: z.enum(["Checkers", "Pick n Pay", "SPAR", "Woolworths", "OK Foods"]),
        query: z.string().default("specials"),
        limit: z.number().max(100).default(50),
      })
    )
    .query(async ({ input }) => {
      try {
        let results = [];

        // Fetch from specific retailer
        switch (input.retailer) {
          case "Checkers":
            results = await retailers.fetchCheckersProducts(input.query);
            break;
          case "Pick n Pay":
            results = await retailers.fetchPicknPayProducts(input.query);
            break;
          case "SPAR":
            results = await retailers.fetchSparProducts(input.query);
            break;
          case "Woolworths":
            results = await retailers.fetchWoolworthsProducts(input.query);
            break;
          case "OK Foods":
            results = await retailers.fetchOkFoodsProducts(input.query);
            break;
        }

        results = results.slice(0, input.limit);

        return {
          success: true,
          count: results.length,
          retailer: input.retailer,
          products: results,
        };
      } catch (error) {
        console.error("Retailer fetch error:", error);
        return {
          success: false,
          count: 0,
          products: [],
          error: `Failed to fetch ${input.retailer} products`,
        };
      }
    }),

  /**
   * Get hottest deals (highest discounts)
   */
  hottest: publicProcedure
    .input(
      z.object({
        limit: z.number().max(50).default(20),
        minDiscount: z.number().min(0).max(100).default(10),
      })
    )
    .query(async ({ input }) => {
      try {
        const results = await retailers.fetchAllRetailerProducts("specials");

        // Filter by minimum discount
        const filtered = results
          .filter((p) => (p.discount || 0) >= input.minDiscount)
          .sort((a, b) => (b.discount || 0) - (a.discount || 0))
          .slice(0, input.limit);

        return {
          success: true,
          count: filtered.length,
          products: filtered,
        };
      } catch (error) {
        console.error("Hottest deals error:", error);
        return {
          success: false,
          count: 0,
          products: [],
          error: "Failed to fetch hottest deals",
        };
      }
    }),

  /**
   * Compare prices across retailers for a product
   */
  compare: publicProcedure
    .input(
      z.object({
        productName: z.string().min(1).max(100),
      })
    )
    .query(async ({ input }) => {
      try {
        const results = await retailers.fetchAllRetailerProducts(input.productName);

        // Group by retailer
        const byRetailer = results.reduce(
          (acc, product) => {
            if (!acc[product.retailer]) {
              acc[product.retailer] = [];
            }
            acc[product.retailer].push(product);
            return acc;
          },
          {} as Record<string, typeof results>
        );

        // Find cheapest
        const cheapest = results.reduce((min, p) => (p.price < min.price ? p : min));

        return {
          success: true,
          productName: input.productName,
          cheapest,
          byRetailer,
          count: results.length,
        };
      } catch (error) {
        console.error("Price comparison error:", error);
        return {
          success: false,
          productName: input.productName,
          error: "Failed to compare prices",
        };
      }
    }),

  /**
   * Get all available retailers
   */
  retailers: publicProcedure.query(() => {
    return {
      retailers: retailers.getRetailers(),
    };
  }),
});
