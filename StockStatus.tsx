import React from 'react';
import { useMultiLanguage } from '@/contexts/MultiLanguageContext';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface StockStatusProps {
  storeName: string;
  inStock: boolean;
  stockLevel?: string;
  lastUpdated?: Date;
}

export default function StockStatus({ 
  storeName, 
  inStock, 
  stockLevel, 
  lastUpdated 
}: StockStatusProps) {
  const { t } = useMultiLanguage();

  const getStockColor = () => {
    if (!inStock) return 'bg-red-100 text-red-800';
    if (stockLevel === 'Low') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStockIcon = () => {
    if (!inStock) return <AlertCircle className="w-4 h-4" />;
    return <CheckCircle2 className="w-4 h-4" />;
  };

  const formatTime = (date: Date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return t('just_now') || 'Just now';
    if (minutes < 60) return `${minutes}m ${t('ago') || 'ago'}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ${t('ago') || 'ago'}`;
    const days = Math.floor(hours / 24);
    return `${days}d ${t('ago') || 'ago'}`;
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3">
        {getStockIcon()}
        <div>
          <p className="font-medium text-sm text-gray-900">{storeName}</p>
          {lastUpdated && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(lastUpdated)}
            </p>
          )}
        </div>
      </div>
      <Badge className={getStockColor()}>
        {inStock ? (
          <span>{stockLevel || t('in_stock') || 'In Stock'}</span>
        ) : (
          <span>{t('out_of_stock') || 'Out of Stock'}</span>
        )}
      </Badge>
    </div>
  );
}
