'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
    user,
    setIsAuthModalOpen,
    showToast
  } = useApp();

  // Filtrar pedidos que pertenecen estrictamente al usuario autenticado
  const userOrders = useMemo(() => {
    if (!user) return [];
    return orders.filter(
      (o) =>
        (o.email && o.email.toLowerCase() === user.email.toLowerCase()) ||
        (o.userId && o.userId === user.id)
    );
  }, [orders, user]);

  // Lista activa de pedidos: Si es admin puede ver todos, de lo contrario solo sus pedidos
  const activeOrdersList = useMemo(() => {
    if (!user) return [];
    if (user.role === 'admin') return orders;
    return userOrders;
  }, [user, orders, userOrders]);

  const [inputCode, setInputCode] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [truckProgress, setTruckProgress] = useState(0.72);
  const [etaMinutes, setEtaMinutes] = useState(35);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const truckMarkerRef = useRef(null);
  const polylineRef = useRef(null);

  // Sincronizar orden seleccionada cuando cambia trackingOrderCode o activeOrdersList
  useEffect(() => {
    if (!isTrackingModalOpen || !user) {
      setSelectedOrder(null);
      return;
    }

    if (activeOrdersList.length === 0) {
      setSelectedOrder(null);
      return;
    }

    if (trackingOrderCode) {
      const found = activeOrdersList.find(
        (o) => o.id.toLowerCase() === trackingOrderCode.toLowerCase()
      );
      if (found) {
        setSelectedOrder(found);
        setInputCode(found.id);
        return;
      }
    }

    // Por defecto seleccionar el primer pedido legítimo del usuario
    setSelectedOrder(activeOrdersList[0]);
    setInputCode(activeOrdersList[0].id);
    setTrackingOrderCode(activeOrdersList[0].id);
  }, [trackingOrderCode, activeOrdersList, isTrackingModalOpen, user, setTrackingOrderCode]);

  // Búsqueda de órdenes dentro de la lista permitida
  const handleSearch = (e) => {
    e.preventDefault();
    const clean = (inputCode || '').trim().toLowerCase();
    if (!clean) return;

    const found = activeOrdersList.find(
      (o) =>
        o.id.toLowerCase() === clean ||
        (o.email && o.email.toLowerCase() === clean)
    );

    if (found) {
      setSelectedOrder(found);
      setTrackingOrderCode(found.id);
      showToast(`Visualizando pedido #${found.id}`, 'success');
    } else {
      showToast(
        user.role === 'admin'
          ? 'Pedido no encontrado en la base de datos'
          : 'Ese código no corresponde a ningún pedido de tu cuenta',
        'error'
      );
    }
  };

  // Coordenadas fijas para la ruta de entrega (CABA / Buenos Aires)
  const originCoords = useMemo(() => [-34.5885, -58.4305], []); // TAGHER'S Palermo Hub
  const waypointCoords = useMemo(() => [-34.5750, -58.4480], []); // Centro de clasificación
  const destCoords = useMemo(() => [-34.5615, -58.4620], []); // Domicilio de entrega

  // Determinar progreso del camión según estado real del pedido seleccionado
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
      setTruckProgress(0.08);
      setEtaMinutes(240);
    }
  }, [selectedOrder]);

  // Inicializar Leaflet dinámicamente en el cliente
  useEffect(() => {
    if (!isTrackingModalOpen || !user || !selectedOrder || !mapContainerRef.current) return;

    let isMounted = true;

    // Inyectar CSS de Leaflet si no está presente
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

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

      // Ícono de Depósito Central
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

      // Ícono de Domicilio Destino del Cliente
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
        .bindPopup(`<b>Domicilio de Entrega</b><br>${selectedOrder.address || 'Palermo, CABA'}`);

      // Trazado de ruta
      const routePoints = [originCoords, waypointCoords, destCoords];
      polylineRef.current = L.polyline(routePoints, {
        color: '#34d399',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);

      // Posición actual del móvil de reparto
      const currentLat = originCoords[0] + (destCoords[0] - originCoords[0]) * truckProgress;
      const currentLng = originCoords[1] + (destCoords[1] - originCoords[1]) * truckProgress;

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
        .bindPopup(`<b>Unidad de Reparto Andreani</b><br>Pedido #${selectedOrder.id} para ${selectedOrder.customer || user.name}`);

      map.fitBounds(routePoints, { padding: [50, 50] });
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isTrackingModalOpen, user, selectedOrder, truckProgress, originCoords, waypointCoords, destCoords]);

  if (!isTrackingModalOpen) return null;

  // CASO 1: USUARIO NO AUTENTICADO
  if (!user) {
    return (
      <AnimatePresence>
        <div key="tracking-auth-gate" className="modal-overlay active" style={{ zIndex: 1200 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/85"
            style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
            onClick={() => setIsTrackingModalOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="modal-card"
            style={{
              position: 'relative',
              zIndex: 10,
              maxWidth: '520px',
              width: '94vw',
              padding: '0',
              overflow: 'hidden',
              background: '#0d0d0d',
              border: '1px solid #262626',
              color: '#f5f5f5',
              borderRadius: '16px'
            }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/90">
              <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
                SEGUIMIENTO DE PEDIDOS • ACCESO EXCLUSIVO
              </span>
              <motion.button
                onClick={() => setIsTrackingModalOpen(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="text-neutral-400 hover:text-white text-lg p-1 transition-colors"
                title="Cerrar ventana"
              >
                <i className="fa-solid fa-xmark"></i>
              </motion.button>
            </div>

            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 text-2xl shadow-[0_0_25px_rgba(16,185,129,0.15)]">
                <i className="fa-solid fa-user-lock"></i>
              </div>
              <h4 className="text-base font-bold text-white mb-2 tracking-wide uppercase">
                INICIA SESIÓN PARA VER TUS PEDIDOS
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto mb-6">
                El seguimiento satelital con mapa GPS en vivo y móvil de reparto está disponible exclusivamente para clientes con sesión iniciada. Ingresa con la cuenta con la que realizaste la compra para ver el estado de tu paquete.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  className="btn btn-primary btn-block text-xs font-bold tracking-wider py-3"
                  onClick={() => {
                    setIsTrackingModalOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                >
                  <i className="fa-solid fa-right-to-bracket mr-2"></i> INICIAR SESIÓN / REGISTRARME
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-block text-xs font-bold tracking-wider py-2.5 text-neutral-400"
                  onClick={() => setIsTrackingModalOpen(false)}
                >
                  VOLVER A LA TIENDA
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  // CASO 2: USUARIO AUTENTICADO SIN PEDIDOS (Y NO ES ADMIN)
  if (activeOrdersList.length === 0 && user.role !== 'admin') {
    return (
      <AnimatePresence>
        <div key="tracking-auth-gate" className="modal-overlay active" style={{ zIndex: 1200 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/85"
            style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
            onClick={() => setIsTrackingModalOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="modal-card"
            style={{
              position: 'relative',
              zIndex: 10,
              maxWidth: '520px',
              width: '94vw',
              padding: '0',
              overflow: 'hidden',
              background: '#0d0d0d',
              border: '1px solid #262626',
              color: '#f5f5f5',
              borderRadius: '16px'
            }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/90">
              <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
                SEGUIMIENTO GPS • TAGHER'S LOGISTICS
              </span>
              <motion.button
                onClick={() => setIsTrackingModalOpen(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="text-neutral-400 hover:text-white text-lg p-1 transition-colors"
                title="Cerrar ventana"
              >
                <i className="fa-solid fa-xmark"></i>
              </motion.button>
            </div>

            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 text-2xl">
                <i className="fa-solid fa-box-open"></i>
              </div>
              <h4 className="text-base font-bold text-white mb-2 tracking-wide uppercase">
                HOLA {user.name.split(' ')[0].toUpperCase()} • NO TIENES PEDIDOS EN CURSO
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto mb-6">
                Aún no has registrado compras con tu cuenta ({user.email}). Cuando adquieras una prenda de nuestro catálogo, aquí podrás rastrear el camión de Andreani con GPS satelital en tiempo real hasta tu puerta.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-block text-xs font-bold tracking-wider py-3"
                onClick={() => {
                  setIsTrackingModalOpen(false);
                  const catalog = document.getElementById('catalogSection');
                  if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <i className="fa-solid fa-bag-shopping mr-2"></i> EXPLORAR EL CATÁLOGO
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  // CASO 3: USUARIO AUTENTICADO CON PEDIDOS DISPONIBLES
  const orderStatus = (selectedOrder?.status || '').toLowerCase();
  const isDelivered = orderStatus.includes('entregado');
  const isOutForDelivery = orderStatus.includes('reparto') || orderStatus.includes('enviado');
  const isPreparing = orderStatus.includes('prepar');

  return (
    <AnimatePresence>
      <div key="tracking-main-modal" className="modal-overlay active" style={{ zIndex: 1200 }}>
        {/* BACKDROP BLUR OSCURECIDO */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/85"
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
            maxWidth: '940px',
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
                SEGUIMIENTO GPS EN VIVO • {user.role === 'admin' ? "PANEL DE LOGÍSTICA (SUPERVISOR)" : `PEDIDOS DE ${user.name.split(' ')[0].toUpperCase()}`}
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
            {/* BUSCADOR DE CÓDIGO */}
            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"></i>
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder={user.role === 'admin' ? "Buscar por código (ej: TAG-8941) o email" : `Buscar entre tus pedidos (#${activeOrdersList[0]?.id || 'TAG-8941'})`}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white uppercase tracking-wider font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <button type="submit" className="btn btn-primary px-5 text-xs font-bold tracking-wider">
                BUSCAR
              </button>
            </form>

            {/* SELECTOR DE PEDIDOS DEL USUARIO LOGUEADO */}
            {activeOrdersList.length > 0 && (
              <div className="mb-5 p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                    <i className="fa-solid fa-circle-check text-emerald-400"></i>
                    {user.role === 'admin' ? 'Órdenes en sistema:' : `Tus pedidos registrados (${user.name.split(' ')[0]}):`}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">Selecciona uno para ver en mapa</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeOrdersList.map((ord) => {
                    const isActive = selectedOrder?.id === ord.id;
                    return (
                      <button
                        key={ord.id}
                        type="button"
                        onClick={() => {
                          setInputCode(ord.id);
                          setTrackingOrderCode(ord.id);
                          setSelectedOrder(ord);
                        }}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          border: isActive ? '1px solid #10b981' : '1px solid #27272a',
                          backgroundColor: isActive ? 'rgba(16, 185, 129, 0.15)' : '#18181b',
                          color: isActive ? '#34d399' : '#a1a1aa',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <i className="fa-solid fa-box"></i>
                        <span>#{ord.id}</span>
                        <span style={{ fontSize: '0.7rem', color: ord.status === 'En reparto' ? '#34d399' : ord.status === 'Entregado' ? '#60a5fa' : '#f59e0b' }}>
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
                    <span className="font-mono text-[11px] text-emerald-400">
                      {isDelivered ? 'ENTREGA COMPLETADA' : isOutForDelivery ? 'UNIDAD DE REPARTO EN RUTA' : 'EN PREPARACIÓN EN DEPÓSITO'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 bg-black/90 backdrop-blur-md p-3 rounded-lg border border-neutral-800 z-[500] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-mono">
                        LLEGADA ESTIMADA (ETA)
                      </span>
                      <span className="text-sm font-bold text-white">
                        {isDelivered ? '¡Tu pedido ha sido entregado!' : etaMinutes > 0 ? `Llega en aprox. ${etaMinutes} minutos` : 'Próxima entrega'}
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
                    <i className="fa-solid fa-route text-emerald-400 mr-1"></i> Palermo Hub &rarr; {selectedOrder?.address || 'Domicilio del comprador'}
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
                      ORDEN #{selectedOrder?.id || 'TAG-8941'}
                    </span>
                    <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-300 font-medium">
                      {selectedOrder?.status || 'En preparación'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-neutral-300 mb-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Destinatario:</span>
                      <span className="font-semibold text-white">{selectedOrder?.customer || user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Total abonado:</span>
                      <span className="font-bold text-white">${formatCurrency(selectedOrder?.total || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Método de pago:</span>
                      <span className="truncate max-w-[200px] text-right">{selectedOrder?.paymentMethod || 'Mercado Pago'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Dirección:</span>
                      <span className="font-mono text-neutral-400 truncate max-w-[200px] text-right">
                        {selectedOrder?.address || 'Palermo, CABA'}
                      </span>
                    </div>
                  </div>

                  {selectedOrder?.items && selectedOrder.items.length > 0 && (
                    <div className="pt-2.5 border-t border-neutral-800">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block mb-1.5">
                        PRENDAS EN ESTE ENVÍO:
                      </span>
                      <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                        {selectedOrder.items.map((it, idx) => (
                          <div key={idx} className="text-xs text-neutral-200 flex items-center justify-between">
                            <span className="truncate pr-2">• {it.name} <span className="text-neutral-400">({it.size || 'L'})</span></span>
                            <span className="text-neutral-500 font-mono text-[11px] whitespace-nowrap">x{it.qty || 1}</span>
                          </div>
                        ))}
                      </div>
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
                      { step: 1, label: 'Pago Verificado', desc: 'Acreditado de forma segura', done: true, current: false },
                      { step: 2, label: 'Preparado en Depósito', desc: 'Empaque y control de calidad', done: isDelivered || isOutForDelivery, current: isPreparing },
                      { step: 3, label: 'Despachado con Andreani', desc: 'Asignado a chofer de reparto', done: isDelivered || isOutForDelivery, current: false },
                      { step: 4, label: 'En Reparto Móvil', desc: 'Camión en camino a tu domicilio', done: isDelivered, current: isOutForDelivery },
                      { step: 5, label: 'Entregado en Mano', desc: 'Firma y recepción conforme', done: isDelivered, current: isDelivered }
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
