import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Trash2, Plus, Check } from 'lucide-react';
import { useMultiLanguage } from '@/contexts/MultiLanguageContext';

interface PriceAlert {
  id: number;
  productId: number;
  productName: string;
  targetPrice: number;
  alertType: 'below_price' | 'on_sale' | 'price_drop';
  isActive: boolean;
  currentPrice?: number;
}

export function PriceAlerts() {
  const { t } = useMultiLanguage();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [newAlert, setNewAlert] = useState<{
    productName: string;
    targetPrice: string;
    alertType: 'below_price' | 'on_sale' | 'price_drop';
  }>({
    productName: '',
    targetPrice: '',
    alertType: 'below_price',
  });
  const [showForm, setShowForm] = useState(false);

  const handleAddAlert = () => {
    if (!newAlert.productName || !newAlert.targetPrice) {
      window.alert(t('please_fill_all_fields'));
      return;
    }

    const newPriceAlert: PriceAlert = {
      id: Math.random(),
      productId: Math.random(),
      productName: newAlert.productName,
      targetPrice: parseFloat(newAlert.targetPrice),
      alertType: newAlert.alertType,
      isActive: true,
    };

    setAlerts([...alerts, newPriceAlert]);
    setNewAlert({ productName: '', targetPrice: '', alertType: 'below_price' });
    setShowForm(false);
  };

  const handleDeleteAlert = (id: number) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const handleToggleAlert = (id: number) => {
    setAlerts(
      alerts.map((a) =>
        a.id === id ? { ...a, isActive: !a.isActive } : a
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-bold text-foreground">{t('price_alerts')}</h3>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('add_alert')}
        </Button>
      </div>

      {/* Add Alert Form */}
      {showForm && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-foreground">{t('product_name')}</label>
              <Input
                placeholder={t('enter_product_name')}
                value={newAlert.productName}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, productName: e.target.value })
                }
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground">{t('target_price')}</label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-foreground">R</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newAlert.targetPrice}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, targetPrice: e.target.value })
                  }
                  step="0.01"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground">{t('alert_type')}</label>
              <select
                value={newAlert.alertType}
                onChange={(e) =>
                  setNewAlert({
                    ...newAlert,
                    alertType: e.target.value as 'below_price' | 'on_sale' | 'price_drop',
                  })
                }
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="below_price">{t('below_price')}</option>
                <option value="on_sale">{t('on_sale')}</option>
                <option value="price_drop">{t('price_drop')}</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAddAlert}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {t('create_alert')}
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                className="flex-1"
              >
                {t('cancel')}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <div className="text-center py-8 bg-muted/20 rounded-lg">
          <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-muted-foreground">{t('no_alerts_yet')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('create_first_alert')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              className={`p-4 border-2 transition-all ${
                alert.isActive
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-muted/40 bg-muted/5 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-foreground">{alert.productName}</h4>
                    <Badge
                      variant={alert.alertType === 'below_price' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {alert.alertType === 'below_price' && t('below_price')}
                      {alert.alertType === 'on_sale' && t('on_sale')}
                      {alert.alertType === 'price_drop' && t('price_drop')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('alert_at')}: <span className="font-bold text-foreground">R{alert.targetPrice.toFixed(2)}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={alert.isActive ? 'default' : 'outline'}
                    onClick={() => handleToggleAlert(alert.id)}
                    className="w-10 h-10 p-0"
                  >
                    {alert.isActive ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4 opacity-50" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="w-10 h-10 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
        <p className="text-sm text-foreground">
          <span className="font-semibold">{t('how_it_works')}:</span> {t('alerts_description')}
        </p>
      </div>
    </div>
  );
}
