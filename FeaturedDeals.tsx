import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

interface Deal {
  id: number;
  product: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount: number;
  store: string;
  category: string;
  badge: 'hot' | 'flash' | 'limited' | 'trending';
}

export const FeaturedDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch live products with prices
  const { data: productsData } = trpc.products.getAllWithPrices.useQuery();

  // Process live data into featured deals
  useEffect(() => {
    if (!productsData || productsData.length === 0) {
      setLoading(false);
      return;
    }

    const featuredDeals: Deal[] = [];

    // Get products with discounts
    productsData.forEach((product) => {
      if (product.prices && product.prices.length > 0) {
        product.prices.forEach((price, index) => {
          if (price.originalPrice && price.discount && index < 2) {
            // Only take first 2 prices per product to avoid too many deals
            const discount = Math.round(
              ((price.originalPrice - price.price) / price.originalPrice) * 100
            );

            if (discount > 0) {
              // Determine badge based on discount
              let badge: 'hot' | 'flash' | 'limited' | 'trending' = 'trending';
              if (discount > 30) badge = 'hot';
              else if (discount > 20) badge = 'flash';
              else if (discount > 10) badge = 'limited';

              featuredDeals.push({
                id: product.id,
                product: product.name,
                image: product.imageUrl || '📦',
                price: price.price,
                originalPrice: price.originalPrice,
                discount: discount,
                store: price.storeName,
                category: product.category,
                badge: badge,
              });
            }
          }
        });
      }
    });

    // Sort by discount and take top 6
    const topDeals = featuredDeals
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 6);

    setDeals(topDeals);
    setLoading(false);
  }, [productsData]);

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'hot':
        return 'bg-red-500 text-white';
      case 'flash':
        return 'bg-yellow-500 text-black';
      case 'limited':
        return 'bg-orange-500 text-white';
      case 'trending':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'hot':
        return '🔥';
      case 'flash':
        return '⚡';
      case 'limited':
        return '⏰';
      case 'trending':
        return '📈';
      default:
        return '✨';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No featured deals available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Featured Deals</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {deals.length} amazing deals available now
          </p>
        </div>
        <Button variant="outline" className="hidden sm:flex">
          View All Deals
        </Button>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deals.map((deal) => (
          <Card
            key={`${deal.id}-${deal.store}`}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-primary/20"
          >
            {/* Card Header with Badge */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b-2 border-primary/20">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-foreground text-sm line-clamp-2">{deal.product}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{deal.category}</p>
                </div>
                <Badge className={`${getBadgeColor(deal.badge)} whitespace-nowrap ml-2 flex items-center gap-1`}>
                  <span>{getBadgeIcon(deal.badge)}</span>
                  <span className="hidden sm:inline">{deal.discount}%</span>
                </Badge>
              </div>
            </div>

            {/* Product Image/Icon */}
            <div className="bg-gradient-to-b from-gray-50 to-white p-4 flex justify-center min-h-[120px]">
              {typeof deal.image === 'string' && deal.image.startsWith('http') ? (
                <img
                  src={deal.image}
                  alt={deal.product}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ) : (
                <div className="text-5xl">{deal.image}</div>
              )}
            </div>

            {/* Price Section */}
            <div className="p-4 bg-secondary/5 border-b-2 border-secondary/20">
              <p className="text-xs text-muted-foreground mb-1">Deal Price</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-secondary">R{(deal.price / 100).toFixed(2)}</span>
                {deal.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    R{(deal.originalPrice / 100).toFixed(2)}
                  </span>
                )}
              </div>
              {deal.originalPrice && (
                <p className="text-xs text-accent font-semibold mt-2">
                  Save R{((deal.originalPrice - deal.price) / 100).toFixed(2)}
                </p>
              )}
            </div>

            {/* Store & CTA */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Available at</span>
                <Badge variant="secondary" className="text-xs">{deal.store}</Badge>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                View Deal
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* View All Button - Mobile */}
      <Button variant="outline" className="w-full sm:hidden">
        View All Deals
      </Button>
    </div>
  );
};
