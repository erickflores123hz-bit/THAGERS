'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../lib/context';
import { formatCurrency } from '../lib/products';

export default function ProductModal() {
  const {
    isProductModalOpen,
    setIsProductModalOpen,
    selectedProduct,
    recommendedSize,
    addToCart,
    openSmartSizerModal
  } = useApp();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('L');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (selectedProduct) {
      setActiveImageIdx(0);
      setSelectedSize(recommendedSize || 'L');
      setQty(1);
    }
  }, [selectedProduct, recommendedSize, isProductModalOpen]);

  if (!isProductModalOpen || !selectedProduct) return null;

  const images = selectedProduct.images && selectedProduct.images.length > 0
    ? selectedProduct.images
    : [selectedProduct.image];

  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedSize, qty);
    setIsProductModalOpen(false);
  };

  const handleBuyWhatsApp = () => {
    const text = encodeURIComponent(
      `¡Hola TAGHER'S! Me interesa comprar:\n- Prenda: ${selectedProduct.name}\n- Talle: ${selectedSize}\n- Cantidad: ${qty}\n- Precio: $${formatCurrency(selectedProduct.price * qty)}`
    );
    window.open(`https://wa.me/5491123456789?text=${text}`, '_blank');
  };

  const sizes = selectedProduct.category === 'accesorios' ? ['Única'] : ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="modal-overlay active" id="productModal">
      <div className="modal-card modal-product-detail">
        <button
          className="modal-close-btn"
          onClick={() => setIsProductModalOpen(false)}
          title="Cerrar modal"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="product-detail-layout">
          {/* GALERÍA / CARRUSEL */}
          <div className="product-gallery">
            <div className="carousel-main-container">
              {images.length > 1 && (
                <button
                  className="carousel-nav-btn prev"
                  onClick={handlePrevImage}
                  title="Foto anterior"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
              )}

              <img
                src={images[activeImageIdx]}
                alt={`${selectedProduct.name} - Vista ${activeImageIdx + 1}`}
              />

              {images.length > 1 && (
                <button
                  className="carousel-nav-btn next"
                  onClick={handleNextImage}
                  title="Foto siguiente"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              )}

              {selectedProduct.badge && (
                <div className="badge-tag">{selectedProduct.badge}</div>
              )}

              {images.length > 1 && (
                <div className="carousel-counter">
                  {activeImageIdx + 1} / {images.length}
                </div>
              )}
            </div>

            {/* MINIATURAS INTERACTIVAS */}
            {images.length > 1 && (
              <div className="carousel-thumbnails-row">
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className={`thumb-btn ${idx === activeImageIdx ? 'active' : ''}`}
                    onClick={() => setActiveImageIdx(idx)}
                  >
                    <img src={imgUrl} alt={`Miniatura ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PANEL DE DETALLES */}
          <div className="product-info-panel">
            <div className="brand-tag">TAGHER'S ARCHIVE 2026</div>
            <h2>{selectedProduct.name}</h2>

            <div className="product-price-row">
              <span className="price-current">${formatCurrency(selectedProduct.price)}</span>
              {selectedProduct.oldPrice && (
                <span className="price-old">${formatCurrency(selectedProduct.oldPrice)}</span>
              )}
            </div>

            <p className="product-desc">{selectedProduct.description}</p>

            {/* SELECTOR DE TALLA */}
            <div className="selector-group">
              <div className="size-header-row">
                <label>SELECCIONA TALLA:</label>
                <button className="size-guide-link" onClick={openSmartSizerModal}>
                  ¿Cuál es mi talla ideal?
                </button>
              </div>
              <div className="size-options">
                {sizes.map((s) => (
                  <button
                    key={s}
                    className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* SELECTOR DE CANTIDAD */}
            <div className="quantity-row">
              <label>CANTIDAD:</label>
              <div className="qty-counter">
                <button onClick={() => setQty((prev) => Math.max(1, prev - 1))}>
                  <i className="fa-solid fa-minus"></i>
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty((prev) => prev + 1)}>
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="detail-actions">
              <button className="btn btn-primary btn-block" onClick={handleAddToCart}>
                <i className="fa-solid fa-bag-shopping"></i> AÑADIR AL CARRITO
              </button>
              <button className="btn btn-whatsapp btn-block" onClick={handleBuyWhatsApp}>
                <i className="fa-brands fa-whatsapp"></i> COMPRAR POR WHATSAPP
              </button>
            </div>

            <div className="product-perks">
              <div className="perk">
                <i className="fa-solid fa-truck-fast"></i> Envíos express a todo el país
              </div>
              <div className="perk">
                <i className="fa-solid fa-shield-halved"></i> Garantía de autenticidad y cambios
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
