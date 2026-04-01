import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';

interface SearchSuggestion {
  id: number;
  name: string;
  category: string;
  score?: number;
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  suggestions?: SearchSuggestion[];
}

export function SearchBar({ onSearch, suggestions = [] }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState<SearchSuggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  // Mock product database for search
  const MOCK_PRODUCTS = [
    { id: 1, name: 'Coca-Cola Original Taste 2L', category: 'Beverages' },
    { id: 2, name: 'Simba Chips Original 125g', category: 'Snacks' },
    { id: 3, name: 'Sunflower Oil 750ml', category: 'Oils & Condiments' },
    { id: 4, name: 'White Bread 700g', category: 'Bakery' },
    { id: 5, name: 'Full Cream Milk 1L', category: 'Dairy' },
    { id: 6, name: 'Chicken Breast 1kg', category: 'Meat' },
    { id: 7, name: 'Rice 5kg', category: 'Pantry' },
    { id: 8, name: 'Tomato Sauce 400g', category: 'Sauces' },
    { id: 9, name: 'Peanut Butter 500g', category: 'Spreads' },
    { id: 10, name: 'Eggs 12 Pack', category: 'Dairy' },
  ];

  useEffect(() => {
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      const results = MOCK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery)
      );
      setFiltered(results);
      setIsOpen(true);
    } else {
      setFiltered([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    onSearch?.(searchQuery);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setQuery('');
    setIsOpen(false);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.name);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (query.trim()) {
        handleSearch(query.trim());
      }
    } else if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-5 h-5 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for milk, bread, chicken..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          className="pl-10 pr-10 h-11 border-2 border-primary/30 focus:border-primary rounded-lg"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-2 h-7 w-7"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-primary/20 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {filtered.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-primary/5 border-b border-primary/10 last:border-b-0 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{suggestion.name}</p>
                  <p className="text-xs text-muted-foreground">{suggestion.category}</p>
                </div>
                <Search className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {isOpen && query.trim() && filtered.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-primary/20 rounded-lg shadow-lg z-50 p-4">
          <p className="text-center text-muted-foreground">
            No products found for "{query}"
          </p>
          <p className="text-center text-xs text-muted-foreground mt-2">
            Try searching for a category or product name
          </p>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
