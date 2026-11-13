'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context';

export default function Header() {
  const {
    setActiveCategory,
    openTryOnModal,
    setIsAdminModalOpen,
    setIsAuthModalOpen,
    setIsCartOpen,
    user,
    cart
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setMobileMenuOpen(false);
    const catalogElem = document.getElementById('catalogSection');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUserClick = () => {
    setIsAuthModalOpen(true);
  };

  const isUserAdmin = user?.role === 'admin';

  return (
    <header className="main-header" id="header">
      <div className="header-container">
        {/* LOGO */}
        <a
          href="#"
          className="brand-logo"
          onClick={(e) => {
            e.preventDefault();
            handleCategoryClick('todos');
          }}
        >
          <span className="logo-text">TAGHER'S</span>
        </a>

        {/* MENÚ DE NAVEGACIÓN DESKTOP */}
        <nav className="nav-menu">
          <ul className="nav-links">
            <li className="nav-item">
              <a
                href="#catalogSection"
                className="nav-link active"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick('todos');
                }}
              >
                TODO
              </a>
            </li>
            <li className="nav-item has-dropdown">
              <a
                href="#catalogSection"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick('ropa');
                }}
              >
                ROPA <i className="fa-solid fa-chevron-down nav-chevron"></i>
              </a>
              <div className="dropdown-menu">
                <a
                  href="#catalogSection"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick('vaqueros');
                  }}
                >
                  <i className="fa-solid fa-vest"></i> Vaqueros & Baggy
                </a>
                <a
                  href="#catalogSection"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick('camisetas');
                  }}
                >
                  <i className="fa-solid fa-shirt"></i> Camisetas & Chombas
                </a>
                <a
                  href="#catalogSection"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick('sudaderas');
                  }}
                >
                  <i className="fa-solid fa-vest-patches"></i> Sudaderas & Camperas
                </a>
                <a
                  href="#catalogSection"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick('chandals');
                  }}
                >
                  <i className="fa-solid fa-person-running"></i> Chándals & Track Jackets
                </a>
              </div>
            </li>
            <li className="nav-item has-dropdown">
              <a
                href="#catalogSection"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick('accesorios');
                }}
              >
                ACCESORIOS <i className="fa-solid fa-chevron-down nav-chevron"></i>
              </a>
              <div className="dropdown-menu">
                <a
                  href="#catalogSection"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick('cadenas');
                  }}
                >
                  <i className="fa-solid fa-link"></i> Cadenas & Collares
                </a>
                <a
                  href="#catalogSection"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick('pulseras');
                  }}
                >
                  <i className="fa-solid fa-circle-notch"></i> Pulseras & Tachas
                </a>
                <a
                  href="#catalogSection"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick('anillos');
                  }}
                >
                  <i className="fa-solid fa-gem"></i> Anillos
                </a>
                <a
                  href="#catalogSection"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick('cinturones');
                  }}
                >
                  <i className="fa-solid fa-ellipsis"></i> Cinturones Punk
                </a>
              </div>
            </li>
            <li className="nav-item">
              <a
                href="#catalogSection"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick('ofertas');
                }}
              >
                OFERTAS
              </a>
            </li>
          </ul>
        </nav>

        {/* ACCIONES DE CABECERA */}
        <div className="header-actions">
          {/* BOTÓN PROBADOR VIRTUAL */}
          <button
            className="action-btn ar-tryon-btn"
            onClick={() => openTryOnModal(null)}
            title="Probar prendas con tu cámara en vivo"
          >
            <i className="fa-solid fa-camera"></i>
            <span className="action-label">PROBADOR IA</span>
          </button>

          {/* BOTÓN SUPERVISOR (Visible siempre o para admin) */}
          <button
            className="action-btn admin-shortcut-btn"
            id="headerAdminBtn"
            onClick={() => setIsAdminModalOpen(true)}
            title="Panel de Supervisión y Base de Datos"
            style={{ display: isUserAdmin ? 'inline-flex' : 'inline-flex', opacity: isUserAdmin ? 1 : 0.85 }}
          >
            <i className="fa-solid fa-chart-line"></i>
            <span className="action-label admin-label">SUPERVISOR</span>
          </button>

          {/* BOTÓN USUARIO */}
          <div className="user-menu-wrapper">
            <button
              className="action-btn"
              id="userBtn"
              onClick={handleUserClick}
              title="Mi Cuenta"
            >
              <i className="fa-regular fa-user"></i>
              <span className="user-badge-name" id="userBadgeName">
                {user ? user.name.split(' ')[0].toUpperCase() : 'ENTRAR'}
              </span>
            </button>
          </div>

          {/* BOTÓN CARRITO */}
          <button
            className="action-btn cart-btn"
            onClick={() => setIsCartOpen(true)}
            title="Carrito de compras"
          >
            <i className="fa-solid fa-bag-shopping"></i>
            <span className="cart-count-badge" id="cartCountBadge">
              {totalCartCount}
            </span>
          </button>

          {/* BOTÓN MENÚ MÓVIL */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            title="Menú"
          >
            <i className={mobileMenuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" id="mobileNavDrawer" style={{ display: 'block' }}>
          <div className="mobile-nav-inner">
            <a href="#catalogSection" onClick={(e) => { e.preventDefault(); handleCategoryClick('todos'); }}>Ver Todo</a>
            <a href="#catalogSection" onClick={(e) => { e.preventDefault(); handleCategoryClick('vaqueros'); }}>Vaqueros Baggy</a>
            <a href="#catalogSection" onClick={(e) => { e.preventDefault(); handleCategoryClick('camisetas'); }}>Camisetas & Polos</a>
            <a href="#catalogSection" onClick={(e) => { e.preventDefault(); handleCategoryClick('sudaderas'); }}>Sudaderas & Camperas</a>
            <a href="#catalogSection" onClick={(e) => { e.preventDefault(); handleCategoryClick('accesorios'); }}>Accesorios (Cadenas, Anillos)</a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsAdminModalOpen(true);
                setMobileMenuOpen(false);
              }}
              style={{ color: '#e63946' }}
            >
              <i className="fa-solid fa-chart-line"></i> Panel Supervisor (Base de Datos)
            </a>
            <button
              className="mobile-ar-btn"
              onClick={() => {
                openTryOnModal(null);
                setMobileMenuOpen(false);
              }}
            >
              <i className="fa-solid fa-camera"></i> Abrir Probador Virtual con IA
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
