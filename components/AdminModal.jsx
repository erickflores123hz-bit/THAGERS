'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { formatCurrency } from '../lib/products';

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
    setIsAuthModalOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState('metrics');
  const [dbSubtab, setDbSubtab] = useState('users');

  if (!isAdminModalOpen) return null;

  // Control estricto de acceso exclusivo para rol de Administrador
  if (user?.role !== 'admin') {
    return (
      <div className="modal-overlay active" id="adminModal">
        <div className="modal-card" style={{ maxWidth: '420px', textAlign: 'center', padding: '36px 24px', borderRadius: '16px' }}>
          <i className="fa-solid fa-shield-halved" style={{ fontSize: '3.2rem', color: '#e63946', marginBottom: '16px' }}></i>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>ACCESO RESTRINGIDO</h3>
          <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '24px' }}>
            Este panel de supervisión y base de datos es de uso exclusivo para cuentas con rol de <b>Administrador</b>.
          </p>
          <button
            className="btn btn-primary btn-block"
            onClick={() => {
              setIsAdminModalOpen(false);
              setIsAuthModalOpen(true);
            }}
          >
            <i className="fa-solid fa-lock"></i> INICIAR SESIÓN COMO ADMIN
          </button>
          <button
            className="btn btn-sm btn-outline btn-block mt-2"
            onClick={() => setIsAdminModalOpen(false)}
          >
            VOLVER A LA TIENDA
          </button>
        </div>
      </div>
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
    showToast('¡Backup JSON de la base de datos descargado!', 'success');
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
    showToast('✓ Script SQL para Supabase copiado al portapapeles', 'success');
  };

  return (
    <div className="modal-overlay active" id="adminModal">
      <div className="modal-card modal-admin">
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
          <button
            className="modal-close-btn"
            onClick={() => setIsAdminModalOpen(false)}
            title="Cerrar panel supervisor"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
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
                          <span className="badge-status">{ord.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VISTA 6: EXPLORADOR DE BASE DE DATOS */}
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
      </div>
    </div>
  );
}
