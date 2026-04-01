import { Zap, TrendingDown } from 'lucide-react';

interface FeaturedDeal {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  store: string;
}

interface HeroSectionProps {
  featuredDeals?: FeaturedDeal[];
}

export function HeroSection({ featuredDeals = [] }: HeroSectionProps) {
  // Default featured deals if none provided
  const deals = featuredDeals.length > 0 ? featuredDeals : [
    {
      id: '1',
      name: 'Clover Full Cream Milk 1L',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop',
      price: 18.99,
      originalPrice: 22.99,
      store: 'Spar',
    },
    {
      id: '2',
      name: 'Free Range Eggs Dozen',
      image: 'https://images.unsplash.com/photo-1582722872981-82a72fc9a206?w=400&h=400&fit=crop',
      price: 24.99,
      originalPrice: 34.99,
      store: 'Pick n Pay',
    },
    {
      id: '3',
      name: 'Beef Steak 500g',
      image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&h=400&fit=crop',
      price: 69.99,
      originalPrice: 99.99,
      store: 'Checkers',
    },
  ];

  return (
    <div className="bg-gradient-to-b from-red-50 via-orange-50 to-white">
      {/* Hero Title Section */}
      <div className="px-4 md:px-0 py-6 md:py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Zap className="w-8 h-8 md:w-10 md:h-10 text-red-500 fill-red-500 animate-pulse" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight">
            SAVE BIG TODAY
          </h1>
          <Zap className="w-8 h-8 md:w-10 md:h-10 text-red-500 fill-red-500 animate-pulse" />
        </div>
        <p className="text-lg md:text-xl text-gray-600 font-semibold mb-2">
          Best grocery deals near you right now
        </p>
        <div className="flex items-center justify-center gap-2 text-sm md:text-base text-green-600 font-bold">
          <TrendingDown className="w-5 h-5" />
          <span>Save up to 50% on selected items</span>
        </div>
      </div>

      {/* Featured Deals Grid */}
      <div className="px-4 md:px-0 pb-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {deals.slice(0, 3).map((deal) => {
              const savings = deal.originalPrice - deal.price;
              const discountPercent = Math.round(((savings) / deal.originalPrice) * 100);

              return (
                <div
                  key={deal.id}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-orange-200"
                >
                  {/* Image Container */}
                  <div className="relative h-48 md:h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <img
                      src={deal.image}
                      alt={deal.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Savings Badge - Top Right */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-2 rounded-full font-black text-sm md:text-base shadow-lg">
                      -{discountPercent}%
                    </div>

                    {/* Hot Deal Badge - Top Left */}
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-xs md:text-sm flex items-center gap-1 animate-pulse shadow-lg">
                      <Zap className="w-4 h-4 fill-white" />
                      HOT DEAL
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6">
                    {/* Store Name */}
                    <p className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">
                      {deal.store}
                    </p>

                    {/* Product Name */}
                    <h3 className="text-sm md:text-base font-bold text-gray-900 line-clamp-2 mb-4">
                      {deal.name}
                    </h3>

                    {/* Price Section - DOMINANT */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2 mb-2">
                        {/* Main Price - HUGE */}
                        <span className="text-4xl md:text-5xl font-black text-green-600 leading-none">
                          R{deal.price.toFixed(2)}
                        </span>
                        {/* Original Price */}
                        <span className="text-lg md:text-xl text-gray-400 line-through font-semibold">
                          R{deal.originalPrice.toFixed(2)}
                        </span>
                      </div>

                      {/* Savings Amount - Bold Badge */}
                      <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg font-black text-sm md:text-base border-2 border-green-500">
                        💰 Save R{savings.toFixed(2)}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black py-3 md:py-4 rounded-xl transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl text-base md:text-lg">
                      ADD TO CART
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
