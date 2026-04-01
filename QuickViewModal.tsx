import { useState } from 'react';
import { X, Star, Heart, ShoppingCart, TrendingDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickViewProduct {
  id: number;
  name: string;
  size: string;
  category: string;
  retailer: string;
  price: number;
  originalPrice: number;
  savings: number;
  savingsPercent: number;
  image: string;
  description: string;
  benefits: string[];
  rating: number;
  reviews: number;
  badge: string;
  badgeColor: string;
}

interface QuickViewModalProps {
  product: QuickViewProduct | null;
  isOpen: boolean;
  onClose: () => void;
  allRetailerPrices?: Array<{
    retailer: string;
    price: number;
    originalPrice: number;
    savings: number;
    savingsPercent: number;
  }>;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  allRetailerPrices = [],
}: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!isOpen || !product) return null;

  const bestPrice = allRetailerPrices.length > 0
    ? allRetailerPrices.reduce((min, p) => (p.price < min.price ? p : min))
    : { retailer: product.retailer, price: product.price, savings: product.savings, savingsPercent: product.savingsPercent };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Section */}
            <div>
              <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-square mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.savingsPercent > 0 && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm">
                    SAVE {product.savingsPercent}%
                  </div>
                )}
                <div className={`absolute top-4 right-4 ${product.badgeColor} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                  {product.badge}
                </div>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-full py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${
                  isWishlisted
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Details Section */}
            <div>
              {/* Retailer Badge */}
              <div className="text-xs font-bold text-green-700 bg-green-50 inline-block px-3 py-1 rounded-full mb-3">
                {product.retailer}
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.size}</p>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-gray-900">{product.rating}</span>
                <span className="text-gray-600">({product.reviews} reviews)</span>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-4">{product.description}</p>

              {/* Benefits */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Key Benefits</h3>
                <div className="space-y-2">
                  {product.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-700">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-4xl font-bold text-gray-900">R{product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      R{product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {product.savings > 0 && (
                  <div className="flex items-center gap-2 text-red-600 font-bold">
                    <TrendingDown className="w-5 h-5" />
                    You save R{product.savings.toFixed(2)}
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-semibold text-gray-900">Quantity:</span>
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-bold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mb-6">
                <ShoppingCart className="w-6 h-6" />
                Add {quantity} to Cart
              </Button>
            </div>
          </div>

          {/* Price Comparison Table */}
          {allRetailerPrices.length > 0 && (
            <div className="mt-8 pt-8 border-t-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Price Comparison Across Retailers</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-4 px-4 font-bold text-gray-900">Retailer</th>
                      <th className="text-right py-4 px-4 font-bold text-gray-900">Price</th>
                      <th className="text-right py-4 px-4 font-bold text-gray-900">Original</th>
                      <th className="text-right py-4 px-4 font-bold text-gray-900">Savings</th>
                      <th className="text-right py-4 px-4 font-bold text-gray-900">Discount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allRetailerPrices.map((retailer, idx) => (
                      <tr
                        key={idx}
                        className={`border-b border-gray-200 ${
                          retailer.price === bestPrice.price ? 'bg-green-50' : ''
                        }`}
                      >
                        <td className="py-4 px-4 font-semibold text-gray-900">
                          {retailer.retailer}
                          {retailer.price === bestPrice.price && (
                            <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded">
                              BEST PRICE
                            </span>
                          )}
                        </td>
                        <td className="text-right py-4 px-4 font-bold text-gray-900">
                          R{retailer.price.toFixed(2)}
                        </td>
                        <td className="text-right py-4 px-4 text-gray-600 line-through">
                          R{retailer.originalPrice.toFixed(2)}
                        </td>
                        <td className="text-right py-4 px-4 font-bold text-red-600">
                          R{retailer.savings.toFixed(2)}
                        </td>
                        <td className="text-right py-4 px-4 font-bold text-green-600">
                          {retailer.savingsPercent}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
