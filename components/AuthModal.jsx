'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { formatCurrency } from '../lib/products';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    user,
    login,
    register,
    logout,
    orders,
    wishlist,
    products,
    setIsAdminModalOpen,
    openProductModal,
    openTrackingModal
  } = useApp();

  const [authTab, setAuthTab] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(loginEmail, loginPassword);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    register(regName, regEmail, regPassword);
  };

  const quickFillAdmin = () => {
    setLoginEmail('admin@taghers.com');
    setLoginPassword('admin123');
  };

  const quickFillDemo = () => {
    setLoginEmail('demo@taghers.com');
    setLoginPassword('123456');
  };

  // Favoritos del usuario
  const wishlistItems = products.filter((p) => wishlist.includes(p.id));

  // Órdenes exclusivas del usuario actual
  const userOrders = user
    ? orders.filter(
        (o) =>
          (o.email && o.email.toLowerCase() === user.email.toLowerCase()) ||
          (o.userId && o.userId === user.id)
      )
    : [];

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="modal-overlay active" id="authModal" style={{ zIndex: 1100 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60"
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            onClick={() => setIsAuthModalOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="modal-card modal-auth"
            style={{ position: 'relative', zIndex: 10 }}
          >
            <motion.button
              className="modal-close-btn"
              onClick={() => setIsAuthModalOpen(false)}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
              title="Cerrar modal"
            >
              <i className="fa-solid fa-xmark"></i>
            </motion.button>

            {!user ? (
              <div>
                <div className="auth-tabs">
                  <button
                    className={`auth-tab ${authTab === 'login' ? 'active' : ''}`}
                    onClick={() => setAuthTab('login')}
                  >
                    INICIAR SESIÓN
                  </button>
                  <button
                    className={`auth-tab ${authTab === 'register' ? 'active' : ''}`}
                    onClick={() => setAuthTab('register')}
                  >
                    CREAR CUENTA
                  </button>
                </div>

                {/* FORMULARIO LOGIN */}
                {authTab === 'login' && (
                  <form className="auth-form active" onSubmit={handleLoginSubmit}>
                    <div className="form-group">
                      <label>Correo Electrónico</label>
                      <input
                        type="email"
                        required
                        placeholder="admin@taghers.com o tu@correo.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Contraseña</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>
                    <motion.button
                      type="submit"
                      className="btn btn-primary btn-block"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      INGRESAR A MI CUENTA
                    </motion.button>

                    <div className="auth-credentials-hint">
                      <p>
                        <b>Administrador:</b> admin@taghers.com / admin123{' '}
                        <button type="button" onClick={quickFillAdmin} style={{ color: '#e2c044', textDecoration: 'underline', marginLeft: '6px' }}>
                          (Autocompletar)
                        </button>
                      </p>
                      <p>
                        <b>Cliente Demo:</b> demo@taghers.com / 123456{' '}
                        <button type="button" onClick={quickFillDemo} style={{ color: '#2a9d8f', textDecoration: 'underline', marginLeft: '6px' }}>
                          (Autocompletar)
                        </button>
                      </p>
                    </div>
                  </form>
                )}

                {/* FORMULARIO REGISTRO */}
                {authTab === 'register' && (
                  <form className="auth-form active" onSubmit={handleRegisterSubmit}>
                    <div className="form-group">
                      <label>Nombre Completo</label>
                      <input
                        type="text"
                        required
                        placeholder="Tu nombre y apellido"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Correo Electrónico</label>
                      <input
                        type="email"
                        required
                        placeholder="tu@correo.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Contraseña</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="Mínimo 6 caracteres"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                      />
                    </div>
                    <motion.button
                      type="submit"
                      className="btn btn-primary btn-block"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      REGISTRARME
                    </motion.button>
                  </form>
                )}
              </div>
            ) : (
              <div>
                <div className="profile-header">
                  <div className="profile-avatar">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="profile-user-info">
                    <h3>{user.name}</h3>
                    <span>{user.email}</span>
                    <div className="member-tag">
                      {user.role === 'admin' ? "ADMINISTRADOR TAGHER'S" : "CLIENTE VIP TAGHER'S"}
                    </div>
                  </div>
                </div>

                <div className="profile-section">
                  <h4>
                    <i className="fa-solid fa-clock-rotate-left"></i> Mis Pedidos Realizados ({userOrders.length})
                  </h4>
                  {userOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px 14px', backgroundColor: '#141416', borderRadius: '10px', border: '1px dashed #333' }}>
                      <i className="fa-solid fa-box-open" style={{ fontSize: '1.8rem', color: '#666', marginBottom: '8px' }}></i>
                      <p style={{ color: '#aaa', fontSize: '0.85rem', margin: '0 0 10px' }}>Aún no tienes pedidos registrados con tu cuenta.</p>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() => setIsAuthModalOpen(false)}
                      >
                        EXPLORAR CATÁLOGO
                      </button>
                    </div>
                  ) : (
                    <div className="orders-list">
                      {userOrders.map((ord) => (
                        <div
                          className="order-history-card"
                          key={ord.id}
                          style={{
                            padding: '12px 14px',
                            border: '1px solid #27272a',
                            borderRadius: '10px',
                            marginBottom: '10px',
                            backgroundColor: '#141416'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.92rem' }}>
                              Orden #{ord.id}
                            </span>
                            <span style={{ fontWeight: 900, color: '#e2c044', fontSize: '0.95rem' }}>
                              ${formatCurrency(ord.total)}
                            </span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: '#888', marginBottom: '8px' }}>
                            <span>{ord.date}</span>
                            <span
                              style={{
                                fontWeight: 800,
                                color: ord.status === 'En reparto' ? '#10b981' : ord.status === 'Entregado' ? '#60a5fa' : '#f59e0b',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                padding: '2px 8px',
                                borderRadius: '4px'
                              }}
                            >
                              {ord.status}
                            </span>
                          </div>

                          {ord.items && ord.items.length > 0 && (
                            <div style={{ fontSize: '0.74rem', color: '#bbb', marginBottom: '10px', borderTop: '1px solid #222', paddingTop: '6px' }}>
                              {ord.items.map((it, idx) => (
                                <div key={idx} style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                  • {it.name} (x{it.qty})
                                </div>
                              ))}
                            </div>
                          )}

                          <button
                            type="button"
                            className="btn btn-primary btn-block btn-sm"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              backgroundColor: '#10b981',
                              color: '#000',
                              fontWeight: 800,
                              fontSize: '0.78rem',
                              padding: '8px'
                            }}
                            onClick={() => {
                              setIsAuthModalOpen(false);
                              openTrackingModal(ord.id);
                            }}
                          >
                            <i className="fa-solid fa-truck-fast"></i> VER CAMIONCITO Y MAPA EN VIVO
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="profile-section">
                  <h4>
                    <i className="fa-solid fa-bookmark"></i> Prendas Guardadas ({wishlistItems.length})
                  </h4>
                  <div className="wishlist-previews">
                    {wishlistItems.length === 0 ? (
                      <p style={{ fontSize: '0.85rem', color: '#888' }}>Aún no tienes prendas en favoritos.</p>
                    ) : (
                      wishlistItems.map((item) => (
                        <motion.div
                          key={item.id}
                          className="wishlist-item-thumb cursor-pointer"
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setIsAuthModalOpen(false);
                            openProductModal(item);
                          }}
                          title={item.name}
                        >
                          <img src={item.image} alt={item.name} />
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>

                <div className="profile-actions">
                  {user.role === 'admin' && (
                    <motion.button
                      className="btn btn-dark btn-block mb-2"
                      onClick={() => {
                        setIsAuthModalOpen(false);
                        setIsAdminModalOpen(true);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <i className="fa-solid fa-chart-line"></i> ABRIR PANEL ADMINISTRADOR
                    </motion.button>
                  )}
                  <motion.button
                    className="btn btn-outline btn-block"
                    onClick={logout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket"></i> CERRAR SESIÓN
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
