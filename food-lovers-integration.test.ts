/**
 * Tests for Food Lovers Market Integration
 * Tests loyalty program, store locator, and catalog
 */

import { describe, it, expect } from 'vitest';
import {
  calculateLoyaltyDiscount,
  getTierBenefits,
  calculateBestShoppingStrategy,
  getLoyaltyProgramSummary,
  estimateAnnualSavings,
  getRecommendedTier,
} from './fresh-society-integration';
import {
  findNearestStores,
  getStoreById,
  getStoresByCity,
  getStoresByProvince,
  getAllProvinces,
  getStoreHours,
  isStoreOpenNow,
  getGoogleMapsUrl,
  FOOD_LOVERS_STORES,
} from './food-lovers-store-locator';
import { foodLoversExpandedCatalog, FOOD_LOVERS_CATEGORIES } from './food-lovers-expanded-catalog';

describe('Fresh Society Loyalty Program', () => {
  it('should calculate Bronze tier discount correctly', () => {
    const result = calculateLoyaltyDiscount(1000, 'Bronze');
    expect(result.freshSocietyCashback).toBe(10); // 1% of 1000
    expect(result.pointsEarned).toBe(1000); // 1 point per R1
  });

  it('should calculate Silver tier discount correctly', () => {
    const result = calculateLoyaltyDiscount(1000, 'Silver');
    expect(result.freshSocietyCashback).toBe(20); // 2% of 1000
    expect(result.pointsEarned).toBe(1500); // 1.5x multiplier
  });

  it('should calculate Gold tier discount correctly', () => {
    const result = calculateLoyaltyDiscount(1000, 'Gold');
    expect(result.freshSocietyCashback).toBe(30); // 3% of 1000
    expect(result.pointsEarned).toBe(2000); // 2x multiplier
  });

  it('should calculate Platinum tier discount correctly', () => {
    const result = calculateLoyaltyDiscount(1000, 'Platinum');
    expect(result.freshSocietyCashback).toBe(50); // 5% of 1000
    expect(result.pointsEarned).toBe(3000); // 3x multiplier
  });

  it('should include ABSA rewards when linked', () => {
    const result = calculateLoyaltyDiscount(1000, 'Gold', 'premium');
    expect(result.absaRewardsCashback).toBe(300); // 30% ABSA premium (0.30 * 1000)
    expect(result.totalCashback).toBe(330); // 3% + 30% ABSA
  });

  it('should get tier benefits correctly', () => {
    const benefits = getTierBenefits('Platinum');
    expect(benefits.tier).toBe('Platinum');
    expect(benefits.cashbackPercentage).toBe(5);
    expect(benefits.pointsMultiplier).toBe(3);
  });

  it('should estimate annual savings correctly', () => {
    const savings = estimateAnnualSavings(1000, 'Gold');
    expect(savings.totalAnnualSavings).toBe(360); // 3% of 1000 * 12
    expect(savings.pointsPerYear).toBe(24000); // 2000 * 12
  });

  it('should recommend tier based on annual spend', () => {
    const bronze = getRecommendedTier(6000); // R500/month
    expect(bronze.recommendedTier).toBe('Bronze');

    const silver = getRecommendedTier(24000); // R2000/month
    expect(silver.recommendedTier).toBe('Silver');

    const gold = getRecommendedTier(48000); // R4000/month
    expect(gold.recommendedTier).toBe('Gold');

    const platinum = getRecommendedTier(72000); // R6000/month
    expect(platinum.recommendedTier).toBe('Platinum');
  });

  it('should get loyalty program summary', () => {
    const summary = getLoyaltyProgramSummary('Gold', true);
    expect(summary.tier).toBe('Gold');
    expect(summary.freshSociety.cashback).toBe('3%');
    expect(summary.absa.available).toBe(true);
  });
});

describe('Food Lovers Market Store Locator', () => {
  it('should have stores in database', () => {
    expect(FOOD_LOVERS_STORES.length).toBeGreaterThan(0);
  });

  it('should get store by ID', () => {
    const store = getStoreById('flm-store-001');
    expect(store).toBeDefined();
    expect(store?.name).toContain('Food Lovers Market');
  });

  it('should return undefined for invalid store ID', () => {
    const store = getStoreById('invalid-id');
    expect(store).toBeUndefined();
  });

  it('should get stores by city', () => {
    const stores = getStoresByCity('Johannesburg');
    expect(stores.length).toBeGreaterThan(0);
    expect(stores[0].city).toBe('Johannesburg');
  });

  it('should get stores by province', () => {
    const stores = getStoresByProvince('Gauteng');
    expect(stores.length).toBeGreaterThan(0);
    expect(stores[0].province).toBe('Gauteng');
  });

  it('should get all provinces', () => {
    const provinces = getAllProvinces();
    expect(provinces.length).toBeGreaterThan(0);
    expect(provinces).toContain('Gauteng');
    expect(provinces).toContain('Western Cape');
  });

  it('should get store hours', () => {
    const hours = getStoreHours('flm-store-001', 'monday');
    expect(hours).toBeDefined();
    expect(hours).toMatch(/\d{2}:\d{2} - \d{2}:\d{2}/);
  });

  it('should return null for invalid store hours', () => {
    const hours = getStoreHours('invalid-id', 'monday');
    expect(hours).toBeNull();
  });

  it('should get Google Maps URL', () => {
    const url = getGoogleMapsUrl('flm-store-001');
    expect(url).toBeDefined();
    expect(url).toContain('maps.google.com');
    expect(url).toContain('-26.2023'); // Johannesburg latitude
  });

  it('should return null for invalid store Google Maps URL', () => {
    const url = getGoogleMapsUrl('invalid-id');
    expect(url).toBeNull();
  });

  it('should find nearest stores', () => {
    // Johannesburg coordinates
    const stores = findNearestStores(-26.2023, 28.0436, 50);
    expect(stores.length).toBeGreaterThan(0);
    expect(stores[0].distance).toBeLessThanOrEqual(stores[stores.length - 1].distance || 0);
  });

  it('should respect max distance filter', () => {
    // Johannesburg coordinates
    const stores = findNearestStores(-26.2023, 28.0436, 10);
    // All stores should be within 10km
    stores.forEach(store => {
      expect(store.distance).toBeLessThanOrEqual(10);
    });
  });
});

describe('Food Lovers Market Expanded Catalog', () => {
  it('should have products in catalog', () => {
    expect(foodLoversExpandedCatalog.length).toBeGreaterThan(0);
  });

  it('should have at least 130 products', () => {
    expect(foodLoversExpandedCatalog.length).toBeGreaterThanOrEqual(130);
  });

  it('should have valid product structure', () => {
    const product = foodLoversExpandedCatalog[0];
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('category');
    expect(product).toHaveProperty('subcategory');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('inStock');
  });

  it('should have valid categories', () => {
    expect(FOOD_LOVERS_CATEGORIES.length).toBeGreaterThan(0);
    expect(FOOD_LOVERS_CATEGORIES).toContain('Dairy');
    expect(FOOD_LOVERS_CATEGORIES).toContain('Meat');
    expect(FOOD_LOVERS_CATEGORIES).toContain('Produce');
    expect(FOOD_LOVERS_CATEGORIES).toContain('Bakery');
    expect(FOOD_LOVERS_CATEGORIES).toContain('Pantry');
  });

  it('should have products in all major categories', () => {
    const categories = new Set(foodLoversExpandedCatalog.map(p => p.category));
    expect(categories.size).toBeGreaterThan(5);
  });

  it('should have realistic prices', () => {
    foodLoversExpandedCatalog.forEach(product => {
      expect(product.price).toBeGreaterThan(0);
      expect(product.price).toBeLessThan(10000); // Reasonable max price
    });
  });

  it('should have unique product IDs', () => {
    const ids = foodLoversExpandedCatalog.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe('Integration Tests', () => {
  it('should calculate shopping strategy with loyalty', () => {
    const products = [
      {
        name: 'Milk 1L',
        prices: [
          { store: 'Food Lovers Market', price: 18.99 },
          { store: 'Spar', price: 19.99 },
        ],
      },
    ];

    const strategy = calculateBestShoppingStrategy(products, 'Gold');
    expect(strategy.store).toBe('Food Lovers Market');
    expect(strategy.loyaltyCashback).toBeGreaterThan(0);
    expect(strategy.finalPrice).toBeLessThan(strategy.totalPrice);
  });

  it('should provide store locator with loyalty benefits', () => {
    const store = getStoreById('flm-store-001');
    expect(store).toBeDefined();

    if (store) {
      const summary = getLoyaltyProgramSummary('Platinum', true);
      expect(summary.tier).toBe('Platinum');
      expect(store.specialOffers).toBeDefined();
    }
  });
});
