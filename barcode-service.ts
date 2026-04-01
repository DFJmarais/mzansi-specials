import axios from 'axios';

/**
 * Barcode Service
 * Integrates with real barcode databases (GS1, UPC, EAN)
 * Automatically looks up product info from barcode
 */

export interface BarcodeProduct {
  barcode: string;
  name: string;
  brand: string;
  category: string;
  description?: string;
  imageUrl?: string;
  weight?: string;
  ingredients?: string;
}

/**
 * UPC Database API - Free barcode lookup
 * Supports UPC, EAN, ISBN, etc.
 */
export async function lookupBarcodeUPC(barcode: string): Promise<BarcodeProduct | null> {
  try {
    const response = await axios.get(`https://api.upcitemdb.com/prod/trial/lookup`, {
      params: {
        upc: barcode,
      },
      timeout: 5000,
    });

    if (response.data.items && response.data.items.length > 0) {
      const item = response.data.items[0];
      return {
        barcode: barcode,
        name: item.title || 'Unknown Product',
        brand: item.brand || 'Unknown Brand',
        category: item.category || 'Groceries',
        description: item.description,
        imageUrl: item.images?.[0],
      };
    }
    return null;
  } catch (error) {
    console.error('[UPC Lookup] Error:', error);
    return null;
  }
}

/**
 * EAN Database API - European barcode lookup
 */
export async function lookupBarcodeEAN(barcode: string): Promise<BarcodeProduct | null> {
  try {
    const response = await axios.get(`https://www.ean-search.org/api/1/json`, {
      params: {
        isbn: barcode,
        format: 'json',
      },
      timeout: 5000,
    });

    if (response.data.product) {
      const product = response.data.product;
      return {
        barcode: barcode,
        name: product.name || 'Unknown Product',
        brand: product.brand || 'Unknown Brand',
        category: product.category || 'Groceries',
        description: product.description,
        imageUrl: product.image,
      };
    }
    return null;
  } catch (error) {
    console.error('[EAN Lookup] Error:', error);
    return null;
  }
}

/**
 * Barcode Lookup API - Multi-format support
 */
export async function lookupBarcode(barcode: string): Promise<BarcodeProduct | null> {
  // Try UPC first
  let product = await lookupBarcodeUPC(barcode);
  if (product) return product;

  // Try EAN
  product = await lookupBarcodeEAN(barcode);
  if (product) return product;

  // Fallback: return null if not found
  console.log(`[Barcode Service] No product found for barcode: ${barcode}`);
  return null;
}

/**
 * South African grocery products database
 * Mock database for common SA grocery items
 */
const SA_GROCERY_DATABASE: Record<string, BarcodeProduct> = {
  '6001234567890': {
    barcode: '6001234567890',
    name: 'Coca-Cola Original Taste 2L',
    brand: 'Coca-Cola',
    category: 'Beverages',
    description: 'Refreshing cola beverage',
    weight: '2L',
  },
  '6009876543210': {
    barcode: '6009876543210',
    name: 'Simba Chips Original 125g',
    brand: 'Simba',
    category: 'Snacks',
    description: 'Crispy potato chips',
    weight: '125g',
  },
  '6005555555555': {
    barcode: '6005555555555',
    name: 'Sunflower Oil 750ml',
    brand: 'Sunflower',
    category: 'Oils & Condiments',
    description: 'Pure sunflower cooking oil',
    weight: '750ml',
  },
  '6002222222222': {
    barcode: '6002222222222',
    name: 'White Bread 700g',
    brand: 'Bake Fresh',
    category: 'Bakery',
    description: 'Fresh white bread loaf',
    weight: '700g',
  },
  '6003333333333': {
    barcode: '6003333333333',
    name: 'Full Cream Milk 1L',
    brand: 'Clover',
    category: 'Dairy',
    description: 'Fresh full cream milk',
    weight: '1L',
  },
  '6004444444444': {
    barcode: '6004444444444',
    name: 'Chicken Breast 1kg',
    brand: 'Fresh Farms',
    category: 'Meat',
    description: 'Fresh chicken breast fillet',
    weight: '1kg',
  },
  '6006666666666': {
    barcode: '6006666666666',
    name: 'Rice 5kg',
    brand: 'Tastic',
    category: 'Pantry',
    description: 'Long grain white rice',
    weight: '5kg',
  },
  '6007777777777': {
    barcode: '6007777777777',
    name: 'Tomato Sauce 400g',
    brand: 'Heinz',
    category: 'Sauces',
    description: 'Tomato sauce for cooking',
    weight: '400g',
  },
};

/**
 * Lookup product from SA database
 */
export function lookupSAProduct(barcode: string): BarcodeProduct | null {
  return SA_GROCERY_DATABASE[barcode] || null;
}

/**
 * Search SA products by name
 */
export function searchSAProducts(query: string): BarcodeProduct[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(SA_GROCERY_DATABASE).filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.brand.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get all products in category
 */
export function getProductsByCategory(category: string): BarcodeProduct[] {
  return Object.values(SA_GROCERY_DATABASE).filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get all categories
 */
export function getAllCategories(): string[] {
  const categories = new Set(Object.values(SA_GROCERY_DATABASE).map((p) => p.category));
  return Array.from(categories).sort();
}
