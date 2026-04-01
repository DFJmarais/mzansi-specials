import { useEffect, useState } from 'react';
import { MapPin, Navigation, Filter, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

interface StoreWithDeal {
  id: number;
  name: string;
  distance: number;
  deals: number;
  bestDeal: string;
  bestPrice: number;
  originalPrice: number;
  discount: number;
  openNow: boolean;
  rating: number;
}

export const DealsNearMe = () => {
  const [storesWithDeals, setStoresWithDeals] = useState<StoreWithDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRadius, setSelectedRadius] = useState(5); // km

  // Fetch live products with prices
  const { data: productsData } = trpc.products.getAllWithPrices.useQuery();

  // Process live data into stores with deals
  useEffect(() => {
    if (!productsData || productsData.length === 0) {
      setLoading(false);
      return;
    }

    // Group prices by store
    const storeMap = new Map<string, { deals: number; bestDeal: string; bestPrice: number; originalPrice: number; discount: number }>();

    productsData.forEach((product) => {
      if (product.prices && product.prices.length > 0) {
        product.prices.forEach((price) => {
          if (!storeMap.has(price.storeName)) {
            storeMap.set(price.storeName, {
              deals: 0,
              bestDeal: product.name,
              bestPrice: price.price,
              originalPrice: price.originalPrice || price.price,
              discount: price.discount || 0,
            });
          }

          const storeData = storeMap.get(price.storeName)!;
          storeData.deals++;

          // Update best deal if this has better discount
          if (price.originalPrice && price.originalPrice > price.price) {
            const discount = Math.round(
              ((price.originalPrice - price.price) / price.originalPrice) * 100
            );
            if (discount > storeData.discount) {
              storeData.bestDeal = product.name;
              storeData.bestPrice = price.price;
              storeData.originalPrice = price.originalPrice;
              storeData.discount = discount;
            }
          }
        });
      }
    });

    // Convert to store array with mock locations (in real app, would use geolocation)
    const stores: StoreWithDeal[] = Array.from(storeMap.entries()).map((entry, index) => ({
      id: index + 1,
      name: `${entry[0]} - ${['Sandton', 'Rosebank', 'Bryanston', 'Fourways', 'Sandton City'][index % 5]}`,
      distance: 2 + (index * 1.5),
      deals: entry[1].deals,
      bestDeal: entry[1].bestDeal,
      bestPrice: entry[1].bestPrice,
      originalPrice: entry[1].originalPrice,
      discount: entry[1].discount,
      openNow: index % 3 !== 0, // Mock open status
      rating: 4.5 + (Math.random() * 0.4),
    }));

    // Sort by distance and take top 5
    const nearestStores = stores
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);

    setStoresWithDeals(nearestStores);
    setLoading(false);
  }, [productsData]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Deals Near You</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {storesWithDeals.length} stores with amazing deals nearby
          </p>
        </div>
        <Button variant="outline" size="icon" className="hidden sm:flex">
          <Filter className="w-5 h-5" />
        </Button>
      </div>

      {/* Radius Filter */}
      <div className="flex gap-2 flex-wrap">
        {[2, 5, 10, 15].map((radius) => (
          <Badge
            key={radius}
            variant={selectedRadius === radius ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedRadius(radius)}
          >
            {radius}km
          </Badge>
        ))}
      </div>

      {/* Stores List */}
      <div className="space-y-3">
        {storesWithDeals.length === 0 ? (
          <Card className="p-6 text-center">
            <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No stores with deals found nearby.</p>
          </Card>
        ) : (
          storesWithDeals.map((store) => (
            <Card
              key={store.id}
              className="p-4 hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary"
            >
              <div className="space-y-3">
                {/* Store Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-lg">{store.name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{store.distance.toFixed(1)} km away</span>
                      {store.openNow && (
                        <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                          Open Now
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <span className="text-yellow-500">★</span>
                      <span className="font-bold text-foreground">{store.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{store.deals} deals</p>
                  </div>
                </div>

                {/* Best Deal */}
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-3 border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">Best Deal Today</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{store.bestDeal}</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-lg font-bold text-secondary">R{(store.bestPrice / 100).toFixed(2)}</span>
                        {store.originalPrice > store.bestPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            R{(store.originalPrice / 100).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    {store.discount > 0 && (
                      <Badge className="bg-accent text-white text-sm">
                        {store.discount}% OFF
                      </Badge>
                    )}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-2">
                  <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                    View Deals
                  </Button>
                  <Button variant="outline" size="icon" className="flex-1">
                    <Navigation className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Directions</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Smart Shopping Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 p-4">
        <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
          💡 Smart Shopping Tips
        </h4>
        <ul className="space-y-1 text-sm text-foreground/80">
          <li>• Real-time deals update throughout the day - check back often</li>
          <li>• Combine multiple deals to maximize your savings</li>
          <li>• Use our AI optimizer to find the best store combinations</li>
          <li>• Check store hours and real-time stock availability in-app</li>
        </ul>
      </Card>
    </div>
  );
};
