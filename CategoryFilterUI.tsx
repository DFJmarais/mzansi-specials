import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CategoryFilterUIProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

// Category icons for visual appeal
const CATEGORY_ICONS: Record<string, string> = {
  'All': '🏪',
  'Dairy': '🥛',
  'Meat': '🥩',
  'Produce': '🥕',
  'Bakery': '🍞',
  'Pantry': '🥫',
  'Beverages': '🥤',
  'Snacks': '🍪',
  'Eggs': '🥚',
  'Breakfast': '🥣',
  'Frozen': '❄️',
  'Condiments': '🧂',
  'Personal Care': '🧴',
  'Household': '🧹',
  'Health': '💊',
  'Baby': '👶',
  'Pet Supplies': '🐕',
  'Laundry': '🧺',
};

export function CategoryFilterUI({ categories, selectedCategory, onCategoryChange }: CategoryFilterUIProps) {
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const visibleCategories = expanded ? categories : categories.slice(0, visibleCount);
  const hasMore = categories.length > visibleCount;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">📂 Product Categories</h3>
        {hasMore && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            Show more <ChevronDown className="w-3 h-3" />
          </button>
        )}
        {expanded && (
          <button
            onClick={() => setExpanded(false)}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            Show less <ChevronUp className="w-3 h-3" />
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {visibleCategories.map((cat) => (
          <Badge
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            className={`cursor-pointer transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-white text-foreground border-primary/30 hover:border-primary hover:bg-primary/5'
            }`}
            onClick={() => onCategoryChange(cat)}
          >
            <span className="mr-1">{CATEGORY_ICONS[cat] || '📦'}</span>
            {cat}
          </Badge>
        ))}
      </div>

      {/* Quick category shortcuts for new essentials */}
      <div className="pt-3 border-t border-primary/20">
        <p className="text-xs font-semibold text-foreground/70 mb-2">🆕 Essential Categories</p>
        <div className="flex flex-wrap gap-2">
          {['Personal Care', 'Household', 'Health', 'Baby', 'Pet Supplies'].map((cat) => {
            if (!categories.includes(cat)) return null;
            return (
              <Button
                key={cat}
                variant="ghost"
                size="sm"
                onClick={() => onCategoryChange(cat)}
                className={`text-xs h-7 px-2 ${
                  selectedCategory === cat
                    ? 'bg-primary/20 text-primary font-semibold'
                    : 'text-foreground/70 hover:text-primary hover:bg-primary/10'
                }`}
              >
                {CATEGORY_ICONS[cat]} {cat}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
