/**
 * Web Scraping Module
 * Coordinates price scraping from all retailers and Facebook
 */

export { scrapeCheckersProducts, scrapeCheckersSpecials } from './checkers-scraper';
export { scrapePicknPayProducts, scrapePicknPaySpecials } from './picknpay-scraper';
export { sparScrapeProducts, sparScrapeSpecials } from './spar-scraper';
export { scrapeWoolworthsProducts, scrapeWoolworthsSpecials } from './woolworths-scraper';
export { scrapeOKFoodsProducts, scrapeOKFoodsSpecials } from './okfoods-scraper';
export { scrapeFacebookMarketplace, searchFacebookDeals } from './facebook-scraper';

/**
 * Price Scraping Scheduler
 * Runs every 6 hours to update prices from all retailers
 */
export async function initializePriceScraper() {
  console.log('[Price Scraper] Initializing price scraping scheduler...');
  
  // Schedule price scraping every 6 hours
  setInterval(async () => {
    try {
      console.log('[Price Scraper] Running scheduled price update...');
      // Price scraping logic will be called here
      // This integrates with the database to store prices
    } catch (error) {
      console.error('[Price Scraper] Error in scheduled job:', error);
    }
  }, 6 * 60 * 60 * 1000); // 6 hours

  console.log('[Price Scraper] Scheduler initialized - runs every 6 hours');
}
