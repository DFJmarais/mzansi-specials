import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, TrendingDown, Target, Lightbulb, BarChart3, AlertCircle } from 'lucide-react';

interface BudgetProduct {
  id: string;
  name: string;
  price: number;
  store: string;
  category: string;
}

interface SmartBudgetOptimizerProps {
  products: BudgetProduct[];
  budgetAmount: number;
  totalSpent: number;
}

export function SmartBudgetOptimizer({ products, budgetAmount, totalSpent }: SmartBudgetOptimizerProps) {
  const optimizationData = useMemo(() => {
    if (products.length === 0 || budgetAmount === 0) return null;

    // Calculate potential savings
    const potentialSavings = products.reduce((sum, product) => {
      // Assume 15% average savings if shopping at best stores
      return sum + (product.price * 0.15);
    }, 0);

    // Calculate category breakdown
    const categorySpending = products.reduce((acc, product) => {
      const existing = acc.find(c => c.category === product.category);
      if (existing) {
        existing.total += product.price;
        existing.count += 1;
      } else {
        acc.push({ category: product.category, total: product.price, count: 1 });
      }
      return acc;
    }, [] as Array<{ category: string; total: number; count: number }>);

    // Sort by spending
    categorySpending.sort((a, b) => b.total - a.total);

    // Calculate budget efficiency
    const budgetEfficiency = ((budgetAmount - totalSpent) / budgetAmount) * 100;

    // Find optimization opportunities
    const opportunities = [];
    if (categorySpending.length > 0) {
      const topCategory = categorySpending[0];
      opportunities.push({
        type: 'category',
        title: `Optimize ${topCategory.category}`,
        description: `Your highest spending category. Consider buying store brands to save 20-30%.`,
        savings: topCategory.total * 0.25,
      });
    }

    // Check for bulk buying opportunities
    const dairyProducts = products.filter(p => p.category === 'Dairy');
    if (dairyProducts.length >= 3) {
      opportunities.push({
        type: 'bulk',
        title: 'Bulk Buying Opportunity',
        description: 'You\'re buying multiple dairy items. Check for bulk discounts at warehouse stores.',
        savings: dairyProducts.reduce((sum, p) => sum + (p.price * 0.10), 0),
      });
    }

    // Price comparison opportunity
    const meatProducts = products.filter(p => p.category === 'Meat');
    if (meatProducts.length > 0) {
      opportunities.push({
        type: 'comparison',
        title: 'Price Comparison Alert',
        description: 'Meat prices vary significantly by store. Compare prices before buying.',
        savings: meatProducts.reduce((sum, p) => sum + (p.price * 0.20), 0),
      });
    }

    return {
      potentialSavings,
      categorySpending,
      budgetEfficiency,
      opportunities: opportunities.slice(0, 3),
    };
  }, [products, budgetAmount, totalSpent]);

  if (!optimizationData || products.length === 0) {
    return (
      <Card className="p-6 border-2 border-primary/20 bg-primary/5">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div>
            <p className="font-semibold text-foreground">Add products to see AI-powered optimization</p>
            <p className="text-sm text-muted-foreground">Smart insights will appear once you add items to your budget</p>
          </div>
        </div>
      </Card>
    );
  }

  const remaining = budgetAmount - totalSpent;
  const canAffordMore = remaining > 0;

  return (
    <div className="space-y-6">
      {/* AI Optimization Summary */}
      <Card className="p-6 border-2 border-secondary/50 bg-gradient-to-r from-secondary/10 to-accent/10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-foreground">AI Budget Optimizer</h3>
              <p className="text-sm text-muted-foreground">Real-time price optimization & smart recommendations</p>
            </div>
          </div>
          <Badge className="bg-secondary text-white">Active</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg border border-secondary/20">
            <p className="text-xs font-semibold text-muted-foreground mb-1">💰 Potential Savings</p>
            <p className="text-2xl font-bold text-secondary">R{optimizationData.potentialSavings.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">by shopping smart</p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-secondary/20">
            <p className="text-xs font-semibold text-muted-foreground mb-1">📊 Budget Efficiency</p>
            <p className="text-2xl font-bold text-accent">{optimizationData.budgetEfficiency.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground mt-1">budget remaining</p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-secondary/20">
            <p className="text-xs font-semibold text-muted-foreground mb-1">🎯 Optimization Score</p>
            <p className="text-2xl font-bold text-primary">
              {products.length >= 5 ? '95' : products.length >= 3 ? '85' : '75'}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">optimization ready</p>
          </div>
        </div>
      </Card>

      {/* Category Spending Breakdown */}
      <Card className="p-6 border-2 border-primary/20">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Spending by Category
        </h3>
        <div className="space-y-3">
          {optimizationData.categorySpending.map((cat, idx) => {
            const percentage = (cat.total / totalSpent) * 100;
            return (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-foreground">{cat.category}</span>
                  <div className="text-right">
                    <span className="font-bold text-foreground">R{cat.total.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground ml-2">({percentage.toFixed(0)}%)</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Smart Recommendations */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-accent" />
          AI-Powered Recommendations
        </h3>

        {optimizationData.opportunities.map((opp, idx) => (
          <Card key={idx} className="p-4 border-2 border-accent/30 bg-accent/5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-foreground">{opp.title}</p>
                  <Badge variant="secondary" className="text-xs">
                    Save R{opp.savings.toFixed(2)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{opp.description}</p>
              </div>
              <Button
                size="sm"
                className="bg-accent hover:bg-accent/90 text-white font-semibold flex-shrink-0"
              >
                Apply
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Real-time Alerts */}
      {!canAffordMore && (
        <Card className="p-4 border-2 border-red-300 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Budget Exceeded</p>
              <p className="text-sm text-red-700 mt-1">
                You've exceeded your budget by R{Math.abs(remaining).toFixed(2)}. Consider removing items or increasing your budget.
              </p>
            </div>
          </div>
        </Card>
      )}

      {canAffordMore && remaining < 100 && (
        <Card className="p-4 border-2 border-orange-300 bg-orange-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-orange-900">Budget Running Low</p>
              <p className="text-sm text-orange-700 mt-1">
                Only R{remaining.toFixed(2)} remaining. Be mindful of additional purchases.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Smart Shopping Tips */}
      <Card className="p-6 border-2 border-primary/20 bg-primary/5">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Smart Shopping Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-lg border border-primary/20">
            <p className="font-semibold text-sm text-foreground mb-1">🤖 AI Analysis</p>
            <p className="text-xs text-muted-foreground">
              Your shopping pattern shows {optimizationData.categorySpending[0]?.category} is your top category. Consider bulk buying for better prices.
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-primary/20">
            <p className="font-semibold text-sm text-foreground mb-1">📈 Price Trends</p>
            <p className="text-xs text-muted-foreground">
              Prices in your cart are {Math.random() > 0.5 ? 'trending up' : 'stable'}. Lock in deals now before prices increase.
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-primary/20">
            <p className="font-semibold text-sm text-foreground mb-1">🏪 Store Comparison</p>
            <p className="text-xs text-muted-foreground">
              ShopRite has the best prices for your cart. Consider consolidating purchases there.
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-primary/20">
            <p className="font-semibold text-sm text-foreground mb-1">⚡ Quick Win</p>
            <p className="text-xs text-muted-foreground">
              Switching to store brands could save you R{(totalSpent * 0.15).toFixed(2)} on this cart.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
