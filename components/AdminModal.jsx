'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { formatCurrency } from '../lib/products';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminModal() {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    products,
    users,
    orders,
    restockProduct,
    showToast,
    user,
    setIsAuthModalOpen,
    addProduct,
    updateOrderStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState('metrics');
  const [dbSubtab, setDbSubtab] = useState('users');

  // Formulario de Nueva Prenda
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('sudaderas');
  const [newProductPrice, setNewProductPrice] = useState('48000');
  const [newProductStock, setNewProductStock] = useState('20');
  const [newProductBadge, setNewProductBadge] = useState('DROP 2026');
  const [newProductImage, setNewProductImage] = useState('/assets/models/afro_model_red_hoodie.jpg');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductSizes, setNewProductSizes] = useState(['M', 'L', 'XL']);

  const toggleNewProductSize = (sz) => {
    setNewProductSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    addProduct({
      name: newProductName.trim(),
      category: newProductCategory,
      price: parseInt(newProductPrice, 10) || 45000,
      stock: parseInt(newProductStock, 10) || 15,
      badge: newProductBadge.trim() || undefined,
      image: newProductImage.trim() || '/assets/models/afro_model_red_hoodie.jpg',
      description: newProductDesc.trim() || "Prenda de diseño streetwear TAGHER'S Archive 2026.",
      sizes: newProductSizes.length > 0 ? newProductSizes : ['S', 'M', 'L', 'XL']
    });

    setNewProductName('');
    setNewProductDesc('');
    setActiveTab('stock');
  };

  if (!isAdminModalOpen) return null;

  // Control estricto de acceso exclusivo para rol de Administrador
  if (user?.role !== 'admin') {
    return (
      <AnimatePresence>
        {isAdminModalOpen && (
          <div className="modal-overlay active" id="adminModal" style={{ zIndex: 1100 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60"
              style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
              onClick={() => setIsAdminModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="modal-card"
              style={{ maxWidth: '420px', textAlign: 'center', padding: '36px 24px', borderRadius: '16px', position: 'relative', zIndex: 10 }}
            >
              <i className="fa-solid fa-shield-halved" style={{ fontSize: '3.2rem', color: '#e63946', marginBottom: '16px' }}></i>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>ACCESO RESTRINGIDO</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '24px' }}>
                Este panel de supervisión y base de datos es de uso exclusivo para cuentas con rol de <b>Administrador</b>.
              </p>
              <motion.button
                className="btn btn-primary btn-block"
                onClick={() => {
                  setIsAdminModalOpen(false);
                  setIsAuthModalOpen(true);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <i className="fa-solid fa-lock"></i> INICIAR SESIÓN COMO ADMIN
              </motion.button>
              <motion.button
                className="btn btn-sm btn-outline btn-block mt-2"
                onClick={() => setIsAdminModalOpen(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                VOLVER A LA TIENDA
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  // Cálculos de métricas
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  const totalOrdersCount = orders.length;
  const totalUsersCount = users.length;
  const lowStockProducts = products.filter((p) => p.stock < 10);

  // Producto estrella (más vendido o mayor recaudación)
  const sortedBySales = [...products].sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0));
  const topProduct = sortedBySales[0] || products[0];
  const topProductRevenue = (topProduct.unitsSold || 0) * topProduct.price;

  // Descargar Backup JSON
  const downloadDbBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      store: "TAGHER'S STREETWEAR",
      users,
      products,
      orders
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taghers_db_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON de la base de datos descargado', 'success');
  };

  // Copiar SQL para Supabase
  const copySupabaseSql = () => {
    const sql = `-- ESQUEMA POSTGRESQL PARA SUPABASE (TAGHER'S)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  old_price NUMERIC,
  stock INT DEFAULT 0,
  units_sold INT DEFAULT 0,
  badge TEXT,
  image TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  email TEXT NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'En preparación',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

    navigator.clipboard.writeText(sql);
    showToast('Script SQL para Supabase copiado al portapapeles', 'success');
  };

  return (
    <AnimatePresence>
      {isAdminModalOpen && (
        <div className="modal-overlay active" id="adminModal" style={{ zIndex: 1100 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60"
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            onClick={() => setIsAdminModalOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="modal-card modal-admin"
            style={{ position: 'relative', zIndex: 10 }}
          >
            <div className="admin-header">
              <div className="admin-title-wrap">
                <i className="fa-solid fa-chart-line"></i>
                <div>
                  <h3>PANEL DE SUPERVISIÓN & BASE DE DATOS</h3>
                  <span className="admin-sub">
                    Métricas de ventas, control de inventario y visor de base de datos
                  </span>
                </div>
              </div>
              <motion.button
                className="modal-close-btn"
                onClick={() => setIsAdminModalOpen(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.15 }}
                title="Cerrar panel supervisor"
              >
                <i className="fa-solid fa-xmark"></i>
              </motion.button>
            </div>

        {/* TABS DE SUPERVISIÓN */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'metrics' ? 'active' : ''}`}
            onClick={() => setActiveTab('metrics')}
          >
            <i className="fa-solid fa-gauge-high"></i> Resumen Ejecutivo
          </button>
          <button
            className={`admin-tab ${activeTab === 'ranking' ? 'active' : ''}`}
            onClick={() => setActiveTab('ranking')}
          >
            <i className="fa-solid fa-trophy"></i> Top Más Vendidos
          </button>
          <button
            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="fa-solid fa-users"></i> Directorio Usuarios
          </button>
          <button
            className={`admin-tab ${activeTab === 'stock' ? 'active' : ''}`}
            onClick={() => setActiveTab('stock')}
          >
            <i className="fa-solid fa-boxes-stacked"></i> Alertas Stock ({lowStockProducts.length})
          </button>
          <button
            className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="fa-solid fa-cart-flatbed"></i> Pedidos Recibidos ({orders.length})
          </button>
          <button
            className={`admin-tab ${activeTab === 'new-product' ? 'active' : ''}`}
            onClick={() => setActiveTab('new-product')}
            style={{ color: '#10b981', fontWeight: 800 }}
          >
            <i className="fa-solid fa-plus-circle"></i> + Nueva Prenda
          </button>
          <button
            className={`admin-tab ${activeTab === 'database' ? 'active' : ''}`}
            onClick={() => setActiveTab('database')}
          >
            <i className="fa-solid fa-database"></i> Explorador BD
          </button>
        </div>

        <div className="admin-body">
          {/* VISTA 1: RESUMEN EJECUTIVO & KPIS */}
          {activeTab === 'metrics' && (
            <div className="admin-view active">
              <div className="kpi-grid">
                <div className="kpi-card">
                  <span className="kpi-label">FACTURACIÓN TOTAL</span>
                  <h2 className="kpi-value">${formatCurrency(totalRevenue)}</h2>
                  <span className="kpi-tag positive">
                    <i className="fa-solid fa-arrow-trend-up"></i> Total recaudado por órdenes
                  </span>
                </div>
                <div className="kpi-card">
                  <span className="kpi-label">TOTAL DE PEDIDOS</span>
                  <h2 className="kpi-value">{totalOrdersCount}</h2>
                  <span className="kpi-tag">
                    <i className="fa-solid fa-bag-shopping"></i> Compras completadas
                  </span>
                </div>
                <div className="kpi-card">
                  <span className="kpi-label">USUARIOS EN BD</span>
                  <h2 className="kpi-value">{totalUsersCount}</h2>
                  <span className="kpi-tag">
                    <i className="fa-solid fa-users"></i> Clientes registrados
                  </span>
                </div>
                <div className="kpi-card">
                  <span className="kpi-label">STOCK EN RIESGO (&lt;10 u.)</span>
                  <h2 className="kpi-value text-warning">{lowStockProducts.length}</h2>
                  <span className="kpi-tag">
                    <i className="fa-solid fa-triangle-exclamation"></i> Requieren reposición
                  </span>
                </div>
              </div>

              {/* PRODUCTO ESTRELLA */}
              <div className="top-product-widget">
                <div className="top-product-header">
                  <i className="fa-solid fa-crown trophy-icon"></i>
                  <div>
                    <h4>PRODUCTO ESTRELLA DEL CATÁLOGO</h4>
                    <p>La prenda que más ingresos y demanda ha generado en la tienda</p>
                  </div>
                </div>
                <div className="top-product-card">
                  <img src={topProduct.image} alt={topProduct.name} />
                  <div className="top-product-details">
                    <h3>{topProduct.name}</h3>
                    <span className="top-product-badge">{topProduct.badge || 'TOP SELLER'}</span>
                    <div className="top-stats-row">
                      <div>
                        <span>Unidades Vendidas:</span> <b>{topProduct.unitsSold || 0} u.</b>
                      </div>
                      <div>
                        <span>Precio Unitario:</span> <b>${formatCurrency(topProduct.price)}</b>
                      </div>
                      <div>
                        <span>Recaudación Generada:</span>{' '}
                        <b style={{ color: '#16a34a' }}>${formatCurrency(topProductRevenue)}</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISTA 2: RANKING */}
          {activeTab === 'ranking' && (
            <div className="admin-view active">
              <div className="stock-alerts-header">
                <h4>
                  <i className="fa-solid fa-chart-column text-primary"></i> Ranking de Demanda y Facturación por Prenda
                </h4>
                <p>Cuadro visual comparativo con las prendas más vendidas del catálogo.</p>
              </div>
              <div className="ranking-cards-container">
                {sortedBySales.map((prod, index) => {
                  const maxUnits = sortedBySales[0]?.unitsSold || 1;
                  const percent = Math.round(((prod.unitsSold || 0) / maxUnits) * 100);
                  const prodRevenue = (prod.unitsSold || 0) * prod.price;

                  return (
                    <div className="ranking-item-card" key={prod.id}>
                      <span className="ranking-number">#{index + 1}</span>
                      <img src={prod.image} alt={prod.name} className="ranking-thumb" />
                      <div className="ranking-info">
                        <h5>{prod.name}</h5>
                        <div className="ranking-bar-wrap">
                          <div className="ranking-bar-fill" style={{ width: `${percent}%` }}></div>
                        </div>
                        <div className="ranking-sub-stats">
                          <span><b>{prod.unitsSold || 0}</b> unidades vendidas</span>
                          <span style={{ color: '#16a34a' }}><b>${formatCurrency(prodRevenue)}</b> recaudados</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VISTA 3: USUARIOS */}
          {activeTab === 'users' && (
            <div className="admin-view active">
              <div className="stock-alerts-header">
                <h4>
                  <i className="fa-solid fa-users text-primary"></i> Cuentas Registradas en la Base de Datos
                </h4>
                <p>Supervisa todos los usuarios creados, sus roles de acceso y actividad de compra.</p>
              </div>
              <div className="stock-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Correo Electrónico</th>
                      <th>Teléfono</th>
                      <th>Rol</th>
                      <th>Fecha Registro</th>
                      <th>Pedidos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td><b>{u.name}</b></td>
                        <td>{u.email}</td>
                        <td>{u.phone || 'No especificado'}</td>
                        <td>
                          <span className={u.role === 'admin' ? 'badge-admin-role' : 'badge-user-role'}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td>{u.createdAt}</td>
                        <td><b>{u.ordersCount || 0}</b></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VISTA 4: ALERTAS DE STOCK */}
          {activeTab === 'stock' && (
            <div className="admin-view active">
              <div className="stock-alerts-header">
                <h4>
                  <i className="fa-solid fa-triangle-exclamation text-warning"></i> Prendas con Stock Crítico (&lt; 10 unidades)
                </h4>
                <p>Estas prendas requieren reposición urgente. Puedes sumar +10 unidades al instante con un solo clic.</p>
              </div>
              <div className="stock-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Prenda</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock Actual</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((p) => (
                      <tr key={p.id}>
                        <td><b>{p.name}</b></td>
                        <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                        <td>${formatCurrency(p.price)}</td>
                        <td>
                          <span className="stock-danger-badge">{p.stock} un.</span>
                        </td>
                        <td>
                          {p.stock <= 4 ? (
                            <span style={{ color: '#e63946', fontWeight: 700 }}>Crítico</span>
                          ) : (
                            <span style={{ color: '#d97706', fontWeight: 600 }}>Bajo</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-dark"
                            onClick={() => restockProduct(p.id, 10)}
                          >
                            <i className="fa-solid fa-plus"></i> +10 Reponer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VISTA 5: PEDIDOS RECIBIDOS */}
          {activeTab === 'orders' && (
            <div className="admin-view active">
              <div className="stock-alerts-header">
                <h4>
                  <i className="fa-solid fa-list-check"></i> Todas las Órdenes de Compra
                </h4>
                <p>Supervisa el estado y actualiza el seguimiento en tiempo real para los clientes.</p>
              </div>
              <div className="stock-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID Orden</th>
                      <th>Cliente</th>
                      <th>Prendas</th>
                      <th>Total</th>
                      <th>Método Pago</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord.id}>
                        <td><b>#{ord.id}</b></td>
                        <td>
                          <div>{ord.customer}</div>
                          <small style={{ color: '#777' }}>{ord.email}</small>
                        </td>
                        <td>
                          {ord.items?.map((it, idx) => (
                            <div key={idx} style={{ fontSize: '0.85rem' }}>
                              • {it.name} (x{it.qty})
                            </div>
                          ))}
                        </td>
                        <td><b>${formatCurrency(ord.total)}</b></td>
                        <td>{ord.paymentMethod}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <select
                              value={ord.status || 'En preparación'}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                border: '1px solid #444',
                                backgroundColor: '#141416',
                                color: ord.status === 'En reparto' ? '#10b981' : ord.status === 'Entregado' ? '#60a5fa' : '#f59e0b',
                                fontWeight: 800,
                                fontSize: '0.78rem',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="Pago Aprobado">Pago Aprobado</option>
                              <option value="En preparación">En preparación</option>
                              <option value="En reparto">En reparto (Camión en Ruta)</option>
                              <option value="Entregado">Entregado</option>
                            </select>
                            {ord.status === 'En reparto' && (
                              <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <i className="fa-solid fa-truck-fast"></i> Camión activo en mapa GPS
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VISTA 6: ALTA DE NUEVA PRENDA (CRUD) */}
          {activeTab === 'new-product' && (
            <div className="admin-view active">
              <div className="stock-alerts-header">
                <h4>
                  <i className="fa-solid fa-plus-circle text-primary"></i> Publicar Nueva Prenda en el Catálogo
                </h4>
                <p>Crea un nuevo artículo con stock, talle, categoría e imagen para que aparezca instantáneamente en la tienda.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'start' }}>
                <form onSubmit={handleCreateProduct} style={{ backgroundColor: '#141416', padding: '20px', borderRadius: '12px', border: '1px solid #27272a' }}>
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Nombre del Producto</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Sudadera Zip Y2K Dark Metal"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#0d0d0e', color: '#fff' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Categoría</label>
                      <select
                        value={newProductCategory}
                        onChange={(e) => setNewProductCategory(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#0d0d0e', color: '#fff' }}
                      >
                        <option value="vaqueros">Vaqueros Baggy</option>
                        <option value="camisetas">Camisetas & Polos</option>
                        <option value="sudaderas">Sudaderas & Hoodies</option>
                        <option value="chandals">Chándals & Track</option>
                        <option value="accesorios">Accesorios & Cadenas</option>
                        <option value="cinturones">Cinturones Punk</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Etiqueta / Badge</label>
                      <input
                        type="text"
                        placeholder="Ej: DROP 2026, EXCLUSIVO"
                        value={newProductBadge}
                        onChange={(e) => setNewProductBadge(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#0d0d0e', color: '#fff' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Precio (ARS)</label>
                      <input
                        type="number"
                        required
                        min="1000"
                        placeholder="48000"
                        value={newProductPrice}
                        onChange={(e) => setNewProductPrice(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#0d0d0e', color: '#fff' }}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Stock Inicial (Unidades)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="20"
                        value={newProductStock}
                        onChange={(e) => setNewProductStock(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#0d0d0e', color: '#fff' }}
                      />
                    </div>
                  </div>

                  {/* SELECCIÓN DE TALLES */}
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, display: 'block', marginBottom: '6px' }}>Talles Disponibles:</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                        const checked = newProductSizes.includes(sz);
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => toggleNewProductSize(sz)}
                            style={{
                              padding: '6px 14px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              border: checked ? '1px solid #10b981' : '1px solid #333',
                              backgroundColor: checked ? 'rgba(16, 185, 129, 0.15)' : '#0d0d0e',
                              color: checked ? '#10b981' : '#888'
                            }}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* IMAGEN DEL PRODUCTO */}
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>URL de Imagen</label>
                    <input
                      type="text"
                      required
                      value={newProductImage}
                      onChange={(e) => setNewProductImage(e.target.value)}
                      placeholder="/assets/models/afro_model_red_hoodie.jpg"
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#0d0d0e', color: '#fff', fontSize: '0.85rem' }}
                    />
                    {/* Botones de sugerencias rápidas */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => setNewProductImage('/assets/models/afro_model_red_hoodie.jpg')}
                        style={{ padding: '3px 8px', fontSize: '0.72rem', backgroundColor: '#222', color: '#bbb', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                      >
                        Hoodie Rojo
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewProductImage('/assets/models/afro_model_retro_track.jpg')}
                        style={{ padding: '3px 8px', fontSize: '0.72rem', backgroundColor: '#222', color: '#bbb', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                      >
                        Track Jacket
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewProductImage('/assets/models/afro_model_ecko_affliction.jpg')}
                        style={{ padding: '3px 8px', fontSize: '0.72rem', backgroundColor: '#222', color: '#bbb', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                      >
                        Vaquero Southpole
                      </button>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '18px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>Descripción / Detalles</label>
                    <textarea
                      rows={2}
                      value={newProductDesc}
                      onChange={(e) => setNewProductDesc(e.target.value)}
                      placeholder="Confeccionado en algodón pesado de 400 GSM con lavado ácido y calce oversize."
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#0d0d0e', color: '#fff', resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    style={{ padding: '12px', fontSize: '0.9rem', fontWeight: 800, background: '#10b981', color: '#000' }}
                  >
                    <i className="fa-solid fa-plus-circle"></i> PUBLICAR PRENDA EN CATÁLOGO
                  </button>
                </form>

                {/* PREVIEW DE LA TARJETA */}
                <div style={{ backgroundColor: '#141416', padding: '16px', borderRadius: '12px', border: '1px solid #27272a' }}>
                  <span style={{ fontSize: '0.72rem', color: '#888', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                    <i className="fa-solid fa-eye"></i> VISTA PREVIA EN TIENDA
                  </span>
                  <div style={{ backgroundColor: '#09090b', borderRadius: '8px', overflow: 'hidden', border: '1px solid #222' }}>
                    <div style={{ height: '220px', overflow: 'hidden', position: 'relative', backgroundColor: '#18181b' }}>
                      {newProductBadge && (
                        <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#e2c044', color: '#000', fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', zIndex: 2 }}>
                          {newProductBadge}
                        </span>
                      )}
                      <img
                        src={newProductImage || '/assets/models/afro_model_red_hoodie.jpg'}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.src = '/assets/models/afro_model_red_hoodie.jpg'; }}
                      />
                    </div>
                    <div style={{ padding: '12px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#a1a1aa', textTransform: 'uppercase', fontWeight: 700 }}>
                        {newProductCategory}
                      </span>
                      <h5 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '4px 0 8px', color: '#fff' }}>
                        {newProductName || 'Nombre de la Prenda'}
                      </h5>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#e2c044' }}>
                          ${formatCurrency(parseInt(newProductPrice, 10) || 48000)}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                          Stock: {newProductStock || 20} un.
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                        {newProductSizes.map((s) => (
                          <span key={s} style={{ fontSize: '0.65rem', padding: '2px 6px', backgroundColor: '#222', borderRadius: '3px', color: '#bbb' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISTA 7: EXPLORADOR DE BASE DE DATOS */}
          {activeTab === 'database' && (
            <div className="admin-view active">
              <div className="db-viewer-header">
                <div>
                  <h4>
                    <i className="fa-solid fa-database"></i> Explorador Interactivo de Tablas
                  </h4>
                  <p>Inspecciona las tablas con formato estructurado o copia el script SQL para Supabase.</p>
                </div>
                <div className="db-actions">
                  <button className="btn btn-sm btn-dark" onClick={downloadDbBackup}>
                    <i className="fa-solid fa-download"></i> Descargar Backup JSON
                  </button>
                  <button className="btn btn-sm btn-outline" onClick={copySupabaseSql}>
                    <i className="fa-solid fa-copy"></i> Copiar SQL Supabase
                  </button>
                </div>
              </div>

              {/* SELECTOR DE TABLA */}
              <div className="db-subtabs-row">
                <button
                  className={`db-subtab ${dbSubtab === 'users' ? 'active' : ''}`}
                  onClick={() => setDbSubtab('users')}
                >
                  <i className="fa-solid fa-users"></i> Tabla: Usuarios ({users.length})
                </button>
                <button
                  className={`db-subtab ${dbSubtab === 'products' ? 'active' : ''}`}
                  onClick={() => setDbSubtab('products')}
                >
                  <i className="fa-solid fa-shirt"></i> Tabla: Productos ({products.length})
                </button>
                <button
                  className={`db-subtab ${dbSubtab === 'orders' ? 'active' : ''}`}
                  onClick={() => setDbSubtab('orders')}
                >
                  <i className="fa-solid fa-bag-shopping"></i> Tabla: Pedidos ({orders.length})
                </button>
                <button
                  className={`db-subtab ${dbSubtab === 'raw' ? 'active' : ''}`}
                  onClick={() => setDbSubtab('raw')}
                >
                  <i className="fa-solid fa-code"></i> JSON Crudo
                </button>
              </div>

              <div className="db-table-display-container">
                {dbSubtab === 'users' && (
                  <pre className="db-json-block">{JSON.stringify(users, null, 2)}</pre>
                )}
                {dbSubtab === 'products' && (
                  <pre className="db-json-block">{JSON.stringify(products, null, 2)}</pre>
                )}
                {dbSubtab === 'orders' && (
                  <pre className="db-json-block">{JSON.stringify(orders, null, 2)}</pre>
                )}
                {dbSubtab === 'raw' && (
                  <pre className="db-json-block">
                    {JSON.stringify({ users, products, orders }, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
