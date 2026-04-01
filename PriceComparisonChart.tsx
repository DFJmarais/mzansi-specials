import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PricePoint {
  date: string;
  [store: string]: string | number;
}

interface PriceComparisonChartProps {
  productName: string;
  data: PricePoint[];
  stores: string[];
  className?: string;
}

const STORE_COLORS: Record<string, string> = {
  'Spar': '#FF6B35',
  'Pick n Pay': '#FFB81C',
  'Checkers': '#007A5E',
  'OK Foods': '#00A896',
  'ShopRite': '#D2691E',
  'Woolworths': '#002395',
};

export function PriceComparisonChart({
  productName,
  data,
  stores,
  className,
}: PriceComparisonChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className={cn('p-6', className)}>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No price history available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('p-6', className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{productName}</h3>
        <p className="text-sm text-muted-foreground">30-Day Price Trend</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
          <XAxis 
            dataKey="date" 
            stroke="#666666"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#666666"
            style={{ fontSize: '12px' }}
            label={{ value: 'Price (R)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E5E5',
              borderRadius: '0.5rem',
            }}
            formatter={(value) => `R${Number(value).toFixed(2)}`}
          />
          <Legend />
          {stores.map((store) => (
            <Line
              key={store}
              type="monotone"
              dataKey={store}
              stroke={STORE_COLORS[store] || '#FFB81C'}
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {stores.map((store) => {
          const prices = data
            .map((d) => Number(d[store]))
            .filter((p) => !isNaN(p));
          
          if (prices.length === 0) return null;

          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
          const currentPrice = prices[prices.length - 1];

          return (
            <div
              key={store}
              className="p-3 rounded-lg bg-muted/50 border border-border"
            >
              <p className="text-sm font-medium text-foreground">{store}</p>
              <p className="text-lg font-bold text-primary mt-1">
                R{currentPrice.toFixed(2)}
              </p>
              <div className="text-xs text-muted-foreground mt-2 space-y-1">
                <p>Min: R{minPrice.toFixed(2)}</p>
                <p>Max: R{maxPrice.toFixed(2)}</p>
                <p>Avg: R{avgPrice.toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
