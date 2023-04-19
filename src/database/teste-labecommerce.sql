
-- USERS
CREATE TABLE users (
    id TEXT UNIQUE NOT NULL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

SELECT * FROM users;

SELECT * FROM users
ORDER BY email ASC;

INSERT INTO users
VALUES 
    ("u001", "bruno@gmail.com", "01234"),
    ("u002", "nayara@gmail.com", "56789"),
    ("u003", "mariola@gmail.com", "98765");

INSERT INTO users
VALUES
    ("u004", "danilo@gamail.com", "43210");

UPDATE users
SET password = "43210"
WHERE id = "u003";

DELETE FROM users
WHERE id LIKE "%4%";

-- PRODUCTS
CREATE TABLE products (
    id TEXT UNIQUE NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL
);

SELECT * FROM products;

INSERT INTO products
VALUES
    ("p001", "computador completo", 5000, "Eletrônicos"),
    ("p002", "notebook i7", 3500, "Eletrônicos"),
    ("p003", "celular S20", 2000, "Eletrônicos"),
    ("p004", "jogo de cama casal", 300, "Cama, mesa e banho"),
    ("p005", "jogo de banho casal", 200, "Cama, mesa e banho");

INSERT INTO products
VALUES
    ("p006", "monitor", 789.90, "Eletrônicos");

SELECT * FROM products
WHERE name LIKE "%monitor%";

SELECT * FROM products
WHERE id = "p003";

SELECT * FROM products
ORDER BY price ASC
LIMIT 2
OFFSET 2;

SELECT * FROM products
WHERE price >= 1000.00
AND price <= 3000.00
ORDER BY price ASC;

DELETE FROM products
WHERE id = "p005";

UPDATE products
SET price = 2999.90
WHERE id = "p002";

CREATE TABLE purchases (
    id TEXT UNIQUE NOT NULL PRIMARY KEY,
    total_price REAL NOT NULL,
    paid INTEGER NOT NULL,
    delivered_at TEXT DEFAULT(DATETIME('now', 'localtime')),
    buyer_id TEXT NOT NULL,
    FOREIGN KEY (buyer_id) REFERENCES users(id)
);
SELECT * FROM purchases;

INSERT INTO purchases (id, total_price, paid, buyer_id)
VALUES
    ("c001", 7000, 0, "u001"),
    ("c002", 4000, 1, "u002"),
    ("c003", 5000, 1, "u003"),
    ("c004", 789.9, 0, "u001"),
    ("c005", 1300, 1, "u002"),
    ("c006", 2789.9, 0, "u003");

UPDATE purchases
SET delivered_at = DATETIME('now', 'localtime')
WHERE id = "c002";

UPDATE purchases
SET total_price = 3899.9
WHERE id = "c005";

SELECT 
    purchases.id AS purchaseId,
    purchases.total_price,
    purchases.paid,
    purchases.delivered_at,
    purchases.buyer_id,
    users.id AS userId,
    users.email
FROM purchases
INNER JOIN users
ON purchases.buyer_id = users.id
WHERE users.id = "u001";

CREATE TABLE purchases_products (
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO purchases_products
VALUES
    ("c002", "p003", 2),
    ("c003", "p001", 1),
    ("c005", "p002", 1),
    ("c005", "p004", 3);

SELECT
    purchases_products.quantity,
    purchases.id AS purchaseId,
    purchases.total_price,
    purchases.paid,
    purchases.delivered_at,
    purchases.buyer_id,
    products.id AS productId,
    products.name AS productName,
    products.price AS productPrice,
    products.category
FROM purchases_products
INNER JOIN purchases
ON purchases_products.purchase_id = purchases.id
INNER JOIN products
ON purchases_products.product_id = products.id;

