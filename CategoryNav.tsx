import { useState } from 'react';
import { ShoppingBag, Zap, Coffee, Home, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface CategoryNavProps {
  onCategorySelect: (categoryId: string) => void;
  selectedCategory?: string;
}

const CATEGORIES: Category[] = [
  {
    id: 'all',
    name: 'All',
    icon: <ShoppingBag className="w-5 h-5" />,
    color: 'bg-primary',
  },
  {
    id: 'groceries',
    name: 'Groceries',
    icon: <ShoppingBag className="w-5 h-5" />,
    color: 'bg-primary',
  },
  {
    id: 'drinks',
    name: 'Drinks',
    icon: <Coffee className="w-5 h-5" />,
    color: 'bg-secondary',
  },
  {
    id: 'snacks',
    name: 'Snacks',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-accent',
  },
  {
    id: 'household',
    name: 'Household',
    icon: <Home className="w-5 h-5" />,
    color: 'bg-primary',
  },
  {
    id: 'specials',
    name: 'Specials',
    icon: <Tag className="w-5 h-5" />,
    color: 'bg-destructive',
  },
];

export function CategoryNav({ onCategorySelect, selectedCategory = 'all' }: CategoryNavProps) {
  return (
    <div className="w-full bg-white border-b border-border shadow-sm">
      <div className="container">
        {/* Desktop view - horizontal scroll */}
        <div className="hidden md:flex gap-2 py-4 overflow-x-auto">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              className={`flex items-center gap-2 whitespace-nowrap font-semibold transition-all ${
                selectedCategory === category.id
                  ? `${category.color} text-white border-0 shadow-md`
                  : 'border-2 border-border hover:border-primary hover:bg-primary/5'
              }`}
            >
              {category.icon}
              {category.name}
            </Button>
          ))}
        </div>

        {/* Mobile view - grid */}
        <div className="md:hidden grid grid-cols-3 gap-2 py-3">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 font-semibold transition-all ${
                selectedCategory === category.id
                  ? `${category.color} text-white border-0 shadow-md`
                  : 'border border-border hover:border-primary hover:bg-primary/5'
              }`}
            >
              {category.icon}
              <span className="text-xs font-medium">{category.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
