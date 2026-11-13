'use client';

import React from 'react';
import { useApp } from '../lib/context';
import { formatCurrency } from '../lib/products';

export default function Catalog() {
  const {
    products,
    activeCategory,
    setActiveCategory,
    searchQuery,
    sortBy,
    setSortBy,
    wishlist,
    toggleWishlist,
    openProductModal,
    addToCart
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

  // Filtrado
  let filtered = products.filter((p) => {
    // Categoría
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
    // featured por defecto
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
            <button
              className={`pill ${activeCategory === 'todos' ? 'active' : ''}`}
              onClick={() => setActiveCategory('todos')}
            >
              Todos
            </button>
            <button
              className={`pill ${activeCategory === 'vaqueros' ? 'active' : ''}`}
              onClick={() => setActiveCategory('vaqueros')}
            >
              Vaqueros Baggy
            </button>
            <button
              className={`pill ${activeCategory === 'camisetas' ? 'active' : ''}`}
              onClick={() => setActiveCategory('camisetas')}
            >
              Camisetas & Polos
            </button>
            <button
              className={`pill ${activeCategory === 'sudaderas' ? 'active' : ''}`}
              onClick={() => setActiveCategory('sudaderas')}
            >
              Sudaderas & Camperas
            </button>
            <button
              className={`pill ${activeCategory === 'accesorios' ? 'active' : ''}`}
              onClick={() => setActiveCategory('accesorios')}
            >
              Accesorios
            </button>
            <button
              className={`pill ${activeCategory === 'ofertas' ? 'active' : ''}`}
              onClick={() => setActiveCategory('ofertas')}
            >
              🔥 Ofertas
            </button>
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

      {/* GRILLA DE PRODUCTOS */}
      {sorted.length > 0 ? (
        <div className="products-grid" id="productsGrid">
          {sorted.map((product) => {
            const isFav = wishlist.includes(product.id);
            const isLowStock = product.stock <= 5;

            return (
              <div className="product-card" key={product.id}>
                <div className="product-card-thumb">
                  {product.badge && (
                    <span className="product-badge">{product.badge}</span>
                  )}
                  <button
                    className={`wishlist-btn ${isFav ? 'active' : ''}`}
                    onClick={() => toggleWishlist(product.id)}
                    title={isFav ? "Eliminar de favoritos" : "Guardar en favoritos"}
                  >
                    <i className={isFav ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                  </button>

                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    onClick={() => openProductModal(product)}
                  />
                </div>

                <div className="product-card-body">
                  <div className="product-brand-line">
                    <span>TAGHER'S ARCHIVE</span>
                    {isLowStock ? (
                      <span className="stock-pill low">¡Últimas {product.stock} un.!</span>
                    ) : (
                      <span className="stock-pill in-stock">{product.stock} disponibles</span>
                    )}
                  </div>

                  <h3
                    className="product-card-title"
                    onClick={() => openProductModal(product)}
                  >
                    {product.name}
                  </h3>

                  <div className="product-card-price">
                    <span className="price-now">${formatCurrency(product.price)}</span>
                    {product.oldPrice && (
                      <span className="price-was">${formatCurrency(product.oldPrice)}</span>
                    )}
                  </div>

                  <div className="product-card-actions">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => openProductModal(product)}
                    >
                      DETALLES
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => addToCart(product)}
                    >
                      <i className="fa-solid fa-bag-shopping"></i> AÑADIR
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state" id="emptyState" style={{ display: 'flex' }}>
          <i className="fa-solid fa-ghost"></i>
          <h3>No encontramos resultados</h3>
          <p>Intenta con otra palabra clave o selecciona otra categoría.</p>
          <button className="btn btn-dark" onClick={() => setActiveCategory('todos')}>
            RESTAURAR FILTROS
          </button>
        </div>
      )}
    </main>
  );
}
