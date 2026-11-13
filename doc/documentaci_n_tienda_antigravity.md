# 🛒 E-Commerce Ropa — Documentación de Skills & Antigravity

> **Nota de uso:** Este archivo sirve como la *fuente de verdad* de tu e-commerce. Para pasarle contexto a Antigravity en el chat, usá el comando `@00-PROYECTO-ECOMMERCE-ROPA` (o `@` + el nombre del archivo donde lo guardes).

---

## 📌 1. Visión General del Proyecto
- **Tipo de Aplicación:** Tienda de ropa (E-commerce UI/UX responsive).
- **Framework Principal:** Antigravity.
- **Entorno de Documentación:** Obsidian (`.md`).
- **Objetivo Principal:** Crear un catálogo interactivo con filtro de talles/colores, carrito de compras persistente y flujo de checkout fluido.

---

## 🛠️ 2. Skills Activas del Proyecto (Stack & Convenciones)

### 🎨 Skill 1: UI/UX & Componentes de Indumentaria
* **Ficha de Producto:**
  - Selector dinámico de talles (XS, S, M, L, XL, XXL) con validación de stock disponible.
  - Galería de imágenes interactiva según el variante de color seleccionado.
  - Tabla / Modal desplegable con la "Guía de Talles".
* **Catálogo & Filtros:**
  - Filtrado por Categoría (Remeras, Pantalones, Camperas, Accesorios).
  - Ordenamiento por precio y novedades.

### 🛒 Skill 2: Gestión de Estado del Carrito
* **Persistencia:** Guardado local para que el carrito no se pierda al refrescar la página.
* **Acciones obligatorias del carrito:**
  - `AGREGAR_ITEM`: Valida que el producto tenga talle y color seleccionados.
  - `MODIFICAR_CANTIDAD`: Suma/resta elementos en tiempo real.
  - `ELIMINAR_ITEM`: Remueve del listado.
  - `CALCULAR_TOTAL`: Suma subtotales, descuenta cupones y calcula costo de envío.

### 💳 Skill 3: Integraciones Backend & Checkout
* **Conexión de Pasarela de Pago:** Integración limpia de checkout (ej. Mercado Pago).
* **Cálculo de Envíos:** Entrada de Código Postal (CP) para estimación de costo y tiempos.
* **Formulario de Datos:** Captura de datos de envío y facturación con validaciones estándar.

---

## 📁 3. Estructura de Carpetas Recomendada en Antigravity

```text
mi-tienda-ropa/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx / .vue / .html
│   │   ├── ProductCard.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── SizeGuideModal.jsx
│   │   ├── CartDrawer.jsx
│   │   └── CheckoutForm.jsx
│   ├── context/ (o store/)
│   │   └── CartContext.js
│   └── views/
│       ├── Home.jsx
│       ├── Catalog.jsx
│       └── Checkout.jsx
└── docs/
    └── 00-PROYECTO-ECOMMERCE-ROPA.md  <-- (Este archivo en Obsidian)
```

---

## 📝 4. Registro de Estado y Tareas (Changelog & Roadmap)

### 🔲 Pendientes (Roadmap de Tareas)
- [ ] Implementar la maquetación de la tarjeta de producto (`ProductCard`).
- [ ] Desarrollar la lógica del carrito de compras (`CartContext`).
- [ ] Crear el modal de Guía de Talles.
- [ ] Configurar la integración del checkout de pago.
- [ ] Probar la navegación adaptativa en dispositivos móviles.

### ✅ Completado
- [x] Configuración inicial del proyecto con Antigravity.
- [x] Estructuración de la documentación técnica en Obsidian.

---

## 🤖 5. Prompts Rápidos usando `@` para Antigravity

Copia y pega estos comandos en el chat del entorno para indicarle tareas precisas:

1. **Crear componentes de la tienda:**
   > *"@00-PROYECTO-ECOMMERCE-ROPA Leé la **Skill 1** de esta nota y armame el componente `ProductCard` con el selector de talle y el botón de agregar al carrito."*

2. **Crear la lógica del carrito:**
   > *"@00-PROYECTO-ECOMMERCE-ROPA Según lo documentado en la **Skill 2**, implementá la función para calcular el total del carrito incluyendo descuento y envío."*

3. **Revisión de arquitectura:**
   > *"@00-PROYECTO-ECOMMERCE-ROPA Revisá la **Estructura de Carpetas** y decime qué componente deberíamos construir ahora según la lista de tareas pendientes."*
