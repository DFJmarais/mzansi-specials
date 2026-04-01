import { useState } from 'react';
import { ShoppingCart, Trash2, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { COMPLETE_PRODUCTS } from '@/data/products-complete';

interface BasketItem {
  productId: number;
  productName: string;
  quantity: number;
}

interface StorePrices {
  store: string;
  total: number;
  items: { productName: string; price: number; quantity: number }[];
}

export const BasketCalculator = () => {
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = COMPLETE_PRODUCTS.filter((p: any) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10);

  const addToBasket = (product: any) => {
    const existing = basketItems.find((item) => item.productId === product.id);
    if (existing) {
      setBasketItems(
        basketItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setBasketItems([
        ...basketItems,
        { productId: product.id, productName: product.name, quantity: 1 },
      ]);
    }
    setSearchQuery('');
  };

  const removeFromBasket = (productId: number) => {
    setBasketItems(basketItems.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromBasket(productId);
    } else {
      setBasketItems(
        basketItems.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  // Calculate prices at each store
  const storePrices: StorePrices[] = [];
  const stores = ['Spar', 'Pick n Pay', 'Checkers', 'OK Foods', 'ShopRite', 'Woolworths'];

  stores.forEach((store) => {
    let total = 0;
    const items: any[] = [];

    basketItems.forEach((item) => {
      const product = COMPLETE_PRODUCTS.find((p: any) => p.id === item.productId);
      if (product) {
        const storePrice = product.prices.find((p: any) => p.store === store);
        if (storePrice) {
          const itemTotal = storePrice.price * item.quantity;
          total += itemTotal;
          items.push({
            productName: item.productName,
            price: storePrice.price,
            quantity: item.quantity,
          });
        }
      }
    });

    storePrices.push({ store, total, items });
  });

  const bestStore = storePrices.reduce((best, current) =>
    current.total < best.total ? current : best
  );
  const worstStore = storePrices.reduce((worst, current) =>
    current.total > worst.total ? current : worst
  );
  const totalSavings = worstStore.total - bestStore.total;

  return (
    <div className="w-full space-y-6">
      {/* Search and Add */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground">Add Products to Basket</label>
          <div className="relative">
            <Input
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-2 border-primary/30"
            />
          </div>

          {searchQuery && filteredProducts.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredProducts.map((product: any) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-2 bg-white rounded-lg border border-border hover:border-primary"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addToBasket(product)}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {basketItems.length > 0 ? (
        <>
          {/* Basket Items */}
          <Card className="p-4 border-2 border-primary/20">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Your Basket ({basketItems.length} items)
            </h3>

            <div className="space-y-3">
              {basketItems.map((item) => (
                <div key={item.productId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.productName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromBasket(item.productId)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Price Comparison */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Price at Each Store</h3>

            {/* Best Store Highlight */}
            <Card className="p-4 bg-gradient-to-r from-secondary/20 to-accent/20 border-2 border-secondary/50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-secondary text-white">Best Deal</Badge>
                    <h4 className="font-bold text-lg text-foreground">{bestStore.store}</h4>
                  </div>
                  <p className="text-3xl font-bold text-secondary">R{bestStore.total.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Save vs most expensive</p>
                  <p className="text-2xl font-bold text-accent">R{totalSavings.toFixed(2)}</p>
                </div>
              </div>
            </Card>

            {/* All Store Prices */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {storePrices.map((storePrice) => (
                <Card
                  key={storePrice.store}
                  className={`p-4 border-2 ${
                    storePrice.store === bestStore.store
                      ? 'border-secondary/50 bg-secondary/5'
                      : 'border-border'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">{storePrice.store}</h4>
                      {storePrice.store === bestStore.store && (
                        <Badge className="bg-secondary text-white text-xs">Best</Badge>
                      )}
                    </div>

                    <div className="space-y-1 max-h-32 overflow-y-auto text-xs">
                      {storePrice.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-muted-foreground">
                          <span>{item.quantity}x {item.productName}</span>
                          <span className="font-medium">R{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-border">
                      <p className="text-lg font-bold text-foreground">R{storePrice.total.toFixed(2)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Export Button */}
          <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4" />
            Export Basket as PDF
          </Button>
        </>
      ) : (
        <Card className="p-8 text-center bg-muted/50">
          <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">Add products to your basket to compare prices</p>
        </Card>
      )}
    </div>
  );
};
