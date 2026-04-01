import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mzansi_specials',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

try {
  // Get all products
  const [products] = await connection.execute('SELECT id, name FROM products');
  console.log(`Found ${products.length} products`);

  const stores = ['Spar', 'Pick n Pay', 'Checkers', 'OK Foods', 'ShopRite', 'Woolworths'];
  let pricesInserted = 0;

  // Generate prices for each product
  for (const product of products) {
    for (const store of stores) {
      // Generate random price between R5 and R500
      const basePrice = Math.floor(Math.random() * (50000 - 500) + 500); // in cents
      const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 30) : 0;
      const finalPrice = Math.floor(basePrice * (1 - discount / 100));

      await connection.execute(
        'INSERT INTO prices (productId, storeName, price, originalPrice, discount, lastUpdated) VALUES (?, ?, ?, ?, ?, NOW())',
        [product.id, store, finalPrice, basePrice, discount]
      );
      pricesInserted++;
    }
  }

  console.log(`✓ Generated ${pricesInserted} prices for ${products.length} products`);
  process.exit(0);
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
} finally {
  await connection.end();
}
