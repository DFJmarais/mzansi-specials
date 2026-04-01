import { describe, it, expect } from 'vitest';
import { t, LANGUAGES } from '@/i18n/translations';

describe('Translation System', () => {
  it('should have 11 languages', () => {
    expect(Object.keys(LANGUAGES)).toHaveLength(11);
  });

  it('should translate app.title to Mzansi Specials for all languages', () => {
    const languages = Object.keys(LANGUAGES) as any[];
    for (const lang of languages) {
      expect(t('app.title', lang)).toBe('Mzansi Specials');
    }
  });

  it('should translate app.tagline to English correctly', () => {
    expect(t('app.tagline', 'en')).toBe('Save Big Today');
  });

  it('should translate app.tagline to Zulu correctly', () => {
    expect(t('app.tagline', 'zu')).toBe('Konga Kakhulu Namuhla');
  });

  it('should translate app.tagline to Afrikaans correctly', () => {
    expect(t('app.tagline', 'af')).toBe('Bespaar Groot Vandag');
  });

  it('should translate nav.home for all languages', () => {
    const languages = Object.keys(LANGUAGES) as any[];
    for (const lang of languages) {
      const translation = t('nav.home', lang);
      expect(translation).toBeTruthy();
      expect(translation.length).toBeGreaterThan(0);
    }
  });

  it('should return key if translation not found', () => {
    expect(t('nonexistent.key', 'en')).toBe('nonexistent.key');
  });
});
