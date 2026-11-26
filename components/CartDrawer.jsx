'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { formatCurrency } from '../lib/products';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQty,
    coupon,
    applyCouponCode,
    removeCouponCode,
    setIsCheckoutModalOpen,
    products,
    addToCart
  } = useApp();

  const [couponInputText, setCouponInputText] = useState('');

  const recommendedForCart = React.useMemo(() => {
    if (!products || products.length === 0) return null;
    return products.find((p) => !cart.some((c) => c.id === p.id)) || products[0];
  }, [products, cart]);

  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = coupon ? Math.round((subtotal * coupon.discountPercent) / 100) : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = () => {
    if (applyCouponCode(couponInputText)) {
      setCouponInputText('');
    }
  };

  const handleCheckoutModal = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* FONDO OSCURECIDO CON DESENFOQUE ELEGANTE (BACKDROP BLUR) */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="cart-drawer-overlay active"
            id="cartOverlay"
            style={{
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              backgroundColor: 'rgba(0, 0, 0, 0.65)'
            }}
            onClick={() => setIsCartOpen(false)}
          />

          {/* PANEL DESLIZABLE (SLIDE-OVER SPRING DESDE LA DERECHA) */}
          <motion.aside
            key="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="cart-drawer active"
            id="cartDrawer"
          >
            <div className="cart-header">
              <div className="cart-title">
                <i className="fa-solid fa-bag-shopping"></i>
                <span>TU CESTA ({totalCount})</span>
              </div>
              <motion.button
                className="modal-close-btn"
                onClick={() => setIsCartOpen(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.15 }}
                title="Cerrar carrito"
              >
                <i className="fa-solid fa-xmark"></i>
              </motion.button>
            </div>

            {/* LISTA DE ITEMS CON ANIMACIÓN LIMPIA DE ENTRADA / SALIDA */}
            <div className="cart-items-container">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="empty-cart-state"
                  style={{ padding: '60px 20px', textAlign: 'center' }}
                >
                  <i className="fa-solid fa-bag-shopping" style={{ fontSize: '3rem', opacity: 0.25, marginBottom: '16px' }}></i>
                  <h4 style={{ fontWeight: 800, marginBottom: '8px' }}>Tu cesta está vacía</h4>
                  <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '24px' }}>
                    Explora el catálogo y añade tus prendas streetwear favoritas.
                  </p>
                  <motion.button
                    className="btn btn-dark"
                    onClick={() => setIsCartOpen(false)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    EXPLORAR PRENDAS
                  </motion.button>
                </motion.div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {cart.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size}`}
                      layout
                      initial={{ opacity: 0, x: 25 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -35, height: 0, marginBottom: 0, paddingBottom: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="cart-item-card"
                    >
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <span className="cart-item-size">Talle: <b>{item.size}</b></span>
                        <div className="cart-item-bottom">
                          <span className="cart-item-price">${formatCurrency(item.price)}</span>
                          <div className="cart-qty-controls">
                            <motion.button
                              onClick={() => updateCartQty(item.id, item.size, -1)}
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.85 }}
                            >
                              <i className="fa-solid fa-minus"></i>
                            </motion.button>
                            <span>{item.qty}</span>
                            <motion.button
                              onClick={() => updateCartQty(item.id, item.size, 1)}
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.85 }}
                            >
                              <i className="fa-solid fa-plus"></i>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                      
                      <motion.button
                        className="cart-remove-item"
                        onClick={() => removeFromCart(item.id, item.size)}
                        whileHover={{ scale: 1.15, color: '#e63946' }}
                        whileTap={{ scale: 0.85 }}
                        title="Eliminar de la cesta"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* FOOTER DEL CARRITO */}
            {cart.length > 0 && (
              <div className="cart-footer">
                {/* COMPLETA TU OUTFIT (SUGERIDO) */}
                {recommendedForCart && (
                  <div style={{ backgroundColor: '#141416', border: '1px solid #27272a', borderRadius: '10px', padding: '10px 12px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#e2c044', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                      <i className="fa-solid fa-wand-magic-sparkles"></i> COMPLETA TU OUTFIT (SUGERIDO)
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <img
                          src={recommendedForCart.image}
                          alt={recommendedForCart.name}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <h5 style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {recommendedForCart.name}
                          </h5>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2c044' }}>
                            ${formatCurrency(recommendedForCart.price)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          backgroundColor: '#e2c044',
                          color: '#000',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          border: 'none',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                        onClick={() => addToCart(recommendedForCart, recommendedForCart.sizes ? recommendedForCart.sizes[0] : 'L', 1)}
                      >
                        + AGREGAR
                      </button>
                    </div>
                  </div>
                )}

                <div className="coupon-box">
                  <input
                    type="text"
                    placeholder="Código (ej. TAGHERS10)"
                    value={couponInputText}
                    onChange={(e) => setCouponInputText(e.target.value)}
                  />
                  <motion.button
                    onClick={handleApplyCoupon}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                  >
                    APLICAR
                  </motion.button>
                </div>

                {coupon && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="coupon-applied-alert"
                    style={{ display: 'flex' }}
                  >
                    <span>Cupón {coupon.code} aplicado ({coupon.discountPercent}% OFF)</span>
                    <button onClick={removeCouponCode}>
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </motion.div>
                )}

                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>${formatCurrency(subtotal)}</span>
                </div>

                {coupon && (
                  <div className="cart-summary-row discount-row" style={{ display: 'flex' }}>
                    <span>Descuento ({coupon.discountPercent}%)</span>
                    <span>-${formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="cart-summary-row total-row">
                  <span>Total</span>
                  <span>${formatCurrency(total)}</span>
                </div>

                <motion.button
                  className="btn btn-primary btn-block checkout-btn"
                  onClick={handleCheckoutModal}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                >
                  <i className="fa-solid fa-lock"></i> FINALIZAR COMPRA
                </motion.button>

                <div className="cart-payment-badges" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', margin: '14px 0 6px', fontSize: '0.8rem', color: '#777' }}>
                  <span><i className="fa-regular fa-credit-card"></i> Tarjetas</span>
                  <span>•</span>
                  <span><i className="fa-solid fa-qrcode"></i> Mercado Pago</span>
                  <span>•</span>
                  <span><i className="fa-solid fa-shield-halved"></i> Pago Seguro</span>
                </div>

                <motion.button
                  className="btn btn-sm btn-outline btn-block mt-2"
                  onClick={() => setIsCartOpen(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  SEGUIR COMPRANDO
                </motion.button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
