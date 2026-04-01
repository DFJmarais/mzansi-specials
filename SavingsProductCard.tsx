import { ShoppingCart, Zap, Clock } from 'lucide-react';
import { useState } from 'react';

interface SavingsProductCardProps {
  id: string;
  name: string;
  image?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  store: string;
  isHotDeal?: boolean;
  isLimitedOffer?: boolean;
  timeLeft?: string;
  savings?: number;
}

export function SavingsProductCard({
  id,
  name,
  image,
  price,
  originalPrice,
  discount,
  store,
  isHotDeal,
  isLimitedOffer,
  timeLeft,
  savings,
}: SavingsProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);

  const discountPercent = discount || (originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);
  const savingsAmount = savings || (originalPrice ? originalPrice - price : 0);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      {/* Image Container */}
      <div className="relative bg-gray-100 aspect-square overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span>No image</span>
          </div>
        )}

        {/* Urgency Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {isHotDeal && (
            <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold animate-pulse">
              <Zap size={14} />
              HOT DEAL
            </div>
          )}
          {isLimitedOffer && (
            <div className="flex items-center gap-1 bg-yellow-500 text-gray-900 px-2 py-1 rounded-md text-xs font-bold">
              <Clock size={14} />
              LIMITED
            </div>
          )}
        </div>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
            -{discountPercent}%
          </div>
        )}

        {/* Time Left Badge */}
        {timeLeft && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold">
            {timeLeft}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-full">
        {/* Store Name */}
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          {store}
        </p>

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-3 flex-grow">
          {name}
        </h3>

        {/* Price Section */}
        <div className="mb-3">
          {/* Main Price - Bold & Large */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-green-600">
              R{price.toFixed(2)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-400 line-through">
                R{originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Savings Badge */}
          {savingsAmount > 0 && (
            <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-semibold border border-green-200">
              💰 Save R{savingsAmount.toFixed(2)}
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => setIsAdded(!isAdded)}
          className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm ${
            isAdded
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
          }`}
        >
          <ShoppingCart size={16} />
          {isAdded ? 'Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
