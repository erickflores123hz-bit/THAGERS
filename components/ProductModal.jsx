'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../lib/context';
import { formatCurrency } from '../lib/products';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductModal() {
  const {
    isProductModalOpen,
    setIsProductModalOpen,
    selectedProduct,
    recommendedSize,
    addToCart,
    openSmartSizerModal,
    openTryOnModal,
    setIsCheckoutModalOpen
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

  const images = selectedProduct?.images && selectedProduct.images.length > 0
    ? selectedProduct.images
    : selectedProduct ? [selectedProduct.image] : [];

  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, selectedSize, qty);
    setIsProductModalOpen(false);
  };

  const handleBuyNow = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, selectedSize, qty);
    setIsProductModalOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const sizes = selectedProduct?.category === 'accesorios' ? ['Única'] : ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <AnimatePresence>
      {isProductModalOpen && selectedProduct && (
        <div className="modal-overlay active" id="productModal" style={{ zIndex: 1100 }}>
          {/* BACKDROP BLUR OSCURECIDO */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60"
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            onClick={() => setIsProductModalOpen(false)}
          />

          {/* TARJETA MODAL CON ENTRADA SUAVE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="modal-card modal-product-detail"
            style={{ position: 'relative', zIndex: 10 }}
          >
            <motion.button
              className="modal-close-btn"
              onClick={() => setIsProductModalOpen(false)}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
              title="Cerrar modal"
            >
              <i className="fa-solid fa-xmark"></i>
            </motion.button>

            <div className="product-detail-layout">
              {/* GALERÍA / CARRUSEL */}
              <div className="product-gallery">
                <div className="carousel-main-container">
                  {images.length > 1 && (
                    <motion.button
                      className="carousel-nav-btn prev"
                      onClick={handlePrevImage}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Foto anterior"
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </motion.button>
                  )}

                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImageIdx}
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0.7 }}
                      transition={{ duration: 0.22 }}
                      src={images[activeImageIdx]}
                      alt={`${selectedProduct.name} - Vista ${activeImageIdx + 1}`}
                    />
                  </AnimatePresence>

                  {images.length > 1 && (
                    <motion.button
                      className="carousel-nav-btn next"
                      onClick={handleNextImage}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Foto siguiente"
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </motion.button>
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

                {/* MINIATURAS INTERACTIVAS CON FEEDBACK */}
                {images.length > 1 && (
                  <div className="carousel-thumbnails-row">
                    {images.map((imgUrl, idx) => (
                      <motion.div
                        key={idx}
                        className={`thumb-btn ${idx === activeImageIdx ? 'active' : ''}`}
                        onClick={() => setActiveImageIdx(idx)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                      >
                        <img src={imgUrl} alt={`Miniatura ${idx + 1}`} />
                      </motion.div>
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

                {/* SELECTOR DE TALLA CON FEEDBACK TÁCTIL */}
                <div className="selector-group">
                  <div className="size-header-row">
                    <label>SELECCIONA TALLA:</label>
                    <button className="size-guide-link" onClick={openSmartSizerModal}>
                      ¿Cuál es mi talla ideal?
                    </button>
                  </div>
                  <div className="size-options">
                    {sizes.map((s) => (
                      <motion.button
                        key={s}
                        className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                        onClick={() => setSelectedSize(s)}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.92 }}
                        transition={{ duration: 0.12 }}
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* SELECTOR DE CANTIDAD */}
                <div className="quantity-row">
                  <label>CANTIDAD:</label>
                  <div className="qty-counter">
                    <motion.button
                      onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                    >
                      <i className="fa-solid fa-minus"></i>
                    </motion.button>
                    <span>{qty}</span>
                    <motion.button
                      onClick={() => setQty((prev) => prev + 1)}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </motion.button>
                  </div>
                </div>

                {/* BOTONES DE ACCIÓN CON MICRO-INTERACCIONES */}
                <div className="detail-actions">
                  {selectedProduct?.category !== 'accesorios' && (
                    <motion.button
                      type="button"
                      className="btn btn-outline btn-block"
                      style={{ borderColor: '#34d399', color: '#34d399' }}
                      onClick={() => {
                        setIsProductModalOpen(false);
                        openTryOnModal(selectedProduct);
                      }}
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(52, 211, 153, 0.1)' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <i className="fa-solid fa-wand-magic-sparkles mr-1"></i> PROBAR EN MI CUERPO CON IA
                    </motion.button>
                  )}

                  <motion.button
                    className="btn btn-primary btn-block"
                    onClick={handleBuyNow}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                  >
                    <i className="fa-solid fa-bolt"></i> COMPRAR AHORA
                  </motion.button>
                  <motion.button
                    className="btn btn-outline btn-block"
                    onClick={handleAddToCart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                  >
                    <i className="fa-solid fa-bag-shopping"></i> AÑADIR AL CARRITO
                  </motion.button>
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
