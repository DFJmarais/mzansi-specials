import { Wallet, TrendingUp, Gift, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const CashbackRewards = () => {
  const cashbackBalance = 247.50;
  const totalEarned = 1250.00;
  const tier = 'Silver';

  const transactions = [
    { date: '2026-03-24', store: 'Spar', amount: 125.50, cashback: 1.25, tier: '1%' },
    { date: '2026-03-23', store: 'Checkers', amount: 89.99, cashback: 2.70, tier: '3%' },
    { date: '2026-03-22', store: 'Pick n Pay', amount: 156.00, cashback: 1.56, tier: '1%' },
    { date: '2026-03-21', store: 'Woolworths', amount: 203.50, cashback: 10.17, tier: '5%' },
    { date: '2026-03-20', store: 'OK Foods', amount: 67.25, cashback: 0.67, tier: '1%' },
  ];

  const tiers = [
    { name: 'Free', cashback: '1%', requirements: 'Always available', current: false },
    { name: 'Silver', cashback: '3%', requirements: 'Premium subscriber', current: true },
    { name: 'Gold', cashback: '5%', requirements: 'R5000+ spent this month', current: false },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wallet className="w-8 h-8 text-accent" />
          <h2 className="text-2xl font-bold text-foreground">Cashback & Rewards</h2>
        </div>
        <Button className="gap-2 bg-accent hover:bg-accent/90">
          <ArrowUpRight className="w-4 h-4" />
          Withdraw
        </Button>
      </div>

      {/* Cashback Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/50">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-4xl font-bold text-accent">R{cashbackBalance.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Minimum R50 to withdraw</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-secondary/20 to-secondary/5 border-2 border-secondary/50">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Earned</p>
            <p className="text-4xl font-bold text-secondary">R{totalEarned.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/50">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Current Tier</p>
            <div className="flex items-center gap-2">
              <p className="text-4xl font-bold text-primary">{tier}</p>
              <Badge className="bg-secondary text-white">3% Cashback</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Premium subscriber</p>
          </div>
        </Card>
      </div>

      {/* Cashback Tiers */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Cashback Tiers</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map((tierOption) => (
            <Card
              key={tierOption.name}
              className={`p-4 border-2 transition-all ${
                tierOption.current
                  ? 'border-accent/50 bg-accent/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">{tierOption.name}</h4>
                  {tierOption.current && (
                    <Badge className="bg-accent text-white text-xs">Current</Badge>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-3xl font-bold text-accent">{tierOption.cashback}</p>
                  <p className="text-xs text-muted-foreground">Cashback rate</p>
                </div>

                <p className="text-sm text-muted-foreground">{tierOption.requirements}</p>

                {!tierOption.current && (
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Upgrade
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Recent Transactions</h3>

        <div className="space-y-2">
          {transactions.map((tx, idx) => (
            <Card key={idx} className="p-4 border-border hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground">{tx.store}</p>
                    <Badge variant="outline" className="text-xs">{tx.tier}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-medium text-foreground">R{tx.amount.toFixed(2)}</p>
                  <p className="text-sm font-semibold text-accent">+R{tx.cashback.toFixed(2)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <Card className="p-6 bg-primary/5 border-2 border-primary/20">
        <h3 className="font-semibold text-foreground mb-4">How Cashback Works</h3>

        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-accent font-bold">1</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Shop & Earn</p>
              <p className="text-sm text-muted-foreground">Get cashback on every purchase (1-5% depending on tier)</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-accent font-bold">2</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Accumulate</p>
              <p className="text-sm text-muted-foreground">Cashback is added to your wallet automatically</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-accent font-bold">3</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Withdraw</p>
              <p className="text-sm text-muted-foreground">Withdraw to your bank account (minimum R50)</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-accent font-bold">4</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Level Up</p>
              <p className="text-sm text-muted-foreground">Reach higher tiers for better cashback rates</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Benefits Card */}
      <Card className="p-6 bg-gradient-to-r from-accent/10 to-secondary/10 border-2 border-accent/30">
        <div className="flex gap-4">
          <Gift className="w-8 h-8 text-accent flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-foreground mb-1">Bonus Cashback Events</h4>
            <p className="text-sm text-muted-foreground">
              Get 2x-5x cashback during special promotions. Subscribe to notifications to never miss a deal!
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              Enable Notifications
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
