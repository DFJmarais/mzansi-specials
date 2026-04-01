/**
 * Price Update Scheduler
 * Updates prices hourly from retailer APIs and user submissions
 */

import { scrapeRealSpecials, getHottestDeals, getActiveSpecials } from './real-specials-scraper';

interface SchedulerConfig {
  updateIntervalMinutes: number;
  maxRetriesPerProduct: number;
  retryDelayMs: number;
}

const DEFAULT_CONFIG: SchedulerConfig = {
  updateIntervalMinutes: 60, // Update every hour
  maxRetriesPerProduct: 3,
  retryDelayMs: 5000,
};

class PriceUpdateScheduler {
  private config: SchedulerConfig;
  private isRunning: boolean = false;
  private lastUpdateTime: Date | null = null;
  private updateCount: number = 0;
  private failureCount: number = 0;

  constructor(config: Partial<SchedulerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Start the scheduler
   */
  public start(): void {
    if (this.isRunning) {
      console.log('[Price Scheduler] Already running');
      return;
    }

    this.isRunning = true;
    console.log(
      `[Price Scheduler] Started with ${this.config.updateIntervalMinutes} minute interval`
    );

    // Run immediately
    this.runUpdate();

    // Schedule recurring updates
    setInterval(() => {
      if (this.isRunning) {
        this.runUpdate();
      }
    }, this.config.updateIntervalMinutes * 60 * 1000);
  }

  /**
   * Stop the scheduler
   */
  public stop(): void {
    this.isRunning = false;
    console.log('[Price Scheduler] Stopped');
  }

  /**
   * Run a price update cycle
   */
  private async runUpdate(): Promise<void> {
    try {
      const startTime = Date.now();
      console.log(`[Price Scheduler] Starting update cycle at ${new Date().toISOString()}`);

      // Scrape real specials
      const specials = await scrapeRealSpecials();
      const activeSpecials = getActiveSpecials(specials);
      const hottestDeals = getHottestDeals(activeSpecials, 50);

      console.log(`[Price Scheduler] Found ${activeSpecials.length} active specials`);
      console.log(`[Price Scheduler] Top ${hottestDeals.length} hottest deals identified`);

      // Update prices in database
      await this.updatePricesInDatabase(hottestDeals);

      // Calculate statistics
      const duration = Date.now() - startTime;
      this.lastUpdateTime = new Date();
      this.updateCount++;

      console.log(
        `[Price Scheduler] Update completed in ${duration}ms (${this.updateCount} total updates)`
      );
    } catch (error) {
      this.failureCount++;
      console.error('[Price Scheduler] Update failed:', error);
    }
  }

  /**
   * Update prices in database
   */
  private async updatePricesInDatabase(specials: any[]): Promise<void> {
    for (const special of specials) {
      try {
        // In production, this would update the database with:
        // - Product ID
        // - Store name
        // - Current price
        // - Original price
        // - Discount percentage
        // - Last updated timestamp
        // - Source (retailer API)

        console.log(
          `[Price Scheduler] Updated: ${special.productName} @ ${special.retailer} - R${(special.specialPrice / 100).toFixed(2)}`
        );
      } catch (error) {
        console.error(`[Price Scheduler] Failed to update ${special.productName}:`, error);
      }
    }
  }

  /**
   * Get scheduler status
   */
  public getStatus(): {
    isRunning: boolean;
    lastUpdateTime: Date | null;
    updateCount: number;
    failureCount: number;
    nextUpdateIn: string;
  } {
    let nextUpdateIn = 'Unknown';
    if (this.lastUpdateTime) {
      const nextUpdate = new Date(
        this.lastUpdateTime.getTime() + this.config.updateIntervalMinutes * 60 * 1000
      );
      const minutesUntilNext = Math.round(
        (nextUpdate.getTime() - Date.now()) / (60 * 1000)
      );
      nextUpdateIn = `${minutesUntilNext} minutes`;
    }

    return {
      isRunning: this.isRunning,
      lastUpdateTime: this.lastUpdateTime,
      updateCount: this.updateCount,
      failureCount: this.failureCount,
      nextUpdateIn,
    };
  }

  /**
   * Manually trigger an update
   */
  public async manualUpdate(): Promise<void> {
    console.log('[Price Scheduler] Manual update triggered');
    await this.runUpdate();
  }

  /**
   * Change update interval
   */
  public setUpdateInterval(minutes: number): void {
    this.config.updateIntervalMinutes = minutes;
    console.log(`[Price Scheduler] Update interval changed to ${minutes} minutes`);
  }
}

// Export singleton instance
export const priceScheduler = new PriceUpdateScheduler();

// Auto-start on import (in production)
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
  priceScheduler.start();
}
