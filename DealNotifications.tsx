import { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Notification {
  id: number;
  type: 'price_drop' | 'new_deal' | 'stock_alert' | 'wishlist';
  title: string;
  message: string;
  product: string;
  discount?: number;
  price?: number;
  store?: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export const DealNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'price_drop',
      title: '🔥 Price Drop Alert',
      message: 'Beef Steak (500g) dropped to R49.99 at OK Foods',
      product: 'Beef Steak (500g)',
      discount: 44,
      price: 49.99,
      store: 'OK Foods',
      timestamp: new Date(Date.now() - 5 * 60000), // 5 mins ago
      read: false,
    },
    {
      id: 2,
      type: 'new_deal',
      title: '⚡ New Flash Sale',
      message: 'Tomatoes (1kg) - 30% OFF at Checkers - Only 1 hour left!',
      product: 'Tomatoes (1kg)',
      discount: 30,
      price: 11.99,
      store: 'Checkers',
      timestamp: new Date(Date.now() - 15 * 60000), // 15 mins ago
      read: false,
    },
    {
      id: 3,
      type: 'wishlist',
      title: '💚 Wishlist Item on Sale',
      message: 'Apples (1kg) - Your wishlist item is now 25% OFF',
      product: 'Apples (1kg)',
      discount: 25,
      price: 18.74,
      store: 'Checkers',
      timestamp: new Date(Date.now() - 30 * 60000), // 30 mins ago
      read: true,
    },
    {
      id: 4,
      type: 'stock_alert',
      title: '📦 Back in Stock',
      message: 'Full Cream Milk (1L) is back in stock at Spar',
      product: 'Full Cream Milk (1L)',
      price: 15.74,
      store: 'Spar',
      timestamp: new Date(Date.now() - 1 * 3600000), // 1 hour ago
      read: true,
    },
  ]);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  // Request notification permission
  const handleEnableNotifications = () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            setNotificationsEnabled(true);
            // Show test notification
            new Notification('Mzansi Specials', {
              body: 'Notifications enabled! You\'ll now get alerts for deals.',
              icon: '🛒',
            });
          }
        });
      }
    }
  };

  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Delete notification
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'price_drop':
        return '🔥';
      case 'new_deal':
        return '⚡';
      case 'stock_alert':
        return '📦';
      case 'wishlist':
        return '💚';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'price_drop':
        return 'border-l-4 border-red-500 bg-red-50';
      case 'new_deal':
        return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'stock_alert':
        return 'border-l-4 border-blue-500 bg-blue-50';
      case 'wishlist':
        return 'border-l-4 border-green-500 bg-green-50';
      default:
        return 'border-l-4 border-gray-500 bg-gray-50';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-full space-y-6">
      {/* Header with Bell Icon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-8 h-8 text-primary" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </div>
          <h2 className="text-3xl font-bold text-foreground">Notifications</h2>
        </div>
        {notifications.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllNotifications}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Enable Notifications Card */}
      {!notificationsEnabled && (
        <Card className="p-6 bg-primary/10 border-2 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="font-semibold text-foreground">Enable notifications for deal alerts</p>
              <p className="text-sm text-muted-foreground">Get instant alerts when prices drop on your wishlist items</p>
            </div>
            <Button
              onClick={handleEnableNotifications}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6"
            >
              <Bell className="w-5 h-5" />
              Enable
            </Button>
          </div>
        </Card>
      )}

      {/* Notification Preferences */}
      <Card className="p-6 border-2 border-border">
        <h3 className="font-bold text-foreground mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm text-foreground">Price drop alerts</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm text-foreground">New flash sales</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm text-foreground">Wishlist updates</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm text-foreground">Stock availability</span>
          </label>
        </div>
      </Card>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>

          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 border-2 transition-all ${
                getNotificationColor(notification.type)
              } ${!notification.read ? 'border-primary/50' : 'border-border'}`}
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className="text-3xl flex-shrink-0">{getNotificationIcon(notification.type)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-bold text-foreground">{notification.title}</h4>
                    {!notification.read && (
                      <Badge className="bg-primary text-primary-foreground text-xs flex-shrink-0">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>

                  {/* Deal Info */}
                  {notification.price && (
                    <div className="bg-white/60 p-2 rounded mb-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{notification.product}</span>
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-primary">R{notification.price.toFixed(2)}</span>
                          {notification.discount && (
                            <Badge className="bg-red-500 text-white text-xs">
                              {notification.discount}% OFF
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Time */}
                  <p className="text-xs text-muted-foreground">{formatTime(notification.timestamp)}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  {!notification.read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAsRead(notification.id)}
                      className="hover:bg-white/50"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteNotification(notification.id)}
                    className="hover:bg-white/50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center border-2 border-border">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg text-muted-foreground mb-2">No notifications yet</p>
          <p className="text-sm text-muted-foreground">
            Add items to your wishlist to get alerts when prices drop
          </p>
        </Card>
      )}

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center border-2 border-border">
          <p className="text-3xl font-bold text-red-600 mb-1">{notifications.filter((n) => n.type === 'price_drop').length}</p>
          <p className="text-xs text-muted-foreground">Price Drops</p>
        </Card>
        <Card className="p-4 text-center border-2 border-border">
          <p className="text-3xl font-bold text-yellow-600 mb-1">{notifications.filter((n) => n.type === 'new_deal').length}</p>
          <p className="text-xs text-muted-foreground">New Deals</p>
        </Card>
        <Card className="p-4 text-center border-2 border-border">
          <p className="text-3xl font-bold text-green-600 mb-1">{notifications.filter((n) => n.type === 'wishlist').length}</p>
          <p className="text-xs text-muted-foreground">Wishlist Alerts</p>
        </Card>
        <Card className="p-4 text-center border-2 border-border">
          <p className="text-3xl font-bold text-blue-600 mb-1">{notifications.filter((n) => n.type === 'stock_alert').length}</p>
          <p className="text-xs text-muted-foreground">Stock Updates</p>
        </Card>
      </div>
    </div>
  );
};
