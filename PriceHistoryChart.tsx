import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PricePoint {
  date: string;
  [key: string]: string | number;
}

interface PriceHistoryProps {
  productName: string;
  currentPrice: number;
  priceHistory: PricePoint[];
  store: string;
  stores?: string[];
}

export const PriceHistoryChart = ({
  productName,
  currentPrice,
  priceHistory,
  store,
  stores = [store],
}: PriceHistoryProps) => {
  const oldestPrice = (priceHistory[0]?.price as number) || currentPrice;
  const priceChange = currentPrice - (oldestPrice as number);
  const percentChange = ((priceChange / (oldestPrice as number)) * 100).toFixed(1);
  const isIncreasing = priceChange > 0;
  
  // Handle both single store and multi-store data
  const chartData = priceHistory.map(point => ({
    ...point,
    price: typeof point.price === 'number' ? (point.price / 100) : point.price
  }));

  return (
    <Card className="p-6 border-2 border-primary/20">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">{productName}</h3>
            <p className="text-sm text-muted-foreground">Price history at {store}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-foreground">R{currentPrice.toFixed(2)}</p>
            <div className="flex items-center gap-2 justify-end mt-1">
              {isIncreasing ? (
                <>
                  <TrendingUp className="w-4 h-4 text-red-500" />
                  <Badge className="bg-red-100 text-red-700 border-0">+{percentChange}%</Badge>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-green-500" />
                  <Badge className="bg-green-100 text-green-700 border-0">{percentChange}%</Badge>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Price (R)', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                formatter={(value: any) => `R${typeof value === 'number' ? value.toFixed(2) : value}`}
                contentStyle={{ backgroundColor: '#f5f5f5', border: '1px solid #ddd' }}
              />
              <Legend />
              {stores.map((storeName, idx) => {
                const colors = ['#e03c31', '#007a5e', '#3b82f6', '#f59e0b', '#8b5cf6'];
                return (
                  <Line
                    key={storeName}
                    type="monotone"
                    dataKey={storeName}
                    stroke={colors[idx % colors.length]}
                    dot={{ r: 3 }}
                    strokeWidth={2}
                    name={storeName}
                  />
                );
              })}
              {stores.length === 1 && (
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={isIncreasing ? '#e03c31' : '#007a5e'}
                  dot={{ fill: isIncreasing ? '#e03c31' : '#007a5e' }}
                  strokeWidth={2}
                  name="Price"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Highest</p>
            <p className="text-lg font-bold text-foreground">
              R{Math.max(...chartData.map((p) => typeof p.price === 'number' ? p.price : 0)).toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Lowest</p>
            <p className="text-lg font-bold text-foreground">
              R{Math.min(...chartData.map((p) => typeof p.price === 'number' ? p.price : 0)).toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Average</p>
            <p className="text-lg font-bold text-foreground">
              R{(chartData.reduce((sum, p) => sum + (typeof p.price === 'number' ? p.price : 0), 0) / chartData.length).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Mock price history data generator
export const generateMockPriceHistory = (basePrice: number): PricePoint[] => {
  const data: PricePoint[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const variance = (Math.random() - 0.5) * 0.15;
    const price = Math.round((basePrice * (1 + variance)) * 100) / 100;

    data.push({
      date: date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' }),
      price,
    });
  }

  return data;
};
