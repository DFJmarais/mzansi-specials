import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

export function ShoppingCart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen && items.length === 0) {
    return null;
  }

  const groupedByStore = items.reduce(
    (acc, item) => {
      if (!acc[item.storeName]) {
        acc[item.storeName] = [];
      }
      acc[item.storeName].push(item);
      return acc;
    },
    {} as Record<string, typeof items>
  );

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Floating Cart Button */}
      {!isOpen && items.length > 0 && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-16 w-16 shadow-lg hover:shadow-xl transition-all"
        >
          <div className="flex flex-col items-center">
            <ShoppingBag className="w-6 h-6" />
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {items.length}
            </Badge>
          </div>
        </Button>
      )}

      {/* Cart Panel */}
      {isOpen && (
        <Card className="absolute bottom-0 right-0 w-96 max-h-96 shadow-2xl border-2 border-primary overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
            <h3 className="font-bold text-lg">Your Cart</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:opacity-80"
            >
              ✕
            </button>
          </div>

          {/* Items List */}
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <p className="text-muted-foreground text-center">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {Object.entries(groupedByStore).map(([store, storeItems]) => (
                  <div key={store}>
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                      {store}
                    </p>
                    <div className="space-y-2">
                      {storeItems.map((item) => (
                        <div
                          key={`${item.productId}-${item.storeName}`}
                          className="flex items-center justify-between bg-muted/50 p-2 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              R{(item.price / 100).toFixed(2)}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-border rounded">
                              <button
                                onClick={() =>
                                  updateQuantity(item.productId, item.storeName, item.quantity - 1)
                                }
                                className="px-2 py-1 hover:bg-muted text-sm"
                              >
                                −
                              </button>
                              <span className="px-2 py-1 text-sm font-semibold min-w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.productId, item.storeName, item.quantity + 1)
                                }
                                className="px-2 py-1 hover:bg-muted text-sm"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.productId, item.storeName)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    R{total.toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => clearCart()}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Clear
                  </Button>
                  <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 flex items-center justify-center gap-2" onClick={() => window.location.href = '/checkout'}>
                    Checkout
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
