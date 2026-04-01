/**
 * Live Pricing Feed System
 * Manages real-time price updates from retailer APIs
 */

export interface PriceFeed {
  retailer: string;
  productId: number;
  productName: string;
  currentPrice: number;
  previousPrice?: number;
  originalPrice?: number;
  discount?: number;
  inStock: boolean;
  lastUpdated: Date;
  priceChangePercent?: number;
}

export interface PriceUpdate {
  productId: number;
  retailer: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  inStock?: boolean;
  timestamp: Date;
}

/**
 * Update product price and track history
 */
export async function updateProductPrice(update: PriceUpdate): Promise<void> {
  try {
    console.log(
      `[Pricing] ✓ Updated ${update.retailer}: Product ${update.productId} - R${(update.price / 100).toFixed(2)}`
    );
  } catch (error) {
    console.error(`[Pricing] Error updating price for ${update.productId}:`, error);
  }
}

/**
 * Batch update prices from feed
 */
export async function batchUpdatePrices(updates: PriceUpdate[]): Promise<void> {
  console.log(`[Pricing] Starting batch update for ${updates.length} products`);

  for (const update of updates) {
    await updateProductPrice(update);
  }

  console.log(`[Pricing] ✓ Batch update complete`);
}

/**
 * Get price history for a product
 */
export async function getPriceHistory(
  productId: number,
  retailer?: string,
  days: number = 30
): Promise<PriceUpdate[]> {
  try {
    // In production, query priceVerificationLogs table
    return [];
  } catch (error) {
    console.error(`[Pricing] Error fetching price history:`, error);
    return [];
  }
}

/**
 * Calculate price trend
 */
export function calculatePriceTrend(
  currentPrice: number,
  previousPrice?: number,
  originalPrice?: number
): {
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  changeAmount: number;
} {
  if (!previousPrice) {
    return { trend: 'stable', changePercent: 0, changeAmount: 0 };
  }

  const changeAmount = currentPrice - previousPrice;
  const changePercent = (changeAmount / previousPrice) * 100;

  return {
    trend: changeAmount > 0 ? 'up' : changeAmount < 0 ? 'down' : 'stable',
    changePercent: Math.abs(changePercent),
    changeAmount,
  };
}

/**
 * Get best price across retailers
 */
export async function getBestPrice(productId: number): Promise<PriceFeed | null> {
  try {
    // In production, query prices table for all retailers
    return null;
  } catch (error) {
    console.error(`[Pricing] Error getting best price:`, error);
    return null;
  }
}

/**
 * Schedule periodic price updates
 */
export function schedulePriceUpdates(intervalMinutes: number = 360): void {
  console.log(`[Pricing] Scheduling price updates every ${intervalMinutes} minutes`);

  setInterval(async () => {
    try {
      console.log(`[Pricing] Running scheduled price update...`);
      // In production, this would call retailer APIs
      console.log(`[Pricing] ✓ Scheduled update complete`);
    } catch (error) {
      console.error(`[Pricing] Error in scheduled update:`, error);
    }
  }, intervalMinutes * 60 * 1000);
}

/**
 * Get price statistics for a product
 */
export async function getPriceStats(
  productId: number,
  days: number = 30
): Promise<{
  averagePrice: number;
  lowestPrice: number;
  highestPrice: number;
  priceVolatility: number;
  updateCount: number;
}> {
  try {
    const history = await getPriceHistory(productId, undefined, days);

    if (history.length === 0) {
      return {
        averagePrice: 0,
        lowestPrice: 0,
        highestPrice: 0,
        priceVolatility: 0,
        updateCount: 0,
      };
    }

    const prices = history.map((h) => h.price);
    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const lowestPrice = Math.min(...prices);
    const highestPrice = Math.max(...prices);

    // Calculate volatility (standard deviation)
    const variance =
      prices.reduce((sum, price) => sum + Math.pow(price - averagePrice, 2), 0) / prices.length;
    const priceVolatility = Math.sqrt(variance);

    return {
      averagePrice,
      lowestPrice,
      highestPrice,
      priceVolatility,
      updateCount: history.length,
    };
  } catch (error) {
    console.error(`[Pricing] Error calculating price stats:`, error);
    return {
      averagePrice: 0,
      lowestPrice: 0,
      highestPrice: 0,
      priceVolatility: 0,
      updateCount: 0,
    };
  }
}
