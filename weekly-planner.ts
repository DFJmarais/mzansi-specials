import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  createWeeklyPlan,
  getUserWeeklyPlans,
  getWeeklyPlanDetails,
  addMealToWeeklyPlan,
  addMealIngredients,
  generateShoppingListFromPlan,
  updateShoppingItemStatus,
  getMealTemplatesByCategory,
  getMealTemplateCategories,
  calculateWeeklyPlanCost,
  deleteWeeklyPlan,
  updateWeeklyPlanBudget,
} from "../weekly-planner-helpers";

export const weeklyPlannerRouter = router({
  /**
   * Create a new weekly plan
   */
  createPlan: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        startDate: z.date(),
        endDate: z.date(),
        budget: z.number().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await createWeeklyPlan(
        ctx.user.id,
        input.name,
        input.startDate,
        input.endDate,
        input.budget,
        input.description
      );
    }),

  /**
   * Get all weekly plans for the current user
   */
  getUserPlans: protectedProcedure.query(async ({ ctx }) => {
    return await getUserWeeklyPlans(ctx.user.id);
  }),

  /**
   * Get detailed view of a weekly plan
   */
  getPlanDetails: protectedProcedure
    .input(z.object({ planId: z.number() }))
    .query(async ({ input, ctx }) => {
      return await getWeeklyPlanDetails(input.planId, ctx.user.id);
    }),

  /**
   * Add a meal to a weekly plan
   */
  addMeal: protectedProcedure
    .input(
      z.object({
        planId: z.number(),
        dayOfWeek: z.number().min(0).max(6),
        mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
        mealName: z.string().min(1),
        description: z.string().optional(),
        servings: z.number().default(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify user owns the plan
      const plan = await getWeeklyPlanDetails(input.planId, ctx.user.id);
      if (!plan) {
        throw new Error("Plan not found or unauthorized");
      }

      return await addMealToWeeklyPlan(
        input.planId,
        input.dayOfWeek,
        input.mealType,
        input.mealName,
        input.description,
        input.servings
      );
    }),

  /**
   * Add ingredients to a meal
   */
  addIngredients: protectedProcedure
    .input(
      z.object({
        mealId: z.number(),
        ingredients: z.array(
          z.object({
            ingredientName: z.string().min(1),
            quantity: z.number(),
            unit: z.string(),
            productId: z.number().optional(),
            estimatedPrice: z.number().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      return await addMealIngredients(input.mealId, input.ingredients);
    }),

  /**
   * Generate shopping list from a weekly plan
   */
  generateShoppingList: protectedProcedure
    .input(z.object({ planId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // Verify user owns the plan
      const plan = await getWeeklyPlanDetails(input.planId, ctx.user.id);
      if (!plan) {
        throw new Error("Plan not found or unauthorized");
      }

      return await generateShoppingListFromPlan(input.planId);
    }),

  /**
   * Update shopping item checked status
   */
  updateShoppingItemStatus: protectedProcedure
    .input(
      z.object({
        itemId: z.number(),
        isChecked: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      return await updateShoppingItemStatus(input.itemId, input.isChecked);
    }),

  /**
   * Get meal template categories
   */
  getMealTemplateCategories: protectedProcedure.query(async () => {
    return await getMealTemplateCategories();
  }),

  /**
   * Get meal templates by category
   */
  getMealTemplatesByCategory: protectedProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      return await getMealTemplatesByCategory(input.category);
    }),

  /**
   * Calculate total cost for a weekly plan
   */
  calculatePlanCost: protectedProcedure
    .input(z.object({ planId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // Verify user owns the plan
      const plan = await getWeeklyPlanDetails(input.planId, ctx.user.id);
      if (!plan) {
        throw new Error("Plan not found or unauthorized");
      }

      return await calculateWeeklyPlanCost(input.planId);
    }),

  /**
   * Update weekly plan budget
   */
  updateBudget: protectedProcedure
    .input(
      z.object({
        planId: z.number(),
        budget: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await updateWeeklyPlanBudget(input.planId, ctx.user.id, input.budget);
    }),

  /**
   * Delete a weekly plan
   */
  deletePlan: protectedProcedure
    .input(z.object({ planId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await deleteWeeklyPlan(input.planId, ctx.user.id);
    }),
});
