import { useState } from 'react';
import { Crown, Check, X, Zap, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SubscriptionTier {
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: { name: string; included: boolean }[];
  highlighted: boolean;
}

export const PremiumSubscription = () => {
  const [selectedTier, setSelectedTier] = useState<string>('free');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const tiers: SubscriptionTier[] = [
    {
      name: 'Free',
      price: 0,
      currency: 'R',
      period: 'Forever',
      description: 'Perfect for casual shoppers',
      highlighted: false,
      features: [
        { name: 'Price comparison (6 stores)', included: true },
        { name: 'Store locator', included: true },
        { name: 'Wishlist (10 items max)', included: true },
        { name: 'Price history (30 days)', included: true },
        { name: 'Basic notifications', included: true },
        { name: 'Ad-free experience', included: false },
        { name: 'Priority price alerts', included: false },
        { name: 'Exclusive weekly deals', included: false },
        { name: 'Advanced recommendations', included: false },
        { name: '1-year price history', included: false },
      ],
    },
    {
      name: 'Premium',
      price: 49,
      currency: 'R',
      period: '/month',
      description: 'For serious savers',
      highlighted: true,
      features: [
        { name: 'Price comparison (6 stores)', included: true },
        { name: 'Store locator', included: true },
        { name: 'Unlimited wishlist', included: true },
        { name: 'Price history (1 year)', included: true },
        { name: 'Priority price alerts', included: true },
        { name: 'Ad-free experience', included: true },
        { name: 'Exclusive weekly deals', included: true },
        { name: 'Advanced recommendations', included: true },
        { name: 'Loyalty program integration', included: true },
        { name: 'Recurring order (Subscribe & Save)', included: true },
      ],
    },
  ];

  const freeTier = tiers.find((t) => t.name === 'Free')!;
  const premiumTier = tiers.find((t) => t.name === 'Premium')!;

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Crown className="w-8 h-8 text-accent" />
          <h2 className="text-3xl font-bold text-foreground">Upgrade to Premium</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get exclusive features, priority alerts, and unlimited access to save even more on your groceries
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Tier */}
        <Card className="p-6 border-2 border-border hover:border-primary/30 transition-all relative">
          <div className="space-y-4">
            {/* Header */}
            <div>
              <h3 className="text-2xl font-bold text-foreground">{freeTier.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{freeTier.description}</p>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">{freeTier.currency}{freeTier.price}</span>
                <span className="text-muted-foreground">{freeTier.period}</span>
              </div>
              <p className="text-xs text-muted-foreground">No credit card required</p>
            </div>

            {/* CTA */}
            <Button
              variant="outline"
              className="w-full"
              disabled
            >
              Your Current Plan
            </Button>

            {/* Features */}
            <div className="space-y-3 pt-4 border-t border-border">
              {freeTier.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  )}
                  <span
                    className={`text-sm ${
                      feature.included ? 'text-foreground' : 'text-muted-foreground line-through'
                    }`}
                  >
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Premium Tier */}
        <Card className="p-6 border-2 border-accent/50 bg-gradient-to-br from-accent/10 to-secondary/10 relative">
          <div className="absolute -top-3 right-6">
            <Badge className="bg-accent text-white">Most Popular</Badge>
          </div>

          <div className="space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-bold text-foreground">{premiumTier.name}</h3>
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground">{premiumTier.description}</p>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-accent">{premiumTier.currency}{premiumTier.price}</span>
                <span className="text-muted-foreground">{premiumTier.period}</span>
              </div>
              <p className="text-xs text-muted-foreground">Cancel anytime, no commitment</p>
            </div>

            {/* CTA */}
            <Button
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold"
              onClick={() => setShowPaymentModal(true)}
            >
              Upgrade to Premium
            </Button>

            {/* Features */}
            <div className="space-y-3 pt-4 border-t border-accent/20">
              {premiumTier.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  )}
                  <span
                    className={`text-sm ${
                      feature.included ? 'text-foreground font-medium' : 'text-muted-foreground line-through'
                    }`}
                  >
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Savings Badge */}
            <div className="mt-4 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
              <p className="text-xs text-muted-foreground">
                💰 <span className="font-semibold text-secondary">Save up to R200/month</span> with exclusive deals
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <Card className="p-6 bg-primary/5 border-2 border-primary/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Complete Your Upgrade</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="bg-white p-4 rounded-lg border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-foreground">Mzansi Specials Premium</span>
                <span className="font-bold text-foreground">R49/month</span>
              </div>
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-accent">R49</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Payment Method</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border-2 border-border rounded-lg cursor-pointer hover:border-primary">
                  <input type="radio" name="payment" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-foreground">Credit/Debit Card</span>
                </label>
                <label className="flex items-center gap-3 p-3 border-2 border-border rounded-lg cursor-pointer hover:border-primary">
                  <input type="radio" name="payment" className="w-4 h-4" />
                  <span className="text-sm text-foreground">Instant EFT (Zapper/Snapscan)</span>
                </label>
                <label className="flex items-center gap-3 p-3 border-2 border-border rounded-lg cursor-pointer hover:border-primary">
                  <input type="radio" name="payment" className="w-4 h-4" />
                  <span className="text-sm text-foreground">Wallet (PayPal/Skrill)</span>
                </label>
              </div>
            </div>

            {/* Info */}
            <div className="flex gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-xs text-blue-700">
                Your subscription will renew automatically. You can cancel anytime from your account settings.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-accent hover:bg-accent/90 text-white"
                onClick={() => {
                  // Handle payment
                  console.log('Processing payment...');
                  setShowPaymentModal(false);
                }}
              >
                Continue to Payment
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* FAQ */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Frequently Asked Questions</h3>

        <div className="space-y-3">
          {[
            {
              q: 'Can I cancel anytime?',
              a: 'Yes! Cancel your subscription anytime from your account settings. No questions asked.',
            },
            {
              q: 'Is there a free trial?',
              a: 'We offer a 7-day free trial for new Premium subscribers. No credit card required to start.',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept credit/debit cards, instant EFT (Zapper/Snapscan), and digital wallets (PayPal/Skrill).',
            },
            {
              q: 'Will my wishlist data be lost if I downgrade?',
              a: 'No! Your data is preserved. If you downgrade, your wishlist will be limited to 10 items, but all existing items are saved.',
            },
          ].map((faq, idx) => (
            <Card key={idx} className="p-4 border-border">
              <p className="font-semibold text-foreground mb-2">{faq.q}</p>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
