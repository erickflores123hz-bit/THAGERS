'use client';

import React from 'react';

export default function TopAnnouncement() {
  const items = [
    "NUEVA COLECCIÓN Y2K STREETWEAR 2026",
    "ENVÍOS GRATIS EN COMPRAS MAYORES A $80.000",
    "3 Y 6 CUOTAS SIN INTERÉS CON TODAS LAS TARJETAS",
    "10% OFF EXTRA CON EL CÓDIGO: TAGHERS10",
    "ASESOR DE TALLE INTELIGENTE DISPONIBLE"
  ];

  // Duplicamos para ciclo infinito perfecto e imperceptible
  const marqueeItems = [...items, ...items, ...items];

  return (
    <div
      className="top-announcement"
      style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        cursor: 'default',
        userSelect: 'none'
      }}
    >
      <div
        className="announcement-track"
        style={{
          display: 'inline-flex',
          gap: '32px',
          willChange: 'transform'
        }}
      >
        {marqueeItems.map((text, idx) => (
          <span
            key={idx}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              letterSpacing: '1.8px',
              fontSize: '0.72rem',
              fontWeight: 700
            }}
          >
            <span>{text}</span>
            <span style={{ color: '#e2c044', fontSize: '0.65rem' }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
