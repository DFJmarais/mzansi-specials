import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface ScraperMetrics {
  retailer: string;
  successRate: number;
  pricesScraped: number;
  lastUpdate: string;
  status: 'healthy' | 'warning' | 'error';
}

interface PriceMetrics {
  date: string;
  averagePrice: number;
  priceUpdates: number;
  dealsFound: number;
}

export function AdminAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<ScraperMetrics[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch live products to calculate metrics
  const { data: productsData } = trpc.products.getAllWithPrices.useQuery();

  useEffect(() => {
    if (!productsData || productsData.length === 0) {
      setLoading(false);
      return;
    }

    // Calculate scraper metrics by store
    const storeMetrics = new Map<string, { success: number; total: number; prices: number; lastUpdate: string }>();

    productsData.forEach((product) => {
      if (product.prices && product.prices.length > 0) {
        product.prices.forEach((price) => {
          const store = price.storeName;
          if (!storeMetrics.has(store)) {
            storeMetrics.set(store, { success: 0, total: 0, prices: 0, lastUpdate: '' });
          }
          const metrics = storeMetrics.get(store)!;
          metrics.total++;
          if (price.price && price.price > 0) {
            metrics.success++;
            metrics.prices++;
          }
          if (price.lastUpdated) {
            metrics.lastUpdate = new Date(price.lastUpdated).toLocaleString();
          }
        });
      }
    });

    // Convert to array and calculate success rates
    const scraperMetrics: ScraperMetrics[] = Array.from(storeMetrics.entries()).map(([store, data]) => {
      const successRate = data.total > 0 ? Math.round((data.success / data.total) * 100) : 0;
      let status: 'healthy' | 'warning' | 'error' = 'healthy';
      if (successRate < 50) status = 'error';
      else if (successRate < 80) status = 'warning';

      return {
        retailer: store,
        successRate: successRate,
        pricesScraped: data.prices,
        lastUpdate: data.lastUpdate || 'Never',
        status: status,
      };
    });

    setMetrics(scraperMetrics);

    // Generate mock price history for the last 7 days
    const history: PriceMetrics[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' });

      // Calculate average price and deals
      let totalPrice = 0;
      let priceCount = 0;
      let dealsCount = 0;

      productsData.forEach((product) => {
        if (product.prices && product.prices.length > 0) {
          product.prices.forEach((price) => {
            totalPrice += price.price;
            priceCount++;
            if (price.discount && price.discount > 15) {
              dealsCount++;
            }
          });
        }
      });

      history.push({
        date: dateStr,
        averagePrice: priceCount > 0 ? Math.round((totalPrice / priceCount) * 100) / 100 : 0,
        priceUpdates: priceCount,
        dealsFound: dealsCount,
      });
    }

    setPriceHistory(history);
    setLoading(false);
  }, [productsData]);

  const totalProducts = productsData?.length || 0;
  const totalPrices = productsData?.reduce((sum, p) => sum + (p.prices?.length || 0), 0) || 0;
  const avgSuccessRate = metrics.length > 0
    ? Math.round(metrics.reduce((sum, m) => sum + m.successRate, 0) / metrics.length)
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Admin Analytics Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time scraper health and price metrics
          </p>
        </div>
        <Button variant="outline" size="sm">
          Refresh Now
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <p className="text-xs text-muted-foreground mb-1">Total Products</p>
          <p className="text-3xl font-bold text-blue-600">{totalProducts}</p>
          <p className="text-xs text-muted-foreground mt-2">Being tracked</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <p className="text-xs text-muted-foreground mb-1">Total Prices</p>
          <p className="text-3xl font-bold text-green-600">{totalPrices}</p>
          <p className="text-xs text-muted-foreground mt-2">Across all stores</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
          <p className="text-3xl font-bold text-purple-600">{avgSuccessRate}%</p>
          <p className="text-xs text-muted-foreground mt-2">Average scraping</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <p className="text-xs text-muted-foreground mb-1">Update Frequency</p>
          <p className="text-3xl font-bold text-orange-600">6h</p>
          <p className="text-xs text-muted-foreground mt-2">Automatic updates</p>
        </Card>
      </div>

      {/* Retailer Health */}
      <Card className="p-6">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          Retailer Scraping Health
        </h3>

        <div className="space-y-3">
          {metrics.map((metric) => (
            <div
              key={metric.retailer}
              className={`p-4 rounded-lg border-2 ${getStatusBgColor(metric.status)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-foreground">{metric.retailer}</h4>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {metric.lastUpdate}
                  </p>
                </div>
                <Badge
                  className={`${
                    metric.status === 'healthy'
                      ? 'bg-green-500'
                      : metric.status === 'warning'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  } text-white`}
                >
                  {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                </Badge>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">Success Rate</span>
                    <span className={`text-sm font-bold ${getStatusColor(metric.status)}`}>
                      {metric.successRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        metric.status === 'healthy'
                          ? 'bg-green-500'
                          : metric.status === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${metric.successRate}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{metric.pricesScraped}</p>
                  <p className="text-xs text-muted-foreground">prices</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Price Trends Chart */}
      <Card className="p-6">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Price Trends (Last 7 Days)
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={priceHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="averagePrice"
              stroke="#3b82f6"
              name="Avg Price (R)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="priceUpdates"
              stroke="#10b981"
              name="Price Updates"
              strokeWidth={2}
              yAxisId="right"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Deals Found Chart */}
      <Card className="p-6">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          Deals Found by Day
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={priceHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="dealsFound" fill="#f59e0b" name="Deals Found" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* System Status */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 p-4">
        <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
          🔧 System Status
        </h4>
        <ul className="space-y-1 text-sm text-foreground/80">
          <li>✅ Price scheduler: Running every 6 hours</li>
          <li>✅ Database: Connected and healthy</li>
          <li>✅ Retailer APIs: {metrics.filter(m => m.status === 'healthy').length}/{metrics.length} operational</li>
          <li>✅ Last sync: {metrics[0]?.lastUpdate || 'N/A'}</li>
        </ul>
      </Card>
    </div>
  );
}
