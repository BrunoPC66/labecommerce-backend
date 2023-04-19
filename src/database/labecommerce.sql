-- Active: 1681930998001@@127.0.0.1@3306

-- USERS
CREATE TABLE users (
    id TEXT UNIQUE NOT NULL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

SELECT * FROM users;

INSERT INTO users
VALUES 
    ("u001", "bruno@gmail.com", "01234"),
    ("u002", "nayara@gmail.com", "56789"),
    ("u003", "mariola@gmail.com", "98765");

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
    ("p005", "jogo de banho casal", 200, "Cama, mesa e banho"),
    ("p006", "monitor", 700, "Eletrônicos");

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
    ("c004", 700, 0, "u001"),
    ("c005", 1300, 1, "u002"),
    ("c006", 2700, 0, "u003");

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
ON purchases.buyer_id = users.id;

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
    ("c005", "p004", 3),
    ("c005", "p005", 2);

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