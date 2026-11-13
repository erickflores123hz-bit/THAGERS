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
  const [users, setUsers] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taghers_users_v2');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return DEFAULT_USERS;
  });

  // Usuario Activo (Sesión)
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taghers_session_user_v2');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return null;
  });

  // Carrito de compras
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taghers_cart_v2');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [];
  });

  // Lista de Favoritos (Wishlist)
  const [wishlist, setWishlist] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taghers_wishlist_v2');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return ['hoodie-true-rel', 'vag-ecko'];
  });

  // Cupón de descuento
  const [coupon, setCoupon] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taghers_coupon_v2');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return null;
  });

  // Órdenes
  const [orders, setOrders] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taghers_orders_v2');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return DEFAULT_ORDERS;
  });

  // Filtros de navegación
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Modales
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSmartSizerModalOpen, setIsSmartSizerModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Prenda seleccionada para Modales
  const [selectedProduct, setSelectedProduct] = useState(INITIAL_PRODUCTS[0]);
  const [recommendedSize, setRecommendedSize] = useState('L');

  // Toasts de notificación
  const [toasts, setToasts] = useState([]);

  // Persistencia local
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('taghers_cart_v2', JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('taghers_wishlist_v2', JSON.stringify(wishlist));
    }
  }, [wishlist]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('taghers_users_v2', JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('taghers_orders_v2', JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('taghers_session_user_v2', JSON.stringify(user));
      } else {
        localStorage.removeItem('taghers_session_user_v2');
      }
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (coupon) {
        localStorage.setItem('taghers_coupon_v2', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('taghers_coupon_v2');
      }
    }
  }, [coupon]);

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
    const newOrder = {
      id: `TAG-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: orderData.name,
      email: user?.email || `${orderData.name.toLowerCase().replace(/\s+/g, '')}@cliente.com`,
      items: [...cart],
      total: orderData.total,
      paymentMethod: orderData.paymentMethod === 'card' ? 'Tarjeta de Crédito' : 'Mercado Pago',
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
