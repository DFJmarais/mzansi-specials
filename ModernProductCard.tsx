import { useState } from 'react';
import { Plus, Minus, Check, TrendingDown } from 'lucide-react';

interface ModernProductCardProps {
  id: string;
  name: string;
  image?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  store: string;
  category: string;
  isVerified?: boolean;
  onAddToCart?: (quantity: number) => void;
}

export function ModernProductCard({
  id,
  name,
  image,
  price,
  originalPrice,
  discount,
  store,
  category,
  isVerified = true,
  onAddToCart,
}: ModernProductCardProps) {
  const [quantity, setQuantity] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onAddToCart?.(newQuantity);
  };

  const handleRemove = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onAddToCart?.(newQuantity);
    }
  };

  const handleQuickAdd = () => {
    setQuantity(1);
    setIsAdded(true);
    onAddToCart?.(1);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const savings = originalPrice ? originalPrice - price : 0;
  const discountPercent = originalPrice ? Math.round((savings / originalPrice) * 100) : 0;

  return (
    <div className="card-modern group cursor-pointer hover:shadow-lg transition-all duration-200 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative mb-3 bg-muted rounded-xl overflow-hidden aspect-square flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}

        {/* Discount Badge */}
        {discount && discount > 0 && (
          <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            {discountPercent}%
          </div>
        )}

        {/* Verified Badge */}
        {isVerified && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
            <Check className="w-3 h-3" />
            Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Category */}
        <p className="text-xs text-muted-foreground font-medium mb-1">{category}</p>

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2">{name}</h3>

        {/* Store */}
        <p className="text-xs text-muted-foreground mb-3">{store}</p>

        {/* Price Section */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-bold text-foreground">R{price.toFixed(2)}</span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs sm:text-sm text-muted-foreground line-through">
                R{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {savings > 0 && (
            <p className="text-xs text-secondary font-semibold mt-1">Save R{savings.toFixed(2)}</p>
          )}
        </div>
      </div>

      {/* Add to Cart Section */}
      <div className="mt-auto">
        {quantity === 0 ? (
          <button
            onClick={handleQuickAdd}
            className="w-full btn-primary text-sm sm:text-base py-2.5 sm:py-3 flex items-center justify-center gap-2 group/btn"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:scale-110 transition-transform" />
            <span>Add</span>
          </button>
        ) : (
          <div className="flex items-center justify-between bg-primary/10 rounded-xl p-1">
            <button
              onClick={handleRemove}
              className="p-1.5 sm:p-2 hover:bg-primary/20 rounded-lg transition-colors"
            >
              <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </button>
            <span className="text-sm sm:text-base font-bold text-primary">{quantity}</span>
            <button
              onClick={handleAdd}
              className="p-1.5 sm:p-2 hover:bg-primary/20 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </button>
          </div>
        )}
      </div>

      {/* Added Confirmation */}
      {isAdded && (
        <div className="absolute inset-0 bg-primary/90 rounded-2xl flex items-center justify-center animate-fade-in">
          <div className="flex flex-col items-center gap-2">
            <Check className="w-8 h-8 text-white" />
            <span className="text-white font-semibold text-sm">Added!</span>
          </div>
        </div>
      )}
    </div>
  );
}
