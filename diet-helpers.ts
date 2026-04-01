import { eq, and, inArray, sql } from "drizzle-orm";
import { getDb } from "./db";
import { dietCategories, productDietTags, userDietPreferences, dietRecommendations } from "../drizzle/schema";
import { DIET_CATEGORIES, PRODUCT_DIET_MAPPING } from "./seeds/diet-categories";

/**
 * Initialize diet categories in the database
 */
export async function initializeDietCategories(): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Diet] Database not available");
    return;
  }

  try {
    // Check if categories already exist
    const existing = await db.select().from(dietCategories).limit(1);
    if (existing.length > 0) {
      console.log("[Diet] Categories already initialized");
      return;
    }

    // Insert all diet categories
    for (const category of DIET_CATEGORIES) {
      await db.insert(dietCategories).values({
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        color: category.color,
      });
    }

    console.log(`[Diet] Initialized ${DIET_CATEGORIES.length} diet categories`);
  } catch (error) {
    console.error("[Diet] Failed to initialize categories:", error);
  }
}

/**
 * Get all diet categories
 */
export async function getAllDietCategories() {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(dietCategories);
  } catch (error) {
    console.error("[Diet] Failed to get categories:", error);
    return [];
  }
}

/**
 * Get diet category by slug
 */
export async function getDietCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(dietCategories)
      .where(eq(dietCategories.slug, slug))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Diet] Failed to get category:", error);
    return null;
  }
}

/**
 * Tag a product with diet categories
 */
export async function tagProductWithDiet(
  productId: number,
  dietSlugs: string[]
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Diet] Database not available");
    return;
  }

  try {
    // Get diet category IDs from slugs
    const categories = await db
      .select()
      .from(dietCategories)
      .where(inArray(dietCategories.slug, dietSlugs));

    // Insert product-diet tags
    for (const category of categories) {
      await db.insert(productDietTags).values({
        productId,
        dietCategoryId: category.id,
      });
    }

    console.log(`[Diet] Tagged product ${productId} with ${categories.length} diet categories`);
  } catch (error) {
    console.error("[Diet] Failed to tag product:", error);
  }
}

/**
 * Get diet categories for a product
 */
export async function getProductDietCategories(productId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    const tags = await db
      .select({
        id: dietCategories.id,
        name: dietCategories.name,
        slug: dietCategories.slug,
        icon: dietCategories.icon,
        color: dietCategories.color,
      })
      .from(productDietTags)
      .innerJoin(dietCategories, eq(productDietTags.dietCategoryId, dietCategories.id))
      .where(eq(productDietTags.productId, productId));

    return tags;
  } catch (error) {
    console.error("[Diet] Failed to get product diet categories:", error);
    return [];
  }
}

/**
 * Set user diet preferences
 */
export async function setUserDietPreferences(
  userId: number,
  dietSlugs: string[],
  primarySlug?: string
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Diet] Database not available");
    return;
  }

  try {
    // Get diet category IDs
    const categories = await db
      .select()
      .from(dietCategories)
      .where(inArray(dietCategories.slug, dietSlugs));

    // Clear existing preferences
    await db.delete(userDietPreferences).where(eq(userDietPreferences.userId, userId));

    // Insert new preferences
    for (const category of categories) {
      const isPrimary = primarySlug === category.slug ? 1 : 0;
      await db.insert(userDietPreferences).values({
        userId,
        dietCategoryId: category.id,
        isPrimary,
      });
    }

    console.log(`[Diet] Set ${categories.length} diet preferences for user ${userId}`);
  } catch (error) {
    console.error("[Diet] Failed to set user preferences:", error);
  }
}

/**
 * Get user diet preferences
 */
export async function getUserDietPreferences(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    const prefs = await db
      .select({
        id: dietCategories.id,
        name: dietCategories.name,
        slug: dietCategories.slug,
        icon: dietCategories.icon,
        color: dietCategories.color,
        isPrimary: userDietPreferences.isPrimary,
      })
      .from(userDietPreferences)
      .innerJoin(dietCategories, eq(userDietPreferences.dietCategoryId, dietCategories.id))
      .where(eq(userDietPreferences.userId, userId));

    return prefs;
  } catch (error) {
    console.error("[Diet] Failed to get user preferences:", error);
    return [];
  }
}

/**
 * Get products matching user diet preferences
 */
export async function getProductsForUserDiet(userId: number, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  try {
    const userPrefs = await getUserDietPreferences(userId);
    if (userPrefs.length === 0) return [];

    const dietCategoryIds = userPrefs.map((p) => p.id);

    // Get products tagged with user's diet categories
    const products = await db
      .selectDistinct({
        id: productDietTags.productId,
      })
      .from(productDietTags)
      .where(inArray(productDietTags.dietCategoryId, dietCategoryIds))
      .limit(limit);

    return products.map((p) => p.id);
  } catch (error) {
    console.error("[Diet] Failed to get products for user diet:", error);
    return [];
  }
}

/**
 * Search products by diet category
 */
export async function searchProductsByDiet(dietSlug: string, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  try {
    const category = await getDietCategoryBySlug(dietSlug);
    if (!category) return [];

    const products = await db
      .select({
        productId: productDietTags.productId,
      })
      .from(productDietTags)
      .where(eq(productDietTags.dietCategoryId, category.id))
      .limit(limit);

    return products.map((p) => p.productId);
  } catch (error) {
    console.error("[Diet] Failed to search products by diet:", error);
    return [];
  }
}

/**
 * Create a diet recommendation for a user
 */
export async function createDietRecommendation(
  userId: number,
  productId: number,
  dietCategoryId: number,
  reason?: string,
  score: number = 100
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Diet] Database not available");
    return;
  }

  try {
    await db.insert(dietRecommendations).values({
      userId,
      productId,
      dietCategoryId,
      reason: reason || null,
      score,
    });
  } catch (error) {
    console.error("[Diet] Failed to create recommendation:", error);
  }
}

/**
 * Get diet recommendations for a user
 */
export async function getUserDietRecommendations(userId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(dietRecommendations)
      .where(eq(dietRecommendations.userId, userId))
      .limit(limit);
  } catch (error) {
    console.error("[Diet] Failed to get recommendations:", error);
    return [];
  }
}

/**
 * Get products that match multiple diet categories
 */
export async function getProductsMatchingMultipleDiets(
  dietSlugs: string[],
  matchAll: boolean = false
): Promise<number[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const categories = await db
      .select()
      .from(dietCategories)
      .where(inArray(dietCategories.slug, dietSlugs));

    if (categories.length === 0) return [];

    const categoryIds = categories.map((c) => c.id);

    if (matchAll) {
      // Get products that match ALL diet categories
      const productCounts = await db
        .select({
          productId: productDietTags.productId,
          count: sql`COUNT(DISTINCT ${productDietTags.dietCategoryId})`,
        })
        .from(productDietTags)
        .where(inArray(productDietTags.dietCategoryId, categoryIds))
        .groupBy(productDietTags.productId)
        .having(sql`COUNT(DISTINCT ${productDietTags.dietCategoryId}) = ${categoryIds.length}`);

      return productCounts.map((p) => p.productId as number);
    } else {
      // Get products that match ANY diet category
      const products = await db
        .selectDistinct({
          productId: productDietTags.productId,
        })
        .from(productDietTags)
        .where(inArray(productDietTags.dietCategoryId, categoryIds));

      return products.map((p) => p.productId);
    }
  } catch (error) {
    console.error("[Diet] Failed to get products matching diets:", error);
    return [];
  }
}

/**
 * Get diet statistics
 */
export async function getDietStatistics() {
  const db = await getDb();
  if (!db) return null;

  try {
    const totalCategories = await db.select().from(dietCategories);
    const totalTags = await db.select().from(productDietTags);
    const totalUserPrefs = await db.select().from(userDietPreferences);

    return {
      totalDietCategories: totalCategories.length,
      totalProductTags: totalTags.length,
      totalUserPreferences: totalUserPrefs.length,
      averageTagsPerProduct: totalTags.length / Math.max(1, totalCategories.length),
    };
  } catch (error) {
    console.error("[Diet] Failed to get statistics:", error);
    return null;
  }
}
