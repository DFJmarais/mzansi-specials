import { useState } from 'react';
import { Bell, AlertCircle, TrendingDown, Gift } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Notification {
  id: number;
  type: 'price_drop' | 'new_deal' | 'alert' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: React.ReactNode;
  action?: string;
}

export const SmartNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'price_drop',
      title: 'Price Drop Alert!',
      message: 'Full Cream Milk (1L) dropped from R19.99 to R17.99 at Pick n Pay',
      timestamp: '2 hours ago',
      read: false,
      icon: <TrendingDown className="w-5 h-5 text-green-500" />,
      action: 'View Deal',
    },
    {
      id: 2,
      type: 'new_deal',
      title: 'Hot Deal This Week',
      message: 'Chicken Breast (1kg) - 25% off at OK Foods (R41.99)',
      timestamp: '4 hours ago',
      read: false,
      icon: <Gift className="w-5 h-5 text-accent" />,
      action: 'Add to Cart',
    },
    {
      id: 3,
      type: 'alert',
      title: 'Budget Alert',
      message: 'You\'ve spent R450 this week. Budget limit is R500.',
      timestamp: '1 day ago',
      read: true,
      icon: <AlertCircle className="w-5 h-5 text-orange-500" />,
    },
    {
      id: 4,
      type: 'reminder',
      title: 'Weekly Deals Digest',
      message: 'Check out the best deals this week across all stores',
      timestamp: '2 days ago',
      read: true,
      icon: <Bell className="w-5 h-5 text-primary" />,
      action: 'View Deals',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'price_drop':
        return 'bg-green-50 border-green-200';
      case 'new_deal':
        return 'bg-accent/10 border-accent/30';
      case 'alert':
        return 'bg-orange-50 border-orange-200';
      case 'reminder':
        return 'bg-primary/10 border-primary/30';
      default:
        return 'bg-muted border-border';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
          {unreadCount > 0 && (
            <Badge className="bg-accent text-white">{unreadCount} new</Badge>
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <Card className="p-4 bg-muted/50 border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Smart Notifications</p>
            <p className="text-xs text-muted-foreground">Get alerts for price drops and deals</p>
          </div>
          <Button variant="outline" size="sm">
            Settings
          </Button>
        </div>
      </Card>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 border-2 transition-all ${getNotificationColor(
                notification.type
              )} ${!notification.read ? 'border-current' : ''}`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">{notification.icon}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <div className="flex-shrink-0 w-2 h-2 bg-accent rounded-full mt-2" />
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                    <div className="flex items-center gap-2">
                      {notification.action && (
                        <Button variant="outline" size="sm" className="text-xs">
                          {notification.action}
                        </Button>
                      )}
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs"
                        >
                          Mark Read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs text-red-500 hover:text-red-600"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center bg-muted/50">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">No notifications yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            You'll get alerts when prices drop on your saved items
          </p>
        </Card>
      )}

      {/* Notification Preferences */}
      <Card className="p-4 border-2 border-primary/20 bg-primary/5">
        <h3 className="font-semibold text-foreground mb-3">Notification Preferences</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3 text-sm cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-foreground">Price drop alerts</span>
          </label>
          <label className="flex items-center gap-3 text-sm cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-foreground">New deals notifications</span>
          </label>
          <label className="flex items-center gap-3 text-sm cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-foreground">Budget alerts</span>
          </label>
          <label className="flex items-center gap-3 text-sm cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-foreground">Weekly deals digest</span>
          </label>
        </div>
      </Card>
    </div>
  );
};
