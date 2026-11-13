'use client';

import React from 'react';

export default function TopAnnouncement() {
  const items = [
    "NUEVA COLECCIÓN Y2K STREETWEAR 2026",
    "ENVÍOS SIN CARGO EN COMPRAS SUPERIORES A $80.000",
    "3 Y 6 CUOTAS SIN INTERÉS EN TODAS LAS TARJETAS",
    "10% OFF EXTRA CON CÓDIGO TAGHERS10",
    "ASESOR DE TALLE CORTE BAGGY"
  ];

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
          gap: '36px',
          willChange: 'transform'
        }}
      >
        {marqueeItems.map((text, idx) => (
          <span
            key={idx}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '18px',
              letterSpacing: '1.6px',
              fontSize: '0.72rem',
              fontWeight: 700
            }}
          >
            <span>{text}</span>
            <span style={{ opacity: 0.35, fontSize: '0.75rem' }}>•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
