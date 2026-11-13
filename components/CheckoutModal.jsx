'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { formatCurrency } from '../lib/products';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [payMethod, setPayMethod] = useState('card'); // 'card' | 'mp' | 'transfer'
  
  // Datos de tarjeta didácticos
  const [cardNumber, setCardNumber] = useState('4509 8214 9301 2841');
  const [cardHolder, setCardHolder] = useState(user ? user.name : 'JUAN PÉREZ');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('742');
  const [installments, setInstallments] = useState('3');

  // Estado de procesamiento didáctico
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);

  if (!isCheckoutModalOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = coupon ? Math.round((subtotal * coupon.discountPercent) / 100) : 0;
  
  // Descuento extra del 10% si abona por transferencia
  const transferDiscount = payMethod === 'transfer' ? Math.round((subtotal - discountAmount) * 0.1) : 0;
  const total = Math.max(0, subtotal - discountAmount - transferDiscount);

  const installmentAmount = Math.round(total / parseInt(installments, 10));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    setIsProcessing(true);
    setProcessingMessage('Conectando con la pasarela de pagos segura...');

    setTimeout(() => {
      setProcessingMessage(
        payMethod === 'card'
          ? 'Autorizando transacción bancaria en 3 cuotas sin interés...'
          : payMethod === 'mp'
          ? 'Validando cobro con Mercado Pago Checkout...'
          : 'Generando comprobante de transferencia bancaria...'
      );
    }, 800);

    setTimeout(() => {
      let finalPayMethodName = 'Tarjeta de Crédito';
      if (payMethod === 'card') {
        finalPayMethodName = `Tarjeta de Crédito (${installments} cuotas sin interés de $${formatCurrency(installmentAmount)})`;
      } else if (payMethod === 'mp') {
        finalPayMethodName = 'Mercado Pago (Transferencia / QR)';
      } else {
        finalPayMethodName = 'Transferencia Bancaria (10% OFF)';
      }

      const newOrder = createOrder({
        name,
        phone,
        address,
        city,
        postal,
        paymentMethod: finalPayMethodName,
        total
      });

      setIsProcessing(false);
      setCreatedOrder(newOrder);

      try {
        confetti({
          particleCount: 120,
          spread: 85,
          origin: { y: 0.55 }
        });
      } catch (err) {}
    }, 1800);
  };

  const handleFinish = () => {
    setIsCheckoutModalOpen(false);
    setCreatedOrder(null);
  };

  return (
    <AnimatePresence>
      {isCheckoutModalOpen && (
        <div className="modal-overlay active" id="checkoutModal" style={{ zIndex: 1100 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60"
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            onClick={() => {
              if (!isProcessing) setIsCheckoutModalOpen(false);
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="modal-card modal-checkout"
            style={{ maxWidth: '640px', position: 'relative', zIndex: 10 }}
          >
            <motion.button
              className="modal-close-btn"
              onClick={() => {
                if (!isProcessing) {
                  setIsCheckoutModalOpen(false);
                }
              }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              title="Cerrar checkout"
              disabled={isProcessing}
            >
              <i className="fa-solid fa-xmark"></i>
            </motion.button>

        {isProcessing ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                border: '4px solid #eee',
                borderTopColor: '#000',
                borderRadius: '50%',
                margin: '0 auto 24px',
                animation: 'spin 0.8s linear infinite'
              }}
            ></div>
            <style jsx>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '10px' }}>PROCESANDO PAGO SEGURO</h3>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>{processingMessage}</p>
            <div style={{ marginTop: '24px', fontSize: '0.8rem', color: '#999' }}>
              <i className="fa-solid fa-lock"></i> Encriptación TLS de 256 bits garantizada
            </div>
          </div>
        ) : !createdOrder ? (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#e2c044', letterSpacing: '1px' }}>
                PASARELA DE PAGO OFICIAL
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '4px' }}>FINALIZAR PEDIDO</h3>
              <p className="checkout-sub" style={{ margin: 0 }}>
                Elige tu método de abono preferido y confirma tus datos de envío.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* DATOS DE ENVÍO */}
              <div style={{ backgroundColor: '#f9f9fa', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#444', display: 'block', marginBottom: '12px' }}>
                  <i className="fa-solid fa-truck-fast"></i> DATOS DE ENTREGA
                </span>
                
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
                    <label>Teléfono de Contacto</label>
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
                    placeholder="Calle, Número, Piso / Depto"
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
              </div>

              {/* MÉTODOS DE PAGO MULTI-OPCIÓN */}
              <div className="form-group">
                <label style={{ fontWeight: 800 }}>SELECCIONA FORMA DE ABONO:</label>
                
                {/* BOTONES SELECTORES DE FORMA DE PAGO */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', margin: '8px 0 16px' }}>
                  <button
                    type="button"
                    onClick={() => setPayMethod('card')}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '10px',
                      border: payMethod === 'card' ? '2px solid #000' : '1px solid #e0e0e0',
                      backgroundColor: payMethod === 'card' ? '#000' : '#fff',
                      color: payMethod === 'card' ? '#fff' : '#222',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <i className="fa-regular fa-credit-card" style={{ fontSize: '1.2rem' }}></i>
                    <span>Tarjetas</span>
                    <small style={{ fontSize: '0.68rem', opacity: 0.8 }}>3 y 6 Cuotas</small>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayMethod('mp')}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '10px',
                      border: payMethod === 'mp' ? '2px solid #009ee3' : '1px solid #e0e0e0',
                      backgroundColor: payMethod === 'mp' ? '#009ee3' : '#fff',
                      color: payMethod === 'mp' ? '#fff' : '#222',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <i className="fa-solid fa-qrcode" style={{ fontSize: '1.2rem' }}></i>
                    <span>Mercado Pago</span>
                    <small style={{ fontSize: '0.68rem', opacity: 0.8 }}>QR / Saldo</small>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayMethod('transfer')}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '10px',
                      border: payMethod === 'transfer' ? '2px solid #16a34a' : '1px solid #e0e0e0',
                      backgroundColor: payMethod === 'transfer' ? '#16a34a' : '#fff',
                      color: payMethod === 'transfer' ? '#fff' : '#222',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <i className="fa-solid fa-building-columns" style={{ fontSize: '1.2rem' }}></i>
                    <span>Transferencia</span>
                    <small style={{ fontSize: '0.68rem', opacity: 0.8 }}>10% OFF EXTRA</small>
                  </button>
                </div>

                {/* OPCIÓN 1: FORMULARIO DE TARJETA */}
                {payMethod === 'card' && (
                  <div style={{ backgroundColor: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#333' }}>
                        DATOS DE LA TARJETA (CRÉDITO O DÉBITO)
                      </span>
                      <div style={{ display: 'flex', gap: '6px', color: '#666', fontSize: '1rem' }}>
                        <i className="fa-brands fa-cc-visa" title="Visa"></i>
                        <i className="fa-brands fa-cc-mastercard" title="Mastercard"></i>
                        <i className="fa-brands fa-cc-amex" title="American Express"></i>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '10px' }}>
                      <label style={{ fontSize: '0.75rem' }}>Número de Tarjeta</label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        maxLength={19}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '10px' }}>
                      <label style={{ fontSize: '0.75rem' }}>Nombre del Titular</label>
                      <input
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        placeholder="COMO FIGURA EN EL PLÁSTICO"
                      />
                    </div>

                    <div className="form-row" style={{ marginBottom: '10px' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '0.75rem' }}>Vencimiento (MM/AA)</label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="08/28"
                          maxLength={5}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.75rem' }}>Código CVV</label>
                        <input
                          type="password"
                          required
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '0.75rem' }}>Plan de Cuotas</label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid #ccc',
                          backgroundColor: '#fff',
                          fontWeight: 600,
                          fontSize: '0.85rem'
                        }}
                      >
                        <option value="1">1 cuota de ${formatCurrency(total)} (Sin interés)</option>
                        <option value="3">3 cuotas fijas de ${formatCurrency(Math.round(total / 3))} (Sin interés)</option>
                        <option value="6">6 cuotas fijas de ${formatCurrency(Math.round(total / 6))} (Sin interés - Más elegida)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* OPCIÓN 2: MERCADO PAGO */}
                {payMethod === 'mp' && (
                  <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontWeight: 800, fontSize: '1rem', marginBottom: '6px' }}>
                      <i className="fa-solid fa-qrcode"></i> MERCADO PAGO CHECKOUT
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '12px' }}>
                      Podrás abonar al instante escaneando el código QR oficial de <b>TAGHER'S</b> con tu app de Mercado Pago o con tu saldo en cuenta.
                    </p>
                    <div style={{ backgroundColor: '#fff', border: '1px dashed #0284c7', padding: '10px 14px', borderRadius: '8px', display: 'inline-block', fontSize: '0.85rem' }}>
                      <span>Alias MP: <b>TAGHERS.STREET.MP</b></span>
                      <br />
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>CVU: 0000003100084920194821</span>
                    </div>
                  </div>
                )}

                {/* OPCIÓN 3: TRANSFERENCIA BANCARIA DIRECTA */}
                {payMethod === 'transfer' && (
                  <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 800, fontSize: '0.95rem', marginBottom: '6px' }}>
                      <i className="fa-solid fa-circle-check"></i> 10% DE DESCUENTO EXTRA APLICADO
                    </div>
                    <p style={{ fontSize: '0.83rem', color: '#334155', marginBottom: '10px' }}>
                      Realiza la transferencia desde cualquier cuenta bancaria o billetera virtual.
                    </p>
                    <div style={{ fontSize: '0.82rem', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #dcfce7', lineHeight: '1.6' }}>
                      <div><b>Banco:</b> Santander Río / BBVA</div>
                      <div><b>Titular:</b> TAGHER'S STREETWEAR S.R.L.</div>
                      <div><b>Alias CBU:</b> TAGHERS.MODA.OFICIAL</div>
                      <div><b>CBU:</b> 0720192320000001928472</div>
                    </div>
                  </div>
                )}
              </div>

              {/* RESUMEN DE COMPRA */}
              <div className="checkout-summary-box" style={{ borderRadius: '12px', padding: '16px', backgroundColor: '#111', color: '#fff', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', color: '#bbb' }}>
                  <span>Subtotal prendas ({cart.length}):</span>
                  <span>${formatCurrency(subtotal)}</span>
                </div>

                {coupon && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', color: '#4ade80' }}>
                    <span>Cupón {coupon.code} (10% OFF):</span>
                    <span>-${formatCurrency(discountAmount)}</span>
                  </div>
                )}

                {payMethod === 'transfer' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', color: '#4ade80' }}>
                    <span>Descuento Transferencia Directa (10% OFF):</span>
                    <span>-${formatCurrency(transferDiscount)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', color: '#bbb' }}>
                  <span>Envío a domicilio:</span>
                  <span style={{ color: '#4ade80' }}>Bonificado</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #333', fontSize: '1.2rem', fontWeight: 900 }}>
                  <span>Total a Abonar:</span>
                  <span style={{ color: '#e2c044' }}>${formatCurrency(total)}</span>
                </div>

                {payMethod === 'card' && (
                  <div style={{ textAlign: 'right', fontSize: '0.78rem', color: '#aaa', marginTop: '4px' }}>
                    o {installments} cuotas de <b>${formatCurrency(installmentAmount)}</b> sin interés
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block checkout-submit-btn"
                style={{ padding: '16px', fontSize: '1rem', fontWeight: 800 }}
              >
                <i className="fa-solid fa-lock"></i> PAGAR ${formatCurrency(total)} Y CONFIRMAR ORDEN
              </button>
            </form>
          </div>
        ) : (
          <div className="success-ticket">
            <div className="success-icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h2>ORDEN CONFIRMADA</h2>
            <p>
              Tu pago ha sido acreditado y la orden fue registrada con éxito en la base de datos de <b>TAGHER'S</b>.
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
                <span>Método de Pago:</span>
                <span style={{ fontWeight: 600, color: '#16a34a' }}>{createdOrder.paymentMethod}</span>
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
              Recibirás el código de seguimiento de correo en tu email. Entrega estimada: 3 a 5 días hábiles.
            </p>
            <button className="btn btn-primary btn-block" onClick={handleFinish}>
              VOLVER A LA TIENDA
            </button>
          </div>
        )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
