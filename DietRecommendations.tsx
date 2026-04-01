import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { COMPLETE_PRODUCTS } from '@/data/products-complete';

interface DietRecommendationsProps {
  selectedDiets: string[];
  onViewDetails?: (productId: number) => void;
}

const DIET_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'vegan': { bg: '#2D5016', text: '#FFFFFF', border: '#2D5016' },
  'gluten-free': { bg: '#F4A460', text: '#FFFFFF', border: '#F4A460' },
  'lactose-intolerant': { bg: '#FF6B9D', text: '#FFFFFF', border: '#FF6B9D' },
  'keto-low-carb': { bg: '#FF6B35', text: '#FFFFFF', border: '#FF6B35' },
  'high-protein': { bg: '#FF4500', text: '#FFFFFF', border: '#FF4500' },
  'organic': { bg: '#228B22', text: '#FFFFFF', border: '#228B22' },
  'dairy-free': { bg: '#FFD700', text: '#000000', border: '#FFD700' },
  'nut-free': { bg: '#8B4513', text: '#FFFFFF', border: '#8B4513' },
  'halal': { bg: '#006400', text: '#FFFFFF', border: '#006400' },
  'kosher': { bg: '#4169E1', text: '#FFFFFF', border: '#4169E1' },
};

/**
 * Diet Recommendations Component
 * Shows products that match selected dietary preferences
 */
export function DietRecommendations({ selectedDiets, onViewDetails }: DietRecommendationsProps) {
  if (selectedDiets.length === 0) {
    return null;
  }

  // Mock diet product mapping (in production, this would come from the backend)
  const PRODUCT_DIET_MAPPING: Record<string, string[]> = {
    'Full Cream Milk (1L)': ['lactose-intolerant', 'vegan', 'dairy-free'],
    'Lactose-Free Milk (1L)': ['lactose-intolerant', 'dairy-free'],
    'Almond Milk (1L)': ['vegan', 'dairy-free', 'lactose-intolerant', 'nut-free'],
    'Beef Steak (500g)': ['paleo', 'keto-low-carb', 'high-protein', 'halal'],
    'Chicken Breast (1kg)': ['paleo', 'keto-low-carb', 'high-protein', 'halal'],
    'Tomatoes (1kg)': ['vegan', 'vegetarian', 'gluten-free', 'paleo', 'keto-low-carb', 'organic'],
    'Carrots (1kg)': ['vegan', 'vegetarian', 'gluten-free', 'paleo', 'keto-low-carb', 'organic'],
    'Broccoli (500g)': ['vegan', 'vegetarian', 'gluten-free', 'paleo', 'keto-low-carb', 'organic'],
    'Spinach (250g)': ['vegan', 'vegetarian', 'gluten-free', 'paleo', 'keto-low-carb', 'organic'],
    'Apples (1kg)': ['vegan', 'vegetarian', 'gluten-free', 'paleo', 'organic'],
    'Bananas (1kg)': ['vegan', 'vegetarian', 'gluten-free', 'paleo', 'organic'],
    'Olive Oil (1L)': ['vegan', 'vegetarian', 'gluten-free', 'paleo', 'keto-low-carb', 'organic'],
    'Almonds (200g)': ['vegan', 'vegetarian', 'gluten-free', 'paleo', 'high-protein', 'nut-free'],
    'Gluten-Free Bread': ['gluten-free', 'vegan'],
    'Whole Wheat Bread': ['vegetarian', 'vegan'],
    'Rice (5kg)': ['vegan', 'gluten-free', 'paleo', 'keto-low-carb'],
    'Quinoa (500g)': ['vegan', 'vegetarian', 'gluten-free', 'paleo', 'high-protein', 'organic'],
    'Lentils (500g)': ['vegan', 'vegetarian', 'gluten-free', 'high-protein', 'organic'],
    'Chickpeas (500g)': ['vegan', 'vegetarian', 'gluten-free', 'high-protein', 'organic'],
  };

  // Get products matching selected diets
  const recommendedProducts = useMemo(() => {
    const matching = COMPLETE_PRODUCTS.filter((product) => {
      const dietTags = PRODUCT_DIET_MAPPING[product.name] || [];
      return selectedDiets.some((diet) => dietTags.includes(diet));
    }).slice(0, 6); // Show top 6 recommendations

    return matching;
  }, [selectedDiets]);

  if (recommendedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-primary/20">
      <div className="container">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            🥗 Perfect for Your Diet
          </h2>
          <p className="text-foreground/80">
            Products matching your dietary preferences: {selectedDiets.join(', ')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedProducts.map((product) => {
            const dietTags = PRODUCT_DIET_MAPPING[product.name] || [];
            const matchingDiets = dietTags.filter((d) => selectedDiets.includes(d));
            const bestPrice = product.prices.reduce((min, p) => (p.price < min.price ? p : min));

            return (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-primary/30 bg-white"
              >
                {/* Header with Diet Tags */}
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b-2 border-primary/20">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <Heart className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {matchingDiets.slice(0, 3).map((diet) => (
                      <Badge
                        key={diet}
                        className="text-xs"
                        style={{
                          backgroundColor: DIET_COLORS[diet]?.bg || '#F4A460',
                          color: DIET_COLORS[diet]?.text || '#FFFFFF',
                          border: `1px solid ${DIET_COLORS[diet]?.border || '#F4A460'}`,
                        }}
                      >
                        {diet}
                      </Badge>
                    ))}
                    {matchingDiets.length > 3 && (
                      <Badge className="text-xs bg-primary/20 text-primary border border-primary">
                        +{matchingDiets.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Price Section */}
                <div className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 border-b-2 border-secondary/20">
                  <p className="text-xs text-muted-foreground mb-1 font-semibold">BEST PRICE</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-secondary">R{bestPrice.price.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground">{bestPrice.store}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4">
                  <p className="text-sm text-foreground/80 mb-4">
                    Perfect match for your {matchingDiets.length} selected dietary preference{matchingDiets.length !== 1 ? 's' : ''}.
                  </p>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    onClick={() => onViewDetails?.(product.id)}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* CTA to My Diet Page */}
        <div className="mt-8 text-center">
          <p className="text-foreground/80 mb-4">
            Want to update your dietary preferences?
          </p>
          <Button
            variant="outline"
            className="border-2 border-primary hover:bg-primary/10"
            onClick={() => window.location.href = '/my-diet'}
          >
            Go to My Diet Settings
          </Button>
        </div>
      </div>
    </section>
  );
}

/**
 * Diet Preference Badge Component
 * Display user's selected diet preferences
 */
export function DietPreferenceBadges({ diets }: { diets: string[] }) {
  if (diets.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {diets.map((diet) => (
        <Badge
          key={diet}
          className="text-sm"
          style={{
            backgroundColor: DIET_COLORS[diet]?.bg || '#F4A460',
            color: DIET_COLORS[diet]?.text || '#FFFFFF',
            border: `1px solid ${DIET_COLORS[diet]?.border || '#F4A460'}`,
          }}
        >
          {diet}
        </Badge>
      ))}
    </div>
  );
}

/**
 * Diet Info Card Component
 * Show benefits of selected diet
 */
export function DietInfoCard({ diet }: { diet: string }) {
  const dietInfo: Record<string, { title: string; benefits: string[] }> = {
    'vegan': {
      title: 'Vegan Diet Benefits',
      benefits: ['Plant-based nutrition', 'Lower environmental impact', 'Cruelty-free products'],
    },
    'gluten-free': {
      title: 'Gluten-Free Benefits',
      benefits: ['Safe for celiac disease', 'Better digestion', 'Reduced inflammation'],
    },
    'keto-low-carb': {
      title: 'Keto/Low-Carb Benefits',
      benefits: ['Weight management', 'Stable energy levels', 'Blood sugar control'],
    },
    'high-protein': {
      title: 'High-Protein Benefits',
      benefits: ['Muscle building', 'Better satiety', 'Improved recovery'],
    },
    'organic': {
      title: 'Organic Benefits',
      benefits: ['No synthetic pesticides', 'Better nutrition', 'Environmentally friendly'],
    },
  };

  const info = dietInfo[diet];
  if (!info) return null;

  return (
    <Card className="p-4 bg-primary/5 border-2 border-primary/20">
      <h4 className="font-bold text-foreground mb-3">{info.title}</h4>
      <ul className="space-y-2">
        {info.benefits.map((benefit, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            {benefit}
          </li>
        ))}
      </ul>
    </Card>
  );
}
