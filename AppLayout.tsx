import { ReactNode, useState, useMemo, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Search, Home, Layers, BookOpen, TrendingUp, ShoppingCart, Bell } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { t, language } = useLanguage();

  useEffect(() => {
    console.log('[AppLayout] Language changed to:', language);
  }, [language]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const isActive = (path: string) => location === path || (path === '/list' && location === '/my-list');

  // Memoize navItems and recalculate whenever language changes
  const navItems = useMemo(() => {
    console.log('[AppLayout] Recalculating navItems for language:', language);
    return [
      { path: '/', icon: Home, label: t('nav.home'), emoji: '🏠' },
      { path: '/browse', icon: Layers, label: t('nav.browse'), emoji: '🛒' },
      { path: '/shopping-list', icon: BookOpen, label: t('nav.shopping_list'), emoji: '🛍️' },
      { path: '/notifications', label: t('nav.notifications'), emoji: '🔔' },
      { path: '/price-alerts', label: t('nav.price_alerts'), emoji: '📉' },
    ];
  }, [language, t]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-primary">
        <div className="container-fluid py-3 md:py-4">
          {/* Logo & Title Row */}
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-primary">
              {t('app.title')} 🔥
            </h1>
            <div className="flex items-center gap-3">
              <div className="text-xs md:text-sm text-text-secondary font-medium">
                {t('app.tagline')}
              </div>
              <LanguageSwitcher />
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                placeholder={t('home.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 md:py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm md:text-base bg-surface"
              />
            </div>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 main-content">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => setLocation(item.path === '/list' ? '/list' : item.path)}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            title={item.label}
          >
            <span className="nav-icon text-lg">{item.emoji}</span>
            <span className="text-xs font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AppLayout;
