import { SavingsProductCard } from './SavingsProductCard';
import { ChevronRight } from 'lucide-react';

interface FeedSection {
  title: string;
  icon?: string;
  products: Array<{
    id: string;
    name: string;
    image?: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    store: string;
    isHotDeal?: boolean;
    isLimitedOffer?: boolean;
    timeLeft?: string;
    savings?: number;
  }>;
}

interface DiscoveryFeedProps {
  sections: FeedSection[];
}

export function DiscoveryFeed({ sections }: DiscoveryFeedProps) {
  return (
    <div className="space-y-8 pb-20">
      {sections.map((section, idx) => (
        <section key={idx} className="px-4 md:px-0">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {section.icon && <span className="text-2xl">{section.icon}</span>}
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {section.title}
              </h2>
            </div>
            <button className="flex items-center gap-1 text-green-600 hover:text-green-700 font-semibold text-sm">
              View All
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {section.products.map((product) => (
              <SavingsProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
