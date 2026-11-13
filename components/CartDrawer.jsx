'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { formatCurrency } from '../lib/products';

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
    setIsCheckoutModalOpen
  } = useApp();

  const [couponInputText, setCouponInputText] = useState('');

  if (!isCartOpen) return null;

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

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    const itemsList = cart
      .map((item) => `• ${item.name} (Talle: ${item.size}) x${item.qty} = $${formatCurrency(item.price * item.qty)}`)
      .join('\n');

    const couponNote = coupon ? `\nCupón Aplicado: ${coupon.code} (-$${formatCurrency(discountAmount)})` : '';
    const message = encodeURIComponent(
      `¡Hola TAGHER'S! Quiero confirmar mi pedido:\n\n${itemsList}${couponNote}\n\n*Total a pagar:* $${formatCurrency(total)}\n\n¿Cuáles son los datos de envío y pago?`
    );

    window.open(`https://wa.me/5491123456789?text=${message}`, '_blank');
  };

  return (
    <>
      <div
        className="cart-drawer-overlay active"
        id="cartOverlay"
        onClick={() => setIsCartOpen(false)}
      />
      <aside className="cart-drawer active" id="cartDrawer">
        <div className="cart-header">
          <div className="cart-title">
            <i className="fa-solid fa-bag-shopping"></i>
            <span>TU CESTA ({totalCount})</span>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setIsCartOpen(false)}
            title="Cerrar carrito"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* LISTA DE ITEMS */}
        <div className="cart-items-container">
          {cart.length === 0 ? (
            <div className="empty-cart-state" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <i className="fa-solid fa-bag-shopping" style={{ fontSize: '3rem', opacity: 0.25, marginBottom: '16px' }}></i>
              <h4 style={{ fontWeight: 800, marginBottom: '8px' }}>Tu carrito está vacío</h4>
              <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '24px' }}>
                Explora el catálogo y añade tus prendas favoritas.
              </p>
              <button className="btn btn-dark" onClick={() => setIsCartOpen(false)}>
                EXPLORAR PRENDAS
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item-card" key={`${item.id}-${item.size}`}>
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <span className="cart-item-size">Talle: <b>{item.size}</b></span>
                  <div className="cart-item-bottom">
                    <span className="cart-item-price">${formatCurrency(item.price)}</span>
                    <div className="cart-qty-controls">
                      <button onClick={() => updateCartQty(item.id, item.size, -1)}>
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateCartQty(item.id, item.size, 1)}>
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  className="cart-remove-item"
                  onClick={() => removeFromCart(item.id, item.size)}
                  title="Eliminar de la cesta"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            ))
          )}
        </div>

        {/* FOOTER DEL CARRITO */}
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="coupon-box">
              <input
                type="text"
                placeholder="Código de descuento (ej. TAGHERS10)"
                value={couponInputText}
                onChange={(e) => setCouponInputText(e.target.value)}
              />
              <button onClick={handleApplyCoupon}>APLICAR</button>
            </div>

            {coupon && (
              <div className="coupon-applied-alert" style={{ display: 'flex' }}>
                <span>✓ Cupón {coupon.code} aplicado ({coupon.discountPercent}% OFF)</span>
                <button onClick={removeCouponCode}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
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

            <button className="btn btn-primary btn-block checkout-btn" onClick={handleCheckoutModal}>
              FINALIZAR COMPRA
            </button>
            <button className="btn btn-whatsapp btn-block" onClick={handleWhatsAppCheckout}>
              <i className="fa-brands fa-whatsapp"></i> FINALIZAR POR WHATSAPP
            </button>
            <button
              className="btn btn-sm btn-outline btn-block mt-2"
              onClick={() => setIsCartOpen(false)}
            >
              SEGUIR COMPRANDO
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
