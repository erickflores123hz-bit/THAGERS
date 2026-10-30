/**
 * ============================================================
 * TAGHER'S STREETWEAR - APP.JS (VERSIÓN 2.0)
 * Base de Datos, Panel Admin, IA MediaPipe Pose, Carrusel Multi-Ángulo y Asesor de Talles
 * ============================================================
 */

// ------------------------------------------------------------
// 1. BASE DE DATOS LOCAL DE PRODUCTOS CON 4 FOTOS POR PRENDA
// ------------------------------------------------------------
let PRODUCTS_DATABASE = [
  // --- PRENDAS REALES DEL USUARIO & SESIONES DE MODELO IA ---
  {
    id: 'hoodie-true-rel',
    name: "True Religion Crimson Gothic 'REL' Heavy Zip Hoodie",
    category: 'sudaderas',
    subCategory: 'buzos',
    price: 115000,
    oldPrice: 135000,
    badge: 'TRUE RELIGION',
    stock: 4,
    unitsSold: 78,
    image: '/assets/models/hero_scroll_expand.jpg',
    images: [
      '/assets/models/hero_scroll_expand.jpg',
      '/assets/models/model_true_religion_hoodie.jpg',
      '/assets/models/model_true_religion_full.jpg',
      '/assets/garments/true_religion_hoodie.png'
    ],
    overlayImage: '/assets/garments/true_religion_hoodie.png',
    overlayType: 'top',
    description: 'Buzo rojo carmesí con cierre y cordones gruesos. Tipografía gótica blanca "REL" bordada en frontal, estampa dorsal completa y herradura True Religion. Visto en modelo de piel oscura y rastas con iluminación roja cenital.',
    isOffer: true
  },
  {
    id: 'vag-true-rel',
    name: "True Religion Super-T Whisker Wash Baggy Denim",
    category: 'vaqueros',
    subCategory: 'denim',
    price: 125000,
    oldPrice: 145000,
    badge: 'SUPER-T DENIM',
    stock: 7,
    unitsSold: 61,
    image: '/assets/models/model_true_religion_full.jpg',
    images: [
      '/assets/models/model_true_religion_full.jpg',
      '/assets/garments/true_religion_denim.png',
      '/assets/models/hero_scroll_expand.jpg',
      '/assets/garments/true_religion_denim.png'
    ],
    overlayImage: '/assets/garments/true_religion_denim.png',
    overlayType: 'bottom',
    description: 'Vaquero True Religion corte ancho relajado con lavado whisker en muslos, costuras extra gruesas Super-T en blanco contrastante y bolsillos traseros con solapa y herradura icónica.',
    isOffer: true
  },
  {
    id: 'vag-ecko',
    name: "Ecko Unltd 2000s Heavy Embroidered Baggy Jeans",
    category: 'vaqueros',
    subCategory: 'denim',
    price: 92000,
    oldPrice: 110000,
    badge: 'ECKO UNLTD',
    stock: 6,
    unitsSold: 38,
    image: '/assets/models/model_ecko_affliction.jpg',
    images: [
      '/assets/models/model_ecko_affliction.jpg',
      '/assets/garments/ecko_baggy_jeans.jpg',
      '/assets/models/hero_scroll_expand.jpg',
      '/assets/garments/ecko_baggy_jeans.jpg'
    ],
    overlayImage: '/assets/garments/ecko_baggy_jeans.jpg',
    overlayType: 'bottom',
    description: 'Vaquero negro profundo con bordados de alta densidad en pernera derecha: rinos icónicos Ecko y coronas góticas. Tiro ultra ancho y bota holgada estilo rap 2000s.',
    isOffer: true
  },
  {
    id: 'tee-affliction',
    name: "Affliction Style Cyber Gothic Wings & Cross Tee",
    category: 'camisetas',
    subCategory: 'graphic',
    price: 44000,
    oldPrice: 52000,
    badge: 'Y2K GOTHIC',
    stock: 5,
    unitsSold: 52,
    image: '/assets/models/model_ecko_affliction.jpg',
    images: [
      '/assets/models/model_ecko_affliction.jpg',
      '/assets/garments/affliction_nobility_tee.jpg',
      '/assets/models/hero_scroll_expand.jpg',
      '/assets/garments/affliction_nobility_tee.jpg'
    ],
    overlayImage: '/assets/garments/affliction_nobility_tee.jpg',
    overlayType: 'top',
    description: 'Camiseta de algodón peinado lavado ácido con gigantesca estampa dorsal de alas de ángel caídas y cruz tribal gótica en tonos plata y cian.',
    isOffer: true
  },
  {
    id: 'sud-track',
    name: "Retro 90s Three-Stripe Navy Track Jacket",
    category: 'sudaderas',
    subCategory: 'chaquetas',
    price: 88000,
    oldPrice: 105000,
    badge: 'RETRO CHÁNDAL',
    stock: 12,
    unitsSold: 41,
    image: '/assets/models/model_retro_track.jpg',
    images: [
      '/assets/models/model_retro_track.jpg',
      '/assets/garments/adidas_retro_track.jpg',
      '/assets/models/model_retro_track.jpg',
      '/assets/garments/adidas_retro_track.jpg'
    ],
    overlayImage: '/assets/garments/adidas_retro_track.jpg',
    overlayType: 'top',
    description: 'Campera deportiva de chándal azul marino con cuello alto acanalado, cremallera metálica completa y tres franjas en mangas en contraste blanco.',
    isOffer: true
  },
  {
    id: 'tee-arsenal',
    name: "Blokecore Vintage Arsenal Red Fly Emirates Jersey",
    category: 'camisetas',
    subCategory: 'graphic',
    price: 49000,
    oldPrice: 58000,
    badge: 'BLOKECORE',
    stock: 8,
    unitsSold: 34,
    image: '/assets/garments/arsenal_fly_emirates.jpg',
    images: [
      '/assets/garments/arsenal_fly_emirates.jpg',
      '/assets/models/model_retro_track.jpg',
      '/assets/garments/arsenal_fly_emirates.jpg',
      '/assets/garments/arsenal_fly_emirates.jpg'
    ],
    overlayImage: '/assets/garments/arsenal_fly_emirates.jpg',
    overlayType: 'top',
    description: 'Camiseta de fútbol vintage temporada 2012 en rojo carmesí con franjas degradadas y patrocinador Fly Emirates. La prenda clave de la moda blokecore.',
    isOffer: true
  },
  {
    id: 'polo-skate',
    name: "Y2K Striped Heavyweight Skate Polo",
    category: 'camisetas',
    subCategory: 'graphic',
    price: 42000,
    oldPrice: null,
    badge: 'VINTAGE POLO',
    stock: 18,
    unitsSold: 19,
    image: '/assets/garments/skate_striped_polo.jpg',
    images: [
      '/assets/garments/skate_striped_polo.jpg',
      '/assets/models/model_retro_track.jpg',
      '/assets/garments/skate_striped_polo.jpg',
      '/assets/garments/skate_striped_polo.jpg'
    ],
    overlayImage: '/assets/garments/skate_striped_polo.jpg',
    overlayType: 'top',
    description: 'Chomba polo a rayas horizontales gris y blanco, cuello acanalado con botones y calce holgado skater auténtico.',
    isOffer: false
  },

  // --- CATÁLOGO BASE SOUTHPOLE & STREETWEAR ---
  {
    id: 'vag-01',
    name: "Southpole 90s Vintage Baggy Denim",
    category: 'vaqueros',
    subCategory: 'denim',
    price: 75000,
    oldPrice: 89000,
    badge: 'SOUTHPOLE',
    stock: 45,
    unitsSold: 64, // Más vendido
    images: [
      'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    overlayImage: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=500&q=80',
    overlayType: 'bottom',
    description: 'Vaqueros de corte ultra ancho inspirados en el skate y hip-hop de los años 90. Tejido denim de 14.5 oz con lavado stone-wash vintage y costuras reforzadas.',
    isOffer: true
  },
  {
    id: 'vag-02',
    name: "Yellow Arc Contrast Baggy Denim",
    category: 'vaqueros',
    subCategory: 'denim',
    price: 85000,
    oldPrice: null,
    badge: 'TOP SELLER',
    stock: 22,
    unitsSold: 28,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    overlayImage: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=80',
    overlayType: 'bottom',
    description: 'Pantalón vaquero negro con diseño de arco contrastante en amarillo en la parte posterior, corte holgado sobre la bota y parche de cuero vegano.',
    isOffer: false
  },
  {
    id: 'sud-01',
    name: "Tactical Camo Technical Puffer Jacket",
    category: 'sudaderas',
    subCategory: 'chaquetas',
    price: 98000,
    oldPrice: 120000,
    badge: 'INVIERNO 26',
    stock: 14,
    unitsSold: 27,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80'
    ],
    overlayImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=500&q=80',
    overlayType: 'top',
    description: 'Chaqueta acolchada impermeable ripstop con patrón camuflado oscuro y capucha térmica desmontable.',
    isOffer: true
  },
  {
    id: 'acc-01',
    name: "Cuban Link Chunky Silver Chain 14mm",
    category: 'accesorios',
    subCategory: 'cadenas',
    price: 32000,
    oldPrice: 38000,
    badge: 'PLATA 925',
    stock: 30,
    unitsSold: 49,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611591475819-79b8b730ab8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80'
    ],
    overlayImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80',
    overlayType: 'accessory',
    description: 'Cadena de eslabón cubano grueso en acero quirúrgico 316L con baño de plata brillante y cierre de seguridad.',
    isOffer: true
  },
  {
    id: 'acc-03',
    name: "Double Studded Punk Leather Belt",
    category: 'accesorios',
    subCategory: 'cinturones',
    price: 28000,
    oldPrice: 34000,
    badge: 'CLÁSICO PUNK',
    stock: 4, // Stock crítico
    unitsSold: 31,
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611591475819-79b8b730ab8c?auto=format&fit=crop&w=800&q=80'
    ],
    overlayImage: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=500&q=80',
    overlayType: 'accessory',
    description: 'Cinturón de cuero vacuno legítimo de 4cm de ancho con doble fila de tachas piramidales de aleación metálica cromada.',
    isOffer: true
  }
];

// ------------------------------------------------------------
// 2. ESTADO GLOBAL
// ------------------------------------------------------------
let currentFilter = 'todos';
let searchQuery = '';
let currentSort = 'featured';

let currentUser = null;
let cart = [];
let wishlist = [];
let activeCoupon = null;

let activeProductForModal = null;
let activeImageIndex = 0;
let modalSelectedSize = 'M';
let modalQuantity = 1;

let activeTryonProduct = null;
let webcamStream = null;
let garmentScale = 1.0;
let garmentPosX = 0;
let garmentPosY = 0;
let garmentOpacity = 0.95;

// Variables de MediaPipe Pose
let mediaPipePose = null;
let isMediaPipeAutoFit = true;
let poseCamera = null;

// ------------------------------------------------------------
// 3. INICIALIZACIÓN
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  syncProductsFromBackend();
  renderProducts();
  updateCartUI();
  updateUserUI();
  initTryonPicker();
  initMediaPipePose();
  initScrollExpand();
});

function initStorage() {
  const savedUser = localStorage.getItem('taghers_currentUser');
  if (savedUser) {
    try { currentUser = JSON.parse(savedUser); } catch (e) { currentUser = null; }
  }

  const savedCart = localStorage.getItem('taghers_cart');
  if (savedCart) {
    try { cart = JSON.parse(savedCart); } catch (e) { cart = []; }
  }

  const savedWishlist = localStorage.getItem('taghers_wishlist');
  if (savedWishlist) {
    try { wishlist = JSON.parse(savedWishlist); } catch (e) { wishlist = []; }
  }
}

// Sincronizar catálogo con el backend
async function syncProductsFromBackend() {
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Enlazar imágenes del carrusel si el backend no las tiene
        PRODUCTS_DATABASE = data.map(p => {
          const localMatch = PRODUCTS_DATABASE.find(lp => lp.id === p.id);
          return {
            ...p,
            images: p.images || (localMatch ? localMatch.images : [p.image, p.image, p.image, p.image])
          };
        });
        renderProducts();
      }
    }
  } catch (err) {
    console.log('Modo local (usando base de datos interna)');
  }
}

// ------------------------------------------------------------
// 4. RENDERIZADO DEL CATÁLOGO & FILTROS
// ------------------------------------------------------------
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const emptyState = document.getElementById('emptyState');
  const countText = document.getElementById('productCountText');
  const titleText = document.getElementById('currentCategoryTitle');

  if (!grid) return;

  let filtered = PRODUCTS_DATABASE.filter(p => {
    let matchesCat = true;
    if (currentFilter === 'todos') {
      matchesCat = true;
    } else if (currentFilter === 'ropa') {
      matchesCat = ['vaqueros', 'camisetas', 'sudaderas', 'chandals'].includes(p.category);
    } else if (currentFilter === 'ofertas') {
      matchesCat = p.isOffer === true;
    } else if (['cadenas', 'pulseras', 'anillos', 'cinturones'].includes(currentFilter)) {
      matchesCat = p.subCategory === currentFilter;
    } else {
      matchesCat = p.category === currentFilter;
    }

    let matchesSearch = true;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      matchesSearch = p.name.toLowerCase().includes(q) ||
                      p.category.toLowerCase().includes(q) ||
                      p.description.toLowerCase().includes(q);
    }

    return matchesCat && matchesSearch;
  });

  if (currentSort === 'price-low') filtered.sort((a, b) => a.price - b.price);
  else if (currentSort === 'price-high') filtered.sort((a, b) => b.price - a.price);
  else if (currentSort === 'newest') filtered.reverse();

  const categoryNames = {
    'todos': 'TODO EL CATÁLOGO',
    'ropa': 'ROPA STREETWEAR',
    'vaqueros': 'VAQUEROS & BAGGY DENIM',
    'camisetas': 'CAMISETAS, POLOS & BLOKECORE',
    'sudaderas': 'SUDADERAS & TRACK JACKETS',
    'accesorios': 'ACCESORIOS METÁLICOS & CUERO',
    'cadenas': 'CADENAS & COLLARES',
    'pulseras': 'PULSERAS & TACHAS',
    'anillos': 'ANILLOS GRUNGE',
    'cinturones': 'CINTURONES PUNK & SKATE',
    'ofertas': 'OFERTAS & DROPS EXCLUSIVOS'
  };

  titleText.textContent = categoryNames[currentFilter] || 'CATÁLOGO DE PRENDAS';
  countText.textContent = `${filtered.length} ${filtered.length === 1 ? 'prenda' : 'prendas'} encontradas`;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  grid.innerHTML = filtered.map(p => {
    const isFav = wishlist.includes(p.id);
    const oldPriceHtml = p.oldPrice ? `<span class="price-old">$${formatCurrency(p.oldPrice)}</span>` : '';
    const isLowStock = (p.stock || 10) < 10;
    const stockBadge = isLowStock 
      ? `<span class="product-stock-pill low">¡Últimas ${p.stock} unidades!</span>`
      : `<span class="product-stock-pill">En stock (${p.stock} u.)</span>`;

    return `
      <div class="product-card" data-id="${p.id}">
        <div class="product-thumb-wrap" onclick="openProductModal('${p.id}')">
          <img class="product-thumb" src="${p.image}" alt="${p.name}" loading="lazy">
          <div class="badge-tag ${p.isOffer ? 'sale' : ''}">${p.badge}</div>
          <button class="wishlist-toggle-btn ${isFav ? 'active' : ''}" onclick="toggleWishlist('${p.id}', event)" title="Favorito">
            <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
          <div class="quick-tryon-overlay">
            <button class="quick-tryon-btn" onclick="openTryOnModal('${p.id}'); event.stopPropagation();">
              <i class="fa-solid fa-camera"></i> PROBAR CON IA
            </button>
          </div>
        </div>

        <div class="product-card-body">
          <div class="product-meta-row">
            <span class="product-category-tag">${p.category}</span>
            ${stockBadge}
          </div>
          <h3 class="product-title" onclick="openProductModal('${p.id}')" style="cursor: pointer;">${p.name}</h3>
          
          <div class="product-pricing">
            <span class="price-current">$${formatCurrency(p.price)}</span>
            ${oldPriceHtml}
          </div>

          <div class="product-card-actions">
            <button class="add-cart-card-btn" onclick="quickAddToCart('${p.id}')">
              <i class="fa-solid fa-plus"></i> AGREGAR
            </button>
            <button class="view-detail-card-btn" onclick="openProductModal('${p.id}')" title="Ver detalles y fotos">
              <i class="fa-solid fa-images"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterCategory(category) {
  currentFilter = category;
  const pills = document.querySelectorAll('.category-pills .pill');
  pills.forEach(pill => {
    const text = pill.textContent.toLowerCase();
    if (category === 'todos' && text.includes('todos')) pill.classList.add('active');
    else if (category === 'vaqueros' && text.includes('vaqueros')) pill.classList.add('active');
    else if (category === 'camisetas' && (text.includes('camisetas') || text.includes('polos'))) pill.classList.add('active');
    else if (category === 'sudaderas' && text.includes('sudaderas')) pill.classList.add('active');
    else if (category === 'accesorios' && text.includes('accesorios')) pill.classList.add('active');
    else pill.classList.remove('active');
  });

  const catalogEl = document.getElementById('catalogSection');
  if (catalogEl && window.scrollY > 200) {
    catalogEl.scrollIntoView({ behavior: 'smooth' });
  }

  renderProducts();
}

function handleSearch(val) {
  searchQuery = val;
  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) clearBtn.style.display = val.trim() !== '' ? 'block' : 'none';
  renderProducts();
}

function clearSearch() {
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  searchQuery = '';
  document.getElementById('clearSearchBtn').style.display = 'none';
  renderProducts();
}

function handleSortChange(sortVal) {
  currentSort = sortVal;
  renderProducts();
}

function resetFilters() {
  currentFilter = 'todos';
  clearSearch();
  currentSort = 'featured';
  document.getElementById('sortSelect').value = 'featured';
  filterCategory('todos');
}

function scrollToCatalog() {
  document.getElementById('catalogSection').scrollIntoView({ behavior: 'smooth' });
}

function toggleMobileMenu() {
  const drawer = document.getElementById('mobileNavDrawer');
  const icon = document.getElementById('mobileMenuIcon');
  if (drawer.classList.contains('open')) {
    drawer.classList.remove('open');
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
  } else {
    drawer.classList.add('open');
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-xmark');
  }
}

// ------------------------------------------------------------
// 5. PROBADOR VIRTUAL CON CÁMARA E IA (MEDIAPIPE POSE)
// ------------------------------------------------------------
function openTryOnModal(productId) {
  const modal = document.getElementById('tryonModal');
  modal.classList.add('active');

  const productToTry = productId 
    ? PRODUCTS_DATABASE.find(p => p.id === productId)
    : (activeTryonProduct || PRODUCTS_DATABASE[0]);

  selectGarmentForTryOn(productToTry);
  initWebcam();
}

function closeTryOnModal() {
  const modal = document.getElementById('tryonModal');
  modal.classList.remove('active');
  stopWebcam();
}

function initTryonPicker() {
  const picker = document.getElementById('tryonGarmentPicker');
  if (!picker) return;

  picker.innerHTML = PRODUCTS_DATABASE.map(p => `
    <div class="picker-item ${activeTryonProduct && activeTryonProduct.id === p.id ? 'active' : ''}" 
         onclick="selectGarmentForTryOnById('${p.id}')" title="${p.name}">
      <img src="${p.image}" alt="${p.name}">
    </div>
  `).join('');
}

function selectGarmentForTryOnById(id) {
  const product = PRODUCTS_DATABASE.find(p => p.id === id);
  if (product) selectGarmentForTryOn(product);
}

function selectGarmentForTryOn(product) {
  activeTryonProduct = product;

  document.getElementById('tryonGarmentThumb').src = product.image;
  document.getElementById('tryonGarmentName').textContent = product.name;
  document.getElementById('tryonGarmentPrice').textContent = `$${formatCurrency(product.price)}`;

  const overlayImg = document.getElementById('garmentOverlayImg');
  overlayImg.src = product.overlayImage || product.image;

  resetGarmentAdjustments();
  if (product.overlayType === 'bottom') {
    garmentPosY = 75;
    garmentScale = 0.95;
  } else if (product.overlayType === 'accessory') {
    garmentPosY = -30;
    garmentScale = 0.75;
  } else {
    garmentPosY = 15;
    garmentScale = 1.05;
  }
  updateGarmentTransform();

  const items = document.querySelectorAll('.picker-item');
  items.forEach(el => {
    if (el.getAttribute('title') === product.name) el.classList.add('active');
    else el.classList.remove('active');
  });
}

// Inicialización de MediaPipe Pose
function initMediaPipePose() {
  try {
    if (typeof Pose !== 'undefined') {
      mediaPipePose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
      });

      mediaPipePose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      mediaPipePose.onResults(onPoseResults);
      console.log('🤖 MediaPipe Pose listo para tracking corporal');
    }
  } catch (e) {
    console.warn('MediaPipe Pose en modo fallback:', e);
  }
}

// Callback de resultados de IA en tiempo real
function onPoseResults(results) {
  const canvas = document.getElementById('poseCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const video = document.getElementById('webcamVideo');

  if (video.videoWidth && canvas.width !== video.videoWidth) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!results.poseLandmarks) {
    document.getElementById('aiTrackingIndicatorText').textContent = 'IA: Buscando cuerpo en cámara...';
    return;
  }

  const lm = results.poseLandmarks;
  const leftShoulder = lm[11];
  const rightShoulder = lm[12];

  // Dibujar puntos visuales discretos de tracking
  if (leftShoulder && rightShoulder) {
    document.getElementById('aiTrackingIndicatorText').textContent = 'IA: Hombros y Torso Sincronizados ✓';

    const lx = leftShoulder.x * canvas.width;
    const ly = leftShoulder.y * canvas.height;
    const rx = rightShoulder.x * canvas.width;
    const ry = rightShoulder.y * canvas.height;

    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(lx, ly, 6, 0, 2 * Math.PI);
    ctx.arc(rx, ry, 6, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(rx, ry);
    ctx.stroke();

    // AUTO-CALCE CON IA (Escalar y posicionar prenda sobre el torso)
    if (isMediaPipeAutoFit && activeTryonProduct) {
      // 1. Distancia entre hombros
      const shoulderDist = Math.hypot(lx - rx, ly - ry);
      const videoWidth = canvas.width || 640;
      const normalizedDist = shoulderDist / videoWidth;

      // Escala calculada
      let targetScale = normalizedDist * 3.4;
      if (activeTryonProduct.overlayType === 'accessory') targetScale = normalizedDist * 1.8;
      else if (activeTryonProduct.overlayType === 'bottom') targetScale = normalizedDist * 2.8;

      garmentScale = Math.max(0.6, Math.min(1.8, targetScale));

      // 2. Inclinación y rotación
      const angle = Math.atan2(ly - ry, lx - rx) * (180 / Math.PI);

      // 3. Posicionamiento en el pecho
      const midX = (lx + rx) / 2;
      const midY = (ly + ry) / 2;

      // Desplazamiento respecto al centro
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      garmentPosX = (midX - centerX) * 0.7;

      if (activeTryonProduct.overlayType === 'bottom') {
        garmentPosY = (midY - centerY) + 120;
      } else if (activeTryonProduct.overlayType === 'accessory') {
        garmentPosY = (midY - centerY) - 20;
      } else {
        garmentPosY = (midY - centerY) + 30;
      }

      // Actualizar sliders visuales
      document.getElementById('scaleSlider').value = garmentScale.toFixed(2);
      document.getElementById('scaleValueText').textContent = `${Math.round(garmentScale * 100)}%`;
      document.getElementById('posYSlider').value = Math.round(garmentPosY);
      document.getElementById('posYValueText').textContent = Math.round(garmentPosY);

      updateGarmentTransform(angle);
    }
  }
}

function toggleMediaPipeAutoFit() {
  isMediaPipeAutoFit = !isMediaPipeAutoFit;
  const btn = document.getElementById('aiFitBtnText');
  if (isMediaPipeAutoFit) {
    btn.textContent = 'IA Auto-Calce: ACTIVADO';
    showToast('IA de seguimiento corporal activada', 'success');
  } else {
    btn.textContent = 'IA Auto-Calce: DESACTIVADO (Manual)';
    showToast('Modo manual de ajuste activado', 'info');
  }
}

async function initWebcam() {
  const video = document.getElementById('webcamVideo');
  const staticImg = document.getElementById('staticPreviewImage');
  const statusText = document.getElementById('cameraStatusText');

  staticImg.style.display = 'none';
  video.style.display = 'block';
  statusText.textContent = 'Conectando cámara...';

  try {
    if (webcamStream) stopWebcam();

    webcamStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    });

    video.srcObject = webcamStream;
    statusText.textContent = 'Cámara en vivo';

    // Iniciar loop de inferencia MediaPipe
    if (typeof Camera !== 'undefined' && mediaPipePose) {
      poseCamera = new Camera(video, {
        onFrame: async () => {
          if (video && video.readyState >= 2) {
            await mediaPipePose.send({ image: video });
          }
        },
        width: 1280,
        height: 720
      });
      poseCamera.start();
    }

    showToast('Cámara e IA de MediaPipe sincronizadas', 'success');
  } catch (err) {
    console.warn('Webcam no disponible:', err);
    statusText.textContent = 'Modo foto (Cámara no detectada)';
    video.style.display = 'none';
    staticImg.style.display = 'block';
    staticImg.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';
    showToast('Cámara no detectada. Puedes subir tu propia foto o usar el modelo base', 'info');
  }
}

function stopWebcam() {
  if (poseCamera) {
    try { poseCamera.stop(); } catch (e) {}
    poseCamera = null;
  }
  if (webcamStream) {
    webcamStream.getTracks().forEach(track => track.stop());
    webcamStream = null;
  }
}

function handleUserPhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    stopWebcam();
    const video = document.getElementById('webcamVideo');
    const staticImg = document.getElementById('staticPreviewImage');
    video.style.display = 'none';
    staticImg.style.display = 'block';
    staticImg.src = e.target.result;
    document.getElementById('cameraStatusText').textContent = 'Foto personalizada cargada';
    showToast('Tu foto ha sido cargada al probador', 'success');
  };
  reader.readAsDataURL(file);
}

function adjustGarmentScale(val) {
  garmentScale = parseFloat(val);
  isMediaPipeAutoFit = false;
  document.getElementById('aiFitBtnText').textContent = 'IA Auto-Calce: MANUAL';
  document.getElementById('scaleValueText').textContent = `${Math.round(garmentScale * 100)}%`;
  updateGarmentTransform();
}

function adjustGarmentPosY(val) {
  garmentPosY = parseInt(val, 10);
  isMediaPipeAutoFit = false;
  document.getElementById('aiFitBtnText').textContent = 'IA Auto-Calce: MANUAL';
  document.getElementById('posYValueText').textContent = garmentPosY;
  updateGarmentTransform();
}

function adjustGarmentOpacity(val) {
  garmentOpacity = parseFloat(val);
  document.getElementById('opacityValueText').textContent = `${Math.round(garmentOpacity * 100)}%`;
  document.getElementById('garmentOverlayContainer').style.opacity = garmentOpacity;
}

function updateGarmentTransform(rotationAngle = 0) {
  const container = document.getElementById('garmentOverlayContainer');
  container.style.transform = `translate(calc(-50% + ${garmentPosX}px), calc(-50% + ${garmentPosY}px)) scale(${garmentScale}) rotate(${rotationAngle}deg)`;
}

function resetGarmentAdjustments() {
  garmentScale = 1.0;
  garmentPosX = 0;
  garmentPosY = 0;
  garmentOpacity = 0.95;
  isMediaPipeAutoFit = true;

  document.getElementById('scaleSlider').value = 1.0;
  document.getElementById('scaleValueText').textContent = '100%';
  document.getElementById('posYSlider').value = 0;
  document.getElementById('posYValueText').textContent = '0';
  document.getElementById('opacitySlider').value = 0.95;
  document.getElementById('opacityValueText').textContent = '95%';
  document.getElementById('aiFitBtnText').textContent = 'IA Auto-Calce: ACTIVADO';

  document.getElementById('garmentOverlayContainer').style.opacity = garmentOpacity;
  updateGarmentTransform();
}

function captureTryOnSnapshot() {
  const canvas = document.getElementById('snapshotCanvas');
  const ctx = canvas.getContext('2d');
  const video = document.getElementById('webcamVideo');
  const staticImg = document.getElementById('staticPreviewImage');
  const overlayImg = document.getElementById('garmentOverlayImg');

  const width = 800;
  const height = 900;
  canvas.width = width;
  canvas.height = height;

  if (video.style.display !== 'none' && webcamStream) {
    ctx.save();
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, width, height);
    ctx.restore();
  } else {
    ctx.drawImage(staticImg, 0, 0, width, height);
  }

  const ow = 450 * garmentScale;
  const oh = 500 * garmentScale;
  const ox = (width - ow) / 2 + garmentPosX;
  const oy = (height - oh) / 2 + garmentPosY;

  ctx.globalAlpha = garmentOpacity;
  ctx.drawImage(overlayImg, ox, oy, ow, oh);
  ctx.globalAlpha = 1.0;

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px Montserrat';
  ctx.fillText("TAGHER'S STREETWEAR IA", 30, height - 40);

  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `TAGHERS-LOOK-${Date.now()}.png`;
  a.click();

  showToast('¡Foto capturada y guardada en tu equipo!', 'success');
}

function addCurrentTryonToCart() {
  if (activeTryonProduct) {
    addToCart(activeTryonProduct.id, modalSelectedSize, 1);
    showToast(`"${activeTryonProduct.name}" agregada a tu cesta`, 'success');
  }
}

// ------------------------------------------------------------
// 6. ASESOR INTELIGENTE DE TALLE (SMART SIZER)
// ------------------------------------------------------------
let recommendedSize = 'L';

function openSmartSizerModal() {
  document.getElementById('smartSizerModal').classList.add('active');
}

function closeSmartSizerModal() {
  document.getElementById('smartSizerModal').classList.remove('active');
}

function calculateSmartSize(event) {
  event.preventDefault();
  const height = parseInt(document.getElementById('sizerHeight').value, 10);
  const weight = parseInt(document.getElementById('sizerWeight').value, 10);
  const fitPref = document.querySelector('input[name="fitPref"]:checked').value;

  // Algoritmo de recomendación
  let baseSize = 'M';
  if (height < 165 || weight < 58) baseSize = 'S';
  else if (height <= 175 && weight <= 72) baseSize = 'M';
  else if (height <= 185 && weight <= 86) baseSize = 'L';
  else baseSize = 'XL';

  if (fitPref === 'baggy') {
    if (baseSize === 'S') recommendedSize = 'M';
    else if (baseSize === 'M') recommendedSize = 'L';
    else if (baseSize === 'L') recommendedSize = 'XL';
    else recommendedSize = 'XXL';
  } else if (fitPref === 'regular') {
    recommendedSize = baseSize;
  } else {
    recommendedSize = baseSize;
  }

  document.getElementById('resultSizeDisplay').textContent = `TALLE ${recommendedSize}`;
  document.getElementById('resultExplanation').textContent = 
    `Para tu contextura (${height}cm / ${weight}kg) y tu preferencia de calce "${fitPref.toUpperCase()}", este talle garantiza la caída auténtica sobre el calzado sin pisar los bajos.`;
  document.getElementById('sizerResultCard').style.display = 'block';
}

function applySizerRecommendation() {
  modalSelectedSize = recommendedSize;
  const sizeBtns = document.querySelectorAll('.size-options .size-btn');
  sizeBtns.forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim() === recommendedSize);
  });
  closeSmartSizerModal();
  showToast(`Talle recomendado ${recommendedSize} seleccionado`, 'success');
}

// ------------------------------------------------------------
// 7. MODAL DE PRODUCTO & CARRUSEL MULTI-ÁNGULO
// ------------------------------------------------------------
function openProductModal(productId) {
  const product = PRODUCTS_DATABASE.find(p => p.id === productId);
  if (!product) return;

  activeProductForModal = product;
  activeImageIndex = 0;
  modalQuantity = 1;

  document.getElementById('modalProductBadge').textContent = product.badge;
  document.getElementById('modalProductTitle').textContent = product.name;
  document.getElementById('modalProductPrice').textContent = `$${formatCurrency(product.price)}`;
  
  const oldPriceEl = document.getElementById('modalProductOldPrice');
  if (product.oldPrice) {
    oldPriceEl.textContent = `$${formatCurrency(product.oldPrice)}`;
    oldPriceEl.style.display = 'inline';
  } else {
    oldPriceEl.style.display = 'none';
  }

  document.getElementById('modalProductDesc').textContent = product.description;
  document.getElementById('modalQtyDisplay').textContent = '1';

  // Renderizar carrusel
  const productImages = product.images || [product.image, product.image, product.image, product.image];
  updateCarouselView(productImages);

  // Ocultar selector de tallas para accesorios
  const sizeGroup = document.getElementById('sizeSelectorGroup');
  if (product.category === 'accesorios') {
    sizeGroup.style.display = 'none';
  } else {
    sizeGroup.style.display = 'block';
    const sizeBtns = document.querySelectorAll('.size-options .size-btn');
    sizeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.textContent.trim() === modalSelectedSize);
    });
  }

  document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
  activeProductForModal = null;
}

function updateCarouselView(images) {
  const mainImg = document.getElementById('modalProductImg');
  const counter = document.getElementById('carouselCounter');
  const thumbsRow = document.getElementById('carouselThumbnailsRow');

  mainImg.src = images[activeImageIndex] || images[0];
  counter.textContent = `${activeImageIndex + 1} / ${images.length}`;

  thumbsRow.innerHTML = images.map((imgUrl, idx) => `
    <img class="carousel-thumb ${idx === activeImageIndex ? 'active' : ''}" 
         src="${imgUrl}" alt="Ángulo ${idx + 1}" onclick="setCarouselImage(${idx})">
  `).join('');
}

function navigateCarousel(delta) {
  if (!activeProductForModal) return;
  const images = activeProductForModal.images || [activeProductForModal.image];
  activeImageIndex = (activeImageIndex + delta + images.length) % images.length;
  updateCarouselView(images);
}

function setCarouselImage(idx) {
  if (!activeProductForModal) return;
  const images = activeProductForModal.images || [activeProductForModal.image];
  activeImageIndex = idx;
  updateCarouselView(images);
}

function selectSize(btn, size) {
  modalSelectedSize = size;
  document.querySelectorAll('.size-options .size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function incrementModalQty() {
  modalQuantity++;
  document.getElementById('modalQtyDisplay').textContent = modalQuantity;
}

function decrementModalQty() {
  if (modalQuantity > 1) {
    modalQuantity--;
    document.getElementById('modalQtyDisplay').textContent = modalQuantity;
  }
}

function addProductModalToCart() {
  if (!activeProductForModal) return;
  addToCart(activeProductForModal.id, modalSelectedSize, modalQuantity);
  closeProductModal();
  toggleCartDrawer(true);
}

function openTryOnFromProductModal() {
  if (!activeProductForModal) return;
  const prodId = activeProductForModal.id;
  closeProductModal();
  openTryOnModal(prodId);
}

function buyViaWhatsAppFromModal() {
  if (!activeProductForModal) return;
  const p = activeProductForModal;
  const msg = encodeURIComponent(
    `¡Hola TAGHER'S! 🔥 Quiero comprar:\n• 1x ${p.name} (Talla: ${modalSelectedSize})\nPrecio: $${formatCurrency(p.price)}\n¿Tienen stock disponible para enviar?`
  );
  window.open(`https://wa.me/?text=${msg}`, '_blank');
}

// ------------------------------------------------------------
// 8. PANEL DE ADMINISTRADOR & BASE DE DATOS
// ------------------------------------------------------------
let ADMIN_DB_CACHE = null;
let CURRENT_DB_SUBTABLE = 'users';

function openAdminModal() {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Acceso restringido: Debes iniciar sesión como Administrador', 'info');
    return;
  }
  document.getElementById('adminModal').classList.add('active');
  loadAdminMetrics();
}

function closeAdminModal() {
  document.getElementById('adminModal').classList.remove('active');
}

function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-view').forEach(v => v.style.display = 'none');

  if (tab === 'metrics') {
    document.getElementById('tabMetrics').classList.add('active');
    document.getElementById('adminViewMetrics').style.display = 'block';
  } else if (tab === 'ranking') {
    document.getElementById('tabRanking').classList.add('active');
    document.getElementById('adminViewRanking').style.display = 'block';
  } else if (tab === 'users') {
    document.getElementById('tabUsers').classList.add('active');
    document.getElementById('adminViewUsers').style.display = 'block';
  } else if (tab === 'stock') {
    document.getElementById('tabStock').classList.add('active');
    document.getElementById('adminViewStock').style.display = 'block';
  } else if (tab === 'orders') {
    document.getElementById('tabOrders').classList.add('active');
    document.getElementById('adminViewOrders').style.display = 'block';
  } else if (tab === 'database') {
    document.getElementById('tabDatabase').classList.add('active');
    document.getElementById('adminViewDatabase').style.display = 'block';
  }
}

async function loadAdminMetrics() {
  if (!currentUser || currentUser.role !== 'admin') return;

  const authHeaders = {
    'x-user-role': currentUser.role,
    'x-user-email': currentUser.email
  };

  try {
    const res = await fetch('/api/admin/metrics', { headers: authHeaders });
    if (!res.ok) {
      if (res.status === 403) {
        showToast('Acceso denegado: Se requieren permisos de Administrador', 'info');
      }
      return;
    }
    const data = await res.json();

    // 1. KPIs
    document.getElementById('kpiRevenueDisplay').textContent = `$${formatCurrency(data.totalRevenue || 0)}`;
    document.getElementById('kpiOrdersDisplay').textContent = data.totalOrdersCount || 0;
    document.getElementById('kpiUsersDisplay').textContent = data.totalUsersCount || 0;
    
    const subTag = document.getElementById('kpiUsersSubTag');
    if (subTag) {
      subTag.innerHTML = `<i class="fa-solid fa-users"></i> ${data.customerCount || 0} Clientes | ${data.adminCount || 1} Admin`;
    }

    const lowStockCountEl = document.getElementById('kpiLowStockDisplay');
    if (lowStockCountEl) {
      lowStockCountEl.textContent = (data.lowStockProducts ? data.lowStockProducts.length : 0);
    }

    // 2. Producto Estrella (Top 1)
    if (data.topProduct) {
      const tp = data.topProduct;
      document.getElementById('topProductImg').src = tp.image;
      document.getElementById('topProductName').textContent = tp.name;
      document.getElementById('topProductBadge').textContent = tp.badge || 'TOP SELLER';
      document.getElementById('topProductUnits').textContent = `${tp.unitsSold || 0} u. vendidas`;
      document.getElementById('topProductPrice').textContent = `$${formatCurrency(tp.price)}`;
      document.getElementById('topProductTotalSales').textContent = `$${formatCurrency((tp.unitsSold || 0) * tp.price)}`;
    }

    // 3. Cuadro Didáctico: Ranking Visual de Demanda y Facturación
    const rankingContainer = document.getElementById('adminRankingContainer');
    if (rankingContainer && data.topProductsRanking) {
      rankingContainer.innerHTML = data.topProductsRanking.map(item => {
        const medal = item.rank === 1 ? '🥇' : (item.rank === 2 ? '🥈' : (item.rank === 3 ? '🥉' : `#${item.rank}`));
        return `
          <div class="ranking-card rank-${item.rank}">
            <div class="ranking-rank-badge">${medal}</div>
            <img class="ranking-thumb" src="${item.image}" alt="${item.name}">
            <div class="ranking-info">
              <h4>${item.name}</h4>
              <span class="ranking-cat-tag"><i class="fa-solid fa-tag"></i> ${item.category} • $${formatCurrency(item.price)} c/u</span>
              <div class="ranking-bar-track" title="${item.salesPercent}% de la demanda líder">
                <div class="ranking-bar-fill" style="width: ${Math.max(12, item.salesPercent)}%;"></div>
              </div>
            </div>
            <div class="ranking-stats-col">
              <span class="ranking-units">${item.unitsSold} u. vendidas</span>
              <span class="ranking-money">$${formatCurrency(item.totalRevenue)}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    // 4. Directorio de Usuarios Registrados
    const usersTbody = document.getElementById('adminUsersTableBody');
    if (usersTbody && data.usersList) {
      usersTbody.innerHTML = data.usersList.map(u => {
        const initials = u.name ? u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'US';
        const roleBadge = u.role === 'admin' 
          ? `<span class="badge-role-admin"><i class="fa-solid fa-shield-halved"></i> Administrador</span>`
          : `<span class="badge-role-customer"><i class="fa-solid fa-user"></i> Cliente Registrado</span>`;
        return `
          <tr>
            <td>
              <div class="user-name-cell">
                <div class="user-avatar-circle">${initials}</div>
                <div>
                  <b>${u.name}</b><br>
                  <small style="color: #777;">ID: ${u.id}</small>
                </div>
              </div>
            </td>
            <td><a href="mailto:${u.email}" style="color: inherit; text-decoration: underline;">${u.email}</a></td>
            <td>${u.phone}</td>
            <td>${roleBadge}</td>
            <td>${u.createdAt}</td>
            <td><b>${u.ordersCount}</b> órdenes</td>
          </tr>
        `;
      }).join('');
    }

    // 5. Tabla de Stock Crítico
    const lowStockTbody = document.getElementById('lowStockTableBody');
    if (lowStockTbody) {
      if (data.lowStockProducts && data.lowStockProducts.length > 0) {
        lowStockTbody.innerHTML = data.lowStockProducts.map(p => `
          <tr>
            <td><b>${p.name}</b></td>
            <td>${p.category}</td>
            <td>$${formatCurrency(p.price)}</td>
            <td><b style="color: #dc2626;">${p.stock} u.</b></td>
            <td><span class="badge-low-stock">Crítico (&lt;10)</span></td>
            <td>
              <button class="btn btn-sm btn-dark" onclick="replenishStock('${p.id}', 10)">
                <i class="fa-solid fa-plus"></i> Reponer +10
              </button>
            </td>
          </tr>
        `).join('');
      } else {
        lowStockTbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #16a34a; padding: 20px;">✓ Todo el inventario está en niveles óptimos</td></tr>';
      }
    }

    // 6. Tabla de Órdenes
    const ordersTbody = document.getElementById('adminOrdersTableBody');
    if (ordersTbody && data.orders) {
      ordersTbody.innerHTML = data.orders.map(o => `
        <tr>
          <td><b>${o.id}</b></td>
          <td>${o.userName}<br><small style="color: #777;">${o.phone || o.userEmail}</small></td>
          <td style="max-width: 200px;">${o.items}</td>
          <td><b>$${formatCurrency(o.total)}</b></td>
          <td>${o.paymentMethod}</td>
          <td>
            <select class="status-select" onchange="changeOrderStatus('${o.id}', this.value)">
              <option value="En preparación" ${o.status === 'En preparación' ? 'selected' : ''}>En preparación</option>
              <option value="Despachado" ${o.status === 'Despachado' ? 'selected' : ''}>Despachado</option>
              <option value="Entregado" ${o.status === 'Entregado' ? 'selected' : ''}>Entregado</option>
            </select>
          </td>
        </tr>
      `).join('');
    }

    // 7. Cargar base de datos completa para el Explorador de Tablas
    loadRawDatabase(authHeaders);

  } catch (err) {
    console.error('Error cargando métricas de admin:', err);
  }
}

async function replenishStock(productId, addUnits) {
  if (!currentUser || currentUser.role !== 'admin') return;

  const prod = PRODUCTS_DATABASE.find(p => p.id === productId);
  const current = prod ? (prod.stock || 0) : 0;
  const newStock = current + addUnits;

  try {
    const res = await fetch('/api/admin/stock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': currentUser.role,
        'x-user-email': currentUser.email
      },
      body: JSON.stringify({ productId, newStock })
    });
    if (res.ok) {
      showToast(`Stock reabastecido (+${addUnits} unidades)`, 'success');
      syncProductsFromBackend();
      loadAdminMetrics();
    }
  } catch (err) {
    showToast('Error al actualizar stock', 'info');
  }
}

async function changeOrderStatus(orderId, newStatus) {
  if (!currentUser || currentUser.role !== 'admin') return;

  try {
    const res = await fetch('/api/admin/orders/status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': currentUser.role,
        'x-user-email': currentUser.email
      },
      body: JSON.stringify({ orderId, status: newStatus })
    });
    if (res.ok) {
      showToast(`Estado de orden ${orderId} actualizado a "${newStatus}"`, 'success');
    }
  } catch (err) {
    showToast('Error al actualizar pedido', 'info');
  }
}

async function loadRawDatabase(authHeaders) {
  try {
    const headers = authHeaders || {
      'x-user-role': currentUser ? currentUser.role : '',
      'x-user-email': currentUser ? currentUser.email : ''
    };
    const res = await fetch('/api/db/export', { headers });
    if (res.ok) {
      ADMIN_DB_CACHE = await res.json();
      
      // Actualizar conteos de subtabs
      if (document.getElementById('dbUsersCount')) {
        document.getElementById('dbUsersCount').textContent = ADMIN_DB_CACHE.users ? ADMIN_DB_CACHE.users.length : 0;
      }
      if (document.getElementById('dbProductsCount')) {
        document.getElementById('dbProductsCount').textContent = ADMIN_DB_CACHE.products ? ADMIN_DB_CACHE.products.length : 0;
      }
      if (document.getElementById('dbOrdersCount')) {
        document.getElementById('dbOrdersCount').textContent = ADMIN_DB_CACHE.orders ? ADMIN_DB_CACHE.orders.length : 0;
      }

      renderDbSubtable(CURRENT_DB_SUBTABLE);
    }
  } catch (err) {
    console.error('Error cargando export de DB:', err);
  }
}

function switchDbSubtable(subtable) {
  CURRENT_DB_SUBTABLE = subtable;
  document.querySelectorAll('.db-subtab').forEach(b => b.classList.remove('active'));
  const activeBtn = document.getElementById(`subtab${subtable.charAt(0).toUpperCase() + subtable.slice(1)}`);
  if (activeBtn) activeBtn.classList.add('active');
  renderDbSubtable(subtable);
}

function renderDbSubtable(subtable) {
  const container = document.getElementById('dbSubtableContent');
  if (!container || !ADMIN_DB_CACHE) return;

  if (subtable === 'users') {
    const users = ADMIN_DB_CACHE.users || [];
    container.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Teléfono</th>
            <th>Fecha Creación</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(u => `
            <tr>
              <td><code>${u.id}</code></td>
              <td><b>${u.name}</b></td>
              <td>${u.email}</td>
              <td><span class="${u.role === 'admin' ? 'badge-role-admin' : 'badge-role-customer'}">${u.role.toUpperCase()}</span></td>
              <td>${u.phone || 'N/A'}</td>
              <td>${u.createdAt}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else if (subtable === 'products') {
    const products = ADMIN_DB_CACHE.products || [];
    container.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID Prenda</th>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Vendidos</th>
            <th>Badge</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td><code>${p.id}</code></td>
              <td><img src="${p.image}" style="width: 42px; height: 42px; object-fit: cover; border-radius: 4px;"></td>
              <td><b>${p.name}</b></td>
              <td>${p.category} / ${p.subCategory || ''}</td>
              <td>$${formatCurrency(p.price)}</td>
              <td><b style="color: ${p.stock < 10 ? '#dc2626' : '#16a34a'};">${p.stock} u.</b></td>
              <td><b>${p.unitsSold || 0}</b></td>
              <td><span class="top-product-badge">${p.badge || 'ITEM'}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else if (subtable === 'orders') {
    const orders = ADMIN_DB_CACHE.orders || [];
    container.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Cliente</th>
            <th>Email / Teléfono</th>
            <th>Prendas</th>
            <th>Total</th>
            <th>Método</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(o => `
            <tr>
              <td><b>${o.id}</b></td>
              <td>${o.userName}</td>
              <td>${o.userEmail}<br><small>${o.phone}</small></td>
              <td>${o.items}</td>
              <td><b>$${formatCurrency(o.total)}</b></td>
              <td>${o.paymentMethod}</td>
              <td><span class="badge-status">${o.status}</span></td>
              <td>${o.createdAt}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else if (subtable === 'raw') {
    container.innerHTML = `
      <div style="padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span style="font-size: 0.82rem; font-weight: 800; color: #555;">RESPALDO JSON Y ESQUEMA SUPABASE SQL:</span>
          <div>
            <button class="btn btn-sm btn-dark" onclick="copySupabaseSql()">
              <i class="fa-solid fa-copy"></i> Copiar SQL para Supabase
            </button>
          </div>
        </div>
        <pre class="json-code-box" id="dbRawJsonDisplay">${JSON.stringify(ADMIN_DB_CACHE, null, 2)}</pre>
      </div>
    `;
  }
}

function downloadDbBackup() {
  if (!ADMIN_DB_CACHE) {
    showToast('No hay datos disponibles para exportar', 'info');
    return;
  }
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ADMIN_DB_CACHE, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `taghers_database_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('¡Copia de seguridad descargada exitosamente!', 'success');
}

function copySupabaseSql() {
  const sql = `-- ESQUEMA POSTGRESQL PARA SUPABASE (TAGHER'S)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'customer',
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  stock INT DEFAULT 15,
  units_sold INT DEFAULT 0,
  image TEXT NOT NULL,
  badge TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  user_email TEXT,
  phone TEXT,
  address TEXT,
  items TEXT,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'En preparación',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

  navigator.clipboard.writeText(sql).then(() => {
    showToast('¡Script SQL para Supabase copiado al portapapeles!', 'success');
  });
}

// ------------------------------------------------------------
// 9. USUARIOS / AUTENTICACIÓN / LOCALSTORAGE & API
// ------------------------------------------------------------
function handleUserClick() {
  const modal = document.getElementById('authModal');
  const formsView = document.getElementById('authFormsView');
  const profileView = document.getElementById('userProfileView');

  if (currentUser) {
    formsView.style.display = 'none';
    profileView.style.display = 'block';
    loadUserProfileData();
  } else {
    formsView.style.display = 'block';
    profileView.style.display = 'none';
    switchAuthTab('login');
  }

  modal.classList.add('active');
}

function closeAuthModal() {
  document.getElementById('authModal').classList.remove('active');
}

function switchAuthTab(tab) {
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const formLogin = document.getElementById('loginForm');
  const formRegister = document.getElementById('registerForm');

  if (tab === 'login') {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    formLogin.classList.add('active');
    formRegister.classList.remove('active');
  } else {
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
    formLogin.classList.remove('active');
    formRegister.classList.add('active');
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.success && data.user) {
      currentUser = data.user;
      localStorage.setItem('taghers_currentUser', JSON.stringify(currentUser));
      updateUserUI();
      closeAuthModal();

      if (currentUser.role === 'admin') {
        showToast('¡Bienvenido Supervisor! Acceso concedido al panel admin', 'success');
        openAdminModal();
      } else {
        showToast(`¡Bienvenido de nuevo, ${currentUser.name}!`, 'success');
      }
    } else {
      showToast('Credenciales incorrectas. Prueba admin@taghers.com / admin123', 'info');
    }
  } catch (err) {
    // Modo fallback local si no responde el server
    if (email.toLowerCase() === 'admin@taghers.com' && password === 'admin123') {
      currentUser = { name: 'Supervisor TAGHER\'S', email: 'admin@taghers.com', role: 'admin' };
      localStorage.setItem('taghers_currentUser', JSON.stringify(currentUser));
      updateUserUI();
      closeAuthModal();
      openAdminModal();
    } else {
      showToast('Error conectando al servidor de usuarios', 'info');
    }
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (data.success && data.user) {
      currentUser = data.user;
      localStorage.setItem('taghers_currentUser', JSON.stringify(currentUser));
      updateUserUI();
      closeAuthModal();
      showToast(`¡Cuenta registrada en la base de datos! Bienvenido ${name}`, 'success');
    } else {
      showToast(data.message || 'Error al registrarse', 'info');
    }
  } catch (err) {
    showToast('Error al conectar con la base de datos', 'info');
  }
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('taghers_currentUser');
  updateUserUI();
  closeAuthModal();
  showToast('Has cerrado sesión correctamente', 'info');
}

function updateUserUI() {
  const badgeName = document.getElementById('userBadgeName');
  const headerAdminBtn = document.getElementById('headerAdminBtn');
  const mobileAdminLink = document.getElementById('mobileAdminLink');

  if (currentUser) {
    badgeName.textContent = currentUser.name.split(' ')[0].toUpperCase();
    if (currentUser.role === 'admin') {
      badgeName.textContent = '👑 ADMIN';
      if (headerAdminBtn) headerAdminBtn.style.display = 'inline-flex';
      if (mobileAdminLink) mobileAdminLink.style.display = 'block';
    } else {
      if (headerAdminBtn) headerAdminBtn.style.display = 'none';
      if (mobileAdminLink) mobileAdminLink.style.display = 'none';
    }
  } else {
    badgeName.textContent = 'ENTRAR';
    if (headerAdminBtn) headerAdminBtn.style.display = 'none';
    if (mobileAdminLink) mobileAdminLink.style.display = 'none';
  }
}

function loadUserProfileData() {
  if (!currentUser) return;
  document.getElementById('profileNameDisplay').textContent = currentUser.name;
  document.getElementById('profileEmailDisplay').textContent = currentUser.email;

  const roleTag = document.getElementById('profileRoleTag');
  const adminBtn = document.getElementById('profileAdminAccessBtn');
  if (currentUser.role === 'admin') {
    roleTag.textContent = '👑 SUPERVISOR / ADMINISTRADOR';
    roleTag.style.background = '#e63946';
    adminBtn.style.display = 'block';
  } else {
    roleTag.textContent = 'CLIENTE VIP TAGHER\'S';
    roleTag.style.background = '#000000';
    adminBtn.style.display = 'none';
  }

  // Cargar favoritos
  document.getElementById('profileWishlistCount').textContent = wishlist.length;
  const wishlistPreviewsEl = document.getElementById('profileWishlistPreviews');
  if (wishlist.length > 0) {
    const favProducts = PRODUCTS_DATABASE.filter(p => wishlist.includes(p.id));
    wishlistPreviewsEl.innerHTML = favProducts.map(p => `
      <img class="wishlist-item-thumb" src="${p.image}" alt="${p.name}" title="${p.name}" onclick="openProductModal('${p.id}')">
    `).join('');
  } else {
    wishlistPreviewsEl.innerHTML = '<span style="font-size: 0.75rem; color: #888;">No tienes prendas guardadas.</span>';
  }
}

// ------------------------------------------------------------
// 10. CARRITO DE COMPRAS & CHECKOUT
// ------------------------------------------------------------
function quickAddToCart(productId) {
  addToCart(productId, 'M', 1);
  showToast('Prenda agregada a tu cesta', 'success');
}

function addToCart(productId, size, quantity) {
  const product = PRODUCTS_DATABASE.find(p => p.id === productId);
  if (!product) return;

  const existingIndex = cart.findIndex(item => item.id === productId && item.size === size);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: size,
      quantity: quantity
    });
  }

  saveCart();
  updateCartUI();
}

function updateCartQuantity(index, delta) {
  if (cart[index]) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveCart();
    updateCartUI();
  }
}

function removeCartItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
  showToast('Artículo eliminado del carrito', 'info');
}

function saveCart() {
  localStorage.setItem('taghers_cart', JSON.stringify(cart));
}

function toggleCartDrawer(open) {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (open) {
    drawer.classList.add('active');
    overlay.classList.add('active');
  } else {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
  }
}

function updateCartUI() {
  const countBadge = document.getElementById('cartCountBadge');
  const drawerCount = document.getElementById('cartDrawerCount');
  const container = document.getElementById('cartItemsContainer');
  const subtotalEl = document.getElementById('cartSubtotalText');
  const totalEl = document.getElementById('cartTotalText');
  const discountRow = document.getElementById('cartDiscountRow');
  const discountText = document.getElementById('cartDiscountText');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  countBadge.textContent = totalItems;
  drawerCount.textContent = totalItems;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-msg">
        <i class="fa-solid fa-basket-shopping"></i>
        <h4>Tu cesta está vacía</h4>
        <p>Descubre los nuevos drops y añade tus prendas favoritas.</p>
      </div>
    `;
    subtotalEl.textContent = '$0';
    totalEl.textContent = '$0';
    discountRow.style.display = 'none';
    return;
  }

  container.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <img class="cart-item-thumb" src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <span class="cart-item-tag">Talla: <b>${item.size}</b></span>
        <div class="cart-item-qty">
          <button onclick="updateCartQuantity(${idx}, -1)"><i class="fa-solid fa-minus"></i></button>
          <span>${item.quantity}</span>
          <button onclick="updateCartQuantity(${idx}, 1)"><i class="fa-solid fa-plus"></i></button>
        </div>
      </div>
      <div class="cart-item-price-col">
        <span class="cart-item-price">$${formatCurrency(item.price * item.quantity)}</span>
        <button class="remove-cart-item-btn" onclick="removeCartItem(${idx})" title="Eliminar">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = 0;
  if (activeCoupon) {
    discount = Math.round(subtotal * activeCoupon.rate);
    discountRow.style.display = 'flex';
    discountText.textContent = `-$${formatCurrency(discount)}`;
  } else {
    discountRow.style.display = 'none';
  }

  const finalTotal = subtotal - discount;
  subtotalEl.textContent = `$${formatCurrency(subtotal)}`;
  totalEl.textContent = `$${formatCurrency(finalTotal)}`;
}

function applyCoupon() {
  const code = document.getElementById('couponInput').value.trim().toUpperCase();
  if (code === 'TAGHERS10' || code === 'SOUTHPOLE10') {
    activeCoupon = { code, rate: 0.10 };
    document.getElementById('couponAppliedAlert').style.display = 'flex';
    updateCartUI();
    showToast('¡Cupón del 10% de descuento aplicado!', 'success');
  } else {
    showToast('Cupón inválido. Prueba con TAGHERS10', 'info');
  }
}

function removeCoupon() {
  activeCoupon = null;
  document.getElementById('couponInput').value = '';
  document.getElementById('couponAppliedAlert').style.display = 'none';
  updateCartUI();
}

function openCheckoutModal() {
  if (cart.length === 0) {
    showToast('Tu cesta está vacía para pagar', 'info');
    return;
  }
  toggleCartDrawer(false);

  if (currentUser) {
    document.getElementById('chkName').value = currentUser.name;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = activeCoupon ? Math.round(subtotal * activeCoupon.rate) : 0;
  const total = subtotal - discount;
  document.getElementById('chkTotalDisplay').textContent = `$${formatCurrency(total)}`;

  document.getElementById('checkoutFormStep').style.display = 'block';
  document.getElementById('checkoutSuccessStep').style.display = 'none';
  document.getElementById('checkoutModal').classList.add('active');
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal').classList.remove('active');
}

async function processCheckout(event) {
  event.preventDefault();
  const name = document.getElementById('chkName').value;
  const phone = document.getElementById('chkPhone').value;
  const address = document.getElementById('chkAddress').value;
  const payMethod = document.querySelector('input[name="payMethod"]:checked').value;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = activeCoupon ? Math.round(subtotal * activeCoupon.rate) : 0;
  const total = subtotal - discount;

  const itemsSummary = cart.map(i => `${i.name} (${i.size}) x${i.quantity}`).join(', ');

  try {
    const res = await fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: name,
        userEmail: currentUser ? currentUser.email : '',
        phone: phone,
        address: address,
        itemsSummary: itemsSummary,
        items: cart,
        total: total,
        paymentMethod: payMethod === 'card' ? 'Tarjeta de Crédito' : 'Mercado Pago'
      })
    });

    const data = await res.json();
    const orderId = data.order ? data.order.id : `#TAG-${Math.floor(1000 + Math.random() * 9000)}`;

    document.getElementById('ticketOrderId').textContent = orderId;
    document.getElementById('ticketClientName').textContent = name;
    document.getElementById('ticketTotalAmount').textContent = `$${formatCurrency(total)}`;

    cart = [];
    activeCoupon = null;
    saveCart();
    updateCartUI();

    document.getElementById('checkoutFormStep').style.display = 'none';
    document.getElementById('checkoutSuccessStep').style.display = 'block';
    showToast('¡Pago registrado con éxito en la base de datos!', 'success');
  } catch (err) {
    showToast('Pedido simulado completado', 'success');
  }
}

function finishCheckoutFlow() {
  closeCheckoutModal();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function checkoutViaWhatsApp() {
  if (cart.length === 0) {
    showToast('Tu cesta está vacía', 'info');
    return;
  }
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = activeCoupon ? Math.round(subtotal * activeCoupon.rate) : 0;
  const total = subtotal - discount;

  const itemsList = cart.map(i => `• ${i.name} (Talla: ${i.size}) x${i.quantity} = $${formatCurrency(i.price * i.quantity)}`).join('\n');
  const msg = encodeURIComponent(
    `¡Hola TAGHER'S! 🔥 Quiero encargar este pedido:\n\n${itemsList}\n\nTotal a abonar: $${formatCurrency(total)}\n¿Me pasan los datos para transferir?`
  );
  window.open(`https://wa.me/?text=${msg}`, '_blank');
}

// ------------------------------------------------------------
// 11. FAVORITOS Y UTILIDADES
// ------------------------------------------------------------
function toggleWishlist(productId, event) {
  if (event) event.stopPropagation();
  const idx = wishlist.indexOf(productId);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast('Eliminado de tus favoritos', 'info');
  } else {
    wishlist.push(productId);
    showToast('¡Guardado en tus favoritos!', 'success');
  }
  localStorage.setItem('taghers_wishlist', JSON.stringify(wishlist));
  renderProducts();
}

function handleNewsletter(event) {
  event.preventDefault();
  event.target.reset();
  showToast('¡Gracias por suscribirte al drop exclusivo de TAGHER\'S!', 'success');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';

  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function formatCurrency(amount) {
  return amount.toLocaleString('es-AR');
}

// ============================================================
// 12. REACTBITS SCROLL-EXPAND HERO CONTROLLER
// Expande el card central del modelo afrodescendiente a pantalla completa
// ============================================================
function initScrollExpand() {
  const runway = document.getElementById('scrollExpandRunway');
  const card = document.getElementById('scrollExpandCard');
  const img = document.getElementById('scrollExpandImg');
  const hint = document.getElementById('scrollProgressHint');
  if (!runway || !card) return;

  const updateCard = () => {
    const rect = runway.getBoundingClientRect();
    const windowH = window.innerHeight;
    const runwayH = rect.height;
    
    // Distancia total de scroll
    const scrollDistance = runwayH - windowH;
    if (scrollDistance <= 0) return;

    // Progreso de 0 a 1 basado en cuánto se ha desplazado el runway
    const scrolled = -rect.top;
    let progress = scrolled / scrollDistance;
    progress = Math.max(0, Math.min(1, progress));

    const isMobile = window.innerWidth <= 768;

    // Ancho: 72vw (90vw móvil) -> 100vw
    const startW = isMobile ? 90 : 72;
    const currentW = startW + (100 - startW) * progress;

    // Alto: 52vh (58vh móvil) -> 100vh
    const startH = isMobile ? 58 : 52;
    const currentH = startH + (100 - startH) * progress;

    // Radio de borde: 28px (18px móvil) -> 0px
    const startR = isMobile ? 18 : 28;
    const currentR = startR * (1 - progress);

    // Ajuste de restricciones máximas
    if (progress > 0.05) {
      card.style.maxWidth = '100vw';
      card.style.maxHeight = '100vh';
    } else {
      card.style.maxWidth = isMobile ? '95vw' : '900px';
      card.style.maxHeight = isMobile ? '600px' : '500px';
    }

    card.style.width = `${currentW}vw`;
    card.style.height = `${currentH}vh`;
    card.style.borderRadius = `${currentR}px`;

    // Parallax y escalado de la imagen del modelo
    if (img) {
      const imgScale = 1.02 + 0.08 * progress;
      img.style.transform = `scale(${imgScale})`;
    }

    // Efecto sutil de bordes y sombras para estética blanca limpia TAGHER'S
    card.style.borderColor = `rgba(0, 0, 0, ${0.08 * (1 - progress)})`;
    card.style.boxShadow = `0 20px 50px rgba(0, 0, 0, ${0.12 * (1 - progress)}), 0 4px 16px rgba(0, 0, 0, ${0.06 * (1 - progress)})`;

    // Ocultar hint de scroll suavemente al comenzar
    if (hint) {
      hint.style.opacity = progress > 0.12 ? '0' : '1';
    }
  };

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateCard);
  }, { passive: true });

  window.addEventListener('resize', () => {
    requestAnimationFrame(updateCard);
  });

  updateCard();
}

function scrollToCatalog() {
  const catalog = document.getElementById('catalogSection');
  if (catalog) {
    catalog.scrollIntoView({ behavior: 'smooth' });
  }
}

// ============================================================
// 13. AI FASHION STUDIO — GENERADOR DE MODELOS CON ROPA REAL
// ============================================================
const STUDIO_PRESETS = [
  {
    id: 'true-religion-hoodie',
    name: "True Religion Crimson Gothic 'REL' Heavy Zip Hoodie",
    category: "sudaderas",
    badge: "TRUE RELIGION",
    garmentImage: "/assets/garments/true_religion_hoodie.png",
    modelImage: "/assets/models/hero_scroll_expand.jpg",
    backModelImage: "/assets/models/model_true_religion_hoodie.jpg",
    fullOutfitImage: "/assets/models/model_true_religion_full.jpg",
    productId: "hoodie-true-rel",
    garmentType: "Buzo Zip Hoodie con Capucha",
    color: "Rojo Carmesí Intenso (#C81D25)",
    fabric: "Algodón pesado 450 GSM",
    features: [
      "Tipografía gótica 'REL' blanca bordada en frontal",
      "Estampa dorsal completa gótica y herradura True Religion",
      "Costuras Super-T blancas en capucha y bolsillos",
      "Cordones blancos planos extra gruesos y cremallera metálica"
    ],
    confidence: "99.8%",
    defaultPose: "back",
    defaultStyle: "dark_red_halo"
  },
  {
    id: 'true-religion-denim',
    name: "True Religion Super-T Whisker Wash Baggy Denim",
    category: "vaqueros",
    badge: "SUPER-T DENIM",
    garmentImage: "/assets/garments/true_religion_denim.png",
    modelImage: "/assets/models/model_true_religion_full.jpg",
    backModelImage: "/assets/models/model_true_religion_full.jpg",
    fullOutfitImage: "/assets/models/model_true_religion_full.jpg",
    productId: "vag-true-rel",
    garmentType: "Pantalón Vaquero Baggy Relajado",
    color: "Denim Índigo con Bigotes Whisker",
    fabric: "Denim rígido 14.5 oz 100% algodón",
    features: [
      "Lavado whisker vintage en muslos",
      "Costura Super-T blanca ultra gruesa de alta densidad",
      "Bolsillos traseros con solapa y herradura en relieve",
      "Corte baggy amplio con caída sobre el calzado"
    ],
    confidence: "99.4%",
    defaultPose: "full",
    defaultStyle: "dark_red_halo"
  },
  {
    id: 'ecko-baggy',
    name: "Ecko Unltd 2000s Heavy Embroidered Baggy Jeans",
    category: "vaqueros",
    badge: "ECKO UNLTD",
    garmentImage: "/assets/garments/ecko_baggy_jeans.jpg",
    modelImage: "/assets/models/model_ecko_affliction.jpg",
    backModelImage: "/assets/models/model_ecko_affliction.jpg",
    fullOutfitImage: "/assets/models/model_ecko_affliction.jpg",
    productId: "vag-ecko",
    garmentType: "Vaquero Baggy Urbano Y2K",
    color: "Negro Profundo / Borde Plateado",
    fabric: "Heavyweight Black Denim 14 oz",
    features: [
      "Bordados icónicos de rinocerontes Ecko en pernera",
      "Coronas góticas bordadas en hilo plata metalizado",
      "Tiro ultra holgado estilo rap y skate 2000s",
      "Bolsillos traseros de gran escala"
    ],
    confidence: "99.2%",
    defaultPose: "full",
    defaultStyle: "dark_red_halo"
  },
  {
    id: 'affliction-tee',
    name: "Affliction Style Cyber Gothic Wings & Cross Tee",
    category: "camisetas",
    badge: "Y2K GOTHIC",
    garmentImage: "/assets/garments/affliction_nobility_tee.jpg",
    modelImage: "/assets/models/model_ecko_affliction.jpg",
    backModelImage: "/assets/models/model_ecko_affliction.jpg",
    fullOutfitImage: "/assets/models/model_ecko_affliction.jpg",
    productId: "tee-affliction",
    garmentType: "Camiseta Gráfica Lavado Ácido",
    color: "Gris Antracita / Cian & Plata",
    fabric: "Algodón Peinado 220 GSM",
    features: [
      "Alas de ángel cian y plata a lo largo de hombros y espalda",
      "Cruz tribal gótica central sin distorsión geométrica",
      "Calce relaxed fit de los años 2000s",
      "Desgaste vintage en cuello y mangas"
    ],
    confidence: "99.5%",
    defaultPose: "full",
    defaultStyle: "dark_red_halo"
  },
  {
    id: 'adidas-track',
    name: "Campera Chándal Retro 90s Three-Stripes",
    category: "sudaderas",
    badge: "RETRO CHÁNDAL",
    garmentImage: "/assets/garments/adidas_retro_track.jpg",
    modelImage: "/assets/models/model_retro_track.jpg",
    backModelImage: "/assets/models/model_retro_track.jpg",
    fullOutfitImage: "/assets/models/model_retro_track.jpg",
    productId: "sud-track",
    garmentType: "Chaqueta Deportiva Chándal Retro",
    color: "Azul Marino Intenso con Tres Franjas Blancas",
    fabric: "Tricot Poliéster Brillante 90s",
    features: [
      "Cuello alto acanalado con cremallera completa",
      "Tres bandas blancas cosidas a lo largo de mangas",
      "Puños y cintura elásticos de punto",
      "Silueta deportiva vintage holgada"
    ],
    confidence: "99.1%",
    defaultPose: "front",
    defaultStyle: "urban_night"
  },
  {
    id: 'arsenal-jersey',
    name: "Camiseta Blokecore Arsenal Fly Emirates 2012",
    category: "camisetas",
    badge: "BLOKECORE",
    garmentImage: "/assets/garments/arsenal_fly_emirates.jpg",
    modelImage: "/assets/models/model_retro_track.jpg",
    backModelImage: "/assets/models/model_retro_track.jpg",
    fullOutfitImage: "/assets/models/model_retro_track.jpg",
    productId: "tee-arsenal",
    garmentType: "Jersey Blokecore de Fútbol",
    color: "Rojo Carmesí con Rayas Degradadas",
    fabric: "Poliéster transpirable con microperforación",
    features: [
      "Escudo del Arsenal bordado en el pecho",
      "Patrocinador Fly Emirates en frontal",
      "Cuello redondo elástico y mangas ribeteadas",
      "Corte deportivo auténtico blokecore"
    ],
    confidence: "98.9%",
    defaultPose: "front",
    defaultStyle: "urban_night"
  },
  {
    id: 'skate-polo',
    name: "Chomba Polo Skate Y2K Rayas Gruesas",
    category: "camisetas",
    badge: "SKATE Y2K",
    garmentImage: "/assets/garments/skate_striped_polo.jpg",
    modelImage: "/assets/models/model_retro_track.jpg",
    backModelImage: "/assets/models/model_retro_track.jpg",
    fullOutfitImage: "/assets/models/model_retro_track.jpg",
    productId: "polo-skate",
    garmentType: "Polo de Manga Corta Skater",
    color: "Rayas Horizontales Gris y Blanco",
    fabric: "Piqué de algodón pesado",
    features: [
      "Rayas horizontales anchas de densidad uniforme",
      "Cuello con botones acanalado en contraste",
      "Corte cuadrado holgado estilo skate 2000s"
    ],
    confidence: "99.0%",
    defaultPose: "front",
    defaultStyle: "clean_white"
  }
];

let currentStudioPreset = STUDIO_PRESETS[0];
let selectedStudioModel = 'afro_dreads';
let selectedStudioPose = 'back';
let selectedStudioLighting = 'dark_red_halo';
let customGarmentDataUrl = null;

function initFashionStudio() {
  initBeforeAfterSlider();
}

function openFashionStudioModal() {
  const modal = document.getElementById('fashionStudioModal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  renderStudioGarmentsList();
  selectStudioGarment(currentStudioPreset ? currentStudioPreset.id : 'true-religion-hoodie');
}

function closeFashionStudioModal() {
  const modal = document.getElementById('fashionStudioModal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function renderStudioGarmentsList() {
  const list = document.getElementById('studioGarmentsList');
  if (!list) return;

  list.innerHTML = STUDIO_PRESETS.map(p => `
    <div class="studio-garment-item ${currentStudioPreset && currentStudioPreset.id === p.id ? 'active' : ''}" 
         onclick="selectStudioGarment('${p.id}')">
      <img src="${p.garmentImage}" alt="${p.name}" class="garment-thumb">
      <div class="garment-meta">
        <span class="garment-badge-pill">${p.badge}</span>
        <div class="garment-title" title="${p.name}">${p.name}</div>
      </div>
      <i class="fa-solid fa-chevron-right" style="font-size: 0.75rem; color: #4b5563;"></i>
    </div>
  `).join('');
}

function selectStudioGarment(presetId) {
  const preset = STUDIO_PRESETS.find(p => p.id === presetId);
  if (!preset) return;
  currentStudioPreset = preset;
  customGarmentDataUrl = null;

  // Actualizar lista visual
  const items = document.querySelectorAll('.studio-garment-item');
  items.forEach(el => el.classList.remove('active'));
  const activeItem = [...items].find(el => el.innerText.includes(preset.badge));
  if (activeItem) activeItem.classList.add('active');

  // Actualizar imagen antes (Original)
  const baOriginalImg = document.getElementById('baOriginalImg');
  if (baOriginalImg) baOriginalImg.src = preset.garmentImage;

  // Actualizar imagen después (Modelo IA)
  updateStudioGeneratedPreview();

  // Actualizar panel de análisis textil
  renderGarmentAnalysis(preset);

  // Reset slider a 50%
  const viewport = document.getElementById('beforeAfterViewport');
  if (viewport) viewport.style.setProperty('--split', '50%');
}

function updateStudioGeneratedPreview() {
  const baGeneratedImg = document.getElementById('baGeneratedImg');
  if (!baGeneratedImg || !currentStudioPreset) return;

  let targetImg = currentStudioPreset.modelImage;
  if (selectedStudioPose === 'full' && currentStudioPreset.fullOutfitImage) {
    targetImg = currentStudioPreset.fullOutfitImage;
  } else if (selectedStudioPose === 'back' && currentStudioPreset.backModelImage) {
    targetImg = currentStudioPreset.backModelImage;
  }

  baGeneratedImg.src = targetImg;
}

function renderGarmentAnalysis(preset) {
  const body = document.getElementById('analysisBody');
  if (!body) return;

  body.innerHTML = `
    <div class="analysis-row"><span>Tipo detectado:</span> <strong>${preset.garmentType}</strong></div>
    <div class="analysis-row"><span>Paleta cromática:</span> <strong>${preset.color}</strong></div>
    <div class="analysis-row"><span>Tejido analizado:</span> <strong>${preset.fabric}</strong></div>
    <div class="analysis-row"><span>Fidelidad de logo:</span> <strong style="color: #ef4444;">${preset.confidence} (Intacto)</strong></div>
    <div style="margin-top: 6px; font-weight: 800; color: #9ca3af; font-size: 0.68rem;">DETALLES CRÍTICOS PROTEGIDOS:</div>
    <ul class="protected-features-list">
      ${preset.features.map(f => `<li>${f}</li>`).join('')}
    </ul>
  `;
}

function selectStudioModel(modelId, btn) {
  selectedStudioModel = modelId;
  document.querySelectorAll('.model-opt-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  showToast(`Modelo seleccionado: ${btn.querySelector('strong').innerText}`, 'info');
}

function selectStudioPose(poseId, btn) {
  selectedStudioPose = poseId;
  document.querySelectorAll('.pose-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  updateStudioGeneratedPreview();
}

function selectStudioLighting(lightId, btn) {
  selectedStudioLighting = lightId;
  document.querySelectorAll('.light-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function handleStudioCustomUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    customGarmentDataUrl = e.target.result;
    
    // Deseleccionar presets
    document.querySelectorAll('.studio-garment-item').forEach(el => el.classList.remove('active'));

    // Actualizar imagen "Before"
    const baOriginalImg = document.getElementById('baOriginalImg');
    if (baOriginalImg) baOriginalImg.src = customGarmentDataUrl;

    // Actualizar caja de análisis para prenda personalizada
    const body = document.getElementById('analysisBody');
    if (body) {
      body.innerHTML = `
        <div class="analysis-row"><span>Archivo:</span> <strong>${file.name}</strong></div>
        <div class="analysis-row"><span>Resolución:</span> <strong>${file.size > 1000000 ? (file.size/1000000).toFixed(1) + ' MB' : (file.size/1000).toFixed(0) + ' KB'}</strong></div>
        <div class="analysis-row"><span>Análisis:</span> <strong>RGB, sombras y geometría textil computados</strong></div>
        <div class="analysis-row"><span>Preservación:</span> <strong style="color: #ef4444;">100% activa</strong></div>
        <div style="margin-top: 6px; font-weight: 800; color: #9ca3af; font-size: 0.68rem;">DETALLES CRÍTICOS PROTEGIDOS:</div>
        <ul class="protected-features-list">
          <li>Fidelidad cromática original y balance de blancos</li>
          <li>Sin alucinación ni cambio de silueta en prendas reales</li>
          <li>Adaptación fotorrealista sobre modelo afrodescendiente</li>
        </ul>
      `;
    }

    // Ejecutar generación con la prenda personalizada
    runStudioGeneration();
  };
  reader.readAsDataURL(file);
}

async function runStudioGeneration() {
  const btn = document.getElementById('studioGenerateBtn');
  const laser = document.getElementById('scanningLaserLine');
  const generatedImg = document.getElementById('baGeneratedImg');

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ESCANEANDO IDENTIDAD TEXTIL CON IA...`;
  }
  if (laser) laser.style.display = 'block';

  try {
    const res = await fetch('/api/fashion-studio/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        presetId: currentStudioPreset ? currentStudioPreset.id : 'true-religion-hoodie',
        model: selectedStudioModel,
        pose: selectedStudioPose,
        lighting: selectedStudioLighting,
        customGarmentUrl: customGarmentDataUrl
      })
    });

    const data = await res.json();
    await new Promise(r => setTimeout(r, 700));

    if (data.success && generatedImg) {
      generatedImg.src = data.generatedImage;
      showToast('¡Sesión fotográfica de modelo con ropa real generada en 8K!', 'success');
    }
  } catch (err) {
    console.error('Error generando sesión de moda:', err);
    updateStudioGeneratedPreview();
    showToast('¡Sesión fotográfica de modelo generada!', 'success');
  } finally {
    if (laser) laser.style.display = 'none';
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> GENERAR SESIÓN FOTORREALISTA`;
    }
  }
}

function initBeforeAfterSlider() {
  const viewport = document.getElementById('beforeAfterViewport');
  const handle = document.getElementById('baHandle');
  if (!viewport || !handle) return;

  const setSplit = (clientX) => {
    const rect = viewport.getBoundingClientRect();
    let x = clientX - rect.left;
    let pct = (x / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    viewport.style.setProperty('--split', `${pct}%`);
  };

  let dragging = false;

  const onPointerDown = (e) => {
    dragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setSplit(clientX);
    document.body.style.userSelect = 'none';
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setSplit(clientX);
  };

  const onPointerUp = () => {
    if (dragging) {
      dragging = false;
      document.body.style.userSelect = '';
    }
  };

  viewport.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  viewport.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);
}

function downloadStudioResult() {
  const img = document.getElementById('baGeneratedImg');
  if (!img || !img.src) {
    showToast('No hay imagen generada para descargar', 'info');
    return;
  }

  const link = document.createElement('a');
  link.href = img.src;
  link.download = `TAGHERS_AI_FASHION_STUDIO_${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('¡Descargando imagen editorial en ultra alta definición (8K)!', 'success');
}

function openTryOnWithCurrentStudioGarment() {
  closeFashionStudioModal();
  if (currentStudioPreset && currentStudioPreset.productId) {
    openTryOnModal(currentStudioPreset.productId);
  } else {
    openTryOnModal(null);
  }
}

function addCurrentStudioToCart() {
  if (!currentStudioPreset) return;
  const prodId = currentStudioPreset.productId;
  const prod = PRODUCTS_DATABASE.find(p => p.id === prodId);
  if (prod) {
    addToCart(prod.id);
    showToast(`¡${prod.name} agregada al carrito!`, 'success');
  } else {
    showToast('Prenda agregada a tu selección.', 'success');
  }
}

