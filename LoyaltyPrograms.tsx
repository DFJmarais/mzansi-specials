import { useState } from 'react';
import { Gift, Link2, Trash2, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface LoyaltyCard {
  id: string;
  store: string;
  cardNumber: string;
  linked: boolean;
  points: number;
  pointsValue: number;
  lastUpdated: string;
}

export const LoyaltyPrograms = () => {
  const [linkedCards, setLinkedCards] = useState<LoyaltyCard[]>([
    {
      id: '1',
      store: 'Spar Rewards',
      cardNumber: '****3456',
      linked: true,
      points: 2450,
      pointsValue: 122.50,
      lastUpdated: '2 hours ago',
    },
    {
      id: '2',
      store: 'Checkers Rewards',
      cardNumber: '****7890',
      linked: true,
      points: 1850,
      pointsValue: 92.50,
      lastUpdated: '1 day ago',
    },
  ]);

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState('');

  const availablePrograms = [
    { name: 'Spar Rewards', icon: '🛒', benefits: 'Earn 1 point per R1 spent' },
    { name: 'Pick n Pay Rewards', icon: '🏪', benefits: 'Earn 1 point per R1 spent' },
    { name: 'Checkers Rewards', icon: '✓', benefits: 'Earn 1 point per R1 spent' },
    { name: 'Woolworths Rewards', icon: '🌟', benefits: 'Earn 1 point per R1 spent' },
    { name: 'OK Foods Loyalty', icon: '💳', benefits: 'Earn 1 point per R1 spent' },
    { name: 'ShopRite Rewards', icon: '🎁', benefits: 'Earn 1 point per R1 spent' },
  ];

  const linkedPrograms = linkedCards.map((c) => c.store);
  const unlinkedPrograms = availablePrograms.filter((p) => !linkedPrograms.includes(p.name));

  const totalPoints = linkedCards.reduce((sum, card) => sum + card.points, 0);
  const totalValue = linkedCards.reduce((sum, card) => sum + card.pointsValue, 0);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Gift className="w-8 h-8 text-accent" />
          <h2 className="text-2xl font-bold text-foreground">Loyalty Programs</h2>
        </div>
        <Button
          onClick={() => setShowLinkModal(true)}
          className="gap-2 bg-accent hover:bg-accent/90"
        >
          <Plus className="w-4 h-4" />
          Link Card
        </Button>
      </div>

      {linkedCards.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-accent/20 to-secondary/20 border-2 border-accent/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Points</p>
              <p className="text-3xl font-bold text-accent">{totalPoints.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Points Value</p>
              <p className="text-3xl font-bold text-secondary">R{totalValue.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Linked Cards</p>
              <p className="text-3xl font-bold text-primary">{linkedCards.length}</p>
            </div>
          </div>
        </Card>
      )}

      {linkedCards.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Your Linked Cards</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {linkedCards.map((card) => (
              <Card key={card.id} className="p-4 border-2 border-secondary/30 hover:border-secondary/50 transition-all">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{card.store}</h4>
                      <p className="text-sm text-muted-foreground">{card.cardNumber}</p>
                    </div>
                    <Badge className="bg-secondary/20 text-secondary border-0">Linked</Badge>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Points Balance:</span>
                      <span className="font-bold text-foreground">{card.points.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Value:</span>
                      <span className="font-bold text-secondary">R{card.pointsValue.toFixed(2)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">Updated {card.lastUpdated}</p>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                      View Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLinkedCards(linkedCards.filter((c) => c.id !== card.id))}
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

      {showLinkModal && (
        <Card className="p-6 bg-primary/5 border-2 border-primary/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Link Loyalty Card</h3>
              <button
                onClick={() => setShowLinkModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Select Program</label>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm"
              >
                <option value="">Choose a loyalty program...</option>
                {unlinkedPrograms.map((program) => (
                  <option key={program.name} value={program.name}>
                    {program.name} - {program.benefits}
                  </option>
                ))}
              </select>
            </div>

            {selectedStore && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Card Number</label>
                <input
                  type="text"
                  placeholder="Enter your loyalty card number"
                  className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm"
                />

                <div className="flex gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-xs text-blue-700">
                    ℹ️ Your card number is encrypted and stored securely. We never share it with retailers.
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={() => {
                  console.log('Linking card:', selectedStore);
                  setShowLinkModal(false);
                  setSelectedStore('');
                }}
                disabled={!selectedStore}
              >
                Link Card
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowLinkModal(false);
                  setSelectedStore('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Available Programs</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availablePrograms.map((program) => {
            const isLinked = linkedPrograms.includes(program.name);

            return (
              <Card
                key={program.name}
                className={`p-4 border-2 transition-all cursor-pointer hover:border-primary/50 ${
                  isLinked ? 'border-secondary/50 bg-secondary/5' : 'border-border'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-2xl mb-1">{program.icon}</p>
                      <h4 className="font-semibold text-foreground text-sm">{program.name}</h4>
                    </div>
                    {isLinked && <Badge className="bg-secondary text-white text-xs">Linked</Badge>}
                  </div>

                  <p className="text-xs text-muted-foreground">{program.benefits}</p>

                  {!isLinked && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs gap-1"
                      onClick={() => {
                        setSelectedStore(program.name);
                        setShowLinkModal(true);
                      }}
                    >
                      <Link2 className="w-3 h-3" />
                      Link Card
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="p-6 bg-primary/5 border-2 border-primary/20">
        <h3 className="font-semibold text-foreground mb-4">Why Link Your Loyalty Cards?</h3>

        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-accent font-bold">1</span>
            </div>
            <div>
              <p className="font-medium text-foreground">See Loyalty Member Prices</p>
              <p className="text-sm text-muted-foreground">Get exclusive member-only pricing on products</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-accent font-bold">2</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Track Points Earned</p>
              <p className="text-sm text-muted-foreground">Monitor your loyalty points balance across all programs</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-accent font-bold">3</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Maximize Savings</p>
              <p className="text-sm text-muted-foreground">Get recommendations for products with loyalty bonuses</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-accent font-bold">4</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Automatic Sync</p>
              <p className="text-sm text-muted-foreground">Your points are updated daily automatically</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
