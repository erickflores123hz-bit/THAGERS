'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '../lib/context';

export default function ScrollExpandHero() {
  const { openSmartSizerModal } = useApp();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const runway = document.getElementById('scrollExpandRunway');
      if (!runway) return;

      const rect = runway.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = runway.offsetHeight - windowHeight;
      
      if (totalScrollable > 0) {
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCatalog = () => {
    const catalogElem = document.getElementById('catalogSection');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Escala y redondeo dinámico según el scroll para el efecto ReactBits Expand
  const scale = 0.88 + scrollProgress * 0.12;
  const borderRadius = Math.max(0, 24 - scrollProgress * 24);

  return (
    <section className="scroll-expand-runway" id="scrollExpandRunway">
      <div className="scroll-sticky-stage">
        <div
          className="scroll-expand-card"
          id="scrollExpandCard"
          style={{
            transform: `scale(${scale})`,
            borderRadius: `${borderRadius}px`,
            transition: 'transform 0.1s ease-out, border-radius 0.1s ease-out'
          }}
        >
          <img
            src="/assets/models/hero_afro_model_white.jpg"
            alt="Modelo Afrodescendiente con Rastas - TAGHER'S"
            className="scroll-expand-img"
            id="scrollExpandImg"
          />
          <div className="scroll-expand-overlay"></div>
          <div className="scroll-expand-content">
            <div className="expand-badge">
              <i className="fa-solid fa-crown"></i> TAGHER'S STREETWEAR ARCHIVE 2026
            </div>
            <h2 className="expand-title">BAGGY & VINTAGE REVOLUTION</h2>
            <p className="expand-desc">
              Vaqueros con bordados Ecko Unltd, remeras góticas Affliction, buzos True Religion con herradura, cadenas de plata y siluetas auténticas de los 90s y 2000s.
            </p>
            <div className="expand-actions">
              <button className="btn btn-primary" onClick={scrollToCatalog}>
                <i className="fa-solid fa-bag-shopping"></i> EXPLORAR CATÁLOGO
              </button>
              <button className="btn btn-secondary" onClick={openSmartSizerModal}>
                <i className="fa-solid fa-ruler-combined"></i> ASESOR DE TALLE
              </button>
            </div>
          </div>
          <div className="scroll-progress-hint" id="scrollProgressHint" style={{ opacity: 1 - scrollProgress * 1.5 }}>
            <span>DESLIZA PARA EXPANDIR</span>
            <i className="fa-solid fa-angles-down"></i>
          </div>
        </div>
      </div>
    </section>
  );
}
