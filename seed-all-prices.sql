-- Comprehensive price seeding for all product categories
-- Realistic South African grocery prices across 5 retailers
-- Prices stored in cents (1999 = R19.99)

-- Baby Products
INSERT INTO prices (productId, storeName, price, originalPrice, discount, url, lastUpdated, createdAt)
SELECT p.id, 'Spar', 8999, 10400, 13, 'https://spar.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Baby Formula (900g)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Spar') UNION ALL
SELECT p.id, 'Pick n Pay', 9299, 10700, 13, 'https://pnp.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Baby Formula (900g)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Pick n Pay') UNION ALL
SELECT p.id, 'Checkers', 8699, 10000, 13, 'https://checkers.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Baby Formula (900g)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Checkers') UNION ALL
SELECT p.id, 'Woolworths', 9999, 11500, 13, 'https://woolworths.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Baby Formula (900g)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Woolworths') UNION ALL
SELECT p.id, 'OK Foods', 8799, 10100, 13, 'https://okfoods.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Baby Formula (900g)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'OK Foods');

-- Bakery Products
INSERT INTO prices (productId, storeName, price, originalPrice, discount, url, lastUpdated, createdAt)
SELECT p.id, 'Spar', 999, 1150, 13, 'https://spar.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Bread (Brown Loaf)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Spar') UNION ALL
SELECT p.id, 'Pick n Pay', 1049, 1200, 13, 'https://pnp.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Bread (Brown Loaf)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Pick n Pay') UNION ALL
SELECT p.id, 'Checkers', 949, 1100, 14, 'https://checkers.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Bread (Brown Loaf)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Checkers') UNION ALL
SELECT p.id, 'Woolworths', 1199, 1400, 14, 'https://woolworths.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Bread (Brown Loaf)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Woolworths') UNION ALL
SELECT p.id, 'OK Foods', 979, 1100, 11, 'https://okfoods.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Bread (Brown Loaf)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'OK Foods');

-- Croissants
INSERT INTO prices (productId, storeName, price, originalPrice, discount, url, lastUpdated, createdAt)
SELECT p.id, 'Spar', 2499, 2900, 14, 'https://spar.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Croissants (4 pack)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Spar') UNION ALL
SELECT p.id, 'Pick n Pay', 2599, 3000, 13, 'https://pnp.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Croissants (4 pack)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Pick n Pay') UNION ALL
SELECT p.id, 'Checkers', 2399, 2800, 14, 'https://checkers.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Croissants (4 pack)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Checkers') UNION ALL
SELECT p.id, 'Woolworths', 2799, 3200, 13, 'https://woolworths.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Croissants (4 pack)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Woolworths') UNION ALL
SELECT p.id, 'OK Foods', 2449, 2800, 12, 'https://okfoods.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Croissants (4 pack)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'OK Foods');

-- Rolls
INSERT INTO prices (productId, storeName, price, originalPrice, discount, url, lastUpdated, createdAt)
SELECT p.id, 'Spar', 1699, 1950, 13, 'https://spar.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Rolls (6 pack)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Spar') UNION ALL
SELECT p.id, 'Pick n Pay', 1799, 2050, 12, 'https://pnp.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Rolls (6 pack)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Pick n Pay') UNION ALL
SELECT p.id, 'Checkers', 1599, 1850, 14, 'https://checkers.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Rolls (6 pack)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Checkers') UNION ALL
SELECT p.id, 'Woolworths', 1899, 2200, 14, 'https://woolworths.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Rolls (6 pack)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Woolworths') UNION ALL
SELECT p.id, 'OK Foods', 1649, 1900, 13, 'https://okfoods.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Rolls (6 pack)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'OK Foods');

-- Orange Juice
INSERT INTO prices (productId, storeName, price, originalPrice, discount, url, lastUpdated, createdAt)
SELECT p.id, 'Spar', 1699, 1950, 13, 'https://spar.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Orange Juice (1L)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Spar') UNION ALL
SELECT p.id, 'Pick n Pay', 1899, 2200, 14, 'https://pnp.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Orange Juice (1L)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Pick n Pay') UNION ALL
SELECT p.id, 'Checkers', 1599, 1850, 14, 'https://checkers.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Orange Juice (1L)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Checkers') UNION ALL
SELECT p.id, 'Woolworths', 2099, 2450, 14, 'https://woolworths.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Orange Juice (1L)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Woolworths') UNION ALL
SELECT p.id, 'OK Foods', 1749, 2000, 13, 'https://okfoods.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Orange Juice (1L)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'OK Foods');

-- Tea
INSERT INTO prices (productId, storeName, price, originalPrice, discount, url, lastUpdated, createdAt)
SELECT p.id, 'Spar', 1999, 2300, 13, 'https://spar.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Tea (50 bags)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Spar') UNION ALL
SELECT p.id, 'Pick n Pay', 2199, 2500, 12, 'https://pnp.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Tea (50 bags)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Pick n Pay') UNION ALL
SELECT p.id, 'Checkers', 1899, 2200, 14, 'https://checkers.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Tea (50 bags)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Checkers') UNION ALL
SELECT p.id, 'Woolworths', 2399, 2800, 14, 'https://woolworths.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Tea (50 bags)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Woolworths') UNION ALL
SELECT p.id, 'OK Foods', 2049, 2350, 13, 'https://okfoods.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Tea (50 bags)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'OK Foods');

-- Sprite
INSERT INTO prices (productId, storeName, price, originalPrice, discount, url, lastUpdated, createdAt)
SELECT p.id, 'Spar', 2499, 2900, 14, 'https://spar.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Sprite (2L)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Spar') UNION ALL
SELECT p.id, 'Pick n Pay', 2699, 3100, 13, 'https://pnp.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Sprite (2L)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Pick n Pay') UNION ALL
SELECT p.id, 'Checkers', 2399, 2800, 14, 'https://checkers.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Sprite (2L)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Checkers') UNION ALL
SELECT p.id, 'Woolworths', 2899, 3400, 15, 'https://woolworths.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Sprite (2L)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Woolworths') UNION ALL
SELECT p.id, 'OK Foods', 2549, 3000, 15, 'https://okfoods.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Sprite (2L)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'OK Foods');

-- Butter
INSERT INTO prices (productId, storeName, price, originalPrice, discount, url, lastUpdated, createdAt)
SELECT p.id, 'Spar', 2999, 3500, 14, 'https://spar.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Butter (250g)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Spar') UNION ALL
SELECT p.id, 'Pick n Pay', 3199, 3700, 14, 'https://pnp.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Butter (250g)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Pick n Pay') UNION ALL
SELECT p.id, 'Checkers', 2899, 3400, 15, 'https://checkers.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Butter (250g)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Checkers') UNION ALL
SELECT p.id, 'Woolworths', 3499, 4100, 15, 'https://woolworths.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Butter (250g)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Woolworths') UNION ALL
SELECT p.id, 'OK Foods', 3049, 3500, 13, 'https://okfoods.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Butter (250g)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'OK Foods');

-- Cheese
INSERT INTO prices (productId, storeName, price, originalPrice, discount, url, lastUpdated, createdAt)
SELECT p.id, 'Spar', 4999, 5800, 14, 'https://spar.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Cheese (500g)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Spar') UNION ALL
SELECT p.id, 'Pick n Pay', 5299, 6100, 13, 'https://pnp.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Cheese (500g)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Pick n Pay') UNION ALL
SELECT p.id, 'Checkers', 4799, 5600, 14, 'https://checkers.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Cheese (500g)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Checkers') UNION ALL
SELECT p.id, 'Woolworths', 5699, 6600, 14, 'https://woolworths.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Cheese (500g)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Woolworths') UNION ALL
SELECT p.id, 'OK Foods', 5199, 6000, 13, 'https://okfoods.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Cheese (500g)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'OK Foods');

-- Yogurt
INSERT INTO prices (productId, storeName, price, originalPrice, discount, url, lastUpdated, createdAt)
SELECT p.id, 'Spar', 1499, 1750, 14, 'https://spar.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Yogurt (500g)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Spar') UNION ALL
SELECT p.id, 'Pick n Pay', 1699, 1950, 13, 'https://pnp.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Yogurt (500g)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Pick n Pay') UNION ALL
SELECT p.id, 'Checkers', 1399, 1650, 15, 'https://checkers.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Yogurt (500g)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Checkers') UNION ALL
SELECT p.id, 'Woolworths', 1899, 2200, 14, 'https://woolworths.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Yogurt (500g)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'Woolworths') UNION ALL
SELECT p.id, 'OK Foods', 1549, 1800, 14, 'https://okfoods.co.za', NOW(), NOW() FROM products p WHERE p.name = 'Yogurt (500g)' AND NOT EXISTS (SELECT 1 FROM prices WHERE productId = p.id AND storeName = 'OK Foods');
