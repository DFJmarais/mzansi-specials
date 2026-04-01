import { publicProcedure, router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  getBestVerifiedPrice,
  getAllVerifiedPrices,
  updateVerifiedPricesForProduct,
} from "../verified-price-system";

export const verifiedPricesRouter = router({
  /**
   * Get the best (lowest) verified price for a product
   */
  getBestPrice: publicProcedure
    .input(z.object({ productName: z.string() }))
    .query(async ({ input }) => {
      return await getBestVerifiedPrice(input.productName);
    }),

  /**
   * Get all verified prices for a product across all retailers
   */
  getAllPrices: publicProcedure
    .input(z.object({ productName: z.string() }))
    .query(async ({ input }) => {
      return await getAllVerifiedPrices(input.productName);
    }),

  /**
   * Manually trigger price verification for a product (admin only)
   */
  updatePrices: protectedProcedure
    .input(z.object({ productName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.user?.role !== "admin") {
        throw new Error("Only admins can trigger price updates");
      }

      await updateVerifiedPricesForProduct(input.productName);

      return {
        success: true,
        message: `Price verification started for "${input.productName}"`,
      };
    }),
});
