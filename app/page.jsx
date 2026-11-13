'use client';

import React from 'react';
import TopAnnouncement from '../components/TopAnnouncement';
import Header from '../components/Header';
import ScrollExpandHero from '../components/ScrollExpandHero';
import Catalog from '../components/Catalog';
import ArFeatureBanner from '../components/ArFeatureBanner';
import Footer from '../components/Footer';

import ProductModal from '../components/ProductModal';
import VirtualTryOnModal from '../components/VirtualTryOnModal';
import SmartSizerModal from '../components/SmartSizerModal';
import CartDrawer from '../components/CartDrawer';
import CheckoutModal from '../components/CheckoutModal';
import AdminModal from '../components/AdminModal';
import AuthModal from '../components/AuthModal';
import ToastContainer from '../components/ToastContainer';

export default function HomePage() {
  return (
    <div className="taghers-root-wrapper">
      {/* BARRA SUPERIOR CON ANUNCIO SCROLLING */}
      <TopAnnouncement />

      {/* CABECERA & NAVEGACIÓN */}
      <Header />

      {/* SECCIÓN HERO EXPANDIBLE CON MODELO AFRODESCENDIENTE */}
      <ScrollExpandHero />

      {/* CATÁLOGO PRINCIPAL CON FILTROS Y ORDENAMIENTO */}
      <Catalog />

      {/* BANNER PROBADOR VIRTUAL & ASESOR DE TALLE */}
      <ArFeatureBanner />

      {/* PIE DE PÁGINA */}
      <Footer />

      {/* MODALES Y ELEMENTOS INTERACTIVOS */}
      <ProductModal />
      <VirtualTryOnModal />
      <SmartSizerModal />
      <CartDrawer />
      <CheckoutModal />
      <AdminModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
}
