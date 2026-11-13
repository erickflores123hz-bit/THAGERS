'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context';

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

  if (!isSmartSizerModalOpen) return null;

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
      showToast(`¡Talle ${result.size} aplicado como tu talle predeterminado!`, 'success');
      setIsSmartSizerModalOpen(false);
    }
  };

  return (
    <div className="modal-overlay active" id="smartSizerModal">
      <div className="modal-card modal-sizer">
        <button
          className="modal-close-btn"
          onClick={() => setIsSmartSizerModalOpen(false)}
          title="Cerrar modal"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

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

          <button type="submit" className="btn btn-primary btn-block">
            CALCULAR MI TALLE IDEAL
          </button>
        </form>

        {/* RESULTADO DE LA RECOMENDACIÓN */}
        {result && (
          <div className="sizer-result-card" style={{ display: 'block', marginTop: '20px' }}>
            <div className="result-badge">RECOMENDACIÓN FINAL</div>
            <div className="result-size-display">TALLE {result.size}</div>
            <p className="result-explanation">{result.explanation}</p>
            <button className="btn btn-dark btn-block" onClick={applyRecommendation}>
              APLICAR ESTE TALLE A MIS PRENDAS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
