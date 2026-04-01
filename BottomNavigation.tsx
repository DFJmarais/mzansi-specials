import { Home, Search, ShoppingCart, User } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function BottomNavigation() {
  const [location, navigate] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: ShoppingCart, label: "Cart", path: "/shopping-lists" },
    { icon: User, label: "Account", path: "/account" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg md:hidden z-40">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={label}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
