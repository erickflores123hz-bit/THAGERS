'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { formatCurrency } from '../lib/products';

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
    openProductModal
  } = useApp();

  const [authTab, setAuthTab] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isAuthModalOpen) return null;

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

  return (
    <div className="modal-overlay active" id="authModal">
      <div className="modal-card modal-auth">
        <button
          className="modal-close-btn"
          onClick={() => setIsAuthModalOpen(false)}
          title="Cerrar modal"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

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
                <button type="submit" className="btn btn-primary btn-block">
                  INGRESAR A MI CUENTA
                </button>

                <div className="auth-credentials-hint">
                  <p>
                    👑 <b>Administrador:</b> admin@taghers.com / admin123{' '}
                    <button type="button" onClick={quickFillAdmin} style={{ color: '#e2c044', textDecoration: 'underline', marginLeft: '6px' }}>
                      (Autocompletar)
                    </button>
                  </p>
                  <p>
                    👤 <b>Cliente Demo:</b> demo@taghers.com / 123456{' '}
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
                <button type="submit" className="btn btn-primary btn-block">
                  REGISTRARME
                </button>
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
                  {user.role === 'admin' ? 'ADMINISTRADOR TAGHER\'S' : 'CLIENTE VIP TAGHER\'S'}
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h4>
                <i className="fa-solid fa-clock-rotate-left"></i> Historial de Pedidos ({orders.length})
              </h4>
              <div className="orders-list">
                {orders.slice(0, 3).map((ord) => (
                  <div className="order-history-card" key={ord.id}>
                    <div className="order-history-header">
                      <b>#{ord.id}</b>
                      <span>${formatCurrency(ord.total)}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {ord.date} • {ord.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="profile-section">
              <h4>
                <i className="fa-solid fa-heart"></i> Guardados en Favoritos ({wishlistItems.length})
              </h4>
              <div className="wishlist-previews">
                {wishlistItems.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: '#888' }}>Aún no tienes prendas en favoritos.</p>
                ) : (
                  wishlistItems.map((item) => (
                    <div
                      key={item.id}
                      className="wishlist-item-thumb"
                      onClick={() => {
                        setIsAuthModalOpen(false);
                        openProductModal(item);
                      }}
                      title={item.name}
                    >
                      <img src={item.image} alt={item.name} />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="profile-actions">
              {user.role === 'admin' && (
                <button
                  className="btn btn-dark btn-block mb-2"
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    setIsAdminModalOpen(true);
                  }}
                >
                  <i className="fa-solid fa-chart-line"></i> ABRIR PANEL ADMINISTRADOR
                </button>
              )}
              <button className="btn btn-outline btn-block" onClick={logout}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i> CERRAR SESIÓN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
