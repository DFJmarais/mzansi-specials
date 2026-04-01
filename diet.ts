import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  getAllDietCategories,
  getDietCategoryBySlug,
  setUserDietPreferences,
  getUserDietPreferences,
  getProductsForUserDiet,
  searchProductsByDiet,
  getProductsMatchingMultipleDiets,
  getDietStatistics,
} from "../diet-helpers";

export const dietRouter = router({
  /**
   * Get all diet categories
   */
  getAllCategories: publicProcedure.query(async () => {
    return await getAllDietCategories();
  }),

  /**
   * Get diet category by slug
   */
  getCategoryBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return await getDietCategoryBySlug(input.slug);
    }),

  /**
   * Set user diet preferences
   */
  setPreferences: protectedProcedure
    .input(
      z.object({
        dietSlugs: z.array(z.string()),
        primarySlug: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await setUserDietPreferences(ctx.user.id, input.dietSlugs, input.primarySlug);
      return { success: true };
    }),

  /**
   * Get user diet preferences
   */
  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    return await getUserDietPreferences(ctx.user.id);
  }),

  /**
   * Get products for user's diet preferences
   */
  getRecommendedProducts: protectedProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ ctx, input }) => {
      return await getProductsForUserDiet(ctx.user.id, input.limit);
    }),

  /**
   * Search products by diet category
   */
  searchByDiet: publicProcedure
    .input(
      z.object({
        dietSlug: z.string(),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      return await searchProductsByDiet(input.dietSlug, input.limit);
    }),

  /**
   * Get products matching multiple diet categories
   */
  getProductsMatchingDiets: publicProcedure
    .input(
      z.object({
        dietSlugs: z.array(z.string()),
        matchAll: z.boolean().default(false),
      })
    )
    .query(async ({ input }) => {
      return await getProductsMatchingMultipleDiets(input.dietSlugs, input.matchAll);
    }),

  /**
   * Get diet statistics
   */
  getStatistics: publicProcedure.query(async () => {
    return await getDietStatistics();
  }),
});
