import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Save, ShoppingCart } from 'lucide-react';

interface BundleItem {
  id: string;
  name: string;
  category: string;
  price: number;
  store: string;
}

interface EssentialBundle {
  id: string;
  name: string;
  items: BundleItem[];
  totalPrice: number;
  createdAt: Date;
}

// Pre-defined essential bundles
const PRESET_BUNDLES = [
  {
    name: 'Monthly Essentials Kit',
    description: 'Personal care + Household basics',
    items: [
      { name: 'Sanitary Pads (20 pack)', category: 'Personal Care', price: 0 },
      { name: 'Toilet Paper (12 roll)', category: 'Household', price: 0 },
      { name: 'Dish Soap (500ml)', category: 'Household', price: 0 },
      { name: 'Laundry Detergent (2L)', category: 'Household', price: 0 },
      { name: 'Deodorant (150ml)', category: 'Personal Care', price: 0 },
    ],
  },
  {
    name: 'New Parent Bundle',
    description: 'Diapers + Baby care essentials',
    items: [
      { name: 'Diapers (60 pack)', category: 'Baby', price: 0 },
      { name: 'Baby Wipes (80 pack)', category: 'Baby', price: 0 },
      { name: 'Baby Shampoo (200ml)', category: 'Baby', price: 0 },
      { name: 'Baby Lotion (200ml)', category: 'Baby', price: 0 },
      { name: 'Nappy Rash Cream (100g)', category: 'Baby', price: 0 },
    ],
  },
  {
    name: 'Home Cleaning Bundle',
    description: 'All cleaning supplies in one',
    items: [
      { name: 'Bleach (750ml)', category: 'Household', price: 0 },
      { name: 'Floor Cleaner (1L)', category: 'Household', price: 0 },
      { name: 'Glass Cleaner (500ml)', category: 'Household', price: 0 },
      { name: 'Disinfectant (500ml)', category: 'Household', price: 0 },
      { name: 'Sponges (3 pack)', category: 'Household', price: 0 },
    ],
  },
  {
    name: 'Pet Care Bundle',
    description: 'Food + supplies for your pet',
    items: [
      { name: 'Dog Food (2kg)', category: 'Pet Supplies', price: 0 },
      { name: 'Dog Treats (200g)', category: 'Pet Supplies', price: 0 },
      { name: 'Dog Shampoo (250ml)', category: 'Pet Supplies', price: 0 },
      { name: 'Pet Wipes (40 pack)', category: 'Pet Supplies', price: 0 },
      { name: 'Pet Collar (1 pack)', category: 'Pet Supplies', price: 0 },
    ],
  },
  {
    name: 'Health & Wellness Kit',
    description: 'Vitamins + first aid essentials',
    items: [
      { name: 'Vitamin C (30 tablets)', category: 'Health', price: 0 },
      { name: 'Multivitamins (30 tablets)', category: 'Health', price: 0 },
      { name: 'Paracetamol (24 tablets)', category: 'Health', price: 0 },
      { name: 'First Aid Kit (1 pack)', category: 'Health', price: 0 },
      { name: 'Bandages (30 pack)', category: 'Health', price: 0 },
    ],
  },
];

interface EssentialsBundleProps {
  onBundleSelect?: (bundle: EssentialBundle) => void;
}

export function EssentialsBundle({ onBundleSelect }: EssentialsBundleProps) {
  const [savedBundles, setSavedBundles] = useState<EssentialBundle[]>([]);
  const [customBundleName, setCustomBundleName] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const handleSaveBundle = (bundleName: string, items: typeof PRESET_BUNDLES[0]['items']) => {
    const newBundle: EssentialBundle = {
      id: Date.now().toString(),
      name: bundleName,
      items: items.map((item, idx) => ({
        id: `${idx}`,
        name: item.name,
        category: item.category,
        price: item.price,
        store: 'Best Price',
      })),
      totalPrice: items.reduce((sum) => sum + 0, 0), // Will be calculated from actual prices
      createdAt: new Date(),
    };
    setSavedBundles([...savedBundles, newBundle]);
  };

  const handleDeleteBundle = (id: string) => {
    setSavedBundles(savedBundles.filter((b) => b.id !== id));
  };

  return (
    <div className="w-full space-y-6">
      {/* Preset Bundles */}
      <div>
        <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Essentials Bundles
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESET_BUNDLES.map((bundle, idx) => (
            <Card key={idx} className="p-4 border-2 border-primary/20 hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-foreground">{bundle.name}</h4>
                  <p className="text-xs text-muted-foreground">{bundle.description}</p>
                </div>
              </div>
              
              <div className="space-y-1 mb-4 max-h-24 overflow-y-auto">
                {bundle.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="text-xs text-foreground/70 flex items-center gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full"></span>
                    {item.name}
                  </div>
                ))}
              </div>

              <Button
                size="sm"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                onClick={() => handleSaveBundle(bundle.name, bundle.items)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Save Bundle
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Saved Bundles */}
      {savedBundles.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-primary mb-4">💾 My Saved Bundles</h3>
          <div className="space-y-3">
            {savedBundles.map((bundle) => (
              <Card key={bundle.id} className="p-4 border-2 border-secondary/30 bg-secondary/5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground">{bundle.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {bundle.items.length} items • Total: R{bundle.totalPrice.toFixed(2)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {bundle.items.slice(0, 3).map((item, idx) => (
                        <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {item.name.split('(')[0].trim()}
                        </span>
                      ))}
                      {bundle.items.length > 3 && (
                        <span className="text-xs text-muted-foreground px-2 py-1">
                          +{bundle.items.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onBundleSelect?.(bundle)}
                      className="text-primary border-primary/30 hover:bg-primary/10"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteBundle(bundle.id)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Custom Bundle Creator */}
      {showCustom && (
        <Card className="p-4 border-2 border-primary/30 bg-primary/5">
          <h4 className="font-bold text-foreground mb-3">Create Custom Bundle</h4>
          <div className="flex gap-2">
            <Input
              placeholder="Bundle name (e.g., My Weekly Essentials)"
              value={customBundleName}
              onChange={(e) => setCustomBundleName(e.target.value)}
              className="flex-1"
            />
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                if (customBundleName.trim()) {
                  handleSaveBundle(customBundleName, []);
                  setCustomBundleName('');
                  setShowCustom(false);
                }
              }}
            >
              <Save className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            💡 Tip: Create a custom bundle and add items from the price comparison
          </p>
        </Card>
      )}

      {!showCustom && (
        <Button
          variant="outline"
          className="w-full border-2 border-primary/30 text-primary hover:bg-primary/10"
          onClick={() => setShowCustom(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Custom Bundle
        </Button>
      )}
    </div>
  );
}
