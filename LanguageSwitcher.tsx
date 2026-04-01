import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe, ChevronDown } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log('[LanguageSwitcher] Current language:', language);
  }, [language]);

  const handleLanguageChange = (newLanguage: string) => {
    console.log('[LanguageSwitcher] Attempting to change language from', language, 'to', newLanguage);
    try {
      setLanguage(newLanguage as any);
      console.log('[LanguageSwitcher] Language changed successfully to:', newLanguage);
      setIsOpen(false);
    } catch (error) {
      console.error('[LanguageSwitcher] Error changing language:', error);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={() => {
          console.log('[LanguageSwitcher] Button clicked, toggling dropdown');
          setIsOpen(!isOpen);
        }}
        className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm md:text-base shadow-lg hover:shadow-xl transition-all"
        title="Change Language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">CHANGE LANGUAGE</span>
        <span className="sm:hidden text-xs font-bold">{language.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-red-600 rounded-lg shadow-xl z-50">
          <div className="p-3 border-b-2 border-red-600 bg-red-50">
            <p className="text-xs font-bold text-red-600 uppercase">SELECT LANGUAGE</p>
            <p className="text-xs font-bold text-gray-600 uppercase">KHETHA ULIMI</p>
          </div>
          <div className="grid grid-cols-2 gap-1 p-2">
            {Object.entries(languages).map(([code, name]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code)}
                className={`px-3 py-2 rounded text-sm text-left transition-all font-medium ${
                  language === code
                    ? 'bg-red-600 text-white font-bold shadow-md'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                title={name}
              >
                <div className="font-semibold">{name}</div>
                <div className="text-xs opacity-75">{code.toUpperCase()}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            console.log('[LanguageSwitcher] Backdrop clicked, closing dropdown');
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}
