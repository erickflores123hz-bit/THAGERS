'use client';

import React from 'react';
import { useApp } from '../lib/context';
import { formatCurrency } from '../lib/products';
import { motion, AnimatePresence } from 'framer-motion';

export default function Catalog() {
  const {
    products,
    activeCategory,
    setActiveCategory,
    searchQuery,
    sortBy,
    setSortBy,
    openProductModal,
    addToCart,
    selectedSizes,
    toggleSizeFilter,
    maxPrice,
    setMaxPrice,
    clearAllFilters
  } = useApp();

  // Categorías y títulos
  const categoryTitles = {
    todos: 'TODO EL CATÁLOGO',
    ropa: 'ROPA & INDUMENTARIA',
    vaqueros: 'VAQUEROS & BAGGY PANTS',
    camisetas: 'CAMISETAS, POLOS & REMERAS',
    sudaderas: 'SUDADERAS, HOODIES & CAMPERAS',
    chandals: 'CHÁNDALS & TRACK JACKETS',
    accesorios: 'ACCESORIOS, CADENAS & ANILLOS',
    cadenas: 'CADENAS & COLLARES',
    pulseras: 'PULSERAS & TACHAS',
    anillos: 'ANILLOS VINTAGE',
    cinturones: 'CINTURONES PUNK & Y2K',
    ofertas: 'OFERTAS & LIQUIDACIÓN'
  };

  const categoriesList = [
    { key: 'todos', label: 'Todos' },
    { key: 'vaqueros', label: 'Vaqueros Baggy' },
    { key: 'camisetas', label: 'Camisetas & Polos' },
    { key: 'sudaderas', label: 'Sudaderas & Camperas' },
    { key: 'accesorios', label: 'Accesorios' },
    { key: 'ofertas', label: 'Ofertas' }
  ];

  // Filtrado
  let filtered = products.filter((p) => {
    if (activeCategory === 'todos') return true;
    if (activeCategory === 'ofertas') return Boolean(p.isOffer);
    if (activeCategory === 'ropa') {
      return ['vaqueros', 'camisetas', 'sudaderas', 'chandals'].includes(p.category);
    }
    if (p.category === activeCategory) return true;
    if (p.subCategory === activeCategory) return true;
    return false;
  });

  // Búsqueda
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.badge && p.badge.toLowerCase().includes(q))
    );
  }

  // Ordenamiento
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'newest') return (b.unitsSold || 0) - (a.unitsSold || 0);
    return 0;
  });

  return (
    <main className="catalog-section" id="catalogSection">
      <div className="catalog-header">
        <div className="catalog-title-group">
          <h2 className="section-title" id="currentCategoryTitle">
            {categoryTitles[activeCategory] || 'CATÁLOGO'}
          </h2>
          <span className="catalog-count" id="productCountText">
            {sorted.length} {sorted.length === 1 ? 'prenda disponible' : 'prendas disponibles'}
          </span>
        </div>

        {/* FILTROS Y ORDENAMIENTO */}
        <div className="catalog-controls">
          <div className="category-pills" id="categoryPills">
            {categoriesList.map((cat) => (
              <motion.button
                key={cat.key}
                className={`pill ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.key)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15 }}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>

          <div className="sort-wrapper">
            <label htmlFor="sortSelect">Ordenar por:</label>
            <select
              id="sortSelect"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Destacados</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="newest">Más Vendidos / Nuevos</option>
            </select>
          </div>
        </div>
      </div>

      {/* GRILLA DE PRODUCTOS CON REORDENAMIENTO FLUIDO (LAYOUT ANIMATION) */}
      {sorted.length > 0 ? (
        <motion.div layout className="products-grid" id="productsGrid">
          <AnimatePresence mode="popLayout">
            {sorted.map((product) => {
              const isLowStock = product.stock <= 5;
              const primaryImage = product.image || (product.images && product.images[0]);
              const secondaryImage = product.images && product.images.length > 1 ? product.images[1] : null;

              return (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="product-card group"
                  whileHover={{ y: -5 }}
                >
                  {/* CONTENEDOR DE IMAGEN CON HOVER INTELIGENTE & CROSSFADE */}
                  <div
                    className="product-card-thumb relative overflow-hidden cursor-pointer"
                    onClick={() => openProductModal(product)}
                  >
                    {product.badge && (
                      <span className="product-badge">{product.badge}</span>
                    )}

                    {/* IMAGEN PRINCIPAL (CON ZOOM SUAVE) */}
                    <img
                      src={primaryImage}
                      alt={product.name}
                      loading="lazy"
                      className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
                        secondaryImage ? 'group-hover:opacity-0' : ''
                      }`}
                    />

                    {/* IMAGEN SECUNDARIA (CROSSFADE ELEGANTE AL PASAR EL MOUSE) */}
                    {secondaryImage && (
                      <img
                        src={secondaryImage}
                        alt={`${product.name} - Vista alternativa`}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-105 pointer-events-none"
                      />
                    )}
                  </div>

                  <div className="product-card-body">
                    {/* STOCK Y ORIGEN */}
                    <div className="product-brand-line">
                      <span>TAGHER'S ARCHIVE</span>
                      {isLowStock ? (
                        <span className="stock-pill low">Stock limitado ({product.stock} u.)</span>
                      ) : (
                        <span className="stock-pill in-stock">{product.stock} disponibles</span>
                      )}
                    </div>

                    {/* TALLES DISPONIBLES DE LA PRENDA */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: '6px 0 8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Talles:
                      </span>
                      {(product.sizes || (product.category === 'accesorios' ? ['Único'] : ['S', 'M', 'L', 'XL'])).map((sz) => (
                        <span
                          key={sz}
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#18181b',
                            border: '1px solid #333',
                            color: '#f4f4f5'
                          }}
                        >
                          {sz}
                        </span>
                      ))}
                    </div>

                    {/* NOMBRE CONCISO DE LA PRENDA */}
                    <h3
                      className="product-card-title cursor-pointer transition-colors duration-200 hover:text-white"
                      onClick={() => openProductModal(product)}
                      style={{ fontSize: '1rem', fontWeight: 800, margin: '2px 0 8px', lineHeight: 1.3 }}
                    >
                      {product.name}
                    </h3>

                    {/* PRECIOS ESPECÍFICOS Y FORMAS DE PAGO */}
                    <div style={{ margin: '8px 0 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>
                          ${formatCurrency(product.price)}
                        </span>
                        {product.oldPrice && (
                          <>
                            <span style={{ fontSize: '0.85rem', color: '#71717a', textDecoration: 'line-through' }}>
                              ${formatCurrency(product.oldPrice)}
                            </span>
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '2px 6px', borderRadius: '4px' }}>
                              {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>

                      {/* CONDICIONES DE PAGO ESPECÍFICAS */}
                      <div style={{ marginTop: '5px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '0.74rem', color: '#e2c044', fontWeight: 700 }}>
                          <i className="fa-solid fa-credit-card" style={{ marginRight: '5px', fontSize: '0.68rem' }}></i>
                          3 cuotas fijas de <b>${formatCurrency(Math.round(product.price / 3))}</b> sin interés
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>
                          <i className="fa-solid fa-building-columns" style={{ marginRight: '5px', fontSize: '0.68rem' }}></i>
                          <b>${formatCurrency(Math.round(product.price * 0.9))}</b> abonando por transferencia
                        </span>
                      </div>
                    </div>

                    <div className="product-card-actions">
                      <motion.button
                        className="btn btn-sm btn-outline"
                        onClick={() => openProductModal(product)}
                        whileHover={{ scale: 1.025 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                      >
                        DETALLES
                      </motion.button>
                      
                      <motion.button
                        className="btn btn-sm btn-primary"
                        onClick={() => addToCart(product)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.94 }}
                        transition={{ duration: 0.15 }}
                      >
                        <i className="fa-solid fa-bag-shopping"></i> AÑADIR
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="empty-state" id="emptyState" style={{ display: 'flex' }}>
          <i className="fa-solid fa-ghost"></i>
          <h3>No encontramos resultados</h3>
          <p>Intenta con otra palabra clave o selecciona otra categoría.</p>
          <motion.button
            className="btn btn-dark"
            onClick={() => setActiveCategory('todos')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            RESTAURAR FILTROS
          </motion.button>
        </div>
      )}
    </main>
  );
}
