import { useState } from 'react';
import { Heart, ShoppingCart, TrendingDown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import ProductImage from '@/components/ProductImage';

export interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl?: string;
  retailer: string;
  category: string;
  url: string;
  rating?: number;
  reviews?: number;
  onAddToList?: () => void;
}

export default function ProductCard({
  id,
  name,
  brand,
  price,
  originalPrice,
  discount,
  imageUrl,
  retailer,
  category,
  url,
  rating = 4.5,
  reviews = 0,
  onAddToList,
}: ProductCardProps) {
  const [, navigate] = useLocation();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const formattedPrice = (price / 100).toFixed(2);
  const formattedOriginalPrice = originalPrice ? (originalPrice / 100).toFixed(2) : null;
  const savings = originalPrice ? originalPrice - price : 0;
  const formattedSavings = (savings / 100).toFixed(2);

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToList = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    try {
      if (onAddToList) {
        await onAddToList();
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border"
    >
      {/* Image Container */}
      <div className="relative bg-muted h-48 overflow-hidden flex items-center justify-center group">
        <ProductImage
          src={imageUrl}
          alt={name}
          category={category}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
        />

        {/* Discount Badge */}
        {discount && discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-accent text-white text-xs font-bold animate-pulse">
            {discount}% OFF
          </Badge>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="absolute top-2 left-2 p-2 bg-white rounded-full shadow-md hover:bg-muted transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${isFavorited ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Brand & Category */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-primary uppercase">{brand}</span>
          <span className="text-xs text-muted-foreground">{retailer}</span>
        </div>

        {/* Product Name */}
        <h3 className="text-sm font-bold text-foreground line-clamp-2 mb-2 h-10">
          {name}
        </h3>

        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-muted-foreground">{category}</p>
          {rating && (
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              {reviews > 0 && (
                <span className="text-xs text-muted-foreground">({reviews})</span>
              )}
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xl font-bold text-primary">R{formattedPrice}</span>
            {formattedOriginalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                R{formattedOriginalPrice}
              </span>
            )}
          </div>

          {savings > 0 && (
            <div className="flex items-center gap-1 text-xs text-accent font-semibold">
              <TrendingDown className="w-3 h-3" />
              Save R{formattedSavings}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleAddToList}
            disabled={isAdding}
            size="sm"
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-9"
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            {isAdding ? 'Adding...' : 'Add'}
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              window.open(url, '_blank');
            }}
            size="sm"
            variant="outline"
            className="flex-1 text-xs font-semibold h-9 border-primary text-primary hover:bg-primary/10"
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
