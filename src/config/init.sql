-- Usuń tabele, jeśli już istnieją
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;


CREATE TABLE IF NOT EXISTS categories (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR(100) UNIQUE NOT NULL,
                          description TEXT
);

CREATE TABLE IF NOT EXISTS users (
                         id SERIAL PRIMARY KEY,
                         username VARCHAR(50) UNIQUE NOT NULL,
                         email VARCHAR(100) UNIQUE NOT NULL,
                         password_hash TEXT NOT NULL,
                         first_name VARCHAR(50),
                         last_name VARCHAR(50),
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         role VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS products (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(100) NOT NULL,
                        category_id INT REFERENCES categories(id) ON DELETE SET NULL,
                        description TEXT,
                        price DECIMAL(10,2) NOT NULL,
                        stock_count INT DEFAULT 0,
                        brand VARCHAR(50),
                        image_url TEXT,
                        is_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS reviews (
                       id SERIAL PRIMARY KEY,
                       product_id INT REFERENCES products(id) ON DELETE CASCADE,
                       user_id INT REFERENCES users(id) ON DELETE CASCADE,
                       rating INT CHECK (rating BETWEEN 1 AND 5),
                       comment TEXT
);

INSERT INTO categories (name, description) VALUES
                   ('Electronics', 'Devices and gadgets'),
                   ('Clothing', 'Apparel and accessories'),
                   ('Books', 'Books and magazines'),
                   ('Home & Kitchen', 'Home appliances and kitchenware'),
                   ('Toys', 'Games and toys for children')
ON CONFLICT DO NOTHING;

INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES
                  ('adam123', 'adam@example.com', 'hashed_password', 'Adam', 'Smith'),
                  ('ewa', 'ewa@example.com', 'hashed_password', 'Ewa', 'Johnson')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, category_id, description, price, stock_count, brand, image_url, is_available) VALUES
                  ('Smartphone X10', 1, 'High-end smartphone with AMOLED display', 899.99, 30, 'TechCorp', 'http://example.com/phone1.jpg', TRUE),
                  ('Wireless Earbuds', 1, 'Noise cancelling, Bluetooth 5.0', 129.99, 200, 'SoundX', 'http://example.com/earbuds.jpg', TRUE),
                  ('Gaming Laptop', 1, 'RTX 3060, 16GB RAM, 1TB SSD', 1499.99, 15, 'GamePower', 'http://example.com/laptop.jpg', TRUE),
                  ('Jeans', 2, 'Blue denim jeans', 49.99, 100, 'DenimCo', 'http://example.com/jeans.jpg', TRUE),
                  ('T-Shirt', 2, 'Cotton T-Shirt with print', 19.99, 150, 'CoolWear', 'http://example.com/tshirt.jpg', TRUE),
                  ('Coffee Maker', 4, '12-cup programmable coffee maker', 59.99, 40, 'KitchenPro', 'http://example.com/coffeemaker.jpg', TRUE),
                  ('Harry Potter Book Set', 3, 'Complete 7-book collection', 79.99, 25, 'Scholastic', 'http://example.com/hpbooks.jpg', TRUE),
                  ('LEGO Star Wars', 5, 'Millennium Falcon building kit', 149.99, 10, 'LEGO', 'http://example.com/lego.jpg', TRUE),
                  ('Bluetooth Speaker', 1, 'Portable waterproof speaker', 39.99, 80, 'BeatBox', 'http://example.com/speaker.jpg', TRUE),
                  ('Kitchen Knife Set', 4, 'Stainless steel knives', 89.99, 60, 'SharpEdge', 'http://example.com/knives.jpg', TRUE)
ON CONFLICT DO NOTHING;
