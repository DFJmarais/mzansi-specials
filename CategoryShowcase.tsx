import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Category {
  name: string;
  emoji: string;
  color: string;
  productCount: number;
  featured: string;
  discount: number;
}

export const CategoryShowcase = () => {
  const categories: Category[] = [
    {
      name: 'Dairy & Eggs',
      emoji: '🥛',
      color: 'from-blue-100 to-blue-50',
      productCount: 45,
      featured: 'Full Cream Milk',
      discount: 20,
    },
    {
      name: 'Meat & Poultry',
      emoji: '🥩',
      color: 'from-red-100 to-red-50',
      productCount: 38,
      featured: 'Beef Steak',
      discount: 25,
    },
    {
      name: 'Produce',
      emoji: '🥕',
      color: 'from-green-100 to-green-50',
      productCount: 52,
      featured: 'Fresh Tomatoes',
      discount: 30,
    },
    {
      name: 'Bakery',
      emoji: '🍞',
      color: 'from-yellow-100 to-yellow-50',
      productCount: 28,
      featured: 'Whole Wheat Bread',
      discount: 15,
    },
    {
      name: 'Beverages',
      emoji: '☕',
      color: 'from-amber-100 to-amber-50',
      productCount: 35,
      featured: 'Premium Coffee',
      discount: 12,
    },
    {
      name: 'Snacks & Sweets',
      emoji: '🍫',
      color: 'from-purple-100 to-purple-50',
      productCount: 42,
      featured: 'Chocolate Bars',
      discount: 18,
    },
    {
      name: 'Frozen Foods',
      emoji: '🍦',
      color: 'from-cyan-100 to-cyan-50',
      productCount: 24,
      featured: 'Ice Cream',
      discount: 20,
    },
    {
      name: 'Household',
      emoji: '🧼',
      color: 'from-pink-100 to-pink-50',
      productCount: 56,
      featured: 'Cleaning Supplies',
      discount: 25,
    },
  ];

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Shop by Category</h2>
        <p className="text-muted-foreground">Browse our wide selection of products</p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card
            key={category.name}
            className={`p-6 bg-gradient-to-br ${category.color} border-2 border-border hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer group`}
          >
            <div className="space-y-4">
              {/* Emoji */}
              <div className="text-5xl group-hover:scale-110 transition-transform">
                {category.emoji}
              </div>

              {/* Category Name */}
              <div>
                <h3 className="font-bold text-foreground text-lg">{category.name}</h3>
                <p className="text-xs text-muted-foreground">{category.productCount} products</p>
              </div>

              {/* Featured Item */}
              <div className="bg-white/60 p-2 rounded-lg">
                <p className="text-xs text-muted-foreground">Featured</p>
                <p className="font-semibold text-foreground text-sm">{category.featured}</p>
              </div>

              {/* Discount Badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-accent">Up to {category.discount}% OFF</span>
                <span className="text-lg">→</span>
              </div>

              {/* CTA Button */}
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm">
                Browse
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Browse All Button */}
      <div className="text-center pt-4">
        <Button className="gap-2 bg-accent hover:bg-accent/90 text-white font-bold px-8 py-6 text-lg">
          Browse All 15 Categories
        </Button>
      </div>
    </div>
  );
};
