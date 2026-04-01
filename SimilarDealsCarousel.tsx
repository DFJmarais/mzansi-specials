import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

interface SimilarDeal {
  id: number;
  product: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount: number;
  store: string;
  category: string;
}

interface SimilarDealsCarouselProps {
  productId?: number;
}

export const SimilarDealsCarousel = ({ productId }: SimilarDealsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [similarDeals, setSimilarDeals] = useState<SimilarDeal[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch live products with prices
  const { data: productsData } = trpc.products.getAllWithPrices.useQuery();

  // Find similar deals from live data
  useEffect(() => {
    if (!productsData || productsData.length === 0) {
      setLoading(false);
      return;
    }

    const deals: SimilarDeal[] = [];

    // Get products with discounts (excluding the current product if specified)
    productsData.forEach((product) => {
      if (productId && product.id === productId) return; // Skip current product

      if (product.prices && product.prices.length > 0) {
        product.prices.forEach((price) => {
          if (price.originalPrice && price.price < price.originalPrice) {
            const discount = Math.round(
              ((price.originalPrice - price.price) / price.originalPrice) * 100
            );

            if (discount > 0) {
              deals.push({
                id: product.id,
                product: product.name,
                image: product.imageUrl || '📦',
                price: price.price,
                originalPrice: price.originalPrice,
                discount: discount,
                store: price.storeName,
                category: product.category,
              });
            }
          }
        });
      }
    });

    // Sort by discount and take top 12
    const topDeals = deals
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 12);

    setSimilarDeals(topDeals);
    setCurrentIndex(0);
    setLoading(false);
  }, [productsData, productId]);

  const itemsPerView = 3;
  const maxIndex = Math.max(0, similarDeals.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
  };

  const visibleDeals = similarDeals.slice(currentIndex, currentIndex + itemsPerView);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (similarDeals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No similar deals available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Carousel Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="h-10 w-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
            className="h-10 w-10"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {currentIndex + 1} - {Math.min(currentIndex + itemsPerView, similarDeals.length)} of {similarDeals.length}
        </p>
      </div>

      {/* Carousel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visibleDeals.map((deal) => (
          <Card
            key={`${deal.id}-${deal.store}`}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-primary/20"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-3 border-b border-primary/20">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground text-sm line-clamp-2">{deal.product}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{deal.category}</p>
                </div>
                {deal.discount > 0 && (
                  <Badge className="bg-accent text-white whitespace-nowrap text-xs">
                    {deal.discount}%
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Image */}
            <div className="bg-gradient-to-b from-gray-50 to-white p-3 flex justify-center min-h-[100px]">
              {typeof deal.image === 'string' && deal.image.startsWith('http') ? (
                <img
                  src={deal.image}
                  alt={deal.product}
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <div className="text-4xl">{deal.image}</div>
              )}
            </div>

            {/* Price Section */}
            <div className="p-3 bg-secondary/5 border-b border-secondary/20">
              <p className="text-xs text-muted-foreground mb-1">Price</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-secondary">R{(deal.price / 100).toFixed(2)}</span>
                {deal.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    R{(deal.originalPrice / 100).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Store & CTA */}
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">At</span>
                <Badge variant="secondary" className="text-xs">{deal.store}</Badge>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-8 text-xs">
                View
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-1">
        {Array.from({ length: Math.ceil(similarDeals.length / itemsPerView) }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(Math.min(i * itemsPerView, maxIndex))}
            className={`h-2 rounded-full transition-all ${
              i === Math.floor(currentIndex / itemsPerView)
                ? 'bg-primary w-6'
                : 'bg-primary/30 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
