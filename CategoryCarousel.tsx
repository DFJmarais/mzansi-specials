import { ShoppingCart, Beef, Apple, Croissant, Home, Zap } from 'lucide-react';
import { useState } from 'react';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const CATEGORIES: Category[] = [
  { id: 'all', name: 'All', icon: <ShoppingCart size={24} />, color: 'bg-primary' },
  { id: 'meat', name: 'Meat', icon: <Beef size={24} />, color: 'bg-red-600' },
  { id: 'produce', name: 'Produce', icon: <Apple size={24} />, color: 'bg-secondary' },
  { id: 'bakery', name: 'Bakery', icon: <Croissant size={24} />, color: 'bg-accent' },
  { id: 'household', name: 'Household', icon: <Home size={24} />, color: 'bg-blue-600' },
  { id: 'specials', name: 'Specials', icon: <Zap size={24} />, color: 'bg-yellow-500' },
];

interface CategoryCarouselProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryCarousel({
  selectedCategory,
  onCategoryChange,
}: CategoryCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    setScrollPosition(element.scrollLeft);
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('category-scroll');
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-white border-b-2 border-primary shadow-sm">
      <div className="container py-3">
        <div className="flex items-center gap-2">
          {/* Left Scroll Button */}
          {scrollPosition > 0 && (
            <button
              onClick={() => scroll('left')}
              className="flex-shrink-0 p-2 hover:bg-primary/10 rounded-lg text-primary font-bold text-lg transition-colors"
            >
              ←
            </button>
          )}

          {/* Category Scroll Container */}
          <div
            id="category-scroll"
            className="scroll-x flex-1"
            onScroll={handleScroll}
          >
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-lg transition-all font-bold ${
                    isSelected
                      ? `${category.color} text-white shadow-lg scale-105`
                      : 'hover:bg-muted text-foreground border-2 border-transparent hover:border-primary'
                  }`}
                >
                  <div className="text-lg">{category.icon}</div>
                  <span className="text-xs font-bold whitespace-nowrap">
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scroll('right')}
            className="flex-shrink-0 p-2 hover:bg-primary/10 rounded-lg text-primary font-bold text-lg transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
