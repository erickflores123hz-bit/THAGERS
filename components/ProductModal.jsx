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
    setIsCheckoutModalOpen,
    products,
    addOutfitBundle
  } = useApp();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('L');
  const [qty, setQty] = useState(1);
  const [showMeasurementsTable, setShowMeasurementsTable] = useState(false);

  // Lógica de recomendación de outfit complementario (Match the Fit)
  const matchingProduct = React.useMemo(() => {
    if (!selectedProduct || !products || products.length <= 1) return null;
    const cat = selectedProduct.category;
    if (cat === 'sudaderas') {
      return products.find((p) => p.category === 'vaqueros') || products.find((p) => p.category === 'accesorios');
    } else if (cat === 'vaqueros') {
      return products.find((p) => p.category === 'sudaderas') || products.find((p) => p.category === 'camisetas');
    } else if (cat === 'camisetas') {
      return products.find((p) => p.category === 'accesorios') || products.find((p) => p.category === 'vaqueros');
    } else {
      return products.find((p) => p.category === 'sudaderas') || products[0];
    }
  }, [selectedProduct, products]);

  const bundleOriginalTotal = selectedProduct && matchingProduct ? selectedProduct.price + matchingProduct.price : 0;
  const bundleDiscountedTotal = Math.round(bundleOriginalTotal * 0.85); // 15% OFF
  const bundleSavings = bundleOriginalTotal - bundleDiscountedTotal;

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

  const sizes = selectedProduct?.sizes && selectedProduct.sizes.length > 0
    ? selectedProduct.sizes
    : selectedProduct?.category === 'accesorios' ? ['Única'] : ['S', 'M', 'L', 'XL', 'XXL'];

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
                <h2>{selectedProduct.name}</h2>

                <div style={{ margin: '12px 0 16px' }}>
                  {selectedProduct.oldPrice && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#71717a' }}>Precio de lista:</span>
                      <span style={{ fontSize: '0.95rem', color: '#71717a', textDecoration: 'line-through' }}>
                        ${formatCurrency(selectedProduct.oldPrice)}
                      </span>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '4px' }}>
                        {Math.round((1 - selectedProduct.price / selectedProduct.oldPrice) * 100)}% OFF
                      </span>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff' }}>
                      ${formatCurrency(selectedProduct.price)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>
                      Precio actualizado con descuento
                    </span>
                  </div>
                </div>

                {/* DETALLE ESPECÍFICO DE FINANCIACIÓN Y MEDIOS DE PAGO */}
                <div style={{ backgroundColor: '#141416', padding: '12px 14px', borderRadius: '10px', border: '1px solid #27272a', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '0.84rem', color: '#34d399', fontWeight: 700 }}>
                    <i className="fa-solid fa-building-columns" style={{ marginRight: '6px' }}></i>
                    <b>${formatCurrency(Math.round(selectedProduct.price * 0.9))}</b> abonando por Transferencia Bancaria <span style={{ color: '#10b981', fontWeight: 800 }}>(10% OFF EXTRA)</span>
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#e2c044', fontWeight: 600 }}>
                    <i className="fa-solid fa-credit-card" style={{ marginRight: '6px' }}></i>
                    Hasta <b>3 cuotas fijas sin interés</b> de <b>${formatCurrency(Math.round(selectedProduct.price / 3))}</b> con todas las tarjetas
                  </span>
                  {selectedProduct.oldPrice && (
                    <span style={{ fontSize: '0.74rem', color: '#a1a1aa' }}>
                      <i className="fa-solid fa-tag" style={{ marginRight: '6px', color: '#10b981' }}></i>
                      Ahorras <b>${formatCurrency(selectedProduct.oldPrice - selectedProduct.price)}</b> con este descuento oficial
                    </span>
                  )}
                </div>

                <p className="product-desc">{selectedProduct.description}</p>

                {/* SELECTOR DE TALLA CON FEEDBACK TÁCTIL */}
                <div className="selector-group">
                  <div className="size-header-row">
                    <label>SELECCIONA TALLA:</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="size-guide-link"
                        style={{ color: '#e2c044', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => setShowMeasurementsTable(!showMeasurementsTable)}
                      >
                        <i className="fa-solid fa-ruler-horizontal"></i>
                        <span>{showMeasurementsTable ? 'Ocultar medidas en cm' : 'Tabla de Medidas (cm)'}</span>
                      </button>
                      <button type="button" className="size-guide-link" onClick={openSmartSizerModal}>
                        Calcular talle
                      </button>
                    </div>
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

                  {/* TABLA TÉCNICA DE MEDIDAS EN CM Y FICHA DEL MODELO */}
                  {showMeasurementsTable && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        marginTop: '12px',
                        padding: '12px',
                        backgroundColor: '#121215',
                        border: '1px solid #27272a',
                        borderRadius: '10px'
                      }}
                    >
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#e2c044', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
                        <i className="fa-solid fa-table-cells" style={{ marginRight: '5px' }}></i>
                        MEDIDAS REALES DE LA PRENDA EN CENTÍMETROS (CM)
                      </span>

                      {selectedProduct.category === 'vaqueros' ? (
                        <table style={{ width: '100%', fontSize: '0.75rem', textAlign: 'center', borderCollapse: 'collapse', color: '#ddd' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
                              <th style={{ padding: '6px' }}>Talle</th>
                              <th style={{ padding: '6px' }}>Cintura</th>
                              <th style={{ padding: '6px' }}>Largo Total</th>
                              <th style={{ padding: '6px' }}>Botamanga Baggy</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { sz: 'S / 30', c: '38 cm', l: '104 cm', b: '26 cm' },
                              { sz: 'M / 32', c: '40 cm', l: '106 cm', b: '27 cm' },
                              { sz: 'L / 34', c: '42 cm', l: '108 cm', b: '28 cm' },
                              { sz: 'XL / 36', c: '44 cm', l: '110 cm', b: '29 cm' },
                              { sz: 'XXL / 38', c: '46 cm', l: '112 cm', b: '30 cm' }
                            ].map((row, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #1c1c20', backgroundColor: selectedSize === row.sz.split(' ')[0] ? 'rgba(226, 192, 68, 0.1)' : 'transparent' }}>
                                <td style={{ padding: '6px', fontWeight: 700, color: '#fff' }}>{row.sz}</td>
                                <td style={{ padding: '6px' }}>{row.c}</td>
                                <td style={{ padding: '6px' }}>{row.l}</td>
                                <td style={{ padding: '6px', color: '#10b981', fontWeight: 700 }}>{row.b}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : selectedProduct.category === 'accesorios' ? (
                        <div style={{ fontSize: '0.78rem', color: '#ccc', padding: '6px 0' }}>
                          • <b>Cadena:</b> 55 cm de largo total, eslabones reforzados de 14 mm.<br />
                          • <b>Anillos:</b> Diámetros disponibles 18 mm, 20 mm y 22 mm en fundición pesada.
                        </div>
                      ) : (
                        <table style={{ width: '100%', fontSize: '0.75rem', textAlign: 'center', borderCollapse: 'collapse', color: '#ddd' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
                              <th style={{ padding: '6px' }}>Talle</th>
                              <th style={{ padding: '6px' }}>Pecho (Sisa)</th>
                              <th style={{ padding: '6px' }}>Largo Total</th>
                              <th style={{ padding: '6px' }}>Largo Manga</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { sz: 'S', p: '58 cm', l: '68 cm', m: '60 cm' },
                              { sz: 'M', p: '62 cm', l: '71 cm', m: '62 cm' },
                              { sz: 'L', p: '66 cm', l: '74 cm', m: '64 cm' },
                              { sz: 'XL', p: '70 cm', l: '77 cm', m: '66 cm' },
                              { sz: 'XXL', p: '74 cm', l: '80 cm', m: '68 cm' }
                            ].map((row, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #1c1c20', backgroundColor: selectedSize === row.sz ? 'rgba(226, 192, 68, 0.1)' : 'transparent' }}>
                                <td style={{ padding: '6px', fontWeight: 700, color: '#fff' }}>{row.sz}</td>
                                <td style={{ padding: '6px', color: '#10b981', fontWeight: 700 }}>{row.p}</td>
                                <td style={{ padding: '6px' }}>{row.l}</td>
                                <td style={{ padding: '6px' }}>{row.m}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {/* FICHA TÉCNICA DEL MODELO */}
                      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #222', fontSize: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e2c044', fontWeight: 800, marginBottom: '2px' }}>
                          <i className="fa-solid fa-person"></i>
                          <span>FICHA DE REFERENCIA DEL MODELO</span>
                        </div>
                        <p style={{ margin: 0, color: '#d4d4d8' }}>
                          El modelo en foto mide <b>1.84 m</b>, pesa <b>78 kg</b> y viste <b>talle L</b> (Corte Baggy Oversize).
                        </p>
                        <span style={{ fontSize: '0.7rem', color: '#888', display: 'block', marginTop: '2px' }}>
                          Calce amplio auténtico. Elige tu talle regular o uno superior para look ultra suelto 90s.
                        </span>
                      </div>
                    </motion.div>
                  )}
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

                {/* COMPLETA TU OUTFIT (MATCH THE FIT / BUNDLE VENTA CRUZADA) */}
                {matchingProduct && (
                  <div style={{ marginTop: '20px', padding: '16px', borderRadius: '12px', backgroundColor: '#121215', border: '1px solid #27272a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#e2c044', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="fa-solid fa-wand-magic-sparkles"></i> COMPLETA TU OUTFIT (MATCH THE FIT)
                      </span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, backgroundColor: 'rgba(226, 192, 68, 0.15)', color: '#e2c044', padding: '2px 6px', borderRadius: '4px' }}>
                        15% OFF EN COMBO
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: '#09090b', padding: '10px', borderRadius: '8px', border: '1px solid #1e1e22', marginBottom: '12px' }}>
                      <img
                        src={matchingProduct.image}
                        alt={matchingProduct.name}
                        style={{ width: '54px', height: '54px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h5 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#fff', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          + {matchingProduct.name}
                        </h5>
                        <div style={{ fontSize: '0.72rem', color: '#aaa' }}>
                          Talles: {matchingProduct.sizes ? matchingProduct.sizes.join(', ') : 'Único'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#e2c044' }}>
                            ${formatCurrency(Math.round(matchingProduct.price * 0.85))}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#666', textDecoration: 'line-through' }}>
                            ${formatCurrency(matchingProduct.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '0.78rem' }}>
                      <span style={{ color: '#aaa' }}>Total combo con 15% OFF:</span>
                      <div>
                        <span style={{ fontSize: '1rem', fontWeight: 900, color: '#fff' }}>
                          ${formatCurrency(bundleDiscountedTotal)}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#10b981', marginLeft: '6px', fontWeight: 700 }}>
                          (Ahorras ${formatCurrency(bundleSavings)})
                        </span>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      className="btn btn-primary btn-block btn-sm"
                      style={{
                        backgroundColor: '#e2c044',
                        color: '#000',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        padding: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      onClick={() => {
                        addOutfitBundle(selectedProduct, matchingProduct, 15);
                        setIsProductModalOpen(false);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <i className="fa-solid fa-plus-circle"></i> AÑADIR OUTFIT COMPLETO (2 PRENDAS)
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
