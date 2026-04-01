import { useState } from 'react';
import { Search, Filter, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  prices: Array<{ store: string; price: number; special?: boolean; discount?: number }>;
  rating: number;
  reviews: number;
}

export const ProductGrid = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  // Sample products
  const products: Product[] = [
    {
      id: 1,
      name: 'Full Cream Milk (1L)',
      category: 'Dairy',
      image: '🥛',
      prices: [
        { store: 'Checkers', price: 17.99, special: true, discount: 20 },
        { store: 'Spar', price: 18.99 },
      ],
      rating: 4.8,
      reviews: 234,
    },
    {
      id: 2,
      name: 'Beef Steak (500g)',
      category: 'Meat',
      image: '🥩',
      prices: [
        { store: 'OK Foods', price: 79.99, special: true, discount: 25 },
        { store: 'Spar', price: 89.99 },
      ],
      rating: 4.8,
      reviews: 345,
    },
    {
      id: 3,
      name: 'Chicken Breast (1kg)',
      category: 'Meat',
      image: '🍗',
      prices: [
        { store: 'OK Foods', price: 55.99, special: true, discount: 20 },
        { store: 'Spar', price: 59.99 },
      ],
      rating: 4.9,
      reviews: 523,
    },
    {
      id: 4,
      name: 'Fresh Tomatoes (1kg)',
      category: 'Produce',
      image: '🍅',
      prices: [
        { store: 'Checkers', price: 11.99, special: true, discount: 30 },
        { store: 'Spar', price: 12.99 },
      ],
      rating: 4.6,
      reviews: 189,
    },
    {
      id: 5,
      name: 'Apples (1kg)',
      category: 'Produce',
      image: '🍎',
      prices: [
        { store: 'Checkers', price: 19.99, special: true, discount: 25 },
        { store: 'Spar', price: 22.99 },
      ],
      rating: 4.8,
      reviews: 412,
    },
    {
      id: 6,
      name: 'Bread (White Loaf)',
      category: 'Bakery',
      image: '🍞',
      prices: [
        { store: 'Checkers', price: 8.49, special: true, discount: 15 },
        { store: 'Spar', price: 8.99 },
      ],
      rating: 4.8,
      reviews: 345,
    },
    {
      id: 7,
      name: 'Premium Coffee (500g)',
      category: 'Beverages',
      image: '☕',
      prices: [
        { store: 'Checkers', price: 32.99, special: true, discount: 12 },
        { store: 'Spar', price: 34.99 },
      ],
      rating: 4.8,
      reviews: 412,
    },
    {
      id: 8,
      name: 'Chocolate Bar (50g)',
      category: 'Snacks',
      image: '🍫',
      prices: [
        { store: 'Checkers', price: 5.49, special: true, discount: 15 },
        { store: 'Spar', price: 5.99 },
      ],
      rating: 4.8,
      reviews: 345,
    },
  ];

  const categories = ['All', 'Dairy', 'Meat', 'Produce', 'Bakery', 'Beverages', 'Snacks'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getBestPrice = (prices: Product['prices']) => {
    return prices.reduce((min, p) => (p.price < min.price ? p : min));
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">All Products</h2>
        <p className="text-muted-foreground">
          Showing {filteredProducts.length} products
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 border-2 border-primary/30 focus:border-primary"
            />
          </div>
          <Button variant="outline" size="icon" className="border-2 border-primary/30">
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className={`whitespace-nowrap border-2 ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'border-primary/30 hover:border-primary'
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm"
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const bestPrice = getBestPrice(product.prices);
            return (
              <Card
                key={product.id}
                className="p-4 border-2 border-border hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1 group relative"
              >
                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-all">
                  <Heart className="w-5 h-5 text-red-500" />
                </button>

                {/* Product Image */}
                <div className="text-5xl text-center mb-3 group-hover:scale-110 transition-transform">
                  {product.image}
                </div>

                {/* Product Name */}
                <h3 className="font-bold text-foreground text-sm mb-2">{product.name}</h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-yellow-500">★</span>
                  <span className="text-xs font-medium text-foreground">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="bg-primary/10 p-2 rounded-lg mb-3 border-2 border-primary/20">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-primary">R{bestPrice.price.toFixed(2)}</span>
                    {bestPrice.special && (
                      <Badge className="bg-red-500 text-white text-xs">
                        {bestPrice.discount}% OFF
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{bestPrice.store}</p>
                </div>

                {/* CTA */}
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm">
                  View Prices
                </Button>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center border-2 border-border">
          <p className="text-lg text-muted-foreground">No products found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
        </Card>
      )}

      {/* Load More */}
      {filteredProducts.length > 0 && (
        <div className="text-center pt-4">
          <Button variant="outline" className="border-2 border-primary/30 hover:border-primary">
            Load More Products
          </Button>
        </div>
      )}
    </div>
  );
};
