'use client';

import React from 'react';
import { useApp } from '../lib/context';

export default function ArFeatureBanner() {
  const { openSmartSizerModal } = useApp();

  const scrollToCatalog = () => {
    const el = document.getElementById('catalogSection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="ar-feature-banner">
      <div className="ar-banner-container">
        <div className="ar-banner-badge">ASESOR DE TALLE & SILUETAS URBANAS</div>
        <h2>¿DUDAS CON TU TALLE EN CORTE BAGGY?</h2>
        <p>
          Encuentra la caída perfecta en segundos. Nuestro asesor calcula tu recomendación exacta para corte Ultra Baggy, Relaxed o Regular según tu peso y altura sin riesgo de equivocarte.
        </p>
        <div className="banner-btn-group">
          <button className="btn btn-white-glow" onClick={openSmartSizerModal}>
            <i className="fa-solid fa-ruler-combined"></i> CALCULAR MI TALLE IDEAL AHORA
          </button>
          <button className="btn btn-secondary" onClick={scrollToCatalog}>
            <i className="fa-solid fa-bag-shopping"></i> EXPLORAR COLECCIÓN
          </button>
        </div>
      </div>
    </section>
  );
}
