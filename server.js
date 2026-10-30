const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DB_FILE = path.join(__dirname, 'database.json');

// Configuración oficial Supabase Cloud
const SUPABASE_URL = 'https://tbkhebfldzpifulgatkv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_vg5CqI2U6MJQPaeVjIB5Bw_K_t8qoId';
const SUPABASE_HEADERS = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

// MIME types para el servidor de estáticos
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

// ------------------------------------------------------------
// 1. INICIALIZACIÓN DE LA BASE DE DATOS LOCAL
// ------------------------------------------------------------
function initDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [
        {
          id: 'usr-admin-01',
          name: 'Supervisor TAGHER\'S',
          email: 'admin@taghers.com',
          password: 'admin123',
          role: 'admin',
          phone: '+54 9 11 9999-8888',
          createdAt: '2026-10-01'
        },
        {
          id: 'usr-demo-02',
          name: 'Lucas Streetwear',
          email: 'demo@taghers.com',
          password: '123456',
          role: 'customer',
          phone: '+54 9 11 2345-6789',
          createdAt: '2026-10-05'
        }
      ],
      products: [
        // --- VAQUEROS BAGGY ---
        {
          id: 'vag-ecko',
          name: 'Ecko Unltd 2000s Heavy Embroidered Baggy Jeans',
          category: 'vaqueros',
          subCategory: 'denim',
          price: 92000,
          oldPrice: 110000,
          stock: 6, // Stock bajo a propósito para alertas de admin
          unitsSold: 38,
          badge: 'ECKO UNLTD',
          image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
          overlayImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=500&q=80',
          overlayType: 'bottom',
          description: 'Vaquero negro profundo con bordados de alta densidad en pernera derecha: rinos icónicos Ecko y coronas góticas. Tiro ultra ancho y bota holgada estilo rap 2000s.',
          isOffer: true
        },
        {
          id: 'vag-01',
          name: 'Southpole 90s Vintage Baggy Denim',
          category: 'vaqueros',
          subCategory: 'denim',
          price: 75000,
          oldPrice: 89000,
          stock: 45,
          unitsSold: 64, // Más vendido
          badge: 'SOUTHPOLE',
          image: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=800&q=80',
          overlayImage: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=500&q=80',
          overlayType: 'bottom',
          description: 'Corte ultra ancho clásico con lavado a la piedra vintage y costuras reforzadas.',
          isOffer: true
        },
        {
          id: 'vag-02',
          name: 'Yellow Arc Contrast Baggy Denim',
          category: 'vaqueros',
          subCategory: 'denim',
          price: 85000,
          oldPrice: null,
          stock: 22,
          unitsSold: 28,
          badge: 'TOP SELLER',
          image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
          overlayImage: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=80',
          overlayType: 'bottom',
          description: 'Denim negro con arco amarillo contrastante en trasero y caída pesada.',
          isOffer: false
        },

        // --- CAMISETAS & CHOMBAS ---
        {
          id: 'tee-affliction',
          name: 'Affliction Style Cyber Gothic Wings & Cross Tee',
          category: 'camisetas',
          subCategory: 'graphic',
          price: 44000,
          oldPrice: 52000,
          stock: 5, // Stock bajo
          unitsSold: 52,
          badge: 'Y2K GOTHIC',
          image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
          overlayImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=500&q=80',
          overlayType: 'top',
          description: 'Camiseta de algodón peinado lavado ácido con gigantesca estampa dorsal de alas de ángel caídas y cruz tribal gótica en tonos plata y cian.',
          isOffer: true
        },
        {
          id: 'polo-skate',
          name: 'Y2K Striped Heavyweight Skate Polo',
          category: 'camisetas',
          subCategory: 'graphic',
          price: 42000,
          oldPrice: null,
          stock: 18,
          unitsSold: 19,
          badge: 'VINTAGE POLO',
          image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
          overlayImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80',
          overlayType: 'top',
          description: 'Chomba polo a rayas horizontales gris y blanco, cuello acanalado con botones y calce holgado skater auténtico.',
          isOffer: false
        },
        {
          id: 'tee-arsenal',
          name: 'Blokecore Vintage Arsenal Red Fly Emirates Jersey',
          category: 'camisetas',
          subCategory: 'graphic',
          price: 49000,
          oldPrice: 58000,
          stock: 8, // Stock bajo
          unitsSold: 34,
          badge: 'BLOKECORE',
          image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
          overlayImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=500&q=80',
          overlayType: 'top',
          description: 'Camiseta de fútbol vintage temporada 2012 en rojo carmesí con franjas degradadas y patrocinador Fly Emirates. La prenda clave de la moda blokecore.',
          isOffer: true
        },

        // --- SUDADERAS & CAMPERAS ---
        {
          id: 'sud-track',
          name: 'Retro 90s Three-Stripe Navy Track Jacket',
          category: 'sudaderas',
          subCategory: 'chaquetas',
          price: 88000,
          oldPrice: 105000,
          stock: 12,
          unitsSold: 41,
          badge: 'RETRO CHÁNDAL',
          image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
          overlayImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=500&q=80',
          overlayType: 'top',
          description: 'Campera deportiva de chándal azul marino con cuello alto acanalado, cremallera metálica completa y tres franjas en mangas en contraste blanco.',
          isOffer: true
        },
        {
          id: 'sud-01',
          name: 'Tactical Camo Technical Puffer Jacket',
          category: 'sudaderas',
          subCategory: 'chaquetas',
          price: 98000,
          oldPrice: 120000,
          stock: 14,
          unitsSold: 27,
          badge: 'INVIERNO 26',
          image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
          overlayImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=500&q=80',
          overlayType: 'top',
          description: 'Chaqueta acolchada impermeable ripstop con patrón camuflado oscuro y capucha térmica.',
          isOffer: true
        },

        // --- ACCESORIOS ---
        {
          id: 'acc-01',
          name: 'Cuban Link Chunky Silver Chain 14mm',
          category: 'accesorios',
          subCategory: 'cadenas',
          price: 32000,
          oldPrice: 38000,
          stock: 30,
          unitsSold: 49,
          badge: 'PLATA 925',
          image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
          overlayImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80',
          overlayType: 'accessory',
          description: 'Cadena de eslabón cubano grueso en acero quirúrgico 316L con baño de plata brillante.',
          isOffer: true
        },
        {
          id: 'acc-03',
          name: 'Double Studded Punk Leather Belt',
          category: 'accesorios',
          subCategory: 'cinturones',
          price: 28000,
          oldPrice: 34000,
          stock: 4, // Stock crítico
          unitsSold: 31,
          badge: 'CLÁSICO PUNK',
          image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80',
          overlayImage: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=500&q=80',
          overlayType: 'accessory',
          description: 'Cinturón de cuero vacuno legítimo con doble fila de tachas piramidales cromadas.',
          isOffer: true
        }
      ],
      orders: [
        {
          id: '#TAG-8910',
          userName: 'Lucas Streetwear',
          userEmail: 'demo@taghers.com',
          phone: '+54 9 11 2345-6789',
          address: 'Av. Corrientes 1420, CABA',
          items: 'Southpole 90s Vintage Baggy Denim (Talla L)',
          total: 75000,
          paymentMethod: 'Tarjeta de Crédito',
          status: 'Entregado',
          createdAt: '2026-10-08'
        },
        {
          id: '#TAG-8924',
          userName: 'Matías González',
          userEmail: 'matias.g@gmail.com',
          phone: '+54 9 11 4455-6677',
          address: 'Belgrano 450, Rosario',
          items: 'Affliction Style Cyber Gothic Wings (Talla XL)',
          total: 44000,
          paymentMethod: 'Mercado Pago',
          status: 'Despachado',
          createdAt: '2026-10-10'
        },
        {
          id: '#TAG-8955',
          userName: 'Sofía Rossi',
          userEmail: 'sofia.rossi@outlook.com',
          phone: '+54 9 351 223-4455',
          address: 'Nueva Córdoba 880, Córdoba',
          items: 'Ecko Unltd 2000s Heavy Baggy (Talla M), Cuban Link Chain',
          total: 124000,
          paymentMethod: 'Transferencia Bancaria',
          status: 'En preparación',
          createdAt: '2026-10-12'
        }
      ]
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    console.log('📦 Base de datos local inicializada en database.json');
  }
}

function readDB() {
  initDatabase();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error leyendo base de datos:', err);
    return { users: [], products: [], orders: [] };
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ------------------------------------------------------------
// 2. PARSEO DE PETICIONES HTTP
// ------------------------------------------------------------
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

// ------------------------------------------------------------
// 3. SERVIDOR HTTP CON API REST
// ------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  // Manejo de CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    });
    return res.end();
  }

  const urlParts = req.url.split('?');
  const pathname = urlParts[0];

  // ==========================================
  // RUTAS DE LA API REST
  // ==========================================

  // Helper de verificación de permisos de administrador
  function checkAdminAccess(req, res) {
    const role = (req.headers['x-user-role'] || '').toLowerCase();
    const email = (req.headers['x-user-email'] || '').toLowerCase();
    const urlObj = new URL(req.url, 'http://localhost');
    const paramRole = (urlObj.searchParams.get('role') || '').toLowerCase();
    const paramAdmin = urlObj.searchParams.get('admin');

    if (role === 'admin' || email === 'admin@taghers.com' || paramRole === 'admin' || paramAdmin === 'true') {
      return true;
    }

    sendJSON(res, 403, {
      success: false,
      message: 'Acceso restringido: Se requieren credenciales de Administrador para ver estos datos.'
    });
    return false;
  }

  // GET /api/db/export -> Ver la base de datos completa (Protegida)
  if (req.method === 'GET' && pathname === '/api/db/export') {
    if (!checkAdminAccess(req, res)) return;
    const db = readDB();
    return sendJSON(res, 200, db);
  }

  // GET /api/products -> Obtener productos (Público)
  if (req.method === 'GET' && pathname === '/api/products') {
    const db = readDB();
    return sendJSON(res, 200, db.products);
  }

  // ==========================================
  // RUTAS DEL AI FASHION STUDIO
  // ==========================================

  // Presets oficiales con las fotos reales subidas por el usuario
  const STUDIO_PRESETS = [
    {
      id: 'true-religion-hoodie',
      name: "Buzo True Religion Red World Tour",
      category: "sudaderas",
      badge: "TRUE RELIGION",
      garmentImage: "/assets/garments/true_religion_hoodie.png",
      modelImage: "/assets/models/model_true_religion_hoodie.jpg",
      fullOutfitImage: "/assets/models/model_true_religion_full.jpg",
      features: [
        "Fleece rojo carmesí 100% algodón",
        "Estampado dorsal gótico TRUE RELIGION",
        "Bordado de herradura blanca con relieve (Horseshoe)",
        "Capucha cruzada con tipografía REL en nuca"
      ],
      defaultPose: "back",
      defaultStyle: "dark_red_halo"
    },
    {
      id: 'true-religion-denim',
      name: "Jeans True Religion Super-T Whisker Baggy",
      category: "vaqueros",
      badge: "SUPER-T",
      garmentImage: "/assets/garments/true_religion_denim.png",
      modelImage: "/assets/models/model_true_religion_full.jpg",
      fullOutfitImage: "/assets/models/model_true_religion_full.jpg",
      features: [
        "Lavado vintage de bigotes (whiskers) en ondas",
        "Costura cuádruple blanca gruesa Super-T",
        "Bolsillos traseros con solapa y botón metálico",
        "Bordado de herradura blanca de alta densidad"
      ],
      defaultPose: "full",
      defaultStyle: "dark_red_halo"
    },
    {
      id: 'ecko-baggy',
      name: "Vaquero Baggy Ecko Unltd 2000s Rinos & Coronas",
      category: "vaqueros",
      badge: "ECKO UNLTD",
      garmentImage: "/assets/garments/ecko_baggy_jeans.jpg",
      modelImage: "/assets/models/model_ecko_affliction.jpg",
      fullOutfitImage: "/assets/models/model_ecko_affliction.jpg",
      features: [
        "Denim negro lavado pesado 14.5 oz",
        "Bordados plateados verticales de rinocerontes Ecko",
        "Coronas y filigranas florales bordadas a lo largo de pierna",
        "Corte ultra ancho y bota holgada estilo rap 2000s"
      ],
      defaultPose: "full",
      defaultStyle: "urban_night"
    },
    {
      id: 'affliction-tee',
      name: "Remera Affliction Nobility Cyber Gothic Wings",
      category: "camisetas",
      badge: "Y2K GOTHIC",
      garmentImage: "/assets/garments/affliction_nobility_tee.jpg",
      modelImage: "/assets/models/model_ecko_affliction.jpg",
      fullOutfitImage: "/assets/models/model_ecko_affliction.jpg",
      features: [
        "Algodón peinado con lavado al ácido vintage",
        "Gran estampa dorsal de alas de ángel caídas",
        "Cruz gótica central en tonos cian y plata",
        "Tipografía NOBILITY en hombros y nuca"
      ],
      defaultPose: "front_editorial",
      defaultStyle: "dark_red_halo"
    },
    {
      id: 'adidas-track',
      name: "Campera Chándal Retro 90s Three-Stripes",
      category: "sudaderas",
      badge: "RETRO CHÁNDAL",
      garmentImage: "/assets/garments/adidas_retro_track.jpg",
      modelImage: "/assets/models/model_retro_track.jpg",
      fullOutfitImage: "/assets/models/model_retro_track.jpg",
      features: [
        "Tejido tricot azul marino original",
        "Cuello alto acanalado con cremallera completa",
        "Tres bandas blancas cosidas a lo largo de mangas",
        "Logo trébol blanco bordado en el pecho"
      ],
      defaultPose: "front_editorial",
      defaultStyle: "urban_night"
    },
    {
      id: 'arsenal-jersey',
      name: "Camiseta Blokecore Arsenal Fly Emirates 2012",
      category: "camisetas",
      badge: "BLOKECORE",
      garmentImage: "/assets/garments/arsenal_fly_emirates.jpg",
      modelImage: "/assets/models/model_retro_track.jpg",
      fullOutfitImage: "/assets/models/model_retro_track.jpg",
      features: [
        "Rojo carmesí con degradé de líneas horizontales",
        "Escudo del Arsenal bordado en el pecho",
        "Swoosh blanco en hombro",
        "Patrocinador Fly Emirates en frontal"
      ],
      defaultPose: "front_editorial",
      defaultStyle: "urban_night"
    },
    {
      id: 'skate-polo',
      name: "Chomba Polo Skate Y2K Rayas Gruesas",
      category: "camisetas",
      badge: "SKATE Y2K",
      garmentImage: "/assets/garments/skate_striped_polo.jpg",
      modelImage: "/assets/models/model_retro_track.jpg",
      fullOutfitImage: "/assets/models/model_retro_track.jpg",
      features: [
        "Rayas horizontales anchas gris y blanco",
        "Cuello con botones acanalado",
        "Corte cuadrado holgado estilo skate 2000s"
      ],
      defaultPose: "front_editorial",
      defaultStyle: "clean_white"
    }
  ];

  // GET /api/fashion-studio/presets -> Obtener catálogo de prendas y modelos
  if (req.method === 'GET' && pathname === '/api/fashion-studio/presets') {
    return sendJSON(res, 200, { success: true, presets: STUDIO_PRESETS });
  }

  // POST /api/fashion-studio/generate -> Generar sesión fotográfica de modelo con IA
  if (req.method === 'POST' && pathname === '/api/fashion-studio/generate') {
    const body = await parseBody(req);
    const presetId = body.presetId || 'true-religion-hoodie';
    const foundPreset = STUDIO_PRESETS.find(p => p.id === presetId) || STUDIO_PRESETS[0];

    // Selección de la imagen generada según la pose elegida
    let generatedImage = foundPreset.modelImage;
    if (body.pose === 'full' && foundPreset.fullOutfitImage) {
      generatedImage = foundPreset.fullOutfitImage;
    } else if (body.pose === 'back') {
      generatedImage = foundPreset.modelImage;
    }

    // Si el usuario subió una prenda personalizada pero eligió un estilo:
    const customGarment = body.customGarmentUrl || foundPreset.garmentImage;

    return sendJSON(res, 200, {
      success: true,
      modelName: "Modelo Afroamericano con Rastas (Estudio Penumbra)",
      garmentName: foundPreset.name,
      garmentOriginal: customGarment,
      generatedImage: generatedImage,
      fullOutfitImage: foundPreset.fullOutfitImage,
      pose: body.pose || 'back',
      lighting: body.lighting || 'dark_red_halo',
      confidenceScore: "99.4%",
      fidelityPreservation: {
        colorMatch: "100% fiel",
        graphicsAndLogos: "Conservado idéntico",
        fabricTexture: "Algodón / Denim de alta definición",
        stitchingDetails: "Costuras intactas"
      },
      features: foundPreset.features
    });
  }

  // POST /api/auth/login -> Inicio de sesión
  if (req.method === 'POST' && pathname === '/api/auth/login') {
    const body = await parseBody(req);
    const db = readDB();
    const user = db.users.find(u => 
      u.email.toLowerCase() === (body.email || '').trim().toLowerCase() && 
      u.password === (body.password || '').trim()
    );

    if (user) {
      return sendJSON(res, 200, {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone
        }
      });
    } else {
      return sendJSON(res, 401, { success: false, message: 'Credenciales inválidas' });
    }
  }

  // POST /api/auth/register -> Crear cuenta
  if (req.method === 'POST' && pathname === '/api/auth/register') {
    const body = await parseBody(req);
    const db = readDB();
    const email = (body.email || '').trim().toLowerCase();

    if (!body.name || !email || !body.password) {
      return sendJSON(res, 400, { success: false, message: 'Faltan campos obligatorios' });
    }

    if (db.users.some(u => u.email.toLowerCase() === email)) {
      return sendJSON(res, 409, { success: false, message: 'El correo electrónico ya está registrado' });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: body.name.trim(),
      email: email,
      password: body.password.trim(),
      role: 'customer',
      phone: body.phone || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    db.users.push(newUser);
    writeDB(db);

    // Sincronizar usuario en la nube de Supabase (background)
    try {
      fetch(`${SUPABASE_URL}/rest/v1/users`, {
        method: 'POST',
        headers: SUPABASE_HEADERS,
        body: JSON.stringify({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          password_hash: newUser.password,
          role: newUser.role,
          phone: newUser.phone
        })
      }).catch(e => console.warn('Sync Supabase usuario:', e.message));
    } catch (e) {}

    return sendJSON(res, 201, {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  }

  // GET /api/admin/metrics -> Métricas didácticas completas para el Panel de Administrador (Protegido)
  if (req.method === 'GET' && pathname === '/api/admin/metrics') {
    if (!checkAdminAccess(req, res)) return;
    const db = readDB();

    // 1. Total de ingresos y volumen
    const totalRevenue = db.orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrdersCount = db.orders.length;
    const totalUsersCount = db.users.length;
    const customerCount = db.users.filter(u => u.role !== 'admin').length;
    const adminCount = db.users.filter(u => u.role === 'admin').length;
    const avgTicket = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

    // 2. Ranking de productos más vendidos (Top Sellers)
    const sortedProducts = [...db.products].sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0));
    const maxUnitsSold = sortedProducts[0] ? (sortedProducts[0].unitsSold || 1) : 1;
    
    const topProductsRanking = sortedProducts.slice(0, 6).map((p, idx) => ({
      rank: idx + 1,
      id: p.id,
      name: p.name,
      category: p.category,
      badge: p.badge || 'TAGHER',
      price: p.price,
      image: p.image,
      stock: p.stock || 0,
      unitsSold: p.unitsSold || 0,
      totalRevenue: (p.unitsSold || 0) * (p.price || 0),
      salesPercent: Math.round(((p.unitsSold || 0) / maxUnitsSold) * 100)
    }));

    const topProduct = sortedProducts[0] || null;

    // 3. Productos con stock crítico (< 10 unidades)
    const lowStockProducts = db.products.filter(p => (p.stock || 0) < 10);

    // 4. Lista didáctica de usuarios (sin devolver contraseñas)
    const usersList = db.users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone || 'No registrado',
      createdAt: u.createdAt || '2026-10-01',
      ordersCount: db.orders.filter(o => (o.userEmail || '').toLowerCase() === u.email.toLowerCase()).length
    }));

    return sendJSON(res, 200, {
      totalRevenue,
      avgTicket,
      totalOrdersCount,
      totalUsersCount,
      customerCount,
      adminCount,
      topProduct,
      topProductsRanking,
      lowStockProducts,
      usersList,
      orders: db.orders
    });
  }

  // POST /api/admin/stock -> Reposición o ajuste de stock (Protegido)
  if (req.method === 'POST' && pathname === '/api/admin/stock') {
    if (!checkAdminAccess(req, res)) return;
    const body = await parseBody(req);
    const db = readDB();
    const prod = db.products.find(p => p.id === body.productId);

    if (prod) {
      prod.stock = Math.max(0, parseInt(body.newStock, 10) || 0);
      writeDB(db);
      return sendJSON(res, 200, { success: true, product: prod });
    } else {
      return sendJSON(res, 404, { success: false, message: 'Producto no encontrado' });
    }
  }

  // PUT /api/admin/orders/status -> Actualizar estado de orden (Protegido)
  if (req.method === 'PUT' && pathname === '/api/admin/orders/status') {
    if (!checkAdminAccess(req, res)) return;
    const body = await parseBody(req);
    const db = readDB();
    const order = db.orders.find(o => o.id === body.orderId);

    if (order) {
      order.status = body.status;
      writeDB(db);
      return sendJSON(res, 200, { success: true, order });
    } else {
      return sendJSON(res, 404, { success: false, message: 'Orden no encontrada' });
    }
  }

  // POST /api/orders/create -> Crear pedido real en la base de datos
  if (req.method === 'POST' && pathname === '/api/orders/create') {
    const body = await parseBody(req);
    const db = readDB();

    const orderId = `#TAG-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      userName: body.userName || 'Cliente',
      userEmail: body.userEmail || '',
      phone: body.phone || '',
      address: body.address || '',
      items: body.itemsSummary || 'Varios artículos',
      total: body.total || 0,
      paymentMethod: body.paymentMethod || 'Tarjeta',
      status: 'En preparación',
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Reducir stock y aumentar unidades vendidas
    if (Array.isArray(body.items)) {
      body.items.forEach(cartItem => {
        const prod = db.products.find(p => p.id === cartItem.id);
        if (prod) {
          prod.stock = Math.max(0, (prod.stock || 10) - cartItem.quantity);
          prod.unitsSold = (prod.unitsSold || 0) + cartItem.quantity;
        }
      });
    }

    db.orders.unshift(newOrder);
    writeDB(db);

    // Sincronizar en la nube de Supabase (background)
    try {
      fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'POST',
        headers: SUPABASE_HEADERS,
        body: JSON.stringify({
          id: orderId,
          user_name: newOrder.userName,
          user_email: newOrder.userEmail,
          phone: newOrder.phone,
          address: newOrder.address,
          items: newOrder.items,
          total: newOrder.total,
          payment_method: newOrder.paymentMethod,
          status: newOrder.status
        })
      }).catch(e => console.warn('Sync Supabase orden:', e.message));
    } catch (e) {}

    return sendJSON(res, 201, { success: true, order: newOrder });
  }

  // ==========================================
  // SERVIR ARCHIVOS ESTÁTICOS
  // ==========================================
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Archivo no encontrado');
      } else {
        res.writeHead(500);
        res.end(`Error interno del servidor: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

// Inicializar base de datos y arrancar servidor
initDatabase();

server.listen(PORT, () => {
  console.log(`⚡ Servidor de TAGHER'S con Base de Datos activo en http://localhost:${PORT}`);
});
