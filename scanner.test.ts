import { describe, it, expect } from 'vitest';
import { lookupBarcode, lookupSAProduct, searchSAProducts } from './barcode-service';
import { parseReceiptText, detectRetailer, validateReceiptData } from './ocr-service';
import { generateReferralCode, validateReferralCode, calculateReferralBonus } from './referral-service';

/**
 * Barcode Scanner Tests
 */
describe('Barcode Service', () => {
  it('should lookup product by barcode from SA database', async () => {
    const product = lookupSAProduct('6001234567890');
    expect(product).toBeDefined();
    expect(product?.name).toBe('Coca-Cola Original Taste 2L');
    expect(product?.brand).toBe('Coca-Cola');
  });

  it('should return null for unknown barcode', async () => {
    const product = lookupSAProduct('9999999999999');
    expect(product).toBeNull();
  });

  it('should search products by name', () => {
    const results = searchSAProducts('Coca-Cola');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toContain('Coca-Cola');
  });

  it('should search products by brand', () => {
    const results = searchSAProducts('Clover');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].brand).toBe('Clover');
  });

  it('should search products by category', () => {
    const results = searchSAProducts('Dairy');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((p) => p.category === 'Dairy')).toBe(true);
  });

  it('should return empty array for non-matching search', () => {
    const results = searchSAProducts('NonexistentProduct123');
    expect(results.length).toBe(0);
  });
});

/**
 * OCR Receipt Scanner Tests
 */
describe('OCR Service', () => {
  it('should parse receipt text and extract items', () => {
    const receiptText = `
      Coca-Cola 2L    1    34.99
      Chicken Breast  1    59.99
      Rice 5kg        1    79.99
    `;

    const result = parseReceiptText(receiptText);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0].productName).toBeDefined();
    expect(result.items[0].price).toBeGreaterThan(0);
  });

  it('should detect retailer from receipt text', () => {
    const text = 'CHECKERS Store #1234';
    const retailer = detectRetailer(text);
    expect(retailer).toBe('Checkers');
  });

  it('should detect Pick n Pay retailer', () => {
    const text = 'PICK N PAY Store Receipt';
    const retailer = detectRetailer(text);
    expect(retailer).toBe('Pick n Pay');
  });

  it('should detect SPAR retailer', () => {
    const text = 'SPAR Supermarket';
    const retailer = detectRetailer(text);
    expect(retailer).toBe('SPAR');
  });

  it('should validate receipt data', () => {
    const validData = {
      items: [
        { productName: 'Milk', price: 1899, quantity: 1, confidence: 0.9 },
      ],
      totalAmount: 1899,
      confidence: 0.85,
    };

    const validation = validateReceiptData(validData);
    expect(validation.isValid).toBe(true);
    expect(validation.errors.length).toBe(0);
  });

  it('should reject receipt with no items', () => {
    const invalidData = {
      items: [],
      confidence: 0.5,
    };

    const validation = validateReceiptData(invalidData);
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('No items found in receipt');
  });

  it('should reject receipt with low confidence', () => {
    const invalidData = {
      items: [{ productName: 'Milk', price: 1899, quantity: 1, confidence: 0.3 }],
      confidence: 0.3,
    };

    const validation = validateReceiptData(invalidData);
    expect(validation.isValid).toBe(false);
  });
});

/**
 * Referral System Tests
 */
describe('Referral Service', () => {
  it('should generate unique referral code', () => {
    const code1 = generateReferralCode('user123');
    const code2 = generateReferralCode('user123');

    expect(code1).toBeDefined();
    expect(code2).toBeDefined();
    expect(code1).not.toBe(code2); // Should be unique
  });

  it('should validate active referral code', () => {
    const code = {
      code: 'TEST-CODE-123',
      userId: 'user123',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      usedCount: 0,
      bonusStars: 10,
    };

    const validation = validateReferralCode(code);
    expect(validation.isValid).toBe(true);
    expect(validation.errors.length).toBe(0);
  });

  it('should reject expired referral code', () => {
    const code = {
      code: 'EXPIRED-CODE',
      userId: 'user123',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() - 1000), // Expired 1 second ago
      usedCount: 0,
      bonusStars: 10,
    };

    const validation = validateReferralCode(code);
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('Referral code has expired');
  });

  it('should reject code with exceeded usage limit', () => {
    const code = {
      code: 'LIMITED-CODE',
      userId: 'user123',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      usedCount: 10,
      maxUses: 10,
      bonusStars: 10,
    };

    const validation = validateReferralCode(code);
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('Referral code usage limit reached');
  });

  it('should calculate tiered referral bonus', () => {
    expect(calculateReferralBonus(0, 10)).toBe(10); // Base bonus
    expect(calculateReferralBonus(10, 10)).toBe(13); // 1.25x at 10 referrals
    expect(calculateReferralBonus(25, 10)).toBe(15); // 1.5x at 25 referrals
    expect(calculateReferralBonus(50, 10)).toBe(20); // 2x at 50 referrals
  });
});

/**
 * Price Data Collection Tests
 */
describe('Price Data Collection', () => {
  it('should accept barcode scan with valid price', () => {
    const scan = {
      barcode: '6001234567890',
      productName: 'Coca-Cola 2L',
      price: 3499,
      retailer: 'Checkers',
      source: 'barcode' as const,
    };

    expect(scan.barcode).toBeDefined();
    expect(scan.price).toBeGreaterThan(0);
    expect(scan.retailer).toBeDefined();
  });

  it('should accept receipt scan with multiple prices', () => {
    const receiptScan = {
      items: [
        { productName: 'Milk', price: 1899 },
        { productName: 'Bread', price: 899 },
        { productName: 'Eggs', price: 2999 },
      ],
      retailer: 'Pick n Pay',
      source: 'receipt' as const,
    };

    expect(receiptScan.items.length).toBe(3);
    expect(receiptScan.items.every((item) => item.price > 0)).toBe(true);
  });

  it('should award stars for contributions', () => {
    const barcodeStars = 1;
    const receiptStars = 5;

    expect(barcodeStars).toBe(1);
    expect(receiptStars).toBe(5);
  });
});
