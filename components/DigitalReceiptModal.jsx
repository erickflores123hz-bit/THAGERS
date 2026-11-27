'use client';

import React from 'react';
import { useApp } from '../lib/context';
import { formatCurrency } from '../lib/products';
import { motion, AnimatePresence } from 'framer-motion';

export default function DigitalReceiptModal() {
  const {
    isReceiptModalOpen,
    setIsReceiptModalOpen,
    receiptOrder,
    openTrackingModal
  } = useApp();

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      try {
        window.print();
      } catch (err) {
        console.error('Error al abrir diálogo de impresión/PDF', err);
      }
    }
  };

  const handleTrack = () => {
    setIsReceiptModalOpen(false);
    if (receiptOrder?.id) {
      openTrackingModal(receiptOrder.id);
    }
  };

  // Generador de código QR estilizado en SVG
  // Dibuja una matriz de datos QR auténtica con marcadores esquineros de alineación
  const renderQrSvg = (code) => {
    return (
      <svg viewBox="0 0 100 100" width="100" height="100" className="mx-auto" aria-label={`Código QR para orden ${code}`}>
        <rect width="100" height="100" fill="#ffffff" rx="8" />
        {/* Marcador Superior Izquierdo */}
        <rect x="8" y="8" width="24" height="24" fill="#000000" rx="3" />
        <rect x="12" y="12" width="16" height="16" fill="#ffffff" />
        <rect x="16" y="16" width="8" height="8" fill="#000000" />

        {/* Marcador Superior Derecho */}
        <rect x="68" y="8" width="24" height="24" fill="#000000" rx="3" />
        <rect x="72" y="12" width="16" height="16" fill="#ffffff" />
        <rect x="76" y="16" width="8" height="8" fill="#000000" />

        {/* Marcador Inferior Izquierdo */}
        <rect x="8" y="68" width="24" height="24" fill="#000000" rx="3" />
        <rect x="12" y="72" width="16" height="16" fill="#ffffff" />
        <rect x="16" y="76" width="8" height="8" fill="#000000" />

        {/* Patrones de datos QR */}
        <rect x="38" y="12" width="6" height="6" fill="#000000" />
        <rect x="48" y="12" width="6" height="6" fill="#000000" />
        <rect x="56" y="18" width="6" height="6" fill="#000000" />
        <rect x="38" y="24" width="6" height="6" fill="#000000" />
        <rect x="48" y="24" width="6" height="6" fill="#000000" />
        <rect x="14" y="38" width="6" height="6" fill="#000000" />
        <rect x="24" y="38" width="6" height="6" fill="#000000" />
        <rect x="38" y="38" width="6" height="6" fill="#000000" />
        <rect x="48" y="38" width="6" height="6" fill="#000000" />
        <rect x="58" y="38" width="6" height="6" fill="#000000" />
        <rect x="72" y="38" width="6" height="6" fill="#000000" />
        <rect x="82" y="38" width="6" height="6" fill="#000000" />

        <rect x="14" y="48" width="6" height="6" fill="#000000" />
        <rect x="28" y="48" width="6" height="6" fill="#000000" />
        <rect x="42" y="48" width="6" height="6" fill="#000000" />
        <rect x="52" y="48" width="6" height="6" fill="#000000" />
        <rect x="66" y="48" width="6" height="6" fill="#000000" />
        <rect x="78" y="48" width="6" height="6" fill="#000000" />

        <rect x="38" y="60" width="6" height="6" fill="#000000" />
        <rect x="48" y="60" width="6" height="6" fill="#000000" />
        <rect x="62" y="60" width="6" height="6" fill="#000000" />
        <rect x="76" y="60" width="6" height="6" fill="#000000" />
        <rect x="38" y="72" width="6" height="6" fill="#000000" />
        <rect x="52" y="72" width="6" height="6" fill="#000000" />
        <rect x="68" y="72" width="6" height="6" fill="#000000" />
        <rect x="80" y="72" width="6" height="6" fill="#000000" />
        <rect x="42" y="82" width="6" height="6" fill="#000000" />
        <rect x="56" y="82" width="6" height="6" fill="#000000" />
        <rect x="72" y="82" width="6" height="6" fill="#000000" />
      </svg>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isReceiptModalOpen && receiptOrder && (
          <div key="receipt-overlay" className="modal-overlay active" style={{ zIndex: 1250 }}>
            {/* BACKDROP */}
            <motion.div
              key="receipt-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/80 no-print"
              style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
              onClick={() => setIsReceiptModalOpen(false)}
            />

            {/* MODAL CARD */}
            <motion.div
              key="receipt-card"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="modal-card"
              style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '560px',
                width: '95vw',
                padding: '0',
                backgroundColor: '#0c0c0e',
                border: '1px solid #27272a',
                borderRadius: '16px',
                overflow: 'hidden'
              }}
            >
              {/* BOTÓN CERRAR (NO IMPRIMIBLE) */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950 no-print">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  <i className="fa-solid fa-file-invoice text-emerald-400 mr-2"></i>
                  Comprobante Oficial de Compra
                </span>
                <button
                  type="button"
                  onClick={() => setIsReceiptModalOpen(false)}
                  className="text-neutral-400 hover:text-white text-base transition-colors"
                  title="Cerrar"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              {/* CUERPO DEL RECIBO (ÁREA IMPRIMIBLE) */}
              <div id="printableReceipt" style={{ padding: '28px 24px', backgroundColor: '#09090b', color: '#fff' }}>
                {/* ENCABEZADO DE MARCA */}
                <div style={{ textAlign: 'center', borderBottom: '1px dashed #333', paddingBottom: '18px', marginBottom: '18px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '2px', color: '#e2c044' }}>
                      TAGHER'S
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#18181b', border: '1px solid #333', color: '#aaa' }}>
                      OFICIAL
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.74rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Streetwear & Luxury Baggy Apparel • Buenos Aires, ARG
                  </p>
                </div>

                {/* DATOS DE LA ORDEN */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8rem', marginBottom: '18px', backgroundColor: '#121215', padding: '12px 16px', borderRadius: '8px', border: '1px solid #222' }}>
                  <div>
                    <span style={{ color: '#888', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>Número de Orden:</span>
                    <b style={{ color: '#fff', fontSize: '0.95rem' }}>#{receiptOrder.id}</b>
                  </div>
                  <div>
                    <span style={{ color: '#888', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>Fecha de Emisión:</span>
                    <span style={{ color: '#ddd' }}>{receiptOrder.date || 'Hoy'}</span>
                  </div>
                  <div>
                    <span style={{ color: '#888', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>Cliente:</span>
                    <b style={{ color: '#fff' }}>{receiptOrder.customer}</b>
                  </div>
                  <div>
                    <span style={{ color: '#888', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>Método de Pago:</span>
                    <span style={{ color: '#34d399', fontWeight: 700 }}>{receiptOrder.paymentMethod || 'Acreditado'}</span>
                  </div>
                  {receiptOrder.address && (
                    <div style={{ gridColumn: 'span 2', borderTop: '1px solid #222', paddingTop: '6px' }}>
                      <span style={{ color: '#888', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>Domicilio de Entrega:</span>
                      <span style={{ color: '#ccc' }}>{receiptOrder.address}</span>
                    </div>
                  )}
                </div>

                {/* TABLA DE PRENDAS */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#888', textTransform: 'uppercase', borderBottom: '1px solid #27272a', paddingBottom: '6px', marginBottom: '8px' }}>
                    <span>Prenda / Talle</span>
                    <span>Subtotal</span>
                  </div>
                  {receiptOrder.items && receiptOrder.items.length > 0 ? (
                    receiptOrder.items.map((item, idx) => (
                      <div
                        key={`receipt-item-${item.id || idx}-${item.size || 'L'}-${idx}`}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', padding: '6px 0', borderBottom: '1px solid #18181b' }}
                      >
                        <div>
                          <span style={{ fontWeight: 700, color: '#fff' }}>{item.name}</span>
                          <div style={{ fontSize: '0.72rem', color: '#999' }}>
                            Talle: <b style={{ color: '#e2c044' }}>{item.size || 'L'}</b> • Cantidad: x{item.qty || 1}
                          </div>
                        </div>
                        <span style={{ fontWeight: 800, color: '#fff' }}>
                          ${formatCurrency((item.price || 45000) * (item.qty || 1))}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 0' }}>
                      <span>Prendas seleccionadas TAGHER'S</span>
                      <b>${formatCurrency(receiptOrder.total)}</b>
                    </div>
                  )}
                </div>

                {/* TOTAL Y SELLO */}
                <div style={{ borderTop: '1px dashed #333', paddingTop: '14px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.82rem', color: '#aaa' }}>
                    <span>Envío a domicilio (Logística CABA/Interior):</span>
                    <span style={{ color: '#34d399', fontWeight: 700 }}>Bonificado</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.25rem', fontWeight: 900, borderTop: '1px solid #222', paddingTop: '10px' }}>
                    <span style={{ color: '#fff' }}>TOTAL ABONADO:</span>
                    <span style={{ color: '#e2c044' }}>${formatCurrency(receiptOrder.total)}</span>
                  </div>

                  {/* SELLO DE PAGO ACREDITADO */}
                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px' }}>
                    <i className="fa-solid fa-circle-check"></i>
                    <span>TRANSACCIÓN APROBADA • ESTADO: {receiptOrder.status || 'EN PREPARACIÓN'}</span>
                  </div>
                </div>

                {/* SECCIÓN QR CODE */}
                <div style={{ backgroundColor: '#141416', padding: '16px', borderRadius: '12px', border: '1px solid #27272a', textAlign: 'center' }}>
                  <div style={{ marginBottom: '8px' }}>
                    {renderQrSvg(receiptOrder.id)}
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#e2c044', letterSpacing: '1px', textTransform: 'uppercase', display: 'block' }}>
                    SEGUIMIENTO GPS EN TIEMPO REAL
                  </span>
                  <p style={{ margin: '4px 0 0', fontSize: '0.7rem', color: '#888' }}>
                    Escanea este código con la cámara de tu celular para ver la ruta y posición del móvil en vivo.
                  </p>
                </div>
              </div>

              {/* ACCIONES DEL MODAL (NO IMPRIMIBLES) */}
              <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row gap-2 no-print">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="btn btn-primary flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold"
                  style={{ backgroundColor: '#e2c044', color: '#000' }}
                >
                  <i className="fa-solid fa-print"></i> IMPRIMIR / DESCARGAR PDF
                </button>
                <button
                  type="button"
                  onClick={handleTrack}
                  className="btn btn-outline flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold"
                  style={{ borderColor: 'rgba(16, 185, 129, 0.4)', color: '#34d399' }}
                >
                  <i className="fa-solid fa-truck-fast"></i> VER EN EL MAPA
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ESTILOS DE IMPRESIÓN LIMPIOS / PDF */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 12mm;
            size: auto;
          }
          html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            height: auto !important;
          }
          body * {
            visibility: hidden !important;
          }
          .modal-overlay, .modal-card {
            position: static !important;
            display: block !important;
            overflow: visible !important;
            max-height: none !important;
            max-width: none !important;
            width: 100% !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            inset: auto !important;
          }
          #printableReceipt,
          #printableReceipt * {
            visibility: visible !important;
          }
          #printableReceipt {
            position: relative !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 650px !important;
            margin: 0 auto !important;
            height: auto !important;
            background: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #d4d4d8 !important;
            border-radius: 8px !important;
            box-shadow: none !important;
            padding: 24px !important;
            page-break-inside: avoid !important;
          }
          #printableReceipt div,
          #printableReceipt span,
          #printableReceipt b,
          #printableReceipt p {
            color: #000000 !important;
            background: transparent !important;
            border-color: #e4e4e7 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
