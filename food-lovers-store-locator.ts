/**
 * Food Lovers Market Store Locator
 * Provides branch locations, hours, and Google Maps integration
 */

export interface FoodLoversStore {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  services: string[];
  specialOffers?: string;
  distance?: number; // Calculated from user location
}

export const FOOD_LOVERS_STORES: FoodLoversStore[] = [
  // GAUTENG
  {
    id: 'flm-store-001',
    name: 'Food Lovers Market - Johannesburg CBD',
    address: '123 Main Street, Johannesburg',
    city: 'Johannesburg',
    province: 'Gauteng',
    postalCode: '2000',
    latitude: -26.2023,
    longitude: 28.0436,
    phone: '011 838 8000',
    email: 'jhb-cbd@foodloversmarket.co.za',
    hours: {
      monday: '07:00 - 21:00',
      tuesday: '07:00 - 21:00',
      wednesday: '07:00 - 21:00',
      thursday: '07:00 - 21:00',
      friday: '07:00 - 21:00',
      saturday: '08:00 - 20:00',
      sunday: '09:00 - 19:00',
    },
    services: ['Fresh Society Card', 'Deli Counter', 'Butchery', 'Bakery', 'Pharmacy'],
    specialOffers: 'Fresh Society members get 5% off on Tuesdays',
  },
  {
    id: 'flm-store-002',
    name: 'Food Lovers Market - Sandton',
    address: '456 Sandton Drive, Sandton',
    city: 'Sandton',
    province: 'Gauteng',
    postalCode: '2146',
    latitude: -26.1089,
    longitude: 28.0573,
    phone: '011 884 8000',
    email: 'sandton@foodloversmarket.co.za',
    hours: {
      monday: '07:00 - 21:00',
      tuesday: '07:00 - 21:00',
      wednesday: '07:00 - 21:00',
      thursday: '07:00 - 21:00',
      friday: '07:00 - 21:00',
      saturday: '08:00 - 20:00',
      sunday: '09:00 - 19:00',
    },
    services: ['Fresh Society Card', 'Deli Counter', 'Butchery', 'Bakery', 'Wine Selection'],
    specialOffers: 'Platinum members get 10% off on weekdays',
  },
  {
    id: 'flm-store-003',
    name: 'Food Lovers Market - Pretoria East',
    address: '789 Pretoria Street, Pretoria',
    city: 'Pretoria',
    province: 'Gauteng',
    postalCode: '0001',
    latitude: -25.7461,
    longitude: 28.2622,
    phone: '012 345 6789',
    email: 'pretoria@foodloversmarket.co.za',
    hours: {
      monday: '07:00 - 21:00',
      tuesday: '07:00 - 21:00',
      wednesday: '07:00 - 21:00',
      thursday: '07:00 - 21:00',
      friday: '07:00 - 21:00',
      saturday: '08:00 - 20:00',
      sunday: '09:00 - 19:00',
    },
    services: ['Fresh Society Card', 'Deli Counter', 'Butchery', 'Bakery'],
    specialOffers: 'Gold members get 3% off on all purchases',
  },

  // WESTERN CAPE
  {
    id: 'flm-store-004',
    name: 'Food Lovers Market - Cape Town City Bowl',
    address: '321 Long Street, Cape Town',
    city: 'Cape Town',
    province: 'Western Cape',
    postalCode: '8000',
    latitude: -33.9249,
    longitude: 18.4241,
    phone: '021 423 5678',
    email: 'capetown@foodloversmarket.co.za',
    hours: {
      monday: '07:00 - 21:00',
      tuesday: '07:00 - 21:00',
      wednesday: '07:00 - 21:00',
      thursday: '07:00 - 21:00',
      friday: '07:00 - 21:00',
      saturday: '08:00 - 20:00',
      sunday: '09:00 - 19:00',
    },
    services: ['Fresh Society Card', 'Deli Counter', 'Butchery', 'Bakery', 'Wine Selection'],
    specialOffers: 'Fresh Society members get 5% off on Wednesdays',
  },
  {
    id: 'flm-store-005',
    name: 'Food Lovers Market - Stellenbosch',
    address: '654 Market Street, Stellenbosch',
    city: 'Stellenbosch',
    province: 'Western Cape',
    postalCode: '7600',
    latitude: -33.9356,
    longitude: 18.8636,
    phone: '021 887 5432',
    email: 'stellenbosch@foodloversmarket.co.za',
    hours: {
      monday: '07:00 - 20:00',
      tuesday: '07:00 - 20:00',
      wednesday: '07:00 - 20:00',
      thursday: '07:00 - 20:00',
      friday: '07:00 - 20:00',
      saturday: '08:00 - 19:00',
      sunday: '09:00 - 18:00',
    },
    services: ['Fresh Society Card', 'Deli Counter', 'Butchery', 'Wine Selection'],
    specialOffers: 'Weekend specials for Fresh Society members',
  },

  // KWAZULU-NATAL
  {
    id: 'flm-store-006',
    name: 'Food Lovers Market - Durban Umhlanga',
    address: '987 Ridge Road, Umhlanga',
    city: 'Durban',
    province: 'KwaZulu-Natal',
    postalCode: '4320',
    latitude: -29.7252,
    longitude: 31.1038,
    phone: '031 566 7890',
    email: 'durban@foodloversmarket.co.za',
    hours: {
      monday: '07:00 - 21:00',
      tuesday: '07:00 - 21:00',
      wednesday: '07:00 - 21:00',
      thursday: '07:00 - 21:00',
      friday: '07:00 - 21:00',
      saturday: '08:00 - 20:00',
      sunday: '09:00 - 19:00',
    },
    services: ['Fresh Society Card', 'Deli Counter', 'Butchery', 'Bakery', 'Pharmacy'],
    specialOffers: 'Platinum members get 10% off on Fridays',
  },
  {
    id: 'flm-store-007',
    name: 'Food Lovers Market - Pietermaritzburg',
    address: '246 Church Street, Pietermaritzburg',
    city: 'Pietermaritzburg',
    province: 'KwaZulu-Natal',
    postalCode: '3201',
    latitude: -29.6100,
    longitude: 30.3940,
    phone: '033 345 2109',
    email: 'pmb@foodloversmarket.co.za',
    hours: {
      monday: '07:00 - 20:00',
      tuesday: '07:00 - 20:00',
      wednesday: '07:00 - 20:00',
      thursday: '07:00 - 20:00',
      friday: '07:00 - 20:00',
      saturday: '08:00 - 19:00',
      sunday: '09:00 - 18:00',
    },
    services: ['Fresh Society Card', 'Deli Counter', 'Butchery'],
    specialOffers: 'Fresh Society members get 5% off on Mondays',
  },

  // LIMPOPO
  {
    id: 'flm-store-008',
    name: 'Food Lovers Market - Polokwane',
    address: '135 Thabo Mbeki Avenue, Polokwane',
    city: 'Polokwane',
    province: 'Limpopo',
    postalCode: '0700',
    latitude: -23.8954,
    longitude: 29.4179,
    phone: '015 291 4567',
    email: 'polokwane@foodloversmarket.co.za',
    hours: {
      monday: '07:00 - 20:00',
      tuesday: '07:00 - 20:00',
      wednesday: '07:00 - 20:00',
      thursday: '07:00 - 20:00',
      friday: '07:00 - 20:00',
      saturday: '08:00 - 19:00',
      sunday: '09:00 - 18:00',
    },
    services: ['Fresh Society Card', 'Deli Counter', 'Butchery'],
    specialOffers: 'Gold members get 3% off on all purchases',
  },

  // EASTERN CAPE
  {
    id: 'flm-store-009',
    name: 'Food Lovers Market - Port Elizabeth',
    address: '369 Main Street, Port Elizabeth',
    city: 'Port Elizabeth',
    province: 'Eastern Cape',
    postalCode: '6001',
    latitude: -33.9841,
    longitude: 25.6053,
    phone: '041 586 7890',
    email: 'pe@foodloversmarket.co.za',
    hours: {
      monday: '07:00 - 20:00',
      tuesday: '07:00 - 20:00',
      wednesday: '07:00 - 20:00',
      thursday: '07:00 - 20:00',
      friday: '07:00 - 20:00',
      saturday: '08:00 - 19:00',
      sunday: '09:00 - 18:00',
    },
    services: ['Fresh Society Card', 'Deli Counter', 'Butchery'],
    specialOffers: 'Fresh Society members get 5% off on Thursdays',
  },

  // NORTH WEST
  {
    id: 'flm-store-010',
    name: 'Food Lovers Market - Rustenburg',
    address: '753 Main Road, Rustenburg',
    city: 'Rustenburg',
    province: 'North West',
    postalCode: '0300',
    latitude: -25.6656,
    longitude: 27.2402,
    phone: '014 592 1234',
    email: 'rustenburg@foodloversmarket.co.za',
    hours: {
      monday: '07:00 - 20:00',
      tuesday: '07:00 - 20:00',
      wednesday: '07:00 - 20:00',
      thursday: '07:00 - 20:00',
      friday: '07:00 - 20:00',
      saturday: '08:00 - 19:00',
      sunday: '09:00 - 18:00',
    },
    services: ['Fresh Society Card', 'Deli Counter', 'Butchery'],
    specialOffers: 'Platinum members get 10% off on weekdays',
  },
];

/**
 * Find nearest Food Lovers Market stores
 */
export function findNearestStores(
  userLatitude: number,
  userLongitude: number,
  maxDistance: number = 50 // km
): FoodLoversStore[] {
  const storesWithDistance = FOOD_LOVERS_STORES.map(store => {
    const distance = calculateDistance(userLatitude, userLongitude, store.latitude, store.longitude);
    return { ...store, distance };
  });

  return storesWithDistance
    .filter(store => store.distance! <= maxDistance)
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get store by ID
 */
export function getStoreById(storeId: string): FoodLoversStore | undefined {
  return FOOD_LOVERS_STORES.find(store => store.id === storeId);
}

/**
 * Get stores by city
 */
export function getStoresByCity(city: string): FoodLoversStore[] {
  return FOOD_LOVERS_STORES.filter(store => store.city.toLowerCase() === city.toLowerCase());
}

/**
 * Get stores by province
 */
export function getStoresByProvince(province: string): FoodLoversStore[] {
  return FOOD_LOVERS_STORES.filter(store => store.province.toLowerCase() === province.toLowerCase());
}

/**
 * Get all provinces with stores
 */
export function getAllProvinces(): string[] {
  const provinces = new Set(FOOD_LOVERS_STORES.map(store => store.province));
  return Array.from(provinces).sort();
}

/**
 * Get store hours for a specific day
 */
export function getStoreHours(storeId: string, day: string): string | null {
  const store = getStoreById(storeId);
  if (!store) return null;

  const dayKey = day.toLowerCase();
  return store.hours[dayKey as keyof typeof store.hours] || null;
}

/**
 * Check if store is open now
 */
export function isStoreOpenNow(storeId: string): boolean {
  const store = getStoreById(storeId);
  if (!store) return false;

  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const currentTime = now.getHours() * 100 + now.getMinutes();

  const hoursStr = store.hours[dayName as keyof typeof store.hours];
  if (!hoursStr) return false;

  const [openStr, closeStr] = hoursStr.split(' - ');
  const openTime = parseInt(openStr.replace(':', ''));
  const closeTime = parseInt(closeStr.replace(':', ''));

  return currentTime >= openTime && currentTime < closeTime;
}

/**
 * Get Google Maps URL for store
 */
export function getGoogleMapsUrl(storeId: string): string | null {
  const store = getStoreById(storeId);
  if (!store) return null;

  return `https://maps.google.com/?q=${store.latitude},${store.longitude}`;
}

export default FOOD_LOVERS_STORES;
