import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, shoppingLists, shoppingListItems, savingsPosts, productReviews, userAchievements, priceAlerts, InsertPriceAlert } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Shopping Lists
export async function createShoppingList(userId: number, name: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(shoppingLists).values({
    userId,
    name,
    description: description || null,
    isDefault: 0,
  });
}

export async function getUserShoppingLists(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(shoppingLists).where(eq(shoppingLists.userId, userId));
}

export async function addItemToList(listId: number, productName: string, category?: string, quantity: number = 1) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(shoppingListItems).values({
    listId,
    productName,
    category: category || null,
    quantity,
    unit: "item",
    isChecked: 0,
  });
}

// Savings Posts (Community)
export async function createSavingsPost(userId: number, title: string, amountSaved: number, store?: string, productCategory?: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(savingsPosts).values({
    userId,
    title,
    description: description || null,
    amountSaved,
    store: store || null,
    productCategory: productCategory || null,
    likes: 0,
  });
}

export async function getSavingsPosts(limit: number = 20) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(savingsPosts).orderBy(desc(savingsPosts.createdAt)).limit(limit);
}

// Product Reviews
export async function createProductReview(userId: number, productName: string, store: string, rating: number, comment?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(productReviews).values({
    userId,
    productName,
    store,
    rating,
    comment: comment || null,
    helpful: 0,
  });
}

export async function getProductReviews(productName: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(productReviews).where(eq(productReviews.productName, productName));
}

// User Achievements
export async function awardAchievement(userId: number, badge: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(userAchievements).values({
    userId,
    badge,
  });
}

export async function getUserAchievements(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
}

// Price Alerts
export async function createPriceAlert(userId: number, productId: number, targetPrice: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(priceAlerts).values({
    userId,
    productId,
    targetPrice: Math.round(targetPrice * 100), // Store in cents
    alertType: 'below_price',
    isActive: 1,
    notificationsSent: 0,
  });
}

export async function getUserPriceAlerts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(priceAlerts).where(eq(priceAlerts.userId, userId));
}

export async function updatePriceAlert(alertId: number, updates: Partial<InsertPriceAlert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(priceAlerts).set(updates).where(eq(priceAlerts.id, alertId));
}

export async function deletePriceAlert(alertId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(priceAlerts).where(eq(priceAlerts.id, alertId));
}
