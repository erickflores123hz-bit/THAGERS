'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../lib/context';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const {
    setActiveCategory,
    openSmartSizerModal,
    openTrackingModal,
    setIsAdminModalOpen,
    setIsAuthModalOpen,
    setIsCartOpen,
    user,
    cart
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

        {/* ACCIONES DE CABECERA CON MICRO-INTERACCIONES */}
        <div className="header-actions">
          {/* BOTÓN SEGUIMIENTO GPS */}
          <motion.button
            className="action-btn"
            style={{ borderColor: 'rgba(52, 211, 153, 0.4)', color: '#34d399' }}
            onClick={() => openTrackingModal()}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            title="Rastrear mi pedido con mapa en vivo y camioncito"
          >
            <i className="fa-solid fa-truck-fast"></i>
            <span className="action-label" style={{ color: '#34d399' }}>SEGUIMIENTO</span>
          </motion.button>

          {/* BOTÓN ASESOR DE TALLE */}
          <motion.button
            className="action-btn ar-tryon-btn"
            onClick={openSmartSizerModal}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            title="Calcular mi talle ideal para corte Baggy"
          >
            <i className="fa-solid fa-ruler-combined"></i>
            <span className="action-label">ASESOR TALLE</span>
          </motion.button>

          {/* BOTÓN SUPERVISOR (EXCLUSIVO PARA CUENTA ADMINISTRADOR) */}
          {isUserAdmin && (
            <motion.button
              className="action-btn admin-shortcut-btn"
              id="headerAdminBtn"
              onClick={() => setIsAdminModalOpen(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              title="Panel de Supervisión y Base de Datos"
            >
              <i className="fa-solid fa-chart-line"></i>
              <span className="action-label admin-label">SUPERVISOR</span>
            </motion.button>
          )}

          {/* BOTÓN USUARIO */}
          <div className="user-menu-wrapper">
            <motion.button
              className="action-btn"
              id="userBtn"
              onClick={handleUserClick}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              title="Mi Cuenta"
            >
              <i className="fa-regular fa-user"></i>
              <span className="user-badge-name" id="userBadgeName" suppressHydrationWarning>
                {mounted && user ? user.name.split(' ')[0].toUpperCase() : 'ENTRAR'}
              </span>
            </motion.button>
          </div>

          {/* BOTÓN CARRITO */}
          <motion.button
            className="action-btn cart-btn"
            onClick={() => setIsCartOpen(true)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            title="Carrito de compras"
          >
            <i className="fa-solid fa-bag-shopping"></i>
            <AnimatePresence mode="wait">
              {mounted && totalCartCount > 0 && (
                <motion.span
                  key={totalCartCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="cart-count-badge"
                  id="cartCountBadge"
                  suppressHydrationWarning
                >
                  {totalCartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* BOTÓN MENÚ MÓVIL */}
          <motion.button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
            title="Menú"
          >
            <i className={mobileMenuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
          </motion.button>
        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE CON ANIMACIÓN SUAVE */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mobile-nav-drawer"
            id="mobileNavDrawer"
            style={{ display: 'block', overflow: 'hidden' }}
          >
            <div className="mobile-nav-inner">
              <a href="#catalogSection" onClick={(e) => { e.preventDefault(); handleCategoryClick('todos'); }}>Ver Todo</a>
              <a href="#catalogSection" onClick={(e) => { e.preventDefault(); handleCategoryClick('vaqueros'); }}>Vaqueros Baggy</a>
              <a href="#catalogSection" onClick={(e) => { e.preventDefault(); handleCategoryClick('camisetas'); }}>Camisetas & Polos</a>
              <a href="#catalogSection" onClick={(e) => { e.preventDefault(); handleCategoryClick('sudaderas'); }}>Sudaderas & Camperas</a>
              <a href="#catalogSection" onClick={(e) => { e.preventDefault(); handleCategoryClick('accesorios'); }}>Accesorios (Cadenas, Anillos)</a>
              {isUserAdmin && (
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
              )}
              <button
                className="mobile-ar-btn"
                style={{ borderColor: 'rgba(52, 211, 153, 0.4)', color: '#34d399', marginBottom: '8px' }}
                onClick={() => {
                  openTrackingModal();
                  setMobileMenuOpen(false);
                }}
              >
                <i className="fa-solid fa-truck-fast"></i> Rastrear Pedido con GPS
              </button>
              <button
                className="mobile-ar-btn"
                onClick={() => {
                  openSmartSizerModal();
                  setMobileMenuOpen(false);
                }}
              >
                <i className="fa-solid fa-ruler-combined"></i> Asesor de Talle (Corte Baggy)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
