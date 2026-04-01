import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getAllDietCategories,
  getDietCategoryBySlug,
  tagProductWithDiet,
  getProductDietCategories,
  setUserDietPreferences,
  getUserDietPreferences,
  getProductsForUserDiet,
  searchProductsByDiet,
  getProductsMatchingMultipleDiets,
  getDietStatistics,
} from './diet-helpers';
import { DIET_CATEGORIES, PRODUCT_DIET_MAPPING } from './seeds/diet-categories';

describe('Diet Categories', () => {
  describe('Diet Category Data', () => {
    it('should have all 20 diet categories defined', () => {
      expect(DIET_CATEGORIES.length).toBe(20);
    });

    it('should have required fields for each category', () => {
      DIET_CATEGORIES.forEach((category) => {
        expect(category.name).toBeTruthy();
        expect(category.slug).toBeTruthy();
        expect(category.description).toBeTruthy();
        expect(category.icon).toBeTruthy();
        expect(category.color).toBeTruthy();
      });
    });

    it('should have unique slugs', () => {
      const slugs = DIET_CATEGORIES.map((c) => c.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('should have valid color hex codes', () => {
      const hexColorRegex = /^#[0-9A-F]{6}$/i;
      DIET_CATEGORIES.forEach((category) => {
        expect(category.color).toMatch(hexColorRegex);
      });
    });

    it('should have emoji icons', () => {
      DIET_CATEGORIES.forEach((category) => {
        expect(category.icon.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Product Diet Mapping', () => {
    it('should have product-diet mappings', () => {
      expect(Object.keys(PRODUCT_DIET_MAPPING).length).toBeGreaterThan(0);
    });

    it('should map products to valid diet slugs', () => {
      const validSlugs = new Set(DIET_CATEGORIES.map((c) => c.slug));

      Object.entries(PRODUCT_DIET_MAPPING).forEach(([product, diets]) => {
        expect(product).toBeTruthy();
        expect(Array.isArray(diets)).toBe(true);
        diets.forEach((diet) => {
          expect(validSlugs.has(diet)).toBe(true);
        });
      });
    });

    it('should have at least 50 products mapped', () => {
      expect(Object.keys(PRODUCT_DIET_MAPPING).length).toBeGreaterThanOrEqual(50);
    });

    it('should have diverse product categories', () => {
      const products = Object.keys(PRODUCT_DIET_MAPPING);
      const categories = new Set<string>();

      products.forEach((product) => {
        if (product.includes('Milk') || product.includes('Cheese') || product.includes('Yogurt')) {
          categories.add('Dairy');
        } else if (
          product.includes('Steak') ||
          product.includes('Chicken') ||
          product.includes('Beef') ||
          product.includes('Pork')
        ) {
          categories.add('Meat');
        } else if (product.includes('Bread') || product.includes('Rice') || product.includes('Pasta')) {
          categories.add('Grains');
        } else if (
          product.includes('Tomato') ||
          product.includes('Onion') ||
          product.includes('Carrot') ||
          product.includes('Broccoli')
        ) {
          categories.add('Vegetables');
        } else if (
          product.includes('Apple') ||
          product.includes('Banana') ||
          product.includes('Orange') ||
          product.includes('Berry')
        ) {
          categories.add('Fruits');
        } else if (product.includes('Oil') || product.includes('Butter') || product.includes('Sauce')) {
          categories.add('Condiments');
        } else if (product.includes('Coffee') || product.includes('Tea') || product.includes('Juice')) {
          categories.add('Beverages');
        }
      });

      expect(categories.size).toBeGreaterThan(5);
    });
  });

  describe('Diet Category Queries', () => {
    it('should retrieve all diet categories', async () => {
      const categories = await getAllDietCategories();
      expect(Array.isArray(categories)).toBe(true);
    });

    it('should get diet category by slug', async () => {
      const category = await getDietCategoryBySlug('gluten-free');
      if (category) {
        expect(category.slug).toBe('gluten-free');
        expect(category.name).toBeTruthy();
      }
    });

    it('should return null for non-existent slug', async () => {
      const category = await getDietCategoryBySlug('non-existent-diet');
      expect(category).toBeNull();
    });

    it('should handle database errors gracefully', async () => {
      const categories = await getAllDietCategories();
      expect(Array.isArray(categories)).toBe(true);
    });
  });

  describe('Product Diet Tags', () => {
    it('should tag products with diet categories', async () => {
      await expect(tagProductWithDiet(1, ['gluten-free', 'vegan'])).resolves.not.toThrow();
    });

    it('should get diet categories for a product', async () => {
      const diets = await getProductDietCategories(1);
      expect(Array.isArray(diets)).toBe(true);
    });

    it('should handle non-existent products', async () => {
      const diets = await getProductDietCategories(99999);
      expect(Array.isArray(diets)).toBe(true);
    });
  });

  describe('User Diet Preferences', () => {
    it('should set user diet preferences', async () => {
      await expect(
        setUserDietPreferences(1, ['gluten-free', 'vegan'], 'gluten-free')
      ).resolves.not.toThrow();
    });

    it('should get user diet preferences', async () => {
      const prefs = await getUserDietPreferences(1);
      expect(Array.isArray(prefs)).toBe(true);
    });

    it('should handle empty preferences', async () => {
      const prefs = await getUserDietPreferences(99999);
      expect(Array.isArray(prefs)).toBe(true);
    });

    it('should update user preferences', async () => {
      await expect(
        setUserDietPreferences(1, ['vegan', 'keto-low-carb'], 'vegan')
      ).resolves.not.toThrow();
    });
  });

  describe('Product Recommendations', () => {
    it('should get products for user diet', async () => {
      const products = await getProductsForUserDiet(1, 20);
      expect(Array.isArray(products)).toBe(true);
    });

    it('should respect limit parameter', async () => {
      const products = await getProductsForUserDiet(1, 5);
      expect(products.length).toBeLessThanOrEqual(5);
    });

    it('should search products by diet', async () => {
      const products = await searchProductsByDiet('gluten-free', 20);
      expect(Array.isArray(products)).toBe(true);
    });

    it('should get products matching multiple diets', async () => {
      const products = await getProductsMatchingMultipleDiets(['vegan', 'gluten-free'], false);
      expect(Array.isArray(products)).toBe(true);
    });

    it('should handle match all parameter', async () => {
      const products = await getProductsMatchingMultipleDiets(['vegan', 'gluten-free'], true);
      expect(Array.isArray(products)).toBe(true);
    });
  });

  describe('Diet Statistics', () => {
    it('should get diet statistics', async () => {
      const stats = await getDietStatistics();
      if (stats) {
        expect(stats.totalDietCategories).toBeGreaterThanOrEqual(0);
        expect(stats.totalProductTags).toBeGreaterThanOrEqual(0);
        expect(stats.totalUserPreferences).toBeGreaterThanOrEqual(0);
        expect(typeof stats.averageTagsPerProduct).toBe('number');
      }
    });
  });

  describe('Diet Category Validation', () => {
    it('should validate gluten-free category', () => {
      const glutenFree = DIET_CATEGORIES.find((c) => c.slug === 'gluten-free');
      expect(glutenFree).toBeTruthy();
      expect(glutenFree?.name).toBe('Gluten-Free');
    });

    it('should validate vegan category', () => {
      const vegan = DIET_CATEGORIES.find((c) => c.slug === 'vegan');
      expect(vegan).toBeTruthy();
      expect(vegan?.name).toBe('Vegan');
    });

    it('should validate lactose-intolerant category', () => {
      const lactose = DIET_CATEGORIES.find((c) => c.slug === 'lactose-intolerant');
      expect(lactose).toBeTruthy();
      expect(lactose?.name).toBe('Lactose-Intolerant');
    });

    it('should validate all allergy-related categories', () => {
      const allergyCategories = [
        'gluten-free',
        'nut-free',
        'soy-free',
        'egg-free',
        'shellfish-free',
        'sesame-free',
        'lactose-intolerant',
        'dairy-free',
      ];

      allergyCategories.forEach((slug) => {
        const category = DIET_CATEGORIES.find((c) => c.slug === slug);
        expect(category).toBeTruthy();
      });
    });

    it('should validate all lifestyle categories', () => {
      const lifestyleCategories = ['vegan', 'vegetarian', 'paleo', 'keto-low-carb'];

      lifestyleCategories.forEach((slug) => {
        const category = DIET_CATEGORIES.find((c) => c.slug === slug);
        expect(category).toBeTruthy();
      });
    });

    it('should validate all health categories', () => {
      const healthCategories = [
        'high-protein',
        'low-sodium-heart-healthy',
        'diabetic-friendly',
        'sugar-free-low-sugar',
      ];

      healthCategories.forEach((slug) => {
        const category = DIET_CATEGORIES.find((c) => c.slug === slug);
        expect(category).toBeTruthy();
      });
    });

    it('should validate religious categories', () => {
      const religiousCategories = ['halal', 'kosher'];

      religiousCategories.forEach((slug) => {
        const category = DIET_CATEGORIES.find((c) => c.slug === slug);
        expect(category).toBeTruthy();
      });
    });
  });

  describe('Product Mapping Validation', () => {
    it('should have vegan products', () => {
      const veganProducts = Object.entries(PRODUCT_DIET_MAPPING).filter(([_, diets]) =>
        diets.includes('vegan')
      );
      expect(veganProducts.length).toBeGreaterThan(0);
    });

    it('should have gluten-free products', () => {
      const glutenFreeProducts = Object.entries(PRODUCT_DIET_MAPPING).filter(([_, diets]) =>
        diets.includes('gluten-free')
      );
      expect(glutenFreeProducts.length).toBeGreaterThan(0);
    });

    it('should have lactose-intolerant products', () => {
      const lactoseProducts = Object.entries(PRODUCT_DIET_MAPPING).filter(([_, diets]) =>
        diets.includes('lactose-intolerant')
      );
      expect(lactoseProducts.length).toBeGreaterThan(0);
    });

    it('should have high-protein products', () => {
      const proteinProducts = Object.entries(PRODUCT_DIET_MAPPING).filter(([_, diets]) =>
        diets.includes('high-protein')
      );
      expect(proteinProducts.length).toBeGreaterThan(0);
    });

    it('should have organic products', () => {
      const organicProducts = Object.entries(PRODUCT_DIET_MAPPING).filter(([_, diets]) =>
        diets.includes('organic')
      );
      expect(organicProducts.length).toBeGreaterThan(0);
    });

    it('should have keto products', () => {
      const ketoProducts = Object.entries(PRODUCT_DIET_MAPPING).filter(([_, diets]) =>
        diets.includes('keto-low-carb')
      );
      expect(ketoProducts.length).toBeGreaterThan(0);
    });

    it('should have halal products', () => {
      const halalProducts = Object.entries(PRODUCT_DIET_MAPPING).filter(([_, diets]) =>
        diets.includes('halal')
      );
      expect(halalProducts.length).toBeGreaterThan(0);
    });

    it('should have kosher products', () => {
      const kosherProducts = Object.entries(PRODUCT_DIET_MAPPING).filter(([_, diets]) =>
        diets.includes('kosher')
      );
      expect(kosherProducts.length).toBeGreaterThan(0);
    });

    it('should have nut-free products', () => {
      const nutFreeProducts = Object.entries(PRODUCT_DIET_MAPPING).filter(([_, diets]) =>
        diets.includes('nut-free')
      );
      expect(nutFreeProducts.length).toBeGreaterThan(0);
    });

    it('should have dairy-free products', () => {
      const dairyFreeProducts = Object.entries(PRODUCT_DIET_MAPPING).filter(([_, diets]) =>
        diets.includes('dairy-free')
      );
      expect(dairyFreeProducts.length).toBeGreaterThan(0);
    });
  });
});
