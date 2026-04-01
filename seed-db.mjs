#!/usr/bin/env node
/**
 * Database Seed Script
 * Populates initial products and diet categories
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Expanded product list with household essentials and personal care items
const PRODUCTS = [
  // Dairy & Milk
  { name: 'Full Cream Milk (1L)', category: 'Dairy', description: 'Fresh full cream milk' },
  { name: 'Low Fat Milk (1L)', category: 'Dairy', description: 'Low fat milk for health conscious' },
  { name: 'Butter (500g)', category: 'Dairy', description: 'Salted butter' },
  { name: 'Cheddar Cheese (200g)', category: 'Dairy', description: 'Hard cheddar cheese' },
  { name: 'Yogurt (500g)', category: 'Dairy', description: 'Plain yogurt' },
  
  // Meat & Protein
  { name: 'Beef Steak (500g)', category: 'Meat', description: 'Premium beef steak' },
  { name: 'Chicken Breast (1kg)', category: 'Meat', description: 'Fresh chicken breast' },
  { name: 'Pork Chops (500g)', category: 'Meat', description: 'Fresh pork chops' },
  { name: 'Ground Beef (500g)', category: 'Meat', description: 'Lean ground beef' },
  { name: 'Boerewors (500g)', category: 'Meat', description: 'Traditional South African sausage' },
  
  // Produce
  { name: 'Tomatoes (1kg)', category: 'Produce', description: 'Fresh red tomatoes' },
  { name: 'Onions (1kg)', category: 'Produce', description: 'Yellow onions' },
  { name: 'Potatoes (2kg)', category: 'Produce', description: 'White potatoes' },
  { name: 'Carrots (1kg)', category: 'Produce', description: 'Fresh carrots' },
  { name: 'Apples (1kg)', category: 'Produce', description: 'Red apples' },
  { name: 'Bananas (1kg)', category: 'Produce', description: 'Yellow bananas' },
  { name: 'Lettuce (1 head)', category: 'Produce', description: 'Fresh green lettuce' },
  { name: 'Broccoli (500g)', category: 'Produce', description: 'Fresh broccoli' },
  
  // Bakery
  { name: 'Bread (White Loaf)', category: 'Bakery', description: 'White bread loaf' },
  { name: 'Bread (Brown Loaf)', category: 'Bakery', description: 'Brown bread loaf' },
  { name: 'Rolls (6 pack)', category: 'Bakery', description: 'Dinner rolls' },
  { name: 'Croissants (4 pack)', category: 'Bakery', description: 'Butter croissants' },
  
  // Pantry
  { name: 'Rice (5kg)', category: 'Pantry', description: 'White rice' },
  { name: 'Pasta (500g)', category: 'Pantry', description: 'Spaghetti pasta' },
  { name: 'Flour (2kg)', category: 'Pantry', description: 'All-purpose flour' },
  { name: 'Sugar (2kg)', category: 'Pantry', description: 'White sugar' },
  { name: 'Oil (1L)', category: 'Pantry', description: 'Vegetable oil' },
  { name: 'Peanut Butter (400g)', category: 'Pantry', description: 'Creamy peanut butter' },
  { name: 'Jam (400g)', category: 'Pantry', description: 'Strawberry jam' },
  { name: 'Beans (400g)', category: 'Pantry', description: 'Canned beans' },
  
  // Beverages
  { name: 'Orange Juice (1L)', category: 'Beverages', description: 'Fresh orange juice' },
  { name: 'Coffee (200g)', category: 'Beverages', description: 'Ground coffee' },
  { name: 'Tea (50 bags)', category: 'Beverages', description: 'Black tea bags' },
  { name: 'Coca Cola (2L)', category: 'Beverages', description: 'Coca Cola bottle' },
  { name: 'Water (6 pack)', category: 'Beverages', description: 'Bottled water' },
  
  // Snacks
  { name: 'Chips (200g)', category: 'Snacks', description: 'Potato chips' },
  { name: 'Biscuits (300g)', category: 'Snacks', description: 'Digestive biscuits' },
  { name: 'Chocolate Bar (50g)', category: 'Snacks', description: 'Milk chocolate bar' },
  { name: 'Nuts (200g)', category: 'Snacks', description: 'Mixed nuts' },
  { name: 'Biltong (100g)', category: 'Snacks', description: 'Dried biltong' },
  
  // Eggs & Breakfast
  { name: 'Eggs (12 pack)', category: 'Eggs', description: 'Fresh chicken eggs' },
  { name: 'Cereal (500g)', category: 'Breakfast', description: 'Corn flakes cereal' },
  { name: 'Oats (500g)', category: 'Breakfast', description: 'Rolled oats' },
  { name: 'Honey (500g)', category: 'Breakfast', description: 'Pure honey' },
  
  // Frozen
  { name: 'Frozen Vegetables (500g)', category: 'Frozen', description: 'Mixed frozen vegetables' },
  { name: 'Ice Cream (1L)', category: 'Frozen', description: 'Vanilla ice cream' },
  { name: 'Frozen Pizza (400g)', category: 'Frozen', description: 'Cheese pizza' },
  
  // Condiments
  { name: 'Tomato Sauce (400g)', category: 'Condiments', description: 'Tomato sauce bottle' },
  { name: 'Mayonnaise (400g)', category: 'Condiments', description: 'Mayonnaise jar' },
  { name: 'Vinegar (750ml)', category: 'Condiments', description: 'White vinegar' },
  { name: 'Salt (1kg)', category: 'Condiments', description: 'Table salt' },
  { name: 'Spice Mix (50g)', category: 'Condiments', description: 'Mixed spices' },

  // NEW: Personal Care & Hygiene (20 items)
  { name: 'Sanitary Pads (10 pack)', category: 'Personal Care', description: 'Regular flow sanitary pads' },
  { name: 'Sanitary Pads (20 pack)', category: 'Personal Care', description: 'Super flow sanitary pads' },
  { name: 'Tampons (16 pack)', category: 'Personal Care', description: 'Regular tampons' },
  { name: 'Panty Liners (30 pack)', category: 'Personal Care', description: 'Daily panty liners' },
  { name: 'Deodorant (150ml)', category: 'Personal Care', description: 'Roll-on deodorant' },
  { name: 'Toothpaste (100ml)', category: 'Personal Care', description: 'Fluoride toothpaste' },
  { name: 'Toothbrush (1 pack)', category: 'Personal Care', description: 'Soft bristle toothbrush' },
  { name: 'Soap Bar (200g)', category: 'Personal Care', description: 'Moisturizing soap' },
  { name: 'Shampoo (400ml)', category: 'Personal Care', description: 'Hair shampoo' },
  { name: 'Conditioner (400ml)', category: 'Personal Care', description: 'Hair conditioner' },
  { name: 'Body Lotion (250ml)', category: 'Personal Care', description: 'Moisturizing body lotion' },
  { name: 'Razor (3 pack)', category: 'Personal Care', description: 'Disposable razors' },
  { name: 'Shaving Cream (200ml)', category: 'Personal Care', description: 'Shaving cream' },
  { name: 'Face Wash (150ml)', category: 'Personal Care', description: 'Gentle face wash' },
  { name: 'Moisturizer (100ml)', category: 'Personal Care', description: 'Facial moisturizer' },
  { name: 'Nail Clippers (1 pack)', category: 'Personal Care', description: 'Stainless steel nail clippers' },
  { name: 'Hair Brush (1 pack)', category: 'Personal Care', description: 'Detangling hair brush' },
  { name: 'Feminine Wash (250ml)', category: 'Personal Care', description: 'Intimate wash' },
  { name: 'Perfume (100ml)', category: 'Personal Care', description: 'Eau de toilette' },
  { name: 'Lip Balm (5g)', category: 'Personal Care', description: 'Moisturizing lip balm' },

  // NEW: Household Essentials (20 items)
  { name: 'Toilet Paper (12 roll)', category: 'Household', description: 'Soft toilet paper rolls' },
  { name: 'Tissue Paper (200 sheets)', category: 'Household', description: 'Facial tissue box' },
  { name: 'Paper Towels (6 roll)', category: 'Household', description: 'Kitchen paper towels' },
  { name: 'Trash Bags (30 pack)', category: 'Household', description: 'Large trash bags' },
  { name: 'Dish Soap (500ml)', category: 'Household', description: 'Liquid dish soap' },
  { name: 'Laundry Detergent (2L)', category: 'Household', description: 'Liquid laundry detergent' },
  { name: 'Fabric Softener (1L)', category: 'Household', description: 'Fabric softener concentrate' },
  { name: 'Bleach (750ml)', category: 'Household', description: 'Chlorine bleach' },
  { name: 'Floor Cleaner (1L)', category: 'Household', description: 'Multi-purpose floor cleaner' },
  { name: 'Glass Cleaner (500ml)', category: 'Household', description: 'Window and glass cleaner' },
  { name: 'Disinfectant (500ml)', category: 'Household', description: 'Surface disinfectant spray' },
  { name: 'Sponges (3 pack)', category: 'Household', description: 'Kitchen sponges' },
  { name: 'Rubber Gloves (1 pair)', category: 'Household', description: 'Latex-free gloves' },
  { name: 'Aluminum Foil (30m)', category: 'Household', description: 'Kitchen aluminum foil' },
  { name: 'Plastic Wrap (30m)', category: 'Household', description: 'Food plastic wrap' },
  { name: 'Sandwich Bags (100 pack)', category: 'Household', description: 'Resealable sandwich bags' },
  { name: 'Freezer Bags (50 pack)', category: 'Household', description: 'Freezer storage bags' },
  { name: 'Matches (1 box)', category: 'Household', description: 'Safety matches' },
  { name: 'Candles (4 pack)', category: 'Household', description: 'Scented candles' },
  { name: 'Light Bulbs (2 pack)', category: 'Household', description: 'LED light bulbs' },

  // NEW: Health & Wellness (15 items)
  { name: 'Paracetamol (24 tablets)', category: 'Health', description: 'Pain relief tablets' },
  { name: 'Ibuprofen (24 tablets)', category: 'Health', description: 'Anti-inflammatory tablets' },
  { name: 'Cough Syrup (200ml)', category: 'Health', description: 'Cough and cold syrup' },
  { name: 'Cold Medicine (10 tablets)', category: 'Health', description: 'Cold and flu tablets' },
  { name: 'Antacid (20 tablets)', category: 'Health', description: 'Heartburn relief tablets' },
  { name: 'Antihistamine (10 tablets)', category: 'Health', description: 'Allergy relief tablets' },
  { name: 'Vitamin C (30 tablets)', category: 'Health', description: 'Vitamin C supplements' },
  { name: 'Multivitamins (30 tablets)', category: 'Health', description: 'Daily multivitamins' },
  { name: 'Vitamin D (30 tablets)', category: 'Health', description: 'Vitamin D3 supplements' },
  { name: 'Probiotics (30 capsules)', category: 'Health', description: 'Probiotic supplement' },
  { name: 'First Aid Kit (1 pack)', category: 'Health', description: 'Complete first aid kit' },
  { name: 'Bandages (30 pack)', category: 'Health', description: 'Adhesive bandages' },
  { name: 'Antiseptic Cream (50g)', category: 'Health', description: 'Antibiotic ointment' },
  { name: 'Thermometer (1 pack)', category: 'Health', description: 'Digital thermometer' },
  { name: 'Pain Relief Cream (100g)', category: 'Health', description: 'Muscle pain relief cream' },

  // NEW: Baby Products (12 items)
  { name: 'Diapers (60 pack)', category: 'Baby', description: 'Newborn diapers' },
  { name: 'Baby Formula (900g)', category: 'Baby', description: 'Infant formula milk' },
  { name: 'Baby Wipes (80 pack)', category: 'Baby', description: 'Gentle baby wipes' },
  { name: 'Baby Shampoo (200ml)', category: 'Baby', description: 'Tear-free baby shampoo' },
  { name: 'Baby Lotion (200ml)', category: 'Baby', description: 'Moisturizing baby lotion' },
  { name: 'Nappy Rash Cream (100g)', category: 'Baby', description: 'Diaper rash cream' },
  { name: 'Baby Bottle (250ml)', category: 'Baby', description: 'Feeding bottle' },
  { name: 'Bottle Sterilizer (1 pack)', category: 'Baby', description: 'Bottle sterilizer' },
  { name: 'Baby Pacifiers (2 pack)', category: 'Baby', description: 'Silicone pacifiers' },
  { name: 'Baby Blanket (1 pack)', category: 'Baby', description: 'Soft cotton blanket' },
  { name: 'Baby Socks (6 pack)', category: 'Baby', description: 'Newborn socks' },
  { name: 'Baby Mittens (1 pair)', category: 'Baby', description: 'Soft mittens' },

  // NEW: Pet Supplies (10 items)
  { name: 'Dog Food (2kg)', category: 'Pet Supplies', description: 'Dry dog food' },
  { name: 'Cat Food (2kg)', category: 'Pet Supplies', description: 'Dry cat food' },
  { name: 'Dog Treats (200g)', category: 'Pet Supplies', description: 'Crunchy dog treats' },
  { name: 'Cat Treats (100g)', category: 'Pet Supplies', description: 'Crunchy cat treats' },
  { name: 'Dog Shampoo (250ml)', category: 'Pet Supplies', description: 'Pet shampoo' },
  { name: 'Pet Wipes (40 pack)', category: 'Pet Supplies', description: 'Cleaning pet wipes' },
  { name: 'Pet Collar (1 pack)', category: 'Pet Supplies', description: 'Adjustable pet collar' },
  { name: 'Pet Leash (1 pack)', category: 'Pet Supplies', description: 'Dog leash' },
  { name: 'Cat Litter (5kg)', category: 'Pet Supplies', description: 'Clumping cat litter' },
  { name: 'Pet Bed (1 pack)', category: 'Pet Supplies', description: 'Comfortable pet bed' },

  // NEW: Laundry & Cleaning (12 items)
  { name: 'Stain Remover (500ml)', category: 'Laundry', description: 'Pre-wash stain remover' },
  { name: 'Fabric Refresher (300ml)', category: 'Laundry', description: 'Fabric freshener spray' },
  { name: 'Wool Wash (500ml)', category: 'Laundry', description: 'Delicate wool wash' },
  { name: 'Dishwasher Tablets (30 pack)', category: 'Laundry', description: 'Automatic dishwasher tablets' },
  { name: 'Oven Cleaner (500ml)', category: 'Laundry', description: 'Heavy-duty oven cleaner' },
  { name: 'Bathroom Cleaner (500ml)', category: 'Laundry', description: 'Tile and grout cleaner' },
  { name: 'Mold Remover (500ml)', category: 'Laundry', description: 'Anti-mold spray' },
  { name: 'Air Freshener (300ml)', category: 'Laundry', description: 'Room air freshener spray' },
  { name: 'Laundry Powder (1kg)', category: 'Laundry', description: 'Powdered laundry detergent' },
  { name: 'Softener Beads (200g)', category: 'Laundry', description: 'Scented softener beads' },
  { name: 'Dryer Sheets (40 pack)', category: 'Laundry', description: 'Fabric dryer sheets' },
  { name: 'Lint Roller (1 pack)', category: 'Laundry', description: 'Sticky lint roller' },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Parse DATABASE_URL
    const dbUrl = new URL(process.env.DATABASE_URL);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const connection = await mysql.createConnection({
      host: dbUrl.hostname,
      port: dbUrl.port,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.slice(1),
      ssl: { rejectUnauthorized: false },
    });
    
    console.log('✅ Connected to database');
    
    // Check if products table exists
    const [tables] = await connection.query(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products'",
      [dbUrl.pathname.slice(1)]
    );
    
    if (tables.length === 0) {
      console.error('❌ Products table does not exist. Please run pnpm db:push first.');
      process.exit(1);
    }
    
    console.log('✅ Products table exists');
    
    // Clear existing products
    await connection.query('DELETE FROM products');
    console.log('🗑️  Cleared existing products');
    
    // Insert products
    let inserted = 0;
    for (const product of PRODUCTS) {
      try {
        await connection.query(
          'INSERT INTO products (name, category, description) VALUES (?, ?, ?)',
          [product.name, product.category, product.description]
        );
        inserted++;
      } catch (err) {
        if (err.code !== 'ER_DUP_ENTRY') {
          console.error(`Error inserting ${product.name}:`, err.message);
        }
      }
    }
    
    console.log(`✅ Inserted ${inserted} products`);
    
    // Verify insertion
    const [result] = await connection.query('SELECT COUNT(*) as count FROM products');
    console.log(`📊 Total products in database: ${result[0].count}`);
    
    await connection.end();
    console.log('✅ Database seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

seedDatabase();
