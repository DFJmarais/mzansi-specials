import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useLocation } from 'wouter';

interface FloatingCartProps {
  itemCount: number;
  total: number;
  isVisible: boolean;
}

export function FloatingCart({ itemCount, total, isVisible }: FloatingCartProps) {
  const [, navigate] = useLocation();

  if (!isVisible || itemCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 md:right-8 z-40 animate-slide-up">
      <button
        onClick={() => navigate('/cart')}
        className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-premium hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-between sm:justify-center gap-3 font-semibold text-base sm:text-lg"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-secondary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </div>
          <div className="text-left">
            <p className="text-xs opacity-90">View Cart</p>
            <p className="text-sm sm:text-base font-bold">R{total.toFixed(2)}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 hidden sm:block" />
      </button>
    </div>
  );
}
