import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { useState } from 'react';

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  cartCount?: number;
}

export default function BottomNav({
  activeTab = 'home',
  onTabChange,
  cartCount = 0,
}: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'cart', label: 'Cart', icon: ShoppingCart },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border md:hidden">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-colors relative ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="relative">
                <Icon size={24} />
                {tab.id === 'cart' && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-lg" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
