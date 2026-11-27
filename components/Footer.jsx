'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context';

export default function Footer() {
  const { setActiveCategory, setIsAdminModalOpen, openSmartSizerModal, openTrackingModal, showToast, user } = useApp();
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) {
      showToast(`Suscripción confirmada para ${email}`, 'success');
      setEmail('');
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    const catalogElem = document.getElementById('catalogSection');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-col brand-col">
          <span className="footer-logo">TAGHER'S</span>
          <p className="footer-desc">
            Moda urbana contemporánea inspirada en la cultura del skate, hip-hop y estética 90s/Y2K. Cortes anchos, acabados resistentes y accesorios con actitud.
          </p>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" title="TikTok">
              <i className="fa-brands fa-tiktok"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" title="YouTube">
              <i className="fa-brands fa-youtube"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" title="X (Twitter)">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>CATEGORÍAS</h4>
          <ul>
            <li>
              <a href="#catalogSection" onClick={(e) => { e.preventDefault(); handleCategoryClick('vaqueros'); }}>
                Vaqueros Baggy Ecko & Southpole
              </a>
            </li>
            <li>
              <a href="#catalogSection" onClick={(e) => { e.preventDefault(); handleCategoryClick('camisetas'); }}>
                Remeras Góticas & Polos
              </a>
            </li>
            <li>
              <a href="#catalogSection" onClick={(e) => { e.preventDefault(); handleCategoryClick('sudaderas'); }}>
                Track Jackets & Hoodies
              </a>
            </li>
            <li>
              <a href="#catalogSection" onClick={(e) => { e.preventDefault(); handleCategoryClick('accesorios'); }}>
                Cadenas & Anillos
              </a>
            </li>
            <li>
              <a href="#catalogSection" onClick={(e) => { e.preventDefault(); handleCategoryClick('cinturones'); }}>
                Cinturones Punk
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>SISTEMA & AYUDA</h4>
          <ul>
            {user?.role === 'admin' && (
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsAdminModalOpen(true); }} style={{ color: '#e63946' }}>
                  <i className="fa-solid fa-lock"></i> Panel Administrador (Ventas/Stock)
                </a>
              </li>
            )}
            {user && (
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); openTrackingModal(); }} style={{ color: '#10b981', fontWeight: 600 }}>
                  <i className="fa-solid fa-truck-fast"></i> Seguimiento de Mis Pedidos (GPS)
                </a>
              </li>
            )}
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); openSmartSizerModal(); }}>
                <i className="fa-solid fa-ruler-combined"></i> Asesor de Talles Corte Baggy
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  showToast("TAGHER'S ARCHIVE - Next.js & React 19", 'info');
                }}
              >
                <i className="fa-solid fa-code-branch"></i> Versión del Sistema (Next.js)
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-col newsletter-col">
          <h4>NEWSLETTER</h4>
          <p>Suscríbete para recibir acceso prioritario a los próximos drops y descuentos exclusivos.</p>
          <form className="newsletter-form" onSubmit={handleNewsletter}>
            <input
              type="email"
              placeholder="Tu correo electrónico..."
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">UNIRSE</button>
          </form>
        </div>
      </div>

      {/* MEDIOS DE PAGO Y CONFIANZA EN ARGENTINA */}
      <div style={{
        maxWidth: '1280px',
        margin: '36px auto 0',
        padding: '24px 20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* LADO IZQUIERDO: MEDIOS DE PAGO */}
        <div>
          <span style={{
            fontSize: '0.72rem',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: '#a3a3a3',
            fontWeight: 700,
            display: 'block',
            marginBottom: '10px'
          }}>
            <i className="fa-solid fa-credit-card" style={{ marginRight: '6px', color: '#10b981' }}></i>
            MEDIOS DE PAGO ACEPTADOS EN ARGENTINA
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            {/* MERCADO PAGO */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#009EE3',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.5px'
            }}>
              <i className="fa-solid fa-handshake"></i>
              <span>MERCADO PAGO</span>
            </div>

            {/* TARJETAS */}
            {[
              { name: 'Visa', icon: 'fa-brands fa-cc-visa' },
              { name: 'Mastercard', icon: 'fa-brands fa-cc-mastercard' },
              { name: 'Amex', icon: 'fa-brands fa-cc-amex' },
              { name: 'Naranja X', text: 'NARANJA X' },
              { name: 'Cabal', text: 'CABAL' }
            ].map((card, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#e5e5e5',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                {card.icon ? <i className={card.icon} style={{ fontSize: '0.95rem' }}></i> : null}
                <span>{card.text || card.name}</span>
              </div>
            ))}

            {/* TRANSFERENCIA */}
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <i className="fa-solid fa-building-columns"></i>
              <span>TRANSFERENCIA (10% OFF)</span>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: BENEFICIOS Y SEGURIDAD */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#e5e5e5',
            fontSize: '0.8rem',
            fontWeight: 700
          }}>
            <span style={{
              backgroundColor: '#e2c044',
              color: '#000',
              padding: '4px 8px',
              borderRadius: '4px',
              fontWeight: 900,
              fontSize: '0.7rem'
            }}>
              3 Y 6 CUOTAS
            </span>
            <span>Sin Interés</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#a3a3a3',
            fontSize: '0.78rem'
          }}>
            <i className="fa-solid fa-shield-halved" style={{ color: '#10b981' }}></i>
            <span>Compra 100% Segura • SSL 256-Bit</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#a3a3a3',
            fontSize: '0.78rem'
          }}>
            <i className="fa-solid fa-truck" style={{ color: '#60a5fa' }}></i>
            <span>Envíos a todo el país</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 TAGHER'S INC. Todos los derechos reservados. Diseñado para entusiastas de la moda urbana.</p>
      </div>
    </footer>
  );
}
