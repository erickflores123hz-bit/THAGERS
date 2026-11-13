'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context';

export default function Footer() {
  const { setActiveCategory, setIsAdminModalOpen, openSmartSizerModal, showToast, user } = useApp();
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) {
      showToast(`¡Gracias por suscribirte con ${email}! Recibirás acceso prioritario a los próximos drops.`, 'success');
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
                  showToast("TAGHER'S v2.0 - Arquitectura Next.js, React 19, Tailwind CSS y MediaPipe Pose", 'info');
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

      <div className="footer-bottom">
        <p>&copy; 2026 TAGHER'S INC. Todos los derechos reservados. Diseñado para entusiastas de la moda urbana.</p>
      </div>
    </footer>
  );
}
