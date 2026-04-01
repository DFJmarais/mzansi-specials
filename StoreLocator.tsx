import { useState } from 'react';
import { MapPin, Navigation, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGeolocation } from '@/hooks/useGeolocation';
import { findNearestStores, STORE_LOCATIONS, StoreLocation } from '@/data/store-locations';

interface StoreLocatorProps {
  productName?: string;
  onStoreSelect?: (store: StoreLocation) => void;
}

export const StoreLocator = ({ productName, onStoreSelect }: StoreLocatorProps) => {
  const { coordinates, loading, error, requestLocation } = useGeolocation();
  const [nearestStores, setNearestStores] = useState<(StoreLocation & { distance: number })[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleFindStores = () => {
    requestLocation();
    setShowResults(true);
  };

  // Update nearest stores when coordinates change
  if (coordinates && showResults && nearestStores.length === 0) {
    const stores = findNearestStores(coordinates.latitude, coordinates.longitude, undefined, 6);
    setNearestStores(stores);
  }

  const handleStoreClick = (store: StoreLocation) => {
    if (onStoreSelect) {
      onStoreSelect(store);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg text-foreground">Find Nearest Store</h3>
        </div>
      </div>

      {/* Location Request Button */}
      {!coordinates && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                {productName ? `Find ${productName} near you` : 'Find stores near you'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Enable location access to see the closest stores with the best prices
              </p>
            </div>
            <Button
              onClick={handleFindStores}
              disabled={loading}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Locating...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  Enable Location
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-900">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFindStores}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Nearest Stores Results */}
      {coordinates && nearestStores.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Showing {nearestStores.length} nearest stores
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowResults(false);
                setNearestStores([]);
              }}
            >
              Clear
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nearestStores.map((store) => (
              <Card
                key={store.id}
                className="p-4 hover:shadow-md transition-all cursor-pointer border-2 border-primary/20 hover:border-primary/50"
                onClick={() => handleStoreClick(store)}
              >
                <div className="space-y-2">
                  {/* Store Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{store.name}</h4>
                      <p className="text-xs text-muted-foreground">{store.city}</p>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-0">
                      {store.store}
                    </Badge>
                  </div>

                  {/* Distance */}
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span className="font-semibold text-secondary">
                      {store.distance.toFixed(1)} km away
                    </span>
                  </div>

                  {/* Address */}
                  <p className="text-xs text-muted-foreground">{store.address}</p>

                  {/* Contact Info */}
                  {store.phone && (
                    <p className="text-xs text-muted-foreground">
                      📞 {store.phone}
                    </p>
                  )}

                  {/* Hours */}
                  {store.hours && (
                    <p className="text-xs text-muted-foreground">
                      🕐 {store.hours}
                    </p>
                  )}

                  {/* View Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Open Google Maps
                      window.open(
                        `https://www.google.com/maps/search/${encodeURIComponent(
                          store.name
                        )}/@${store.latitude},${store.longitude},15z`,
                        '_blank'
                      );
                    }}
                  >
                    View on Map
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="p-6 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader className="w-6 h-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Getting your location...</p>
          </div>
        </Card>
      )}

      {/* All Stores Fallback */}
      {!coordinates && !loading && !error && (
        <Card className="p-4 bg-muted/50">
          <p className="text-xs text-muted-foreground">
            💡 Tip: Enable location to see stores sorted by distance. We have stores in Johannesburg, Cape Town, Durban, Pretoria, Bloemfontein, and more.
          </p>
        </Card>
      )}
    </div>
  );
};
