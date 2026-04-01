import { useState } from 'react';
import { Repeat2, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface RecurringOrder {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  nextDelivery: string;
  discount: number;
  active: boolean;
}

export const RecurringOrders = () => {
  const [orders, setOrders] = useState<RecurringOrder[]>([
    {
      id: '1',
      productName: 'Full Cream Milk (1L)',
      quantity: 2,
      unit: 'bottles',
      frequency: 'weekly',
      nextDelivery: '2026-03-31',
      discount: 5,
      active: true,
    },
    {
      id: '2',
      productName: 'Bread (White Loaf)',
      quantity: 1,
      unit: 'loaf',
      frequency: 'biweekly',
      nextDelivery: '2026-04-07',
      discount: 5,
      active: true,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const frequencyLabels = {
    daily: 'Every day',
    weekly: 'Every week',
    biweekly: 'Every 2 weeks',
    monthly: 'Every month',
  };

  const totalSavings = orders.reduce((sum, order) => sum + order.discount, 0);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Repeat2 className="w-8 h-8 text-accent" />
          <h2 className="text-2xl font-bold text-foreground">Subscribe & Save</h2>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="gap-2 bg-accent hover:bg-accent/90"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {orders.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-secondary/20 to-accent/20 border-2 border-secondary/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Active Subscriptions</p>
              <p className="text-3xl font-bold text-secondary">{orders.filter((o) => o.active).length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Monthly Savings</p>
              <p className="text-3xl font-bold text-accent">R{totalSavings.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Next Delivery</p>
              <p className="text-3xl font-bold text-primary">
                {orders.length > 0 ? new Date(orders[0].nextDelivery).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {orders.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Your Subscriptions</h3>

          <div className="space-y-3">
            {orders.map((order) => (
              <Card key={order.id} className="p-4 border-2 border-border hover:border-secondary/50 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">{order.productName}</h4>
                      {order.active ? (
                        <Badge className="bg-secondary text-white text-xs">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Paused</Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Quantity</p>
                        <p className="font-medium text-foreground">
                          {order.quantity} {order.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Frequency</p>
                        <p className="font-medium text-foreground">{frequencyLabels[order.frequency]}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Next Delivery</p>
                        <p className="font-medium text-foreground">
                          {new Date(order.nextDelivery).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Discount</p>
                        <p className="font-medium text-accent">{order.discount}% OFF</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingId(order.id)}
                    >
                      <Edit2 className="w-4 h-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setOrders(orders.filter((o) => o.id !== order.id))}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {showAddModal && (
        <Card className="p-6 bg-primary/5 border-2 border-primary/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Add Recurring Order</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Product</label>
                <input
                  type="text"
                  placeholder="Search for a product..."
                  className="w-full mt-1 px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Quantity</label>
                  <input
                    type="number"
                    placeholder="1"
                    className="w-full mt-1 px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Unit</label>
                  <select className="w-full mt-1 px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm">
                    <option>bottles</option>
                    <option>loaves</option>
                    <option>kg</option>
                    <option>liters</option>
                    <option>packs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Frequency</label>
                <select className="w-full mt-1 px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm">
                  <option value="daily">Every day</option>
                  <option value="weekly">Every week</option>
                  <option value="biweekly">Every 2 weeks</option>
                  <option value="monthly">Every month</option>
                </select>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700">
                  💰 <span className="font-semibold">Save 5% on recurring orders!</span> We'll automatically find the cheapest store for each delivery.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => {
                    console.log('Adding recurring order');
                    setShowAddModal(false);
                  }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Subscribe
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-primary/5 border-2 border-primary/20">
        <h3 className="font-semibold text-foreground mb-4">How Subscribe & Save Works</h3>

        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-accent font-bold">1</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Select Items</p>
              <p className="text-sm text-muted-foreground">Choose products you buy regularly and set delivery frequency</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-accent font-bold">2</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Get 5% Discount</p>
              <p className="text-sm text-muted-foreground">Automatic 5% off all recurring items every delivery</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-accent font-bold">3</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Smart Shopping</p>
              <p className="text-sm text-muted-foreground">We find the cheapest store for each item automatically</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-accent font-bold">4</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Flexible Control</p>
              <p className="text-sm text-muted-foreground">Pause, skip, or cancel any subscription anytime</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
