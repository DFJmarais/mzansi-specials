/**
 * Trust Score Management Router
 * Admin endpoints for monitoring and managing price verification
 */

import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  getVerificationStats,
  getFlaggedPrices,
  getLowConfidencePrices,
  getStalePrices,
  getPricesWithTrust,
  getBestTrustedPrice,
} from "../trust-db";

/**
 * Trust score router - admin only
 */
export const trustRouter = router({
  /**
   * Get overall verification statistics
   */
  stats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins can view trust statistics",
      });
    }

    const stats = await getVerificationStats();
    return stats;
  }),

  /**
   * Get flagged prices that need review
   */
  flaggedPrices: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can view flagged prices",
        });
      }

      return await getFlaggedPrices(input.limit);
    }),

  /**
   * Get low confidence prices
   */
  lowConfidencePrices: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can view low confidence prices",
        });
      }

      return await getLowConfidencePrices(input.limit);
    }),

  /**
   * Get stale prices (not updated in > 6 hours)
   */
  stalePrices: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can view stale prices",
        });
      }

      return await getStalePrices(input.limit);
    }),

  /**
   * Get all prices for a product with trust info
   */
  productPrices: protectedProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      return await getPricesWithTrust(input.productId);
    }),

  /**
   * Get best trusted price for a product
   */
  bestPrice: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }: any) => {
      return await getBestTrustedPrice(input.productId);
    }),
});

export type TrustRouter = typeof trustRouter;
