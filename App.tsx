import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import AppLayout from "./components/AppLayout";
import Home from './pages/Home';
import BrowseSpecials from './pages/BrowseSpecials';
import CataloguesPage from './pages/CataloguesPage';
import MyListPage from './pages/MyListPage';
import SavingsTrackerPage from './pages/SavingsTrackerPage';
import Wishlist from './pages/Wishlist';
import CommunityDeals from './pages/CommunityDeals';
import BarcodeScannerNew from './pages/BarcodeScannerNew';
import UserProfile from './pages/UserProfile';
import Leaderboard from './pages/Leaderboard';
import ProductDetail from './pages/ProductDetail';
import SearchResults from './pages/SearchResults';
import AdminDashboard from './pages/AdminDashboard';
import LoyaltyPrograms from './pages/LoyaltyPrograms';
import PhoneVerification from './pages/PhoneVerification';
import ReferralPage from './pages/ReferralPage';
import ShoppingList from '@/pages/ShoppingList';
import ShoppingListEnhanced from '@/pages/ShoppingListEnhanced';
import NotificationCenter from './pages/NotificationCenter';
import PriceAlerts from './pages/PriceAlerts';
import SubscriptionManagement from './pages/SubscriptionManagement';

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/browse" component={BrowseSpecials} />
        <Route path="/catalogues" component={CataloguesPage} />
        <Route path="/list" component={MyListPage} />
        <Route path="/savings" component={SavingsTrackerPage} />
        <Route path="/wishlist" component={Wishlist} />
        <Route path="/community" component={CommunityDeals} />
        <Route path="/scan" component={BarcodeScannerNew} />
        <Route path="/profile" component={UserProfile} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/product/:id" component={ProductDetail} />
        <Route path="/search" component={SearchResults} />
        <Route path="/admin-mzansi-secret-2024" component={AdminDashboard} />
        <Route path="/loyalty" component={LoyaltyPrograms} />
        <Route path="/verify-phone" component={PhoneVerification} />
        <Route path="/referral" component={ReferralPage} />
        <Route path="/shopping-list" component={ShoppingListEnhanced} />
        <Route path="/notifications" component={NotificationCenter} />
        <Route path="/price-alerts" component={PriceAlerts} />
        <Route path="/subscription" component={SubscriptionManagement} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <SubscriptionProvider>
          <ThemeProvider defaultTheme="light">
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ThemeProvider>
        </SubscriptionProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
