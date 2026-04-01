import React from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeatureGateProps {
  feature: keyof ReturnType<typeof useSubscription>['features'];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  fallback,
}) => {
  const { hasFeature, setTier } = useSubscription();

  if (!hasFeature(feature)) {
    return (
      fallback || (
        <div className="bg-muted/50 border-2 border-dashed border-border rounded-lg p-8 text-center">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Premium Feature
          </h3>
          <p className="text-muted-foreground mb-4">
            Upgrade to Plus or Pro to unlock this feature
          </p>
          <Button
            onClick={() => setTier('plus')}
            className="bg-primary text-primary-foreground"
          >
            Upgrade Now
          </Button>
        </div>
      )
    );
  }

  return <>{children}</>;
};
