'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../lib/context';
import { formatCurrency } from '../lib/products';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderTrackingModal() {
  const {
    isTrackingModalOpen,
    setIsTrackingModalOpen,
    trackingOrderCode,
    setTrackingOrderCode,
    orders,
    user
  } = useApp();

  const userOrders = user
    ? orders.filter(
        (o) =>
          (o.email && o.email.toLowerCase() === user.email.toLowerCase()) ||
          (o.userId && o.userId === user.id)
      )
    : [];

  const [inputCode, setInputCode] = useState(trackingOrderCode || 'TAG-9421');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [truckProgress, setTruckProgress] = useState(0.65); // 0.0 (origen) a 1.0 (destino)
  const [etaMinutes, setEtaMinutes] = useState(38);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const truckMarkerRef = useRef(null);
  const polylineRef = useRef(null);

  // Sincronizar orden seleccionada cuando cambia trackingOrderCode o la lista de órdenes
  useEffect(() => {
    if (trackingOrderCode) {
      setInputCode(trackingOrderCode);
      const found = orders.find(
        (o) => o.id.toLowerCase() === trackingOrderCode.toLowerCase()
      );
      if (found) {
        setSelectedOrder(found);
      } else {
        // Orden demo por defecto si no existe en la lista
        setSelectedOrder(orders[0] || {
          id: trackingOrderCode,
          customer: 'Cliente TAGHER\'S',
          total: 115000,
          status: 'Enviado',
          date: 'Hoy',
          paymentMethod: 'Mercado Pago',
          items: [{ name: "True Religion Crimson Gothic 'REL' Heavy Zip Hoodie", size: 'L', qty: 1 }]
        });
      }
    }
  }, [trackingOrderCode, orders, isTrackingModalOpen]);

  // Manejo de búsqueda por código o email
  const handleSearch = (e) => {
    e.preventDefault();
    const clean = inputCode.trim();
    if (!clean) return;

    // Buscar por ID de orden
    const foundById = orders.find(
      (o) => o.id.toLowerCase() === clean.toLowerCase()
    );
    if (foundById) {
      setTrackingOrderCode(foundById.id);
      return;
    }

    // Buscar por email de cliente
    const foundByEmail = orders.find(
      (o) => o.email && o.email.toLowerCase() === clean.toLowerCase()
    );
    if (foundByEmail) {
      setTrackingOrderCode(foundByEmail.id);
      return;
    }

    setTrackingOrderCode(clean);
  };

  // Coordenadas fijas para la ruta de entrega (CABA / Buenos Aires)
  const originCoords = [-34.5885, -58.4305]; // TAGHER'S Palermo Archive
  const waypointCoords = [-34.5750, -58.4480]; // Centro de distribución troncal
  const destCoords = [-34.5615, -58.4620]; // Domicilio de entrega del cliente

  // Determinar progreso del camión según estado del pedido
  useEffect(() => {
    if (!selectedOrder) return;
    const st = (selectedOrder.status || '').toLowerCase();
    if (st.includes('entregado')) {
      setTruckProgress(1.0);
      setEtaMinutes(0);
    } else if (st.includes('reparto') || st.includes('enviado')) {
      setTruckProgress(0.72);
      setEtaMinutes(35);
    } else if (st.includes('prepar')) {
      setTruckProgress(0.2);
      setEtaMinutes(180);
    } else {
      setTruckProgress(0.05);
      setEtaMinutes(240);
    }
  }, [selectedOrder]);

  // Inicializar Leaflet dinámicamente en el cliente
  useEffect(() => {
    if (!isTrackingModalOpen || !mapContainerRef.current) return;

    let isMounted = true;

    // Cargar estilos de Leaflet si no están presentes
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Destruir instancia previa si existe
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Crear mapa centrado en el trayecto
      const map = L.map(mapContainerRef.current, {
        center: [-34.5750, -58.4460],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });
      mapInstanceRef.current = map;

      // Capa de mapa oscura (CartoDB Dark Matter)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Ícono de Depósito Origen
      const originIcon = L.divIcon({
        className: 'custom-map-pin origin',
        html: `
          <div style="background:#111; border:2px solid #fff; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; color:#fff; box-shadow:0 0 15px rgba(255,255,255,0.3); font-size:14px;">
            <i class="fa-solid fa-warehouse"></i>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      L.marker(originCoords, { icon: originIcon })
        .addTo(map)
        .bindPopup('<b>TAGHER\'S Central Archive</b><br>Palermo, CABA');

      // Ícono de Domicilio Destino
      const destIcon = L.divIcon({
        className: 'custom-map-pin dest',
        html: `
          <div style="background:#000; border:2px solid #e63946; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; color:#e63946; box-shadow:0 0 15px rgba(230,57,70,0.5); font-size:14px;">
            <i class="fa-solid fa-location-dot"></i>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      L.marker(destCoords, { icon: destIcon })
        .addTo(map)
        .bindPopup('<b>Domicilio de Entrega</b><br>Tu dirección registrada');

      // Trazado de ruta con gradiente/color esmeralda
      const routePoints = [originCoords, waypointCoords, destCoords];
      polylineRef.current = L.polyline(routePoints, {
        color: '#34d399',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);

      // Calcular posición actual del camión según el porcentaje
      const currentLat = originCoords[0] + (destCoords[0] - originCoords[0]) * truckProgress;
      const currentLng = originCoords[1] + (destCoords[1] - originCoords[1]) * truckProgress;

      // Ícono de Camioncito Animado con Pulso Radar
      const truckIcon = L.divIcon({
        className: 'custom-map-truck',
        html: `
          <div style="position:relative; width:44px; height:44px; display:flex; align-items:center; justify-content:center;">
            <div style="position:absolute; width:44px; height:44px; border-radius:50%; background:rgba(52,211,153,0.3); animation:ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position:relative; background:#042f2e; border:2px solid #34d399; border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; color:#34d399; box-shadow:0 0 20px #34d399; font-size:14px;">
              <i class="fa-solid fa-truck-fast"></i>
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      truckMarkerRef.current = L.marker([currentLat, currentLng], { icon: truckIcon })
        .addTo(map)
        .bindPopup('<b>Unidad de Reparto Andreani</b><br>En camino a tu domicilio');

      map.fitBounds(routePoints, { padding: [50, 50] });
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isTrackingModalOpen, truckProgress]);

  if (!isTrackingModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay active" style={{ zIndex: 1200 }}>
        {/* BACKDROP BLUR OSCURECIDO */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/80"
          style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
          onClick={() => setIsTrackingModalOpen(false)}
        />

        {/* CONTENEDOR MODAL DE SEGUIMIENTO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="modal-card"
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '920px',
            width: '94vw',
            padding: '0',
            overflow: 'hidden',
            background: '#0d0d0d',
            border: '1px solid #262626',
            color: '#f5f5f5',
            borderRadius: '16px'
          }}
        >
          {/* CABECERA */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/90">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-xs font-semibold tracking-widest uppercase text-neutral-200">
                SEGUIMIENTO GPS EN VIVO • TAGHER'S LOGISTICS
              </h3>
            </div>
            <motion.button
              onClick={() => setIsTrackingModalOpen(false)}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="text-neutral-400 hover:text-white text-lg p-1 transition-colors"
              title="Cerrar seguimiento"
            >
              <i className="fa-solid fa-xmark"></i>
            </motion.button>
          </div>

          {/* CONTENIDO INTERACTIVO */}
          <div className="p-6">
            {/* BUSCADOR DE CÓDIGO DE SEGUIMIENTO */}
            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"></i>
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder="Ingresa tu código (ej: TAG-8941) o tu email"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white uppercase tracking-wider font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <button type="submit" className="btn btn-primary px-5 text-xs font-bold tracking-wider">
                BUSCAR PAQUETE
              </button>
            </form>

            {/* PEDIDOS DEL USUARIO LOGUEADO */}
            {user && userOrders.length > 0 && (
              <div className="mb-5 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <i className="fa-solid fa-user-check text-emerald-400"></i>
                    Tus pedidos registrados ({user.name.split(' ')[0]}):
                  </span>
                  <span className="text-[10px] text-neutral-500">Toca uno para ver en el mapa</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userOrders.map((ord) => {
                    const isActive = selectedOrder?.id === ord.id;
                    return (
                      <button
                        key={ord.id}
                        type="button"
                        onClick={() => {
                          setInputCode(ord.id);
                          setTrackingOrderCode(ord.id);
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          border: isActive ? '1px solid #10b981' : '1px solid #333',
                          backgroundColor: isActive ? 'rgba(16, 185, 129, 0.2)' : '#18181b',
                          color: isActive ? '#10b981' : '#ccc',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <i className="fa-solid fa-box"></i>
                        <span>#{ord.id}</span>
                        <span style={{ fontSize: '0.7rem', opacity: 0.85, color: ord.status === 'En reparto' ? '#10b981' : '#f59e0b' }}>
                          • {ord.status}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* GRID PRINCIPAL: MAPA CON CAMIONCITO + DETALLES */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* COLUMNA MAPA GPS EN VIVO (7 COLS) */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="relative w-full h-[320px] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-inner">
                  {/* CONTENEDOR LEAFLET */}
                  <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />

                  {/* OVERLAY STATUS SOBRE EL MAPA */}
                  <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-800 text-xs text-white z-[500] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-mono text-[11px] text-emerald-400">UNIDAD DE REPARTO EN RUTA</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 bg-black/90 backdrop-blur-md p-3 rounded-lg border border-neutral-800 z-[500] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-mono">
                        LLEGADA ESTIMADA (ETA)
                      </span>
                      <span className="text-sm font-bold text-white">
                        {etaMinutes > 0 ? `Llega en aprox. ${etaMinutes} minutos` : '¡Tu pedido ha sido entregado!'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-mono">
                        OPERADOR
                      </span>
                      <span className="text-xs font-semibold text-neutral-200">Andreani Express</span>
                    </div>
                  </div>
                </div>

                {/* HINT LOGÍSTICO */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500">
                  <span>
                    <i className="fa-solid fa-route text-emerald-400 mr-1"></i> Palermo Hub &rarr; Domicilio cliente
                  </span>
                  <span>Actualización satelital cada 30s</span>
                </div>
              </div>

              {/* COLUMNA DETALLES & TIMELINE (5 COLS) */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                {/* TARJETA DE RESUMEN DEL PEDIDO */}
                <div className="p-4 bg-neutral-900/80 rounded-xl border border-neutral-800 mb-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      ORDEN #{selectedOrder?.id || inputCode}
                    </span>
                    <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-300 font-medium">
                      {selectedOrder?.status || 'Enviado'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-neutral-300 mb-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Destinatario:</span>
                      <span className="font-semibold text-white">{selectedOrder?.customer || 'Cliente'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Total abonado:</span>
                      <span className="font-bold text-white">${formatCurrency(selectedOrder?.total || 115000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Método de pago:</span>
                      <span>{selectedOrder?.paymentMethod || 'Mercado Pago'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">N° de Guía:</span>
                      <span className="font-mono text-neutral-400">AR-9428172901</span>
                    </div>
                  </div>

                  {selectedOrder?.items && selectedOrder.items.length > 0 && (
                    <div className="pt-2 border-t border-neutral-800">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block mb-1">
                        PRENDAS EN ESTE ENVÍO:
                      </span>
                      <p className="text-xs text-neutral-200 truncate">
                        {selectedOrder.items[0].name} ({selectedOrder.items[0].size || 'L'})
                        {selectedOrder.items.length > 1 && ` y ${selectedOrder.items.length - 1} más`}
                      </p>
                    </div>
                  )}
                </div>

                {/* TIMELINE DE ESTADOS DE ENVÍO */}
                <div className="p-4 bg-neutral-950/70 rounded-xl border border-neutral-800/80">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block mb-3">
                    ESTADO DE LA ENTREGA
                  </span>

                  <div className="space-y-3">
                    {[
                      { step: 1, label: 'Pago Verificado', desc: 'Acreditado de forma segura', done: true },
                      { step: 2, label: 'Preparado en Depósito', desc: 'Empaque y control de calidad', done: true },
                      { step: 3, label: 'Despachado con Andreani', desc: 'Asignado a chofer de reparto', done: true },
                      { step: 4, label: 'En Reparto Móvil', desc: 'Camión en camino a tu domicilio', current: true },
                      { step: 5, label: 'Entregado en Mano', desc: 'Firma y entrega final', done: false }
                    ].map((st) => (
                      <div key={st.step} className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] mt-0.5 ${
                            st.current
                              ? 'bg-emerald-500 text-black font-bold ring-4 ring-emerald-500/20'
                              : st.done
                              ? 'bg-neutral-800 text-emerald-400'
                              : 'bg-neutral-900 text-neutral-600 border border-neutral-800'
                          }`}
                        >
                          {st.done ? <i className="fa-solid fa-check"></i> : st.step}
                        </div>
                        <div>
                          <h5
                            className={`text-xs font-semibold leading-tight ${
                              st.current ? 'text-emerald-400' : st.done ? 'text-white' : 'text-neutral-500'
                            }`}
                          >
                            {st.label}
                          </h5>
                          <span className="text-[11px] text-neutral-500 block">{st.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
