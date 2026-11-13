'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { formatCurrency } from '../lib/products';
import confetti from 'canvas-confetti';

export default function CheckoutModal() {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    coupon,
    createOrder,
    user
  } = useApp();

  const [name, setName] = useState(user ? user.name : '');
  const [phone, setPhone] = useState(user ? user.phone || '' : '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Buenos Aires');
  const [postal, setPostal] = useState('C1425');
  const [payMethod, setPayMethod] = useState('card');
  const [createdOrder, setCreatedOrder] = useState(null);

  if (!isCheckoutModalOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = coupon ? Math.round((subtotal * coupon.discountPercent) / 100) : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    const newOrder = createOrder({
      name,
      phone,
      address,
      city,
      postal,
      paymentMethod: payMethod,
      total
    });

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    setCreatedOrder(newOrder);
  };

  const handleFinish = () => {
    setIsCheckoutModalOpen(false);
    setCreatedOrder(null);
  };

  return (
    <div className="modal-overlay active" id="checkoutModal">
      <div className="modal-card modal-checkout">
        <button
          className="modal-close-btn"
          onClick={() => setIsCheckoutModalOpen(false)}
          title="Cerrar checkout"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {!createdOrder ? (
          <div>
            <h3>FINALIZAR TU PEDIDO</h3>
            <p className="checkout-sub">Completa los datos de envío y pago para confirmar tu orden.</p>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre y Apellido</label>
                  <input
                    type="text"
                    required
                    placeholder="Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    required
                    placeholder="+54 9 11 2345-6789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Dirección de Envío</label>
                <input
                  type="text"
                  required
                  placeholder="Calle, Número, Piso/Depto"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ciudad</label>
                  <input
                    type="text"
                    required
                    placeholder="Buenos Aires"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Código Postal</label>
                  <input
                    type="text"
                    required
                    placeholder="C1425"
                    value={postal}
                    onChange={(e) => setPostal(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Método de Pago</label>
                <div className="payment-methods-grid">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payMethod"
                      value="card"
                      checked={payMethod === 'card'}
                      onChange={(e) => setPayMethod(e.target.value)}
                    />
                    <span>
                      <i className="fa-regular fa-credit-card"></i> Tarjeta de Crédito/Débito
                    </span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payMethod"
                      value="mp"
                      checked={payMethod === 'mp'}
                      onChange={(e) => setPayMethod(e.target.value)}
                    />
                    <span>
                      <i className="fa-solid fa-qrcode"></i> Mercado Pago / Transferencia
                    </span>
                  </label>
                </div>
              </div>

              <div className="checkout-summary-box">
                <div className="summary-line">
                  <span>Total a Pagar:</span>
                  <strong>${formatCurrency(total)}</strong>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block checkout-submit-btn">
                CONFIRMAR Y PAGAR ORDEN
              </button>
            </form>
          </div>
        ) : (
          <div className="success-ticket">
            <div className="success-icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h2>¡ORDEN CONFIRMADA!</h2>
            <p>
              Tu pedido ha sido procesado con éxito y registrado en la base de datos de <b>TAGHER'S</b>.
            </p>
            <div className="ticket-details">
              <div className="ticket-row">
                <span>Número de Orden:</span>
                <b>#{createdOrder.id}</b>
              </div>
              <div className="ticket-row">
                <span>Cliente:</span>
                <span>{createdOrder.customer}</span>
              </div>
              <div className="ticket-row">
                <span>Total Abonado:</span>
                <b>${formatCurrency(createdOrder.total)}</b>
              </div>
              <div className="ticket-row">
                <span>Estado:</span>
                <span className="badge-status">{createdOrder.status}</span>
              </div>
            </div>
            <p className="ticket-note">
              Recibirás un correo con el código de seguimiento en cuanto tu paquete sea despachado.
            </p>
            <button className="btn btn-primary btn-block" onClick={handleFinish}>
              VOLVER A LA TIENDA
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
