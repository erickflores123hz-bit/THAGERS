'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { motion, AnimatePresence } from 'framer-motion';

export default function SmartSizerModal() {
  const {
    isSmartSizerModalOpen,
    setIsSmartSizerModalOpen,
    setRecommendedSize,
    showToast
  } = useApp();

  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(72);
  const [fitPref, setFitPref] = useState('baggy');
  const [result, setResult] = useState(null);

  const calculateSmartSize = (e) => {
    e.preventDefault();
    const h = parseInt(height, 10);
    const w = parseInt(weight, 10);

    let baseSize = 'M';
    if (h < 165 || w < 58) baseSize = 'S';
    else if (h <= 175 && w <= 74) baseSize = 'M';
    else if (h <= 184 && w <= 88) baseSize = 'L';
    else if (h <= 192 || w <= 98) baseSize = 'XL';
    else baseSize = 'XXL';

    // Ajuste según preferencia de calce
    const order = ['S', 'M', 'L', 'XL', 'XXL'];
    let idx = order.indexOf(baseSize);

    if (fitPref === 'baggy' && idx < order.length - 1) {
      idx += 1;
    } else if (fitPref === 'regular' && idx > 0) {
      idx -= 1;
    }

    const finalSize = order[idx];
    let explanation = '';
    if (fitPref === 'baggy') {
      explanation = `Para tus ${h} cm y ${w} kg, el talle ${finalSize} te dará la caída 90s perfecta: botamanga holgada que descansa con pliegues sobre tus zapatillas sin arrastrar.`;
    } else if (fitPref === 'relaxed') {
      explanation = `Para tus ${h} cm y ${w} kg, el talle ${finalSize} te brindará holgura moderna y máxima comodidad sin exceso de tela.`;
    } else {
      explanation = `Para tus ${h} cm y ${w} kg, el talle ${finalSize} se ajustará a tus hombros y cintura con una silueta clásica prolija.`;
    }

    setResult({ size: finalSize, explanation });
  };

  const applyRecommendation = () => {
    if (result) {
      setRecommendedSize(result.size);
      showToast(`Talle ${result.size} seleccionado como preferido`, 'success');
      setIsSmartSizerModalOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isSmartSizerModalOpen && (
        <div className="modal-overlay active" id="smartSizerModal" style={{ zIndex: 1100 }}>
          {/* BACKDROP BLUR OSCURECIDO */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60"
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            onClick={() => setIsSmartSizerModalOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="modal-card modal-sizer"
            style={{ position: 'relative', zIndex: 10 }}
          >
            <motion.button
              className="modal-close-btn"
              onClick={() => setIsSmartSizerModalOpen(false)}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
              title="Cerrar modal"
            >
              <i className="fa-solid fa-xmark"></i>
            </motion.button>

            <div className="sizer-header">
              <i className="fa-solid fa-ruler-combined sizer-icon"></i>
              <h3>ASESOR INTELIGENTE DE TALLE IA</h3>
              <p>
                Evita equivocarte de talla. Calculamos tu recomendación exacta para corte Baggy y silueta urbana.
              </p>
            </div>

            <form onSubmit={calculateSmartSize}>
              <div className="form-row">
                <div className="form-group">
                  <label>Tu Estatura (cm)</label>
                  <input
                    type="number"
                    min="140"
                    max="220"
                    required
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Tu Peso Aprox. (kg)</label>
                  <input
                    type="number"
                    min="40"
                    max="160"
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>¿Cómo prefieres que te quede la prenda?</label>
                <div className="fit-preference-grid">
                  <label className="fit-option">
                    <input
                      type="radio"
                      name="fitPref"
                      value="baggy"
                      checked={fitPref === 'baggy'}
                      onChange={(e) => setFitPref(e.target.value)}
                    />
                    <span>
                      <b>Ultra Baggy / Suelto</b> (Estética 90s caída holgada)
                    </span>
                  </label>
                  <label className="fit-option">
                    <input
                      type="radio"
                      name="fitPref"
                      value="relaxed"
                      checked={fitPref === 'relaxed'}
                      onChange={(e) => setFitPref(e.target.value)}
                    />
                    <span>
                      <b>Relaxed</b> (Holgado cómodo estándar)
                    </span>
                  </label>
                  <label className="fit-option">
                    <input
                      type="radio"
                      name="fitPref"
                      value="regular"
                      checked={fitPref === 'regular'}
                      onChange={(e) => setFitPref(e.target.value)}
                    />
                    <span>
                      <b>Regular / Ajustado</b> (Al cuerpo)
                    </span>
                  </label>
                </div>
              </div>

              <motion.button
                type="submit"
                className="btn btn-primary btn-block"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                CALCULAR MI TALLE IDEAL
              </motion.button>
            </form>

            {/* RESULTADO DE LA RECOMENDACIÓN */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: 10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="sizer-result-card"
                  style={{ display: 'block', marginTop: '20px' }}
                >
                  <div className="result-badge">RECOMENDACIÓN FINAL</div>
                  <div className="result-size-display">TALLE {result.size}</div>
                  <p className="result-explanation">{result.explanation}</p>
                  <motion.button
                    className="btn btn-dark btn-block"
                    onClick={applyRecommendation}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    APLICAR ESTE TALLE A MIS PRENDAS
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
