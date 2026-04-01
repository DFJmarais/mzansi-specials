// Comprehensive authentic South African product database
// Real products with realistic names, sizes, and prices

export const AUTHENTIC_PRODUCTS = [
  // DAIRY & EGGS
  { name: 'Clover Full Cream Milk 1L', category: 'Dairy & Eggs', size: '1L', price: 18.99, originalPrice: 22.99, image: 'https://www.clover.co.za/assets/images/milk-full-cream-1l.jpg', description: 'Fresh full cream milk from trusted local farms' },
  { name: 'Clover Full Cream Milk 2L', category: 'Dairy & Eggs', size: '2L', price: 35.99, originalPrice: 42.99, image: 'https://www.clover.co.za/assets/images/milk-full-cream-2l.jpg', description: 'Value pack full cream milk' },
  { name: 'Rainbow Butter 500g', category: 'Dairy & Eggs', size: '500g', price: 42.99, originalPrice: 49.99, image: 'https://www.rainbowbutter.co.za/assets/images/butter-500g.jpg', description: 'Premium South African butter' },
  { name: 'Lancewood Cheddar Cheese 200g', category: 'Dairy & Eggs', size: '200g', price: 34.99, originalPrice: 39.99, image: 'https://www.lancewood.co.za/assets/images/cheese-cheddar-200g.jpg', description: 'Mature cheddar cheese' },
  { name: 'Danone Natural Yogurt 500g', category: 'Dairy & Eggs', size: '500g', price: 16.99, originalPrice: 19.99, image: 'https://www.danone.co.za/assets/images/yogurt-natural-500g.jpg', description: 'Plain natural yogurt' },
  { name: 'Free Range Eggs Dozen', category: 'Dairy & Eggs', size: '12 eggs', price: 29.99, originalPrice: 34.99, image: 'https://www.checkers.co.za/assets/images/eggs-free-range-dozen.jpg', description: 'Fresh free range eggs' },

  // MEAT & POULTRY
  { name: 'Chicken Breast Fillet 500g', category: 'Meat & Poultry', size: '500g', price: 59.99, originalPrice: 69.99, image: 'https://www.spar.co.za/assets/images/chicken-breast-500g.jpg', description: 'Fresh boneless chicken breast' },
  { name: 'Beef Steak Sirloin 400g', category: 'Meat & Poultry', size: '400g', price: 89.99, originalPrice: 109.99, image: 'https://www.picknpay.co.za/assets/images/beef-steak-sirloin-400g.jpg', description: 'Premium sirloin steak' },
  { name: 'Pork Chops 500g', category: 'Meat & Poultry', size: '500g', price: 69.99, originalPrice: 79.99, image: 'https://www.checkers.co.za/assets/images/pork-chops-500g.jpg', description: 'Fresh pork chops' },
  { name: 'Ground Beef 500g', category: 'Meat & Poultry', size: '500g', price: 54.99, originalPrice: 64.99, image: 'https://www.woolworths.co.za/assets/images/ground-beef-500g.jpg', description: 'Lean ground beef' },
  { name: 'Whole Chicken 1.8kg', category: 'Meat & Poultry', size: '1.8kg', price: 79.99, originalPrice: 94.99, image: 'https://www.okfoods.co.za/assets/images/whole-chicken-1.8kg.jpg', description: 'Fresh whole chicken' },

  // PRODUCE
  { name: 'Fresh Tomatoes 1kg', category: 'Produce', size: '1kg', price: 12.99, originalPrice: 15.99, image: 'https://www.woolworths.co.za/assets/images/tomatoes-fresh-1kg.jpg', description: 'Ripe red tomatoes' },
  { name: 'Fresh Lettuce Head', category: 'Produce', size: '1 head', price: 8.99, originalPrice: 10.99, image: 'https://www.okfoods.co.za/assets/images/lettuce-fresh-head.jpg', description: 'Crisp green lettuce' },
  { name: 'Gala Apples 1kg', category: 'Produce', size: '1kg', price: 22.99, originalPrice: 27.99, image: 'https://www.foodlovers.co.za/assets/images/apples-gala-1kg.jpg', description: 'Sweet Gala apples' },
  { name: 'Bananas 1kg', category: 'Produce', size: '1kg', price: 9.99, originalPrice: 12.99, image: 'https://www.spar.co.za/assets/images/bananas-1kg.jpg', description: 'Fresh yellow bananas' },
  { name: 'Onions 2kg', category: 'Produce', size: '2kg', price: 14.99, originalPrice: 18.99, image: 'https://www.picknpay.co.za/assets/images/onions-2kg.jpg', description: 'Golden onions' },
  { name: 'Carrots 1kg', category: 'Produce', size: '1kg', price: 7.99, originalPrice: 9.99, image: 'https://www.checkers.co.za/assets/images/carrots-1kg.jpg', description: 'Fresh orange carrots' },

  // BAKERY
  { name: 'White Bread Loaf 700g', category: 'Bakery', size: '700g', price: 8.99, originalPrice: 10.99, image: 'https://www.spar.co.za/assets/images/bread-white-700g.jpg', description: 'Fresh white bread loaf' },
  { name: 'Whole Wheat Bread 700g', category: 'Bakery', size: '700g', price: 10.99, originalPrice: 12.99, image: 'https://www.checkers.co.za/assets/images/bread-wholemeal-700g.jpg', description: 'Healthy whole wheat bread' },
  { name: 'Croissants Pack 4', category: 'Bakery', size: '4 pack', price: 16.99, originalPrice: 19.99, image: 'https://www.picknpay.co.za/assets/images/croissants-4pack.jpg', description: 'Buttery croissants' },
  { name: 'Sourdough Bread 600g', category: 'Bakery', size: '600g', price: 14.99, originalPrice: 17.99, image: 'https://www.woolworths.co.za/assets/images/bread-sourdough-600g.jpg', description: 'Artisan sourdough' },

  // PANTRY STAPLES
  { name: 'Sunflower Oil 2L', category: 'Pantry Staples', size: '2L', price: 34.99, originalPrice: 42.99, image: 'https://www.spar.co.za/assets/images/oil-sunflower-2l.jpg', description: 'Pure sunflower oil' },
  { name: 'Rice 5kg', category: 'Pantry Staples', size: '5kg', price: 79.99, originalPrice: 94.99, image: 'https://www.picknpay.co.za/assets/images/rice-5kg.jpg', description: 'Long grain white rice' },
  { name: 'Flour 2kg', category: 'Pantry Staples', size: '2kg', price: 16.99, originalPrice: 19.99, image: 'https://www.woolworths.co.za/assets/images/flour-2kg.jpg', description: 'All-purpose flour' },
  { name: 'Sugar 2kg', category: 'Pantry Staples', size: '2kg', price: 18.99, originalPrice: 22.99, image: 'https://www.checkers.co.za/assets/images/sugar-2kg.jpg', description: 'White granulated sugar' },
  { name: 'Salt 1kg', category: 'Pantry Staples', size: '1kg', price: 6.99, originalPrice: 8.99, image: 'https://www.okfoods.co.za/assets/images/salt-1kg.jpg', description: 'Table salt' },
  { name: 'Pasta 500g', category: 'Pantry Staples', size: '500g', price: 8.99, originalPrice: 10.99, image: 'https://www.foodlovers.co.za/assets/images/pasta-500g.jpg', description: 'Spaghetti pasta' },

  // BEVERAGES
  { name: 'Sprite Cooldrink 2L', category: 'Beverages', size: '2L', price: 14.99, originalPrice: 17.99, image: 'https://www.spar.co.za/assets/images/sprite-2l.jpg', description: 'Lemon-lime flavoured cooldrink' },
  { name: 'Coca-Cola 2L', category: 'Beverages', size: '2L', price: 14.99, originalPrice: 17.99, image: 'https://www.picknpay.co.za/assets/images/coca-cola-2l.jpg', description: 'Classic Coca-Cola' },
  { name: 'Fanta Orange 2L', category: 'Beverages', size: '2L', price: 12.99, originalPrice: 15.99, image: 'https://www.checkers.co.za/assets/images/fanta-orange-2l.jpg', description: 'Orange flavoured cooldrink' },
  { name: 'Tropica Orange Juice 1L', category: 'Beverages', size: '1L', price: 16.99, originalPrice: 19.99, image: 'https://www.woolworths.co.za/assets/images/tropica-oj-1l.jpg', description: 'Pure orange juice' },
  { name: 'Nescafé Instant Coffee 200g', category: 'Beverages', size: '200g', price: 34.99, originalPrice: 42.99, image: 'https://www.okfoods.co.za/assets/images/nescafe-coffee-200g.jpg', description: 'Instant coffee' },
  { name: 'Rooibos Tea 40 Bags', category: 'Beverages', size: '40 bags', price: 24.99, originalPrice: 29.99, image: 'https://www.foodlovers.co.za/assets/images/rooibos-tea-40bags.jpg', description: 'South African rooibos tea' },

  // SNACKS & CONFECTIONERY
  { name: 'Lay\'s Potato Chips 130g', category: 'Snacks & Confectionery', size: '130g', price: 12.99, originalPrice: 14.99, image: 'https://www.spar.co.za/assets/images/lays-chips-130g.jpg', description: 'Salted potato chips' },
  { name: 'Cadbury Chocolate Bar 45g', category: 'Snacks & Confectionery', size: '45g', price: 8.99, originalPrice: 10.99, image: 'https://www.picknpay.co.za/assets/images/cadbury-chocolate-45g.jpg', description: 'Cadbury milk chocolate' },
  { name: 'Biscuits Digestive 300g', category: 'Snacks & Confectionery', size: '300g', price: 14.99, originalPrice: 17.99, image: 'https://www.checkers.co.za/assets/images/biscuits-digestive-300g.jpg', description: 'Digestive biscuits' },
  { name: 'Pringles Crisps 165g', category: 'Snacks & Confectionery', size: '165g', price: 16.99, originalPrice: 19.99, image: 'https://www.woolworths.co.za/assets/images/pringles-165g.jpg', description: 'Stackable potato crisps' },

  // FROZEN FOODS
  { name: 'Frozen Mixed Vegetables 500g', category: 'Frozen Foods', size: '500g', price: 14.99, originalPrice: 17.99, image: 'https://www.okfoods.co.za/assets/images/frozen-veg-500g.jpg', description: 'Mixed frozen vegetables' },
  { name: 'Ice Cream Vanilla 1L', category: 'Frozen Foods', size: '1L', price: 24.99, originalPrice: 29.99, image: 'https://www.foodlovers.co.za/assets/images/ice-cream-vanilla-1l.jpg', description: 'Creamy vanilla ice cream' },
  { name: 'Frozen Pizza Pepperoni 400g', category: 'Frozen Foods', size: '400g', price: 34.99, originalPrice: 42.99, image: 'https://www.spar.co.za/assets/images/pizza-pepperoni-400g.jpg', description: 'Frozen pepperoni pizza' },

  // PERSONAL CARE
  { name: 'Colgate Toothpaste 100ml', category: 'Personal Care', size: '100ml', price: 12.99, originalPrice: 14.99, image: 'https://www.clicks.co.za/assets/images/colgate-toothpaste-100ml.jpg', description: 'Whitening toothpaste' },
  { name: 'Dove Soap Bar 100g', category: 'Personal Care', size: '100g', price: 8.99, originalPrice: 10.99, image: 'https://www.takealot.com/assets/images/dove-soap-100g.jpg', description: 'Moisturising soap bar' },
  { name: 'Shampoo Head & Shoulders 400ml', category: 'Personal Care', size: '400ml', price: 24.99, originalPrice: 29.99, image: 'https://www.checkers.co.za/assets/images/h&s-shampoo-400ml.jpg', description: 'Anti-dandruff shampoo' },

  // HOUSEHOLD ITEMS
  { name: 'Omo Detergent 2kg', category: 'Household Items', size: '2kg', price: 34.99, originalPrice: 42.99, image: 'https://www.spar.co.za/assets/images/omo-detergent-2kg.jpg', description: 'Laundry detergent powder' },
  { name: 'Toilet Paper 12 Roll Pack', category: 'Household Items', size: '12 rolls', price: 34.99, originalPrice: 42.99, image: 'https://www.woolworths.co.za/assets/images/toilet-paper-12pack.jpg', description: 'Soft toilet paper' },
  { name: 'Dish Soap 500ml', category: 'Household Items', size: '500ml', price: 8.99, originalPrice: 10.99, image: 'https://www.picknpay.co.za/assets/images/dish-soap-500ml.jpg', description: 'Liquid dish soap' },

  // HEALTH & WELLNESS
  { name: 'Vitamin C 500mg 30 Tablets', category: 'Health & Wellness', size: '30 tablets', price: 24.99, originalPrice: 29.99, image: 'https://www.takealot.com/assets/images/vitamin-c-500mg-30.jpg', description: 'Vitamin C supplement' },
  { name: 'Multivitamin 60 Tablets', category: 'Health & Wellness', size: '60 tablets', price: 34.99, originalPrice: 42.99, image: 'https://www.clicks.co.za/assets/images/multivitamin-60tabs.jpg', description: 'Daily multivitamin' },

  // PET SUPPLIES
  { name: 'Dog Food Purina 2kg', category: 'Pet Supplies', size: '2kg', price: 34.99, originalPrice: 42.99, image: 'https://www.takealot.com/assets/images/purina-dog-food-2kg.jpg', description: 'Complete dog nutrition' },
  { name: 'Cat Food 400g', category: 'Pet Supplies', size: '400g', price: 14.99, originalPrice: 17.99, image: 'https://www.spar.co.za/assets/images/cat-food-400g.jpg', description: 'Cat food pouches' },

  // CONDIMENTS & SAUCES
  { name: 'Tomato Sauce 500ml', category: 'Condiments & Sauces', size: '500ml', price: 8.99, originalPrice: 10.99, image: 'https://www.spar.co.za/assets/images/tomato-sauce-500ml.jpg', description: 'Tomato sauce' },
  { name: 'Mayonnaise 500ml', category: 'Condiments & Sauces', size: '500ml', price: 16.99, originalPrice: 19.99, image: 'https://www.woolworths.co.za/assets/images/mayo-500ml.jpg', description: 'Creamy mayonnaise' },
  { name: 'Peanut Butter 500g', category: 'Condiments & Sauces', size: '500g', price: 18.99, originalPrice: 22.99, image: 'https://www.picknpay.co.za/assets/images/peanut-butter-500g.jpg', description: 'Smooth peanut butter' },
];

export const RETAILERS_6 = ['Checkers', 'Pick n Pay', 'SPAR', 'Woolworths', 'OK Foods', 'Food Lovers Market'];
