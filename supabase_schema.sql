-- ============================================================
-- TAGHER'S STREETWEAR - ESQUEMA OFICIAL PARA SUPABASE (POSTGRESQL)
-- Pega este código en el "SQL Editor" de tu panel de Supabase y presiona "RUN"
-- ============================================================

-- 1. TABLA DE USUARIOS Y ROLES
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'customer', -- 'customer' o 'admin'
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLA DE PRODUCTOS Y CATALOGO
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,       -- 'vaqueros', 'camisetas', 'sudaderas', 'accesorios'
    sub_category TEXT,           -- 'denim', 'graphic', 'chaquetas', 'cadenas', etc.
    price NUMERIC NOT NULL,
    old_price NUMERIC,
    stock INT DEFAULT 15,
    units_sold INT DEFAULT 0,
    badge TEXT,                   -- 'ECKO UNLTD', 'TOP SELLER', 'SOUTHPOLE'
    image TEXT NOT NULL,
    overlay_image TEXT,
    overlay_type TEXT DEFAULT 'top', -- 'top', 'bottom', 'accessory'
    description TEXT,
    is_offer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA DE PEDIDOS (ÓRDENES)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,           -- Ej: '#TAG-8910'
    user_name TEXT NOT NULL,
    user_email TEXT,
    phone TEXT,
    address TEXT,
    items TEXT NOT NULL,
    total NUMERIC NOT NULL,
    payment_method TEXT DEFAULT 'Tarjeta',
    status TEXT DEFAULT 'En preparación', -- 'En preparación', 'Despachado', 'Entregado'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. HABILITAR SEGURIDAD (ROW LEVEL SECURITY) Y PERMISOS DE LECTURA PÚBLICA
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para el catálogo de productos
CREATE POLICY "Permitir ver productos a todos" 
ON public.products FOR SELECT USING (true);

-- Políticas de administración e inserción
CREATE POLICY "Permitir crear pedidos a todos" 
ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leer pedidos a usuarios" 
ON public.orders FOR SELECT USING (true);

CREATE POLICY "Permitir registrar usuarios" 
ON public.users FOR ALL USING (true);

-- 5. INSERTAR DATOS INICIALES (ADMINISTRADOR, CLIENTE Y PRENDAS PRINCIPALES)
INSERT INTO public.users (id, name, email, password_hash, role, phone)
VALUES 
    ('usr-admin-01', 'Supervisor TAGHER''S', 'admin@taghers.com', 'admin123', 'admin', '+54 9 11 9999-8888'),
    ('usr-demo-02', 'Lucas Streetwear', 'demo@taghers.com', '123456', 'customer', '+54 9 11 2345-6789')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, category, sub_category, price, old_price, stock, units_sold, badge, image, overlay_type, description, is_offer)
VALUES
    ('vag-ecko', 'Ecko Unltd 2000s Heavy Embroidered Baggy Jeans', 'vaqueros', 'denim', 92000, 110000, 6, 38, 'ECKO UNLTD', 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80', 'bottom', 'Vaquero negro profundo con bordados de alta densidad en pernera derecha: rinos icónicos Ecko y coronas góticas. Tiro ultra ancho estilo rap 2000s.', true),
    ('vag-01', 'Southpole 90s Vintage Baggy Denim', 'vaqueros', 'denim', 75000, 89000, 45, 64, 'SOUTHPOLE', 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=800&q=80', 'bottom', 'Corte ultra ancho clásico con lavado a la piedra vintage y costuras reforzadas.', true),
    ('vag-02', 'Yellow Arc Contrast Baggy Denim', 'vaqueros', 'denim', 85000, null, 22, 28, 'TOP SELLER', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80', 'bottom', 'Denim negro con arco amarillo contrastante en trasero y caída pesada.', false),
    ('tee-affliction', 'Affliction Style Cyber Gothic Wings & Cross Tee', 'camisetas', 'graphic', 44000, 52000, 5, 52, 'Y2K GOTHIC', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80', 'top', 'Camiseta de algodón peinado con estampa dorsal de alas y cruz gótica.', true),
    ('polo-skate', 'Y2K Striped Heavyweight Skate Polo', 'camisetas', 'graphic', 42000, null, 18, 19, 'VINTAGE POLO', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', 'top', 'Chomba polo a rayas horizontales con cuello acanalado skater auténtico.', false),
    ('tee-arsenal', 'Blokecore Vintage Arsenal Red Fly Emirates Jersey', 'camisetas', 'graphic', 49000, 58000, 8, 34, 'BLOKECORE', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80', 'top', 'Camiseta de fútbol vintage temporada 2012 rojo carmesí blokecore.', true),
    ('sud-track', 'Retro 90s Three-Stripe Navy Track Jacket', 'sudaderas', 'chaquetas', 88000, 105000, 12, 41, 'RETRO CHÁNDAL', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80', 'top', 'Campera deportiva de chándal azul marino con tres franjas en mangas.', true),
    ('sud-01', 'Tactical Camo Technical Puffer Jacket', 'sudaderas', 'chaquetas', 98000, 120000, 14, 27, 'INVIERNO 26', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80', 'top', 'Chaqueta acolchada impermeable ripstop con patrón camuflado oscuro.', true),
    ('acc-01', 'Cuban Link Chunky Silver Chain 14mm', 'accesorios', 'cadenas', 32000, 38000, 30, 49, 'PLATA 925', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', 'accessory', 'Cadena cubana gruesa en acero quirúrgico con baño de plata.', true),
    ('acc-03', 'Double Studded Punk Leather Belt', 'accesorios', 'cinturones', 28000, 34000, 4, 31, 'CLÁSICO PUNK', 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80', 'accessory', 'Cinturón de cuero vacuno legítimo con tachas piramidales cromadas.', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.orders (id, user_name, user_email, phone, address, items, total, payment_method, status)
VALUES
    ('#TAG-8910', 'Lucas Streetwear', 'demo@taghers.com', '+54 9 11 2345-6789', 'Av. Corrientes 1420, CABA', 'Southpole 90s Vintage Baggy Denim (Talla L)', 75000, 'Tarjeta de Crédito', 'Entregado'),
    ('#TAG-8924', 'Matías González', 'matias.g@gmail.com', '+54 9 11 4455-6677', 'Belgrano 450, Rosario', 'Affliction Style Cyber Gothic Wings (Talla XL)', 44000, 'Mercado Pago', 'Despachado'),
    ('#TAG-8955', 'Sofía Rossi', 'sofia.rossi@outlook.com', '+54 9 351 223-4455', 'Nueva Córdoba 880, Córdoba', 'Ecko Unltd 2000s Heavy Baggy (Talla M)', 124000, 'Transferencia', 'En preparación')
ON CONFLICT (id) DO NOTHING;
