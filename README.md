# TAGHER'S — Streetwear Archive 2026 🛹🔥

Tienda online moderna de moda urbana y ropa streetwear vintage (Baggy & Y2K Revolution) con Probador Virtual con IA y panel de administración en la nube.

---

## 🌟 Características Principales

1. **Hero Runway "Scroll-Expand"**:
   - Inspirado en la animación oficial de *ReactBits Scroll-Expand*.
   - Presenta un modelo editorial fotorrealista de alta definición con rastas y cadena de plata, en una estética minimalista y limpia.
   - Expansión interactiva a pantalla completa al hacer scroll.

2. **Probador Virtual con IA (Virtual Try-On AR)**:
   - Activación de cámara en vivo vía webcam o subida de fotografía.
   - Ajuste de prendas en tiempo real con controles de escala, posición y opacidad.
   - Captura de fotos con descarga instantánea del outfit en formato PNG.

3. **Catálogo Completo de Prendas Reales**:
   - **Vaqueros Baggy**: Ecko Unltd con bordados de rinocerontes y coronas, Southpole 90s vintage stone-wash, True Religion Super-T whisker wash.
   - **Camisetas & Polos**: Affliction Style Cyber Gothic Wings, Jersey Arsenal Fly Emirates 2012 (Blokecore), Chomba Polo Skate Y2K.
   - **Sudaderas & Camperas**: True Religion Crimson Gothic 'REL' Zip Hoodie, Retro 90s Three-Stripe Navy Track Jacket, Puffers tácticos.
   - **Accesorios**: Cadenas cubanas, cadenas para pantalón skate y anillos grunge.

4. **Panel de Supervisión y Base de Datos**:
   - Acceso seguro exclusivo para administradores (`admin@taghers.com`).
   - Métricas en tiempo real: total de ventas, ingresos generados, producto más vendido y alertas de bajo stock.
   - Conexión dual: persistencia local en `database.json` y sincronización con PostgreSQL en **Supabase**.

5. **Carrito y Checkout**:
   - Drawer lateral interactivo con selección de talles y cupones de descuento.
   - Pasarela de compra simulada con generación de ticket de orden (`#TAG-XXXX`).

---

## 🚀 Instalación y Uso Local

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión 16 o superior)

### Ejecutar el servidor
```bash
# Iniciar servidor local
node server.js
```
Abre tu navegador en: **`http://localhost:3000`**

---

## 📁 Estructura del Proyecto

```text
├── assets/                  # Imágenes oficiales de prendas y modelos
│   ├── garments/           # Fotos de prendas reales (PNG / JPG)
│   └── models/             # Fotos de modelos y lookbook
├── doc/                     # Documentación técnica y notas del proyecto
├── index.html               # Maquetación principal de la tienda
├── styles.css               # Estilos y animaciones (brutalismo / streetwear)
├── app.js                   # Lógica de la app, carrito, probador y filtros
├── server.js                # Servidor HTTP Node.js y API REST
├── database.json            # Base de datos local
├── supabaseClient.js        # Conector a Supabase (PostgreSQL Cloud)
├── supabase_schema.sql      # Script de estructura y políticas de tablas
└── package.json             # Metadatos del proyecto
```

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5 Semántico, CSS3 Moderno (CSS Grid & Flexbox), JavaScript ES6+
- **Backend**: Node.js HTTP Server nativo (cero dependencias externas para máxima portabilidad)
- **Base de Datos**: Supabase (PostgreSQL Cloud) + JSON Store local
- **Iconos & Tipografías**: FontAwesome 6, Google Fonts (Syne, Clash Display, Space Grotesk)
