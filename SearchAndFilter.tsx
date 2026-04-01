import { X, Sliders } from 'lucide-react';
import { useState } from 'react';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  categories: string[];
  priceStats: { min: number; max: number };
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function SearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  categories,
  priceStats,
  onClearFilters,
  hasActiveFilters,
}: SearchAndFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-white border-b border-border">
      <div className="container py-4 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input w-full"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Sliders size={18} />
            <span className="text-sm font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-1 bg-primary text-white text-xs rounded-full font-bold">
                Active
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-primary hover:underline font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="space-y-4 pt-4 border-t border-border animate-slide-in">
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Category</h3>
              <div className="space-y-2">
                <button
                  onClick={() => onCategoryChange('all')}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-primary text-white'
                      : 'hover:bg-muted'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors capitalize ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Price Range</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">R{priceRange[0]}</span>
                  <input
                    type="range"
                    min={priceStats.min}
                    max={priceStats.max}
                    value={priceRange[0]}
                    onChange={(e) =>
                      onPriceRangeChange([
                        Number(e.target.value),
                        priceRange[1],
                      ])
                    }
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">R{priceRange[1]}</span>
                  <input
                    type="range"
                    min={priceStats.min}
                    max={priceStats.max}
                    value={priceRange[1]}
                    onChange={(e) =>
                      onPriceRangeChange([
                        priceRange[0],
                        Number(e.target.value),
                      ])
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowFilters(false)}
              className="w-full btn-secondary"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
