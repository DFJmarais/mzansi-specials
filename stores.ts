import { router, publicProcedure } from '../_core/trpc';
import { z } from 'zod';

// South African store locations (sample data)
const STORES = [
  { id: 1, name: 'Spar Sandton', lat: -26.1092, lng: 28.0550, address: '123 Sandton City, Johannesburg', hours: '08:00-22:00', phone: '011-XXX-XXXX' },
  { id: 2, name: 'Pick n Pay Rosebank', lat: -26.1389, lng: 28.0408, address: '456 Rosebank Mall, Johannesburg', hours: '07:00-23:00', phone: '011-XXX-XXXX' },
  { id: 3, name: 'Checkers Menlyn', lat: -25.7461, lng: 28.2622, address: '789 Menlyn Centre, Pretoria', hours: '08:00-21:00', phone: '012-XXX-XXXX' },
  { id: 4, name: 'Woolworths Cape Town', lat: -33.9249, lng: 18.4241, address: '321 V&A Waterfront, Cape Town', hours: '09:00-20:00', phone: '021-XXX-XXXX' },
  { id: 5, name: 'OK Foods Durban', lat: -29.8683, lng: 31.0204, address: '654 Gateway Theatre, Durban', hours: '08:00-22:00', phone: '031-XXX-XXXX' },
  { id: 6, name: 'Spar Midrand', lat: -25.9833, lng: 28.1167, address: '111 Midrand, Johannesburg', hours: '07:00-23:00', phone: '011-XXX-XXXX' },
  { id: 7, name: 'Pick n Pay Cresta', lat: -26.0333, lng: 28.0167, address: '222 Cresta, Johannesburg', hours: '08:00-22:00', phone: '011-XXX-XXXX' },
  { id: 8, name: 'Checkers Bryanston', lat: -26.0667, lng: 28.0333, address: '333 Bryanston, Johannesburg', hours: '08:00-21:00', phone: '011-XXX-XXXX' },
];

export const storesRouter = router({
  /**
   * Get all stores
   */
  getAllStores: publicProcedure.query(async () => {
    return STORES;
  }),

  /**
   * Get nearest stores to a location
   */
  getNearestStores: publicProcedure
    .input(z.object({
      lat: z.number(),
      lng: z.number(),
      radiusKm: z.number().default(5),
      limit: z.number().default(5),
    }))
    .query(async ({ input }) => {
      // Calculate distance using Haversine formula
      const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const R = 6371; // Earth's radius in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLng = ((lng2 - lng1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      const storesWithDistance = STORES
        .map(store => ({
          ...store,
          distance: calculateDistance(input.lat, input.lng, store.lat, store.lng),
        }))
        .filter(store => store.distance <= input.radiusKm)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, input.limit);

      return storesWithDistance;
    }),

  /**
   * Get store details
   */
  getStoreDetails: publicProcedure
    .input(z.object({
      storeId: z.number(),
    }))
    .query(async ({ input }) => {
      const store = STORES.find(s => s.id === input.storeId);
      if (!store) {
        throw new Error('Store not found');
      }
      return store;
    }),

  /**
   * Get stores by name (search)
   */
  searchStores: publicProcedure
    .input(z.object({
      query: z.string(),
    }))
    .query(async ({ input }) => {
      const query = input.query.toLowerCase();
      return STORES.filter(
        store =>
          store.name.toLowerCase().includes(query) ||
          store.address.toLowerCase().includes(query)
      );
    }),

  /**
   * Get stores by retailer name
   */
  getStoresByRetailer: publicProcedure
    .input(z.object({
      retailer: z.enum(['Spar', 'Pick n Pay', 'Checkers', 'Woolworths', 'OK Foods']),
    }))
    .query(async ({ input }) => {
      return STORES.filter(store => store.name.includes(input.retailer));
    }),
});
