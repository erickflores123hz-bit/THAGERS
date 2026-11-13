'use client';

import React from 'react';
import { useApp } from '../lib/context';

export default function ArFeatureBanner() {
  const { openTryOnModal, openSmartSizerModal } = useApp();

  return (
    <section className="ar-feature-banner">
      <div className="ar-banner-container">
        <div className="ar-banner-badge">TECNOLOGÍA IA DE VISIÓN ARTIFICIAL</div>
        <h2>¿DUDAS CON CÓMO TE QUEDA O TU TALLE?</h2>
        <p>
          Nuestra cámara con IA detecta tus hombros y torso en vivo para proyectar la prenda directamente sobre tu cuerpo antes de comprar.
        </p>
        <div className="banner-btn-group">
          <button className="btn btn-white-glow" onClick={() => openTryOnModal(null)}>
            <i className="fa-solid fa-camera"></i> ABRIR PROBADOR CON IA AHORA
          </button>
          <button className="btn btn-secondary" onClick={openSmartSizerModal}>
            <i className="fa-solid fa-ruler-combined"></i> ASESOR INTELIGENTE DE TALLE
          </button>
        </div>
      </div>
    </section>
  );
}
