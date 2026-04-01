import { router, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { products, prices } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const productsRouter = router({
  /**
   * Get all products with their latest prices
   */
  getAllWithPrices: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) return [];

      // Get all products
      const allProducts = await db.select().from(products).limit(500);

      // For each product, get the latest prices
      const productsWithPrices = await Promise.all(
        allProducts.map(async (product) => {
          const latestPrices = await db
            .select()
            .from(prices)
            .where(eq(prices.productId, product.id))
            .orderBy(desc(prices.lastUpdated))
            .limit(100);

          return {
            id: product.id,
            name: product.name,
            category: product.category,
            description: product.description,
            imageUrl: product.imageUrl,
            prices: latestPrices.map((p) => ({
              id: p.id,
              storeName: p.storeName,
              price: parseFloat(p.price.toString()),
              originalPrice: p.originalPrice ? parseFloat(p.originalPrice.toString()) : undefined,
              discount: p.discount,
              url: p.url,
              lastUpdated: p.lastUpdated,
            })),
          };
        })
      );

      return productsWithPrices;
    } catch (error) {
      console.error("Error fetching products with prices:", error);
      return [];
    }
  }),

  /**
   * Get a single product with all its prices
   */
  getWithPrices: publicProcedure
    .input((val: any) => {
      if (typeof val === "number") return val;
      throw new Error("Expected number");
    })
    .query(async ({ input: productId }) => {
      try {
        const db = await getDb();
        if (!db) return null;

        const product = await db
          .select()
          .from(products)
          .where(eq(products.id, productId))
          .limit(1);

        if (!product.length) return null;

        const productPrices = await db
          .select()
          .from(prices)
          .where(eq(prices.productId, productId))
          .orderBy(desc(prices.lastUpdated));

        return {
          id: product[0].id,
          name: product[0].name,
          category: product[0].category,
          description: product[0].description,
          imageUrl: product[0].imageUrl,
          prices: productPrices.map((p) => ({
            id: p.id,
            storeName: p.storeName,
            price: parseFloat(p.price.toString()),
            originalPrice: p.originalPrice ? parseFloat(p.originalPrice.toString()) : undefined,
            discount: p.discount,
            url: p.url,
            lastUpdated: p.lastUpdated,
          })),
        };
      } catch (error) {
        console.error("Error fetching product with prices:", error);
        return null;
      }
    }),

  /**
   * Get products by category
   */
  getByCategory: publicProcedure
    .input((val: any) => {
      if (typeof val === "string") return val;
      throw new Error("Expected string");
    })
    .query(async ({ input: category }) => {
      try {
        const db = await getDb();
        if (!db) return [];

        const categoryProducts = await db
          .select()
          .from(products)
          .where(eq(products.category, category))
          .limit(500);

        // Get prices for each product
        const productsWithPrices = await Promise.all(
          categoryProducts.map(async (product) => {
            const productPrices = await db
              .select()
              .from(prices)
              .where(eq(prices.productId, product.id))
              .orderBy(desc(prices.lastUpdated))
              .limit(100);

            return {
              id: product.id,
              name: product.name,
              category: product.category,
              description: product.description,
              imageUrl: product.imageUrl,
              prices: productPrices.map((p) => ({
                storeName: p.storeName,
                price: parseFloat(p.price.toString()),
                originalPrice: p.originalPrice ? parseFloat(p.originalPrice.toString()) : undefined,
                discount: p.discount,
                url: p.url,
                lastUpdated: p.lastUpdated,
              })),
            };
          })
        );

        return productsWithPrices;
      } catch (error) {
        console.error("Error fetching products by category:", error);
        return [];
      }
    }),
});
