import { useState } from 'react';
import { Search, MapPin, ShoppingBag, Menu, X, LogOut, Bell } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { Button } from '@/components/ui/button';

export function ModernHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Main Header */}
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo - Text Only */}
          <div className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold">
              <span className="text-gray-900">Mzansi</span>
              <span className="text-green-600 ml-1">Specials</span>
            </h1>
          </div>

          {/* Search Bar - Hidden on Mobile */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Location - Desktop Only */}
            <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <MapPin className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Johannesburg</span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 sm:p-2.5 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Cart Icon */}
            <button className="relative p-2 sm:p-2.5 rounded-lg hover:bg-gray-100 transition-colors">
              <ShoppingBag className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-5 h-5 bg-green-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </button>

            {/* Auth - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <span className="text-sm text-gray-900">{user.name}</span>
                  <Button
                    onClick={logout}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => (window.location.href = getLoginUrl())}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Login
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-gray-50">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {/* Location */}
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white transition-colors text-left">
              <MapPin className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-900">Johannesburg</span>
            </button>

            {/* Auth */}
            {user ? (
              <>
                <p className="text-sm text-gray-900 px-3">Welcome, {user.name}!</p>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                size="sm"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
