import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface PriceData {
  store: string;
  price: number;
  discount?: number;
  productCount?: number;
}

interface CategoryStats {
  category: string;
  icon: string;
  avgPrice: number;
  cheapestStore: string;
  mostExpensiveStore: string;
  priceRange: number;
  stores: PriceData[];
  savings: number;
}

interface CategoryPriceComparisonProps {
  categories: string[];
  selectedCategory?: string;
}

// Mock data - in production, this would come from the backend
const MOCK_CATEGORY_PRICES: Record<string, CategoryStats> = {
  'Personal Care': {
    category: 'Personal Care',
    icon: '🧴',
    avgPrice: 45.50,
    cheapestStore: 'ShopRite',
    mostExpensiveStore: 'Woolworths',
    priceRange: 12.50,
    savings: 27.5,
    stores: [
      { store: 'Spar', price: 48.99 },
      { store: 'Pick n Pay', price: 51.50 },
      { store: 'Checkers', price: 49.99 },
      { store: 'ShopRite', price: 39.49, discount: 15 },
      { store: 'Woolworths', price: 52.00 },
    ],
  },
  'Household': {
    category: 'Household',
    icon: '🧹',
    avgPrice: 38.20,
    cheapestStore: 'OK Foods',
    mostExpensiveStore: 'Checkers',
    priceRange: 8.50,
    savings: 22.2,
    stores: [
      { store: 'Spar', price: 40.50 },
      { store: 'Pick n Pay', price: 39.99 },
      { store: 'Checkers', price: 44.99 },
      { store: 'OK Foods', price: 36.49, discount: 10 },
      { store: 'ShopRite', price: 37.50 },
    ],
  },
  'Health': {
    category: 'Health',
    icon: '💊',
    avgPrice: 55.80,
    cheapestStore: 'ShopRite',
    mostExpensiveStore: 'Woolworths',
    priceRange: 15.20,
    savings: 27.3,
    stores: [
      { store: 'Spar', price: 58.99 },
      { store: 'Pick n Pay', price: 62.50 },
      { store: 'Checkers', price: 60.99 },
      { store: 'ShopRite', price: 47.79, discount: 20 },
      { store: 'Woolworths', price: 63.00 },
    ],
  },
  'Baby': {
    category: 'Baby',
    icon: '👶',
    avgPrice: 72.40,
    cheapestStore: 'Pick n Pay',
    mostExpensiveStore: 'Woolworths',
    priceRange: 18.50,
    savings: 25.6,
    stores: [
      { store: 'Spar', price: 75.99 },
      { store: 'Pick n Pay', price: 64.49, discount: 12 },
      { store: 'Checkers', price: 77.50 },
      { store: 'ShopRite', price: 68.99 },
      { store: 'Woolworths', price: 82.99 },
    ],
  },
  'Pet Supplies': {
    category: 'Pet Supplies',
    icon: '🐕',
    avgPrice: 42.60,
    cheapestStore: 'ShopRite',
    mostExpensiveStore: 'Checkers',
    priceRange: 11.50,
    savings: 27.0,
    stores: [
      { store: 'Spar', price: 44.99 },
      { store: 'Pick n Pay', price: 46.50 },
      { store: 'Checkers', price: 49.99 },
      { store: 'ShopRite', price: 38.49, discount: 14 },
      { store: 'Woolworths', price: 45.00 },
    ],
  },
};

export function CategoryPriceComparison({ categories, selectedCategory }: CategoryPriceComparisonProps) {
  const categoryStats = useMemo(() => {
    return categories
      .filter((cat) => MOCK_CATEGORY_PRICES[cat])
      .map((cat) => MOCK_CATEGORY_PRICES[cat]);
  }, [categories]);

  if (categoryStats.length === 0) {
    return (
      <Card className="p-6 border-2 border-primary/20 text-center">
        <p className="text-muted-foreground">No price data available for selected categories</p>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Price Comparison by Category
        </h3>

        {/* Category Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {categoryStats.map((stat) => (
            <Card
              key={stat.category}
              className={`p-4 border-2 transition-all cursor-pointer ${
                selectedCategory === stat.category
                  ? 'border-primary bg-primary/5'
                  : 'border-primary/20 hover:border-primary/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-2xl mb-1">{stat.icon}</h4>
                  <p className="font-bold text-foreground">{stat.category}</p>
                </div>
                <Badge variant="secondary" className="bg-secondary/20 text-secondary">
                  Save R{stat.savings.toFixed(2)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Avg Price</span>
                  <span className="font-bold text-foreground">R{stat.avgPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Cheapest</span>
                  <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    {stat.cheapestStore}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Price Range</span>
                  <span className="text-xs font-semibold text-orange-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    R{stat.priceRange.toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Price Comparison Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categoryStats.slice(0, 2).map((stat) => (
            <Card key={`chart-${stat.category}`} className="p-4 border-2 border-primary/20">
              <h4 className="font-bold text-foreground mb-4">{stat.icon} {stat.category} - Store Prices</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stat.stores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="store" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => `R${(value as number).toFixed(2)}`}
                    contentStyle={{ backgroundColor: '#f5f5f5', border: '1px solid #ddd' }}
                  />
                  <Bar dataKey="price" fill="#F4A460" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          ))}
        </div>

        {/* Store Rankings */}
        <Card className="p-4 border-2 border-primary/20">
          <h4 className="font-bold text-foreground mb-4">🏆 Store Rankings by Category</h4>
          <div className="space-y-3">
            {categoryStats.map((stat) => (
              <div key={`ranking-${stat.category}`} className="pb-3 border-b border-primary/10 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground">{stat.icon} {stat.category}</span>
                  <span className="text-xs text-muted-foreground">Best → Worst</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {stat.stores.map((store, idx) => (
                    <div
                      key={store.store}
                      className={`flex-1 min-w-[80px] text-center p-2 rounded text-xs font-semibold transition-all ${
                        idx === 0
                          ? 'bg-green-100 text-green-700 border-2 border-green-300'
                          : idx === stat.stores.length - 1
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="font-bold">{idx + 1}</div>
                      <div className="text-xs">{store.store}</div>
                      <div className="text-xs">R{store.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Savings Tips */}
        <Card className="p-4 border-2 border-secondary/30 bg-secondary/5">
          <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
            💡 Money-Saving Tips
          </h4>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li className="flex gap-2">
              <span className="text-secondary font-bold">•</span>
              <span>
                <strong>Personal Care:</strong> Save up to R{MOCK_CATEGORY_PRICES['Personal Care'].savings.toFixed(2)} by shopping at{' '}
                {MOCK_CATEGORY_PRICES['Personal Care'].cheapestStore}
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-secondary font-bold">•</span>
              <span>
                <strong>Household Essentials:</strong> Compare prices across stores - price differences can be up to R
                {MOCK_CATEGORY_PRICES['Household'].priceRange.toFixed(2)}
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-secondary font-bold">•</span>
              <span>
                <strong>Bundle Strategy:</strong> Create custom bundles and shop at the store with the best overall prices for your bundle
              </span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
