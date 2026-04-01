import { router, protectedProcedure, publicProcedure } from '../_core/trpc';
import { z } from 'zod';

// In-memory wishlist storage (replace with database in production)
const sharedWishlists: Record<string, any> = {};

function generateShareCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const wishlistsRouter = router({
  /**
   * Create a shared wishlist
   */
  createSharedWishlist: protectedProcedure
    .input(z.object({
      name: z.string(),
      productIds: z.array(z.number()),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const shareCode = generateShareCode();
      const shareUrl = `${process.env.VITE_FRONTEND_URL || 'http://localhost:3000'}/wishlist/${shareCode}`;
      
      sharedWishlists[shareCode] = {
        id: shareCode,
        name: input.name,
        description: input.description,
        productIds: input.productIds,
        createdBy: ctx.user?.id,
        createdAt: new Date(),
        views: 0,
        shareUrl,
      };

      return {
        shareCode,
        shareUrl,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`,
      };
    }),

  /**
   * Get shared wishlist by code
   */
  getSharedWishlist: publicProcedure
    .input(z.object({
      shareCode: z.string(),
    }))
    .query(async ({ input }) => {
      const wishlist = sharedWishlists[input.shareCode];
      if (!wishlist) {
        throw new Error('Wishlist not found');
      }

      // Increment view count
      wishlist.views = (wishlist.views || 0) + 1;

      return wishlist;
    }),

  /**
   * Get user's shared wishlists
   */
  getUserWishlists: protectedProcedure.query(async ({ ctx }) => {
    return Object.values(sharedWishlists).filter(
      w => w.createdBy === ctx.user?.id
    );
  }),

  /**
   * Delete shared wishlist
   */
  deleteSharedWishlist: protectedProcedure
    .input(z.object({
      shareCode: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const wishlist = sharedWishlists[input.shareCode];
      if (!wishlist || wishlist.createdBy !== ctx.user?.id) {
        throw new Error('Unauthorized');
      }

      delete sharedWishlists[input.shareCode];
      return { success: true };
    }),

  /**
   * Update shared wishlist
   */
  updateSharedWishlist: protectedProcedure
    .input(z.object({
      shareCode: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      productIds: z.array(z.number()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const wishlist = sharedWishlists[input.shareCode];
      if (!wishlist || wishlist.createdBy !== ctx.user?.id) {
        throw new Error('Unauthorized');
      }

      if (input.name) wishlist.name = input.name;
      if (input.description) wishlist.description = input.description;
      if (input.productIds) wishlist.productIds = input.productIds;

      return wishlist;
    }),

  /**
   * Get wishlist statistics
   */
  getWishlistStats: protectedProcedure
    .input(z.object({
      shareCode: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const wishlist = sharedWishlists[input.shareCode];
      if (!wishlist || wishlist.createdBy !== ctx.user?.id) {
        throw new Error('Unauthorized');
      }

      return {
        views: wishlist.views || 0,
        productCount: wishlist.productIds?.length || 0,
        createdAt: wishlist.createdAt,
        shareUrl: wishlist.shareUrl,
      };
    }),
});
