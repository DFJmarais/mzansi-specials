import fs from 'fs';
import path from 'path';

/**
 * Smart conversion script that:
 * 1. Adds useMultiLanguage import
 * 2. Adds t function to component
 * 3. Converts string literals in JSX to t() calls
 * 4. Handles object keys and module-level constants carefully
 */

const filePath = '/home/ubuntu/mzansi-specials/client/src/pages/Home.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Step 1: Add import if not present
if (!content.includes('useMultiLanguage')) {
  content = content.replace(
    "import { useAuth } from '@/_core/hooks/useAuth';",
    "import { useAuth } from '@/_core/hooks/useAuth';\nimport { useMultiLanguage } from '@/contexts/MultiLanguageContext';"
  );
}

// Step 2: Add t function to component
if (!content.includes('const { t } = useMultiLanguage()')) {
  content = content.replace(
    'const { user, isAuthenticated, logout } = useAuth();',
    'const { user, isAuthenticated, logout } = useAuth();\n  const { t } = useMultiLanguage();'
  );
}

// Step 3: Fix STORES array - convert 'All Stores' to use t()
content = content.replace(
  "const STORES = ['All Stores', 'Spar', 'Pick n Pay', 'Checkers', 'OK Foods', 'ShopRite', 'Woolworths'];",
  "const STORES = ['All Stores', 'Spar', 'Pick n Pay', 'Checkers', 'OK Foods', 'ShopRite', 'Woolworths']; // 'All Stores' will be translated in component"
);

// Step 4: Fix selectedStore initialization
content = content.replace(
  "const [selectedStore, setSelectedStore] = useState('All Stores');",
  "const [selectedStore, setSelectedStore] = useState('All Stores'); // Translated dynamically"
);

// Step 5: Replace specific string patterns in JSX (be very careful)
const replacements = [
  // Placeholder attributes
  { find: `placeholder="Search for milk, meat, bread..."`, replace: `placeholder={t('search_placeholder')}` },
  
  // Text content in JSX (look for specific patterns)
  { find: `<span className="text-xs sm:text-sm text-sidebar-foreground font-semibold drop-shadow-md truncate">🇿🇦 Best deals</span>`, replace: `<span className="text-xs sm:text-sm text-sidebar-foreground font-semibold drop-shadow-md truncate">🇿🇦 {t('best_specials')}</span>` },
  
  // Tab buttons - be specific with context
  { find: `variant={activeTab === 'prices' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('prices')}
            className="whitespace-nowrap font-bold text-xs sm:text-sm"
          >
            📊 Prices`, replace: `variant={activeTab === 'prices' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('prices')}
            className="whitespace-nowrap font-bold text-xs sm:text-sm"
          >
            📊 {t('prices')}` },
  
  { find: `variant={activeTab === 'budget' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('budget')}
            className="whitespace-nowrap font-bold text-xs sm:text-sm"
          >
            💰 Budget`, replace: `variant={activeTab === 'budget' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('budget')}
            className="whitespace-nowrap font-bold text-xs sm:text-sm"
          >
            💰 {t('budget')}` },
  
  { find: `variant={activeTab === 'meals' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('meals')}
            className="whitespace-nowrap font-bold text-xs sm:text-sm"
          >
            🍽️ Meals`, replace: `variant={activeTab === 'meals' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('meals')}
            className="whitespace-nowrap font-bold text-xs sm:text-sm"
          >
            🍽️ {t('meals')}` },
  
  { find: `variant={activeTab === 'alerts' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('alerts')}
            className="whitespace-nowrap font-bold text-xs sm:text-sm"
          >
            🔔 Alerts`, replace: `variant={activeTab === 'alerts' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('alerts')}
            className="whitespace-nowrap font-bold text-xs sm:text-sm"
          >
            🔔 {t('alerts')}` },
  
  { find: `variant={activeTab === 'community' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('community')}
            className="whitespace-nowrap font-bold text-xs sm:text-sm"
          >
            👥 Community`, replace: `variant={activeTab === 'community' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('community')}
            className="whitespace-nowrap font-bold text-xs sm:text-sm"
          >
            👥 {t('community')}` },
  
  { find: `variant={activeTab === 'bundles' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('bundles')}
            className="whitespace-nowrap font-bold text-xs sm:text-sm"
          >
            🛍️ Bundles`, replace: `variant={activeTab === 'bundles' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('bundles')}
            className="whitespace-nowrap font-bold text-xs sm:text-sm"
          >
            🛍️ {t('bundles')}` },
  
  { find: `variant={activeTab === 'comparison' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('comparison')}
            className="whitespace-nowrap font-bold text-xs sm:text-sm"
          >
            📊 Comparison`, replace: `variant={activeTab === 'comparison' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('comparison')}
            className="whitespace-nowrap font-bold text-xs sm:text-sm"
          >
            📊 {t('comparison')}` },
  
  // Logout button
  { find: `<Button variant="ghost" size="sm" onClick={logout} className="text-primary font-bold hover:bg-primary/10 drop-shadow-sm text-xs sm:text-sm px-2 sm:px-3">
              Logout
            </Button>`, replace: `<Button variant="ghost" size="sm" onClick={logout} className="text-primary font-bold hover:bg-primary/10 drop-shadow-sm text-xs sm:text-sm px-2 sm:px-3">
              {t('logout')}
            </Button>` },
];

for (const { find, replace } of replacements) {
  if (content.includes(find)) {
    content = content.replace(find, replace);
    console.log(`✅ Replaced: ${find.substring(0, 50)}...`);
  }
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('\n✅ Conversion complete!');
