import { useState, useMemo } from 'react';
import { Zap, TrendingDown, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { COMPLETE_PRODUCTS } from '@/data/products-complete';

interface Deal {
  productId: number;
  productName: string;
  category: string;
  bestPrice: number;
  worstPrice: number;
  discountPercentage: number;
  bestStore: string;
  savings: number;
}

export const DealFinder = () => {
  const [filterThreshold, setFilterThreshold] = useState(15);

  const deals = useMemo(() => {
    return COMPLETE_PRODUCTS.map((product: any) => {
      const prices = product.prices.map((p: any) => p.price);
      const bestPrice = Math.min(...prices);
      const worstPrice = Math.max(...prices);
      const discountPercentage = Math.round(((worstPrice - bestPrice) / worstPrice) * 100);
      const bestStore = product.prices.find((p: any) => p.price === bestPrice)?.store || '';
      const savings = worstPrice - bestPrice;

      return {
        productId: product.id,
        productName: product.name,
        category: product.category,
        bestPrice,
        worstPrice,
        discountPercentage,
        bestStore,
        savings,
      };
    })
      .filter((deal: Deal) => deal.discountPercentage >= filterThreshold)
      .sort((a: Deal, b: Deal) => b.discountPercentage - a.discountPercentage);
  }, [filterThreshold]);

    const hotDeals = deals.filter((d: Deal) => d.discountPercentage >= 25).slice(0, 3);

  return (
    <div className="w-full space-y-6">
      {hotDeals.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-accent/20 to-secondary/20 border-2 border-accent/50">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-accent animate-pulse" />
            <h3 className="text-xl font-bold text-foreground">🔥 Hot Deals</h3>
            <Badge className="bg-accent text-white ml-auto">{hotDeals.length} Super Deals</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hotDeals.map((deal: Deal) => (
              <Card
                key={deal.productId}
                className="p-4 bg-white border-2 border-accent/30 hover:border-accent/70 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{deal.productName}</h4>
                      <p className="text-xs text-muted-foreground">{deal.category}</p>
                    </div>
                    <Badge className="bg-accent text-white text-xs font-bold">
                      -{deal.discountPercentage}%
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Best Price:</span>
                      <span className="font-bold text-secondary text-lg">
                        R{deal.bestPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">At:</span>
                      <span className="text-xs font-semibold text-foreground">{deal.bestStore}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-accent font-semibold">💰 Save R{deal.savings.toFixed(2)}</p>
                  </div>

                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Add to Cart
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-secondary" />
            <h3 className="text-lg font-bold text-foreground">All Deals</h3>
            <Badge variant="outline">{deals.length} deals</Badge>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground">Min Discount:</label>
            <select
              value={filterThreshold}
              onChange={(e) => setFilterThreshold(Number(e.target.value))}
              className="px-3 py-1 text-xs border border-border rounded-md bg-background text-foreground"
            >
              <option value={5}>5%+</option>
              <option value={10}>10%+</option>
              <option value={15}>15%+</option>
              <option value={20}>20%+</option>
              <option value={25}>25%+</option>
            </select>
          </div>
        </div>

        {deals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deals.map((deal: Deal) => (
              <Card
                key={deal.productId}
                className="p-4 hover:shadow-md transition-all border-2 border-primary/20 hover:border-primary/50"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{deal.productName}</h4>
                      <p className="text-xs text-muted-foreground">{deal.category}</p>
                    </div>
                    <Badge className="bg-secondary/20 text-secondary border-0">
                      -{deal.discountPercentage}%
                    </Badge>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Best:</span>
                      <span className="font-bold text-secondary">R{deal.bestPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Most Expensive:</span>
                      <span className="text-xs line-through text-muted-foreground">
                        R{deal.worstPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-xs font-semibold text-accent">Save:</span>
                      <span className="font-bold text-accent">R{deal.savings.toFixed(2)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Best at: <span className="font-semibold text-foreground">{deal.bestStore}</span>
                  </p>

                  <Button variant="outline" size="sm" className="w-full text-xs">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center bg-muted/50">
            <Award className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">
              No deals found with {filterThreshold}%+ discount. Try lowering the threshold.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
