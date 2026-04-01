import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Check } from 'lucide-react';

interface DietCategory {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
}

interface DietFilterProps {
  categories: DietCategory[];
  selectedDiets: string[];
  onDietChange: (diets: string[]) => void;
  onClear?: () => void;
}

export function DietFilter({
  categories,
  selectedDiets,
  onDietChange,
  onClear,
}: DietFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleDiet = (slug: string) => {
    const newDiets = selectedDiets.includes(slug)
      ? selectedDiets.filter((d) => d !== slug)
      : [...selectedDiets, slug];
    onDietChange(newDiets);
  };

  const selectedCount = selectedDiets.length;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Dietary Preferences</h3>
        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">{selectedCount} selected</Badge>
            {onClear && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {categories.map((category) => {
          const isSelected = selectedDiets.includes(category.slug);
          return (
            <button
              key={category.slug}
              onClick={() => handleToggleDiet(category.slug)}
              className={`relative p-3 rounded-lg border-2 transition-all duration-200 group ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-background hover:border-primary/50'
              }`}
              title={category.description}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">{category.icon}</span>
                <span className="text-xs font-medium text-center text-foreground line-clamp-2">
                  {category.name}
                </span>
              </div>
              {isSelected && (
                <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedCount > 0 && (
        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-foreground">
            <span className="font-semibold">Showing products for:</span>{' '}
            {selectedDiets
              .map(
                (slug) => categories.find((c) => c.slug === slug)?.name
              )
              .filter(Boolean)
              .join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Diet Filter Modal Component
 * Full-screen diet preference selector
 */
export function DietFilterModal({
  categories,
  selectedDiets,
  onDietChange,
  onClose,
}: DietFilterProps & { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Select Your Dietary Preferences</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          <DietFilter
            categories={categories}
            selectedDiets={selectedDiets}
            onDietChange={onDietChange}
          />

          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Done
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/**
 * Compact Diet Tag Component
 * Display selected diet tags as badges
 */
export function DietTags({
  diets,
  onRemove,
  compact = false,
}: {
  diets: DietCategory[];
  onRemove?: (slug: string) => void;
  compact?: boolean;
}) {
  if (diets.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? 'gap-1' : ''}`}>
      {diets.map((diet) => (
        <Badge
          key={diet.slug}
          className={`flex items-center gap-1 ${compact ? 'text-xs' : ''}`}
          style={{
            backgroundColor: `${diet.color}20`,
            color: diet.color,
            border: `1px solid ${diet.color}`,
          }}
        >
          <span>{diet.icon}</span>
          <span>{diet.name}</span>
          {onRemove && (
            <button
              onClick={() => onRemove(diet.slug)}
              className="ml-1 hover:opacity-70"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </Badge>
      ))}
    </div>
  );
}

/**
 * Diet Category Showcase Component
 * Display diet categories as featured sections
 */
export function DietCategoryShowcase({
  categories,
  onSelectDiet,
}: {
  categories: DietCategory[];
  onSelectDiet: (slug: string) => void;
}) {
  // Group categories by type
  const groupedCategories = useMemo(() => {
    const groups: Record<string, DietCategory[]> = {
      'Allergies & Intolerances': [],
      'Lifestyle Choices': [],
      'Health & Wellness': [],
      'Religious & Cultural': [],
      'Other': [],
    };

    categories.forEach((cat) => {
      if (
        cat.slug.includes('free') ||
        cat.slug.includes('intolerant') ||
        cat.slug === 'shellfish-free' ||
        cat.slug === 'sesame-free'
      ) {
        groups['Allergies & Intolerances'].push(cat);
      } else if (
        cat.slug === 'vegan' ||
        cat.slug === 'vegetarian' ||
        cat.slug === 'paleo'
      ) {
        groups['Lifestyle Choices'].push(cat);
      } else if (
        cat.slug.includes('keto') ||
        cat.slug.includes('low-sodium') ||
        cat.slug === 'high-protein' ||
        cat.slug === 'diabetic-friendly'
      ) {
        groups['Health & Wellness'].push(cat);
      } else if (cat.slug === 'halal' || cat.slug === 'kosher') {
        groups['Religious & Cultural'].push(cat);
      } else {
        groups['Other'].push(cat);
      }
    });

    return Object.entries(groups).filter(([_, cats]) => cats.length > 0);
  }, [categories]);

  return (
    <div className="space-y-8">
      {groupedCategories.map(([groupName, groupCategories]) => (
        <div key={groupName}>
          <h3 className="text-xl font-bold text-foreground mb-4">{groupName}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {groupCategories.map((category) => (
              <button
                key={category.slug}
                onClick={() => onSelectDiet(category.slug)}
                className="p-4 rounded-lg border-2 border-border bg-background hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">{category.icon}</span>
                  <span className="text-sm font-semibold text-center text-foreground">
                    {category.name}
                  </span>
                  <p className="text-xs text-muted-foreground text-center line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
