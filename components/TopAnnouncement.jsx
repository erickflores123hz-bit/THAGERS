'use client';

import React from 'react';

export default function TopAnnouncement() {
  const announcements = [
    "🔥 NUEVA COLECCIÓN Y2K STREETWEAR 2026",
    "🚚 ENVÍOS GRATIS EN COMPRAS MAYORES A $80.000",
    "💳 3 Y 6 CUOTAS SIN INTERÉS CON TODAS LAS TARJETAS",
    "⚡ 10% OFF EXTRA CON EL CÓDIGO: TAGHERS10",
    "📐 ASESOR INTELIGENTE DE TALLE DISPONIBLE",
    "🔥 NUEVA COLECCIÓN Y2K STREETWEAR 2026",
    "🚚 ENVÍOS GRATIS EN COMPRAS MAYORES A $80.000",
    "💳 3 Y 6 CUOTAS SIN INTERÉS CON TODAS LAS TARJETAS"
  ];

  return (
    <div className="top-announcement">
      <div className="announcement-track">
        {announcements.map((text, idx) => (
          <span key={idx}>{text} •</span>
        ))}
      </div>
    </div>
  );
}
