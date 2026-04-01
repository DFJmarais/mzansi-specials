import { useState } from 'react';
import { ShoppingCart, TrendingDown, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BasketItem {
  id: number;
  name: string;
  quantity: number;
  prices: {
    [retailer: string]: number;
  };
}

interface RetailerTotal {
  retailer: string;
  total: number;
  savings: number;
  itemCount: number;
}

interface SmartBasketCalculatorProps {
  items: BasketItem[];
  retailers: string[];
}

export default function SmartBasketCalculator({
  items = [],
  retailers = ['Checkers', 'Pick n Pay', 'SPAR', 'Woolworths', 'OK Foods', 'Food Lovers Market'],
}: SmartBasketCalculatorProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  if (items.length === 0) {
    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 text-center">
        <AlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Basket Calculator</h3>
        <p className="text-gray-700">Add items to your shopping list to see the optimal retailer combinations and maximum savings.</p>
      </div>
    );
  }

  // Calculate totals for each retailer
  const retailerTotals: RetailerTotal[] = retailers.map(retailer => {
    let total = 0;
    let itemCount = 0;

    selectedItems.forEach(itemId => {
      const item = items.find(i => i.id === itemId);
      if (item && item.prices[retailer]) {
        total += item.prices[retailer] * item.quantity;
        itemCount += item.quantity;
      }
    });

    return {
      retailer,
      total,
      savings: 0,
      itemCount,
    };
  }).filter(r => r.itemCount > 0);

  // Calculate savings compared to most expensive
  if (retailerTotals.length > 0) {
    const maxTotal = Math.max(...retailerTotals.map(r => r.total));
    retailerTotals.forEach(r => {
      r.savings = maxTotal - r.total;
    });
  }

  // Sort by total price
  const sortedRetailers = [...retailerTotals].sort((a, b) => a.total - b.total);
  const cheapestRetailer = sortedRetailers[0];
  const mostExpensiveRetailer = sortedRetailers[sortedRetailers.length - 1];
  const totalSavings = mostExpensiveRetailer.total - cheapestRetailer.total;

  // Calculate optimal basket (mix of retailers for each item)
  const optimalBasket = calculateOptimalBasket(selectedItems, items, retailers);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cheapest Option */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-300">
          <div className="text-sm font-bold text-green-700 mb-2">CHEAPEST OPTION</div>
          <div className="text-3xl font-bold text-green-900 mb-2">
            R{cheapestRetailer.total.toFixed(2)}
          </div>
          <div className="text-lg font-semibold text-green-800">{cheapestRetailer.retailer}</div>
          <div className="text-sm text-green-700 mt-2">
            {cheapestRetailer.itemCount} items
          </div>
        </div>

        {/* Most Expensive */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border-2 border-red-300">
          <div className="text-sm font-bold text-red-700 mb-2">MOST EXPENSIVE</div>
          <div className="text-3xl font-bold text-red-900 mb-2">
            R{mostExpensiveRetailer.total.toFixed(2)}
          </div>
          <div className="text-lg font-semibold text-red-800">{mostExpensiveRetailer.retailer}</div>
          <div className="text-sm text-red-700 mt-2">
            {mostExpensiveRetailer.itemCount} items
          </div>
        </div>

        {/* Total Savings */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-300">
          <div className="text-sm font-bold text-blue-700 mb-2">TOTAL SAVINGS</div>
          <div className="text-3xl font-bold text-blue-900 mb-2">
            R{totalSavings.toFixed(2)}
          </div>
          <div className="text-lg font-semibold text-blue-800">
            {((totalSavings / mostExpensiveRetailer.total) * 100).toFixed(0)}% off
          </div>
          <div className="text-sm text-blue-700 mt-2">vs most expensive</div>
        </div>
      </div>

      {/* Retailer Comparison Table */}
      <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
        <div className="p-6 border-b-2 border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">Price Comparison by Retailer</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="text-left py-4 px-6 font-bold text-gray-900">Retailer</th>
                <th className="text-right py-4 px-6 font-bold text-gray-900">Total Cost</th>
                <th className="text-right py-4 px-6 font-bold text-gray-900">Savings</th>
                <th className="text-right py-4 px-6 font-bold text-gray-900">Items</th>
                <th className="text-center py-4 px-6 font-bold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedRetailers.map((retailer, idx) => {
                const isCheapest = retailer.total === cheapestRetailer.total;
                return (
                  <tr
                    key={retailer.retailer}
                    className={`border-b border-gray-200 ${
                      isCheapest ? 'bg-green-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="font-bold text-gray-900">{retailer.retailer}</div>
                        {isCheapest && (
                          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full font-bold">
                            BEST PRICE
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-right py-4 px-6">
                      <div className="text-2xl font-bold text-gray-900">
                        R{retailer.total.toFixed(2)}
                      </div>
                    </td>
                    <td className="text-right py-4 px-6">
                      <div className="font-bold text-green-600">
                        R{retailer.savings.toFixed(2)}
                      </div>
                    </td>
                    <td className="text-right py-4 px-6 font-semibold text-gray-900">
                      {retailer.itemCount}
                    </td>
                    <td className="text-center py-4 px-6">
                      <Button
                        className={`${
                          isCheapest
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                        } px-4 py-2 rounded-lg font-semibold transition-colors`}
                      >
                        {isCheapest ? 'Shop Here' : 'View'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optimal Basket Recommendation */}
      {optimalBasket.totalSavings > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-purple-300">
          <div className="flex items-start gap-4">
            <TrendingDown className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Smart Shopping Recommendation</h3>
              <p className="text-gray-700 mb-4">
                By shopping at different retailers for specific items, you can save even more!
              </p>
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="text-lg font-bold text-purple-600 mb-3">
                  Optimal Basket Total: R{optimalBasket.total.toFixed(2)}
                </div>
                <div className="text-2xl font-bold text-green-600 mb-4">
                  Save R{optimalBasket.totalSavings.toFixed(2)} more!
                </div>
                <div className="space-y-2">
                  {optimalBasket.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-700">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>
                        <strong>{rec.item}</strong> at <strong>{rec.retailer}</strong> (R{rec.price.toFixed(2)})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-lg">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Create Optimized Shopping List
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Item Breakdown */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Item Breakdown</h3>
        <div className="space-y-4">
          {selectedItems.map(itemId => {
            const item = items.find(i => i.id === itemId);
            if (!item) return null;

            const prices = Object.entries(item.prices)
              .map(([retailer, price]) => ({ retailer, price: price as number }))
              .sort((a, b) => a.price - b.price);

            const cheapest = prices[0];
            const mostExpensive = prices[prices.length - 1];

            return (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-bold text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      R{cheapest.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600 line-through">
                      R{mostExpensive.price.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {prices.map((p, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        p.price === cheapest.price
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {p.retailer}: R{p.price.toFixed(2)}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function calculateOptimalBasket(
  selectedItems: number[],
  items: BasketItem[],
  retailers: string[]
) {
  const recommendations: Array<{
    item: string;
    retailer: string;
    price: number;
  }> = [];

  let total = 0;

  selectedItems.forEach(itemId => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    // Find cheapest retailer for this item
    let cheapestRetailer = retailers[0];
    let cheapestPrice = item.prices[retailers[0]] || Infinity;

    for (const retailer of retailers) {
      const price = item.prices[retailer];
      if (price && price < cheapestPrice) {
        cheapestPrice = price;
        cheapestRetailer = retailer;
      }
    }

    recommendations.push({
      item: item.name,
      retailer: cheapestRetailer,
      price: cheapestPrice * item.quantity,
    });

    total += cheapestPrice * item.quantity;
  });

  // Calculate savings vs most expensive option
  let maxTotal = 0;
  selectedItems.forEach(itemId => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    let maxPrice = 0;
    for (const retailer of retailers) {
      const price = item.prices[retailer];
      if (price && price > maxPrice) {
        maxPrice = price;
      }
    }
    maxTotal += maxPrice * item.quantity;
  });

  return {
    total,
    totalSavings: maxTotal - total,
    recommendations,
  };
}
