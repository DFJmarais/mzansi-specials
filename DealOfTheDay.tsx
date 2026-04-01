import { useState, useEffect } from 'react';
import { Flame, Clock, TrendingDown, Heart, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CustomerReviews } from './CustomerReviews';
import { SimilarDealsCarousel } from './SimilarDealsCarousel';
import { trpc } from '@/lib/trpc';

interface DealOfDay {
  id: number;
  product: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount: number;
  store: string;
  savings: number;
  timeLeft: string;
  description: string;
  category: string;
  verified: boolean;
  verifiedAt?: Date;
}

export const DealOfTheDay = () => {
  const [timeLeft, setTimeLeft] = useState('23:59:59');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [deal, setDeal] = useState<DealOfDay | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all products
  const { data: productsData } = trpc.products.getAllWithPrices.useQuery();

  // Find best deal from live data
  useEffect(() => {
    if (!productsData || productsData.length === 0) {
      setLoading(false);
      return;
    }

    // Find product with best verified price (lowest price)
    let bestDeal: DealOfDay | null = null;
    let lowestPrice = Infinity;

    productsData.forEach((product: any) => {
      if (product.prices && product.prices.length > 0) {
        // Find lowest price for this product
        const lowestPriceInfo = product.prices.reduce((min: any, p: any) => 
          p.price < min.price ? p : min
        );

        // Only consider prices that are verified and realistic
        const priceInRands = lowestPriceInfo.price / 100;
        const isRealistic = priceInRands >= 0.5 && priceInRands <= 500;
        const isVerified = lowestPriceInfo.verificationStatus === 'VERIFIED' || 
                          lowestPriceInfo.trustScore >= 80;

        if (isRealistic && isVerified && lowestPriceInfo.price < lowestPrice) {
          lowestPrice = lowestPriceInfo.price;

          // Calculate discount if available
          let discount = 0;
          let savings = 0;
          if (lowestPriceInfo.originalPrice && lowestPriceInfo.originalPrice > lowestPriceInfo.price) {
            discount = Math.round(
              ((lowestPriceInfo.originalPrice - lowestPriceInfo.price) / lowestPriceInfo.originalPrice) * 100
            );
            savings = lowestPriceInfo.originalPrice - lowestPriceInfo.price;
          }

          bestDeal = {
            id: product.id,
            product: product.name,
            image: product.imageUrl || '📦',
            price: lowestPriceInfo.price,
            originalPrice: lowestPriceInfo.originalPrice,
            discount: Math.max(discount, 5), // At least 5% for display
            store: lowestPriceInfo.storeName,
            savings: Math.max(savings, 0),
            timeLeft: '23:59:59',
            description: product.description || `Fresh ${product.name} - Limited time offer!`,
            category: product.category,
            verified: isVerified,
            verifiedAt: lowestPriceInfo.lastVerified ? new Date(lowestPriceInfo.lastVerified) : undefined,
          };
        }
      }
    });

    setDeal(bestDeal || deal);
    setLoading(false);
  }, [productsData?.length]);

  // Countdown timer
  useEffect(() => {
    // Set initial time
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);

    const interval = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Add urgency animation when time is running out
  const isUrgent = timeLeft && timeLeft.split(':')[0] === '00'; // Less than 1 hour

  // Check if price was verified recently (within last 24 hours)
  const isRecentlyVerified = deal?.verifiedAt ? 
    (Date.now() - new Date(deal.verifiedAt).getTime()) < 24 * 60 * 60 * 1000 : false;

  if (loading) {
    return (
      <div className="w-full space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-50 h-64 animate-pulse" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="w-full space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 p-8">
          <div className="text-center text-white">
            <p className="text-xl font-bold">Loading today's best deal...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Main Deal Banner */}
      <div className={`relative overflow-hidden rounded-2xl ${
        isUrgent ? 'animate-pulse ring-2 ring-red-500 ring-opacity-50' : ''
      }`}>
        {/* Animated Background - SA Flag Colors */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#E03C31] via-[#FFFFFF] via-[#002395] to-[#007A5E] opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFB612] to-[#000000] opacity-30" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-2 sm:p-3 md:p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 items-center">
            {/* Left: Deal Info */}
            <div className="space-y-3">
              {/* Badge */}
              <div className="flex items-center gap-2">
                <Badge className="bg-white text-red-600 hover:bg-white/90 flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  DEAL OF THE DAY
                </Badge>
                {deal.verified && (
                  <Badge className="bg-green-400 text-white flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified Price
                  </Badge>
                )}
              </div>

              {/* Product Name */}
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                  {deal.product}
                </h2>
                <p className="text-sm sm:text-base text-white/80 mt-2 line-clamp-2">
                  {deal.description}
                </p>
              </div>

              {/* Price Section */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2 sm:gap-3">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                    R{(deal.price / 100).toFixed(2)}
                  </span>
                  {deal.originalPrice && deal.originalPrice > deal.price && (
                    <span className="text-lg sm:text-xl text-white/60 line-through">
                      R{(deal.originalPrice / 100).toFixed(2)}
                    </span>
                  )}
                </div>
                {deal.savings > 0 && (
                  <p className="text-sm sm:text-base font-semibold text-white/90">
                    💰 Save R{(deal.savings / 100).toFixed(2)}
                  </p>
                )}
              </div>

              {/* Store Info */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 sm:p-3 w-fit">
                <p className="text-xs sm:text-sm text-white/80">Available at</p>
                <p className="text-lg sm:text-xl font-bold text-white">{deal.store}</p>
              </div>

              {/* Verification Status */}
              {deal.verified && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 w-fit text-xs sm:text-sm text-white/90 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {isRecentlyVerified ? '✓ Verified Today' : '⚠️ Price Last Updated'}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-white text-red-600 hover:bg-white/90 font-bold text-sm sm:text-base h-10 sm:h-12">
                  Shop Now
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="border-white text-white hover:bg-white/20 h-10 sm:h-12 w-10 sm:w-12"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Right: Visual & Timer */}
            <div className="flex flex-col items-center justify-center space-y-3 md:space-y-4">
              {/* Product Image */}
              <div className="text-6xl sm:text-7xl md:text-8xl">
                {typeof deal.image === 'string' && deal.image.startsWith('http') ? (
                  <img 
                    src={deal.image} 
                    alt={deal.product}
                    className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover rounded-xl"
                  />
                ) : (
                  deal.image
                )}
              </div>

              {/* Discount Badge */}
              <div className="bg-white rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-red-600">{deal.discount}%</p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-700">OFF</p>
                </div>
              </div>

              {/* Timer */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span className="text-sm sm:text-base font-mono font-bold text-white">
                  {timeLeft}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Card className="p-3 sm:p-4 text-center bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <p className="text-2xl sm:text-3xl font-bold text-red-600">{deal.discount}%</p>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Biggest discount today</p>
        </Card>
        <Card className="p-3 sm:p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <p className="text-2xl sm:text-3xl font-bold text-green-600">R{(deal.savings / 100).toFixed(2)}</p>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">You save on this deal</p>
        </Card>
        <Card className="p-3 sm:p-4 text-center bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <p className="text-lg sm:text-xl font-bold text-blue-600">
            {deal.verified ? '✓ Verified' : 'Limited'}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {deal.verified ? 'Real-time price' : 'Stock available'}
          </p>
        </Card>
      </div>

      {/* Customer Reviews */}
      <CustomerReviews />

      {/* Similar Deals */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Similar Deals</h3>
        <SimilarDealsCarousel productId={deal.id} />
      </div>
    </div>
  );
};
