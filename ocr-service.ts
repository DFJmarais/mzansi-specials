import axios from 'axios';

/**
 * OCR Service
 * Extracts text from receipt images using Tesseract.js
 * Parses product names and prices from receipt text
 */

export interface ReceiptItem {
  productName: string;
  quantity?: number;
  price: number;
  confidence: number;
}

export interface ReceiptData {
  retailer?: string;
  date?: Date;
  items: ReceiptItem[];
  totalAmount?: number;
  confidence: number;
}

/**
 * Extract text from receipt image using OCR
 * In production, this would use Tesseract.js or Google Vision API
 */
export async function extractTextFromReceipt(imageUrl: string): Promise<string> {
  try {
    // In production, use Tesseract.js like this:
    // const { createWorker } = require('tesseract.js');
    // const worker = await createWorker();
    // const result = await worker.recognize(imageUrl);
    // await worker.terminate();
    // return result.data.text;

    // For now, return mock OCR text
    console.log('[OCR Service] Processing receipt image:', imageUrl);
    return mockReceiptOCR();
  } catch (error) {
    console.error('[OCR Service] Error extracting text:', error);
    return '';
  }
}

/**
 * Parse receipt text to extract items and prices
 */
export function parseReceiptText(text: string): ReceiptData {
  const lines = text.split('\n').filter((line) => line.trim());

  const items: ReceiptItem[] = [];
  let totalAmount = 0;

  // Pattern matching for common receipt formats
  // Format: "Product Name    Qty    Price"
  const pricePattern = /R?\s*(\d+[.,]\d{2})/g;
  const productPattern = /^([A-Za-z\s]+?)\s+(\d+)\s+R?(\d+[.,]\d{2})/;

  for (const line of lines) {
    const match = line.match(productPattern);
    if (match) {
      const [, productName, quantity, price] = match;
      const priceNum = parseFloat(price.replace(',', '.')) * 100; // Convert to cents

      items.push({
        productName: productName.trim(),
        quantity: parseInt(quantity),
        price: Math.round(priceNum),
        confidence: 0.85,
      });

      totalAmount += priceNum;
    }
  }

  return {
    items,
    totalAmount: Math.round(totalAmount),
    confidence: items.length > 0 ? 0.8 : 0,
  };
}

/**
 * Detect retailer from receipt text
 */
export function detectRetailer(text: string): string {
  const upperText = text.toUpperCase();

  if (upperText.includes('CHECKERS')) return 'Checkers';
  if (upperText.includes('PICK N PAY')) return 'Pick n Pay';
  if (upperText.includes('SPAR')) return 'SPAR';
  if (upperText.includes('WOOLWORTHS')) return 'Woolworths';
  if (upperText.includes('OK FOODS')) return 'OK Foods';
  if (upperText.includes('SHOPRITE')) return 'ShopRite';

  return 'Unknown';
}

/**
 * Match receipt items to products in database
 */
export function matchReceiptItemsToProducts(
  items: ReceiptItem[],
  availableProducts: Array<{ name: string; id: string }>
): Array<ReceiptItem & { productId?: string }> {
  return items.map((item) => {
    // Simple fuzzy matching
    const match = availableProducts.find((p) =>
      p.name.toLowerCase().includes(item.productName.toLowerCase()) ||
      item.productName.toLowerCase().includes(p.name.toLowerCase())
    );

    return {
      ...item,
      productId: match?.id,
    };
  });
}

/**
 * Mock OCR output for testing
 */
function mockReceiptOCR(): string {
  return `
CHECKERS
Store #1234
Date: 29/03/2026

Coca-Cola 2L          1    34.99
Chicken Breast 1kg    1    59.99
Rice 5kg              1    79.99
Bread White 700g      2    16.98
Milk Full Cream 1L    1    18.99
Tomato Sauce 400g     2    9.98
Sunflower Oil 750ml   1    42.99

Subtotal:            R263.91
Tax:                  R0.00
Total:               R263.91

Thank you for shopping!
  `;
}

/**
 * Process receipt image end-to-end
 */
export async function processReceipt(imageUrl: string): Promise<ReceiptData> {
  try {
    // Extract text from image
    const text = await extractTextFromReceipt(imageUrl);

    // Parse receipt text
    const receiptData = parseReceiptText(text);

    // Detect retailer
    receiptData.retailer = detectRetailer(text);

    // Extract date if possible
    const dateMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
    if (dateMatch) {
      const [, day, month, year] = dateMatch;
      receiptData.date = new Date(`${year}-${month}-${day}`);
    }

    console.log('[OCR Service] ✓ Receipt processed:', {
      retailer: receiptData.retailer,
      items: receiptData.items.length,
      total: receiptData.totalAmount,
    });

    return receiptData;
  } catch (error) {
    console.error('[OCR Service] Error processing receipt:', error);
    return {
      items: [],
      confidence: 0,
    };
  }
}

/**
 * Validate receipt data quality
 */
export function validateReceiptData(data: ReceiptData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (data.items.length === 0) {
    errors.push('No items found in receipt');
  }

  if (data.confidence < 0.5) {
    errors.push('Low OCR confidence score');
  }

  if (data.items.some((item) => item.price <= 0)) {
    errors.push('Invalid prices detected');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
