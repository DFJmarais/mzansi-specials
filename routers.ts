import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { dietRouter } from "./routers/diet";
import { weeklyPlannerRouter } from "./routers/weekly-planner";
import { pricesRouter } from "./routers/prices";
import { productsRouter } from "./routers/products";
import { searchRouter } from "./routers/search";
import { ordersRouter } from "./routers/orders";
import { storesRouter } from "./routers/stores";
import { wishlistsRouter } from "./routers/wishlists";
import { weeklyDealsRouter } from "./routers/weekly-deals";
import { trustRouter } from "./routers/trust";
import { verifiedPricesRouter } from "./routers/verified-prices";
import { specialsRouter } from "./routers/specials";


export const appRouter = router({
  system: systemRouter,
  diet: dietRouter,
  weeklyPlanner: weeklyPlannerRouter,
  prices: pricesRouter,
  products: productsRouter,
  search: router(searchRouter),
  orders: ordersRouter,
  stores: storesRouter,
  wishlists: wishlistsRouter,
  weeklyDeals: weeklyDealsRouter,
  trust: trustRouter,
  verifiedPrices: verifiedPricesRouter,
  specials: specialsRouter,

  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Shopping Lists
  shoppingLists: router({
    create: protectedProcedure
      .input(z.object({ name: z.string(), description: z.string().optional() }))
      .mutation(({ ctx, input }) => db.createShoppingList(ctx.user.id, input.name, input.description)),
    
    list: protectedProcedure
      .query(({ ctx }) => db.getUserShoppingLists(ctx.user.id)),
    
    addItem: protectedProcedure
      .input(z.object({ listId: z.number(), productName: z.string(), category: z.string().optional(), quantity: z.number().default(1) }))
      .mutation(({ input }) => db.addItemToList(input.listId, input.productName, input.category, input.quantity)),
  }),

  // Community Savings Posts
  community: router({
    createPost: protectedProcedure
      .input(z.object({
        title: z.string(),
        amountSaved: z.number(),
        store: z.string().optional(),
        productCategory: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(({ ctx, input }) => 
        db.createSavingsPost(
          ctx.user.id,
          input.title,
          input.amountSaved,
          input.store,
          input.productCategory,
          input.description
        )
      ),
    
    getPosts: publicProcedure
      .input(z.object({ limit: z.number().default(20) }).optional())
      .query(({ input }) => db.getSavingsPosts(input?.limit || 20)),
  }),

  // Product Reviews
  reviews: router({
    create: protectedProcedure
      .input(z.object({
        productName: z.string(),
        store: z.string(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }))
      .mutation(({ ctx, input }) => 
        db.createProductReview(
          ctx.user.id,
          input.productName,
          input.store,
          input.rating,
          input.comment
        )
      ),
    
    getByProduct: publicProcedure
      .input(z.object({ productName: z.string() }))
      .query(({ input }) => db.getProductReviews(input.productName)),
  }),

  // User Achievements
  achievements: router({
    list: protectedProcedure
      .query(({ ctx }) => db.getUserAchievements(ctx.user.id)),
  }),

  // Price Alerts router moved to separate file - removed duplicate
});

export type AppRouter = typeof appRouter;
