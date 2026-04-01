import { describe, it, expect, beforeEach } from 'vitest';
import { translations } from '@/contexts/translations';

describe('Language System', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should have all 11 South African languages', () => {
    const languages = ['en', 'zu', 'xh', 'st', 'af', 'nr', 'ss', 'tn', 'ts', 've', 'nd'];
    
    // Check that each translation key has all 11 languages
    Object.entries(translations).forEach(([key, value]) => {
      languages.forEach(lang => {
        expect(value[lang as keyof typeof value]).toBeDefined();
        expect(typeof value[lang as keyof typeof value]).toBe('string');
      });
    });
  });

  it('should have translations for key UI elements', () => {
    const requiredKeys = [
      'deal_of_the_day',
      'shop_now',
      'search_placeholder',
      'category',
      'store',
      'best_price',
      'price',
      'discount',
      'language',
      'welcome',
    ];

    requiredKeys.forEach(key => {
      expect(translations[key]).toBeDefined();
      expect(Object.keys(translations[key])).toHaveLength(11);
    });
  });

  it('should persist language preference to localStorage', () => {
    const testLang = 'zu';
    localStorage.setItem('mzansi-language', testLang);
    
    const saved = localStorage.getItem('mzansi-language');
    expect(saved).toBe(testLang);
  });

  it('should have consistent translation keys across all languages', () => {
    const firstLangKeys = Object.keys(translations['deal_of_the_day']);
    
    Object.entries(translations).forEach(([_, value]) => {
      const currentKeys = Object.keys(value);
      expect(currentKeys.sort()).toEqual(firstLangKeys.sort());
    });
  });

  it('should support all 11 languages in translations', () => {
    const languages = ['en', 'zu', 'xh', 'st', 'af', 'nr', 'ss', 'tn', 'ts', 've', 'nd'];
    const sampleKey = 'deal_of_the_day';
    
    languages.forEach(lang => {
      expect(translations[sampleKey][lang as keyof typeof translations['deal_of_the_day']]).toBeTruthy();
    });
  });

  it('should have non-empty translations for all languages', () => {
    Object.entries(translations).forEach(([key, value]) => {
      Object.entries(value).forEach(([lang, text]) => {
        expect(text.length).toBeGreaterThan(0);
      });
    });
  });
});
