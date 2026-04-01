import { TrendingDown, Clock, MapPin } from 'lucide-react';

interface ModernDealOfTheDayProps {
  productName: string;
  image?: string;
  price: number;
  originalPrice: number;
  store: string;
  discount: number;
  timeRemaining?: string;
}

export function ModernDealOfTheDay({
  productName,
  image,
  price,
  originalPrice,
  store,
  discount,
  timeRemaining = '2 hours 30 mins',
}: ModernDealOfTheDayProps) {
  const savings = originalPrice - price;

  return (
    <div className="container py-4 sm:py-6">
      <div className="relative overflow-hidden rounded-3xl shadow-premium">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-accent opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10" />

        {/* Content */}
        <div className="relative p-4 sm:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          {/* Left - Product Image */}
          <div className="w-full sm:w-1/3 flex-shrink-0">
            {image ? (
              <img
                src={image}
                alt={productName}
                className="w-full h-auto max-h-64 object-contain drop-shadow-lg"
              />
            ) : (
              <div className="w-full h-64 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-white/60 text-sm">No image</span>
              </div>
            )}
          </div>

          {/* Right - Deal Details */}
          <div className="w-full sm:w-2/3 text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-3 text-sm font-semibold">
              <TrendingDown className="w-4 h-4" />
              Deal of the Day
            </div>

            {/* Product Name */}
            <h2 className="text-2xl sm:text-4xl font-bold mb-2 leading-tight">{productName}</h2>

            {/* Store */}
            <div className="flex items-center gap-2 mb-4 text-white/90">
              <MapPin className="w-4 h-4" />
              <span className="text-sm sm:text-base">{store}</span>
            </div>

            {/* Price Section */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl sm:text-5xl font-bold">R{price.toFixed(2)}</span>
                <span className="text-lg sm:text-2xl line-through opacity-75">
                  R{originalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm opacity-90">You save</p>
                  <p className="text-xl sm:text-2xl font-bold">R{savings.toFixed(2)}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <p className="text-3xl sm:text-4xl font-bold">{discount}%</p>
                  <p className="text-xs opacity-90">OFF</p>
                </div>
              </div>
            </div>

            {/* Time Remaining */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl w-fit mb-4">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">{timeRemaining}</span>
            </div>

            {/* CTA Button */}
            <button className="w-full sm:w-auto bg-white text-secondary hover:bg-gray-100 font-bold py-3 px-8 rounded-xl transition-all duration-200 active:scale-95 shadow-lg">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
