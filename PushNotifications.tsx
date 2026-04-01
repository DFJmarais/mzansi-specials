import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PriceAlert {
  productId: number;
  productName: string;
  targetPrice: number;
  currentPrice: number;
  store: string;
  savings: number;
  timestamp: number;
}

export function PushNotifications() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'default'>('default');
  const [recentAlerts, setRecentAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
      setNotificationsEnabled(Notification.permission === 'granted');
      setLoading(false);

      // Load recent alerts from localStorage
      const saved = localStorage.getItem('price-alerts-history');
      if (saved) {
        try {
          const alerts = JSON.parse(saved);
          setRecentAlerts(alerts.slice(0, 5)); // Show last 5 alerts
        } catch {
          // Ignore parse errors
        }
      }
    } else {
      setLoading(false);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Your browser does not support notifications');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      setNotificationsEnabled(permission === 'granted');

      if (permission === 'granted') {
        // Send test notification
        sendTestNotification();
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const sendTestNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Mzansi Specials', {
        body: '✅ Notifications enabled! You\'ll get alerts when prices drop.',
        icon: '🛍️',
        badge: '🛍️',
        tag: 'test-notification',
      });
    }
  };

  const sendPriceAlert = (alert: PriceAlert) => {
    if (Notification.permission === 'granted') {
      new Notification(`${alert.productName} - Price Alert!`, {
        body: `Now R${alert.currentPrice.toFixed(2)} at ${alert.store} (was R${(alert.currentPrice + alert.savings).toFixed(2)})\n💰 Save R${alert.savings.toFixed(2)}!`,
        icon: '🔔',
        badge: '💰',
        tag: `price-alert-${alert.productId}`,
        requireInteraction: true,
      });

      // Save to history
      const history = localStorage.getItem('price-alerts-history');
      const alerts = history ? JSON.parse(history) : [];
      alerts.unshift(alert);
      localStorage.setItem('price-alerts-history', JSON.stringify(alerts.slice(0, 20))); // Keep last 20
      setRecentAlerts(alerts.slice(0, 5));
    }
  };

  const clearAlertHistory = () => {
    localStorage.removeItem('price-alerts-history');
    setRecentAlerts([]);
  };

  if (loading) {
    return <div className="text-center py-8">Loading notification settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Notification Permission Card */}
      <Card className="border-2 border-primary/20 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-2">
              {notificationsEnabled ? (
                <>
                  <Bell className="w-5 h-5 text-green-600 fill-green-600" />
                  Notifications Enabled
                </>
              ) : (
                <>
                  <BellOff className="w-5 h-5 text-muted-foreground" />
                  Notifications Disabled
                </>
              )}
            </h3>
            <p className="text-sm text-muted-foreground">
              {notificationsEnabled
                ? 'You will receive browser notifications when prices drop on your favorite items.'
                : 'Enable notifications to get instant alerts when prices reach your target.'}
            </p>
          </div>

          {!notificationsEnabled && permissionStatus !== 'denied' && (
            <Button
              onClick={requestNotificationPermission}
              className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
            >
              Enable Notifications
            </Button>
          )}

          {permissionStatus === 'denied' && (
            <Badge variant="destructive" className="whitespace-nowrap">
              Permission Denied
            </Badge>
          )}

          {notificationsEnabled && (
            <Badge className="bg-green-500 text-white whitespace-nowrap">
              Active
            </Badge>
          )}
        </div>

        {permissionStatus === 'denied' && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            <p className="font-semibold mb-1">Notifications are blocked</p>
            <p>
              To enable notifications, please go to your browser settings and allow notifications for this site.
            </p>
          </div>
        )}
      </Card>

      {/* Test Notification Button */}
      {notificationsEnabled && (
        <Button
          variant="outline"
          onClick={sendTestNotification}
          className="w-full flex items-center gap-2"
        >
          <Bell className="w-4 h-4" />
          Send Test Notification
        </Button>
      )}

      {/* Notification Settings */}
      <Card className="p-6 space-y-4">
        <h3 className="font-bold text-foreground">Notification Settings</h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => {
                if (e.target.checked && permissionStatus !== 'granted') {
                  requestNotificationPermission();
                } else {
                  setNotificationsEnabled(e.target.checked);
                }
              }}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-foreground">
              Price Drop Alerts
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={true}
              disabled={!notificationsEnabled}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-foreground">
              Target Price Reached
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={true}
              disabled={!notificationsEnabled}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-foreground">
              New Deals Available
            </span>
          </label>
        </div>
      </Card>

      {/* Recent Alerts */}
      {recentAlerts.length > 0 && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground">Recent Price Alerts</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAlertHistory}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          </div>

          <div className="space-y-2">
            {recentAlerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
              >
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm line-clamp-1">
                    {alert.productName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    R{alert.currentPrice.toFixed(2)} at {alert.store}
                  </p>
                  <p className="text-xs text-green-600 font-semibold mt-1">
                    💰 Save R{alert.savings.toFixed(2)}
                  </p>
                </div>
                <Badge className="bg-green-500 text-white whitespace-nowrap text-xs">
                  {new Date(alert.timestamp).toLocaleDateString()}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 p-4">
        <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
          💡 How Notifications Work
        </h4>
        <ul className="space-y-1 text-sm text-foreground/80">
          <li>• Enable notifications to receive browser alerts</li>
          <li>• Get notified when prices drop below your target</li>
          <li>• Alerts are sent every 6 hours when prices update</li>
          <li>• Click notifications to view the product</li>
          <li>• You can manage notifications in your browser settings</li>
        </ul>
      </Card>
    </div>
  );
}

// Export helper function for sending alerts from other components
export function triggerPriceAlert(alert: PriceAlert) {
  if (Notification.permission === 'granted') {
    new Notification(`${alert.productName} - Price Alert!`, {
      body: `Now R${alert.currentPrice.toFixed(2)} at ${alert.store}\n💰 Save R${alert.savings.toFixed(2)}!`,
      icon: '🔔',
      badge: '💰',
      tag: `price-alert-${alert.productId}`,
      requireInteraction: true,
    });

    // Save to history
    const history = localStorage.getItem('price-alerts-history');
    const alerts = history ? JSON.parse(history) : [];
    alerts.unshift(alert);
    localStorage.setItem('price-alerts-history', JSON.stringify(alerts.slice(0, 20)));
  }
}
