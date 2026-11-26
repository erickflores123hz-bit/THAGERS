'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS } from './products';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const AppContext = createContext(null);

const DEFAULT_USERS = [
  {
    id: 'usr-admin',
    name: "Administrador TAGHER'S",
    email: 'admin@taghers.com',
    password: 'admin123',
    phone: '+54 9 11 9999-0000',
    role: 'admin',
    createdAt: '2026-01-10',
    ordersCount: 14
  },
  {
    id: 'usr-demo',
    name: 'Erick Flores (Demo)',
    email: 'demo@taghers.com',
    password: '123456',
    phone: '+54 9 11 4455-8899',
    role: 'customer',
    createdAt: '2026-02-15',
    ordersCount: 3
  }
];

const DEFAULT_ORDERS = [
  {
    id: 'TAG-8941',
    customer: 'Erick Flores',
    email: 'demo@taghers.com',
    items: [
      { name: "True Religion Crimson Gothic 'REL' Heavy Zip Hoodie", size: 'L', qty: 1, price: 115000 },
      { name: "Ecko Unltd 2000s Heavy Embroidered Baggy Jeans", size: 'L', qty: 1, price: 92000 }
    ],
    total: 207000,
    paymentMethod: 'Mercado Pago',
    status: 'En preparación',
    date: '2026-10-22'
  },
  {
    id: 'TAG-8910',
    customer: 'Lucas Benítez',
    email: 'lucas@gmail.com',
    items: [
      { name: "Affliction Style Cyber Gothic Wings & Cross Tee", size: 'XL', qty: 2, price: 44000 }
    ],
    total: 88000,
    paymentMethod: 'Tarjeta de Crédito',
    status: 'Enviado',
    date: '2026-10-20'
  },
  {
    id: 'TAG-8865',
    customer: 'Valentina Rossi',
    email: 'valen.r@hotmail.com',
    items: [
      { name: "Cadena Cubana Gruesa 14mm Acero Inoxidable Silver", size: 'Única', qty: 1, price: 28000 }
    ],
    total: 28000,
    paymentMethod: 'Mercado Pago',
    status: 'Entregado',
    date: '2026-10-18'
  }
];

export function AppProvider({ children }) {
  // Estado de Productos
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // Estado de Usuarios
  const [users, setUsers] = useState(DEFAULT_USERS);

  // Usuario Activo (Sesión)
  const [user, setUser] = useState(null);

  // Carrito de compras
  const [cart, setCart] = useState([]);

  // Lista de Favoritos (Wishlist)
  const [wishlist, setWishlist] = useState(['hoodie-true-rel', 'vag-ecko']);

  // Cupón de descuento
  const [coupon, setCoupon] = useState(null);

  // Órdenes
  const [orders, setOrders] = useState(DEFAULT_ORDERS);

  // Bandera de hidratación segura para LocalStorage
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  // Carga inicial desde LocalStorage en cliente para evitar Hydration Mismatch
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedUsers = localStorage.getItem('taghers_users_v2');
        if (savedUsers) setUsers(JSON.parse(savedUsers));

        const savedUser = localStorage.getItem('taghers_session_user_v2');
        if (savedUser) setUser(JSON.parse(savedUser));

        const savedCart = localStorage.getItem('taghers_cart_v2');
        if (savedCart) setCart(JSON.parse(savedCart));

        const savedWishlist = localStorage.getItem('taghers_wishlist_v2');
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

        const savedCoupon = localStorage.getItem('taghers_coupon_v2');
        if (savedCoupon) setCoupon(JSON.parse(savedCoupon));

        const savedOrders = localStorage.getItem('taghers_orders_v2');
        if (savedOrders) setOrders(JSON.parse(savedOrders));
      }
    } catch (e) {
      console.error('Error cargando almacenamiento local', e);
    }
    setIsStorageLoaded(true);
  }, []);

  // Filtros de navegación
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [maxPrice, setMaxPrice] = useState(150000);

  // Modales
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSmartSizerModalOpen, setIsSmartSizerModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingOrderCode, setTrackingOrderCode] = useState('TAG-9421');
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState(null);

  // Prenda seleccionada para Modales
  const [selectedProduct, setSelectedProduct] = useState(INITIAL_PRODUCTS[0]);
  const [recommendedSize, setRecommendedSize] = useState('L');

  // Toasts de notificación
  const [toasts, setToasts] = useState([]);

  // Persistencia local
  useEffect(() => {
    if (isStorageLoaded && typeof window !== 'undefined') {
      localStorage.setItem('taghers_cart_v2', JSON.stringify(cart));
    }
  }, [cart, isStorageLoaded]);

  useEffect(() => {
    if (isStorageLoaded && typeof window !== 'undefined') {
      localStorage.setItem('taghers_wishlist_v2', JSON.stringify(wishlist));
    }
  }, [wishlist, isStorageLoaded]);

  useEffect(() => {
    if (isStorageLoaded && typeof window !== 'undefined') {
      localStorage.setItem('taghers_users_v2', JSON.stringify(users));
    }
  }, [users, isStorageLoaded]);

  useEffect(() => {
    if (isStorageLoaded && typeof window !== 'undefined') {
      localStorage.setItem('taghers_orders_v2', JSON.stringify(orders));
    }
  }, [orders, isStorageLoaded]);

  useEffect(() => {
    if (isStorageLoaded && typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('taghers_session_user_v2', JSON.stringify(user));
      } else {
        localStorage.removeItem('taghers_session_user_v2');
      }
    }
  }, [user, isStorageLoaded]);

  useEffect(() => {
    if (isStorageLoaded && typeof window !== 'undefined') {
      if (coupon) {
        localStorage.setItem('taghers_coupon_v2', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('taghers_coupon_v2');
      }
    }
  }, [coupon, isStorageLoaded]);

  // Función Toast
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Carrito
  const addToCart = (product, size = recommendedSize || 'L', qty = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.size === size
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].qty += qty;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || (product.images && product.images[0]),
            size,
            qty
          }
        ];
      }
    });

    showToast(`"${product.name}" añadido al carrito (Talle ${size})`, 'success');
  };

  const removeFromCart = (id, size) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
    showToast('Prenda eliminada del carrito', 'info');
  };

  const updateCartQty = (id, size, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id && item.size === size) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cupón
  const applyCouponCode = (code) => {
    const trimmed = (code || '').trim().toUpperCase();
    if (trimmed === 'TAGHERS10' || trimmed === 'STREET10') {
      setCoupon({ code: trimmed, discountPercent: 10 });
      showToast('Cupón del 10% OFF aplicado correctamente', 'success');
      return true;
    } else {
      showToast('Código de cupón inválido o expirado', 'error');
      return false;
    }
  };

  const removeCouponCode = () => {
    setCoupon(null);
    showToast('Cupón de descuento removido', 'info');
  };

  // Wishlist
  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Eliminado de favoritos', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Prenda guardada en favoritos', 'success');
        return [...prev, productId];
      }
    });
  };

  // Autenticación
  const login = (email, password) => {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (found) {
      setUser(found);
      showToast(`Sesión iniciada como ${found.name}`, 'success');
      setIsAuthModalOpen(false);
      return true;
    } else {
      showToast('Correo o contraseña incorrectos', 'error');
      return false;
    }
  };

  const register = (name, email, password) => {
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      showToast('Este correo ya está registrado', 'error');
      return false;
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      password,
      phone: '',
      role: 'customer',
      createdAt: new Date().toISOString().split('T')[0],
      ordersCount: 0
    };
    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    showToast(`Cuenta registrada correctamente`, 'success');
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    showToast('Sesión cerrada correctamente', 'info');
  };

  // Reposición de Stock (Supervisor)
  const restockProduct = (productId, amount = 10) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = (p.stock || 0) + amount;
          showToast(`+${amount} unidades añadidas a "${p.name}". Stock actual: ${newStock}`, 'success');
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  // Crear Orden (Checkout)
  const createOrder = (orderData) => {
    const customerEmail = user?.email || orderData.email || `${orderData.name.toLowerCase().replace(/\s+/g, '')}@cliente.com`;
    const newOrder = {
      id: `TAG-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: orderData.name,
      email: customerEmail,
      userId: user?.id || null,
      phone: orderData.phone || '',
      items: [...cart],
      total: orderData.total,
      paymentMethod: orderData.paymentMethod || 'Tarjeta de Crédito',
      status: 'En preparación',
      date: new Date().toISOString().split('T')[0],
      address: `${orderData.address}, ${orderData.city}`
    };

    // Actualizar unidades vendidas y restar stock
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((item) => item.id === p.id);
        if (cartItem) {
          const remainingStock = Math.max(0, (p.stock || 0) - cartItem.qty);
          const newUnitsSold = (p.unitsSold || 0) + cartItem.qty;
          return { ...p, stock: remainingStock, unitsSold: newUnitsSold };
        }
        return p;
      })
    );

    // Sumar contador de órdenes al usuario
    if (user) {
      setUser((prev) => (prev ? { ...prev, ordersCount: (prev.ordersCount || 0) + 1 } : null));
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, ordersCount: (u.ordersCount || 0) + 1 } : u
        )
      );
    }

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setCoupon(null);
    return newOrder;
  };

  // Controladores de Modales
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const openSmartSizerModal = () => {
    setIsSmartSizerModalOpen(true);
  };

  const toggleSizeFilter = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearAllFilters = () => {
    setActiveCategory('todos');
    setSearchQuery('');
    setSelectedSizes([]);
    setMaxPrice(150000);
    setSortBy('featured');
  };

  const openTrackingModal = (code) => {
    if (code) setTrackingOrderCode(code);
    setIsTrackingModalOpen(true);
  };

  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: newProduct.id || `custom-${Date.now()}`,
      unitsSold: 0,
      stock: parseInt(newProduct.stock, 10) || 5,
      price: parseInt(newProduct.price, 10) || 45000,
      badge: newProduct.badge || "TAGHER'S NEW",
      image: newProduct.image || '/assets/models/hero_afro_model_white.jpg',
      images: [newProduct.image || '/assets/models/hero_afro_model_white.jpg'],
      description: newProduct.description || "Prenda de diseño streetwear TAGHER'S Archive 2026."
    };
    setProducts((prev) => [productWithId, ...prev]);
    showToast(`Prenda "${productWithId.name}" dada de alta en el catálogo`);
    return productWithId;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    showToast(`Pedido #${orderId} actualizado a: ${newStatus}`);
  };

  const openReceiptModal = (order) => {
    if (order) {
      setReceiptOrder(order);
    } else {
      setReceiptOrder(orders[0] || null);
    }
    setIsReceiptModalOpen(true);
  };

  const addOutfitBundle = (item1, item2, discountPercent = 15) => {
    if (!item1 || !item2) return;
    const discountedPrice1 = Math.round(item1.price * (1 - discountPercent / 100));
    const discountedPrice2 = Math.round(item2.price * (1 - discountPercent / 100));

    addToCart(
      { ...item1, price: discountedPrice1, name: `${item1.name} (Bundle)` },
      item1.sizes && item1.sizes.length > 0 ? item1.sizes[0] : 'L',
      1
    );
    addToCart(
      { ...item2, price: discountedPrice2, name: `${item2.name} (Bundle)` },
      item2.sizes && item2.sizes.length > 0 ? item2.sizes[0] : 'L',
      1
    );
    showToast(`¡Outfit completo añadido con ${discountPercent}% OFF!`, 'success');
    setIsCartOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        users,
        user,
        cart,
        wishlist,
        coupon,
        orders,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        selectedSizes,
        setSelectedSizes,
        maxPrice,
        setMaxPrice,
        toggleSizeFilter,
        clearAllFilters,
        isCartOpen,
        setIsCartOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isSmartSizerModalOpen,
        setIsSmartSizerModalOpen,
        isProductModalOpen,
        setIsProductModalOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isTrackingModalOpen,
        setIsTrackingModalOpen,
        trackingOrderCode,
        setTrackingOrderCode,
        openTrackingModal,
        isReceiptModalOpen,
        setIsReceiptModalOpen,
        receiptOrder,
        openReceiptModal,
        addOutfitBundle,
        addProduct,
        updateOrderStatus,
        selectedProduct,
        setSelectedProduct,
        recommendedSize,
        setRecommendedSize,
        toasts,
        showToast,
        removeToast,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        applyCouponCode,
        removeCouponCode,
        toggleWishlist,
        login,
        register,
        logout,
        restockProduct,
        createOrder,
        openProductModal,
        openSmartSizerModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
