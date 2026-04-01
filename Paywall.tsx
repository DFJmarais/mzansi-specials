import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/contexts/SubscriptionContext';

export const Paywall: React.FC = () => {
  const { setTier, tier } = useSubscription();

  const tiers = [
    {
      name: 'Free',
      price: 'R0',
      period: 'Forever',
      description: 'Limited access to get started',
      features: {
        'View 50 products': true,
        'Basic search': true,
        'Price alerts': false,
        'Shopping lists': false,
        'Barcode scanning': false,
        'Receipt OCR': false,
        'Analytics': false,
        'Priority support': false,
      },
      id: 'free',
      highlighted: false,
    },
    {
      name: 'Plus',
      price: 'R19.99',
      period: '/month',
      description: 'Full access to all features',
      features: {
        'View 1,500+ products': true,
        'Advanced search': true,
        'Price alerts': true,
        'Shopping lists': true,
        'Barcode scanning': true,
        'Receipt OCR': false,
        'Analytics': false,
        'Priority support': false,
      },
      id: 'plus',
      highlighted: true,
    },
    {
      name: 'Pro',
      price: 'R49.99',
      period: '/month',
      description: 'Premium features & support',
      features: {
        'View 1,500+ products': true,
        'Advanced search': true,
        'Price alerts': true,
        'Shopping lists': true,
        'Barcode scanning': true,
        'Receipt OCR': true,
        'Analytics': true,
        'Priority support': true,
      },
      id: 'pro',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground">
            Unlock the full power of Mzansi Specials
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {tiers.map((tier_item) => (
            <div
              key={tier_item.id}
              className={`relative rounded-lg border-2 p-8 transition-all ${
                tier_item.highlighted
                  ? 'border-primary bg-primary/5 shadow-lg scale-105'
                  : 'border-border bg-card'
              }`}
            >
              {tier_item.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-foreground mb-2">
                {tier_item.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {tier_item.description}
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">
                  {tier_item.price}
                </span>
                <span className="text-muted-foreground ml-2">
                  {tier_item.period}
                </span>
              </div>

              <Button
                onClick={() => setTier(tier_item.id as any)}
                className={`w-full mb-6 ${
                  tier === tier_item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                }`}
              >
                {tier === tier_item.id ? '✓ Selected' : 'Select Plan'}
              </Button>

              {/* Features List */}
              <ul className="space-y-3">
                {Object.entries(tier_item.features).map(([feature, included]) => (
                  <li key={feature} className="flex items-center gap-3">
                    {included ? (
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span
                      className={
                        included ? 'text-foreground' : 'text-muted-foreground'
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-card border-2 border-border rounded-lg p-6 text-center">
          <p className="text-muted-foreground mb-4">
            All subscriptions auto-renew monthly. Cancel anytime from your account settings.
          </p>
          <p className="text-sm text-muted-foreground">
            Payments processed through App Store or Google Play Store
          </p>
        </div>
      </div>
    </div>
  );
};
