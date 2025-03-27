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
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
                   ('Clothing', 'Apparel and accessories')
ON CONFLICT DO NOTHING;

INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES
                  ('adam123', 'adam@example.com', 'hashed_password', 'Adam', 'Smith'),
                  ('ewa', 'ewa@example.com', 'hashed_password', 'Ewa', 'Johnson')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, category_id, description, price, stock_count, brand, image_url, is_available) VALUES
                   ('Smartphone2222', 1, 'Latest model smartphone', 699.99, 50, 'BrandX', 'http://example.com/phone.jpg', TRUE),
                   ('Jeans', 2, 'Blue denim jeans', 49.99, 100, 'DenimCo', 'http://example.com/jeans.jpg', TRUE)
ON CONFLICT DO NOTHING;
