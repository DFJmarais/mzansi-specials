import fs from 'fs';
import path from 'path';

// Mapping of hardcoded strings to translation keys
const stringMap = {
  'Prices': 'prices',
  'Budget': 'budget',
  'Meals': 'meals',
  'Alerts': 'alerts',
  'Community': 'community',
  'Weekly Planner': 'weekly_planner',
  'Smart Planner': 'smart_planner',
  'Bundles': 'bundles',
  'Comparison': 'comparison',
  'Save on Every Shop': 'save_on_every_shop',
  'Compare prices across Spar, Pick n Pay, Checkers, OK Foods, ShopRite, and Woolworths. Find the best deals on milk, meat, produce, and more—all in one place.': 'compare_prices_across',
  'Real-time prices': 'real_time_prices',
  'Best specials': 'best_specials',
  'DEAL OF THE DAY': 'deal_of_the_day',
  'Shop Now': 'shop_now',
  'Ends in:': 'ends_in',
  'Biggest discount today': 'biggest_discount',
  'You save on this deal': 'you_save',
  'Limited': 'limited',
  'Stock available': 'stock_available',
  'Search for milk, meat, bread...': 'search_placeholder',
  'Filter': 'filter',
  'Category': 'category',
  'Store': 'store',
  'All Stores': 'all_stores',
  'Apply': 'apply',
  'Clear': 'clear',
  'Best Price': 'best_price',
  'Price': 'price',
  'Discount': 'discount',
  'OFF': 'off',
  'Available at': 'available_at',
  'Prices at other stores': 'prices_at_other_stores',
  'Special': 'special',
  'No products found. Try a different search.': 'no_products_found',
  'Set Budget': 'set_budget',
  'Total Spent': 'total_spent',
  'Remaining': 'remaining',
  'Add Product': 'add_product',
  'Remove': 'remove',
  'Added Products': 'added_products',
  'Add to Wishlist': 'add_to_wishlist',
  'Remove from Wishlist': 'remove_from_wishlist',
  'Wishlist': 'wishlist',
  'Share': 'share',
  'Save': 'save',
  'Language': 'language',
  'Select Language': 'select_language',
  'Welcome': 'welcome',
  'Logout': 'logout',
  'Settings': 'settings',
  'Browse our wide selection of products': 'browse_categories',
  'Featured Deals': 'featured_deals',
  'View More': 'view_more',
  'Smart Budget Optimizer': 'smart_optimizer',
  'Potential Savings': 'potential_savings',
  'Budget Efficiency': 'budget_efficiency',
  'Optimization Score': 'optimization_score',
  'Budget exceeded': 'budget_exceeded',
  'Budget running low': 'budget_running_low',
  'Last updated': 'last_updated',
  'hours ago': 'hours_ago',
};

// Read Home.tsx
const filePath = '/home/ubuntu/mzansi-specials/client/src/pages/Home.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Check if useMultiLanguage is already imported
if (!content.includes('useMultiLanguage')) {
  // Add import after other imports
  content = content.replace(
    "import { useAuth } from '@/_core/hooks/useAuth';",
    "import { useAuth } from '@/_core/hooks/useAuth';\nimport { useMultiLanguage } from '@/contexts/MultiLanguageContext';"
  );
}

// Add t function to Home component
if (!content.includes('const { t } = useMultiLanguage()')) {
  content = content.replace(
    'const { user, isAuthenticated, logout } = useAuth();',
    'const { user, isAuthenticated, logout } = useAuth();\n  const { t } = useMultiLanguage();'
  );
}

// Replace hardcoded strings with t() calls
// Sort by length (longest first) to avoid partial replacements
const sortedEntries = Object.entries(stringMap).sort((a, b) => b[0].length - a[0].length);

for (const [str, key] of sortedEntries) {
  // Escape special regex characters
  const escaped = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Match the string in JSX (in quotes or as text)
  const patterns = [
    // String in quotes: "string"
    new RegExp(`"${escaped}"`, 'g'),
    // String in single quotes: 'string'
    new RegExp(`'${escaped}'`, 'g'),
    // String in template literals: \`string\`
    new RegExp(`\`${escaped}\``, 'g'),
  ];
  
  for (const pattern of patterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, `{t('${key}')}`);
    }
  }
}

// Write back
fs.writeFileSync(filePath, content, 'utf-8');
console.log('✅ Converted hardcoded strings to translations in Home.tsx');
