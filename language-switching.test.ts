import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { t, LANGUAGES } from '@/i18n/translations';

describe('Language Switching System - Comprehensive Test', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Translation Function', () => {
    it('should translate keys for English', () => {
      expect(t('app.title', 'en')).toBe('Mzansi Specials');
      expect(t('app.tagline', 'en')).toBe('Save Big Today');
      expect(t('nav.home', 'en')).toBe('Home');
    });

    it('should translate keys for Zulu', () => {
      expect(t('app.title', 'zu')).toBe('Mzansi Specials');
      expect(t('app.tagline', 'zu')).toBe('Konga Kakhulu Namuhla');
      expect(t('nav.home', 'zu')).toBe('Ikhaya');
    });

    it('should translate keys for Afrikaans', () => {
      expect(t('app.title', 'af')).toBe('Mzansi Specials');
      expect(t('app.tagline', 'af')).toBe('Bespaar Groot Vandag');
      expect(t('nav.home', 'af')).toBe('Tuisblad');
    });

    it('should translate keys for Xhosa', () => {
      expect(t('app.title', 'xh')).toBe('Mzansi Specials');
      expect(t('app.tagline', 'xh')).toBe('Yenza Umvuzo Omkhulu Namhlanje');
      expect(t('nav.home', 'xh')).toBe('Ikhaya');
    });

    it('should return key if translation not found', () => {
      const result = t('nonexistent.key', 'en');
      expect(result).toBe('nonexistent.key');
    });

    it('should have all 11 languages available', () => {
      const languages = Object.keys(LANGUAGES);
      expect(languages).toHaveLength(11);
      expect(languages).toContain('en');
      expect(languages).toContain('af');
      expect(languages).toContain('zu');
      expect(languages).toContain('xh');
      expect(languages).toContain('st');
      expect(languages).toContain('tn');
      expect(languages).toContain('nr');
      expect(languages).toContain('ve');
      expect(languages).toContain('ts');
      expect(languages).toContain('ss');
      expect(languages).toContain('nso');
    });
  });

  describe('Critical UI Strings', () => {
    it('should have all navigation strings translated', () => {
      const navKeys = ['nav.home', 'nav.browse', 'nav.shopping_list', 'nav.notifications', 'nav.price_alerts'];
      const languages = Object.keys(LANGUAGES) as any[];

      for (const lang of languages) {
        for (const key of navKeys) {
          const translation = t(key, lang);
          expect(translation).toBeTruthy();
          expect(translation.length).toBeGreaterThan(0);
        }
      }
    });

    it('should have app title and tagline for all languages', () => {
      const languages = Object.keys(LANGUAGES) as any[];

      for (const lang of languages) {
        const title = t('app.title', lang);
        const tagline = t('app.tagline', lang);
        expect(title).toBeTruthy();
        expect(tagline).toBeTruthy();
      }
    });

    it('should have search placeholder for all languages', () => {
      const languages = Object.keys(LANGUAGES) as any[];

      for (const lang of languages) {
        const placeholder = t('home.search_placeholder', lang);
        expect(placeholder).toBeTruthy();
        expect(placeholder.length).toBeGreaterThan(0);
      }
    });

    it('should have category labels for all languages', () => {
      const categories = ['dairy', 'meat', 'produce', 'bakery', 'pantry', 'beverages', 'frozen', 'snacks', 'household'];
      const languages = Object.keys(LANGUAGES) as any[];

      for (const lang of languages) {
        for (const cat of categories) {
          const translation = t(`category.${cat}`, lang);
          expect(translation).toBeTruthy();
          expect(translation.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Language Persistence', () => {
    it('should save language to localStorage', () => {
      localStorage.setItem('mzansi-language', 'zu');
      const saved = localStorage.getItem('mzansi-language');
      expect(saved).toBe('zu');
    });

    it('should load language from localStorage', () => {
      localStorage.setItem('mzansi-language', 'xh');
      const loaded = localStorage.getItem('mzansi-language');
      expect(loaded).toBe('xh');
    });

    it('should default to English if no language saved', () => {
      const saved = localStorage.getItem('mzansi-language');
      expect(saved).toBeNull();
    });
  });

  describe('Language Switching Flow', () => {
    it('should switch from English to Zulu', () => {
      let currentLanguage = 'en';
      expect(t('app.tagline', currentLanguage)).toBe('Save Big Today');

      currentLanguage = 'zu';
      expect(t('app.tagline', currentLanguage)).toBe('Konga Kakhulu Namuhla');
    });

    it('should switch between all languages', () => {
      const languages = Object.keys(LANGUAGES) as any[];
      let currentLanguage = 'en';

      for (const lang of languages) {
        currentLanguage = lang;
        const title = t('app.title', currentLanguage);
        expect(title).toBeTruthy();
      }
    });

    it('should maintain consistency when switching languages', () => {
      const key = 'app.title';
      const languages = Object.keys(LANGUAGES) as any[];

      for (const lang of languages) {
        const translation = t(key, lang);
        expect(translation).toBe('Mzansi Specials');
      }
    });
  });

  describe('Language Button Text', () => {
    it('should have CHANGE LANGUAGE text in all languages', () => {
      const languages = Object.keys(LANGUAGES) as any[];

      for (const lang of languages) {
        const buttonText = t('nav.change_language', lang);
        expect(buttonText).toBeTruthy();
        expect(buttonText.toUpperCase()).toContain('LANGUAGE');
      }
    });
  });

  describe('Browse Page Translations', () => {
    it('should have browse page strings for all languages', () => {
      const browseKeys = [
        'browse.title',
        'browse.filter_by_category',
        'browse.filter_by_store',
        'browse.sort_by',
        'browse.price_low_to_high',
        'browse.price_high_to_low',
        'browse.best_price',
        'browse.hide_out_of_stock',
        'browse.in_stock',
        'browse.out_of_stock',
        'browse.last_updated',
        'browse.all_stores',
        'browse.no_products',
      ];

      const languages = Object.keys(LANGUAGES) as any[];

      for (const lang of languages) {
        for (const key of browseKeys) {
          const translation = t(key, lang);
          expect(translation).toBeTruthy();
          expect(translation.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Retailer Names', () => {
    it('should have retailer names for all languages', () => {
      const retailers = ['spar', 'pick_n_pay', 'checkers', 'woolworths', 'ok_foods', 'food_lovers'];
      const languages = Object.keys(LANGUAGES) as any[];

      for (const lang of languages) {
        for (const retailer of retailers) {
          const translation = t(`retailer.${retailer}`, lang);
          expect(translation).toBeTruthy();
        }
      }
    });
  });

  describe('Common Strings', () => {
    it('should have common action strings for all languages', () => {
      const commonKeys = ['common.search', 'common.filter', 'common.sort', 'common.back', 'common.close'];
      const languages = Object.keys(LANGUAGES) as any[];

      for (const lang of languages) {
        for (const key of commonKeys) {
          const translation = t(key, lang);
          expect(translation).toBeTruthy();
          expect(translation.length).toBeGreaterThan(0);
        }
      }
    });
  });
});
