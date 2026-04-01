import { useState } from 'react';
import { Heart, ShoppingCart, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

interface QuickProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: number;
  store: string;
  image?: string;
  isTrending?: boolean;
}

const QUICK_PRODUCTS: QuickProduct[] = [
  {
    id: '1',
    name: 'Full Cream Milk (1L)',
    category: 'Dairy',
    price: 1899,
    originalPrice: 2199,
    discount: 14,
    store: 'Spar',
    isTrending: true,
  },
  {
    id: '2',
    name: 'White Bread (700g)',
    category: 'Bakery',
    price: 899,
    originalPrice: 1099,
    discount: 18,
    store: 'Pick n Pay',
    isTrending: true,
  },
  {
    id: '3',
    name: 'Chicken Breast (1kg)',
    category: 'Meat',
    price: 5999,
    originalPrice: 6999,
    discount: 14,
    store: 'Checkers',
  },
  {
    id: '4',
    name: 'Tomatoes (1kg)',
    category: 'Produce',
    price: 1299,
    originalPrice: 1699,
    discount: 24,
    store: 'Woolworths',
    isTrending: true,
  },
  {
    id: '5',
    name: 'Rice (5kg)',
    category: 'Pantry',
    price: 7999,
    originalPrice: 8999,
    discount: 11,
    store: 'OK Foods',
  },
  {
    id: '6',
    name: 'Coca Cola (2L)',
    category: 'Drinks',
    price: 2499,
    originalPrice: 2999,
    discount: 17,
    store: 'Spar',
    isTrending: true,
  },
  {
    id: '7',
    name: 'Eggs (12 pack)',
    category: 'Dairy',
    price: 2199,
    originalPrice: 2699,
    discount: 19,
    store: 'Pick n Pay',
  },
  {
    id: '8',
    name: 'Peanut Butter (400g)',
    category: 'Pantry',
    price: 2899,
    originalPrice: 3499,
    discount: 17,
    store: 'Checkers',
  },
];

export function QuickShop() {
  const { addItem } = useCart();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const handleAddToCart = (product: QuickProduct) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      storeName: product.store,
    });
  };

  return (
    <section className="py-8 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Quick Shop</h2>
            <p className="text-muted-foreground mt-1">Popular items trending right now</p>
          </div>
          <Button variant="outline" className="hidden md:flex" onClick={() => window.location.href = '/?category=all'}>
            View All
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_PRODUCTS.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-border/50"
            >
              {/* Product Image Placeholder */}
              <div className="relative w-full h-40 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                {product.isTrending && (
                  <Badge className="absolute top-2 right-2 bg-red-500 text-white flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </Badge>
                )}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{product.store}</p>
                </div>

                {/* Price Section */}
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">
                      R{(product.price / 100).toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      R{(product.originalPrice / 100).toFixed(2)}
                    </span>
                  </div>
                  <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700 border-0">
                    Save {product.discount}%
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add
                  </Button>
                  <Button
                    onClick={() => toggleFavorite(product.id)}
                    variant="outline"
                    size="sm"
                    className="px-3"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.has(product.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="md:hidden mt-6">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => window.location.href = '/?category=all'}>
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
