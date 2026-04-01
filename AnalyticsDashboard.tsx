import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { TrendingUp, Users, Search, Barcode, Receipt, AlertCircle } from 'lucide-react';

// Mock analytics data
const searchData = [
  { product: 'Milk', searches: 1240 },
  { product: 'Bread', searches: 980 },
  { product: 'Chicken', searches: 850 },
  { product: 'Rice', searches: 720 },
  { product: 'Eggs', searches: 650 },
];

const scanData = [
  { date: 'Mon', barcodes: 45, receipts: 12 },
  { date: 'Tue', barcodes: 52, receipts: 18 },
  { date: 'Wed', barcodes: 48, receipts: 15 },
  { date: 'Thu', barcodes: 61, receipts: 22 },
  { date: 'Fri', barcodes: 55, receipts: 19 },
  { date: 'Sat', barcodes: 67, receipts: 28 },
  { date: 'Sun', barcodes: 42, receipts: 14 },
];

const retailerData = [
  { name: 'Checkers', value: 28, color: '#FF6B35' },
  { name: 'Pick n Pay', value: 22, color: '#FFCC00' },
  { name: 'SPAR', value: 20, color: '#00A651' },
  { name: 'Woolworths', value: 18, color: '#0066CC' },
  { name: 'OK Foods', value: 12, color: '#8E24AA' },
];

const trendingProducts = [
  { rank: 1, product: 'Coca-Cola 2L', scans: 156, price: 'R24.99', trend: '↑ 12%' },
  { rank: 2, product: 'Bread White 700g', scans: 142, price: 'R8.99', trend: '↑ 8%' },
  { rank: 3, product: 'Chicken Breast 1kg', scans: 128, price: 'R59.99', trend: '↓ 3%' },
  { rank: 4, product: 'Rice 5kg', scans: 115, price: 'R79.99', trend: '↑ 15%' },
  { rank: 5, product: 'Milk 1L', scans: 108, price: 'R18.99', trend: '↑ 5%' },
];

const stats = [
  { label: 'Total Users', value: '2,450', icon: Users, color: 'text-blue-500' },
  { label: 'Searches Today', value: '1,240', icon: Search, color: 'text-green-500' },
  { label: 'Barcodes Scanned', value: '370', icon: Barcode, color: 'text-orange-500' },
  { label: 'Receipts Uploaded', value: '128', icon: Receipt, color: 'text-purple-500' },
];

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="p-4 border-border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <Icon className={`w-6 h-6 ${stat.color} opacity-50`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Barcode & Receipt Scans */}
        <Card className="p-6 border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">Weekly Scans</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={scanData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="barcodes" stroke="#FF6B35" strokeWidth={2} name="Barcode Scans" />
              <Line type="monotone" dataKey="receipts" stroke="#FFCC00" strokeWidth={2} name="Receipt Uploads" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Retailer Distribution */}
        <Card className="p-6 border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">Retailer Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={retailerData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {retailerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Searches */}
        <Card className="p-6 border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">Top Searched Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={searchData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="product" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="searches" fill="#00A651" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Trending Products */}
        <Card className="p-6 border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">Trending Products</h3>
          <div className="space-y-3">
            {trendingProducts.map((product) => (
              <div key={product.rank} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-primary">#{product.rank}</span>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{product.product}</p>
                    <p className="text-xs text-muted-foreground">{product.scans} scans</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground text-sm">{product.price}</p>
                  <p className={`text-xs font-semibold ${product.trend.includes('↑') ? 'text-green-600' : 'text-red-600'}`}>
                    {product.trend}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* System Health */}
      <Card className="p-6 border-border bg-accent/5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-foreground mb-2">System Health</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ API Response Time: 145ms (Excellent)</li>
              <li>✓ Database Queries: 2,340 today (Normal)</li>
              <li>✓ Twilio SMS Queue: 12 pending (Normal)</li>
              <li>✓ Image Processing: 89% complete</li>
              <li>⚠ Price Scraper: 3 retailers offline (Check connections)</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
