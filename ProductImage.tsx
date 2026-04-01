/**
 * Product Image Component
 * Displays product images with fallback and error handling
 * Ensures no missing images or question marks
 */

import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';

interface ProductImageProps {
  src?: string;
  alt: string;
  category?: string;
  className?: string;
  width?: number;
  height?: number;
}

// Category-based fallback images
const CATEGORY_FALLBACKS: Record<string, string> = {
  'Dairy & Eggs': 'https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=400&h=400&fit=crop',
  'Meat & Poultry': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop',
  'Produce': 'https://images.unsplash.com/photo-1488459716781-6918f33427d7?w=400&h=400&fit=crop',
  'Bakery': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop',
  'Pantry Staples': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64b11?w=400&h=400&fit=crop',
  'Beverages': 'https://images.unsplash.com/photo-1554866585-acbb2b3b4b1e?w=400&h=400&fit=crop',
  'Snacks & Confectionery': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64b11?w=400&h=400&fit=crop',
  'Frozen Foods': 'https://images.unsplash.com/photo-1585238341710-4b4e6a7dd188?w=400&h=400&fit=crop',
  'Personal Care': 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
  'Household Items': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop',
  'Health & Wellness': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde0e?w=400&h=400&fit=crop',
  'Pet Supplies': 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=400&fit=crop',
  'Condiments & Sauces': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64b11?w=400&h=400&fit=crop',
};

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64b11?w=400&h=400&fit=crop';

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  category,
  className = 'w-full h-full object-cover',
  width = 300,
  height = 300,
}) => {
  const [imageSrc, setImageSrc] = useState<string>(src || '');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Get fallback image
  const fallbackImage = category ? CATEGORY_FALLBACKS[category] || DEFAULT_FALLBACK : DEFAULT_FALLBACK;

  // Reset states when src changes
  useEffect(() => {
    setImageSrc(src || '');
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    // Use fallback image
    setImageSrc(fallbackImage);
  };

  // If no image source provided, show fallback immediately
  if (!src || src === '' || hasError) {
    return (
      <img
        src={fallbackImage}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading="lazy"
        onError={(e) => {
          // If fallback also fails, show placeholder
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-100">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      )}

      <img
        src={imageSrc}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading="lazy"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          display: isLoading ? 'none' : 'block',
        }}
      />

      {/* Fallback placeholder if image fails to load */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Package className="w-12 h-12 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default ProductImage;
