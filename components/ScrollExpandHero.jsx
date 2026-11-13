'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '../lib/context';
import { motion } from 'framer-motion';

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
          
          <motion.div
            className="scroll-expand-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="expand-badge"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <i className="fa-solid fa-crown"></i> TAGHER'S STREETWEAR ARCHIVE 2026
            </motion.div>

            <motion.h2
              className="expand-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              BAGGY & VINTAGE REVOLUTION
            </motion.h2>

            <motion.p
              className="expand-desc"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
            >
              Vaqueros con bordados Ecko Unltd, remeras góticas Affliction, buzos True Religion con herradura, cadenas de plata y siluetas auténticas de los 90s y 2000s.
            </motion.p>

            <motion.div
              className="expand-actions"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.button
                className="btn btn-primary"
                onClick={scrollToCatalog}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <i className="fa-solid fa-bag-shopping"></i> EXPLORAR CATÁLOGO
              </motion.button>
              
              <motion.button
                className="btn btn-secondary"
                onClick={openSmartSizerModal}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <i className="fa-solid fa-ruler-combined"></i> ASESOR DE TALLE
              </motion.button>
            </motion.div>
          </motion.div>

          <div
            className="scroll-progress-hint"
            id="scrollProgressHint"
            style={{ opacity: Math.max(0, 1 - scrollProgress * 1.5) }}
          >
            <span>DESLIZA PARA EXPANDIR</span>
            <i className="fa-solid fa-angles-down"></i>
          </div>
        </div>
      </div>
    </section>
  );
}
