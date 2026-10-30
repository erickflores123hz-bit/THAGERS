-- ============================================================
-- TAGHER'S STREETWEAR - ESQUEMA DE BASE DE DATOS RELACIONAL
-- Compatible con PostgreSQL (Supabase), MySQL y SQLite
-- ============================================================

-- 1. TABLA DE USUARIOS Y AUTENTICACIÓN
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer', -- 'customer' o 'admin'
    phone VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA DE PRODUCTOS
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,       -- 'vaqueros', 'camisetas', 'sudaderas', 'accesorios'
    sub_category VARCHAR(50) NOT NULL,   -- 'denim', 'graphic', 'hoodie', 'cadenas', 'anillos', etc.
    price DECIMAL(10, 2) NOT NULL,
    old_price DECIMAL(10, 2),
    stock INT DEFAULT 50,
    badge VARCHAR(50),                   -- 'SOUTHPOLE', 'TOP SELLER', 'NUEVO'
    description TEXT,
    overlay_type VARCHAR(20) DEFAULT 'top', -- 'top', 'bottom', 'accessory'
    is_offer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA DE FOTOGRAFÍAS PARA CARRUSEL MULTI-ÁNGULO
CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    image_url TEXT NOT NULL,
    view_angle VARCHAR(30) DEFAULT 'front', -- 'front', 'back', 'model', 'detail'
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 1,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 4. TABLA DE CUPONES DE DESCUENTO
CREATE TABLE IF NOT EXISTS coupons (
    code VARCHAR(30) PRIMARY KEY,
    discount_rate DECIMAL(3, 2) NOT NULL, -- Ej: 0.10 para 10%
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NULL
);

-- 5. TABLA DE ÓRDENES DE COMPRA (PEDIDOS)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(30) PRIMARY KEY,           -- Ej: '#TAG-8491'
    user_id VARCHAR(36),
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    coupon_code VARCHAR(30),
    payment_method VARCHAR(50) DEFAULT 'card', -- 'card', 'mercadopago', 'transfer'
    status VARCHAR(30) DEFAULT 'En preparación', -- 'En preparación', 'Despachado', 'Entregado'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (coupon_code) REFERENCES coupons(code) ON DELETE SET NULL
);

-- 6. TABLA DE ITEMS POR ORDEN DE COMPRA
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(30) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    size VARCHAR(10) DEFAULT 'M',
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 7. TABLA DE FAVORITOS / WISHLIST
CREATE TABLE IF NOT EXISTS wishlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================================
-- DATOS INICIALES DE DEMOSTRACIÓN (SEED DATA)
-- ============================================================

-- Usuario de demostración (password: 123456)
INSERT INTO users (id, name, email, password_hash, role)
VALUES ('user-demo-01', 'Lucas Streetwear', 'demo@taghers.com', '$2b$10$wN1k8xO9bX9.0Zk1demo123456', 'customer')
ON DUPLICATE KEY UPDATE name=name;

-- Cupones
INSERT INTO coupons (code, discount_rate, is_active)
VALUES ('TAGHERS10', 0.10, TRUE), ('SOUTHPOLE10', 0.10, TRUE)
ON DUPLICATE KEY UPDATE discount_rate=discount_rate;

-- Productos principales
INSERT INTO products (id, name, category, sub_category, price, old_price, badge, description, overlay_type, is_offer) VALUES
('vag-01', 'Southpole 90s Vintage Baggy Denim', 'vaqueros', 'denim', 75000, 89000, 'SOUTHPOLE', 'Vaqueros de corte ultra ancho inspirados en el skate y hip-hop de los años 90. Tejido denim de 14.5 oz con lavado stone-wash vintage y costuras reforzadas.', 'bottom', TRUE),
('vag-02', 'Yellow Arc Contrast Baggy Denim', 'vaqueros', 'denim', 85000, NULL, 'TOP SELLER', 'Pantalón vaquero negro con diseño de arco contrastante en amarillo en la parte posterior, corte holgado sobre la bota y parche de cuero vegano.', 'bottom', FALSE),
('tee-01', 'Cyber Gothic Skull Heavyweight Tee', 'camisetas', 'graphic', 38000, 45000, 'DROP EXCLUSIVO', 'Camiseta de algodón peinado 280gsm con corte boxy fit oversize y serigrafía de calavera gótica con detalles grunge en plata metalizada.', 'top', TRUE),
('sud-01', 'Tactical Camo Technical Puffer Jacket', 'sudaderas', 'chaquetas', 98000, 120000, 'INVIERNO 26', 'Chaqueta acolchada con relleno térmico de alta densidad, tejido exterior impermeable ripstop con patrón camuflado oscuro y capucha desmontable.', 'top', TRUE),
('acc-01', 'Cuban Link Chunky Silver Chain 14mm', 'accesorios', 'cadenas', 32000, 38000, 'PLATA 925', 'Cadena de eslabón cubano grueso en acero quirúrgico 316L con baño de plata brillante. Cierre de seguridad reforzado anti-apertura.', 'accessory', TRUE)
ON DUPLICATE KEY UPDATE name=name;
