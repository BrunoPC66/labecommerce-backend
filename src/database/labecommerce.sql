-- Active: 1680029359661@@127.0.0.1@3306

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

