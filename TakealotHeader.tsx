import { Search, MapPin, ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';

export default function TakealotHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b-4 border-primary shadow-md">
      {/* Top Bar with Logo */}
      <div className="container py-3">
        <div className="flex items-center justify-between mb-4">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <img
              src="/mzansi-logo.jpg"
              alt="Mzansi Specials"
              className="h-6 w-6 md:h-8 md:w-8 rounded-lg object-cover shadow-md"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-primary">Mzansi Specials</h1>
              <p className="text-xs text-muted-foreground">Best Grocery Deals</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <MapPin size={16} className="text-secondary" />
              <span className="text-sm font-medium">Johannesburg</span>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-sm font-medium">{user.name}</span>
                  <button
                    onClick={() => logout()}
                    className="btn-secondary text-sm py-1 px-3"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button className="btn-primary text-sm py-1 px-4">Login</button>
              )}
            </div>
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <ShoppingCart size={20} className="text-primary" />
              <span className="absolute top-0 right-0 w-5 h-5 bg-accent text-sa-black text-xs font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search for products, brands, and more..."
              className="input pl-10 w-full border-2 border-primary/20 focus:border-primary"
            />
          </div>
          <button className="btn-primary px-4 py-2 hidden sm:inline-flex font-bold">
            Search
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t-2 border-primary bg-muted p-4 animate-slide-in">
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg">
              <MapPin size={16} className="text-secondary" />
              <span className="text-sm font-medium">Johannesburg</span>
            </div>
            {user ? (
              <>
                <div className="text-sm font-medium px-3">{user.name}</div>
                <button
                  onClick={() => logout()}
                  className="btn-secondary w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <button className="btn-primary w-full font-bold">Login</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
