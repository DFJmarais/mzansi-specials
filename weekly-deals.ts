import { router, publicProcedure } from '../_core/trpc';
import { z } from 'zod';

// Sample weekly deals data
const WEEKLY_DEALS = [
  {
    id: 1,
    store: 'Spar',
    productName: 'Full Cream Milk 1L',
    originalPrice: 2299,
    dealPrice: 1899,
    discount: 17,
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    category: 'Dairy',
  },
  {
    id: 2,
    store: 'Pick n Pay',
    productName: 'Chicken Breast 1kg',
    originalPrice: 6499,
    dealPrice: 4999,
    discount: 23,
    startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    category: 'Meat',
  },
  {
    id: 3,
    store: 'Checkers',
    productName: 'Bread White Loaf',
    originalPrice: 849,
    dealPrice: 699,
    discount: 18,
    startDate: new Date(Date.now()),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    category: 'Bakery',
  },
  {
    id: 4,
    store: 'Woolworths',
    productName: 'Apples 1kg',
    originalPrice: 2499,
    dealPrice: 1799,
    discount: 28,
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    category: 'Produce',
  },
  {
    id: 5,
    store: 'OK Foods',
    productName: 'Rice 5kg',
    originalPrice: 7999,
    dealPrice: 6499,
    discount: 19,
    startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    category: 'Pantry',
  },
];

export const weeklyDealsRouter = router({
  /**
   * Get all active weekly deals
   */
  getActiveDeals: publicProcedure.query(async () => {
    const now = new Date();
    return WEEKLY_DEALS.filter(
      deal => deal.startDate <= now && deal.endDate >= now
    ).sort((a, b) => b.discount - a.discount);
  }),

  /**
   * Get deals by store
   */
  getDealsByStore: publicProcedure
    .input(z.object({
      store: z.enum(['Spar', 'Pick n Pay', 'Checkers', 'Woolworths', 'OK Foods']),
    }))
    .query(async ({ input }) => {
      const now = new Date();
      return WEEKLY_DEALS.filter(
        deal =>
          deal.store === input.store &&
          deal.startDate <= now &&
          deal.endDate >= now
      ).sort((a, b) => b.discount - a.discount);
    }),

  /**
   * Get deals by category
   */
  getDealsByCategory: publicProcedure
    .input(z.object({
      category: z.string(),
    }))
    .query(async ({ input }) => {
      const now = new Date();
      return WEEKLY_DEALS.filter(
        deal =>
          deal.category === input.category &&
          deal.startDate <= now &&
          deal.endDate >= now
      ).sort((a, b) => b.discount - a.discount);
    }),

  /**
   * Get deals calendar
   */
  getDealsCalendar: publicProcedure.query(async () => {
    const calendar: Record<string, any[]> = {};
    
    WEEKLY_DEALS.forEach(deal => {
      const date = deal.startDate.toISOString().split('T')[0];
      if (!calendar[date]) {
        calendar[date] = [];
      }
      calendar[date].push(deal);
    });

    return calendar;
  }),

  /**
   * Get upcoming deals
   */
  getUpcomingDeals: publicProcedure
    .input(z.object({
      days: z.number().default(7),
    }))
    .query(async ({ input }) => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + input.days * 24 * 60 * 60 * 1000);
      
      return WEEKLY_DEALS.filter(
        deal => deal.startDate > now && deal.startDate <= futureDate
      ).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    }),

  /**
   * Get best deals today
   */
  getBestDealsToday: publicProcedure.query(async () => {
    const now = new Date();
    return WEEKLY_DEALS.filter(
      deal => deal.startDate <= now && deal.endDate >= now
    )
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 5);
  }),

  /**
   * Get deal details
   */
  getDealDetails: publicProcedure
    .input(z.object({
      dealId: z.number(),
    }))
    .query(async ({ input }) => {
      const deal = WEEKLY_DEALS.find(d => d.id === input.dealId);
      if (!deal) {
        throw new Error('Deal not found');
      }
      return deal;
    }),
});
