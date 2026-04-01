import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingDown } from 'lucide-react';
import { useMultiLanguage } from '@/contexts/MultiLanguageContext';

interface LivePrice {
  productId: number;
  productName: string;
  storeName: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  lastUpdated: Date;
}

interface LivePricesDisplayProps {
  selectedCategory?: string;
  selectedStore?: string;
  searchQuery?: string;
}

export function LivePricesDisplay({ 
  selectedCategory = 'All', 
  selectedStore = 'All Stores',
  searchQuery = ''
}: LivePricesDisplayProps) {
  const { t } = useMultiLanguage();
  const [prices, setPrices] = useState<LivePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products with prices
  const { data: productsData, isLoading: productsLoading } = trpc.products.getAllWithPrices.useQuery();

  useEffect(() => {
    if (productsLoading) {
      setLoading(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (!productsData || productsData.length === 0) {
        setPrices([]);
        setLoading(false);
        return;
      }

      // Flatten all prices from products
      const allPrices: LivePrice[] = [];

      for (const product of productsData) {
        if (product.prices && Array.isArray(product.prices)) {
          allPrices.push(
            ...product.prices.map((p: any) => ({
              productId: product.id,
              productName: product.name,
              storeName: p.storeName,
              price: p.price,
              originalPrice: p.originalPrice,
              discount: p.discount,
              lastUpdated: new Date(p.lastUpdated),
            }))
          );
        }
      }

      // Filter by search query
      let filtered = allPrices;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
          p.productName.toLowerCase().includes(query) ||
          p.storeName.toLowerCase().includes(query)
        );
      }

      // Filter by store
      if (selectedStore !== 'All Stores') {
        filtered = filtered.filter(p => p.storeName === selectedStore);
      }

      setPrices(filtered);
      setLoading(false);
    } catch (err) {
      console.error('Error processing prices:', err);
      setError('Failed to load prices');
      setLoading(false);
    }
  }, [productsData, productsLoading, searchQuery, selectedStore]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (prices.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{t('no_prices_found') || 'No prices found'}</p>
      </div>
    );
  }

  // Group prices by product
  const groupedByProduct = prices.reduce((acc, price) => {
    if (!acc[price.productName]) {
      acc[price.productName] = [];
    }
    acc[price.productName].push(price);
    return acc;
  }, {} as Record<string, LivePrice[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedByProduct).map(([productName, productPrices]) => {
        const bestPrice = productPrices.reduce((min, p) => (p.price < min.price ? p : min));
        const worstPrice = productPrices.reduce((max, p) => (p.price > max.price ? p : max));
        const savings = worstPrice.price - bestPrice.price;
        const savingsPercent = ((savings / worstPrice.price) * 100).toFixed(1);

        return (
          <Card key={productName} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-primary/20">
            {/* Product Header */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b-2 border-primary/20">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-foreground text-lg">{productName}</h3>
                  <p className="text-sm text-muted-foreground">{productPrices.length} {t('stores_available') || 'stores available'}</p>
                </div>
                {savings > 0 && (
                  <Badge className="bg-accent text-white">
                    {savingsPercent}% {t('savings') || 'savings'}
                  </Badge>
                )}
              </div>
            </div>

            {/* Best Price Highlight */}
            <div className="p-4 bg-secondary/5 border-b-2 border-secondary/20">
              <p className="text-xs text-muted-foreground mb-1">{t('best_price') || 'Best Price'}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-secondary">R{bestPrice.price.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">{t('at') || 'at'} {bestPrice.storeName}</span>
              </div>
              {savings > 0 && (
                <p className="text-xs text-accent font-semibold mt-2">
                  <TrendingDown className="inline w-3 h-3 mr-1" />
                  {t('save_up_to') || 'Save up to'} R{savings.toFixed(2)}
                </p>
              )}
            </div>

            {/* Price Comparison */}
            <div className="p-4 space-y-3">
              <p className="text-xs font-semibold text-foreground/70 uppercase">{t('prices_at_stores') || 'Prices at stores'}</p>
              {productPrices
                .sort((a, b) => a.price - b.price)
                .map((price) => (
                  <div
                    key={`${price.productId}-${price.storeName}`}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                      price.storeName === bestPrice.storeName
                        ? 'bg-secondary/10 border-2 border-secondary'
                        : 'bg-muted/50 border border-border'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{price.storeName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">R{price.price.toFixed(2)}</span>
                      {price.discount && price.discount > 0 && (
                        <Badge variant="secondary" className="text-xs bg-accent/20 text-accent border-0">
                          {price.discount}% {t('off') || 'OFF'}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Last Updated */}
            <div className="px-4 py-2 bg-muted/30 text-xs text-muted-foreground text-right">
              {t('last_updated') || 'Last updated'}: {new Date(bestPrice.lastUpdated).toLocaleString()}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
