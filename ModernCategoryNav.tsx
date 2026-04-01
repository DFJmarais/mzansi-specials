import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface ModernCategoryNavProps {
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'all', name: 'All' },
  { id: 'groceries', name: 'Groceries' },
  { id: 'dairy', name: 'Dairy' },
  { id: 'meat', name: 'Meat' },
  { id: 'produce', name: 'Produce' },
  { id: 'bakery', name: 'Bakery' },
  { id: 'snacks', name: 'Snacks' },
  { id: 'drinks', name: 'Drinks' },
  { id: 'household', name: 'Household' },
  { id: 'specials', name: 'Specials' },
];

export function ModernCategoryNav({
  categories = DEFAULT_CATEGORIES,
  selectedCategory = 'all',
  onSelectCategory,
}: ModernCategoryNavProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-white border-b border-border sticky top-[60px] sm:top-[76px] z-30">
      <div className="container py-3 sm:py-4">
        <div className="relative">
          {/* Scroll Buttons - Hidden on Mobile */}
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-border rounded-lg p-1.5 hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Category Container */}
          <div
            ref={scrollContainerRef}
            className="scroll-horizontal md:px-8"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onSelectCategory?.(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-semibold text-sm sm:text-base transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Scroll Button - Right */}
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-border rounded-lg p-1.5 hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
